<template>
  <div class="dashboard-view">
    <h2>数据看板</h2>
    <p class="subtitle">楼盘数据统计概览</p>

    <!-- 统计卡片 - 添加点击跳转 -->
    <div class="stats-grid">
      <div class="stat-card clickable" @click="goToProperties">
        <div class="stat-icon">🏠</div>
        <div class="stat-info">
          <div class="stat-number">{{ totalProperties }}</div>
          <div class="stat-label">总楼盘数</div>
        </div>
      </div>

      <div class="stat-card clickable" @click="goToProperties">
        <div class="stat-icon">📍</div>
        <div class="stat-info">
          <div class="stat-number">{{ uniqueCities }}</div>
          <div class="stat-label">覆盖城市</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🖼️</div>
        <div class="stat-info">
          <div class="stat-number">{{ totalImages }}</div>
          <div class="stat-label">图片总数</div>
        </div>
      </div>

      <div class="stat-card clickable" @click="goToPropertiesByStatus('在售')">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <div class="stat-number">{{ activeProperties }}</div>
          <div class="stat-label">在售楼盘</div>
        </div>
      </div>
    </div>

    <!-- 城市分布图表 - 点击城市跳转 -->
    <div class="chart-section">
      <h3>城市楼盘分布</h3>
      <div class="city-bars">
        <div
          v-for="city in cityStats"
          :key="city.name"
          class="city-bar-item clickable"
          @click="goToPropertiesByCity(city.name)"
        >
          <div class="city-name">{{ city.name }}</div>
          <div class="bar-wrapper">
            <div class="bar" :style="{ width: `${city.percentage}%` }"></div>
            <span class="bar-count">{{ city.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 状态分布 - 点击状态跳转 -->
    <div class="status-section">
      <h3>楼盘状态分布</h3>
      <div class="status-pills">
        <div
          v-for="status in statusStats"
          :key="status.name"
          class="status-pill clickable"
          @click="goToPropertiesByStatus(status.name)"
        >
          <span :class="['status-dot', status.class]"></span>
          <span>{{ status.name }}</span>
          <span class="status-count">{{ status.count }}</span>
        </div>
      </div>
    </div>

    <!-- 最近添加的楼盘 - 添加编辑按钮 -->
    <div class="recent-section">
      <h3>最近添加的楼盘</h3>
      <div v-if="recentProperties.length === 0" class="empty-state">
        <p>暂无楼盘数据</p>
      </div>
      <table v-else class="recent-table">
        <thead>
          <tr>
            <th>楼盘名称</th>
            <th>城市</th>
            <th>状态</th>
            <th>添加/更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="property in recentProperties" :key="property.id">
            <td class="property-name clickable" @click="goToEdit(property.id)">
              {{ property.name }}
            </td>
            <td>{{ property.city }}</td>
            <td>
              <span :class="['status-badge', property.status]">
                {{ property.status }}
              </span>
            </td>
            <td>{{ formatDate(property.updated_at || property.created_at) }}</td>
            <td>
              <button class="btn-edit-small" @click="goToEdit(property.id)">编辑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertyStore } from '@/stores/propertyStore'
import { formatDate } from '@/utils/helpers'

const router = useRouter()
const propertyStore = usePropertyStore()

// 总楼盘数
const totalProperties = computed(() => {
  return propertyStore.properties?.length || 0
})

// 覆盖城市数
const uniqueCities = computed(() => {
  const cities = propertyStore.properties?.map((p) => p.city) || []
  return new Set(cities).size
})

// 图片总数
const totalImages = computed(() => {
  const images = propertyStore.properties?.flatMap((p) => p.images || []) || []
  return images.length
})

// 在售楼盘数
const activeProperties = computed(() => {
  return propertyStore.properties?.filter((p) => p.status === '在售').length || 0
})

// 城市统计
const cityStats = computed(() => {
  const properties = propertyStore.properties || []
  const cityCount = {}
  properties.forEach((p) => {
    if (p.city) {
      cityCount[p.city] = (cityCount[p.city] || 0) + 1
    }
  })

  const total = properties.length
  return Object.entries(cityCount)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
})

// 状态统计
const statusStats = computed(() => {
  const properties = propertyStore.properties || []
  const statusCount = {
    在售: { count: 0, class: 'active' },
    待跟进: { count: 0, class: 'pending' },
    已推荐: { count: 0, class: 'recommended' },
    已成交: { count: 0, class: 'completed' },
  }

  properties.forEach((p) => {
    if (statusCount[p.status]) {
      statusCount[p.status].count++
    }
  })

  return Object.entries(statusCount).map(([name, data]) => ({
    name,
    count: data.count,
    class: data.class,
  }))
})

// 最近添加的楼盘（前5条）
const recentProperties = computed(() => {
  const properties = [...(propertyStore.properties || [])]
  return properties.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
})

// 跳转到楼盘列表
const goToProperties = () => {
  router.push('/admin')
}

// 按城市筛选跳转
const goToPropertiesByCity = (city) => {
  router.push(`/admin?city=${encodeURIComponent(city)}`)
}

// 按状态筛选跳转
const goToPropertiesByStatus = (status) => {
  router.push(`/admin?status=${encodeURIComponent(status)}`)
}

// 编辑楼盘
const goToEdit = (id) => {
  router.push(`/admin/edit/${id}`)
}

onMounted(() => {
  propertyStore.fetchProperties()
})
</script>

<style scoped>
.dashboard-view {
  padding: 20px;
}

.dashboard-view h2 {
  margin-bottom: 5px;
  color: #333;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.stat-card.clickable {
  cursor: pointer;
}

.stat-card.clickable:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 40px;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #2c8bff;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

/* 城市分布图表 */
.chart-section,
.status-section,
.recent-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chart-section h3,
.status-section h3,
.recent-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}

.city-bars {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.city-bar-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.city-bar-item.clickable {
  cursor: pointer;
  padding: 5px;
  border-radius: 8px;
  transition: background 0.3s;
}

.city-bar-item.clickable:hover {
  background: #f0f7ff;
}

.city-name {
  width: 60px;
  font-weight: 500;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar {
  height: 24px;
  background: linear-gradient(90deg, #2c8bff, #0066cc);
  border-radius: 12px;
  transition: width 0.5s ease;
}

.bar-count {
  font-size: 14px;
  color: #666;
  min-width: 35px;
}

/* 状态分布 */
.status-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 30px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.status-pill.clickable:hover {
  background: #e7f1ff;
  transform: translateY(-2px);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.active {
  background: #28a745;
}

.status-dot.pending {
  background: #ffc107;
}

.status-dot.recommended {
  background: #17a2b8;
}

.status-dot.completed {
  background: #6c757d;
}

.status-count {
  font-weight: 600;
  color: #2c8bff;
  margin-left: 5px;
}

/* 最近添加表格 */
.recent-table {
  width: 100%;
  border-collapse: collapse;
}

.recent-table th,
.recent-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.recent-table th {
  font-weight: 600;
  color: #666;
  background: #f8f9fa;
}

.property-name {
  color: #2c8bff;
  font-weight: 500;
}

.property-name.clickable {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.3s;
}

.property-name.clickable:hover {
  text-decoration-color: #2c8bff;
}

.btn-edit-small {
  padding: 4px 12px;
  background: #ffc107;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-edit-small:hover {
  background: #e0a800;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
}

.status-badge.在售 {
  background: #28a745;
  color: white;
}

.status-badge.待跟进 {
  background: #ffc107;
  color: #333;
}

.status-badge.已推荐 {
  background: #17a2b8;
  color: white;
}

.status-badge.已成交 {
  background: #6c757d;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .city-bar-item {
    flex-wrap: wrap;
  }

  .bar-wrapper {
    width: 100%;
    margin-left: 60px;
  }

  .recent-table {
    font-size: 12px;
  }

  .recent-table th,
  .recent-table td {
    padding: 8px;
  }

  .recent-table .btn-edit-small {
    display: none;
  }

  .property-name.clickable {
    text-decoration: underline;
  }
}
</style>
