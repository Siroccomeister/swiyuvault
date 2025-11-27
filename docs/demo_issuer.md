---
template: demo-issuer.html
icon: lucide/send
title: Demo for Issuer
---

# Issuer workflow : create Verifiable Credentials

Now that our organisation is trusted and has its place in the Base Registry, and that we configured a dedicated Issuer service instance that is trusted by the Base Registry, we can run a real end-to-end test that will :

- [x] Issues a verifiable credential
- [x] Loads it into the swiyu wallet.

## Pre-requisites

For the demo to work, we need to spin-up some services :

- [ ] `Docker` swiyu issuer/verifier ➡️ spin-up docker+service
- [ ] `Cloudflare` tunnels ➡️ make the issuer/verifier services reachable from the internet
- [ ] `Vercel proxy` ➡️ handles CORS errors by fixing headers (restricted by origins)

Check actual service status below before running your demo test. You need green ✅ checkmarks ! Otherwise the demo is not going to work. 

??? info "Service Status"
    <div id="health-status">
        <p>🔄 Checking services...</p>
    </div>




## SWIYU issuer demo

With Issuer Service reachable - you can use the below form to create your own Verifiable Credential. 

- You'll be acting as authoritative person issueing a valid credential to someone (yourself in this case).
- You can use dummy text as long as format is respected. In this case we are emulating a membership credential (with a given class level).


<button id="start-demo-btn" style="display:none; margin:20px auto; padding:15px 30px; font-size:18px; background:#1976d2; color:white; border:none; border-radius:8px; cursor:pointer;">
  🚀 Start Issuer Demo
</button>

<!-- Begin demo-content wrapper -->
<div id="health-status" style="display:none; margin:20px 0;"></div>

<!-- Form and Steps wrapped together, hidden initially -->
<div id="demo-content" style="display:none;">

<form id="vc-form">
  <label for="firstName">First Name:</label>
  <input type="text" id="firstName" required>
  
  <label for="lastName">Last Name:</label>
  <input type="text" id="lastName" required>
  
  <label for="birthDate">Birth Date:</label>
  <input type="text" id="birthDate" required>
  
  <label for="membershipClass">Membership Class:</label>
  <select id="membershipClass" required>
    <!-- Options will be populated by JavaScript -->
  </select>
  
  <label for="validFrom">Valid From:</label>
  <input type="text" id="validFrom" readonly>
  
  <label for="validUntil">Valid Until:</label>
  <input type="text" id="validUntil" readonly>
  
  <label for="statusList">Status List URL:</label>
  <input type="text" id="statusList" readonly>
  
  <button type="submit">Generate Credential Offer</button>
</form>

<h3 class="output-title">Step 1: Generated cURL Command ⛳️</h3>
Below displays the call made to the swiyu issuer service API that runs on my mac mini. You can see a combination of unique ID of the Atarigo Service and the form details. We are uploading the VC (Verifed Credential) into the Status List.
<pre id="curl-command" class="output-content"></pre>

<h3 class="output-title">Step 2: Raw API Response 🏁</h3>
Here we can see the answer received from the API. It shows the upload was successful and we receive a unique link to the Status List entry.
<pre id="raw-response" class="output-content"></pre>

<h3 class="output-title">Step 3: Claim Your Credential 🎯</h3>
In this last step - you can now claim your credential. On your mobile phone with Swiyu App installed, you can either scan the displayed QR code or if you're on your phone browser, click on the button to open the link directly in your app. Well done : you just became official member of the very fine ATARIGO club 👍.
<div id="qr-div"></div>

</div>
<!-- End demo-content wrapper -->

## Swiyu App

Now once a new Verifiable Credential has been issued, it can be retrieved by one instance (person/Swiyu app). The below picture of my mobile phone shows how these cards are then installed into your Swiyu Wallet. Go to the [User eXperience role](role_user) page for more info.

!!! example

    === "Illustration of Swiyu eWallet app"

        <figure markdown>
				![Illustration of Swiyu eWallet app](assets/images/eWallet.png){ width=50% }
				<figcaption markdown> Illustration of Swiyu eWallet app</figcaption>
				</figure>

    === "Credential loaded into Swiyu eWallet app"

        <figure markdown>
				![Credential loaded into Swiyu eWallet app](assets/images/VC_card.png){ width=50% }
				<figcaption markdown> Credential loaded into Swiyu eWallet app</figcaption>
				</figure>