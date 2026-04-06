import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

// 默認設定
const defaultSettings = {
  siteName: '木羊物业',
  siteSlogan: '专业地产服务，连接美好生活',
  contactPhone: '0756-xxxxxxx',
  contactEmail: 'contact@muyangproperty.com',
  contactAddress: '香港屯门 / 珠海香洲',
  carouselInterval: 5,
  carouselAutoPlay: true,
  itemsPerPage: 12,
  featuredCount: 4,
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({ ...defaultSettings })
  const loading = ref(false)

  // 載入設定
  const fetchSettings = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'site_settings')
        .maybeSingle()

      if (error) throw error

      if (data && data.value) {
        // ✅ 正確合併數據庫的設定
        console.log('📦 從數據庫載入的設定:', data.value)
        settings.value = { ...defaultSettings, ...data.value }
        console.log('📦 合併後的設定:', settings.value)
      } else {
        console.log('📦 無數據庫設定，使用默認值')
      }
    } catch (error) {
      console.error('載入設定失敗:', error)
    } finally {
      loading.value = false
    }
  }

  // 保存設定
  const saveSettings = async (newSettings) => {
    loading.value = true
    try {
      // 先檢查是否存在
      const { data: existing, error: checkError } = await supabase
        .from('settings')
        .select('id')
        .eq('key', 'site_settings')
        .maybeSingle()

      if (checkError) throw checkError

      let result
      if (existing) {
        // 更新現有記錄
        result = await supabase
          .from('settings')
          .update({
            value: newSettings,
            updated_at: new Date().toISOString(),
          })
          .eq('key', 'site_settings')
      } else {
        // 插入新記錄
        result = await supabase.from('settings').insert({
          key: 'site_settings',
          value: newSettings,
          updated_at: new Date().toISOString(),
        })
      }

      if (result.error) throw result.error

      // ✅ 更新本地狀態
      settings.value = { ...defaultSettings, ...newSettings }
      console.log('✅ 設定已保存:', settings.value)
      return true
    } catch (error) {
      console.error('保存設定失敗:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // 重置設定
  const resetSettings = async () => {
    return await saveSettings({ ...defaultSettings })
  }

  return {
    settings,
    loading,
    fetchSettings,
    saveSettings,
    resetSettings,
  }
})
