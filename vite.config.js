import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
  base: '/woodsheep/', // ← BASE_URL 會自動等於這個值
  build: {
    // 确保构建输出结构清晰
    outDir: 'dist',
    assetsDir: 'assets', // 资源文件会输出到 dist/assets/
    // 清理旧构建（Windows 兼容）
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // 確保輸出的檔案使用 UTF-8
        banner: '/*! UTF-8 */',
      },
    },
  },
  // ✅ 確保生產環境載入 .env.production
  envDir: '.',
})
