<template>
  <div class="news-manage-view">
    <div class="page-header">
      <h2>新闻管理</h2>
      <button class="btn-add" @click="openAddModal">+ 添加新闻</button>
    </div>

    <!-- 桌面端：表格视图 -->
    <div class="desktop-view">
      <table class="news-table">
        <thead>
          <tr>
            <th style="width: 50px">ID</th>
            <th>标题</th>
            <th style="width: 100px">城市</th>
            <th style="width: 100px">发布日期</th>
            <th style="width: 80px">状态</th>
            <th style="width: 80px">精选</th>
            <th style="width: 100px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in allArticles" :key="article.id">
            <td>{{ article.id }}</td>
            <td class="title-cell">
              <a :href="article.source_url" target="_blank" class="article-link">
                {{ article.title }}
              </a>
            </td>
            <td>{{ article.city || '-' }}</td>
            <td>{{ formatDate(article.published_date) }}</td>
            <td>
              <button
                :class="['status-btn', article.is_active ? 'active' : 'inactive']"
                @click="toggleStatus(article)"
              >
                {{ article.is_active ? '已发布' : '已隐藏' }}
              </button>
            </td>
            <td>
              <button
                :class="['featured-btn', article.is_featured ? 'featured' : 'normal']"
                @click="toggleFeatured(article)"
              >
                {{ article.is_featured ? '⭐ 精选' : '设为精选' }}
              </button>
            </td>
            <td>
              <button class="btn-edit" @click="openEditModal(article)">编辑</button>
              <button class="btn-delete" @click="confirmDelete(article)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 移动端：卡片视图 -->
    <div class="mobile-view">
      <div v-for="article in allArticles" :key="article.id" class="news-card">
        <!-- 图片区域 -->
        <div class="news-card-image">
          <img
            :src="article.image_url || defaultImage"
            :alt="article.title"
            @error="handleImageError"
          />
          <button
            class="upload-image-btn-mobile"
            @click="openImageUpload(article)"
            title="更换图片"
          >
            📷
          </button>
        </div>

        <div class="news-card-content">
          <div class="news-card-header">
            <a :href="article.source_url" target="_blank" class="news-card-title">
              {{ article.title }}
            </a>
            <div class="news-card-badges">
              <span class="city-badge">{{ article.city || '珠海' }}</span>
              <span class="date-badge">{{ formatDate(article.published_date) }}</span>
            </div>
          </div>

          <div class="news-card-actions">
            <button
              :class="['status-btn-mobile', article.is_active ? 'active' : 'inactive']"
              @click="toggleStatus(article)"
            >
              {{ article.is_active ? '✅ 已发布' : '⛔ 已隐藏' }}
            </button>
            <button
              :class="['featured-btn-mobile', article.is_featured ? 'featured' : 'normal']"
              @click="toggleFeatured(article)"
            >
              {{ article.is_featured ? '⭐ 精选' : '☆ 设为精选' }}
            </button>
            <button class="edit-btn-mobile" @click="openEditModal(article)">✏️ 编辑</button>
            <button class="delete-btn-mobile" @click="confirmDelete(article)">🗑️ 删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="allArticles.length === 0 && !loading" class="empty-state">
      <p>暂无新闻，点击「添加新闻」开始创建</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 添加/编辑弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ isEdit ? '编辑新闻' : '添加新闻' }}</h3>

        <div class="form-group">
          <label>标题 *</label>
          <input v-model="formData.title" type="text" placeholder="请输入新闻标题" />
        </div>

        <div class="form-group">
          <label>来源链接 *</label>
          <input v-model="formData.source_url" type="url" placeholder="https://..." />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>城市</label>
            <select v-model="formData.city">
              <option value="">请选择</option>
              <option value="珠海">珠海</option>
              <option value="中山">中山</option>
              <option value="大湾区">大湾区</option>
            </select>
          </div>
          <div class="form-group">
            <label>发布日期</label>
            <input v-model="formData.published_date" type="date" />
          </div>
        </div>

        <div class="form-group">
          <label>图片</label>
          <div class="image-upload-area" @click="triggerImageUpload">
            <div v-if="formData.image_url" class="image-preview">
              <img :src="formData.image_url" alt="预览" @error="handleImageError" />
              <button type="button" class="remove-image" @click.stop="formData.image_url = ''">
                ×
              </button>
            </div>
            <div v-else class="upload-placeholder">
              <span>📷 点击上传图片</span>
            </div>
            <input
              type="file"
              ref="imageInput"
              accept="image/*"
              style="display: none"
              @change="uploadImage"
            />
          </div>
        </div>

        <div class="form-group">
          <label>摘要</label>
          <textarea v-model="formData.excerpt" rows="3" placeholder="新闻摘要（选填）"></textarea>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input v-model="formData.is_featured" type="checkbox" />
            设为精选（首页突出显示）
          </label>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="closeModal">取消</button>
          <button class="btn-save" @click="saveArticle" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="删除确认"
      :message="`确定要删除「${articleToDelete?.title}」吗？`"
      confirmText="删除"
      cancelText="取消"
      :visible="showDeleteConfirm"
      @confirm="executeDelete"
      @cancel="closeDeleteConfirm"
    />

    <!-- 隐藏的文件上传输入框（用于卡片图片更换） -->
    <input
      type="file"
      ref="cardImageInput"
      accept="image/*"
      style="display: none"
      @change="handleCardImageUpload"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNewsStore } from '@/stores/newsStore'
import { supabase } from '@/services/supabase'
import ConfirmDialog from '@/components/backend/ConfirmDialog.vue'
import { handleImageError, defaultImage } from '@/utils/helpers'

const newsStore = useNewsStore()

// 状态
const loading = ref(false)
const saving = ref(false)
const allArticles = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const showDeleteConfirm = ref(false)
const articleToDelete = ref(null)
const imageInput = ref(null)
const cardImageInput = ref(null)
const currentUploadArticle = ref(null)

// 表单数据
const formData = ref({
  id: null,
  title: '',
  excerpt: '',
  source_url: '',
  image_url: '',
  city: '',
  published_date: new Date().toISOString().split('T')[0],
  is_featured: false,
})

// 加载数据
const loadArticles = async () => {
  loading.value = true
  await newsStore.fetchAllArticles()
  // 為沒有圖片的文章添加默認圖片（可選）
  allArticles.value = newsStore.allArticles.map((article) => ({
    ...article,
    image_url: article.image_url || null, // 保持 null，讓模板處理默認顯示
  }))
  // console.log('加载完成，当前文章列表:', allArticles.value)
  loading.value = false
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return dateString
}

// 打开添加弹窗
const openAddModal = () => {
  isEdit.value = false
  formData.value = {
    id: null,
    title: '',
    excerpt: '',
    source_url: '',
    image_url: '',
    city: '珠海',
    published_date: new Date().toISOString().split('T')[0],
    is_featured: false,
  }
  showModal.value = true
}

// 打开编辑弹窗
const openEditModal = (article) => {
  isEdit.value = true
  formData.value = {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt || '',
    source_url: article.source_url,
    image_url: article.image_url || '',
    city: article.city || '珠海',
    published_date: article.published_date,
    is_featured: article.is_featured,
  }
  showModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
}

// 触发图片上传
const triggerImageUpload = () => {
  imageInput.value?.click()
}

// 上传图片（弹窗内）
const uploadImage = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  const fileName = `news_${Date.now()}_${file.name}`

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
  }
  event.target.value = ''
}

// 打开卡片图片上传
const openImageUpload = (article) => {
  currentUploadArticle.value = article
  cardImageInput.value?.click()
}

// 处理卡片图片上传
const handleCardImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  const fileName = `news_${Date.now()}_${file.name}`

  try {
    console.log('开始上传图片...', fileName)

    const { data, error } = await supabase.storage.from('property-images').upload(fileName, file)

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from('property-images').getPublicUrl(fileName)

    console.log('上传成功，URL:', publicUrl)

    // 更新数据库中的图片URL
    await newsStore.updateArticle(currentUploadArticle.value.id, {
      image_url: publicUrl,
    })

    console.log('数据库更新完成，准备重新加载...')

    // ✅ 強制重新加載列表
    await loadArticles()

    console.log('重新加载完成，当前列表:', allArticles.value)

    alert('图片更新成功！')
  } catch (error) {
    console.error('上传失败:', error)
    alert('图片上传失败: ' + error.message)
  }
  event.target.value = ''
}

// 保存文章
const saveArticle = async () => {
  if (!formData.value.title.trim()) {
    alert('请输入标题')
    return
  }
  if (!formData.value.source_url.trim()) {
    alert('请输入来源链接')
    return
  }

  saving.value = true

  try {
    if (isEdit.value) {
      await newsStore.updateArticle(formData.value.id, {
        title: formData.value.title,
        excerpt: formData.value.excerpt,
        source_url: formData.value.source_url,
        image_url: formData.value.image_url,
        city: formData.value.city,
        published_date: formData.value.published_date,
        is_featured: formData.value.is_featured,
      })
      alert('更新成功')
    } else {
      await newsStore.addArticle(formData.value)
      alert('添加成功')
    }
    closeModal()
    await loadArticles()
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败')
  } finally {
    saving.value = false
  }
}

// 切换状态
const toggleStatus = async (article) => {
  await newsStore.toggleActive(article.id, !article.is_active)
  await loadArticles()
}

// 切换精选
const toggleFeatured = async (article) => {
  await newsStore.toggleFeatured(article.id, !article.is_featured)
  await loadArticles()
}

// 确认删除
const confirmDelete = (article) => {
  articleToDelete.value = article
  showDeleteConfirm.value = true
}

// 关闭删除确认
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  articleToDelete.value = null
}

// 执行删除
const executeDelete = async () => {
  if (articleToDelete.value) {
    await newsStore.deleteArticle(articleToDelete.value.id)
    await loadArticles()
  }
  closeDeleteConfirm()
}

onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
.news-manage-view {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.page-header h2 {
  margin: 0;
}

.btn-add {
  padding: 10px 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-add:hover {
  background: var(--color-primary-dark);
}

/* ========================================
   桌面端表格视图
   ======================================== */
.desktop-view {
  display: block;
}

.news-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.news-table th,
.news-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.news-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.title-cell {
  max-width: 400px;
}

.article-link {
  color: var(--color-primary);
  text-decoration: none;
}

.article-link:hover {
  text-decoration: underline;
}

/* 状态按钮 */
.status-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
}

.status-btn.active {
  background: #28a745;
  color: white;
}

.status-btn.inactive {
  background: #6c757d;
  color: white;
}

.featured-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  background: #f8f9fa;
  color: #666;
}

.featured-btn.featured {
  background: #ffc107;
  color: #333;
}

.btn-edit,
.btn-delete {
  padding: 4px 10px;
  margin: 0 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-edit {
  background: #ffc107;
  color: #333;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

/* ========================================
   移动端卡片视图
   ======================================== */
.mobile-view {
  display: none;
}

.news-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.news-card-image {
  position: relative;
  height: 180px;
  overflow: hidden;
  background: #f0f0f0;
}

.news-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-image-btn-mobile {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 18px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.upload-image-btn-mobile:hover {
  background: rgba(0, 0, 0, 0.8);
}

.news-card-content {
  padding: 15px;
}

.news-card-header {
  margin-bottom: 15px;
}

.news-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-decoration: none;
  display: block;
  margin-bottom: 10px;
  line-height: 1.4;
}

.news-card-title:hover {
  color: var(--color-primary);
}

.news-card-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.city-badge {
  background: #e7f1ff;
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
}

.date-badge {
  background: #f0f0f0;
  color: #666;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
}

.news-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.status-btn-mobile,
.featured-btn-mobile,
.edit-btn-mobile,
.delete-btn-mobile {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.status-btn-mobile.active {
  background: #28a745;
  color: white;
}

.status-btn-mobile.inactive {
  background: #6c757d;
  color: white;
}

.featured-btn-mobile.featured {
  background: #ffc107;
  color: #333;
}

.featured-btn-mobile.normal {
  background: #f0f0f0;
  color: #666;
}

.edit-btn-mobile {
  background: #ffc107;
  color: #333;
}

.delete-btn-mobile {
  background: #dc3545;
  color: white;
}

/* ========================================
   弹窗样式
   ======================================== */
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
  padding: 25px;
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

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
}

/* 图片上传区域 */
.image-upload-area {
  cursor: pointer;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 100%;
  max-height: 150px;
  border-radius: 8px;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
}

.upload-placeholder {
  border: 1px dashed var(--color-primary);
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  background: #f8f9fa;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-cancel {
  padding: 8px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-save {
  padding: 8px 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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
   响应式
   ======================================== */
@media (max-width: 768px) {
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-add {
    width: 100%;
    text-align: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
