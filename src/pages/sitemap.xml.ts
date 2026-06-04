import type { APIRoute } from 'astro';
import { getNews } from '../data/news';
import { products } from '../data/products';

const SITE_URL = 'https://www.fabletech.cc.cd';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  priority: string;
  changefreq: string;
  hreflang?: string;
}

const staticPages: Record<string, SitemapUrl> = {
  '/': { priority: '1.0', changefreq: 'daily' },
  '/about': { priority: '0.9', changefreq: 'monthly' },
  '/products': { priority: '0.9', changefreq: 'weekly' },
  '/news': { priority: '0.8', changefreq: 'daily' },
  '/factory': { priority: '0.8', changefreq: 'monthly' },
  '/service': { priority: '0.8', changefreq: 'monthly' },
  '/faq': { priority: '0.7', changefreq: 'monthly' },
  '/contact': { priority: '0.7', changefreq: 'monthly' },
  '/sitemap': { priority: '0.5', changefreq: 'weekly' },
  '/support': { priority: '0.6', changefreq: 'monthly' },
  '/downloads': { priority: '0.6', changefreq: 'monthly' },
  '/agent': { priority: '0.6', changefreq: 'monthly' },
  '/careers': { priority: '0.6', changefreq: 'weekly' },
  '/privacy': { priority: '0.5', changefreq: 'yearly' },
  '/terms': { priority: '0.5', changefreq: 'yearly' },
  '/cookies': { priority: '0.5', changefreq: 'yearly' },
  '/returns': { priority: '0.6', changefreq: 'monthly' },
  '/shipping': { priority: '0.6', changefreq: 'monthly' },
  '/search': { priority: '0.5', changefreq: 'weekly' },
};

const languages = ['en', 'de', 'fr', 'es', 'ar'];

function generateSitemap(): string {
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];

  for (const [path, config] of Object.entries(staticPages)) {
    const url: SitemapUrl = {
      loc: `${SITE_URL}${path}`,
      lastmod: today,
      priority: config.priority,
      changefreq: config.changefreq,
    };

    if (path !== '/' && languages.includes(path.split('/')[1])) {
      continue;
    }

    urls.push(url);

    if (path === '/') {
      for (const lang of languages) {
        if (lang !== 'en') {
          urls.push({
            loc: `${SITE_URL}/${lang}`,
            lastmod: today,
            priority: '1.0',
            changefreq: 'daily',
            hreflang: lang,
          });
        }
      }
    } else {
      for (const lang of languages) {
        if (lang !== 'en') {
          urls.push({
            loc: `${SITE_URL}/${lang}${path}`,
            lastmod: today,
            priority: config.priority,
            changefreq: config.changefreq,
            hreflang: lang,
          });
        }
      }
    }
  }

  const news = getNews();
  for (const item of news) {
    urls.push({
      loc: `${SITE_URL}/news/${item.slug}`,
      lastmod: item.publishedTime?.split('T')[0] || today,
      priority: '0.7',
      changefreq: 'monthly',
    });

    for (const lang of languages) {
      if (lang !== 'en') {
        urls.push({
          loc: `${SITE_URL}/${lang}/news/${item.slug}`,
          lastmod: item.publishedTime?.split('T')[0] || today,
          priority: '0.7',
          changefreq: 'monthly',
          hreflang: lang,
        });
      }
    }
  }

  for (const product of products) {
    urls.push({
      loc: `${SITE_URL}/products/${product.id}`,
      lastmod: today,
      priority: '0.8',
      changefreq: 'weekly',
    });

    for (const lang of languages) {
      if (lang !== 'en') {
        urls.push({
          loc: `${SITE_URL}/${lang}/products/${product.id}`,
          lastmod: today,
          priority: '0.8',
          changefreq: 'weekly',
          hreflang: lang,
        });
      }
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${SITE_URL}/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  const urlElements = urls.map(url => {
    let element = `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod || today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>`;

    if (url.hreflang) {
      const alternateUrl = url.hreflang === 'en'
        ? url.loc.replace(/\/[a-z]{2}\//, '/')
        : url.loc;

      for (const lang of languages) {
        const altLoc = lang === 'en'
          ? url.loc.replace(/\/[a-z]{2}\//, '/')
          : url.loc.includes(`/${lang}/`) ? url.loc : url.loc.replace(SITE_URL, `${SITE_URL}/${lang}`);

        element += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${altLoc}" />`;
      }
      element += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`;
    }

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
