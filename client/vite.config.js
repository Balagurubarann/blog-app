import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:5173/',
        }
      }
    }
  },
})
