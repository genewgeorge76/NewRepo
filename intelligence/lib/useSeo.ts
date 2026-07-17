import { useEffect } from 'react';

const SITE_URL = 'https://www.jwordenasphaltpaving.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/asphalt-paving-with-paver.jpg`;

interface SeoProps {
  /** Page title. Will be appended with " — J. Worden & Sons" automatically unless suffix=false. */
  title: string;
  /** Meta description. ~155 chars max for Google snippets. */
  description: string;
  /** Path part of canonical URL, e.g. "/services" or "/locations/richmond". Always include leading slash. */
  path: string;
  /** Optional Open Graph image (absolute URL). Defaults to a paving photo. */
  image?: string;
  /** If true, do not append " — J. Worden & Sons" to title. */
  rawTitle?: boolean;
  /** If true, set <meta name="robots" content="noindex"> (for thank-you pages, admin, etc.). */
  noindex?: boolean;
}

/**
 * Sets document.title and the standard SEO meta tags imperatively on every page.
 *
 * Why imperative and not <head>: TanStack Router in SPA mode renders into <body>,
 * so the cleanest way to keep per-page meta correct on client-side navigation is
 * to update the existing <head> tags from a hook.
 */
export function useSeo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  rawTitle = false,
  noindex = false,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = rawTitle ? title : `${title} — J. Worden & Sons`;
    const canonical = `${SITE_URL}${path}`;

    document.title = fullTitle;

    setMeta('description', description);
    setMeta('robots', noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large');

    setLink('canonical', canonical);

    setProperty('og:title', fullTitle);
    setProperty('og:description', description);
    setProperty('og:url', canonical);
    setProperty('og:type', 'website');
    setProperty('og:site_name', 'J. Worden & Sons');
    setProperty('og:image', image);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
  }, [title, description, path, image, rawTitle, noindex]);
}

function setMeta(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setProperty(property: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}
