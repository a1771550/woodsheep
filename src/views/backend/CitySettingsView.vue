<template>
  <div class="city-settings-view">
    <div class="page-header">
      <h2>城市图片管理</h2>
      <button class="btn-add" @click="openAddModal">+ 添加城市</button>
    </div>

    <!-- 城市列表 -->
    <div class="city-list">
      <div v-for="city in cities" :key="city.id" class="city-card">
        <div class="city-image">
          <img :src="city.image_url" :alt="city.city_name" @error="handleImageError" />
        </div>
        <div class="city-actions">
          <button class="btn-change-image" @click="openImageUpload(city)">📷 更换图片</button>
        </div>
        <div class="city-info">
          <h3>{{ city.city_name }}</h3>
          <div class="city-controls">
            <label class="switch">
              <input type="checkbox" v-model="city.is_active" @change="toggleCityStatus(city)" />
              <span class="slider"></span>
            </label>
            <span class="status-text">{{ city.is_active ? '已启用' : '已禁用' }}</span>
          </div>
          <div class="order-control">
            <span>排序: {{ city.display_order }}</span>
            <button
              class="btn-order-up"
              @click="moveOrder(city, -1)"
              :disabled="city.display_order === 1"
            >
              ↑
            </button>
            <button
              class="btn-order-down"
              @click="moveOrder(city, 1)"
              :disabled="city.display_order === cities.length"
            >
              ↓
            </button>
          </div>
          <button class="btn-delete" @click="confirmDelete(city)">删除城市</button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="cities.length === 0 && !loading" class="empty-state">
      <p>暂无城市数据，点击「添加城市」开始创建</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 隐藏的文件上传输入框 -->
    <input
      type="file"
      ref="fileInput"
      accept="image/*"
      style="display: none"
      @change="handleFileSelect"
    />

    <!-- 添加城市弹窗 -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal-content">
        <h3>添加城市</h3>
        <div class="form-group">
          <label>城市名称 *</label>
          <input v-model="newCityName" type="text" placeholder="例如：珠海" />
        </div>
        <div class="form-group">
          <label>城市图片</label>
          <div class="upload-area" @click="triggerCityImageUpload">
            <span>📷 点击上传图片</span>
          </div>
          <div v-if="newCityImageUrl" class="image-preview">
            <img :src="newCityImageUrl" alt="预览" />
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeAddModal">取消</button>
          <button class="btn-save" @click="saveNewCity" :disabled="saving">保存</button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="删除确认"
      :message="`确定要删除城市「${cityToDelete?.city_name}」吗？`"
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
import { useCitySettingsStore } from '@/stores/citySettingsStore'
import { supabase } from '@/services/supabase'
import ConfirmDialog from '@/components/backend/ConfirmDialog.vue'

const citySettingsStore = useCitySettingsStore()

// 状态
const loading = ref(false)
const saving = ref(false)
const cities = ref([])
const showAddModal = ref(false)
const showDeleteConfirm = ref(false)
const cityToDelete = ref(null)

// 新城市表单
const newCityName = ref('')
const newCityImageUrl = ref('')
const fileInput = ref(null)
const currentUploadCity = ref(null)

// 加载数据
const loadCities = async () => {
  loading.value = true
  await citySettingsStore.fetchAllCities()
  cities.value = citySettingsStore.cities
  loading.value = false
}

// 触发文件选择
const triggerCityImageUpload = () => {
  fileInput.value?.click()
}

// 处理文件选择
// 处理文件选择
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  const fileName = `city_${Date.now()}_${file.name}`

  try {
    const { data, error } = await supabase.storage.from('property-images').upload(fileName, file)

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from('property-images').getPublicUrl(fileName)

    if (currentUploadCity.value) {
      // ✅ 编辑模式：更新现有城市的 image_url
      const success = await citySettingsStore.updateCity(currentUploadCity.value.id, {
        image_url: publicUrl,
      })

      if (success) {
        // ✅ 更新本地数据
        const index = cities.value.findIndex((c) => c.id === currentUploadCity.value.id)
        if (index !== -1) {
          cities.value[index].image_url = publicUrl
        }
        alert('图片更新成功！')
      } else {
        alert('更新失败，请重试')
      }
      currentUploadCity.value = null
    } else {
      // 添加模式：保存URL
      newCityImageUrl.value = publicUrl
      alert('图片上传成功！')
    }
  } catch (error) {
    console.error('上传失败:', error)
    alert('图片上传失败')
  }
  event.target.value = ''
}

// 打开图片上传（编辑模式）
const openImageUpload = (city) => {
  currentUploadCity.value = city
  fileInput.value?.click()
}

// 切换城市状态
const toggleCityStatus = async (city) => {
  const newStatus = !city.is_active
  const originalStatus = city.is_active

  city.is_active = newStatus

  const success = await citySettingsStore.updateCity(city.id, { is_active: newStatus })
  if (!success) {
    city.is_active = originalStatus
    alert('更新失败，请重试')
  }
}

// 调整排序
const moveOrder = async (city, direction) => {
  const currentOrder = city.display_order
  const targetOrder = currentOrder + direction
  const targetCity = cities.value.find((c) => c.display_order === targetOrder)

  if (targetCity) {
    await citySettingsStore.updateCity(city.id, { display_order: targetOrder })
    await citySettingsStore.updateCity(targetCity.id, { display_order: currentOrder })
    await loadCities()
  }
}

// 打开添加弹窗
const openAddModal = () => {
  newCityName.value = ''
  newCityImageUrl.value = ''
  currentUploadCity.value = null
  showAddModal.value = true
}

// 关闭添加弹窗
const closeAddModal = () => {
  showAddModal.value = false
  newCityName.value = ''
  newCityImageUrl.value = ''
}

// 保存新城市
const saveNewCity = async () => {
  if (!newCityName.value.trim()) {
    alert('请输入城市名称')
    return
  }

  if (!newCityImageUrl.value) {
    alert('请上传城市图片')
    return
  }

  saving.value = true

  const maxOrder = Math.max(...cities.value.map((c) => c.display_order), 0)

  const success = await citySettingsStore.addCity({
    city_name: newCityName.value,
    image_url: newCityImageUrl.value,
    display_order: maxOrder + 1,
    is_active: true,
  })

  if (success) {
    closeAddModal()
    await loadCities()
  } else {
    alert('添加失败')
  }
  saving.value = false
}

// 确认删除
const confirmDelete = (city) => {
  cityToDelete.value = city
  showDeleteConfirm.value = true
}

// 关闭删除确认
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  cityToDelete.value = null
}

// 执行删除
const executeDelete = async () => {
  if (cityToDelete.value) {
    await citySettingsStore.deleteCity(cityToDelete.value.id)
    await loadCities()
  }
  closeDeleteConfirm()
}

// 图片加载失败处理
const handleImageError = (event) => {
  event.target.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect width='200' height='120' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3E暂无图片%3C/text%3E%3C/svg%3E"
}

onMounted(() => {
  loadCities()
})
</script>

<style scoped>
.city-settings-view {
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
  background: #2c8bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-add:hover {
  background: #0066cc;
}

/* 城市列表 */
.city-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

/* 城市卡片 */
.city-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.city-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* 图片区域 */
.city-image {
  height: 160px;
  overflow: hidden;
  background: #f0f0f0;
}

.city-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 按钮区域 */
.city-actions {
  padding: 12px 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

/* 更换图片按钮 - 使用橙色 */
.btn-change-image {
  width: 100%;
  padding: 8px 12px;
  background: #fd7e14;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.3s;
}

.btn-change-image:hover {
  background: #e86200;
}

/* 信息区域 */
.city-info {
  padding: 15px;
}

.city-info h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #333;
}

/* 开关控制 */
.city-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 22px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2c8bff;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.status-text {
  font-size: 13px;
  color: #666;
}

/* 排序控制 */
.order-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #666;
}

.btn-order-up,
.btn-order-down {
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-order-up:hover:not(:disabled),
.btn-order-down:hover:not(:disabled) {
  background: #f0f0f0;
  border-color: #2c8bff;
}

.btn-order-up:disabled,
.btn-order-down:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 删除按钮 */
.btn-delete {
  width: 100%;
  padding: 8px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.3s;
}

.btn-delete:hover {
  background: #c82333;
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
  padding: 25px;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

.upload-area {
  border: 1px dashed #2c8bff;
  border-radius: 6px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  background: #f8f9fa;
  transition: all 0.3s;
}

.upload-area:hover {
  background: #e7f1ff;
  border-color: #0066cc;
}

.image-preview {
  margin-top: 10px;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 100px;
  border-radius: 6px;
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

.btn-cancel:hover {
  background: #5a6268;
}

.btn-save {
  padding: 8px 20px;
  background: #2c8bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-save:hover {
  background: #0066cc;
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

/* 响应式 */
@media (max-width: 768px) {
  .city-list {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-add {
    width: 100%;
  }
}
</style>
