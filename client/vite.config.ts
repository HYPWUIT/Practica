import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Same-origin in development: the auth cookie works without CORS.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
