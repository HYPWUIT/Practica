import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Same-origin in development: the auth cookie works without CORS.
    // API_URL lets the end-to-end tests point a second client at their own
    // API instance.
    proxy: {
      '/api': process.env.API_URL ?? 'http://localhost:3000',
    },
  },
})
