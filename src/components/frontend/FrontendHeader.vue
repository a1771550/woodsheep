<template>
  <header class="frontend-header">
    <div class="container">
      <div class="header-main">
        <router-link to="/" class="logo-link">
          <img src="@/assets/logo/woodsheep_logo.jpg" alt="木羊物业" class="site-logo" />
          <div class="logo-text">
            <h1 class="site-title">{{ siteName }}</h1>
            <p class="site-slogan">{{ siteSlogan }}</p>
          </div>
        </router-link>
        <!-- 桌面导航 -->
        <!-- <nav class="desktop-nav">
          <router-link to="/" class="nav-link" exact-active-class="active">首页</router-link>
          <router-link to="/properties" class="nav-link" active-class="active"
            >楼盘展示</router-link
          >
          <router-link to="/about" class="nav-link" active-class="active">关于我们</router-link>
          <router-link to="/contact" class="nav-link" active-class="active">联系我们</router-link>
        </nav> -->
        <!-- ✅ 桌面导航 - 動態生成 -->
        <nav class="desktop-nav">
          <router-link
            v-for="route in navRoutes"
            :key="route.path"
            :to="route.path"
            class="nav-link"
            exact-active-class="active"
          >
            {{ route.title }}
          </router-link>
        </nav>
        <!-- 联系方式 -->
        <div class="contact-info">
          <div class="phone-number">
            <span class="phone-icon">📞</span>
            <div class="phone-details">
              <span class="phone-label">咨询热线</span>
              <a :href="`tel:${contactPhone}`" class="phone-value">{{ contactPhone }}</a>
            </div>
          </div>
        </div>

        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span class="hamburger"></span>
        </button>
      </div>

      <!-- 移动端导航菜单 -->
      <!-- <transition name="slide">
        <div v-if="showMobileMenu" class="mobile-nav">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">首页</router-link>
          <router-link to="/properties" class="mobile-nav-link" @click="closeMobileMenu"
            >楼盘展示</router-link
          >
          <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu"
            >关于我们</router-link
          >
          <router-link to="/contact" class="mobile-nav-link" @click="closeMobileMenu"
            >联系我们</router-link
          >
          <div class="mobile-contact mobile-nav-link">
            <span class="mobile-phone-label">咨询热线</span>
            <a :href="`tel:${contactPhone}`" class="mobile-phone-value">{{ contactPhone }}</a>
          </div>
        </div>
      </transition> -->
      <!-- ✅ 移动端导航菜单 - 動態生成 -->
      <transition name="slide">
        <div v-if="showMobileMenu" class="mobile-nav">
          <router-link
            v-for="route in navRoutes"
            :key="route.path"
            :to="route.path"
            class="mobile-nav-link"
            @click="closeMobileMenu"
          >
            {{ route.title }}
          </router-link>
          <div class="mobile-contact mobile-nav-link">
            <span class="mobile-phone-label">咨询热线</span>
            <a :href="`tel:${contactPhone}`" class="mobile-phone-value">{{ contactPhone }}</a>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { frontendRoutes } from '@/router/index.js' // ✅ 導入前台路由

// ✅ 從路由配置生成導航菜單（過濾掉不需要在菜單顯示的路由）
const navRoutes = computed(() => {
  return frontendRoutes.filter((route) => route.title && !route.meta?.hidden)
})

const settingsStore = useSettingsStore()
const showMobileMenu = ref(false)

// ✅ 從設定中獲取網站信息
const siteName = computed(() => settingsStore.settings?.siteName || '木羊物业')
const siteSlogan = computed(
  () => settingsStore.settings?.siteSlogan || '专业地产服务，连接美好生活',
)
const contactPhone = computed(() => settingsStore.settings?.contactPhone || '0756-xxxxxxx')

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}
</script>

<style scoped>
.frontend-header {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 15px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

/* Logo区域 */
.logo-link {
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
  color: inherit;
}

.site-logo {
  height: 60px;
  width: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.site-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #2c8bff;
  letter-spacing: 1px;
}

.site-slogan {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
  letter-spacing: 0.5px;
}

/* 桌面导航 */
.desktop-nav {
  display: flex;
  gap: 30px;
  flex-grow: 1;
  justify-content: center;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 0;
  position: relative;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #2c8bff;
}

.nav-link.active {
  color: #2c8bff;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #2c8bff;
  border-radius: 3px;
}

/* 联系方式 */
.contact-info {
  flex-shrink: 0;
}

.phone-number {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f9fa;
  padding: 10px 15px;
  border-radius: 8px;
  border-left: 4px solid #2c8bff;
}

.phone-icon {
  font-size: 24px;
}

.phone-details {
  display: flex;
  flex-direction: column;
}

.phone-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.phone-value {
  font-size: 16px;
  font-weight: 600;
  color: #2c8bff;
  text-decoration: none;
}

.phone-value:hover {
  color: #0066cc;
}
/* 移动端菜单按钮 - 確保顯示 */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  position: relative;
  width: 44px;
  height: 44px;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: #333;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: #333;
  transition: all 0.3s;
  left: 0;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}
/* 响应式 */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .contact-info {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-nav {
    display: flex;
  }

  .logo-link {
    gap: 10px;
  }

  .site-title {
    font-size: 22px;
  }

  .site-slogan {
    font-size: 12px;
  }

  .site-logo {
    height: 45px;
  }
  .mobile-menu-btn {
    display: block !important; /* ✅ 加上 !important 確保顯示 */
  }

  .desktop-nav {
    display: none !important;
  }

  .contact-info {
    display: none !important;
  }
}

@media (max-width: 480px) {
  .site-slogan {
    display: none;
  }

  .site-title {
    font-size: 20px;
  }

  .site-logo {
    height: 40px;
  }
}
</style>
