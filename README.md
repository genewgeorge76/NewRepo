# Blue Ridge Asphalt & Sealcoating Website

Simple, deploy-ready static website for an asphalt paving business serving Charlottesville, Virginia and surrounding Shenandoah-area communities. The site is built for search visibility ("SEO-ready") with structured data, social sharing metadata, and a sitemap.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Single-page marketing site (Home, Services, Sealcoating, Why us, Process, Service Area, FAQ, Contact) |
| `styles.css` | Responsive styling |
| `robots.txt` | Search crawler directives |
| `sitemap.xml` | URL list for search engines |
| `site.webmanifest` | Web app manifest |
| `favicon.svg` | Site icon |
| `og-image.svg` | Social share / Open Graph preview image |

## Local development

Because this is a static site, no build step is required.

Open `index.html` directly in a browser, or serve the folder locally:

```bash
cd /tmp/workspace/genewgeorge76/NewRepo
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Search optimization (built for Google)

The site includes:

- A descriptive, keyword-focused `<title>` and meta description
- Canonical URL, robots directives, and `theme-color`
- Open Graph and Twitter Card tags for rich social sharing
- JSON-LD structured data: `GeneralContractor` (local business) and `FAQPage`
- `robots.txt` and `sitemap.xml`
- Semantic HTML, accessible skip link, and an FAQ section

### Before going live

Replace the placeholder domain and business details with the real values:

1. Update every `https://www.blueridgeasphalt.com/` URL in `index.html`, `sitemap.xml`, and `robots.txt` with your real domain.
2. Update the phone number, email, hours, and service area in `index.html` (both the visible Contact section and the JSON-LD block).
3. After deploying, submit `sitemap.xml` in [Google Search Console](https://search.google.com/search-console).

## Deployment

Deploy the repository as a static site with any simple static host, including:

- GitHub Pages
- Netlify
- Vercel (static deployment)
- Any traditional web server serving the repository root

The deployment entry point is `index.html`, with styles in `styles.css`.
