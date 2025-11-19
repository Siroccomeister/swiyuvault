---
icon: lucide/shield-check
title: Security 360°
---

# Security management

This section is covering different security aspects as the project deals with sensitive information and to some degree exposes my private infrastructure to the internet.

- [ ] Define the sensitive information (private keys, passwords, tokens) - group them into a safebox with specific lifecycle.
- [ ] Exposed infrastructure : ensure that information that is outside (Github, Vercel, Swiyu) does not contain any information that could be re-used within hacking scenarii (impersonate my IDs etc...)
- [ ] Harden the Vercel Proxy and Ngrok Tunnel management
- [ ] to be continued....


.env files contain secret private signing...

added to .gitignore
# Environment files
.env
swiyu_env_*.txt

# Keys
.didtoolbox/
*-keys/
*.pem

# Docker volumes
postgres_data/

