import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/woodsheep/', // ✅ GitHub Pages 需要這個前綴
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist/frontend', // ✅ 前台輸出目錄
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      // 只打包前台路由
      input: 'index.html',
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
  },
})
