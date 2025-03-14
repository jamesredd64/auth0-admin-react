import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all local IPs
    port: 5174,
    strictPort: true,
    open: true // Automatically open the browser
  },
  css: {
    postcss: './postcss.config.cjs',
  },
})
