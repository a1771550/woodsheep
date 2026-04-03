<template>
  <div class="home">
    <!-- ======================================== -->
    <!-- 1. HERO 全屏图片轮播（替代纯色背景） -->
    <!-- ======================================== -->
    <section class="hero-carousel">
      <div class="carousel-container">
        <!-- 轮播图片 -->
        <transition-group name="fade" tag="div" class="carousel-images">
          <div
            v-for="(slide, index) in heroSlides"
            :key="slide.id"
            v-show="currentSlide === index"
            class="carousel-slide"
            :style="{ backgroundImage: `url(${siteConfig.asset(slide.image)})` }"
          >
            <div class="carousel-overlay"></div>
            <div class="carousel-content">
              <span class="slide-tag">{{ slide.tag }}</span>
              <h1 class="slide-title">{{ slide.title }}</h1>
              <p class="slide-subtitle">{{ slide.subtitle }}</p>
              <div class="slide-actions">
                <router-link :to="slide.ctaLink" class="btn btn-primary btn-large">
                  {{ slide.ctaText }}
                </router-link>
                <router-link to="/contact" class="btn btn-outline btn-large">
                  联系顾问
                </router-link>
              </div>
            </div>
          </div>
        </transition-group>

        <!-- 轮播指示器 -->
        <div class="carousel-indicators">
          <button
            v-for="(slide, index) in heroSlides"
            :key="index"
            :class="['indicator', { active: currentSlide === index }]"
            @click="currentSlide = index"
          ></button>
        </div>

        <!-- 前后导航 -->
        <button class="carousel-prev" @click="prevSlide">←</button>
        <button class="carousel-next" @click="nextSlide">→</button>
      </div>
    </section>

    <!-- ======================================== -->
    <!-- 2. 快捷筛选栏（悬浮在轮播下方） -->
    <!-- ======================================== -->
    <section class="quick-filter">
      <div class="container">
        <div class="filter-card">
          <div class="filter-tabs">
            <button
              v-for="tab in filterTabs"
              :key="tab.value"
              :class="['filter-tab', { active: activeFilterTab === tab.value }]"
              @click="activeFilterTab = tab.value"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="filter-content">
            <div class="filter-row">
              <select v-model="filters.city" class="filter-select">
                <option value="">所有城市</option>
                <option value="珠海">珠海</option>
                <option value="中山">中山</option>
              </select>

              <select v-model="filters.price" class="filter-select">
                <option value="">价格范围</option>
                <option value="0-100">100万以下</option>
                <option value="100-200">100-200万</option>
                <option value="200-300">200-300万</option>
                <option value="300+">300万以上</option>
              </select>

              <select v-model="filters.area" class="filter-select">
                <option value="">面积</option>
                <option value="0-70">70㎡以下</option>
                <option value="70-100">70-100㎡</option>
                <option value="100-150">100-150㎡</option>
                <option value="150+">150㎡以上</option>
              </select>

              <button class="btn btn-primary btn-filter" @click="applyFilters">搜索房源</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================== -->
    <!-- 3. 数据看板（信任背书） -->
    <!-- ======================================== -->
    <section class="stats-panel">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">10+</div>
            <div class="stat-label">年行业经验</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ totalProperties }}</div>
            <div class="stat-label">在售楼盘</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ totalAgents }}</div>
            <div class="stat-label">专业顾问</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">1000+</div>
            <div class="stat-label">满意客户</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================== -->
    <!-- 4. 精选楼盘（网格布局） -->
    <!-- ======================================== -->
    <section class="featured-properties">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">精选楼盘</h2>
            <p class="section-subtitle">为您推荐珠海、中山优质房源</p>
          </div>
          <router-link to="/properties" class="view-all-link">
            查看全部 <span class="arrow">→</span>
          </router-link>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="featuredProperties.length === 0" class="empty-state">
          <p>暂无楼盘数据</p>
        </div>

        <div v-else class="property-grid">
          <PropertyCard
            v-for="property in featuredProperties"
            :key="property.id"
            :property="property"
            @click="viewProperty(property)"
          />
        </div>
      </div>
    </section>

    <!-- ======================================== -->
    <!-- 5. 热门城市/区域 -->
    <!-- ======================================== -->
    <section class="hot-cities">
      <div class="container">
        <h2 class="section-title">热门区域</h2>
        <p class="section-subtitle">探索珠海、中山核心板块</p>

        <div class="cities-grid">
          <div
            v-for="city in hotCities"
            :key="city.name"
            class="city-card"
            @click="filterByCity(city.name)"
          >
            <div
              class="city-image"
              :style="{ backgroundImage: `url(${siteConfig.asset(city.image)})` }"
            >
              <div class="city-overlay"></div>
              <div class="city-info">
                <h3 class="city-name">{{ city.name }}</h3>
                <p class="city-count">{{ city.count }}个楼盘</p>
                <span class="city-link">查看房源 →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================== -->
    <!-- 6. 购房指南/服务流程 -->
    <!-- ======================================== -->
    <section class="service-flow">
      <div class="container">
        <h2 class="section-title">购房服务流程</h2>
        <p class="section-subtitle">专业团队，全程陪伴</p>

        <div class="flow-grid">
          <div v-for="(step, index) in serviceSteps" :key="index" class="flow-step">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-icon">{{ step.icon }}</div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================== -->
    <!-- 7. 品牌承诺/特色优势 -->
    <!-- ======================================== -->
    <section class="brand-promise">
      <div class="container">
        <div class="promise-grid">
          <div class="promise-card" v-for="promise in brandPromises" :key="promise.title">
            <div class="promise-icon">{{ promise.icon }}</div>
            <h3 class="promise-title">{{ promise.title }}</h3>
            <p class="promise-desc">{{ promise.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================== -->
    <!-- 8. 最新资讯/市场动态 -->
    <!-- ======================================== -->
    <section class="latest-news">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">市场动态</h2>
            <p class="section-subtitle">最新楼市资讯</p>
          </div>
          <router-link to="/news" class="view-all-link">
            更多资讯 <span class="arrow">→</span>
          </router-link>
        </div>

        <div class="news-grid">
          <article v-for="news in latestNews" :key="news.id" class="news-card">
            <div class="news-image">
              <img :src="siteConfig.asset(news.image)" :alt="news.title" />
            </div>
            <div class="news-content">
              <span class="news-date">{{ news.date }}</span>
              <h3 class="news-title">{{ news.title }}</h3>
              <p class="news-excerpt">{{ news.excerpt }}</p>
              <router-link :to="news.link" class="news-link">阅读全文</router-link>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/propertyStore'
import PropertyCard from '@/components/frontend/PropertyCard.vue'
import { siteConfig } from '@/config'

const router = useRouter()
const propertyStore = usePropertyStore()
const loading = ref(true)

// ========================================
// 1. Hero 轮播数据
// ========================================
const heroSlides = [
  {
    id: 1,
    image: 'images/hero/zhuhai-hero.webp',
    tag: '珠海·主城核心',
    title: '盛东·江山赋',
    subtitle: '山海湖园藏品级资产 | 约155-325㎡主城云顶大宅',
    ctaText: '查看详情',
    ctaLink: '/properties/1',
  },
  {
    id: 2,
    image: 'images/hero/zhongshan-hero.jpg',
    tag: '中山·深中通道',
    title: '遠洋繁花里',
    subtitle: '香港直通车社区 | 天天發車 直達太子荃灣',
    ctaText: '查看详情',
    ctaLink: '/properties/4',
  },
  {
    id: 3,
    image: 'images/hero/featured-hero.webp',
    tag: '珠海·横琴',
    title: '华发·云玺',
    subtitle: '约50万㎡港湾生活社区 | 一线半山海景奢宅',
    ctaText: '查看详情',
    ctaLink: '/properties/2',
  },
]

const currentSlide = ref(0)
let slideInterval = null

// 轮播控制
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + heroSlides.length) % heroSlides.length
}

// 自动播放
const startAutoPlay = () => {
  slideInterval = setInterval(nextSlide, 5000)
}

const stopAutoPlay = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

// ========================================
// 2. 筛选功能
// ========================================
const filterTabs = [
  { label: '买新房', value: 'buy' },
  { label: '买二手房', value: 'resale' },
  { label: '租房', value: 'rent' },
]
const activeFilterTab = ref('buy')

const filters = reactive({
  city: '',
  price: '',
  area: '',
})

const applyFilters = () => {
  router.push({
    path: '/properties',
    query: { ...filters },
  })
}

// ========================================
// 3. 统计数据
// ========================================
const totalProperties = computed(() => {
  return propertyStore.properties?.length || 0
})

const totalAgents = ref(10) // 示例数据

// ========================================
// 4. 热门城市数据
// ========================================
// 熱門城市數據（從 store 動態計算）
// 熱門城市數據（從 store 動態獲取所有有樓盤的城市）
const hotCities = computed(() => {
  const properties = propertyStore.properties || []

  // 統計每個城市的樓盤數量
  const cityMap = new Map()
  properties.forEach((p) => {
    if (p.city) {
      const count = cityMap.get(p.city) || 0
      cityMap.set(p.city, count + 1)
    }
  })

  // 將城市名稱轉換為圖片路徑
  const getCityImage = (cityName) => {
    // 轉換為拼音（簡單處理）
    const imageMap = {
      珠海: 'zhuhai',
      中山: 'zhongshan',
      广州: 'guangzhou',
      深圳: 'shenzhen',
      横琴: 'hengqin',
      坦洲: 'tanzhou',
      香港: 'hongkong',
      澳门: 'macau',
    }

    const imageName = imageMap[cityName] || cityName
    return `images/cities/${imageName}.jpg`
  }

  // 轉換為數組，按樓盤數量降序排列
  return Array.from(cityMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      image: getCityImage(name),
    }))
    .sort((a, b) => b.count - a.count)
})
// ========================================
// 5. 精选楼盘
// ========================================
const featuredProperties = computed(() => {
  const props = propertyStore.properties || []
  return props.slice(0, 4) // 取前4个
})

// ========================================
// 6. 服务流程
// ========================================
const serviceSteps = [
  { icon: '🔍', title: '需求分析', desc: '了解购房预算、区域偏好' },
  { icon: '🏠', title: '精选房源', desc: '专业顾问一对一推荐' },
  { icon: '👀', title: '实地看房', desc: '专车接送，全程陪同' },
  { icon: '📝', title: '签约交易', desc: '律师把关，透明交易' },
  { icon: '🔑', title: '验房交楼', desc: '专业验房，安心收楼' },
  { icon: '🎉', title: '售后服务', desc: '入住后持续跟进' },
]

// ========================================
// 7. 品牌承诺
// ========================================
const brandPromises = [
  { icon: '🛡️', title: '真房源', desc: '100%真实楼盘信息' },
  { icon: '💰', title: '无差价', desc: '交易价格透明公开' },
  { icon: '⚖️', title: '律师监管', desc: '专业律师全程跟进' },
  { icon: '⭐', title: '五星服务', desc: '客户满意度98%' },
]

// ========================================
// 8. 最新资讯
// ========================================
const latestNews = [
  {
    id: 1,
    title: '深中通道2024年通车，中山楼市升温',
    excerpt: '深中通道通车在即，中山楼盘咨询量上涨50%...',
    date: '2026-02-10',
    image: 'images/news/shenzhong.jpg',
    link: '/news/1',
  },
  {
    id: 2,
    title: '珠海横琴粤澳深度合作区新政解读',
    excerpt: '企业所得税优惠、人才引进政策全面升级...',
    date: '2026-02-08',
    image: 'images/news/hengqin.jpg',
    link: '/news/2',
  },
  {
    id: 3,
    title: '香港购房团重启，中山珠海成热点',
    excerpt: '通关后首个香港购房考察团到访...',
    date: '2026-02-05',
    image: 'images/news/hongkong.jpg',
    link: '/news/3',
  },
]

// ========================================
// 生命周期
// ========================================
onMounted(async () => {
  await propertyStore.fetchProperties()
  loading.value = false
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})

// ========================================
// 方法
// ========================================
const filterByCity = (city) => {
  router.push({
    path: '/properties',
    query: { city },
  })
}

const viewProperty = (property) => {
  router.push(`/properties/${property.id}`)
}
</script>

<style scoped>
/* ========================================
   1. Hero 轮播样式
   ======================================== */
.hero-carousel {
  position: relative;
  height: 80vh;
  min-height: 600px;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-images {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3));
}

.carousel-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  padding-top: 60px; /* ✅ 只添加這一行，其他保持不變 */
  text-align: center;
  color: white;
}

.slide-actions {
  display: flex;
  gap: 20px; /* ✅ 添加按鈕之間的間距 */
  justify-content: center;
  align-items: center;
}

.slide-tag {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(44, 139, 255, 0.9);
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  backdrop-filter: blur(4px);
}

.slide-title {
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.slide-subtitle {
  font-size: 20px;
  margin-bottom: 40px; /* ✅ 把原來的 margin-bottom 從 30px 改為 40px */
  opacity: 0.95;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

/* 轮播指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s;
}

.indicator.active {
  width: 30px;
  border-radius: 10px;
  background: white;
}

/* 导航按钮 */
.carousel-prev,
.carousel-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  backdrop-filter: blur(4px);
  transition: all 0.3s;
}

.carousel-prev {
  left: 30px;
}

.carousel-next {
  right: 30px;
}

.carousel-prev:hover,
.carousel-next:hover {
  background: rgba(44, 139, 255, 0.8);
  border-color: white;
}

/* 轮播淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========================================
   2. 快捷筛选栏
   ======================================== */
.quick-filter {
  margin-top: -40px;
  position: relative;
  z-index: 20;
  margin-bottom: 40px;
}

.filter-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

.filter-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-gray-200);
}

.filter-tab {
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-gray-600);
  cursor: pointer;
  position: relative;
}

.filter-tab.active {
  color: var(--color-primary);
}

.filter-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.filter-select {
  flex: 1;
  padding: 14px 16px;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:hover {
  border-color: var(--color-primary);
}

.filter-select:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(44, 139, 255, 0.1);
}

.btn-filter {
  padding: 14px 32px;
  font-size: 16px;
  border-radius: 8px;
}

/* ========================================
   3. 数据看板
   ======================================== */
.stats-panel {
  padding: 40px 0;
  background: white;
  border-bottom: 1px solid var(--color-gray-200);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 48px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  color: var(--color-gray-600);
}

/* ========================================
   4. 通用区块样式
   ======================================== */
.featured-properties,
.hot-cities,
.service-flow,
.brand-promise,
.latest-news {
  padding: 60px 0;
}

.featured-properties {
  background: white;
}

.hot-cities,
.brand-promise {
  background: var(--color-gray-100);
}

.service-flow {
  background: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 16px;
  color: var(--color-gray-600);
}

.view-all-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.view-all-link:hover {
  border-bottom-color: var(--color-primary);
}

.arrow {
  display: inline-block;
  transition: transform 0.3s;
}

.view-all-link:hover .arrow {
  transform: translateX(4px);
}

/* 楼盘网格 */
.property-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

/* 城市网格 */
.cities-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

.city-card {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.city-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.city-image {
  position: relative;
  height: 250px;
  background-size: cover;
  background-position: center;
}

.city-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2));
}

.city-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  color: white;
  z-index: 2;
}

.city-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.city-count {
  font-size: 14px;
  margin-bottom: 12px;
  opacity: 0.9;
}

.city-link {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
  transition: all 0.3s;
  display: inline-block;
}

.city-card:hover .city-link {
  transform: translateX(4px);
  opacity: 1;
}

/* 服务流程 */
.flow-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.flow-step {
  text-align: center;
  padding: 30px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
}

.flow-step:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.step-number {
  width: 28px;
  height: 28px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  margin: 0 auto 16px;
}

.step-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 12px;
}

.step-desc {
  font-size: 14px;
  color: var(--color-gray-600);
  line-height: 1.5;
}

/* 品牌承诺 */
.promise-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.promise-card {
  text-align: center;
  padding: 40px 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
}

.promise-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.promise-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.promise-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 12px;
}

.promise-desc {
  font-size: 15px;
  color: var(--color-gray-600);
  line-height: 1.6;
}

/* 最新资讯 */
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.news-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.news-image {
  height: 200px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.news-card:hover .news-image img {
  transform: scale(1.05);
}

.news-content {
  padding: 24px;
}

.news-date {
  font-size: 13px;
  color: var(--color-gray-500);
  margin-bottom: 12px;
  display: block;
}

.news-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 12px;
  line-height: 1.4;
}

.news-excerpt {
  font-size: 14px;
  color: var(--color-gray-600);
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.news-link:hover {
  text-decoration: underline;
}

/* 加载状态 */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px;
  color: var(--color-gray-600);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--color-gray-200);
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

/* ========================================
   响应式设计
   ======================================== */
@media (max-width: 1200px) {
  .property-grid,
  .cities-grid,
  .promise-grid,
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .flow-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .hero-carousel {
    height: 70vh;
  }

  .slide-title {
    font-size: 44px;
  }

  .filter-row {
    flex-wrap: wrap;
  }

  .filter-select {
    flex: 1 1 calc(50% - 8px);
  }

  .btn-filter {
    flex: 1 1 100%;
  }
}

@media (max-width: 768px) {
  .hero-carousel {
    height: 60vh;
    min-height: 500px;
  }

  .slide-title {
    font-size: 36px;
  }

  .slide-subtitle {
    font-size: 18px;
  }

  .carousel-prev,
  .carousel-next {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .carousel-prev {
    left: 15px;
  }

  .carousel-next {
    right: 15px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  .property-grid,
  .cities-grid,
  .promise-grid,
  .news-grid,
  .flow-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .filter-tabs {
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .filter-tab {
    padding: 12px 16px;
    white-space: nowrap;
  }

  .quick-filter {
    margin-top: 0;
    padding: 0 20px;
  }

  .carousel-content {
    padding-top: 80px; /* ✅ 小屏幕上增加更多頂部空間 */
  }

  .slide-subtitle {
    margin-bottom: 30px; /* ✅ 小屏幕上適當減少 */
  }
}

@media (max-width: 480px) {
  .slide-title {
    font-size: 28px;
  }

  .slide-subtitle {
    font-size: 16px;
  }

  .slide-tag {
    font-size: 12px;
  }

  .btn {
    padding: 10px 24px;
    font-size: 14px;
  }

  .stat-number {
    font-size: 36px;
  }

  .filter-select {
    flex: 1 1 100%;
  }
}
</style>
