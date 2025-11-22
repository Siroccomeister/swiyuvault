---
icon: lucide/handshake
title: Business Partner
---

# Business Partner/Organisation role

In my scenario, I want to work as an Business Partner / Organisation that wants to leverage the pki-secured  and decentralised swiss trust infrastructure (SWIYU - currently in beta). The planned swiss architecture relies on very important design choices supporting ^^transparency^^, ^^decentralisation^^ and ^^trust^^.

In this section - we will see : 

- [x] How to register your organisation into beta-Swiyu infrastructure
- [x] How to subsribe to beta-swiyu APIs (Initiator & Status)
- [x] How to create your first Status-List

## Introduction

These websites are really good placeholders to get a first level understanding of the Swiyu framework. They can be seen as ^^authoritative^^ information sources.

- [SWIYU Official Page](https://www.eid.admin.ch/de)
- [SWIYU Technical documentation](https://swiyu-admin-ch.github.io)
- [Self-Service ePortal](https://selfservice.api.admin.ch/api-selfservice/apis)

The technical documentation is opensource (GitHub) and also provides different cookbooks that can be followed step-by-step. A great learning path if like me, you want to contribute to an ethical digital society.

## Cookbook : onboarding base and trust registry
For the remainder of this section, we'll be following the steps outlined in this particular cookbook. The steps will allow to register the organisation (retrieve a unique ID) and then create our entry into the Base Registry.

https://swiyu-admin-ch.github.io/cookbooks/onboarding-base-and-trust-registry/

!!! warning "Base Registry is critical infrastructure"

    The Base Registry is a center-piece of the SWIYU trust infrastructure. It is the authoritative source to verify organisations (business partners) and the status of credentials those organisations will have issued. All roles (Business Partner, Issuer, Verifier, User) are meant to interact with it.
    From a security standpoint - storage and access is extremely sensitive in terms of privacy and business continuity.
   

## Business Partner ID
 Using the ePortal, I created a Business Partner instance called ATARIGO that is associated with my personal login and email. It received a unique identifier.

``` yaml title="SWIYU_PARTNER_ID"
20ca7f96-575b-439e-ac58-2802d533e39b
```

As we are in beta and since the model is based on transparency, it is ok to share the id openly. 

!!! tip "Sensitive information"

    Other elements (such as private pki keys and tokens) are a lot more sensitive and will remain undisclosed and safely stored.


## (beta) Environment for Trust Infrastucture

### Base Registry

The objective now is to create an actual entry of my organisation (SWIYU_PARTNER_ID) within the Base Registry.
 
To that end, I need to formally subscribe to the APIs that enable communication with the registry through the CORE BUSINESS SERVICES.
 
!!! note ""

    Technically, the organisation needs to subscribe to 2 API services. Each subscription requires a) an Application and b) a set of Tokens. This can be configured via the public ePortal. Once this is achieved, my organisation is able to manage its entries into the registry.
 
 - *swiyucorebusiness_identifier*: Use this API to update your public key material on the Base Registry.
 - *swiyucorebusiness_status*: Use this API to manage your status list. This is where "magic" happens - my organisation will now be able to maintain a list of verifiable credentials with an associated status (valid, revoked, etc...).

### PKI private/public keys

Thanks to the [toolbox](ref_swiyu_installs/#java-didtoolboxjar), we are able to generate a cryptographic keypair (private and public keys), usually in formats like PEM or JWK:

- Private key: kept secret, used for signing credentials.
- Public key: included in the DID Document, used by verifiers to check signatures.
- A JSON file that compiles a DID identifier, public keys, end-points etc...

The rest of the cookbook provides clear directions how to interact step-by-step with the Base Registry using the exposed APIs, the provided tokens, your identifiers and 

### What I have achieved
- [x] My organisation is now trusted by SWIYU and enabled to manage its space in the BASE REGISTRY. In that SPACE, I am able to maintain a LIST (a kind of index) of credentials with a status for each credential.
- [x] My organisation can now issue so-called verifiable credentials (VC) that are signed. **Anyone** can seek verification of this credential to confirm it is valid and use specific information that users accept to share :
	- [x] Download the status list of my organisation from the Base Registry.
	- [x] Look-up the VC status from that list.

In the [Issuer section,](role_issuer) we can see how to set-up a Swiyu Issuer Service. And there's even a [Demo](demo_issuer) for it!


