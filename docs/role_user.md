---
icon: lucide/user-check
title: User eXperience
---


# User eXperience through SWIYU eWallet

### **New Page: `/wallet_integration/`**

## SWIYU Wallet Integration

### Getting the Wallet App

The SWIYU Wallet is a reference implementation of the OpenID4VCI/VP protocols. It is currently distributed as [public beta](https://www.eid.admin.ch/de/public-beta). That page references the Apple App Store and Google Play Store links. Download and install it on your phone if you want to test the demos!

<figure markdown>
![Illustration of Swiyu eWallet app](assets/images/public_beta_app.jpg){ width=50% }
<figcaption markdown> Illustration of Swiyu eWallet app</figcaption>
</figure>

## Using the Demo

!!! example "Schema"

    === "Scan Credential Offer"

        ``` markdown
				Credential Offer QR Code
				    ↓
				SWIYU Wallet scans
				    ↓
				Wallet fetches issuer metadata
				    ↓
				User accepts credential
				    ↓
				Credential stored in wallet
        ```

    === "Present Credential"

        ``` markdown
				Verifier Request QR Code
				    ↓
				SWIYU Wallet scans
				    ↓
				Wallet fetches verifier metadata
				    ↓
				User consents to share
				    ↓
				Presentation sent to verifier
        ```


!!! example "Illustration"

    === "Scan Credential Offer"

        <figure markdown>
				![Illustration of Swiyu eWallet app](assets/images/eWallet.png){ width=30% }
				<figcaption markdown> Illustration of Swiyu eWallet app</figcaption>
				</figure>

    === "Present Credential"

        <figure markdown>
				![Credential loaded into Swiyu eWallet app](assets/images/VC_card.png){ width=30% }
				<figcaption markdown> Credential loaded into Swiyu eWallet app</figcaption>
				</figure>

## Technical: Public Endpoint Requirements

!!! info "Why Some Endpoints Are Public"
    
    The OpenID4VCI and OpenID4VP specifications **require** certain endpoints to be publicly accessible without authentication:
    
    **Issuer Discovery:**
    ```
    GET https://issuer.atarigo.net/.well-known/openid-credential-issuer
    ```
    Returns metadata about supported credential types, signing algorithms, and endpoints.
    
    **Verifier Discovery:**
    ```
    GET https://verifier.atarigo.net/.well-known/openid-configuration
    ```
    Returns metadata about verification requirements and protocols.
    
    **Credential Offers:**
    ```
    GET https://issuer.atarigo.net/credential-offer/{id}
    ```
    Shareable links that wallets can fetch to initiate credential issuance.
    
    ### Security Considerations
    
    These public endpoints:
    
    - ✅ Contain **no user data or credentials** (metadata only)
    - ✅ Are **required by the protocol** for wallet interoperability
    - ✅ Still protected by **Cloudflare edge security**:
        - HTTPS with valid certificates
        - DDoS protection
        - Rate limiting
        - Geographic filtering
    - ✅ Use **Cloudflare Bypass policy** (intentionally unauthenticated)
    
    Administrative endpoints (`/management/*`, `/actuator/*`) remain protected by service token authentication.
    
    **For full security architecture, see:** [Security Enforcement](/sec_enforced/)
