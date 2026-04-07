// src/stores/newsStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

export const useNewsStore = defineStore('news', () => {
  const articles = ref([])
  const allArticles = ref([])
  const loading = ref(false)

  // 前台：获取已发布的新闻
  const fetchArticles = async (limit = 6) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('is_active', true)
        .order('published_date', { ascending: false })
        .limit(limit)

      if (error) throw error
      articles.value = data || []
    } catch (error) {
      console.error('載入新聞失敗:', error)
    } finally {
      loading.value = false
    }
  }

  // 后台：获取所有新闻
  const fetchAllArticles = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_date', { ascending: false })

      if (error) throw error
      allArticles.value = data || []
    } catch (error) {
      console.error('載入失敗:', error)
    } finally {
      loading.value = false
    }
  }

  // 获取单篇新闻
  const getArticleById = async (id) => {
    const { data, error } = await supabase.from('news_articles').select('*').eq('id', id).single()

    if (error) return null
    return data
  }

  // 新增新闻
  const addArticle = async (article) => {
    const { data, error } = await supabase
      .from('news_articles')
      .insert([
        {
          title: article.title,
          excerpt: article.excerpt,
          image_url: article.image_url || null,
          source_url: article.source_url,
          source_name: article.source_name || '手动添加',
          city: article.city || '珠海',
          published_date: article.published_date,
          is_active: true,
          is_featured: article.is_featured || false,
        },
      ])
      .select()

    if (error) throw error
    return data?.[0]
  }

  //更新新闻
  const updateArticle = async (id, updates) => {
    console.log('=== updateArticle 被調用 ===')
    console.log('ID:', id)
    console.log('更新內容:', updates)

    try {
      const { data, error } = await supabase
        .from('news_articles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select() // ✅ 添加 .select() 來獲取更新後的數據

      console.log('Supabase 返回的 data:', data)
      console.log('Supabase 返回的 error:', error)

      if (error) {
        console.error('更新失败:', error)
        throw error
      }

      console.log('更新成功，新數據:', data)
      return true
    } catch (error) {
      console.error('更新異常:', error)
      return false
    }
  }

  // 删除新闻
  const deleteArticle = async (id) => {
    const { error } = await supabase.from('news_articles').delete().eq('id', id)

    if (error) throw error
  }

  // 切换状态
  const toggleActive = async (id, isActive) => {
    const { error } = await supabase
      .from('news_articles')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }

  // 切换精选
  const toggleFeatured = async (id, isFeatured) => {
    const { error } = await supabase
      .from('news_articles')
      .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }

  // 分頁參數
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalCount = ref(0)
  const pageSize = ref(10)

  // 后台：分頁獲取新聞（帶排序）
  const fetchArticlesPaginated = async (page = 1, sortField = 'updated_at', sortOrder = 'desc') => {
    loading.value = true
    currentPage.value = page

    try {
      // 先獲取總數
      const { count, error: countError } = await supabase
        .from('news_articles')
        .select('*', { count: 'exact', head: true })

      if (countError) throw countError
      totalCount.value = count
      totalPages.value = Math.ceil(count / pageSize.value)

      // 獲取分頁數據
      const from = (page - 1) * pageSize.value
      const to = from + pageSize.value - 1

      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range(from, to)

      if (error) throw error
      allArticles.value = data || []
    } catch (error) {
      console.error('載入失敗:', error)
    } finally {
      loading.value = false
    }
  }

  // 改變每頁數量
  const setPageSize = async (size) => {
    pageSize.value = size
    await fetchArticlesPaginated(1, sortField.value, sortOrder.value)
  }

  // 改變排序
  const setSort = async (field, order) => {
    sortField.value = field
    sortOrder.value = order
    await fetchArticlesPaginated(1, field, order)
  }

  return {
    articles,
    allArticles,
    loading,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    fetchArticles,
    fetchAllArticles,
    fetchArticlesPaginated,
    setPageSize,
    setSort,
    fetchArticles,
    fetchAllArticles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle,
    toggleActive,
    toggleFeatured,
  }
})
