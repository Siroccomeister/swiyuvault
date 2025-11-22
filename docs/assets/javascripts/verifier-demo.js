// ========================================
// VERIFIER DEMO - SIMPLIFIED VERSION
// ========================================

const PROXY_URL = 'https://proxy-cors-azure.vercel.app/api/proxy';
let verificationId = null;
let pollTimer = null;

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

async function init() {
  console.log('🚀 Init verifier demo');
  
  try {
    const config = window.VERIFIER_CONFIG;
    if (!config || !config.verifier_url) throw new Error('Config missing');
    
    // Create verification
    const data = await callAPI('POST', '/management/api/verifications', {
      accepted_issuer_dids: [config.issuer_did],
      presentation_definition: {
        id: 'v-' + Date.now(),
        input_descriptors: [{
          id: 'member',
          format: { 'vc+sd-jwt': { 'sd-jwt_alg_values': ['ES256'], 'kb-jwt_alg_values': ['ES256'] }},
          constraints: { fields: [
            { path: ['$.vct'], filter: { type: 'string', const: config.credential_type }},
            { path: ['$.firstName'] },
            { path: ['$.lastName'] },
            { path: ['$.birthDate'] },
            { path: ['$.membershipClass'] }
          ]}
        }]
      }
    });
    
    verificationId = data.id;
    console.log('✅ Created:', verificationId);
    
    // Update UI
    updateEl('verification-id', verificationId);
    updateEl('request-uri', data.verification_url);
    showQR(data.verification_deeplink);
    
    // Start polling
    poll(config);
    
  } catch (e) {
    console.error('❌ Init failed:', e);
    showError('Init failed: ' + e.message);
  }
}

// API helper
async function callAPI(method, path, body) {
  const config = window.VERIFIER_CONFIG;
  const targetUrl = config.verifier_url + path;
  
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Target-URL': targetUrl
    }
  };
  
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(PROXY_URL, options);
  if (!response.ok) throw new Error('API ' + response.status);
  return response.json();
}


// QR code display
function showQR(deeplink) {
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(deeplink);
  const img = document.getElementById('verification-qr');
  
  img.onload = function() {
    document.getElementById('qr-loading').style.display = 'none';
    img.style.display = 'block';
  };
  
  img.src = qrUrl;
  
  // Show and set deep link button
  const btn = document.getElementById('deeplink-button');
  if (btn) {
    btn.href = deeplink;
    btn.style.display = 'inline-block';
  }
}


// Status polling
function poll(config) {
  console.log('🔄 Polling every ' + config.refresh_interval + 'ms');
  
  pollTimer = setInterval(async function() {
    try {
      const data = await callAPI('GET', '/management/api/verifications/' + verificationId);
      
      updateEl('verification-state', data.state);
      updateStatus(data.state);
      
      if (data.state === 'SUCCESS' || data.state === 'COMPLETED') {
        clearInterval(pollTimer);
        console.log('✅ Completed!');
        showSuccess(data);
      } else if (data.state === 'FAILED') {
        clearInterval(pollTimer);
        showError('Verification failed');
      }
    } catch (e) {
      console.error('Poll error:', e);
    }
  }, config.refresh_interval);
}

// Status message
function updateStatus(state) {
  const msgs = {
    'PENDING': 'Listening for presentations...',
    'IN_PROGRESS': 'Processing credential...',
    'SUCCESS': 'Verification successful!',
    'COMPLETED': 'Verification successful!',
    'FAILED': 'Verification failed'
  };
  updateEl('status-message', msgs[state] || state);
}

// Success display
function showSuccess(data) {
  // Extract claims (try different paths)
  let claims = {};
  
  // ✅ First check wallet_response (Swiyu verifier format)
  if (data.wallet_response && data.wallet_response.credential_subject_data) {
    claims = data.wallet_response.credential_subject_data;
  }
  // Fallback to other possible structures
  else if (data.claims) {
    claims = data.claims;
  } else if (data.presentation && data.presentation.verifiableCredential) {
    const vc = Array.isArray(data.presentation.verifiableCredential) 
      ? data.presentation.verifiableCredential[0] 
      : data.presentation.verifiableCredential;
    claims = vc.credentialSubject || vc.claims || {};
  } else if (data.vp_token) {
    claims = data.vp_token.claims || data.vp_token;
  }
  
  console.log('📋 Claims:', claims);
  console.log('📋 Full ', data);
  
  // Update UI
  updateEl('user-name', (claims.firstName || '') + ' ' + (claims.lastName || ''));
  updateEl('birth-date', claims.birthDate || 'N/A');
  updateEl('membership-class', claims.membershipClass || 'Member');
  updateEl('verified-time', new Date().toLocaleString());
  
  switchState('verified-state');
  console.log('%c🎉 SUCCESS! 🎉', 'font-size: 20px; color: green; font-weight: bold;');
}

// Error display
function showError(msg) {
  updateEl('error-message', msg);
  switchState('error-state');
}

// State switcher
function switchState(activeId) {
  const states = document.querySelectorAll('.demo-state');
  for (let i = 0; i < states.length; i++) {
    states[i].classList.remove('active');
  }
  document.getElementById(activeId).classList.add('active');
}

// Helper to update text
function updateEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// Reset button
document.addEventListener('click', function(e) {
  if (e.target.id === 'reset-demo' || e.target.id === 'retry-demo') {
    if (pollTimer) clearInterval(pollTimer);
    location.reload();
  }
});
