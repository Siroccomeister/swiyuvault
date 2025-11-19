---
template: demo-verifier.html
icon: lucide/shield-check
title: Verifier Demo
---

# Issuer workflow : create Verifiable Credentials

# Verifier workflow : validate Verifiable Credentials

Now that credentials are issued and stored in wallets, we can verify them in real-time using our Atarigo Verifier.

## Live demo pre-requisites

For the demo to work, we need the following:

- ✅ **Verifier Service**: Running on Docker (port 8083)
- ✅ **ngrok Tunnel**: Public access to localhost:8083
- ✅ **Valid Credential**: In your Swiyu wallet

!!! warning "Service Status"
    The verifier must be running with a valid ngrok tunnel.  
    Current endpoint: configured in settings.

---

## 🎫 Event Check-In Demo

Scan the QR code below with your Swiyu wallet to verify your membership credential.

<div id="verifier-demo">
  <!-- Pending State: Waiting for scan -->
  <div id="pending-state" class="demo-state active">
    <div class="demo-card">
      <h3>🎫 Scan to Verify Your Membership</h3>
      <p class="status-text">Waiting for credential presentation...</p>
      
      <div class="qr-container">
        <div id="qr-loading">
          <div class="spinner"></div>
          <p>Generating verification request...</p>
        </div>
        <img id="verification-qr" src="" alt="QR Code" style="display: none;">
      </div>
      
      <div class="live-status">
        <span class="pulse"></span>
        <span id="status-message">Listening for presentations...</span>
      </div>
      
      <div class="tech-details">
        <details>
          <summary>🔍 Technical Details</summary>
          <div id="verification-details">
            <p><strong>Verification ID:</strong> <code id="verification-id">-</code></p>
            <p><strong>Request URI:</strong> <code id="request-uri">-</code></p>
            <p><strong>State:</strong> <code id="verification-state">PENDING</code></p>
          </div>
        </details>
      </div>
    </div>
  </div>
  
  <!-- Verified State: Success! -->
  <div id="verified-state" class="demo-state">
    <div class="demo-card success">
      <div class="success-header">
        <div class="success-icon">✅</div>
        <h2>Welcome!</h2>
      </div>
      
      <div class="user-info">
        <div class="info-row">
          <span class="label">Name:</span>
          <span class="value" id="user-name">-</span>
        </div>
        <div class="info-row">
          <span class="label">Birth Date:</span>
          <span class="value" id="birth-date">-</span>
        </div>
        <div class="info-row">
          <span class="label">Membership:</span>
          <span class="value highlight" id="membership-class">-</span>
        </div>
      </div>
      
      <div class="verification-proof">
        <h4>🔐 Verification Details</h4>
        <p class="verified-by">
          <span class="check-icon">✓</span> 
          Issued by Atarigo Trust
        </p>
        <p class="status-check">
          <span class="check-icon">✓</span> 
          Status: Active (not revoked)
        </p>
        <p class="timestamp">
          Verified at: <span id="verified-time">-</span>
        </p>
      </div>
      
      <button id="reset-demo" class="action-btn">
        ↻ Next Guest
      </button>
    </div>
  </div>
  
  <!-- Error State: Something went wrong -->
  <div id="error-state" class="demo-state">
    <div class="demo-card error">
      <div class="error-icon">❌</div>
      <h3>Verification Failed</h3>
      <p id="error-message" class="error-text">-</p>
      <button id="retry-demo" class="action-btn">
        🔄 Try Again
      </button>
    </div>
  </div>
</div>
