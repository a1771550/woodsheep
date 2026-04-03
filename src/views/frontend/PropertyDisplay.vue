<template>
  <div class="property-display">
    <div class="container">
      <!-- 頁面標題 -->
      <div class="page-header">
        <h1>樓盤展示</h1>
        <p>精選珠海、中山優質房源</p>
      </div>

      <!-- 篩選欄 -->
      <div class="filter-bar">
        <div class="search-box">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索樓盤名稱..."
            @input="handleSearch"
          />
          <button @click="clearSearch" v-if="searchKeyword">✕</button>
        </div>

        <div class="city-tabs">
          <button
            v-for="city in cities"
            :key="city.value"
            :class="['city-tab', { active: selectedCity === city.value }]"
            @click="filterByCity(city.value)"
          >
            {{ city.name }}
            <span class="count">{{ getCityCount(city.value) }}</span>
          </button>
        </div>
      </div>

      <!-- 加載狀態 -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>加載中...</p>
      </div>

      <!-- 空狀態 -->
      <div v-else-if="filteredProperties.length === 0" class="empty-state">
        <p>暫無樓盤數據</p>
        <router-link to="/contact" class="btn btn-primary">聯繫我們</router-link>
      </div>

      <!-- 樓盤網格 -->
      <div v-else class="properties-grid">
        <PropertyCard
          v-for="property in paginatedProperties"
          :key="property.id"
          :property="property"
          @click="viewProperty(property)"
        />
      </div>

      <!-- 分頁 -->
      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--" class="page-btn">
          上一頁
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="currentPage++" class="page-btn">
          下一頁
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/propertyStore'
import PropertyCard from '@/components/frontend/PropertyCard.vue'

const route = useRoute()
const router = useRouter()
const propertyStore = usePropertyStore()

// 狀態
const loading = ref(true)
const searchKeyword = ref('')
const selectedCity = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

// ✅ 動態獲取城市選項（從數據庫中所有有樓盤的城市）
const cities = computed(() => {
  const properties = propertyStore.properties || []

  // 獲取所有不重複的城市
  const uniqueCities = [...new Set(properties.map((p) => p.city).filter((city) => city))]

  // 轉換為選項格式，並按城市名稱排序
  const cityOptions = uniqueCities
    .map((city) => ({
      name: city,
      value: city,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  // 在開頭添加「全部」選項
  return [{ name: '全部', value: '' }, ...cityOptions]
})

// 獲取城市樓盤數量（用於顯示）
const getCityCount = (city) => {
  if (!city) return propertyStore.properties?.length || 0
  return propertyStore.properties?.filter((p) => p.city === city).length || 0
}

// 其他方法保持不變...
const filteredProperties = computed(() => {
  let properties = propertyStore.properties || []

  if (selectedCity.value) {
    properties = properties.filter((p) => p.city === selectedCity.value)
  }

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    properties = properties.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        (p.description && p.description.toLowerCase().includes(keyword)),
    )
  }

  return properties
})

const totalPages = computed(() => {
  return Math.ceil(filteredProperties.value.length / itemsPerPage)
})

const paginatedProperties = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProperties.value.slice(start, end)
})

const filterByCity = (city) => {
  selectedCity.value = city
  currentPage.value = 1
  router.push({ query: { ...route.query, city: city || undefined } })
}

const handleSearch = () => {
  currentPage.value = 1
}

const clearSearch = () => {
  searchKeyword.value = ''
  currentPage.value = 1
}

const viewProperty = (property) => {
  router.push(`/properties/${property.id}`)
}

const initFilters = () => {
  if (route.query.city) {
    selectedCity.value = route.query.city
  }
}

const loadProperties = async () => {
  loading.value = true
  await propertyStore.fetchProperties()
  loading.value = false
}

watch(
  () => route.query.city,
  (newCity) => {
    if (newCity !== selectedCity.value) {
      selectedCity.value = newCity || ''
      currentPage.value = 1
    }
  },
)

onMounted(async () => {
  initFilters()
  await loadProperties()
})
</script>

<style scoped>
.property-display {
  padding: 40px 0;
  min-height: 70vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 18px;
  color: #666;
}

/* 篩選欄 */
.filter-bar {
  margin-bottom: 40px;
}

.search-box {
  position: relative;
  max-width: 400px;
  margin: 0 auto 20px;
}

.search-box input {
  width: 100%;
  padding: 12px 40px 12px 20px;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: #2c8bff;
  box-shadow: 0 0 0 3px rgba(44, 139, 255, 0.1);
}

.search-box button {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
}

.city-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.city-tab {
  padding: 10px 24px;
  background: #f8f9fa;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.city-tab:hover {
  background: #e7f1ff;
}

.city-tab.active {
  background: #2c8bff;
  color: white;
}

.city-tab .count {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  opacity: 0.7;
}

/* 加載狀態 */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px;
  color: #666;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2c8bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 樓盤網格 */
.properties-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-bottom: 40px;
}

/* 分頁 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.page-btn {
  padding: 8px 20px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #2c8bff;
  color: white;
  border-color: #2c8bff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

/* 響應式 */
@media (max-width: 1024px) {
  .properties-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .properties-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .city-tab {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
