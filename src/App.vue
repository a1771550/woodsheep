<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <div class="container">
      <h1>🏠 木羊物业管理系统</h1>
      <nav>
        <router-link to="/">项目总览</router-link>
        <router-link to="/projects">项目管理</router-link>
        <router-link to="/add">添加项目</router-link>
      </nav>
    </div>
  </header>

  <main class="app-main">
    <div class="container">
      <router-view />
    </div>
  </main>

  <footer class="app-footer">
    <div class="container"><p>&copy; 2026 木羊物业 - 专业物业管理解决方案</p></div>
  </footer>
</template>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #2c8bff, #0066cc);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.app-header nav {
  display: flex;
  gap: 1.5rem;
}

.app-header nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.app-header nav a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.app-header nav a.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

.app-main {
  min-height: calc(100vh - 160px);
  padding: 2rem 0;
}

.app-footer {
  background: #f8f9fa;
  padding: 1rem 0;
  border-top: 1px solid #eee;
  text-align: center;
  color: #666;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
