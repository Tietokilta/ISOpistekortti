import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../');

  return {
    envDir: '../',
    plugins: [
      tailwindcss(),
      react()
    ],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_URL || 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    }
  }
})
