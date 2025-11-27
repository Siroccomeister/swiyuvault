---
icon: lucide/send
title: Issuer role
---

# Issuer Role: Creating Verifiable Credentials

## What is an Issuer?

An **Issuer** is an organization that creates and signs **Verifiable Credentials (VCs)** attesting to specific claims about individuals or entities.

**Examples:**

- Government agency issuing digital ID cards
- University issuing degree certificates
- Employer issuing membership cards or certifications
- Health authority issuing vaccination records

### Core Responsibilities

=== "1. Credential Creation"

    The issuer defines credential types (schemas), populates them with verified data, and cryptographically signs them using their DID keys.

=== "2. Status Management"

    Issuers maintain **Status Lists** to track the lifecycle of issued credentials:
    
    - Valid: Credential is active and trustworthy
    - Suspended: Temporarily invalid (e.g., pending investigation)
    - Revoked: Permanently invalidated (e.g., fraud detected, membership expired)
		
		Status lists are published as JWT tokens on a status registry, allowing verifiers to check credential validity in real-time without contacting the issuer directly.

=== "3. Protocol Compliance"

    Issuers implement the **OpenID4VCI (OpenID for Verifiable Credential Issuance)** standard, exposing standardized endpoints for wallet discovery and credential delivery.



## Trust Infrastructure Integration

Before issuing credentials, your organization must be registered in the **Base Registry** as a trusted issuer.

### Registration Requirements

The Base Registry stores:

- **Organization DID** (Decentralized Identifier)
- **Public verification keys** (for signature validation)
- **Issuer metadata endpoint** (e.g., `https://issuer.atarigo.net/.well-known/openid-credential-issuer`)
- **Authorized credential types** (what this issuer is allowed to issue)

**For the complete trust registration workflow, see:** [Trust Infrastructure Diagram](/role_verifier/#verifier-did-creation-and-upload). The same DID resolution and trust chain verification applies to issuers:

!!! tip "Base Registry Entry"
    Your issuer must be registered **before** wallets will trust your credentials. Work with the SWIYU trust infrastructure team to submit your organization's DID and metadata via the [ePortal](role_business_partner/#introduction).

## Credential Schema

Credentials follow a structured JSON format defined by the **W3C Verifiable Credentials Data Model** and **SD-JWT** (Selective Disclosure JWT).

### Example: ATARIGO Membership Card

```
{
  "credentialType": "my-test-vc",
  "format": "vc+sd-jwt",
  "vct": "urn:atarigo:credential:membership",
  
  "display": [
    {
      "name": "ATARIGO Member Card",
      "locale": "en-US",
      "logo": {
        "uri": "https://atarigo.net/logo.png"
      },
      "description": "Official membership credential for ATARIGO members",
      "background_color": "#2361BD"
    }
  ],
  
  "claims": {
    "firstName": {
      "mandatory": false,
      "value_type": "string",
      "display": [{"locale": "en-US", "name": "First Name"}]
    },
    "lastName": {
      "mandatory": false,
      "value_type": "string",
      "display": [{"locale": "en-US", "name": "Last Name"}]
    },
    "birthDate": {
      "mandatory": true,
      "value_type": "string",
      "display": [{"locale": "en-US", "name": "Date of Birth"}]
    },
    "membershipClass": {
      "mandatory": false,
      "value_type": "string",
      "display": [{"locale": "en-US", "name": "Membership Level"}]
    }
  },
  
  "statusList": {
    "id": "b7020ebb-7452-45a6-9dbd-4bbad9223f15",
    "type": "TOKEN_STATUS_LIST",
    "url": "https://status-reg.trust-infra.swiyu.admin.ch/api/v1/statuslist/b7020ebb-7452-45a6-9dbd-4bbad9223f15.jwt"
  }
}
```

**Key components:**

- **`vct`** (Verifiable Credential Type): Unique identifier for this credential schema
- **`display`**: Visual metadata for wallet rendering (logo, colors, localized names)
- **`claims`**: Data fields and their constraints (mandatory/optional, data types)
- **`statusList`**: Reference to the status registry for revocation checks

### Selective Disclosure

The **SD-JWT format** allows holders to selectively reveal claims:

**Full credential (issuer's view):**
```
{
  "firstName": "Alice",
  "lastName": "Smith",
  "birthDate": "1990-05-15",
  "membershipClass": "Gold"
}
```

**Selective presentation (what verifier sees):**
```
{
  "birthDate": "1990-05-15",
  "membershipClass": "Gold"
  // firstName and lastName hidden by holder
}
```

This privacy-preserving feature is core to self-sovereign identity principles.

## Status List Management

Issuers publish **Token Status Lists** as cryptographically signed JWT tokens containing a bitstring representing credential states.

### How It Works

1. **Issuer creates status list** with capacity for thousands of credentials (e.g., 100,000 entries)
2. **Each credential is assigned an index** in the status list during issuance
3. **Issuer updates the bitstring** when credentials are suspended/revoked
4. **Status list JWT is re-signed** and published to the registry
5. **Verifiers fetch the status list** during presentation validation

**Example status list structure:**

```
{
  "id": "b7020ebb-7452-45a6-9dbd-4bbad9223f15",
  "type": "TOKEN_STATUS_LIST",
  "purpose": "revocation",
  "maxListEntries": 100000,
  "remainingListEntries": 99850,
  "nextFreeIndex": 150,
  "statusRegistryUrl": "https://status-reg.trust-infra.swiyu.admin.ch/api/v1/statuslist/b7020ebb-7452-45a6-9dbd-4bbad9223f15.jwt"
}
```

**Advantages:**

- ✅ **Privacy:** No correlation between status checks and credential holders
- ✅ **Scalability:** Single JWT can track 100K+ credentials
- ✅ **Performance:** Verifiers cache status lists, reducing registry load

## See It in Action

The best way to understand issuer operations is to **experience the full workflow** in our live demo:

🚀 **[Try the Issuer Demo](demo_issuer)**

**What you'll see:**

1. **Credential offer generation** (QR code creation)
2. **Wallet issuance flow** (scan → accept → store)
3. **Status management** (suspend/revoke credentials)
4. **Protocol endpoints** (metadata, token, credential delivery)

For verifier-side operations and presentation validation, see:

🔍 **[Verifier Demo](demo_verifier)**
