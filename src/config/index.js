// config/index.js
export const siteConfig = {
  base: import.meta.env.BASE_URL, // '/woodsheep/'

  // 资源路径助手
  asset(path) {
    // 移除开头的斜杠避免重复
    const cleanPath = path.replace(/^\//, '')
    return `${this.base}${cleanPath}`
  },
}
