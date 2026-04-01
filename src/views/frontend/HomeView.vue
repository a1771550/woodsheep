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
const hotCities = computed(() => [
  {
    name: '珠海',
    count: propertyStore.properties?.filter((p) => p.city === '珠海').length || 0,
    image: 'images/cities/zhuhai.jpg',
  },
  {
    name: '中山',
    count: propertyStore.properties?.filter((p) => p.city === '中山').length || 0,
    image: 'images/cities/zhongshan.jpg',
  },
  {
    name: '横琴',
    count: 3,
    image: 'images/cities/hengqin.jpg',
  },
  {
    name: '坦洲',
    count: 2,
    image: 'images/cities/tanzhou.jpg',
  },
])

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
/* 輪播容器 - 確保有足夠的內邊距 */
.hero-carousel {
  position: relative;
  height: 80vh;
  min-height: 600px;
  overflow: hidden;
}

/* 輪播內容 - 使用 flex 布局確保內容在安全區域 */
.carousel-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
  color: white;
  /* 使用 flex 垂直布局，確保內容不會被按鈕覆蓋 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}

/* 標籤樣式 */
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

/* 標題樣式 */
.slide-title {
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 副標題樣式 - 確保不會被按鈕覆蓋 */
.slide-subtitle {
  font-size: 20px;
  margin-bottom: 30px;
  opacity: 0.95;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

/* 按鈕區域 - 確保不會與副標題重疊 */
.slide-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
  position: relative;
  z-index: 2;
}

/* 導航按鈕 - 調整位置，避免與內容重疊 */
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
  cursor: pointer;
  z-index: 10;
  backdrop-filter: blur(4px);
  transition: all 0.3s;
  /* 確保按鈕不會因為內容增加而偏移 */
  margin-top: -25px;
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

/* 輪播指示器 */
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

/* 響應式調整 - 小屏幕上增加內邊距 */
@media (max-width: 768px) {
  .hero-carousel {
    height: 70vh;
    min-height: 500px;
  }

  .carousel-content {
    padding: 0 20px;
  }

  .slide-title {
    font-size: 32px;
  }

  .slide-subtitle {
    font-size: 16px;
    margin-bottom: 25px;
  }

  .carousel-prev,
  .carousel-next {
    width: 40px;
    height: 40px;
    font-size: 20px;
    margin-top: -20px;
  }

  .carousel-prev {
    left: 15px;
  }

  .carousel-next {
    right: 15px;
  }
}

/* 超小屏幕 */
@media (max-width: 480px) {
  .slide-title {
    font-size: 24px;
  }

  .slide-subtitle {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .btn-large {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
