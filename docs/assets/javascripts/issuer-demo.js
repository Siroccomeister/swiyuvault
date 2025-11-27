// ========================================
// ISSUER DEMO - SIMPLIFIED & CONFIG-DRIVEN
// ========================================

let demoActive = false;

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Issuer demo ready');
  
  const startBtn = document.getElementById('start-demo-btn');
  const demoContent = document.getElementById('demo-content');
  
  if (startBtn && demoContent) {
    demoContent.style.display = 'none';
    startBtn.style.display = 'block';
    startBtn.onclick = startDemo;
  }
});

async function startDemo() {
  const startBtn = document.getElementById('start-demo-btn');
  const healthStatus = document.getElementById('health-status');
  
  if (healthStatus) {
    healthStatus.innerHTML = '<p>🔄 Checking services...</p>';
    healthStatus.style.display = 'block';
  }
  
  if (startBtn) startBtn.disabled = true;
  
  const servicesOk = await checkServices();
  
  if (!servicesOk) {
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.textContent = '🔄 Retry Demo';
    }
    return;
  }
  
  if (startBtn) startBtn.style.display = 'none';
  
  const demoContent = document.getElementById('demo-content');
  if (demoContent) demoContent.style.display = 'block';
  
  demoActive = true;
  initializeForm();
}

async function checkServices() {
  const config = window.ZENSICAL_CONFIG || {};
  const proxyBase = (config.vc_proxy_url || '').replace('/api/proxy', '');
  const statusDiv = document.getElementById('health-status');
  
  try {
    const resp = await fetch(proxyBase + '/api/health', {
      method: 'GET',
      cache: 'no-cache'
    });
    
    if (!resp.ok) throw new Error('Health check failed');
    
    const health = await resp.json();
    
    const results = [
      { 
        name: 'CORS Proxy', 
        message: health.services.proxy === 'up' ? '✅ UP' : '❌ Down', 
        ok: health.services.proxy === 'up' 
      },
      { 
        name: 'Issuer Service', 
        message: health.services.issuer === 'UP' ? '✅ UP' : `❌ ${health.services.issuer}`, 
        ok: health.services.issuer === 'UP' 
      }
    ];
    
    const allOk = results.every(r => r.ok);
    
    let html = '<p><strong>' + (allOk ? '✅' : '❌') + ' Service Status</strong></p>';
    html += '<ul style="margin-top:10px;">';
    results.forEach(r => html += '<li><strong>' + r.name + '</strong>: ' + r.message + '</li>');
    html += '</ul>';
    
    if (!allOk) {
      html += '<p style="color:#d32f2f;margin-top:10px;">⚠️ Some services are unavailable. Please try again.</p>';
    }
    
    if (statusDiv) statusDiv.innerHTML = html;
    return allOk;
    
  } catch (e) {
    if (statusDiv) statusDiv.innerHTML = '<p>❌ Health check failed: ' + e.message + '</p>';
    return false;
  }
}

function initializeForm() {
  const config = window.ZENSICAL_CONFIG || {};
  
  // Helper functions
  function formatDateDDMMYYYY(dateStr) {
    if (!dateStr || dateStr.length < 10) return dateStr;
    const parts = dateStr.split('-');
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
  }

  function parseDateYYYYMMDD(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return (parts.length === 3 && parts[0].length === 2) ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
  }

  function padDate(dtStr) {
    if (!dtStr) return '';
    if (dtStr.length === 16) return dtStr + ":00Z";
    if (dtStr.length === 19) return dtStr + "Z";
    return dtStr;
  }

  function setField(id, value, placeholder, readonly = false) {
    const el = document.getElementById(id);
    if (!el) return;
    if (value) el.value = value;
    if (placeholder) el.placeholder = placeholder;
    if (readonly) {
      el.readOnly = true;
      el.style.backgroundColor = '#f0f0f0';
    }
  }

  // Set form fields from config
  setField('firstName', config.default_name, config.placeholder_firstname);
  setField('lastName', config.default_last, config.placeholder_lastname);
  setField('birthDate', '', config.placeholder_birthdate);
  setField('validFrom', config.default_valid_from, '', true);
  setField('validUntil', config.default_valid_to, '', true);
  setField('statusList', config.status_list_url, '', true);

  // Populate membership dropdown
  const membershipEl = document.getElementById('membershipClass');
  if (membershipEl && config.membership_options) {
    membershipEl.innerHTML = '';
    config.membership_options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      membershipEl.appendChild(opt);
    });
    membershipEl.value = config.default_class || 'Platinum';
  }

  // Auto-clear defaults on focus
  ['firstName', 'lastName'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('focus', function() {
        const defaultVal = id === 'firstName' ? config.default_name : config.default_last;
        if (this.value === defaultVal) this.value = '';
      });
    }
  });

  // Form submit handler
  const form = document.getElementById('vc-form');
  if (!form) return;

  form.onsubmit = async function(event) {
    event.preventDefault();

    const payload = {
      metadata_credential_supported_id: ["my-test-vc"],
      credential_subject_data: {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        birthDate: parseDateYYYYMMDD(document.getElementById('birthDate')?.value || ''),
        membershipClass: document.getElementById('membershipClass')?.value || 'Platinum'
      },
      credential_meta: {
        "vct#integrity": "sha256-0000000000000000000000000000000000000000000="
      },
      offer_validity_seconds: 86400,
      credential_valid_until: padDate(document.getElementById('validUntil')?.value || ''),
      credential_valid_from: padDate(document.getElementById('validFrom')?.value || ''),
      status_lists: [document.getElementById('statusList')?.value || '']
    };

    const targetUrl = config.issuer_url + "/management/api/credentials";
    
    // Display cURL
    const curlEl = document.getElementById('curl-command');
    if (curlEl) {
      curlEl.textContent = `curl -X POST '${config.vc_proxy_url}' \\\n  -H 'Content-Type: application/json' \\\n  -H 'Target-URL: ${targetUrl}' \\\n  -d '${JSON.stringify(payload).replace(/\n/g, '')}'`;
    }

    // Call API
    let respData;
    try {
      const resp = await fetch(config.vc_proxy_url, {
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

    // Extract and display credential offer
    let offerRaw = '';
    if (respData?.offer_deeplink) {
      const match = respData.offer_deeplink.match(/credential_offer=([^&]+)/);
      if (match?.[1]) offerRaw = decodeURIComponent(match[1]);
    } else if (respData?.credential_offer) {
      offerRaw = respData.credential_offer;
    }

    const qrDiv = document.getElementById('qr-div');
    if (!qrDiv) return;

    if (!offerRaw) {
      qrDiv.innerHTML = `<p>🚨 No credential_offer found in response.</p>`;
      return;
    }

    const offerDeeplink = `openid-credential-offer://?credential_offer=${encodeURIComponent(offerRaw)}`;


    qrDiv.innerHTML = `
      <p style="text-align:center;margin-top:0;margin-bottom:10px;">✅ Scan this QR with SWIYU wallet:</p>
      <div id="qr-code-container"></div>
      <div style="text-align:center;margin-top:15px;">
        <a href="${offerDeeplink}" class="deep-link-button" target="_blank" style="text-decoration:none;">📱 or open in SWIYU Wallet</a>
      </div>
    `;

    // Generate QR code
    const qrContainer = document.getElementById('qr-code-container');
    if (typeof QRCode === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      script.onload = () => new QRCode(qrContainer, { text: offerDeeplink, width: 256, height: 256 });
      script.onerror = () => qrContainer.innerHTML = '<p style="color:red;">⚠️ Failed to load QR library</p>';
      document.head.appendChild(script);
    } else {
      new QRCode(qrContainer, { text: offerDeeplink, width: 256, height: 256 });
    }
  };
}

console.log('✅ Issuer demo loaded');
