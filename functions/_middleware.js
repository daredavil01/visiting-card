// Cloudflare Pages Function: per-theme Open Graph images (design doc section 9,
// "OG images per theme, auto-selected by URL param").
//
// A crawler fetching card.sankettambare.in/?theme=terminal never runs the page's
// JavaScript, so the theme can only reach the meta tags server-side. HTMLRewriter
// streams the response and swaps the two image tags — no rendering, no cost worth
// measuring, and the HTML on disk stays a plain static file.

// Pages bundles Functions with esbuild, so this resolves at build time and the
// theme-to-file mapping stays in one place rather than being copied here.
import { OG_IMAGES, OG_DEFAULT } from '../src/utils/og-image.js';

// One line per view in src/content/. A view missing here simply keeps the
// default title from index.html.
const VIEW_TITLES = {
  general: 'Sanket Tambare — Software Developer, Runner, Writer',
  developer: 'Sanket Tambare — Full-Stack Developer & Data Engineer',
  runner: 'Sanket Tambare — Ultra Runner',
  trekker: 'Sanket Tambare — Sahyadri Trekker',
  writer: 'Sanket Tambare — Writer, Reader & Data Journalist',
};

class MetaRewriter {
  constructor(image, title) {
    this.image = image;
    this.title = title;
  }

  element(el) {
    const property = el.getAttribute('property') || el.getAttribute('name');
    if (property === 'og:image' || property === 'twitter:image') {
      el.setAttribute('content', this.image);
    } else if (this.title && (property === 'og:title' || property === 'twitter:title')) {
      el.setAttribute('content', this.title);
    }
  }
}

export async function onRequest(context) {
  const response = await context.next();

  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  const url = new URL(context.request.url);
  const theme = url.searchParams.get('theme');
  const view = url.searchParams.get('view');

  const image = OG_IMAGES[theme];
  const title = VIEW_TITLES[view];
  if (!image && !title) return response;

  const origin = url.origin;
  return new HTMLRewriter()
    .on('meta', new MetaRewriter(origin + (image || OG_DEFAULT), title))
    .transform(response);
}
