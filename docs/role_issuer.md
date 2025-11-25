---
icon: lucide/send
title: Issuer role
---

# Issuer workflow : create Verifiable Credentials

Now that our organisation is trusted and has its place in the Base Registry, let's set-up the type of credentials we want to manage.

## Credential operations : setting-up the issuer service
 •  Your ATARIGO DID (set as ISSUER_ID)
 •  The status list verification method (use your assertion key)
 •  Environment variables for API endpoints, credentials, and keys
 
 To keep things simple and in low-code fashion, I leveraged Docker.
 - Docker is a sweet piece of application ; you can download Docker Desktop and then run the application locally ; in a terminal : it will show Docker --version.
 - With Docker - you can run locally in a virtual container a predefined program
 - I then cloned the GitHub Repository for the "generic SWIYU issuer service".
 - I completed the .env file with my variables
 - I tested with >> Docker compose up
 - I got the service up and running ; for now it runs on http://localhost:8080/swagger-ui

## Credential (VC) schema and attributes

Decide which verifiable credentials (VCs) you want to offer (e.g., membership, age attestation, test badges).

Adapt the schema for the pilot—optional: use sample schemas from the swiyu cookbooks or your sector

## Credential formatting (for Swiyu Wallet)
I just added a url to my logo.
Planning on adding a membership item and a join date...

## Credential operations : issueing test credentials

- issue the credential
- swiyu wallet accepts the credential
- status management : change of status


CREATING OF LIST
Here's the first property triggered via SWAGGER


``` json title="how to install Homebrew"
{
  "id": "6cf0826e-5dbb-4a9f-8830-38d61803c8be",
  "statusRegistryUrl": "https://status-reg.trust-infra.swiyu-int.admin.ch/api/v1/statuslist/b7020ebb-7452-45a6-9dbd-4bbad9223f15.jwt",
  "type": "TOKEN_STATUS_LIST",
  "maxListEntries": 100000,
  "remainingListEntries": 100000,
  "nextFreeIndex": 0,
  "version": "1.0",
  "config": {
    "purpose": "",
    "bits": 2
  }
}
```

This property will be needed you will use it in your credential issuance request, typically as part of the payload when you create a credential offer.

Now :that we have a list identifier, we can issue a VC into it.
Then : from the Wallet - I can read the QR code and download it.

	
