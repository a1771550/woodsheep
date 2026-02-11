<template>
  <header class="backend-header">
    <div class="header-container">
      <!-- Logo区域 -->
      <div class="logo-area">
        <router-link to="/admin" class="logo-link">
          <img src="@/assets/logo/woodsheep_logo.jpg" alt="木羊物业" class="site-logo" />
          <div class="logo-text">
            <h2 class="site-title">木羊物业</h2>
            <p class="site-subtitle">管理系统</p>
          </div>
        </router-link>
      </div>

      <!-- 后台导航 -->
      <nav class="backend-nav">
        <router-link to="/admin" class="nav-item" active-class="active">
          <span class="nav-icon">📊</span>
          <span class="nav-label">项目管理</span>
        </router-link>
        <router-link to="/admin/dashboard" class="nav-item" active-class="active">
          <span class="nav-icon">📈</span>
          <span class="nav-label">数据看板</span>
        </router-link>
        <router-link to="/admin/settings" class="nav-item" active-class="active">
          <span class="nav-icon">⚙️</span>
          <span class="nav-label">系统设置</span>
        </router-link>
      </nav>

      <!-- 管理员信息 -->
      <div class="admin-info">
        <div class="admin-avatar">
          <span class="avatar-icon">👤</span>
        </div>
        <div class="admin-details">
          <span class="admin-name">刘耀基</span>
          <span class="admin-role">管理员</span>
        </div>
        <button class="logout-btn" @click="handleLogout" title="退出登录">
          <span class="logout-icon">🚪</span>
        </button>
      </div>

      <!-- 移动端菜单按钮 -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <span class="hamburger"></span>
      </button>
    </div>

    <!-- 移动端导航 -->
    <transition name="slide">
      <div v-if="showMobileMenu" class="mobile-nav">
        <router-link to="/admin" class="mobile-nav-item" @click="closeMobileMenu">
          <span class="nav-icon">📊</span> 项目管理
        </router-link>
        <router-link to="/admin/dashboard" class="mobile-nav-item" @click="closeMobileMenu">
          <span class="nav-icon">📈</span> 数据看板
        </router-link>
        <router-link to="/admin/settings" class="mobile-nav-item" @click="closeMobileMenu">
          <span class="nav-icon">⚙️</span> 系统设置
        </router-link>
        <div class="mobile-divider"></div>
        <div class="mobile-user">
          <span class="mobile-user-name">刘耀基 (管理员)</span>
        </div>
        <button class="mobile-logout-btn" @click="handleLogout">
          <span class="logout-icon">🚪</span> 退出登录
        </button>
      </div>
    </transition>
  </header>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'BackendHeader',
  setup() {
    const router = useRouter()
    const showMobileMenu = ref(false)

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
    }

    const closeMobileMenu = () => {
      showMobileMenu.value = false
    }

    const handleLogout = () => {
      // 这里添加登出逻辑
      if (confirm('确定要退出登录吗？')) {
        // 清除登录状态
        localStorage.removeItem('admin_token')
        router.push('/')
      }
    }

    return {
      showMobileMenu,
      toggleMobileMenu,
      closeMobileMenu,
      handleLogout
    }
  }
}
</script>

<style scoped>
.backend-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #e9ecef;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo区域 */
.logo-area {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.site-logo {
  height: 45px;
  width: auto;
  object-fit: contain;
  border-radius: 6px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.site-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c8bff;
}

.site-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: #6c757d;
}

/* 后台导航 */
.backend-nav {
  display: flex;
  gap: 5px;
  flex-grow: 1;
  justify-content: center;
  margin: 0 30px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  color: #495057;
  transition: all 0.3s;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #2c8bff;
}

.nav-item.active {
  background: #e7f1ff;
  color: #2c8bff;
  font-weight: 500;
}

.nav-icon {
  font-size: 18px;
}

.nav-label {
  font-size: 15px;
}

/* 管理员信息 */
.admin-info {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #f8f9fa;
  padding: 5px 15px;
  border-radius: 30px;
  flex-shrink: 0;
}

.admin-avatar {
  width: 36px;
  height: 36px;
  background: #2c8bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  color: white;
  font-size: 20px;
}

.admin-details {
  display: flex;
  flex-direction: column;
}

.admin-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.admin-role {
  font-size: 12px;
  color: #6c757d;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(220, 53, 69, 0.1);
}

.logout-icon {
  font-size: 18px;
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: #333;
  position: relative;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: #333;
  transition: all 0.3s;
}

.hamburger::before {
  top: -6px;
}

.hamburger::after {
  bottom: -6px;
}

/* 移动端导航 */
.mobile-nav {
  display: none;
  flex-direction: column;
  padding: 20px;
  background: white;
  border-top: 1px solid #eee;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 0;
  text-decoration: none;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.mobile-nav-item:last-child {
  border-bottom: none;
}

.mobile-nav-item.active {
  color: #2c8bff;
  font-weight: 500;
}

.mobile-divider {
  height: 1px;
  background: #eee;
  margin: 15px 0;
}

.mobile-user {
  padding: 10px 0;
  color: #6c757d;
}

.mobile-logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 0;
  background: none;
  border: none;
  color: #dc3545;
  font-size: 16px;
  cursor: pointer;
}

/* 移动端动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式 */
@media (max-width: 992px) {
  .backend-nav {
    display: none;
  }

  .admin-info {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-nav {
    display: flex;
  }

  .site-title {
    font-size: 18px;
  }

  .site-logo {
    height: 40px;
  }
}

@media (max-width: 480px) {
  .site-subtitle {
    display: none;
  }

  .logo-text {
    display: none;
  }
}
</style>
