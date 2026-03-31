import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 從 process.env 讀取環境變數（GitHub Actions 會注入）
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  // 調試輸出（在 GitHub Actions 日誌中可見）
  console.log('🔧 建置模式:', mode)
  console.log('🔑 VITE_SUPABASE_URL 存在:', !!supabaseUrl)
  console.log('🔑 VITE_SUPABASE_ANON_KEY 存在:', !!supabaseKey)

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 3000,
    },
    base: '/woodsheep/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          banner: '/*! UTF-8 */',
        },
      },
    },
    // ✅ 將環境變數注入到客戶端
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
    },
  }
})
