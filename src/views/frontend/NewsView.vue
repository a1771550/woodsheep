<template>
  <div class="news-view">
    <div class="container">
      <div class="page-header">
        <h1>市场动态</h1>
        <p>最新楼市资讯，把握市场脉搏</p>
      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="city-filter">
          <button
            v-for="city in cityOptions"
            :key="city.value"
            :class="['filter-btn', { active: selectedCity === city.value }]"
            @click="filterByCity(city.value)"
          >
            {{ city.name }}
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="articles.length === 0" class="empty-state">
        <p>暂无新闻</p>
      </div>

      <!-- 新闻列表 -->
      <div v-else class="news-list">
        <div v-for="article in articles" :key="article.id" class="news-item">
          <div class="news-image">
            <img
              :src="article.image_url || defaultImage"
              :alt="article.title"
              @error="handleImageError"
            />
          </div>
          <div class="news-content">
            <div class="news-meta">
              <span class="news-date">{{ formatDate(article.published_date) }}</span>
              <span class="news-city">{{ article.city }}</span>
            </div>
            <h3 class="news-title">
              <a :href="article.source_url" target="_blank" rel="noopener noreferrer">
                {{ article.title }}
              </a>
            </h3>
            <p class="news-excerpt">{{ article.excerpt || article.title }}</p>
            <a :href="article.source_url" target="_blank" class="news-link">
              阅读全文 <span class="arrow">→</span>
            </a>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
        <button class="page-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
          上一页
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsStore } from '@/stores/newsStore'
import { supabase } from '@/services/supabase'
import { formatDate, handleImageError, defaultImage } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()

const articles = ref([])
const loading = ref(true)
const selectedCity = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = 10

// 城市选项
const cityOptions = computed(() => {
  const cities = new Set()
  newsStore.allArticles.forEach((article) => {
    if (article.city) cities.add(article.city)
  })
  return [
    { name: '全部', value: '' },
    ...Array.from(cities).map((city) => ({ name: city, value: city })),
  ]
})

// 加载新闻
const loadNews = async () => {
  loading.value = true

  let query = supabase
    .from('news_articles')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('published_date', { ascending: false })

  if (selectedCity.value) {
    query = query.eq('city', selectedCity.value)
  }

  const from = (currentPage.value - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  const { data, count, error } = await query.range(from, to)

  if (!error) {
    articles.value = data || []
    totalPages.value = Math.ceil(count / itemsPerPage)
  }

  loading.value = false
}

// 按城市筛选
const filterByCity = (city) => {
  selectedCity.value = city
  currentPage.value = 1
  loadNews()
  router.push({ query: { city: city || undefined } })
}

// 跳转页面
const goToPage = (page) => {
  currentPage.value = page
  loadNews()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 从 URL 读取筛选参数
const initFilters = () => {
  if (route.query.city) {
    selectedCity.value = route.query.city
  }
}

onMounted(() => {
  initFilters()
  loadNews()
})
</script>

<style scoped>
.news-view {
  padding: 40px 0;
  min-height: 70vh;
}

.container {
  max-width: 1000px;
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

/* 筛选栏 */
.filter-bar {
  margin-bottom: 30px;
  text-align: center;
}

.city-filter {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 20px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* 新闻列表 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.news-item {
  display: flex;
  gap: 20px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s;
}

.news-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.news-image {
  flex-shrink: 0;
  width: 200px;
  height: 150px;
  overflow: hidden;
  background: #f0f0f0;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-content {
  flex: 1;
  padding: 15px 15px 15px 0;
}

.news-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #999;
}

.news-city {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: 12px;
}

.news-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.news-title a {
  color: #333;
  text-decoration: none;
}

.news-title a:hover {
  color: var(--color-primary);
}

.news-excerpt {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 14px;
}

.news-link:hover {
  text-decoration: underline;
}

.arrow {
  display: inline-block;
  transition: transform 0.3s;
}

.news-link:hover .arrow {
  transform: translateX(4px);
}

/* 分页 */
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
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

/* 加载和空状态 */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--color-primary);
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

/* 响应式 */
@media (max-width: 768px) {
  .news-item {
    flex-direction: column;
  }

  .news-image {
    width: 100%;
    height: 180px;
  }

  .news-content {
    padding: 15px;
  }

  .page-header h1 {
    font-size: 28px;
  }
}
</style>
