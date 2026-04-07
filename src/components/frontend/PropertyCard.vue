<template>
  <div class="property-card" @click="handleClick">
    <div class="card-image">
      <img
        v-if="property.images && property.images.length > 0"
        :src="property.images[0]"
        :alt="property.name"
      />
      <div v-else class="no-image">
        <span>暂无图片</span>
      </div>
      <div class="card-badges">
        <span class="city-badge">{{ property.city }}</span>
        <span :class="['status-badge', property.status]">
          {{ property.status }}
        </span>
      </div>
    </div>

    <div class="card-content">
      <h3 class="property-name">{{ property.name }}</h3>
      <p class="property-desc">{{ property.description || '优质楼盘，详情请咨询' }}</p>

      <div class="property-details">
        <div class="detail-item">
          <span class="detail-label">规模</span>
          <span class="detail-value">{{ property.size || '待定' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">价格</span>
          <span class="detail-value price">{{ property.price || '面议' }}</span>
        </div>
      </div>

      <div v-if="property.tags && property.tags.length > 0" class="property-tags">
        <span v-for="tag in property.tags.slice(0, 2)" :key="tag" class="tag">
          {{ tag }}
        </span>
        <span v-if="property.tags.length > 2" class="tag-more">
          +{{ property.tags.length - 2 }}
        </span>
      </div>

      <div class="card-footer">
        <WhatsAppLink :contact="contactName" custom-class="contact" />
        <button class="btn-detail" @click.stop="viewDetail">查看详情</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import WhatsAppLink from '@/components/common/WhatsAppLink.vue'

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['click'])

const router = useRouter()

const contactName = computed(() => {
  return props.property.contact?.split(' ')[0] || '联系顾问'
})

const handleClick = () => {
  emit('click', props.property)
}

const viewDetail = (e) => {
  e.stopPropagation()
  router.push(`/properties/${props.property.id}`)
}
</script>

<style scoped>
.property-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

/* ✅ 修復問題1：圖片始終覆蓋整個區域 */
/* 確保圖片填滿整個容器 */
.card-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #e0e0e0, #c0c0c0);
  flex-shrink: 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 確保圖片覆蓋整個區域，不變形 */
  object-position: center; /* 圖片居中顯示 */
  display: block;
  transform: scale(1.02); /*稍微放大一點點，消除邊緣白邊 */
}

/* hover 時輕微放大 */
.property-card:hover .card-image img {
  transform: scale(1.05);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #999;
}

.card-badges {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  display: flex;
  justify-content: space-between;
  z-index: 2;
}

.city-badge {
  background: rgba(var(--color-primary-rgb), 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(255, 193, 7, 0.9);
  color: #333;
}

.status-badge.在售 {
  background: rgba(40, 167, 69, 0.9);
  color: white;
}

.status-badge.待跟进 {
  background: rgba(255, 193, 7, 0.9);
  color: #333;
}

.status-badge.已成交 {
  background: rgba(108, 117, 125, 0.9);
  color: white;
}

/* ✅ 修復問題2：卡片內容區域有明顯的白色背景 */
.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.property-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px;
  line-height: 1.4;
}

.property-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.property-details {
  margin-bottom: 15px;
  padding: 10px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  color: #6c757d;
  font-size: 14px;
}

.detail-value {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.detail-value.price {
  color: #ff6b6b;
  font-weight: 600;
}

.property-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tag {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
}

.tag-more {
  background: #f8f9fa;
  color: #6c757d;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.contact {
  color: #6c757d;
  font-size: 13px;
}

.btn-detail {
  padding: 6px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-detail:hover {
  background: var(--color-primary-dark);
}

/* 響應式 */
@media (max-width: 768px) {
  .card-image {
    height: 180px;
  }

  .property-name {
    font-size: 16px;
  }
}
</style>
