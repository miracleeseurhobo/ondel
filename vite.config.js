import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // host: true exposes the dev server on the LAN so phones/tablets on the same
  // Wi-Fi can load it at http://<your-mac-ip>:5173
  server: { host: true },
})
