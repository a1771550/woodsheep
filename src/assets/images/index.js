// assets/images/index.js - Vite方式
export const images = {
  logo: new URL('../logo/woodsheep_logo.jpg', import.meta.url).href,
  about: new URL('./about/about-us.jpg', import.meta.url).href,
  defaultProperty: new URL('./properties/default-property.jpg', import.meta.url).href,
  hero: new URL('./banners/hero-bg.jpg', import.meta.url).href,

  // 楼盘图片
  properties: {
    zhuhai1: new URL('./properties/zhuhai/jiangshanfu.jpg', import.meta.url).href,
    zhuhai2: new URL('./properties/zhuhai/yunxi.jpg', import.meta.url).href,
    zhongshan1: new URL('./properties/zhongshan/fanhuali.jpg', import.meta.url).href,
  },
}
