import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5173,
    // If it hits CORS in dev, uncomment to proxy API calls to the dts-api:
    // proxy: {
    // '/_dts': { target: process.env.VITE_DTS_BASE_URL || 'http://localhost:5000', changeOrigin: true, rewrite: p => p.replace(/^\/_dts/, '') }
    // }
  },
  build: {
    rollupOptions: {
      output: {
        // Ensure locale files are properly chunked and not tree-shaken
        manualChunks: (id) => {
          if (id.includes('/locales/')) {
            return 'locales'
          }
        }
      }
    }
  },
  define: {
    // Vue i18n v9 feature flags
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  }
})
