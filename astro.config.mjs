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
        'https://vitchakorn.com/project/ddschatbot.html',
        'https://vitchakorn.com/project/altit.html',
        'https://vitchakorn.com/project/yfmalaria.html',
        'https://vitchakorn.com/project/hospcode.html',
        'https://vitchakorn.com/project/hajjmens.html',
        'https://vitchakorn.com/project/pm2-5.html',
        'https://vitchakorn.com/project/cirrhosis.html',
        'https://vitchakorn.com/project/th-numeral.html',
        'https://vitchakorn.com/project/bnk48.html',
        'https://vitchakorn.com/project/cda2558.html',
        'https://vitchakorn.com/project/sichuan-yunnan.html',
        'https://vitchakorn.com/project/countries-tiny.html'
      ]
    })
  ]
});