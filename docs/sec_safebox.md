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

Online services :
- GITHUB (2FA? access)
- Cloudflare (via GitHub
- Vercel (via GitHub)




crown jewels :
- secret keys generated via didtoolbox
- .env variables >> confirmed in .gitignore !!!!
- cloudflare service tokens
- proxy short-lived tokens
- api end-point tokens?
- no secrets to console

https://www.perplexity.ai/search/d403b5d2-ca9d-4e61-bb3c-6e09ab31c7c9#107

GitHub Repo (PUBLIC)
  └── proxy.js (uses env vars) ✅ Safe to share

Vercel Environment Variables (PRIVATE) 🔒
  ├── CF_CLIENT_ID
  └── CF_CLIENT_SECRET

Cloudflare Service Token (PRIVATE) 🔒
  └── Only known to Vercel proxy

Your Tunnel (PROTECTED)
  └── Only accepts requests with valid CF token



Illustrate the traffic flows and the security layers
Worse case : only api & ports are exposed



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
