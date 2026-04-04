<template>
  <div class="carousel-view">
    <div class="page-header">
      <h2>轮播图管理</h2>
      <button class="btn-add" @click="openAddModal">+ 添加轮播图</button>
    </div>

    <!-- 轮播图列表 -->
    <div class="carousel-list">
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        class="carousel-item"
        :class="{ inactive: !slide.is_active }"
      >
        <div class="drag-handle">⋮⋮</div>

        <div class="slide-preview">
          <img :src="getImageUrl(slide.image_url)" :alt="slide.title" />
        </div>

        <div class="slide-info">
          <div class="slide-title">{{ slide.title }}</div>
          <div class="slide-subtitle">{{ slide.subtitle || '无副标题' }}</div>
          <div class="slide-order">排序: {{ slide.order_index }}</div>
        </div>

        <div class="slide-status">
          <span :class="['status-badge', slide.is_active ? 'active' : 'inactive']">
            {{ slide.is_active ? '已启用' : '已禁用' }}
          </span>
        </div>

        <div class="slide-actions">
          <button class="btn-edit" @click="openEditModal(slide)">编辑</button>
          <button class="btn-delete" @click="confirmDelete(slide)">删除</button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="slides.length === 0 && !loading" class="empty-state">
      <p>暂无轮播图，点击「添加轮播图」开始创建</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ isEdit ? '编辑轮播图' : '添加轮播图' }}</h3>

        <div class="form-group">
          <label>标题 *</label>
          <input v-model="formData.title" type="text" placeholder="例如：盛东·江山赋" />
        </div>

        <div class="form-group">
          <label>副标题</label>
          <input v-model="formData.subtitle" type="text" placeholder="例如：山海湖园藏品级资产" />
        </div>

        <div class="form-group">
          <label>图片 URL *</label>
          <input
            v-model="formData.image_url"
            type="text"
            placeholder="请输入图片URL或使用下方上传功能"
          />
          <div class="upload-area" @click="triggerFileInput">
            <span>📷 或点击上传图片</span>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              style="display: none"
              @change="uploadImage"
            />
          </div>
          <div v-if="formData.image_url" class="image-preview">
            <img :src="getImageUrl(formData.image_url)" alt="预览" />
          </div>
        </div>

        <div class="form-group">
          <label>按钮文字</label>
          <input v-model="formData.button_text" type="text" placeholder="默认：查看详情" />
        </div>

        <div class="form-group">
          <label>按钮链接</label>
          <input v-model="formData.button_link" type="text" placeholder="例如：/properties/1" />
        </div>

        <div class="form-group">
          <label>排序序号</label>
          <input v-model.number="formData.order_index" type="number" placeholder="数字越小越靠前" />
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input v-model="formData.is_active" type="checkbox" />
            启用
          </label>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="closeModal">取消</button>
          <button class="btn-save" @click="saveSlide" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="删除确认"
      :message="`确定要删除「${slideToDelete?.title}」吗？`"
      confirmText="删除"
      cancelText="取消"
      :visible="showDeleteConfirm"
      @confirm="executeDelete"
      @cancel="closeDeleteConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCarouselStore } from '@/stores/carouselStore'
import { supabase } from '@/services/supabase'
import ConfirmDialog from '@/components/backend/ConfirmDialog.vue'
import { getImageUrl } from '@/utils/helpers'

const carouselStore = useCarouselStore()

// 状态
const loading = ref(false)
const saving = ref(false)
const slides = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const showDeleteConfirm = ref(false)
const slideToDelete = ref(null)

// 表单数据
const formData = ref({
  id: null,
  title: '',
  subtitle: '',
  image_url: '',
  button_text: '查看详情',
  button_link: '',
  order_index: 0,
  is_active: true,
})

const fileInput = ref(null)

// 加载数据
const loadSlides = async () => {
  loading.value = true
  await carouselStore.fetchAllSlides()
  slides.value = carouselStore.slides
  loading.value = false
}

// 打开新增弹窗
const openAddModal = () => {
  isEdit.value = false
  formData.value = {
    id: null,
    title: '',
    subtitle: '',
    image_url: '',
    button_text: '查看详情',
    button_link: '',
    order_index: slides.value.length,
    is_active: true,
  }
  showModal.value = true
}

// 打开编辑弹窗
const openEditModal = (slide) => {
  isEdit.value = true
  formData.value = { ...slide }
  showModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
  formData.value = {
    id: null,
    title: '',
    subtitle: '',
    image_url: '',
    button_text: '查看详情',
    button_link: '',
    order_index: 0,
    is_active: true,
  }
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 上传图片到 Supabase Storage
const uploadImage = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('图片不能超过 5MB')
    return
  }

  const fileName = `carousel_${Date.now()}_${file.name}`

  try {
    const { data, error } = await supabase.storage.from('property-images').upload(fileName, file)

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from('property-images').getPublicUrl(fileName)

    formData.value.image_url = publicUrl
    alert('图片上传成功！')
  } catch (error) {
    console.error('上传失败:', error)
    alert('图片上传失败')
  } finally {
    event.target.value = ''
  }
}

// 保存轮播图
const saveSlide = async () => {
  if (!formData.value.title.trim()) {
    alert('请填写标题')
    return
  }

  if (!formData.value.image_url.trim()) {
    alert('请填写图片URL或上传图片')
    return
  }

  saving.value = true

  try {
    if (isEdit.value) {
      await carouselStore.updateSlide(formData.value.id, {
        title: formData.value.title,
        subtitle: formData.value.subtitle,
        image_url: formData.value.image_url,
        button_text: formData.value.button_text,
        button_link: formData.value.button_link,
        order_index: formData.value.order_index,
        is_active: formData.value.is_active,
      })
      alert('更新成功')
    } else {
      await carouselStore.addSlide({
        title: formData.value.title,
        subtitle: formData.value.subtitle,
        image_url: formData.value.image_url,
        button_text: formData.value.button_text,
        button_link: formData.value.button_link,
        order_index: formData.value.order_index,
        is_active: formData.value.is_active,
      })
      alert('添加成功')
    }
    closeModal()
    await loadSlides()
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败')
  } finally {
    saving.value = false
  }
}

// 确认删除
const confirmDelete = (slide) => {
  slideToDelete.value = slide
  showDeleteConfirm.value = true
}

// 关闭删除确认
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  slideToDelete.value = null
}

// 执行删除
const executeDelete = async () => {
  if (slideToDelete.value) {
    await carouselStore.deleteSlide(slideToDelete.value.id)
    await loadSlides()
  }
  closeDeleteConfirm()
}

onMounted(() => {
  loadSlides()
})
</script>

<style scoped>
.carousel-view {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0;
}

.btn-add {
  padding: 10px 20px;
  background: #2c8bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-add:hover {
  background: #0066cc;
}

/* 轮播图列表 */
.carousel-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.carousel-item {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.carousel-item.inactive {
  opacity: 0.6;
  background: #f8f9fa;
}

.drag-handle {
  cursor: move;
  color: #999;
  font-size: 20px;
  user-select: none;
}

.slide-preview {
  width: 120px;
  height: 70px;
  overflow: hidden;
  border-radius: 8px;
  background: #f0f0f0;
}

.slide-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-info {
  flex: 1;
}

.slide-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 5px;
}

.slide-subtitle {
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
}

.slide-order {
  font-size: 12px;
  color: #999;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
}

.status-badge.active {
  background: #28a745;
  color: white;
}

.status-badge.inactive {
  background: #6c757d;
  color: white;
}

.slide-actions {
  display: flex;
  gap: 10px;
}

.btn-edit,
.btn-delete {
  padding: 6px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit {
  background: #ffc107;
  color: #333;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input[type='text'],
.form-group input[type='number'] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.upload-area {
  margin-top: 8px;
  padding: 10px;
  border: 1px dashed #2c8bff;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  background: #f8f9fa;
}

.upload-area:hover {
  background: #e7f1ff;
}

.image-preview {
  margin-top: 10px;
}

.image-preview img {
  max-width: 100%;
  max-height: 150px;
  border-radius: 6px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-save {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-save {
  background: #2c8bff;
  color: white;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 空状态和加载状态 */
.empty-state,
.loading-state {
  text-align: center;
  padding: 60px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
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

@media (max-width: 768px) {
  .carousel-item {
    flex-wrap: wrap;
  }

  .slide-preview {
    width: 80px;
    height: 50px;
  }

  .slide-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
