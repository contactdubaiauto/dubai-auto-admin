import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    allowedHosts: true,
    port: 3333
  },
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: '@ui', replacement: '/src/shared/ui' }
    ]
  }
})
