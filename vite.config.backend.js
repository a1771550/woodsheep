import { defineConfig } from 'vite'
export default defineConfig({
  base: '/', // Vercel/Netlify 用根路徑
  build: { outDir: 'dist/admin' },
})
