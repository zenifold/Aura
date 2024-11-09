import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5225
  },
  build: {
    outDir: 'build',
    assetsDir: 'assets'
  }
})
