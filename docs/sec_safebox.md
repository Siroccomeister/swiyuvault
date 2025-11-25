---
icon: lucide/shield-check
title: Security Enforcement
---

# Safebox

This section is covering different security aspects as the project deals with sensitive information and to some degree exposes my private infrastructure to the internet.

## Security Architecture

This demo site implements defense-in-depth security principles across two key domains: **data protection** (Safebox practices) and **access control** (Security enforcement).

***

### Data Protection: Safebox Principle

All sensitive information follows a "crown jewels" approach with strict controls:

#### **Single Source of Truth**
- **Configuration:** All deployment parameters centralized in `zensical.toml`
- **Access policies:** Origin whitelist maintained in `proxy.js`
- **Tunnel routing:** Cloudflare Tunnel configuration in `~/.cloudflared/config.yml`
- **Cryptographic keys:** Isolated in `.didtoolbox/` directory (separate from application code)

#### **Secrets Management**
- **No hardcoded credentials:** All secrets injected via environment variables
- **Repository protection:** `.gitignore` enforces exclusion of sensitive files
- **Service credentials:** Cloudflare service token stored as Vercel environment variables
- **Identity protection:** GitHub 2FA (Apple authentication) secures all cloud service access

#### **Principle: Never Duplicate**
Configuration reads from authoritative sources—no inline values, no scattered copies, no accidental exposure through version control.
