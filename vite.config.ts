import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const TURNKEY_API_PRIVATE_KEY = env.VITE_TURNKEY_API_PRIVATE_KEY;
  const TURNKEY_API_PUBLIC_KEY = env.VITE_TURNKEY_API_PUBLIC_KEY;
  const ORGANIZATION_ID = env.VITE_ORGANIZATION_ID;
  const BASE_URL = env.VITE_BASE_URL;

  return {
    plugins: [react()],
    define: {
      'process.env': {
        NEXT_PUBLIC_ORGANIZATION_ID: ORGANIZATION_ID,
        TURNKEY_API_PUBLIC_KEY,
        TURNKEY_API_PRIVATE_KEY,
        NEXT_PUBLIC_BASE_URL: BASE_URL
      }
    },
    preview: {
      host: '0.0.0.0'
    }
  }
})
