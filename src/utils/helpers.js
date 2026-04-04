// 獲取圖片完整 URL
export const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  const basePath = import.meta.env.BASE_URL || '/'
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  return `${basePath}${cleanUrl.slice(1)}`
}
