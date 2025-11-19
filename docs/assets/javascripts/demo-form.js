document$.subscribe(function() {
  const config = window.ZENSICAL_CONFIG || {};

  // Helper: Convert YYYY-MM-DD to DD-MM-YYYY
  function formatDateDDMMYYYY(dateStr) {
    if (!dateStr || dateStr.length < 10) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
  }

  // Helper: Convert DD-MM-YYYY back to YYYY-MM-DD for API
  function parseDateYYYYMMDD(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 2) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  }

  // Set placeholders for text inputs
  const firstNameEl = document.getElementById('firstName');
  const lastNameEl = document.getElementById('lastName');
  const birthDateEl = document.getElementById('birthDate');

  if (firstNameEl) {
    firstNameEl.placeholder = config.placeholder_firstname || "Enter your first name";
    firstNameEl.value = config.default_name || "";
  }

  if (lastNameEl) {
    lastNameEl.placeholder = config.placeholder_lastname || "Enter your last name";
    lastNameEl.value = config.default_last || "";
  }

  if (birthDateEl) {
    birthDateEl.placeholder = config.placeholder_birthdate || "DD-MM-YYYY";
  }

  // Populate membership dropdown
  const membershipEl = document.getElementById('membershipClass');
  if (membershipEl && config.membership_options) {
    config.membership_options.forEach(option => {
      const optEl = document.createElement('option');
      optEl.value = option;
      optEl.textContent = option;
      membershipEl.appendChild(optEl);
    });
    membershipEl.value = config.default_class || "Platinum";
  }

  // Set grey-out (readonly) fields with formatted dates
  const validFromEl = document.getElementById('validFrom');
  const validUntilEl = document.getElementById('validUntil');
  const statusListEl = document.getElementById('statusList');

  if (validFromEl) {
    validFromEl.value = config.default_valid_from || "";
    validFromEl.readOnly = true;
    validFromEl.style.backgroundColor = '#f0f0f0';
  }

  if (validUntilEl) {
    validUntilEl.value = config.default_valid_to || "";
    validUntilEl.readOnly = true;
    validUntilEl.style.backgroundColor = '#f0f0f0';
  }

  if (statusListEl) {
    statusListEl.value = config.status_list_url || "";
    statusListEl.readOnly = true;
    statusListEl.style.backgroundColor = '#f0f0f0';
  }

  // Clear placeholder text on focus (optional refinement)
  [firstNameEl, lastNameEl, birthDateEl].forEach(el => {
    if (el) {
      el.addEventListener('focus', function() {
        if (this.value === this.defaultValue || this.value === config['default_' + this.id.replace(/^(first|last)Name$/, match => match === 'firstName' ? 'name' : 'last')]) {
          this.value = '';
        }
      });
    }
  });

  // Helper: pad datetime to ISO-8601 with Z
  function padDate(dtStr) {
    if (!dtStr) return '';
    if (dtStr.length === 16) return dtStr + ":00Z";
    if (dtStr.length === 19) return dtStr + "Z";
    return dtStr;
  }

  // Lazy-load QRCode library
  function loadQRCodeLibrary() {
    return new Promise((resolve, reject) => {
      if (window.QRCode) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load QRCode library'));
      document.head.appendChild(script);
    });
  }

  // Form submit handler
  const form = document.getElementById('vc-form');
  if (!form) return;

  form.onsubmit = async function(event) {
    event.preventDefault();

    const endpoint = config.vc_proxy_url;
    const birthDateInput = birthDateEl ? birthDateEl.value : '';
    const birthDateAPI = parseDateYYYYMMDD(birthDateInput);

    const payload = {
      metadata_credential_supported_id: ["my-test-vc"],
      credential_subject_data: {
        firstName: firstNameEl ? firstNameEl.value : '',
        lastName: lastNameEl ? lastNameEl.value : '',
        birthDate: birthDateAPI,
        membershipClass: membershipEl ? membershipEl.value : 'Platinum'
      },
      credential_metadata: {
         "vct#integrity": "sha256-0000000000000000000000000000000000000000000="
      },
      offer_validity_seconds: 86400,
      credential_valid_until: padDate(validUntilEl ? validUntilEl.value : ''),
      credential_valid_from: padDate(validFromEl ? validFromEl.value : ''),
      status_lists: [statusListEl ? statusListEl.value : '']
    };

    // Get the issuer URL from window config
    // const config = window.ZENSICAL_CONFIG;
    const targetUrl = config.issuer_url + "/management/api/credentials";
        
    // Display cURL
    const curlEl = document.getElementById('curl-command');
    if (curlEl) {
      curlEl.textContent = `curl -X POST '${endpoint}' \\\n  -H 'Content-Type: application/json' \\\n  -H 'Target-URL: ${targetUrl}' \\\n  -d '${JSON.stringify(payload).replace(/\n/g, '')}'`;
    }

    
    // Call API
    let respData;
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Target-URL': targetUrl
        },
        body: JSON.stringify(payload)
      });
      const text = await resp.text();
      respData = text ? JSON.parse(text) : {};
    } catch (err) {
      const rawEl = document.getElementById('raw-response');
      if (rawEl) rawEl.textContent = `🚨 Error calling API: ${err.message}`;
      return;
    }

    // Display raw response
    const rawEl = document.getElementById('raw-response');
    if (rawEl) rawEl.textContent = JSON.stringify(respData, null, 2);

    // Extract credential offer
    let offerRaw = '';
    if (respData && typeof respData === 'object') {
      if (respData.offer_deeplink) {
        const match = respData.offer_deeplink.match(/credential_offer=([^&]+)/);
        if (match && match[1]) offerRaw = decodeURIComponent(match[1]);
      } else if (respData.credential_offer) {
        offerRaw = respData.credential_offer;
      }
    }

    // Generate QR
    const qrDiv = document.getElementById('qr-div');
    if (!qrDiv) return;

    if (!offerRaw) {
      qrDiv.innerHTML = `<p>🚨 No credential_offer found in response.</p>`;
      return;
    }

    const qrUri = `openid-credential-offer://?credential_offer=${offerRaw}`;
    qrDiv.innerHTML = `
      <p style="text-align: center;">✅ Scan this QR with SWIYU wallet:</p>
      <div id="qr-code-container"></div>
    `;

    // Load QRCode library on-demand, then generate
    try {
      await loadQRCodeLibrary();
      const qrContainer = document.getElementById('qr-code-container');
      new QRCode(qrContainer, {
        text: qrUri,
        width: 256,
        height: 256
      });
    } catch (err) {
      console.error(err);
      qrDiv.innerHTML += `<p>⚠️ Failed to load QR library</p>`;
    }
  };
});
