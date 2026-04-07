<template>
  <div id="app">
    <!-- 根据路由动态显示布局 -->
    <div v-if="isBackendRoute" class="backend-layout">
      <BackendHeader />
      <div class="backend-main">
        <router-view />
      </div>
    </div>

    <div v-else class="frontend-layout">
      <FrontendHeader />
      <main class="frontend-main">
        <router-view />
      </main>
      <FrontendFooter />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import BackendHeader from '@/components/backend/BackendHeader.vue'
import FrontendHeader from '@/components/frontend/FrontendHeader.vue'
import FrontendFooter from '@/components/frontend/FrontendFooter.vue'
import { usePropertyStore } from '@/stores/propertyStore'
import { useSettingsStore } from '@/stores/settingsStore'

export default {
  name: 'App',
  components: {
    BackendHeader,
    FrontendHeader,
    FrontendFooter,
  },
  setup() {
    // ✅ 當前主題
    const currentTheme = computed(() => {
      return settingsStore.settings?.theme || 'default'
    })

    const settingsStore = useSettingsStore()
    const propertyStore = usePropertyStore()
    const route = useRoute()
    const isBackendRoute = computed(() => {
      console.log('当前路由路径:', route.path) // 调试输出当前路由路径
      return route.path.startsWith('/admin')
    })

    // ✅ 正確調用 onMounted
    onMounted(async () => {
      console.log('App 初始化：加載設定和樓盤數據...')
      await settingsStore.fetchSettings()
      await propertyStore.fetchProperties()
      console.log('App 初始化完成，當前設定:', settingsStore.settings)
    })

    // ✅ 應用主題到 body
    watch(
      currentTheme,
      (theme) => {
        // 移除所有主題 class
        document.body.classList.remove('theme-default', 'theme-warm', 'theme-dark', 'theme-forest')
        document.body.classList.add(`theme-${theme}`)
      },
      { immediate: true },
    )
    return {
      watch,
      onMounted,
      isBackendRoute,
    }
  },
}
</script>

<style>
/* 全局重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 后台布局 */
.backend-layout {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.backend-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* 前台布局 */
.frontend-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.frontend-main {
  flex: 1;
}

/* 公共工具类 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.text-center {
  text-align: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .backend-main {
    padding: 15px;
  }
}
</style>
