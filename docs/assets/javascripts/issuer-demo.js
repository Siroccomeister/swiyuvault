// ========================================
// ISSUER DEMO - BUTTON INITIATED VERSION
// ========================================

let demoActive = false;

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Issuer demo ready');
  
  const startBtn = document.getElementById('start-demo-btn');
  const demoContent = document.getElementById('demo-content');
  const healthStatus = document.getElementById('health-status');
  
  if (startBtn && demoContent) {
    demoContent.style.display = 'none';  // Hide demo content
    startBtn.style.display = 'block';     // Show button
    
    startBtn.onclick = function() {
      startDemo();
    };
  }
});


async function startDemo() {
  const startBtn = document.getElementById('start-demo-btn');
  const form = document.getElementById('vc-form');
  const healthStatus = document.getElementById('health-status');
  
  // Show checking status
  if (healthStatus) {
    healthStatus.innerHTML = '<p>🔄 Checking services...</p>';
    healthStatus.style.display = 'block';
  }
  
  if (startBtn) startBtn.disabled = true;
  
  // Run health check
  const servicesOk = await checkServices();
  
  if (!servicesOk) {
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.textContent = '🔄 Retry Demo';
    }
    return;
  }
  
  // Services OK - show form
  if (startBtn) startBtn.style.display = 'none';
  
// Show entire demo content (form + steps)
  const demoContent = document.getElementById('demo-content');
  if (demoContent) demoContent.style.display = 'block';

  
  demoActive = true;
  initializeForm();
}

async function checkServices() {
  const config = window.ZENSICAL_CONFIG || {};
  const proxyUrl = config.vc_proxy_url || 'https://proxy-cors-azure.vercel.app/api/proxy';
  const issuerUrl = config.issuer_url || 'https://issuer.atarigo.net';
  const statusDiv = document.getElementById('health-status');
  
  const results = [];
  
  try {
    // Check proxy
    try {
      await fetch(proxyUrl, { method: 'OPTIONS', cache: 'no-cache' });
      results.push({ name: 'CORS Proxy', message: '✅ UP', ok: true });
    } catch (e) {
      results.push({ name: 'CORS Proxy', message: '❌ Down', ok: false });
    }
    
    // Check issuer
    try {
      const resp = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Target-URL': issuerUrl + '/actuator/health'
        },
        cache: 'no-cache'
      });
      
      if (resp.ok) {
        const data = await resp.json();
        const isHealthy = data.status === 'UP';
        results.push({ 
          name: 'Issuer Service', 
          message: isHealthy ? '✅ UP' : `⚠️ ${data.status}`, 
          ok: isHealthy 
        });
      } else {
        results.push({ name: 'Issuer Service', message: `❌ HTTP ${resp.status}`, ok: false });
      }
    } catch (e) {
      results.push({ name: 'Issuer Service', message: '❌ Unreachable', ok: false });
    }
    
    const allOk = results.every(r => r.ok);
    
    // Display results
    let html = '<p><strong>' + (allOk ? '✅' : '❌') + ' Service Status</strong></p>';
    html += '<ul style="margin-top:10px;">';
    results.forEach(r => {
      html += '<li><strong>' + r.name + '</strong>: ' + r.message + '</li>';
    });
    html += '</ul>';
    
    if (!allOk) {
      html += '<p style="color:#d32f2f;margin-top:10px;">⚠️ Some services are unavailable. Please try again.</p>';
    }
    
    if (statusDiv) statusDiv.innerHTML = html;
    
    return allOk;
    
  } catch (e) {
    if (statusDiv) statusDiv.innerHTML = '<p>❌ Health check failed</p>';
    return false;
  }
}

function initializeForm() {
  const config = window.ZENSICAL_CONFIG || {};

  // Helper functions
  function formatDateDDMMYYYY(dateStr) {
    if (!dateStr || dateStr.length < 10) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
  }

  function parseDateYYYYMMDD(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 2) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  }

  function padDate(dtStr) {
    if (!dtStr) return '';
    if (dtStr.length === 16) return dtStr + ":00Z";
    if (dtStr.length === 19) return dtStr + "Z";
    return dtStr;
  }

  // Get form elements
  const firstNameEl = document.getElementById('firstName');
  const lastNameEl = document.getElementById('lastName');
  const birthDateEl = document.getElementById('birthDate');
  const membershipEl = document.getElementById('membershipClass');
  const validFromEl = document.getElementById('validFrom');
  const validUntilEl = document.getElementById('validUntil');
  const statusListEl = document.getElementById('statusList');

  // Set placeholders and defaults
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
  if (membershipEl && config.membership_options) {
    membershipEl.innerHTML = '';
    config.membership_options.forEach(option => {
      const optEl = document.createElement('option');
      optEl.value = option;
      optEl.textContent = option;
      membershipEl.appendChild(optEl);
    });
    membershipEl.value = config.default_class || "Platinum";
  }

  // Set readonly fields
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

  // Auto-clear default values on focus
  [firstNameEl, lastNameEl].forEach(el => {
    if (el) {
      el.addEventListener('focus', function() {
        if (this.id === 'firstName' && this.value === (config.default_name || '')) {
          this.value = '';
        } else if (this.id === 'lastName' && this.value === (config.default_last || '')) {
          this.value = '';
        }
      });
    }
  });

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
      credential_meta: {
         "vct#integrity": "sha256-0000000000000000000000000000000000000000000="
      },
      offer_validity_seconds: 86400,
      credential_valid_until: padDate(validUntilEl ? validUntilEl.value : ''),
      credential_valid_from: padDate(validFromEl ? validFromEl.value : ''),
      status_lists: [statusListEl ? statusListEl.value : '']
    };

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

    // Check for valid offer
    const qrDiv = document.getElementById('qr-div');
    if (!qrDiv) return;

    if (!offerRaw) {
      qrDiv.innerHTML = `<p>🚨 No credential_offer found in response.</p>`;
      return;
    }

    // Build full deep link
    const offerDeeplink = `openid-credential-offer://?credential_offer=${offerRaw}`;

    // Build instruction text
    const instructionText = document.createElement('p');
    instructionText.style.textAlign = 'center';
    instructionText.style.marginTop = '0';
    instructionText.style.marginBottom = '10px';
    instructionText.textContent = '✅ Scan this QR with SWIYU wallet:';

    // Build QR code container
    const qrContainer = document.createElement('div');
    qrContainer.id = 'qr-code-container';

    // Build deep link button
    const deepLinkWrapper = document.createElement('div');
    deepLinkWrapper.style.textAlign = 'center';
    deepLinkWrapper.style.marginTop = '15px';

    const deepLinkButton = document.createElement('a');
    deepLinkButton.href = offerDeeplink;
    deepLinkButton.className = 'deep-link-button';
    deepLinkButton.textContent = '📱 or open in SWIYU Wallet';
    deepLinkButton.target = '_blank';
    deepLinkButton.style.textDecoration = 'none';

    deepLinkWrapper.appendChild(deepLinkButton);

    // Clear and rebuild QR section
    qrDiv.innerHTML = '';
    qrDiv.appendChild(instructionText);
    qrDiv.appendChild(qrContainer);
    qrDiv.appendChild(deepLinkWrapper);

    // Load QRCode library and generate
    if (typeof QRCode === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      script.onload = () => {
        new QRCode(qrContainer, {
          text: offerDeeplink,
          width: 256,
          height: 256
        });
      };
      script.onerror = () => {
        qrContainer.innerHTML = '<p style="color:red;">⚠️ Failed to load QR library</p>';
      };
      document.head.appendChild(script);
    } else {
      new QRCode(qrContainer, {
        text: offerDeeplink,
        width: 256,
        height: 256
      });
    }
  };
}

console.log('✅ Issuer demo loaded');
