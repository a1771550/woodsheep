<template>
  <div class="image-uploader">
    <div class="upload-area" @click="triggerFileInput">
      <div class="upload-icon">📷</div>
      <p>點擊上傳圖片</p>
      <p class="upload-hint">支援 JPG、PNG、WebP，單張不超過 5MB</p>
      <input
        type="file"
        ref="fileInput"
        multiple
        accept="image/*"
        style="display: none"
        @change="handleFileSelect"
      />
    </div>

    <div class="image-grid" v-if="images.length > 0">
      <div v-for="(img, index) in images" :key="index" class="image-item">
        <img :src="img.url" :alt="'圖片 ' + (index + 1)" />
        <div class="image-overlay" v-if="img.uploading">
          <div class="spinner-small"></div>
          <span>上傳中...</span>
        </div>
        <button
          type="button"
          class="remove-btn"
          @click="removeImage(index)"
          :disabled="img.uploading"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { supabase } from '@/services/supabase'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const images = ref([])
const fileInput = ref(null)

// 初始化圖片
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && newVal.length) {
      images.value = newVal.map((url) => ({ url, uploading: false }))
    }
  },
  { immediate: true },
)

// 上傳單張圖片
const uploadImage = async (file) => {
  const fileName = `${Date.now()}_${file.name}`
  const tempUrl = URL.createObjectURL(file)

  // 添加臨時圖片
  const tempIndex = images.value.length
  images.value.push({
    url: tempUrl,
    uploading: true,
  })

  try {
    // 上傳到 Supabase Storage
    const { data, error } = await supabase.storage.from('property-images').upload(fileName, file)

    if (error) throw error

    // 獲取公開 URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('property-images').getPublicUrl(fileName)

    // 更新圖片 URL
    images.value[tempIndex] = {
      url: publicUrl,
      uploading: false,
    }

    // 更新父組件
    emit(
      'update:modelValue',
      images.value.map((img) => img.url),
    )

    return publicUrl
  } catch (error) {
    console.error('上傳失敗:', error)
    images.value.splice(tempIndex, 1)
    alert('圖片上傳失敗：' + error.message)
    throw error
  }
}

// 選擇檔案
const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files)

  for (const file of files) {
    // 驗證檔案類型
    if (!file.type.startsWith('image/')) {
      alert('只支援圖片檔案')
      continue
    }

    // 驗證檔案大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('圖片不能超過 5MB')
      continue
    }

    await uploadImage(file)
  }

  // 清空 input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 刪除圖片
const removeImage = async (index) => {
  const img = images.value[index]

  if (img.uploading) {
    alert('正在上傳中，請稍後')
    return
  }

  // 從 URL 中提取檔案名稱
  const urlParts = img.url.split('/')
  const fileName = urlParts[urlParts.length - 1]

  try {
    // 從 Supabase 刪除
    await supabase.storage.from('property-images').remove([fileName])
  } catch (error) {
    console.error('刪除失敗:', error)
  }

  images.value.splice(index, 1)
  emit(
    'update:modelValue',
    images.value.map((img) => img.url),
  )
}

// 觸發檔案選擇
const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>

<style scoped>
.image-uploader {
  margin-top: 10px;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.upload-area:hover {
  border-color: var(--color-primary);
  background: #f0f7ff;
}

.upload-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.image-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  aspect-ratio: 1;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  gap: 8px;
}

.spinner-small {
  width: 24px;
  height: 24px;
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

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: all 0.3s;
  z-index: 2;
}

.remove-btn:hover {
  background: #dc3545;
  transform: scale(1.1);
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
