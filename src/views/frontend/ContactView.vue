<template>
  <div class="contact-view">
    <div class="container">
      <!-- 頁面標題 -->
      <div class="page-header">
        <h1>联系我们</h1>
        <p>我们随时为您提供专业的购房咨询服务</p>
      </div>

      <div class="contact-wrapper">
        <!-- 左側：聯繫信息 -->
        <div class="contact-info-section">
          <h2>联系方式</h2>

          <div class="info-list">
            <div class="info-item">
              <div class="info-icon">📞</div>
              <div class="info-details">
                <h3>咨询热线</h3>
                <a :href="`tel:${contactPhone}`" class="info-value">{{ contactPhone }}</a>
                <p class="info-note">周一至周五 9:00 - 18:00</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">📧</div>
              <div class="info-details">
                <h3>电子邮箱</h3>
                <a :href="`mailto:${contactEmail}`" class="info-value">{{ contactEmail }}</a>
                <p class="info-note">我们会在24小时内回复</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">📍</div>
              <div class="info-details">
                <h3>公司地址</h3>
                <span class="info-value">{{ contactAddress }}</span>
                <p class="info-note">欢迎预约来访</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">💬</div>
              <div class="info-details">
                <h3>在线咨询</h3>
                <div class="social-links">
                  <a href="#" class="social-link">微信客服</a>
                  <a href="#" class="social-link">公众号</a>
                  <a href="#" class="social-link">在线留言</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側：聯繫表單 -->
        <div class="contact-form-section">
          <h2>在线留言</h2>
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label>您的姓名 *</label>
                <input v-model="formData.name" type="text" placeholder="请输入您的姓名" required />
              </div>
              <div class="form-group">
                <label>联系电话 *</label>
                <input v-model="formData.phone" type="tel" placeholder="请输入您的电话" required />
              </div>
            </div>

            <div class="form-group">
              <label>电子邮箱</label>
              <input v-model="formData.email" type="email" placeholder="请输入您的邮箱" />
            </div>

            <div class="form-group">
              <label>意向楼盘</label>
              <input
                v-model="formData.property"
                type="text"
                placeholder="请输入您感兴趣的楼盘名称（选填）"
              />
            </div>

            <div class="form-group">
              <label>留言内容 *</label>
              <textarea
                v-model="formData.message"
                rows="5"
                placeholder="请详细描述您的购房需求或问题..."
                required
              ></textarea>
            </div>

            <button type="submit" class="btn-submit" :disabled="submitting">
              {{ submitting ? '发送中...' : '发送留言' }}
            </button>
          </form>
        </div>
      </div>

      <!-- 地圖區域（可選） -->
      <div class="map-section">
        <h2>我们的位置</h2>
        <div class="map-container">
          <!-- 可以使用 Google Maps 或百度地圖嵌入 -->
          <div class="map-placeholder">
            <div class="map-icon">🗺️</div>
            <p>珠海市香洲区九洲大道中1009号</p>
            <p class="map-note">（预约来访，专车接送）</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功提示彈窗 -->
    <div v-if="showSuccess" class="success-toast">✅ 留言已发送！我们会尽快与您联系。</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { sendContactEmail } from '@/services/emailService'

const settingsStore = useSettingsStore()

const contactPhone = computed(() => settingsStore.settings?.contactPhone || '0756-xxxxxxx')
const contactEmail = computed(
  () => settingsStore.settings?.contactEmail || 'contact@muyangproperty.com',
)
const contactAddress = computed(
  () => settingsStore.settings?.contactAddress || '香港屯门 / 珠海香洲',
)

// 表單數據
const formData = ref({
  name: '',
  phone: '',
  email: '',
  property: '',
  message: '',
})

const submitting = ref(false)
const showSuccess = ref(false)

// 提交表單
const handleSubmit = async () => {
  submitting.value = true

  const result = await sendContactEmail(formData.value)

  if (result.success) {
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)

    // 重置表單
    formData.value = {
      name: '',
      phone: '',
      email: '',
      property: '',
      message: '',
    }
  } else {
    alert('发送失败，请稍后重试：' + result.error)
  }

  submitting.value = false
}
</script>

<style scoped>
.contact-view {
  padding: 40px 0;
  min-height: 70vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 頁面標題 */
.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-header h1 {
  font-size: 42px;
  color: #333;
  margin-bottom: 15px;
}

.page-header p {
  font-size: 18px;
  color: #666;
}

/* 聯繫方式包裝器 */
.contact-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-bottom: 60px;
}

/* 左側聯繫信息 */
.contact-info-section {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 16px;
}

.contact-info-section h2,
.contact-form-section h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 12px;
}

.contact-info-section h2::after,
.contact-form-section h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: #2c8bff;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.info-item {
  display: flex;
  gap: 18px;
  align-items: flex-start;
}

.info-icon {
  font-size: 32px;
  min-width: 50px;
}

.info-details h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 5px;
}

.info-value {
  font-size: 16px;
  color: #2c8bff;
  text-decoration: none;
  font-weight: 500;
}

.info-value:hover {
  text-decoration: underline;
}

.info-note {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 5px;
}

.social-link {
  color: #2c8bff;
  text-decoration: none;
  font-size: 14px;
}

.social-link:hover {
  text-decoration: underline;
}

/* 右側聯繫表單 */
.contact-form-section {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2c8bff;
  box-shadow: 0 0 0 3px rgba(44, 139, 255, 0.1);
}

.btn-submit {
  padding: 14px 30px;
  background: #2c8bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-submit:hover {
  background: #0066cc;
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 地圖區域 */
.map-section {
  margin-top: 20px;
}

.map-section h2 {
  text-align: center;
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
  position: relative;
}

.map-section h2::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #2c8bff;
}

.map-container {
  background: #f0f0f0;
  border-radius: 16px;
  overflow: hidden;
  min-height: 300px;
}

.map-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e0e0, #c0c0c0);
  color: #666;
}

.map-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.map-placeholder p {
  font-size: 14px;
}

.map-note {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

/* 成功提示 */
.success-toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #28a745;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  animation: slideUp 0.3s ease;
  white-space: nowrap;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 響應式 */
@media (max-width: 768px) {
  .contact-wrapper {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .page-header h1 {
    font-size: 32px;
  }

  .contact-info-section,
  .contact-form-section {
    padding: 20px;
  }

  .success-toast {
    white-space: normal;
    text-align: center;
    max-width: 90%;
  }
}
</style>
