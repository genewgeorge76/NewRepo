# Blue Ridge Asphalt & Sealcoating Website

Simple, deploy-ready static website for an asphalt paving business serving Charlottesville, Virginia and surrounding Shenandoah-area communities.

## Local development

Because this is a static site, no build step is required.

Open `index.html` directly in a browser, or serve the folder locally:

```bash
cd /tmp/workspace/genewgeorge76/NewRepo
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

Deploy the repository as a static site with any simple static host, including:

- GitHub Pages
- Netlify
- Vercel (static deployment)
- Any traditional web server serving the repository root

The deployment entry point is `index.html`, with styles in `styles.css`.
