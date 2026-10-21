import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The dev server forwards any request starting with "/api" to the
  // backend Express server. This lets the frontend use simple addresses
  // like "/api/products" and avoids CORS problems entirely.
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
