import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

export const useCarouselStore = defineStore('carousel', () => {
  const slides = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 獲取所有輪播圖（按 order_index 排序）
  const fetchSlides = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('carousel_slides')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (err) throw err
      slides.value = data || []
      console.log(`📦 已載入 ${slides.value.length} 個輪播圖`)
    } catch (err) {
      error.value = err.message
      console.error('❌ 載入輪播圖失敗:', err)
    } finally {
      loading.value = false
    }
  }

  // 管理員：獲取所有輪播圖（包括未啟用的）
  const fetchAllSlides = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('carousel_slides')
        .select('*')
        .order('order_index', { ascending: true })

      if (err) throw err
      slides.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('❌ 載入失敗:', err)
    } finally {
      loading.value = false
    }
  }

  // 新增輪播圖
  const addSlide = async (slideData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('carousel_slides')
        .insert([slideData])
        .select()

      if (err) throw err
      if (data && data.length > 0) {
        slides.value.push(data[0])
        console.log('✅ 新增輪播圖成功')
        return data[0]
      }
    } catch (err) {
      error.value = err.message
      console.error('❌ 新增失敗:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新輪播圖
  const updateSlide = async (id, updates) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('carousel_slides')
        .update({ ...updates, updated_at: new Date() })
        .eq('id', id)
        .select()

      if (err) throw err
      if (data && data.length > 0) {
        const index = slides.value.findIndex((s) => s.id === id)
        if (index !== -1) slides.value[index] = data[0]
        console.log('✅ 更新輪播圖成功')
        return data[0]
      }
    } catch (err) {
      error.value = err.message
      console.error('❌ 更新失敗:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 刪除輪播圖
  const deleteSlide = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { error: err } = await supabase.from('carousel_slides').delete().eq('id', id)

      if (err) throw err
      slides.value = slides.value.filter((s) => s.id !== id)
      console.log('✅ 刪除輪播圖成功')
    } catch (err) {
      error.value = err.message
      console.error('❌ 刪除失敗:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    slides,
    loading,
    error,
    fetchSlides,
    fetchAllSlides,
    addSlide,
    updateSlide,
    deleteSlide,
  }
})
