---
icon: lucide/shield-check
title: Security 360°
---

# Enforcement

This section is covering different security aspects as the project deals with sensitive information and to some degree exposes my private infrastructure to the internet.

## Security Architecture

This demo site implements defense-in-depth security principles across two key domains: **data protection** ([Safebox](sec_safebox) practices) and **access control** (Security enforcement : this section).

***

### Access Control: Defense in Depth

Multi-layered enforcement ensures only authorized requests reach backend services:

#### **Layer 1: Origin Validation (CORS)**
```
Browser → Vercel Proxy
          ├─ Validates Origin header
          └─ Whitelist: localhost:8000, swiyu.atarigo.net, GitHub Pages
```
**Enforces:** Only approved frontend domains can call the proxy.

#### **Layer 2: Proxy Filtering**
```
Vercel Proxy
  ├─ Target URL whitelist (issuer.atarigo.net, verifier.atarigo.net only)
  ├─ Method validation (GET for reads, POST for operations)
  └─ Injects Cloudflare service token
```
**Enforces:** Request destination and HTTP method constraints.

#### **Layer 3: Cloudflare Access**
```
Cloudflare Edge
  ├─ Validates CF-Access-Client-Id
  ├─ Validates CF-Access-Client-Secret
  └─ Policy: Service Auth only
```
**Enforces:** Zero-trust authentication—no valid token, no access.

#### **Layer 4: Tunnel Isolation**
```
Cloudflare Tunnel (cloudflared)
  └─ Routes only authenticated traffic to localhost services
```
**Enforces:** Backend services never directly exposed to internet.

#### **Network Topology**
```
Internet
  ↓
GitHub Pages (public frontend)
  ↓
Vercel Proxy (origin + URL filtering)
  ↓
Cloudflare Access (service token validation)
  ↓
Cloudflare Tunnel (encrypted, authenticated)
  ↓
Docker Services (localhost:8080, localhost:8083)
```

**Result:** Four independent security checks before any request reaches application logic.

***

### Security Posture

#### **Current State (Pilot)**
- ✅ **Authentication:** Service-to-service (machine credentials)
- ✅ **Transport:** TLS-encrypted (Cloudflare Tunnel)
- ✅ **Authorization:** Policy-based access control
- ✅ **Attack surface:** Minimized (no public ports, no direct access)

#### **Production Readiness**
This architecture demonstrates production-grade patterns suitable for enterprise deployment:

| Security Control | Demo Implementation | Production Enhancement |
|------------------|----------------|------------------------|
| Secrets management | Environment variables | HashiCorp Vault / AWS Secrets Manager |
| Service authentication | Single service token | Rotate tokens periodically |
| Access logging | Cloudflare Access logs | SIEM integration (Splunk, Datadog) |
| Rate limiting | Cloudflare default | Custom rate limits per endpoint |
| DDoS protection | Cloudflare inherent | Additional WAF rules |

***

### Audit Trail

All security-critical configurations are version-controlled and traceable:

- **Configuration changes:** Git commit history
- **Access policies:** Cloudflare Zero Trust audit logs
- **Service deployment:** Vercel deployment logs
- **Tunnel activity:** Cloudflare Tunnel metrics

***

### Threat Model

**Protected against:**

- ✅ Credential exposure (no secrets in repositories)
- ✅ Unauthorized access (multi-layer authentication)
- ✅ Direct backend attacks (tunnel isolation)
- ✅ Cross-site request forgery (CORS validation)
- ✅ Endpoint enumeration (URL whitelist)

**Out of scope for pilot:**
- User authentication (current demo uses service-only auth)
- Credential rotation automation
- Real-time threat monitoring
- Compliance certifications (SOC 2, ISO 27001)

***

### Security Contact

**Last updated:** November 25, 2025

***

**This describes your security implementation accurately while demonstrating architectural maturity. Want me to adjust the tone or add/remove sections?** 🔒✨
