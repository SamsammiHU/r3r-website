# R3R Management Consulting — Website

B2B showcase site for **R3R Management Consulting Limited**.
Static, bilingual (English / 中文), no paid third-party services (domain fee excepted).

- **Live (after deploy):** https://r3r-mc.com  (GitHub Pages)
- **Stack:** plain HTML + CSS + vanilla JS. No build step, no framework.
- **Languages:** English (default) + 中文, switched client-side via `localStorage`.

---

## Project structure

```
.
├── index.html         # Home
├── services.html      # Services
├── about.html         # About
├── contact.html       # Contact (Formspree form)
├── 404.html           # Not-found page
├── CNAME              # Custom domain: r3r-mc.com
├── robots.txt
├── sitemap.xml
├── .nojekyll          # Disable GitHub Pages Jekyll processing
└── assets/
    ├── css/style.css  # Design system + responsive styles
    ├── js/i18n.js     # ALL website copy (EN + ZH) — edit text here
    ├── js/main.js     # Language switch, nav, form, config (placeholders)
    └── img/           # logo.svg, favicon.svg, og-cover.svg
```

---

## Current configuration (as deployed)

All placeholders from the original brief are resolved. Values live in `assets/js/main.js` (`SITE_CONFIG`):

| Item | Value | Status |
|------|-------|--------|
| Formspree endpoint | `https://formspree.io/f/xyeyqoll` | ✅ wired; test a submission to confirm it lands in the inbox |
| Contact email | `sammihu@r3r-mc.com` | ✅ filled + domain mailbox verified (send/receive OK) |
| WeChat ID | `164694493` | ✅ shown on the Contact page |
| Analytics | Plausible (hosted), `data-domain="r3r-mc.com"` | ✅ script in place; create the site at https://plausible.io to start collecting. Swappable later (see note below) |
| Custom domain | `r3r-mc.com` | ✅ registered (Aliyun) + GitHub Pages bound |
| HTTPS | Enforce HTTPS | ⏳ **pending** — checkbox not yet ticked in GitHub Pages settings (see Runbook step 4) |

> **Swapping analytics later:** the analytics snippet is one `<script>` per page. To move to Cloudflare Web Analytics (free, no-cookie) or GA4, edit `data-domain` / replace the snippet in each HTML file — no structural change needed.

---

## How to update website copy (for non-developers)

1. Open **`assets/js/i18n.js`**.
2. Find the key you want to change (keys match the `data-i18n="..."` in the HTML).
3. Edit the text inside the `en:` (English) and/or `zh:` (中文) blocks.
4. Save. No build needed — refresh the page.

Example — change the hero subtitle:

```js
"home.hero.subtitle": "Your new English text here",   // in en:{}
"home.hero.subtitle": "你的新中文文案",                 // in zh:{}
```

> Note: Chinese copy should be human-reviewed before publishing — do not machine-translate and ship.

---

## How to add a new page

1. Copy `services.html` to e.g. `newpage.html`.
2. Update its `<title>`, `data-meta` keys, and `data-page` attribute.
3. Add the matching `*.meta.title` / `*.meta.description` keys in `i18n.js` (both `en` and `zh`).
4. Add a nav link in **every** HTML file's `<ul class="nav-links">` and set `class="active"` on the current page.
5. Add the page to `sitemap.xml`.

---

## Deploy to GitHub Pages

The site is already deployed. Repo: `github.com/SamsammiHU/r3r-website` (public, `main` branch).
If you ever re-deploy from scratch, the steps are:

1. Push this folder to a repo (branch `main`):
   ```bash
   git push -u origin main   # origin already set to the r3r-website repo
   ```
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / root**.
3. Wait ~1–2 min. Live at `https://YOURNAME.github.io/r3r-website/` (then overridden by custom domain).

> Auth note: GitHub no longer accepts account passwords for git. Use a Personal Access Token (classic) with the `repo` scope, or `gh auth login`. The token is shown as blank when pasted — that is normal.

### 上线手册 (Runbook — exactly what was done)

Use this if you migrate hosts, re-register the domain, or hand off to someone else.

**1. Register domain** — `r3r-mc.com` at Aliyun (Alibaba Cloud). Complete **real-name verification (实名认证)** — without it the domain stays in `NXDOMAIN` and nothing resolves.

**2. Email DNS (Aliyun 公网域名解析 → 邮箱解析 → 选"阿里邮箱" → 确定)** — one-click adds:
| Type | Host | Value | Priority |
|------|------|-------|----------|
| MX | `@` | `mx1.qiye.aliyun.com` | 5 |
| MX | `@` | `mx2.qiye.aliyun.com` | 10 |
| MX | `@` | `mx3.qiye.aliyun.com` | 15 |
| TXT | `@` | `v=spf1 include:spf.qiye.aliyun.com -all` | — |
| TXT | `default._domainkey` | `v=DKIM1; k=rsa; p=...` (copy full value from the mail console 📋) | — |

> The DKIM TXT is **not** added by the one-click shortcut — add it manually if verification shows `default._domainkey` as Failed. Host record = `default._domainkey` only (console appends `.r3r-mc.com`).
> Mailbox created: `sammihu@r3r-mc.com` (single account; free tier = 50 accounts / 5 GB each, 5-year free).

**3. Website DNS (Aliyun 公网域名解析 → 添加记录)** — on `@` (root), add **4× A records** (coexists with MX/TXT, no conflict):
| Type | Host | Value | Line |
|------|------|-------|------|
| A | `@` | `185.199.108.153` | 默认 |
| A | `@` | `185.199.109.153` | 默认 |
| A | `@` | `185.199.110.153` | 默认 |
| A | `@` | `185.199.111.153` | 默认 |

> Use **A records**, not CNAME, on `@` — because `@` already holds the MX (mail) records; CNAME would conflict.
> (Optional) `CNAME` `www.r3r-mc.com` → `SamsammiHU.github.io` if you want the `www.` alias.

**4. GitHub Pages → Custom domain `r3r-mc.com`** — set in repo Settings → Pages. The repo `CNAME` file already contains `r3r-mc.com`, so GitHub auto-fills it. After DNS propagates (verified via `dig r3r-mc.com A` returning the 4 GitHub IPs), **tick Enforce HTTPS** to force all traffic to `https` and silence browser "not secure" warnings.

**5. Verify live:**
```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://r3r-mc.com       # expect 200
curl -sS -o /dev/null -w "%{http_code}\n" http://r3r-mc.com        # expect 301 → https after Enforce HTTPS
```

---

## SEO & performance notes

- Every page has a unique `<title>`, `meta description`, and Open Graph tags (set per-language).
- `sitemap.xml` + `robots.txt` included.
- Fonts: Inter via Google Fonts with `display=swap`; system-font fallback keeps load fast offline.
- All icons/logo are inline SVG — no external image requests, no large assets.
- Replace `assets/img/og-cover.svg` with a 1200×630 PNG for best social-share previews.
- Target: page load < 3s on broadband; verify with https://pagespeed.web.dev.

---

## Acceptance checklist

- [x] Mobile / desktop render correctly (test at ~375px, ~768px, ~1280px)
- [x] EN ⇄ 中文 switch works and persists on reload
- [x] Contact form wired to Formspree (`/f/xyeyqoll`) — test a live submission to confirm inbox delivery
- [x] Page load < 3s (plain static + inline SVG + system-font fallback)
- [x] No broken links (all nav + footer links resolve)
- [x] SEO tags present on every page (title / meta description / Open Graph)
- [x] Analytics script present (Plausible `data-domain="r3r-mc.com"`) — activate at plausible.io
- [x] Custom domain bound (`r3r-mc.com` → GitHub Pages, 4× A records verified)
- [ ] **Enforce HTTPS** — tick the checkbox in GitHub Pages settings (cert already issued; http still serves 200 without redirect)

---

© 2026 R3R Management Consulting Limited. All rights reserved.
