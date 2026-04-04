// src/utils/helpers.js

// 獲取圖片完整 URL
export const getImageUrl = (url) => {
  if (!url) return ''
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
