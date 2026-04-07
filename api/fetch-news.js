// api/fetch-news.js
const { createClient } = require('@supabase/supabase-js')
const axios = require('axios')

// 初始化 Supabase 客戶端
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
)

// ========================================
// 新聞來源配置
// ========================================
const NEWS_SOURCES = [
  {
    name: '房天下-珠海',
    url: 'https://news.fang.com/zs/newsindex/market/29.html',
    city: '珠海',
    type: 'fang',
  },
  {
    name: '房天下-中山',
    url: 'https://news.fang.com/zs/newsindex/market/29.html',
    city: '中山',
    type: 'fang',
  },
  {
    name: '澳門力報-房產',
    url: 'https://www.exmoo.com/topic/estate/',
    city: '珠海',
    type: 'exmoo',
  },
]

// ========================================
// 關鍵詞權重（用於自動精選）
// ========================================
const KEYWORD_WEIGHTS = {
  珠海: 10,
  中山: 10,
  樓市: 8,
  政策: 8,
  開盤: 8,
  新盤: 7,
  地鐵: 7,
  深中通道: 10,
  港珠澳: 10,
  大灣區: 9,
  房價: 7,
  成交: 6,
  土拍: 8,
  規劃: 7,
  橫琴: 9,
  翠亨: 8,
  馬鞍島: 8,
  唐家灣: 8,
  金灣: 7,
  斗門: 7,
}

const EXCLUDE_KEYWORDS = [
  '直播',
  '專題',
  '視頻',
  '圖文',
  '廣告',
  '招商',
  '招聘',
  '投票',
  '活動報名',
  '免費領',
  '抽獎',
  '點擊',
  '鏈接',
]

// ========================================
// 工具函數
// ========================================
function isQualityArticle(title) {
  if (!title || title.length < 5 || title.length > 100) return false
  for (const kw of EXCLUDE_KEYWORDS) {
    if (title.includes(kw)) return false
  }
  return Object.keys(KEYWORD_WEIGHTS).some((kw) => title.includes(kw))
}

function calculateWeight(title) {
  let weight = 0
  for (const [kw, val] of Object.entries(KEYWORD_WEIGHTS)) {
    if (title.includes(kw)) weight += val
  }
  return weight
}

function parseDate(dateText) {
  if (!dateText) return new Date().toISOString().split('T')[0]

  // 處理 "2025-01-15" 格式
  const match = dateText.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (match) {
    return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`
  }

  // 處理 "01-15" 格式
  const match2 = dateText.match(/(\d{1,2})-(\d{1,2})/)
  if (match2) {
    return `${new Date().getFullYear()}-${match2[1].padStart(2, '0')}-${match2[2].padStart(2, '0')}`
  }

  return new Date().toISOString().split('T')[0]
}

// ========================================
// 房天下解析器
// ========================================
async function parseFangNews(source) {
  const articles = []
  try {
    const response = await axios.get(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      timeout: 15000,
    })

    const html = response.data

    // 匹配新聞列表項
    const liRegex =
      /<li[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>[\s\S]*?<span[^>]*class="[^"]*date[^"]*"[^>]*>([^<]+)<\/span>/gi
    let match
    let count = 0

    while ((match = liRegex.exec(html)) !== null && count < 15) {
      const link = match[1].startsWith('http') ? match[1] : `https:${match[1]}`
      let title = match[2].trim()
      const dateText = match[3].trim()

      // 清理標題
      title = title
        .replace(/【[^】]*】/g, '')
        .replace(/\[[^\]]*\]/g, '')
        .trim()

      if (isQualityArticle(title)) {
        articles.push({
          title: title,
          excerpt: title.substring(0, 150),
          source_url: link,
          source_name: source.name,
          city: source.city,
          published_date: parseDate(dateText),
          is_active: true,
          is_featured: calculateWeight(title) >= 15,
          weight: calculateWeight(title),
        })
        count++
      }
    }

    console.log(`  📰 ${source.name}: 找到 ${articles.length} 條有效新聞`)
  } catch (error) {
    console.error(`  ❌ ${source.name} 解析失敗:`, error.message)
  }
  return articles
}

// ========================================
// 澳門力報解析器
// ========================================
async function parseExmooNews(source) {
  const articles = []
  try {
    const response = await axios.get(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 15000,
    })

    const html = response.data

    // 匹配新聞項
    const articleRegex =
      /<article[^>]*>[\s\S]*?<h[2-3][^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>[\s\S]*?<time[^>]*>([^<]+)<\/time>/gi
    let match
    let count = 0

    while ((match = articleRegex.exec(html)) !== null && count < 10) {
      let link = match[1]
      if (link.startsWith('/')) link = `https://www.exmoo.com${link}`
      let title = match[2].trim()
      const dateText = match[3].trim()

      title = title.replace(/【[^】]*】/g, '').trim()

      if (isQualityArticle(title)) {
        articles.push({
          title: title,
          excerpt: title.substring(0, 150),
          source_url: link,
          source_name: source.name,
          city: source.city,
          published_date: parseDate(dateText),
          is_active: true,
          is_featured: calculateWeight(title) >= 15,
          weight: calculateWeight(title),
        })
        count++
      }
    }

    console.log(`  📰 ${source.name}: 找到 ${articles.length} 條有效新聞`)
  } catch (error) {
    console.error(`  ❌ ${source.name} 解析失敗:`, error.message)
  }
  return articles
}

// ========================================
// 主抓取函數
// ========================================
// api/fetch-news.js
// api/fetch-news.js
// ... 其他代码（如常量定义）保持不变 ...

// ========================================
// 主抓取函数 - 使用稳定的 RSS 源测试
// ========================================
async function fetchAllNews() {
  console.log('🚀 开始抓取新闻 (RSS 测试模式)...')
  let allArticles = []

  // 使用一个非常稳定、格式标准的 RSS 源
  const rssUrl = 'https://www.hk01.com/rss/instantnews/zone/1' // 香港01 即时新闻 (大湾区)

  console.log(`\n📡 从 RSS 源抓取: ${rssUrl}`)
  try {
    const response = await axios.get(rssUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000,
    })

    // 一个简单的正则来匹配 RSS 中的 <item> 和 <title>
    const itemRegex =
      /<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>/gi
    let match
    let count = 0
    while ((match = itemRegex.exec(response.data)) !== null && count < 5) {
      let title = match[1].trim()
      const link = match[2].trim()
      const pubDate = new Date(match[3].trim())

      // 过滤掉不相关的新闻
      if (
        title &&
        (title.includes('珠海') ||
          title.includes('中山') ||
          title.includes('大灣區') ||
          title.includes('港珠澳'))
      ) {
        allArticles.push({
          title: title,
          excerpt: title,
          source_url: link,
          source_name: '香港01 (测试源)',
          city: '大湾区',
          published_date: pubDate.toISOString().split('T')[0],
          is_active: true,
          is_featured: true, // 测试期间都标为精选
          weight: 15,
        })
        count++
      }
    }
    console.log(`  📰 RSS 测试源: 找到 ${count} 条相关新闻`)
  } catch (error) {
    console.error(`  ❌ RSS 测试源 抓取失败:`, error.message)
  }

  return allArticles
}

// ========================================
// 保存文章到數據庫
// ========================================
async function saveArticles(articles) {
  let newCount = 0
  let featuredCount = 0

  for (const article of articles) {
    try {
      // 檢查是否已存在（按標題去重）
      const { data: existing } = await supabase
        .from('news_articles')
        .select('id, is_featured')
        .eq('title', article.title)
        .maybeSingle()

      if (!existing) {
        const { error } = await supabase.from('news_articles').insert([
          {
            title: article.title,
            excerpt: article.excerpt,
            image_url: '/images/news/default.jpg',
            source_url: article.source_url,
            source_name: article.source_name,
            city: article.city,
            published_date: article.published_date,
            is_active: article.is_active,
            is_featured: article.is_featured,
            weight: article.weight,
          },
        ])

        if (error) {
          console.error(`  ❌ 保存失敗: ${article.title.substring(0, 40)}...`, error.message)
        } else {
          newCount++
          if (article.is_featured) featuredCount++
          console.log(
            `  ✅ 新增: ${article.title.substring(0, 50)}... ${article.is_featured ? '⭐' : ''}`,
          )
        }
      } else {
        // 如果已存在但權重更高，更新精選狀態
        if (article.is_featured && !existing.is_featured) {
          await supabase
            .from('news_articles')
            .update({ is_featured: true, weight: article.weight })
            .eq('id', existing.id)
          console.log(`  ⭐ 升級為精選: ${article.title.substring(0, 50)}...`)
          featuredCount++
        } else {
          console.log(`  ⏭️ 已存在: ${article.title.substring(0, 50)}...`)
        }
      }
    } catch (error) {
      console.error(`  ❌ 處理失敗: ${article.title}`, error.message)
    }
  }

  return { newCount, featuredCount }
}

// ========================================
// 清理舊文章（保留最近30天的精選 + 7天的普通）
// ========================================
async function cleanupOldArticles() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // 刪除超過7天且不是精選的文章
  const { data: oldArticles } = await supabase
    .from('news_articles')
    .select('id')
    .lt('published_date', sevenDaysAgo.toISOString().split('T')[0])
    .eq('is_featured', false)

  if (oldArticles && oldArticles.length > 0) {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .in(
        'id',
        oldArticles.map((a) => a.id),
      )

    if (!error) {
      console.log(`\n🗑️ 清理 ${oldArticles.length} 條舊文章（超過7天）`)
    }
  }

  // 刪除超過30天的精選文章
  const { data: oldFeatured } = await supabase
    .from('news_articles')
    .select('id')
    .lt('published_date', thirtyDaysAgo.toISOString().split('T')[0])
    .eq('is_featured', true)

  if (oldFeatured && oldFeatured.length > 0) {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .in(
        'id',
        oldFeatured.map((a) => a.id),
      )

    if (!error) {
      console.log(`🗑️ 清理 ${oldFeatured.length} 條舊精選文章（超過30天）`)
    }
  }
}

// ========================================
// Vercel Serverless Function 入口
// ========================================
module.exports = async (req, res) => {
  // 處理 CORS 預檢請求
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return res.status(200).end()
  }

  // 可選：添加簡單的認證（防止被濫用）
  // 暫時註釋掉授權檢查
  // const authHeader = req.headers.authorization
  // const cronSecret = process.env.CRON_SECRET
  // if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
  //   return res.status(401).json({ error: 'Unauthorized' })
  // }

  try {
    console.log('========================================')
    console.log('📅 開始每日新聞抓取任務')
    console.log(`⏰ 時間: ${new Date().toLocaleString('zh-CN')}`)
    console.log('========================================')

    const articles = await fetchAllNews()
    console.log(`\n📊 共抓取 ${articles.length} 條原始新聞`)

    // 去重（按標題前30字符）
    const uniqueMap = new Map()
    for (const article of articles) {
      const key = article.title.substring(0, 30)
      if (!uniqueMap.has(key) || uniqueMap.get(key).weight < article.weight) {
        uniqueMap.set(key, article)
      }
    }
    const uniqueArticles = Array.from(uniqueMap.values())
    console.log(`📊 去重後 ${uniqueArticles.length} 條`)

    const { newCount, featuredCount } = await saveArticles(uniqueArticles)

    await cleanupOldArticles()

    console.log('\n========================================')
    console.log(`🎉 完成！新增 ${newCount} 條新聞（其中精選 ${featuredCount} 條）`)
    console.log('========================================')

    res.status(200).json({
      success: true,
      message: `抓取完成，新增 ${newCount} 條新聞，精選 ${featuredCount} 條`,
      stats: {
        total: articles.length,
        unique: uniqueArticles.length,
        new: newCount,
        featured: featuredCount,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ 抓取失敗:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
