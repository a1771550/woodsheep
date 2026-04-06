import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

export const useCitySettingsStore = defineStore('citySettings', () => {
  const cities = ref([])
  const loading = ref(false)

  // 獲取所有城市設置
  const fetchCities = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('city_settings')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      cities.value = data || []
    } catch (error) {
      console.error('載入城市設置失敗:', error)
    } finally {
      loading.value = false
    }
  }

  // 管理員：獲取所有城市（包括未啟用）
  const fetchAllCities = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('city_settings')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      cities.value = data || []
    } catch (error) {
      console.error('載入失敗:', error)
    } finally {
      loading.value = false
    }
  }

  // 更新城市
  const updateCity = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('city_settings')
        .update({ ...updates, updated_at: new Date() })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('更新失敗:', error)
      return false
    }
  }

  // 添加城市
  const addCity = async (cityData) => {
    try {
      const { error } = await supabase.from('city_settings').insert([cityData])

      if (error) throw error
      await fetchAllCities()
      return true
    } catch (error) {
      console.error('添加失敗:', error)
      return false
    }
  }

  // 刪除城市
  const deleteCity = async (id) => {
    try {
      const { error } = await supabase.from('city_settings').delete().eq('id', id)

      if (error) throw error
      await fetchAllCities()
      return true
    } catch (error) {
      console.error('刪除失敗:', error)
      return false
    }
  }

  return {
    cities,
    loading,
    fetchCities,
    fetchAllCities,
    updateCity,
    addCity,
    deleteCity,
  }
})
