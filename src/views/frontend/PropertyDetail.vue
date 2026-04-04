<template>
  <div class="property-detail" v-if="property">
    <div class="container">
      <!-- 返回按鈕 -->
      <button class="back-btn" @click="goBack">← 返回列表</button>

      <!-- 樓盤標題 -->
      <div class="property-header">
        <h1>{{ property.name }}</h1>
        <div class="header-badges">
          <span class="city-badge">{{ property.city }}</span>
          <span :class="['status-badge', property.status]">
            {{ property.status }}
          </span>
        </div>
      </div>

      <!-- 圖片輪播區域 -->
      <div class="property-images" v-if="property.images && property.images.length > 0">
        <div class="main-image">
          <img :src="property.images[currentImageIndex]" :alt="property.name" />
          <div class="image-nav" v-if="property.images.length > 1">
            <button class="nav-btn prev" @click="prevImage">←</button>
            <span class="image-counter"
              >{{ currentImageIndex + 1 }} / {{ property.images.length }}</span
            >
            <button class="nav-btn next" @click="nextImage">→</button>
          </div>
        </div>
        <div class="thumbnail-list" v-if="property.images.length > 1">
          <img
            v-for="(img, index) in property.images"
            :key="index"
            :src="img"
            :class="['thumbnail', { active: currentImageIndex === index }]"
            @click="currentImageIndex = index"
          />
        </div>
      </div>
      <div v-else class="no-image">
        <span>暂无图片</span>
      </div>

      <!-- 樓盤資訊 -->
      <div class="property-info">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">戶型/規模</span>
            <span class="info-value">{{ property.size || '待定' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">價格參考</span>
            <span class="info-value price">{{ property.price || '面議' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">聯繫人</span>
            <WhatsAppLink :contact="property.contact" custom-class="info-value" />
          </div>
          <div class="info-item">
            <span class="info-label">信息來源</span>
            <span class="info-value">{{ property.source || '手動添加' }}</span>
          </div>
          <!-- 在資訊網格中添加 -->
          <div class="info-item">
            <span class="info-label">最後更新</span>
            <span class="info-value">{{
              formatDate(property.updated_at || property.created_at)
            }}</span>
          </div>
        </div>

        <!-- 標籤 -->
        <div class="property-tags" v-if="property.tags && property.tags.length > 0">
          <span class="tag-label">核心賣點：</span>
          <span v-for="tag in property.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>

        <!-- 描述 -->
        <div class="property-description" v-if="property.description">
          <h3>項目描述</h3>
          <p>{{ property.description }}</p>
        </div>

        <!-- 聯繫方式 -->
        <div class="contact-card">
          <h3>聯繫我們</h3>
          <p>如需了解更多信息，歡迎聯繫我們</p>
          <div class="contact-actions">
            <a :href="`tel:${phoneNumber}`" class="btn btn-primary"> 📞 電話諮詢 </a>
            <router-link to="/contact" class="btn btn-outline"> 📧 在線留言 </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 加載狀態 -->
  <div v-else-if="loading" class="loading-state">
    <div class="spinner"></div>
    <p>加載中...</p>
  </div>

  <!-- 錯誤狀態 -->
  <div v-else class="error-state">
    <p>樓盤不存在或已被刪除</p>
    <router-link to="/properties" class="btn btn-primary">返回樓盤列表</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/propertyStore'
import { formatDate } from '@/utils/helpers'
import WhatsAppLink from '@/components/common/WhatsAppLink.vue'

const route = useRoute()
const router = useRouter()
const propertyStore = usePropertyStore()

const loading = ref(true)
const property = ref(null)
const currentImageIndex = ref(0)

// 從電話號碼中提取數字
const phoneNumber = computed(() => {
  if (!property.value?.contact) return '0756-xxxxxxx'
  const match = property.value.contact.match(/\d{11}/)
  return match ? match[0] : '0756-xxxxxxx'
})

// 上一張圖片
const prevImage = () => {
  if (property.value?.images?.length) {
    currentImageIndex.value =
      (currentImageIndex.value - 1 + property.value.images.length) % property.value.images.length
  }
}

// 下一張圖片
const nextImage = () => {
  if (property.value?.images?.length) {
    currentImageIndex.value = (currentImageIndex.value + 1) % property.value.images.length
  }
}

// 返回列表頁
const goBack = () => {
  router.push('/properties')
}

// 加載樓盤詳情
const loadProperty = async () => {
  loading.value = true
  const propertyId = parseInt(route.params.id)

  // 確保數據已加載
  if (propertyStore.properties.length === 0) {
    await propertyStore.fetchProperties()
  }

  property.value = propertyStore.getProjectById(propertyId)
  loading.value = false
}

onMounted(() => {
  loadProperty()
})
</script>

<style scoped>
.property-detail {
  padding: 40px 0;
  min-height: 70vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 返回按鈕 */
.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #2c8bff;
  cursor: pointer;
  padding: 10px 0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.back-btn:hover {
  text-decoration: underline;
}

/* 標題區域 */
.property-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
}

.property-header h1 {
  font-size: 32px;
  color: #333;
  margin: 0;
}

.header-badges {
  display: flex;
  gap: 10px;
}

.city-badge {
  background: #2c8bff;
  color: white;
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 14px;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  background: #ffc107;
  color: #333;
}

.status-badge.在售 {
  background: #28a745;
  color: white;
}

.status-badge.待跟进 {
  background: #ffc107;
  color: #333;
}

.status-badge.已成交 {
  background: #6c757d;
  color: white;
}

/* 圖片區域 */
.property-images {
  margin-bottom: 40px;
}

.main-image {
  position: relative;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/9;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-nav {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.nav-btn {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s;
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.image-counter {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.thumbnail-list {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  overflow-x: auto;
  padding-bottom: 5px;
}

.thumbnail {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s;
}

.thumbnail:hover {
  opacity: 0.8;
}

.thumbnail.active {
  opacity: 1;
  border: 2px solid #2c8bff;
}

.no-image {
  background: #f8f9fa;
  border-radius: 12px;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  margin-bottom: 40px;
}

/* 資訊區域 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-label {
  font-size: 13px;
  color: #999;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.info-value.price {
  color: #ff6b6b;
  font-size: 20px;
}

/* 標籤 */
.property-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.tag-label {
  font-weight: 600;
  color: #333;
}

.tag {
  background: #e7f1ff;
  color: #2c8bff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
}

/* 描述 */
.property-description {
  margin-bottom: 30px;
}

.property-description h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.property-description p {
  line-height: 1.8;
  color: #666;
}

/* 聯繫卡片 */
.contact-card {
  background: linear-gradient(135deg, #2c8bff, #0066cc);
  color: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
}

.contact-card h3 {
  font-size: 22px;
  margin-bottom: 10px;
}

.contact-card p {
  margin-bottom: 20px;
  opacity: 0.9;
}

.contact-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: white;
  color: #2c8bff;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-outline {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-outline:hover {
  background: white;
  color: #2c8bff;
}

/* 加載和錯誤狀態 */
.loading-state,
.error-state {
  text-align: center;
  padding: 80px 20px;
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

/* 響應式 */
@media (max-width: 768px) {
  .property-header h1 {
    font-size: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .contact-actions {
    flex-direction: column;
  }

  .btn {
    text-align: center;
  }

  .thumbnail {
    width: 60px;
    height: 45px;
  }
}
</style>
