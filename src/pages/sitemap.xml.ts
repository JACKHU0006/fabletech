import type { APIRoute } from 'astro';
import { getNews } from '../data/news';
import { products } from '../data/products';

const SITE_URL = 'https://www.fabletech.cc.cd';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  priority: string;
  changefreq: string;
  pagePath: string;
  lang: string;
}

const staticPages: Record<string, { pagePath: string; priority: string; changefreq: string }> = {
  '/': { pagePath: '/', priority: '1.0', changefreq: 'daily' },
  '/about': { pagePath: '/about', priority: '0.9', changefreq: 'monthly' },
  '/products': { pagePath: '/products', priority: '0.9', changefreq: 'weekly' },
  '/news': { pagePath: '/news', priority: '0.8', changefreq: 'daily' },
  '/factory': { pagePath: '/factory', priority: '0.8', changefreq: 'monthly' },
  '/service': { pagePath: '/service', priority: '0.8', changefreq: 'monthly' },
  '/faq': { pagePath: '/faq', priority: '0.7', changefreq: 'monthly' },
  '/contact': { pagePath: '/contact', priority: '0.7', changefreq: 'monthly' },
  '/sitemap': { pagePath: '/sitemap', priority: '0.5', changefreq: 'weekly' },
  '/support': { pagePath: '/support', priority: '0.6', changefreq: 'monthly' },
  '/downloads': { pagePath: '/downloads', priority: '0.6', changefreq: 'monthly' },
  '/agent': { pagePath: '/agent', priority: '0.6', changefreq: 'monthly' },
  '/careers': { pagePath: '/careers', priority: '0.6', changefreq: 'weekly' },
  '/privacy': { pagePath: '/privacy', priority: '0.5', changefreq: 'yearly' },
  '/terms': { pagePath: '/terms', priority: '0.5', changefreq: 'yearly' },
  '/cookies': { pagePath: '/cookies', priority: '0.5', changefreq: 'yearly' },
  '/returns': { pagePath: '/returns', priority: '0.6', changefreq: 'monthly' },
  '/shipping': { pagePath: '/shipping', priority: '0.6', changefreq: 'monthly' },
  '/search': { pagePath: '/search', priority: '0.5', changefreq: 'weekly' },
};

const languages = ['en', 'de', 'fr', 'es', 'ar'];
const today = new Date().toISOString().split('T')[0];

function generateHrefForLang(pagePath: string, targetLang: string): string {
  if (targetLang === 'en') {
    return `${SITE_URL}${pagePath}`;
  }
  return `${SITE_URL}/${targetLang}${pagePath}`;
}

function generateSitemap(): string {
  const urls: SitemapUrl[] = [];

  // Generate URLs for each page in each language
  for (const [, config] of Object.entries(staticPages)) {
    for (const lang of languages) {
      const pagePath = lang === 'en' ? config.pagePath : `/${lang}${config.pagePath}`;
      urls.push({
        loc: `${SITE_URL}${pagePath}`,
        lastmod: today,
        priority: config.priority,
        changefreq: config.changefreq,
        pagePath: config.pagePath,
        lang,
      });
    }
  }

  // News articles
  const news = getNews();
  for (const item of news) {
    const slug = `/news/${item.slug}`;
    for (const lang of languages) {
      const pagePath = lang === 'en' ? slug : `/${lang}${slug}`;
      urls.push({
        loc: `${SITE_URL}${pagePath}`,
        lastmod: item.publishedTime?.split('T')[0] || today,
        priority: '0.7',
        changefreq: 'monthly',
        pagePath: slug,
        lang,
      });
    }
  }

  // Products
  for (const product of products) {
    const slug = `/products/${product.id}`;
    for (const lang of languages) {
      const pagePath = lang === 'en' ? slug : `/${lang}${slug}`;
      urls.push({
        loc: `${SITE_URL}${pagePath}`,
        lastmod: today,
        priority: '0.8',
        changefreq: 'weekly',
        pagePath: slug,
        lang,
      });
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  const urlElements = urls.map(url => {
    let element = `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod || today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>`;

    // Generate hreflang links for all languages
    for (const lang of languages) {
      const href = generateHrefForLang(url.pagePath, lang);
      element += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`;
    }
    // x-default points to English
    element += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${url.pagePath}" />`;

    element += `
  </url>`;
    return element;
  });

  return sitemap + '\n' + urlElements.join('\n') + '\n</urlset>';
}

export const GET: APIRoute = () => {
  const xml = generateSitemap();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
