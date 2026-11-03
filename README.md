# R3R Management Consulting — Website

Static B2B site for **R3R Management Consulting Limited** (Hong Kong).
English-only, no build step, no framework. All copy and image paths live in one JSON file.

- **Live:** https://r3r-mc.com (GitHub Pages)
- **Repo:** `github.com/SamsammiHU/r3r-website` (`main`)
- **Stack:** plain HTML + CSS + vanilla JS

---

## Project structure

```
.
├── index.html           # Home
├── energy.html          # Energy Project Coordination
├── supply-chain.html    # Supply Chain Management
├── about.html           # About
├── contact.html         # Contact (form + email matrix)
├── 404.html             # Not-found page
├── services.html        # Legacy URL — redirects to /
├── CNAME                # r3r-mc.com
├── robots.txt
├── sitemap.xml
├── .nojekyll
└── assets/
    ├── css/style.css    # Design system + responsive rules
    ├── js/main.js       # JSON renderer, nav, form
    ├── data/site.json   # ← ALL copy + image paths + emails
    └── img/             # logos, icons, placeholder photography
```

---

## Editing copy (the only file you normally touch)

Open **`assets/data/site.json`**. Every string, image path, email and form setting is there.
No build step — save, commit, push, refresh.

| Want to change | Key |
|---|---|
| Home hero | `home.hero` |
| Home cards | `home.cards` |
| Home stats | `home.stats` |
| Energy solutions / products | `energy.solutions` / `energy.products` |
| EMS points | `energy.ems.points` |
| Case studies | `energy.cases.items` |
| Supply chain capabilities | `supply.capabilities` |
| Services list | `supply.services` |
| Contact emails | `contact.emails` |
| Form category dropdown | `contact.categories` |
| Footer address | `site.address` |
| Partner logos | `partnerLogos` |

The HTML holds structure; `data-bind`, `data-img` and `data-each` attributes pull values from the JSON.

---

## Replacing the placeholder images

Every placeholder is a real file at the exact path the brief specified, so nothing 404s.
Drop your final assets in `assets/img/` using the **same filenames** — no code change needed.

**16:9 photography (JPG)**

```
hero_bg.jpg
home_card_energy.jpg  home_card_scm.jpg
solution_ci.jpg  solution_utility.jpg  solution_offgrid.jpg
product_ess.jpg  product_pv.jpg  product_offgrid.jpg  product_light.jpg
case_japan.jpg  case_portugal.jpg
ems_dashboard.jpg
scm_network.jpg  scm_digital.jpg  scm_warehouse.jpg
```

**Partner logos (PNG)**

```
partner_logo_1.png … partner_logo_17.png
```

Logos are displayed in grayscale via CSS (`.logo-grid img`), so upload full-colour files.
Recommended logo canvas: transparent or white, roughly 2:1, ≥ 360×180 px.
Recommended photo size: 1600×900 or larger.

---

## Contact form

- Endpoint: `https://formspree.io/f/xyeyqoll` (set in `site.formspreeEndpoint`).
- The form sends `name`, `company`, `email`, `category`, `message`, plus a hidden `department` field populated from the dropdown.
- **Action required in Formspree:** the form's notification recipient is configured in the Formspree dashboard, not in this repo. Set it to **business@r3r-mc.com** or the submission will continue going to the previously configured inbox.
- To split routing later, create four Formspree forms and map each category to its endpoint in `assets/js/main.js` (`routes`).

Direct email links (`business@`, `energy@`, `sourcing@`, `contracts@`) are plain `mailto:` links — they need those mailboxes to exist in the Aliyun enterprise mail console.

---

## Deploy

Already deployed on GitHub Pages. To publish a change:

```bash
cd /Users/samsam/WorkBuddy/2026-09-14-15-25-37
git add -A
git commit -m "Rebuild site: energy + supply chain"
git push origin main
```

GitHub Pages rebuilds in ~1–2 minutes.

**Live checks**

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://r3r-mc.com
curl -sS -o /dev/null -w "%{http_code}\n" https://r3r-mc.com/energy.html
curl -sS -o /dev/null -w "%{http_code}\n" https://r3r-mc.com/supply-chain.html
curl -sS -o /dev/null -w "%{http_code}\n" https://r3r-mc.com/contact.html
```

All should return `200`.

---

## Notes

- **English-only.** The previous EN/中文 toggle was removed for this version. `assets/js/i18n.js` is no longer loaded; it can be deleted.
- **SEO:** each page has a static `<title>`, meta description, canonical and Open Graph tags. Body copy is rendered from JSON at runtime. If organic search becomes a priority, move to a build step that pre-renders the JSON into HTML.
- **Analytics:** Plausible snippet on every page, `data-domain="r3r-mc.com"`. Activate the site at plausible.io.
- **HTTPS:** Enforce HTTPS is on in GitHub Pages.

---

© 2026 R3R Management Consulting Limited. All rights reserved.
