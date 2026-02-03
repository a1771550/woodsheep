<template>
  <div class="projects-view">
    <div class="page-header">
      <h2>项目管理</h2>
      <div class="controls">
        <input v-model="searchQuery" placeholder="搜索项目名称..." class="search-input" />
        <select v-model="filterCity" class="filter-select">
          <option value="">所有城市</option>
          <option value="珠海">珠海</option>
          <option value="中山">中山</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">所有状态</option>
          <option value="待跟进">待跟进</option>
          <option value="跟进中">跟进中</option>
          <option value="已推荐">已推荐</option>
          <option value="已成交">已成交</option>
        </select>
      </div>
    </div>

    <div class="projects-grid">
      <div v-for="project in filteredProjects" :key="project.id" class="project-card">
        <div class="card-header">
          <h3>{{ project.name }}</h3>
          <span class="city-badge">{{ project.city }}</span>
        </div>

        <div class="card-body">
          <p><strong>规模:</strong> {{ project.size }}</p>
          <p><strong>价格:</strong> {{ project.price }}</p>
          <p><strong>联系人:</strong> {{ project.contact }}</p>
          <p>
            <strong>状态:</strong>
            <span :class="`status-badge status-${project.status}`">
              {{ project.status }}
            </span>
          </p>

          <div class="tags" v-if="project.tags.length > 0">
            <span v-for="tag in project.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="card-footer">
          <div class="card-actions">
            <button @click="editProject(project)" class="btn-edit">编辑</button>
            <button @click="openDeleteConfirm(project.id, project.name)" class="btn-delete">
              删除
            </button>
            <!-- 确认对话框 -->
            <ConfirmDialog
              v-if="showDeleteConfirm"
              title="删除确认"
              :message="`确定要删除 '${projectToDeleteName}' 吗？此操作不可撤销。`"
              confirmText="删除"
              cancelText="取消"
              :visible="showDeleteConfirm"
              @confirm="executeDelete"
              @cancel="closeDeleteConfirm"
            />
          </div>
          <div class="card-meta">
            <small>ID: {{ project.id }}</small>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredProjects.length === 0" class="empty-state">
      <p>暂无项目数据，请添加新项目。</p>
      <button @click="goToAdd" class="btn-primary">添加第一个项目</button>
    </div>
  </div>
</template>

<script setup>
import { useProjectStore } from '@/stores/projectStore'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const store = useProjectStore()
const router = useRouter()

const searchQuery = ref('')
const filterCity = ref('')
const filterStatus = ref('')

const filteredProjects = computed(() => {
  return store.projects.filter((project) => {
    // 搜索过滤
    const matchesSearch =
      searchQuery.value === '' ||
      project.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    // 城市过滤
    const matchesCity = filterCity.value === '' || project.city === filterCity.value

    // 状态过滤
    const matchesStatus = filterStatus.value === '' || project.status === filterStatus.value

    return matchesSearch && matchesCity && matchesStatus
  })
})

function editProject(project) {
  // 这里可以跳转到编辑页面或打开模态框
  // alert(`编辑项目: ${project.name}`)
  // 实际实现时：
  router.push(`/edit/${project.id}`)
}

const emit = defineEmits(['delete'])
import ConfirmDialog from '@/components/ConfirmDialog.vue'

// 状态管理
const showDeleteConfirm = ref(false)
const projectToDeleteId = ref(null)
const projectToDeleteName = ref('')

// 打开确认对话框
const openDeleteConfirm = (id, name) => {
  projectToDeleteId.value = id
  projectToDeleteName.value = name || '此项目'
  showDeleteConfirm.value = true
}

// 关闭确认对话框
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  projectToDeleteId.value = null
  projectToDeleteName.value = ''
}

// 执行删除（原来的onDeleteClick逻辑移到这里）
const executeDelete = () => {
  console.log('id:' + projectToDeleteId.value)
  if (projectToDeleteId.value) {
    store.deleteProject(projectToDeleteId.value)
  }
  closeDeleteConfirm()
}

function goToAdd() {
  router.push('/add')
}

onMounted(() => {
  store.loadFromLocalStorage()
})
</script>

<style scoped>
.projects-view {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.controls {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.search-input,
.filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  /* 新增：使用 Flex 布局使卡片内容自然扩展 */
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  padding: 20px;
  background: linear-gradient(135deg, #2c8bff, #0066cc);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2em;
}

.city-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
}

.card-body {
  padding: 20px;
}

.card-body p {
  margin: 8px 0;
  color: #555;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
}

.tag {
  background: #e7f1ff;
  color: #0066cc;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.85em;
}

.card-footer {
  padding: 15px 20px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  display: flex;
  /* justify-content: space-between; */
  flex-wrap: wrap; /* 允许在小屏幕上换行 */
  gap: 10px; /* 替代 margin */
  align-items: center;
  /* 关键：使 footer 保持在卡片底部 */
  margin-top: auto;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.btn-edit,
.btn-delete {
  padding: 6px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s;
}

.btn-edit {
  background: #ffc107;
  color: #333;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-edit:hover,
.btn-delete:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.card-meta {
  color: #666;
  font-size: 0.85em;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.btn-primary {
  padding: 12px 30px;
  background: #2c8bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  margin-top: 20px;
}

.btn-primary:hover {
  background: #0066cc;
}
</style>
