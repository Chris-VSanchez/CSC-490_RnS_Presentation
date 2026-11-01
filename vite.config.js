import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // three.js is ~740 kB but only loads when the 3D slide opens (dynamic import)
  build: { chunkSizeWarningLimit: 800 },
})
