---
icon: lucide/rocket
---

# Get started


## Purpose

This aim of this project is to get familiar with the cutting-edge Swiss eID infrastructure [Swiyu](https://www.eid.admin.ch/en/swiyu-coming-soon-e) by developing a website/demo leveraging as well the new [Zensical](https://zensical.org) framework developed by the makers of Material for MKDOCS.

<div style="display: flex; align-items: center; gap: 2%; justify-content: center;">
  <img src="assets/images/swiyu.png" style="height: 120px; width: auto;">
  <img src="assets/images/zensical.svg" style="height: 120px; width: auto;">
</div>

The whole project is on my GitHub repository. You may clone it and adapt it to your own needs if your feel inspired! Reach out to me via GitHub if you have questions.

### Context

^^Swiyu^^ system entered public beta in early 2025 and is planned for official launch in 2026, with the Self-Sovereign Identity (SSI) architecture prioritizing privacy by design and user-centricity.

^^Zensical^^ (launched in alpha, Nov.2025) is an ambitious overhaul of the Material for MKDOCS framework. It offers hands-on exposure to modern static site generation built with Rust (high-performance parallel builds), MiniJinja templates (Rust-based parallel rendering engine), and TOML configuration (human-readable, type-safe alternative to YAML).

### Learnings and achievements

!!! success "key takeaway on ethics and privacy"

    SWIYU preserves your privacy by design. I really liked the decentralised approach which ^^prevents the Base Registrar (FedPol) to track the actual use^^ a private person or a verifier does of his issued credentials. Contrary to some alternative implementations you may encounter in other European countries.

- [x] registered organisation "ATARIGO" into the Swiyu Beta Base Registry
- [x] registered and loaded ISSUER identity and status-list
- [x] registered and loaded VERIFIER identity
- [x] DEMO 1 : issue an ATARIGO Verified Credential ; load it into Swiyu eWallet app
- [x] DEMO 2 : verify ATARIGO Verified Credential ; read from Swiyu eWallet app
- [x] First Zensical static site, enriched with javascript and extra css
- [x] Integration with CloudFlare, Docker, Vercel to handle demo workflows
- [x] Active AI support from Perplexity in low code for all the above

### Standards Being Used
The implementation aligns with the latest OpenID4VC specifications :

- OpenID4VCI (Verifiable Credential Issuance): Working Group Draft 15 (December 2024)
- OpenID4VP (Verifiable Presentations): Working Group Draft 28 (April 2025)
- W3C VC Data Model: Underpinning verifiable credentials structure
- Swiss Trust Infrastructure: DIDAS-influenced ecosystem approach

### Limitations
#### Demo vs. Production
For all functionalities such as the demos to work, I need to spring boot docker services on my mac mini and tunnels to reach them. To make all services reachable permanently, I would need a server hosted solution. But if your objective is learning and sharing - this is perfectly fine !
#### Version Pinning Strategy

For Docker image stability, best practices recommend minor version pinning as the sweet spot. Therefore, once the demo workflows worked, I stabilisted the dependencies with the official GitHub repositories maintained by the Swiyu team. Thus avoiding services will unexpectedly break from upstream changes! 

