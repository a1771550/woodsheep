// stores/propertyStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePropertyStore = defineStore('property', () => {
  // state
  const properties = ref([])
  const loading = ref(false)
  const error = ref(null)

  // actions
  const fetchProperties = async () => {
    loading.value = true
    error.value = null

    try {
      // 从 localStorage 获取数据
      const stored = localStorage.getItem('property_projects')
      properties.value = stored ? JSON.parse(stored) : []
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch properties:', err)
    } finally {
      loading.value = false
    }
  }

  const addProperty = async (propertyData) => {
    try {
      const newProperty = {
        id: Date.now(),
        ...propertyData,
        createdAt: new Date().toISOString(),
      }

      properties.value.push(newProperty)
      await saveToStorage()

      return newProperty
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateProperty = async (id, updatedData) => {
    try {
      const index = properties.value.findIndex((p) => p.id === id)
      if (index === -1) throw new Error('Property not found')

      properties.value[index] = {
        ...properties.value[index],
        ...updatedData,
        updatedAt: new Date().toISOString(),
      }

      await saveToStorage()

      return properties.value[index]
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteProperty = async (id) => {
    try {
      properties.value = properties.value.filter((p) => p.id !== id)
      await saveToStorage()
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // 保存到 localStorage
  const saveToStorage = () => {
    localStorage.setItem('property_projects', JSON.stringify(properties.value))
  }

  // getters (computed)
  const getPropertyById = (id) => {
    return properties.value.find((p) => p.id === id)
  }

  const getPropertiesByCity = (city) => {
    return properties.value.filter((p) => p.city === city)
  }

  const getPropertiesByStatus = (status) => {
    return properties.value.filter((p) => p.status === status)
  }

  return {
    // state
    properties,
    loading,
    error,
    // actions
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
    // getters
    getPropertyById,
    getPropertiesByCity,
    getPropertiesByStatus,
  }
})
