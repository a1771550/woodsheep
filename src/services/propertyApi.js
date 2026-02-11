// src/services/propertyApi.js - 共享API服务
export default {
  getProperties() {
    return JSON.parse(localStorage.getItem('property_projects') || '[]')
  },

  saveProperties(properties) {
    localStorage.setItem('property_projects', JSON.stringify(properties))
  },
}
