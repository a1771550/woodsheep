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

            <!-- ✅ 微信客服区域 -->
            <div class="info-item wechat-item">
              <div class="info-icon">💬</div>
              <div class="info-details">
                <h3>微信客服</h3>
                <div class="wechat-container">
                  <div class="qrcode-wrapper" @click="showQRCodeModal = true">
                    <img
                      src="@/assets/images/wechat-qrcode.jpg"
                      alt="微信二维码"
                      class="wechat-qrcode"
                      @error="handleImageError"
                    />
                    <div class="qrcode-hover">点击放大</div>
                  </div>
                  <div class="wechat-info">
                    <p class="wechat-id">微信号: <span>muyang_property</span></p>
                  </div>
                </div>
                <p class="info-note">扫码或复制微信号添加微信好友</p>
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

      <!-- 地圖區域 -->
      <div class="map-section">
        <h2>我们的位置</h2>
        <div class="map-container">
          <div class="map-placeholder">
            <div class="map-icon">🗺️</div>
            <p>珠海市香洲区九洲大道中1009号</p>
            <p class="map-note">（预约来访，专车接送）</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 二维码放大彈窗 -->
    <div v-if="showQRCodeModal" class="qrcode-modal" @click="showQRCodeModal = false">
      <div class="modal-content" @click.stop>
        <img src="@/assets/images/wechat-qrcode.jpg" alt="微信二维码" @error="handleImageError" />
        <button class="modal-close" @click="showQRCodeModal = false">×</button>
        <p class="modal-tip">长按识别二维码添加微信</p>
      </div>
    </div>

    <!-- 成功提示 -->
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
const showQRCodeModal = ref(false)

// 圖片加載失敗處理
const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/200x200?text=微信二维码'
}

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
  background: var(--color-primary);
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
  margin-bottom: 8px;
}

.info-value {
  font-size: 16px;
  color: var(--color-primary);
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

/* ✅ 微信区域样式 */
.wechat-item {
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 5px;
}

.wechat-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 8px;
}

.qrcode-wrapper {
  position: relative;
  cursor: pointer;
}

.wechat-qrcode {
  width: 80px;
  height: 80px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.wechat-qrcode:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.qrcode-hover {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.qrcode-wrapper:hover .qrcode-hover {
  opacity: 1;
}

.wechat-info {
  flex: 1;
}

.wechat-id {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.wechat-id span {
  color: var(--color-primary);
  font-weight: 500;
  user-select: all;
  cursor: pointer;
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
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.btn-submit {
  padding: 14px 30px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-submit:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 二维码弹窗 */
.qrcode-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  max-width: 90%;
}

.modal-content img {
  max-width: 80vw;
  max-height: 70vh;
  border-radius: 8px;
}

.modal-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
}

.modal-tip {
  margin-top: 15px;
  color: #666;
  font-size: 14px;
}

/* 地图区域 */
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
  background: var(--color-primary);
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

/* 响应式 */
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

  .wechat-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .wechat-qrcode {
    width: 100px;
    height: 100px;
  }

  .success-toast {
    white-space: normal;
    text-align: center;
    max-width: 90%;
  }

  .modal-content img {
    max-width: 95vw;
  }
}
</style>
