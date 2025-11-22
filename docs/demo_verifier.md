---
template: demo-verifier.html
icon: lucide/shield-check
title: Demo for Verifier
---

# Verifier workflow : validate Verifiable Credentials

Now that credentials are issued and stored in wallets, we can verify them in real-time using our Atarigo Verifier.

## Pre-requisites

For the demo to work, we need to spin-up some services :

- [ ] docker swiyu issuer/verifier service : spin-up docker+service
- [ ] cloudflare tunnels : make the issuer/verifier services reachable from the internet
- [ ] vercel proxy : handles CORS errors by fixing headers (restricted by origins)

Check actual service status below before running your demo test. You need green ✅ checkmarks ! If conditions are not met - the demo is not going to work. Don't forget to give Spring Boot a little bit of time (15 sec) - perfectly normal.

??? info "Service Status"
    <div id="health-status">
        <p>🔄 Checking services...</p>
    </div>


---

## 🎫 Event Check-In Demo

Scan the QR code below with your Swiyu wallet to verify your membership credential.

<div id="verifier-demo">
  <!-- Pending State: Waiting for scan -->
  <div id="pending-state" class="demo-state active">
    <div class="demo-card">
      <h3>🎫 Scan to Verify Your Membership</h3>
      <p class="status-text">Waiting for credential presentation...</p>
      
<div class="qr-container" style="display: flex !important; flex-direction: column !important; align-items: center !important;">
  <div id="qr-loading">
    <div class="spinner"></div>
    <p>Generating verification request...</p>
  </div>
  <img id="verification-qr" src="" alt="QR Code" style="display: none; margin-bottom: 20px;">
  
  <a id="deeplink-button" href="#" target="_blank" 
     style="display:none; text-decoration:none; padding:12px 24px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; border-radius:8px; font-weight:bold; cursor:pointer;">
    📱 Open in SWIYU Wallet
  </a>
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
