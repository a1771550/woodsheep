<template>
  <div class="home-view">
    <div class="hero-section">
      <h2>欢迎使用木羊物业管理系统</h2>
      <p>专业管理您的楼盘项目信息，提升工作效率</p>
    </div>

    <div class="stats-cards">
      <div class="stat-card">
        <h3>总项目数</h3>
        <p class="stat-number">{{ store.totalProjects }}</p>
      </div>
      <div class="stat-card">
        <h3>城市分布</h3>
        <p class="stat-number">{{ Object.keys(store.projectsByCity).length }}</p>
      </div>
    </div>

    <div class="quick-actions">
      <h3>快速操作</h3>
      <div class="action-buttons">
        <button @click="goToAdd" class="action-btn primary">➕ 添加新项目</button>
        <button @click="goToProjects" class="action-btn secondary">📋 查看所有项目</button>
      </div>
    </div>

    <div class="recent-projects" v-if="store.projects.length > 0">
      <h3>最近添加的项目</h3>
      <div class="project-list">
        <div v-for="project in recentProjects" :key="project.id" class="project-card">
          <h4>{{ project.name }}</h4>
          <p><strong>城市:</strong> {{ project.city }}</p>
          <p>
            <strong>状态:</strong>
            <span :class="`status-badge status-${project.status}`">
              {{ project.status }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProjectStore } from '@/stores/projectStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const store = useProjectStore()
const router = useRouter()

const recentProjects = computed(() => {
  return [...store.projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
})

function goToAdd() {
  router.push('/add')
}

function goToProjects() {
  router.push('/projects')
}
</script>

<style scoped>
.home-view {
  padding: 20px;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
}

.hero-section h2 {
  color: #2c8bff;
  margin-bottom: 10px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.stat-number {
  font-size: 2.5em;
  font-weight: bold;
  color: #2c8bff;
  margin: 10px 0;
}

.quick-actions {
  background: white;
  padding: 25px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.primary {
  background: #2c8bff;
  color: white;
}

.action-btn.secondary {
  background: #f0f0f0;
  color: #333;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.recent-projects {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.project-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.project-card {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.3s;
}

.project-card:hover {
  border-color: #2c8bff;
  box-shadow: 0 4px 8px rgba(44, 139, 255, 0.1);
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: bold;
}

.status-待跟进 {
  background: #fff3cd;
  color: #856404;
}

.status-跟进中 {
  background: #d1ecf1;
  color: #0c5460;
}
</style>
