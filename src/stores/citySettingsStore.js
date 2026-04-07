import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

export const useCitySettingsStore = defineStore('citySettings', () => {
  const cities = ref([])
  const loading = ref(false)

  // 獲取所有城市設置（管理員用）
  const fetchAllCities = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('city_settings')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      cities.value = data || []
      return cities.value
    } catch (error) {
      console.error('載入失敗:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  // 獲取所有啟用的城市（前台用）
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
      return cities.value
    } catch (error) {
      console.error('載入失敗:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  // 更新城市
  const updateCity = async (id, updates) => {
    console.log('updateCity 被調用:', { id, updates })
    try {
      const { data, error } = await supabase
        .from('city_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()

      console.log('Supabase 返回:', { data, error })

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

  // 分頁參數
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalCount = ref(0)
  const pageSize = ref(10)

  // 分頁獲取所有城市
  const fetchAllCitiesPaginated = async (page = 1) => {
    loading.value = true
    currentPage.value = page

    try {
      // 先獲取總數
      const { count, error: countError } = await supabase
        .from('city_settings')
        .select('*', { count: 'exact', head: true })

      if (countError) throw countError
      totalCount.value = count
      totalPages.value = Math.ceil(count / pageSize.value)

      // 獲取分頁數據
      const from = (page - 1) * pageSize.value
      const to = from + pageSize.value - 1

      const { data, error } = await supabase
        .from('city_settings')
        .select('*')
        .order('display_order', { ascending: true })
        .range(from, to)

      if (error) throw error
      cities.value = data || []
    } catch (error) {
      console.error('載入失敗:', error)
    } finally {
      loading.value = false
    }
  }

  // 改變每頁數量
  const setPageSize = async (size) => {
    pageSize.value = size
    await fetchAllCitiesPaginated(1)
  }

  return {
    cities,
    loading,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    fetchCities,
    fetchAllCities,
    fetchAllCitiesPaginated,
    setPageSize,
    updateCity,
    addCity,
    deleteCity,
  }
})
