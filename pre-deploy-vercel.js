// pre-deploy-vercel.js
const fs = require('fs')
const path = require('path')

const distDir = path.join(__dirname, 'dist-vc') // 改為 dist-vc
const vercelDir = path.join(__dirname, 'vercel-dist')

// 刪除舊的 vercel-dist
if (fs.existsSync(vercelDir)) {
  fs.rmSync(vercelDir, { recursive: true, force: true })
}

// 複製 dist-vc 到 vercel-dist
fs.cpSync(distDir, vercelDir, { recursive: true })

// 修改 HTML 中的資源路徑
const indexPath = path.join(vercelDir, 'index.html')
let html = fs.readFileSync(indexPath, 'utf-8')
html = html.replace(/\/woodsheep\//g, '/')
fs.writeFileSync(indexPath, html)

// 複製為 404.html
fs.copyFileSync(indexPath, path.join(vercelDir, '404.html'))

console.log('✅ Vercel 部署檔案已準備好！')
