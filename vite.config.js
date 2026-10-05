import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      // Custom worker (src/sw.js): Workbox precaching + Firebase Messaging
      // merged in one file so push notifications never evict the PWA worker.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,png,svg,jpg,ico}'],
      },
      includeAssets: [
        'icons/favicon.svg',
        'icons/apple-touch-icon.png',
        'icons/icon-192.png',
        'icons/icon-512.png',
      ],
      manifest: {
        name: 'Silangan Christian Fellowship',
        short_name: 'SCF',
        description: 'SCF Ecommerce — faith-inspired apparel from Silangan Christian Fellowship.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#fafafa',
        theme_color: '#171717',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'vendor-firebase'
            }
            // vue-chartjs's own package path doesn't contain the literal
            // substring "chart.js" (no dot), so match both explicitly —
            // otherwise it (and the chart.js core it pulls in) silently
            // falls through to the generic vendor chunk, which is eagerly
            // preloaded on every route instead of only the dashboard.
            if (id.includes('chart.js') || id.includes('vue-chartjs')) {
              return 'vendor-charts'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})
