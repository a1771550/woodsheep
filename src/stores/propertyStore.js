// stores/propertyStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePropertyStore = defineStore('property', () => {
  // state
  const properties = ref([])
  const loading = ref(false)
  const error = ref(null)

  // ========================================
  // 初始化示例数据（首次运行时调用）
  // ========================================
  const initSampleData = () => {
    const sampleProperties = [
      {
        id: 1,
        name: '盛东·江山赋',
        city: '珠海',
        size: '约155-325㎡',
        price: '35000-45000元/m²',
        contact: '林经理 138****8888',
        status: '在售',
        tags: ['山海湖园', '藏品级', '大平层'],
        images: [
          '/images/properties/zhuhai/jiangshanfu-1.jpg',
          '/images/properties/zhuhai/jiangshanfu-2.jpg',
        ],
        description: '山海湖园藏品级资产，约155-325㎡主城云顶大宅',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: '华发·云玺',
        city: '珠海',
        size: '约50万㎡社区',
        price: '待询价',
        contact: '王小姐 139****9999',
        status: '待跟进',
        tags: ['港湾生活', '一线半山', '海景奢宅'],
        images: ['/images/properties/zhuhai/yunxi-1.jpg', '/images/properties/zhuhai/yunxi-2.jpg'],
        description: '约50万㎡港湾生活社区，一线半山海景奢宅',
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: '时代都荟大境',
        city: '珠海',
        size: '两房75㎡起',
        price: '65万起',
        contact: '张顾问 136****7777',
        status: '已推荐',
        tags: ['百万大盘', '新加坡推片区'],
        images: [
          '/images/properties/zhuhai/shidai-1.jpg',
          '/images/properties/zhuhai/shidai-2.jpg',
        ],
        description: '百万大盘·时代都荟大境，新加坡推片区唯一',
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: '遠洋繁花里',
        city: '中山',
        size: '多种户型',
        price: '待询价',
        contact: '陈经理 135****6666',
        status: '在售',
        tags: ['香港热卖王', '直通车'],
        images: [
          '/images/properties/zhongshan/fanhuali-1.jpg',
          '/images/properties/zhongshan/fanhuali-2.jpg',
        ],
        description: '香港熱賣王，社區自帶香港直通车（已開通）',
        createdAt: new Date().toISOString(),
      },
      {
        id: 5,
        name: '中澳·湖心印象',
        city: '中山',
        size: '86-116㎡',
        price: '12000元/m²',
        contact: '李小姐 137****5555',
        status: '在售',
        tags: ['湖景房', '智慧社区'],
        images: [
          '/images/properties/zhongshan/huxin-1.jpg',
          '/images/properties/zhongshan/huxin-2.jpg',
        ],
        description: '湖心新城核心，智慧精装社区',
        createdAt: new Date().toISOString(),
      },
    ]

    // 保存到 localStorage
    localStorage.setItem('property_projects', JSON.stringify(sampleProperties))
    properties.value = sampleProperties

    console.log('✅ 示例数据初始化完成')
  }
  // actions
  // ========================================
  // 获取数据（如果为空则自动初始化）
  // ========================================
  const fetchProperties = async () => {
    loading.value = true
    error.value = null

    try {
      const stored = localStorage.getItem('property_projects')

      if (stored) {
        // 有数据，直接使用
        properties.value = JSON.parse(stored)
        console.log(`📦 加载 ${properties.value.length} 个楼盘`)
      } else {
        // 没有数据，自动初始化
        console.log('🆕 首次运行，初始化示例数据')
        initSampleData()
      }
    } catch (err) {
      error.value = err.message
      console.error('❌ 加载失败:', err)
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
