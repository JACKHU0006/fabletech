/**
 * IndexNow API Integration
 * Submits URLs to search engines for rapid indexing
 */

const INDEXNOW_API_KEY = '6444d163bf5d40c6a9b00dd95dd64dba';
const SITE_URL = 'https://www.fabletech.cc.cd';

// IndexNow supported endpoints
const INDEXNOW_ENDPOINTS = [
  'https://www.bing.com/indexnow',
  'https://searchadvisor.microsoft.com/api/indexnow',
  'https://api.indexnow.org/indexnow',
  'https://yandex.com/indexnow'
];

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

/**
 * Generate the URL to verify API key
 */
export function getKeyVerificationUrl(): string {
  return `${SITE_URL}/${INDEXNOW_API_KEY}.txt`;
}

/**
 * Generate IndexNow payload
 */
function createPayload(urls: string[]): IndexNowPayload {
  return {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_API_KEY,
    keyLocation: getKeyVerificationUrl(),
    urlList: urls
  };
}

/**
 * Submit URLs to IndexNow
 */
export async function submitToIndexNow(urls: string[]): Promise<void> {
  const payload = createPayload(urls);
  
  const promises = INDEXNOW_ENDPOINTS.map(async (endpoint) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        console.log(`✅ Submitted to ${endpoint}`);
      } else if (response.status === 202) {
        console.log(`✅ Accepted by ${endpoint} (queued for processing)`);
      } else {
        console.log(`⚠️ ${endpoint} returned ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Failed to submit to ${endpoint}:`, error);
    }
  });
  
  await Promise.allSettled(promises);
}

/**
 * Get all site URLs for submission
 */
export function getAllSiteUrls(): string[] {
  const baseUrls = [
    SITE_URL,
    `${SITE_URL}/`,
    `${SITE_URL}/about`,
    `${SITE_URL}/products`,
    `${SITE_URL}/news`,
    `${SITE_URL}/service`,
    `${SITE_URL}/contact`,
    `${SITE_URL}/faq`,
    `${SITE_URL}/search`,
    `${SITE_URL}/sitemap`
  ];
  
  // Add language variants
  const languages = ['de', 'fr', 'es', 'ar'];
  const pages = ['about', 'products', 'news', 'service', 'contact', 'faq'];
  
  const langUrls = languages.flatMap(lang => 
    pages.map(page => `${SITE_URL}/${lang}/${page}`)
  );
  
  // Add product pages
  for (let i = 1; i <= 12; i++) {
    baseUrls.push(`${SITE_URL}/products/prod-${String(i).padStart(3, '0')}`);
  }
  
  // Add news pages
  for (let i = 1; i <= 25; i++) {
    baseUrls.push(`${SITE_URL}/news/news-${String(i).padStart(3, '0')}`);
  }
  
  return [...baseUrls, ...langUrls];
}

export { SITE_URL, INDEXNOW_API_KEY };
