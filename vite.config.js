import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // ✅ 使用 loadEnv 從 .env.local 載入環境變數
  const env = loadEnv(mode, process.cwd(), '')

  const supabaseUrl = env.VITE_SUPABASE_URL
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY

  // 調試輸出
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
