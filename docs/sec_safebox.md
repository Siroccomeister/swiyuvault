---
icon: lucide/shield-check
title: Security Enforcement
---

# Safebox

This section is covering different security aspects as the project deals with sensitive information and to some degree exposes my private infrastructure to the internet.

- [x] Define the sensitive information (private keys, passwords, tokens) - group them into a safebox with specific lifecycle.
- [ ] Exposed infrastructure : ensure that information that is outside (Github, Vercel, Swiyu) does not contain any information that could be re-used within hacking scenarii (impersonate my IDs etc...)
- [ ] Harden the Vercel Proxy and Ngrok Tunnel management
- [ ] to be continued....
- [ ] 

## Key variables and where/how they are maintained

CloudFlare tunnels
Proxy

What else and where :
- zensical.toml
- javascript pages (normally no)
- proxy.js pages
- .env for docker services (issuer awa verifier)


## scipt
# Create tunnels

Install via Homebrew (SWIYU workarounds)
Free account is OK.

``` zsh title="CloudFlared tunnel"
# Homebrew

# Create tunnels
cloudflared tunnel create atarigo-verifier
cloudflared tunnel create atarigo-issuer

```


``` zsh title="CloudFlared tunnel"

# Create tunnels
 cloudflared tunnel create atarigo-verifier 

# Start tunnel
cloudflared tunnel run atarigo-verifier
```
