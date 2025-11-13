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
- My organisation is now trusted by SWIYU and enabled to manage its space in the BASE REGISTRY. In that SPACE, I am able to maintain a LIST (a kind of index) of credentials with a status for each credential.
- My organisation can now issue so-called verifiable credentials (VC) that are signed. **Anyone** can seek verification of this credential to confirm it is valid and use specific information that users accept to share :
		1. Download the status list of my organisation from the Base Registry.
		2. Look-up the VC status from that list.

## :wrench: Cheatsheet 

This section aims at collecting some specific lesson learned. If I was to redo the whole process again, the below are useful hints to revive understanding, tips and context.

The APIs can be accessed via the following urls.

Environment	: swiyu Public Beta
Identifier Authoring : https://identifier-reg-api.trust-infra.swiyu-int.admin.ch		
Status Authoring: https://status-reg-api.trust-infra.swiyu-int.admin.ch	
Key Manager : https://keymanager-prd.api.admin.ch

The organisation gets uniquely defined through PKI keys (didtool). A public/private set of keys is generated.

### How does it work

API by TYPE : 3 roles
- TRUST
- STATUS
- IDENTIFIER

API_table.png

### Standards used

These are the key standards that I have identified to be followed by swiyu.

SSI/PKI infrastructure. Authentication. etc...

### Sensitive Information

The proposed Swiss Trust Infrastructure relies on transparency and is decentralised. Most of the information is therefore public. But part of the information is extremely sensitive and should never be shared.

This section aims at providing clarity and examples. It may even outline possible threat scenarii (such as identity substitution or subponeation).

### One application for one API

<Generic Appl>_<SWIYU_PARTNER_ID>
prod_Atarigo-pams_20ca7f96-575b-439e-ac58-2802d533e39b

<Identifier Appl>_<SWIYU_PARTNER_ID>
prod_Atarigo_identifer-pams_20ca7f96-575b-439e-ac58-2802d533e39b

### Work with Swiyu environmental variables

This is the list of variables you'll need as you go through the process. Most of them are provided by the ePortal or through the different exchanges with the APIs.

Practical hint : I compiled them into a single text file that I was loading into my shell environment : 

``` py title="how to maintain your swiyu environment variables"

# I recommend to load all variables into a text file
export SWIYU_VARIABLE_X="<variable_X>
export SWIYU_VARIABLE_Y="<variable_Y>
export SWIYU_VARIABLE_Z="<variable_Z>

# You may iterate/amend your text file.
# Each time you'll need to reload it into the shell.
source env_swiyu.txt
```

For illustration purposes, you can see below the main variables that I have been collecting and maintaining as I progressed step-by-step into the base & trust registry.

!!! note "" 

		SWIYU_IDENTIFIER_REGISTRY_URL
		SWIYU_STATUS_REGISTRY_API_URL
		
		SWIYU_PARTNER_ID
		IDENTIFIER_REGISTRY_URL
		IDENTIFIER_REGISTRY_ID
		STATUS_REGISTRY_URL
		STATUS_REGISTRY_ID
		
		SWIYU_IDENTIFIER_REGISTRY_ACCESS_TOKEN
		SWIYU_IDENTIFIER_REGISTRY_BOOTSTRAP_REFRESH_TOKEN
		SWIYU_IDENTIFIER_REGISTRY_CUSTOMER_KEY
		SWIYU_IDENTIFIER_REGISTRY_CUSTOMER_SECRET
		
		SWIYU_STATUS_REGISTRY_ACCESS_TOKEN
		SWIYU_STATUS_REGISTRY_BOOTSTRAP_REFRESH_TOKEN
		SWIYU_STATUS_REGISTRY_CUSTOMER_KEY
		SWIYU_STATUS_REGISTRY_CUSTOMER_SECRET





