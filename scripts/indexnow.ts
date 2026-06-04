import fs from 'fs';
import path from 'path';

const INDEXNOW_API_KEY = '6444d163bf5d40c6a9b00dd95dd64dba';
const SITE_URL = 'https://www.fabletech.cc.cd';

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

export function getKeyVerificationUrl(): string {
  return `${SITE_URL}/${INDEXNOW_API_KEY}.txt`;
}

function createPayload(urls: string[]): IndexNowPayload {
  return {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_API_KEY,
    keyLocation: getKeyVerificationUrl(),
    urlList: urls
  };
}

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

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

export function generateUrlsFromProject(): string[] {
  const urls: string[] = [];
  
  urls.push(SITE_URL);
  urls.push(`${SITE_URL}/`);
  
  const pagesDir = path.join(__dirname, '../src/pages');
  if (fs.existsSync(pagesDir)) {
    const pageFiles = getAllFiles(pagesDir);
    
    for (const file of pageFiles) {
      const relativePath = path.relative(pagesDir, file);
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      
      if (ext === '.astro' || ext === '.ts') {
        let urlPath = relativePath.replace(/\\/g, '/');
        urlPath = urlPath.replace(/\.[^.]+$/, '');
        
        if (baseName === 'index') {
          urlPath = urlPath.replace('/index', '');
        }
        
        if (urlPath.includes('[id]') || urlPath.includes('[category]')) {
          continue;
        }
        
        if (urlPath.startsWith('api/')) {
          continue;
        }
        
        if (urlPath.startsWith('auth/')) {
          urlPath = urlPath.replace('auth/', '');
        }
        
        const fullUrl = `${SITE_URL}/${urlPath}`;
        if (!urls.includes(fullUrl)) {
          urls.push(fullUrl);
        }
      }
    }
  }
  
  const newsDataPath = path.join(__dirname, '../src/data/news.ts');
  if (fs.existsSync(newsDataPath)) {
    const newsContent = fs.readFileSync(newsDataPath, 'utf-8');
    const idMatches = newsContent.match(/id:\s*['"]([^'"]+)['"]/g) || [];
    for (const match of idMatches) {
      const id = match.replace(/id:\s*['"]/g, '').replace(/['"]/g, '');
      urls.push(`${SITE_URL}/news/${id}`);
    }
  }
  
  const productsDataPath = path.join(__dirname, '../src/data/products.ts');
  if (fs.existsSync(productsDataPath)) {
    const productsContent = fs.readFileSync(productsDataPath, 'utf-8');
    const idMatches = productsContent.match(/id:\s*['"]([^'"]+)['"]/g) || [];
    for (const match of idMatches) {
      const id = match.replace(/id:\s*['"]/g, '').replace(/['"]/g, '');
      urls.push(`${SITE_URL}/products/${id}`);
    }
  }
  
  const languages = ['de', 'fr', 'es', 'ar'];
  const multiLangPages = ['about', 'products', 'news', 'service', 'contact', 'faq', 'search', 'sitemap'];
  
  for (const lang of languages) {
    for (const page of multiLangPages) {
      urls.push(`${SITE_URL}/${lang}/${page}`);
    }
  }
  
  return urls.filter(url => !url.endsWith('/'));
}

export function getAllSiteUrls(): string[] {
  const dynamicUrls = generateUrlsFromProject();
  
  const additionalUrls = [
    `${SITE_URL}/careers`,
    `${SITE_URL}/factory`,
    `${SITE_URL}/downloads`,
    `${SITE_URL}/returns`,
    `${SITE_URL}/privacy`,
    `${SITE_URL}/terms`,
    `${SITE_URL}/cookies`,
    `${SITE_URL}/support`,
    `${SITE_URL}/agent`,
    `${SITE_URL}/dashboard`,
    `${SITE_URL}/google-setup`,
    `${SITE_URL}/shipping`
  ];
  
  const langUrls = ['de', 'fr', 'es', 'ar'].flatMap(lang => 
    ['careers', 'factory', 'downloads', 'returns', 'privacy', 'terms', 'cookies', 'support', 'agent', 'dashboard', 'shipping'].map(page => 
      `${SITE_URL}/${lang}/${page}`
    )
  );
  
  return [...new Set([...dynamicUrls, ...additionalUrls, ...langUrls])];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const urls = getAllSiteUrls();
  console.log(`Found ${urls.length} URLs to submit:`);
  urls.forEach(url => console.log(`  - ${url}`));
  submitToIndexNow(urls);
}

export { SITE_URL, INDEXNOW_API_KEY };
