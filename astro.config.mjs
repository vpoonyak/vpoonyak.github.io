// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://vitchakorn.com',
  integrations: [
    sitemap({
      customPages: [
        'https://vitchakorn.com/credentials.html',
        'https://vitchakorn.com/project/',
        'https://vitchakorn.com/project/ddschatbot/',
        'https://vitchakorn.com/project/altit/',
        'https://vitchakorn.com/project/yfmalaria/',
        'https://vitchakorn.com/project/hospcode/',
        'https://vitchakorn.com/project/hajjmens/',
        'https://vitchakorn.com/project/pm2-5/',
        'https://vitchakorn.com/project/cirrhosis/',
        'https://vitchakorn.com/project/th-numeral/',
        'https://vitchakorn.com/project/bnk48/',
        'https://vitchakorn.com/project/cda2558/',
        'https://vitchakorn.com/project/sichuan-yunnan/',
        'https://vitchakorn.com/project/countries-tiny/'
      ]
    })
  ]
});