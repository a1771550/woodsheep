// stores/propertyStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

export const usePropertyStore = defineStore('property', () => {
  const properties = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 獲取所有項目
  const fetchProperties = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('properties')
        .select('*')
        .order('updated_at', { ascending: false }) // ✅ 按更新時間排序

      if (err) throw err
      properties.value = data || []
      console.log(`📦 已載入 ${properties.value.length} 個樓盤`)
    } catch (err) {
      error.value = err.message
      console.error('❌ 載入失敗:', err)
    } finally {
      loading.value = false
    }
  }

  // 新增項目
  const addProperty = async (propertyData) => {
    loading.value = true
    error.value = null

    try {
      const now = new Date().toISOString()
      const { data, error: err } = await supabase
        .from('properties')
        .insert([
          {
            name: propertyData.name,
            city: propertyData.city,
            size: propertyData.size,
            price: propertyData.price,
            contact: propertyData.contact,
            status: propertyData.status || '待跟进',
            source: propertyData.source || '手动添加',
            tags: propertyData.tags || [],
            images: propertyData.images || [],
            description: propertyData.description || '',
            created_at: now,
            updated_at: now, // ✅ 添加更新時間
          },
        ])
        .select()

      if (err) throw err
      if (data && data.length > 0) {
        properties.value.unshift(data[0])
        console.log('✅ 新增成功:', data[0].name)
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

  // 更新項目
  const updateProperty = async (id, updates) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('properties')
        .update({
          ...updates,
          updated_at: new Date().toISOString(), // ✅ 自動更新修改時間
        })
        .eq('id', id)
        .select()

      if (err) throw err
      if (data && data.length > 0) {
        const index = properties.value.findIndex((p) => p.id === id)
        if (index !== -1) {
          properties.value[index] = data[0]
        }
        console.log('✅ 更新成功:', data[0].name)
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

  // 刪除項目
  const deleteProperty = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { error: err } = await supabase.from('properties').delete().eq('id', id)

      if (err) throw err
      properties.value = properties.value.filter((p) => p.id !== id)
      console.log('✅ 刪除成功，ID:', id)
    } catch (err) {
      error.value = err.message
      console.error('❌ 刪除失敗:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 根據 ID 獲取項目
  const getProjectById = (id) => {
    return properties.value.find((p) => p.id === id)
  }

  return {
    properties,
    loading,
    error,
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
    getProjectById,
  }
})
