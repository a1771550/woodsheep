import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 環境變數未設定！請檢查 .env.local 檔案')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
