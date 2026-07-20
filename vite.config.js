import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue()
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
