// src/utils/helpers.js

// 獲取圖片完整 URL
export const getImageUrl = (url) => {
  if (!url) return defaultImage
  // 如果是完整 URL（以 http:// 或 https:// 開頭），直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // 如果是相對路徑，添加基礎路徑
  const basePath = import.meta.env.BASE_URL || '/'
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  return `${basePath}${cleanUrl.slice(1)}`
}

// 格式化日期
export const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export const defaultImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"%3E%3Crect width="200" height="120" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3E暂无图片%3C/text%3E%3C/svg%3E'
// 处理图片加载错误，返回默认图片 URL
export const handleImageError = (event) => {
  // 使用更簡單的 data:image 格式
  event.target.src = defaultImage
}
