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

## Before going live — remaining steps

The form endpoint, email, WeChat ID, and analytics domain are already set in `assets/js/main.js`:

| Item | Current value | Remaining action |
|------|---------------|------------------|
| Formspree endpoint | `https://formspree.io/f/xyeyqoll` | Confirm in Formspree dashboard that submissions go to your inbox. |
| Contact email | _(empty placeholder)_ | `SITE_CONFIG.email` is blank on purpose — the Contact page shows "Coming soon / 即将开通" and the mailto link is disabled. Set it to your domain mailbox (e.g. `hello@r3r-mc.com`) after the domain is registered. |
| WeChat ID | `164694493` | Shown on the Contact page. |
| Analytics domain | `r3r-mc.com` | Plausible (hosted). Create the site at https://plausible.io to collect stats (free trial, then paid). Analytics is a single `<script>` tag — you can swap to Cloudflare Web Analytics or GA4 later by editing `data-domain` / the snippet in each HTML file. |
| Custom domain | `r3r-mc.com` | Register the domain and configure DNS (details below). |

The address on the Contact page is real and already filled in (`contact.html`).

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

1. Create a repo (e.g. `r3r-website`) and push this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial R3R site"
   git branch -M main
   git remote add origin git@github.com:YOURNAME/r3r-website.git
   git push -u origin main
   ```
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / root**.
3. Wait ~1–2 min. The site is live at `https://YOURNAME.github.io/r3r-website/`.

### Bind the custom domain `r3r-mc.com`

1. Register the domain (Namecheap / Aliyun). The `CNAME` file already contains `r3r-mc.com`.
2. In GitHub Pages settings, set **Custom domain = `r3r-mc.com`** and enable **Enforce HTTPS**.
3. At your registrar, add DNS records:
   - **A** `r3r-mc.com` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** `www.r3r-mc.com` → `YOURNAME.github.io`
4. DNS propagation can take minutes to hours. GitHub will issue a free TLS cert automatically.

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

- [ ] Mobile / desktop render correctly (test at ~375px, ~768px, ~1280px)
- [ ] EN ⇄ 中文 switch works and persists on reload
- [ ] Contact form submits and notifies the inbox (test after Formspree setup)
- [ ] Page load < 3s
- [ ] No broken links (all nav + footer links resolve)
- [ ] SEO tags present on every page
- [ ] Analytics receiving data (after Plausible setup)
- [ ] Custom domain bound + HTTPS enforced

---

© 2026 R3R Management Consulting Limited. All rights reserved.
