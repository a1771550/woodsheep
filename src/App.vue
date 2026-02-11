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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BackendHeader from '@/components/backend/BackendHeader.vue'
import FrontendHeader from '@/components/frontend/FrontendHeader.vue'
import FrontendFooter from '@/components/frontend/FrontendFooter.vue'

export default {
  name: 'App',
  components: {
    BackendHeader,
    FrontendHeader,
    FrontendFooter
  },
  setup() {
    const route = useRoute()

    const isBackendRoute = computed(() => {
      return route.path.startsWith('/admin')
    })

    return {
      isBackendRoute
    }
  }
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
