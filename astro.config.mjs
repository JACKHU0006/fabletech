import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.fabletech.cc.cd',
  output: 'static',
  integrations: [],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr', 'es', 'ar'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    assets: '_astro',
  },
});
