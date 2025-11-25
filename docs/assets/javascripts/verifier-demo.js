// ========================================
// VERIFIER DEMO - SIMPLIFIED & CONFIG-DRIVEN
// ========================================

let verificationId = null;
let pollTimer = null;

document.addEventListener('DOMContentLoaded', init);

async function init() {
  console.log('🚀 Init verifier demo');
  
  const config = window.VERIFIER_CONFIG;
  if (!config?.verifier_url) {
    showError('Configuration missing');
    return;
  }
  
  try {
    const data = await callAPI('POST', '/management/api/verifications', {
      accepted_issuer_dids: [config.issuer_did],
      presentation_definition: {
        id: 'v-' + Date.now(),
        input_descriptors: [{
          id: 'member',
          format: { 
            'vc+sd-jwt': { 
              'sd-jwt_alg_values': ['ES256'], 
              'kb-jwt_alg_values': ['ES256'] 
            }
          },
          constraints: { 
            fields: [
              { path: ['$.vct'], filter: { type: 'string', const: config.credential_type }},
              { path: ['$.firstName'] },
              { path: ['$.lastName'] },
              { path: ['$.birthDate'] },
              { path: ['$.membershipClass'] }
            ]
          }
        }]
      }
    });
    
    verificationId = data.id;
    console.log('✅ Created:', verificationId);
    
    updateEl('verification-id', verificationId);
    updateEl('request-uri', data.verification_url);
    showQR(data.verification_deeplink);
    poll(config);
    
  } catch (e) {
    console.error('❌ Init failed:', e);
    showError('Init failed: ' + e.message);
  }
}

async function callAPI(method, path, body) {
  const config = window.VERIFIER_CONFIG;
  const proxyUrl = config.vc_proxy_url;
  const targetUrl = config.verifier_url + path;
  
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Target-URL': targetUrl
    }
  };
  
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(proxyUrl, options);
  if (!response.ok) throw new Error('API ' + response.status);
  return response.json();
}

function showQR(deeplink) {
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(deeplink);
  const img = document.getElementById('verification-qr');
  
  img.onload = function() {
    document.getElementById('qr-loading').style.display = 'none';
    img.style.display = 'block';
  };
  
  img.src = qrUrl;
  
  const btn = document.getElementById('deeplink-button');
  if (btn) {
    btn.href = deeplink;
    btn.style.display = 'inline-block';
  }
}

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

function showSuccess(data) {
  let claims = data.wallet_response?.credential_subject_data 
    || data.claims 
    || data.presentation?.verifiableCredential?.[0]?.credentialSubject 
    || data.vp_token?.claims 
    || {};
  
  console.log('📋 Claims:', claims);
  
  updateEl('user-name', (claims.firstName || '') + ' ' + (claims.lastName || ''));
  updateEl('birth-date', claims.birthDate || 'N/A');
  updateEl('membership-class', claims.membershipClass || 'Member');
  updateEl('verified-time', new Date().toLocaleString());
  
  switchState('verified-state');
  console.log('%c🎉 SUCCESS! 🎉', 'font-size: 20px; color: green; font-weight: bold;');
}

function showError(msg) {
  updateEl('error-message', msg);
  switchState('error-state');
}

function switchState(activeId) {
  document.querySelectorAll('.demo-state').forEach(el => el.classList.remove('active'));
  document.getElementById(activeId)?.classList.add('active');
}

function updateEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

document.addEventListener('click', function(e) {
  if (e.target.id === 'reset-demo' || e.target.id === 'retry-demo') {
    if (pollTimer) clearInterval(pollTimer);
    location.reload();
  }
});

console.log('✅ Verifier demo loaded');
