import events from './app/data/events.json'
import laws from './app/data/laws.json'
import pages from './app/data/pages.json'
import timelines from './app/data/timelines.json'

/** Усі сторінки архіву — щоб генерація не залежала лише від обходу посилань. */
const routes = [
  '/', '/materials/', '/print-and-share/', '/laws-that-have-been-violated/',
  ...timelines.map((t) => t.path),
  ...pages.map((p) => p.path),
  ...events.map((e) => e.path),
  ...laws.items.map((l) => l.path),
]

export default defineNuxtConfig({
  compatibilityDate: '2025-08-01',
  devtools: { enabled: false },
  modules: ['@nuxt/fonts', '@nuxtjs/sitemap'],

  // Повністю статичний сайт: `npm run generate` -> .output/public
  ssr: true,

  site: {
    url: 'https://slobidka.info',
    name: 'Микільсько-Слобідська.info',
  },

  sitemap: {
    // службова сторінка, з якої збирається 404.html
    exclude: ['/not-found'],
  },

  css: ['~/assets/css/main.css'],

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700],
      subsets: ['cyrillic-ext', 'cyrillic', 'latin-ext', 'latin'],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'uk' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0e1013' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      script: [
        {
          // ставимо тему до першого малювання, щоб не блимало світлим
          innerHTML:
            "(function(){try{var t=localStorage.getItem('slobidka-theme');"
            + "if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';"
            + "document.documentElement.dataset.theme=t}catch(e){}})()",
          tagPosition: 'head',
        },
      ],
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [...new Set([...routes, '/not-found/', '/sitemap.xml'])],
      failOnError: false,
    },
  },

  experimental: { payloadExtraction: true },
})
