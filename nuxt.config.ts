import { defineNuxtConfig } from 'nuxt/config'

const runtimeEnv = (globalThis as {
  process?: { env?: Record<string, string | undefined> }
}).process?.env ?? {}

const nitroPreset = runtimeEnv.NITRO_PRESET ?? (runtimeEnv.VERCEL ? 'vercel' : 'node-server')

export default defineNuxtConfig({
  compatibilityDate: '2025-12-01',
  
  app: {
    baseURL: runtimeEnv.NUXT_APP_BASE_URL ?? '/'
  },

  srcDir: 'src',
  serverDir: 'src/server',
  modules: ['@pinia/nuxt', 'nuxtjs-naive-ui'],
  css: ['@/assets/theme.css'],

  routeRules: {
    '/**': { swr: 1800 },
    '/sitemap.xml': { swr: 1800 }
  },

  runtimeConfig: {
    public: {
      siteUrl: runtimeEnv.NUXT_PUBLIC_SITE_URL ?? 'https://plugins.astrbot.app'
    }
  },
  imports: {
    dirs: ['stores']
  },
  build: {
    transpile: ['@giscus/vue', 'naive-ui', 'vueuc', '@css-render/vue3-ssr']
  },
  vite: {
    ssr: {
      noExternal: ['naive-ui', 'vueuc']
    },
    build: {
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        output: {
          manualChunks: {
            'naive-ui': ['naive-ui', 'vueuc', '@css-render/vue3-ssr'],
            giscus: ['@giscus/vue'],
            highlight: ['highlight.js']
          }
        }
      }
    }
  },
  
  nitro: {
    preset: nitroPreset,
    future: {
      nativeSWR: true
    },

    prerender: {
      routes: ['/robots.txt'] 
    }
  }
})
