// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 前台路由 (公開展示)
export const frontendRoutes = [
  {
    path: '/',
    name: 'home',
    title: '首页',
    component: () => import('@/views/frontend/HomeView.vue'),
  },
  {
    path: '/properties',
    name: 'properties',
    title: '楼盘展示',
    component: () => import('@/views/frontend/PropertyDisplay.vue'),
  },
  {
    path: '/about',
    name: 'about',
    title: '关于我们',
    component: () => import('@/views/frontend/AboutView.vue'),
  },
  {
    path: '/contact',
    name: 'contact',
    title: '联系我们',
    component: () => import('@/views/frontend/ContactView.vue'),
  },
  {
    path: '/properties/:id',
    name: 'property-detail',
    title: '楼盘详情',
    component: () => import('@/views/frontend/PropertyDetail.vue'),
    meta: { hidden: true }, // ✅ 隱藏，不在導航顯示
  },
]

// 後台路由 (管理系統)
export const adminRoutes = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/backend/ProjectsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/add',
    name: 'add-property',
    component: () => import('@/views/backend/ProjectFormView.vue'),
  },
  {
    path: '/admin/edit/:id',
    name: 'edit-property',
    component: () => import('@/views/backend/ProjectFormView.vue'),
    props: true,
  },
  {
    path: '/admin/carousel',
    name: 'admin-carousel',
    component: () => import('@/views/backend/CarouselView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('@/views/backend/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: () => import('@/views/backend/SettingsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/city-settings',
    name: 'admin-city-settings',
    component: () => import('@/views/backend/CitySettingsView.vue'),
    meta: { requiresAuth: true },
  },
]

// 本地開發時使用全部路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...frontendRoutes, ...adminRoutes],
  // ✅ 添加滾動行為
  scrollBehavior(to, from, savedPosition) {
    // 如果有 savedPosition（例如瀏覽器前進/後退），使用保存的位置
    if (savedPosition) {
      return savedPosition
    }

    // 如果是返回後台列表頁，滾動到頂部
    if (to.name === 'admin' && from.name === 'add-property') {
      return { top: 0, behavior: 'smooth' }
    }

    // 如果是返回後台列表頁（編輯後）
    if (to.name === 'admin' && from.name === 'edit-property') {
      return { top: 0, behavior: 'smooth' }
    }

    // 其他情況，滾動到頂部
    return { top: 0 }
  },
})

export default router
