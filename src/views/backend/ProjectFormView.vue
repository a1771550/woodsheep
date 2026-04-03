<template>
  <div class="form-view">
    <div class="page-header">
      <h2>{{ isEditing ? '编辑项目' : '添加新项目' }}</h2>
      <p>{{ isEditing ? '修改项目信息' : '填写项目详细信息' }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="project-form">
      <!-- 第一行：名称 + 城市 -->
      <div class="form-row">
        <div class="form-group">
          <label for="name">
            项目名称
            <span class="required-mark">*</span>
          </label>
          <input
            v-model="formData.name"
            id="name"
            type="text"
            placeholder="例如：盛东·江山赋"
            required
            class="form-input"
            :class="{ 'input-error': !formData.name && submitted }"
          />
          <div v-if="!formData.name && submitted" class="error-message">项目名称不能为空</div>
        </div>

        <div class="form-group">
          <label for="city">
            所在城市
            <span class="required-mark">*</span>
          </label>
          <select
            v-model="formData.city"
            id="city"
            required
            class="form-select"
            :class="{ 'input-error': !formData.city && submitted }"
          >
            <option value="" disabled>请选择城市</option>
            <option value="珠海">珠海</option>
            <option value="中山">中山</option>
            <option value="广州">广州</option>
            <option value="深圳">深圳</option>
          </select>
          <div v-if="!formData.city && submitted" class="error-message">请选择所在城市</div>
        </div>
      </div>

      <!-- 第二行：规模 + 价格 -->
      <div class="form-row">
        <div class="form-group">
          <label for="size">户型/规模</label>
          <input
            v-model="formData.size"
            id="size"
            type="text"
            placeholder="例如：约155-325㎡"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="price">价格参考</label>
          <input
            v-model="formData.price"
            id="price"
            type="text"
            placeholder="例如：65万起"
            class="form-input"
          />
        </div>
      </div>

      <!-- 第三行：联系人 + 状态 -->
      <div class="form-row">
        <div class="form-group">
          <label for="contact">联系人</label>
          <input
            v-model="formData.contact"
            id="contact"
            type="text"
            placeholder="例如：FBB 姚泽璇"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="status">
            项目状态
            <span class="required-mark">*</span>
          </label>
          <select
            v-model="formData.status"
            id="status"
            required
            class="form-select"
            :class="{ 'input-error': !formData.status && submitted }"
          >
            <option value="" disabled>请选择状态</option>
            <option value="待跟进">待跟进</option>
            <option value="跟进中">跟进中</option>
            <option value="已推荐">已推荐</option>
            <option value="已成交">已成交</option>
          </select>
          <div v-if="!formData.status && submitted" class="error-message">请选择项目状态</div>
        </div>
      </div>

      <!-- 信息来源 -->
      <div class="form-group">
        <label for="source">信息来源</label>
        <select v-model="formData.source" id="source" class="form-select">
          <option value="">请选择来源</option>
          <option value="楼盘资料">楼盘资料</option>
          <option value="聊天记录">聊天记录</option>
          <option value="收藏信息">收藏信息</option>
          <option value="手动添加">手动添加</option>
        </select>
      </div>

      <!-- 标签输入 -->
      <div class="form-group">
        <label for="tags">
          核心卖点标签
          <small class="hint-text">（用逗号分隔多个标签）</small>
        </label>
        <input
          v-model="tagsInput"
          id="tags"
          type="text"
          placeholder="例如：海景房, 学区房, 地铁口, 低密度"
          class="form-input"
        />
        <div class="tag-preview" v-if="parsedTags.length > 0">
          <span v-for="tag in parsedTags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 圖片上傳 -->
      <div class="form-group">
        <label>項目圖片</label>
        <ImageUploader v-model="formData.images" />
      </div>

      <!-- 表单操作 -->
      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="cancelForm" :disabled="isSubmitting">
          取消
        </button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="loading-text">
            <span class="spinner"></span>
            处理中...
          </span>
          <span v-else>
            {{ isEditing ? '💾 更新项目' : '➕ 添加项目' }}
          </span>
        </button>
      </div>
    </form>

    <!-- 成功提示（可选） -->
    <div v-if="showSuccessMessage" class="success-message">✅ {{ successMessage }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/propertyStore'
import ImageUploader from '@/components/backend/ImageUploader.vue'

const route = useRoute()
const router = useRouter()
const store = usePropertyStore()

// 状态管理
const isEditing = computed(() => route.name === 'edit-property')
const submitted = ref(false)
const isSubmitting = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// 表单数据
const formData = ref({
  id: null, // ✅ 使用 null，不是 undefined
  name: '',
  city: '',
  size: '',
  price: '',
  contact: '',
  status: '待跟进',
  source: '手动添加',
  tags: [],
  description: '',
  images: [],
})

const tagsInput = ref('')

// 计算属性
const parsedTags = computed(() => {
  return tagsInput.value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '')
})

// 生命周期
onMounted(async () => {
  console.log('id:' + route.params.id)
  console.log('isEditing:', isEditing.value)
  if (isEditing.value && route.params.id) {
    await loadProjectForEdit()
  }
})

// 方法
const loadProjectForEdit = async () => {
  const projectId = parseInt(route.params.id)
  console.log('正在加載項目 ID:', projectId)

  try {
    // ✅ 等待數據載入完成
    console.log('開始載入數據...')
    await store.fetchProperties()
    console.log('數據載入完成，共', store.properties.length, '個項目')

    const project = store.getProjectById(projectId)
    console.log('找到的項目:', project)

    if (project) {
      formData.value = {
        id: project.id,
        name: project.name || '',
        city: project.city || '',
        size: project.size || '',
        price: project.price || '',
        contact: project.contact || '',
        status: project.status || '待跟进',
        source: project.source || '手动添加',
        tags: project.tags || [],
        description: project.description || '',
        images: project.images || [],
      }

      if (project.tags && Array.isArray(project.tags)) {
        tagsInput.value = project.tags.join(', ')
      }
    } else {
      console.error('找不到 ID 為', projectId, '的項目')
      alert('找不到指定的项目')
      router.push('/admin')
    }
  } catch (error) {
    console.error('載入項目失敗:', error)
    alert('載入項目失敗，請稍後重試')
    router.push('/admin')
  }
}

const validateForm = () => {
  submitted.value = true

  if (!formData.value.name.trim()) {
    return '项目名称不能为空'
  }

  if (!formData.value.city) {
    return '请选择所在城市'
  }

  if (!formData.value.status) {
    return '请选择项目状态'
  }

  if (formData.value.name.length > 100) {
    return '项目名称不能超过100个字符'
  }

  return null
}

const handleSubmit = async () => {
  const error = validateForm()
  if (error) {
    alert(error)
    return
  }

  isSubmitting.value = true

  try {
    // 準備要儲存的資料 - 直接使用 formData.images
    const projectData = {
      name: formData.value.name,
      city: formData.value.city,
      size: formData.value.size,
      price: formData.value.price,
      contact: formData.value.contact,
      status: formData.value.status,
      source: formData.value.source || '手动添加',
      tags: parsedTags.value,
      description: formData.value.description || '',
      images: formData.value.images, // ✅ 直接使用 formData.images
    }

    // 根據編輯或新增執行不同操作
    if (isEditing.value) {
      const projectId = parseInt(route.params.id)
      console.log('編輯項目 ID:', projectId)
      await store.updateProperty(projectId, projectData)
      successMessage.value = '项目更新成功！'
    } else {
      console.log('新增項目')
      await store.addProperty(projectData)
      successMessage.value = '项目添加成功！'
    }

    // 顯示成功訊息並返回列表
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
      router.push('/admin')
    }, 1500)
  } catch (error) {
    console.error('操作失败:', error)
    alert('操作失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

const cancelForm = () => {
  if (confirm('确定要取消吗？未保存的数据将会丢失。')) {
    router.push('/properties')
  }
}
</script>

<style scoped>
.form-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h2 {
  color: var(--color-heading, #2c8bff);
  margin-bottom: 10px;
  font-size: 1.8em;
}

.page-header p {
  color: var(--color-text-secondary, #666);
  font-size: 1.1em;
}

.project-form {
  background: var(--color-card, white);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s;
}

.project-form:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

.form-group {
  margin-bottom: 25px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--color-heading, #333);
  font-size: 0.95em;
}

.required-mark {
  color: #dc3545;
  margin-left: 4px;
}

.hint-text {
  font-weight: normal;
  color: var(--color-text-secondary, #888);
  font-size: 0.85em;
  margin-left: 8px;
}

.form-input,
.form-select {
  padding: 12px 15px;
  border: 1px solid var(--color-border, #ddd);
  border-radius: 6px;
  background: var(--color-background-soft, #f8f9fa);
  color: var(--color-text, #333);
  font-size: 14px;
  transition: all 0.3s;
}

.form-input {
  width: 90%;
}

.form-select {
  width: 99%;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary, #2c8bff);
  box-shadow: 0 0 0 3px rgba(44, 139, 255, 0.1);
  background: var(--color-background, white);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 40px;
}

/* 验证错误样式 */
.input-error {
  border-color: #dc3545 !important;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
}

.error-message {
  color: #dc3545;
  font-size: 0.85em;
  margin-top: 5px;
  position: absolute;
  bottom: -20px;
  left: 0;
}

/* 标签预览 */
.tag-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  min-height: 30px;
}

.tag {
  background: var(--color-primary-light, #e7f1ff);
  color: var(--color-primary, #0066cc);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  display: inline-block;
  transition: all 0.3s;
}

.tag:hover {
  background: var(--color-primary, #2c8bff);
  color: white;
  transform: translateY(-1px);
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border, #eee);
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.btn-primary {
  background: var(--color-primary, #2c8bff);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark, #0066cc);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(44, 139, 255, 0.2);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-secondary {
  background: var(--color-background-mute, #f1f3f5);
  color: var(--color-text, #333);
  border: 1px solid var(--color-border, #ddd);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-border, #e9ecef);
  transform: translateY(-2px);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 加载状态 */
.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 成功消息 */
.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #28a745;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation:
    slideInRight 0.3s ease,
    fadeOut 0.5s ease 1.2s forwards;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>
