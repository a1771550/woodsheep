<template>
  <div class="settings-view">
    <h2>系统设置</h2>
    <p class="subtitle">管理系统配置选项</p>

    <!-- 網站信息設定 -->
    <div class="settings-section">
      <h3>网站信息</h3>
      <div class="settings-form">
        <div class="form-group">
          <label>网站名称</label>
          <input v-model="settings.siteName" type="text" placeholder="木羊物业" />
        </div>
        <div class="form-group">
          <label>网站标语</label>
          <input
            v-model="settings.siteSlogan"
            type="text"
            placeholder="专业地产服务，连接美好生活"
          />
        </div>
        <div class="form-group">
          <label>联系电话</label>
          <input v-model="settings.contactPhone" type="text" placeholder="0756-xxxxxxx" />
        </div>
        <div class="form-group">
          <label>联系邮箱</label>
          <input v-model="settings.contactEmail" type="email" placeholder="contact@example.com" />
        </div>
        <div class="form-group">
          <label>公司地址</label>
          <input v-model="settings.contactAddress" type="text" placeholder="香港屯门 / 珠海香洲" />
        </div>
      </div>
    </div>

    <!-- 主题设置 -->
    <div class="settings-section">
      <h3>主题设置</h3>
      <div class="settings-form">
        <div class="form-group">
          <label>网站主题</label>
          <div class="theme-selector">
            <div
              v-for="theme in themes"
              :key="theme.value"
              :class="['theme-option', { active: settings.theme === theme.value }]"
              @click="settings.theme = theme.value"
            >
              <div :class="['theme-preview', theme.value]"></div>
              <span>{{ theme.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 微信设置 -->
    <div class="settings-section">
      <h3>微信设置</h3>
      <div class="settings-form">
        <div class="form-group">
          <label>微信二维码</label>
          <div class="qrcode-upload">
            <div v-if="settings.wechatQRCode" class="qrcode-preview">
              <img :src="settings.wechatQRCode" alt="微信二维码" />
              <button type="button" class="btn-remove" @click="removeWechatQRCode">删除</button>
            </div>
            <div class="upload-area" @click="triggerWechatUpload">
              <span>📷 点击上传二维码</span>
              <input
                type="file"
                ref="wechatInput"
                accept="image/*"
                style="display: none"
                @change="uploadWechatQRCode"
              />
            </div>
          </div>
          <p class="hint-text">建议尺寸：200x200像素，JPG或PNG格式</p>
        </div>
        <div class="form-group">
          <label>微信号</label>
          <input v-model="settings.wechatId" type="text" placeholder="例如：muyang_property" />
        </div>
      </div>
    </div>

    <!-- 輪播圖設定 -->
    <div class="settings-section">
      <h3>轮播图设置</h3>
      <div class="settings-form">
        <div class="form-group">
          <label>自动播放间隔（秒）</label>
          <input v-model.number="settings.carouselInterval" type="number" min="3" max="10" />
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input v-model="settings.carouselAutoPlay" type="checkbox" />
            启用自动播放
          </label>
        </div>
      </div>
    </div>

    <!-- 樓盤列表設定 -->
    <div class="settings-section">
      <h3>楼盘列表设置</h3>
      <div class="settings-form">
        <div class="form-group">
          <label>每页显示数量</label>
          <select v-model="settings.itemsPerPage">
            <option :value="6">6 个</option>
            <option :value="12">12 个</option>
            <option :value="24">24 个</option>
            <option :value="48">48 个</option>
          </select>
        </div>
        <div class="form-group">
          <label>首页精选楼盘数量</label>
          <select v-model="settings.featuredCount">
            <option :value="4">4 个</option>
            <option :value="6">6 个</option>
            <option :value="8">8 个</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 數據管理 -->
    <div class="settings-section">
      <h3>数据管理</h3>
      <div class="settings-form">
        <div class="form-group">
          <button class="btn-export" @click="exportData">📥 导出数据 (JSON)</button>
          <p class="hint-text">导出所有楼盘数据为 JSON 文件</p>
        </div>
        <div class="form-group">
          <button class="btn-import" @click="importData">📤 导入数据</button>
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            accept=".json"
            @change="handleImport"
          />
          <p class="hint-text">从 JSON 文件导入楼盘数据</p>
        </div>
      </div>
    </div>

    <!-- 操作按鈕 -->
    <div class="settings-actions">
      <button class="btn-save" @click="saveSettings" :disabled="saving">
        {{ saving ? '保存中...' : '保存设置' }}
      </button>
      <button class="btn-reset" @click="resetSettings">重置</button>
    </div>

    <!-- 提示消息 -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { usePropertyStore } from '@/stores/propertyStore'

const themes = [
  { name: '默认（蓝色）', value: 'default' },
  { name: '暖色（橙色）', value: 'warm' },
  // { name: '深色', value: 'dark' },
  { name: '森林', value: 'forest' },
]
const wechatInput = ref(null)

const triggerWechatUpload = () => {
  wechatInput.value?.click()
}

const uploadWechatQRCode = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const fileName = `wechat_qrcode_${Date.now()}.jpg`

  try {
    const { data, error } = await supabase.storage.from('property-images').upload(fileName, file)

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from('property-images').getPublicUrl(fileName)

    settings.value.wechatQRCode = publicUrl
    alert('二维码上传成功！')
  } catch (error) {
    console.error('上传失败:', error)
    alert('上传失败')
  }
  event.target.value = ''
}

const removeWechatQRCode = () => {
  settings.value.wechatQRCode = ''
}

const settingsStore = useSettingsStore()
const propertyStore = usePropertyStore()

const saving = ref(false)
const message = ref('')
const messageType = ref('success')
const fileInput = ref(null)

// 本地設定副本
const settings = ref({ ...settingsStore.settings })

// 保存設定
const saveSettings = async () => {
  saving.value = true
  const success = await settingsStore.saveSettings(settings.value)
  if (success) {
    showMessage('设置保存成功！', 'success')
    // 通知其他組件更新
    window.dispatchEvent(new CustomEvent('settings-updated', { detail: settings.value }))
  } else {
    showMessage('保存失败，请重试', 'error')
  }
  saving.value = false
}

// 重置設定
const resetSettings = async () => {
  if (confirm('确定要重置所有设置吗？')) {
    saving.value = true
    const success = await settingsStore.resetSettings()
    if (success) {
      settings.value = { ...settingsStore.settings }
      showMessage('设置已重置！', 'success')
      window.dispatchEvent(new CustomEvent('settings-updated', { detail: settings.value }))
    } else {
      showMessage('重置失败，请重试', 'error')
    }
    saving.value = false
  }
}

// 導出數據
const exportData = () => {
  const properties = propertyStore.properties
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    properties: properties,
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `woodsheep_properties_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)

  showMessage('数据导出成功！', 'success')
}

// 導入數據
const importData = () => {
  fileInput.value?.click()
}

const handleImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (data.properties && Array.isArray(data.properties)) {
        if (confirm(`确定要导入 ${data.properties.length} 个楼盘吗？现有数据将被替换！`)) {
          showMessage('导入功能开发中...', 'warning')
        }
      } else {
        showMessage('无效的数据格式', 'error')
      }
    } catch (err) {
      showMessage('解析文件失败', 'error')
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

// 顯示消息
const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

onMounted(async () => {
  await settingsStore.fetchSettings()
  settings.value = { ...settingsStore.settings }
})
</script>

<style scoped>
.upload-area span {
  cursor: pointer;
}

.settings-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.settings-view h2 {
  margin-bottom: 5px;
  color: #333;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.settings-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.settings-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
}

.hint-text {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.btn-export,
.btn-import {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  width: fit-content;
}

.btn-export {
  background: #28a745;
  color: white;
}

.btn-export:hover {
  background: #218838;
}

.btn-import {
  background: #17a2b8;
  color: white;
}

.btn-import:hover {
  background: #138496;
}

.settings-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-save,
.btn-reset {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save {
  background: var(--color-primary);
  color: white;
  flex: 1;
}

.btn-save:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-reset {
  background: #6c757d;
  color: white;
  padding: 12px 30px;
}

.btn-reset:hover {
  background: #5a6268;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.message.success {
  background: #28a745;
}

.message.error {
  background: #dc3545;
}

.message.warning {
  background: #ffc107;
  color: #333;
}

.theme-selector {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.theme-option {
  text-align: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s;
}

.theme-option:hover {
  background: var(--color-primary-light);
}

.theme-option.active {
  background: var(--color-primary-light);
  border: 2px solid var(--color-primary);
}

.theme-preview {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.theme-preview.default {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
}

.theme-preview.warm {
  background: linear-gradient(135deg, #b86500, #8a4c00);
}

.theme-preview.dark {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
}

.theme-preview.forest {
  background: linear-gradient(135deg, #2d6a4f, #1b4332);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .settings-view {
    padding: 15px;
  }

  .settings-section {
    padding: 15px;
  }

  .settings-actions {
    flex-direction: column;
  }

  .btn-reset {
    padding: 12px 20px;
  }
}
</style>
