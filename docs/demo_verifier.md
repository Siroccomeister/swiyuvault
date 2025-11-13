---
icon: lucide/shield-check
title: Verifier Demo
---

# Issuer workflow : create Verifiable Credentials

Now that our organisation is trusted and has its place in the Base Registry, let's set-up the type of credentials we want to manage.

## Cheatsheet
### CORS injection tweak

Pre-checks :
AS I run all my services from MAC-mini I don't really have a hosted platform. Therefore for the demo to work :

- [x] Docker (free) needs to run the SWIYU ISSUER SERVICE
- [x] ngrok (free) needs to run to build a tunnel from the internet and make the service accessible >> a specific url is provided
- [x] Vercel needs to run a PROXY service to reach the BACKEND


WEBPAGE <> VERCEL PROXY <> NGROK TUNNEL <> SWIYU ISSUER (on MAC MINI)

Therefore for this DEMO to run LIVE, services need to spin-up AND the PROXY needs to get informed of the ACTUAL NGROK url. 




https://cors-test.codehappy.dev/?url=https%3A%2F%2Fronda-rhonchial-janice.ngrok-free.dev%2Fswagger-ui%2Findex.html&origin=https%3A%2F%2Fcors-test.codehappy.dev%2F&method=get

ngrok http 8080 --response-header-add="Access-Control-Allow-Origin: *"

## 🎯 SWIYU VC Demo – End-to-End Test!

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
<pre id="curl-command" class="output-content"></pre>

<h3 class="output-title">Step 2: Raw API Response 🏁</h3>
<pre id="raw-response" class="output-content"></pre>

<h3 class="output-title">Step 3: Claim Your Credential 🎯</h3>
<div id="qr-div"></div>
