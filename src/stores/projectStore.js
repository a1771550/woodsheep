import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProjectStore = defineStore('project', () => {
  // 状态
  const defaultContact = `劉曉東 Andy Lau (86-18825327370; 852-67664051)`
  const projects = ref([
    {
      id: 1,
      name: '盛东·江山赋',
      city: '珠海',
      size: '约155-325㎡',
      tags: ['山海湖园藏品级资产', '主城云顶大宅'],
      price: '资料待补充',
      source: '楼盘资料',
      contact: defaultContact,
      status: '待跟进',
      viewings: '',
      // createdAt: '2024-01-30',
    },
    {
      id: 2,
      name: '华发·云玺',
      city: '珠海',
      size: '约50万㎡社区',
      tags: ['一线半山海景奢宅', '港湾生活社区'],
      price: '资料待补充',
      source: '楼盘资料',
      contact: defaultContact,
      status: '待跟进',
      viewings: '',
    },
    {
      id: 3,
      name: '时代都荟大境',
      city: '珠海',
      size: '75㎡两房（示例）',
      tags: ['百万大盘', '新加坡样板区'],
      price: '65万起',
      source: '楼盘资料',
      contact: 'FBB 姚泽璇',
      status: '待跟进',
      viewings: '',
    },
    {
      id: 4,
      name: '中澳·湖心印象',
      city: '珠海',
      size: '资料待补充',
      tags: ['资料待补充'],
      price: '[笔记] 形式提及',
      source: 'FBB 姚泽璇 (聊天记录)',
      contact: '待补充',
      status: '待跟进',
      viewings: '',
    },
    {
      id: 5,
      name: '中澳春城',
      city: '中山',
      size: '资料待补充',
      tags: ['人性化与智慧', '品质生活新高度', '有本期样板房'],
      price: '[笔记] 形式提及',
      source: '成达策划林巧 (聊天记录)',
      contact: '成达策划林巧',
      status: '待跟进',
      viewings: '',
    },
    {
      id: 6,
      name: '遠洋繁花里',
      city: '中山',
      size: '资料待补充',
      tags: ['社区自带香港直通车（已开通）', '直达太子湾'],
      price: '资料待补充',
      source: '收藏信息',
      contact: defaultContact,
      status: '待跟进',
      viewings: '',
    },
  ])

  // Getter - 计算属性
  const totalProjects = computed(() => projects.value.length)
  const projectsByCity = computed(() => {
    const groups = {}
    projects.value.forEach((project) => {
      if (!groups[project.city]) groups[project.city] = []
      groups[project.city].push(project)
    })
    return groups
  })

  // Actions - 修改状态的方法
  function addProject(newProject) {
    const project = {
      id: projects.value.length > 0 ? Math.max(...projects.value.map((p) => p.id)) + 1 : 1,
      createdAt: new Date().toISOString().split('T')[0],
      status: '待跟进',
      ...newProject,
    }
    projects.value.push(project)
    saveToLocalStorage()
  }

  function updateProject(id, updatedData) {
    const index = projects.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...updatedData }
      saveToLocalStorage()
    }
  }

  function deleteProject(id) {
    projects.value = projects.value.filter((p) => p.id !== id)
    saveToLocalStorage()
  }

  // 本地存储
  function saveToLocalStorage() {
    localStorage.setItem('woodsheep_projects', JSON.stringify(projects.value))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('woodsheep_projects')
    if (saved) {
      projects.value = JSON.parse(saved)
    }
  }

  function getProjectById(id) {
    return projects.value.find((p) => p.id === id)
  }

  return {
    projects,
    totalProjects,
    projectsByCity,
    addProject,
    updateProject,
    deleteProject,
    loadFromLocalStorage,
    getProjectById,
  }
})
