<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <!-- 关于我们 -->
        <div class="footer-section">
          <img src="@/assets/logo/woodsheep_logo.jpg" alt="木羊物业" class="footer-logo" />
          <p class="footer-desc">
            木羊物业成立于2020年，专注于珠海、中山地区优质楼盘代理服务。
            我们以专业、诚信、高效为服务宗旨。
          </p>
          <div class="social-links">
            <a href="#" class="social-link">📱</a>
            <a href="#" class="social-link">💬</a>
            <a href="#" class="social-link">📧</a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div class="footer-section">
          <h3 class="footer-title">快速链接</h3>
          <ul class="footer-links">
            <li><router-link to="/woodsheep">首页</router-link></li>
            <li><router-link to="/properties">楼盘展示</router-link></li>
            <li><router-link to="/about">关于我们</router-link></li>
            <li><router-link to="/contact">联系我们</router-link></li>
          </ul>
        </div>

        <!-- 热门城市 -->
        <div class="footer-section">
          <h3 class="footer-title">热门城市</h3>
          <ul class="footer-links">
            <li><a href="#" @click.prevent="filterByCity('珠海')">珠海楼盘</a></li>
            <li><a href="#" @click.prevent="filterByCity('中山')">中山楼盘</a></li>
          </ul>
        </div>

        <!-- 联系方式 -->
        <div class="footer-section">
          <h3 class="footer-title">联系我们</h3>
          <ul class="contact-list">
            <li>
              <span class="contact-icon">📍</span>
              <span>香港屯门 / 珠海香洲</span>
            </li>
            <li>
              <span class="contact-icon">📞</span>
              <a href="tel:0756-xxxxxxx">0756-xxxxxxx</a>
            </li>
            <li>
              <span class="contact-icon">📧</span>
              <a href="mailto:contact@muyangproperty.com">contact@muyangproperty.com</a>
            </li>
            <li>
              <span class="contact-icon">🕒</span>
              <span>周一至周五 9:00-18:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 木羊物业 版权所有 | 粤ICP备xxxxxxxx号</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const socialLinks = [
  { name: '微信', icon: '📱', url: '#' },
  { name: '公众号', icon: '💬', url: '#' },
  { name: '邮箱', icon: '📧', url: 'mailto:contact@muyangproperty.com' },
]

const quickLinks = [
  { path: '/', name: '首页' },
  { path: '/properties', name: '楼盘展示' },
  { path: '/about', name: '关于我们' },
  { path: '/contact', name: '联系我们' },
]

const hotCities = [{ name: '珠海' }, { name: '中山' }]

const contactInfo = [
  { icon: '📍', value: '香港屯门 / 珠海香洲', link: null },
  { icon: '📞', value: '0756-xxxxxxx', link: 'tel:0756-xxxxxxx' },
  { icon: '📧', value: 'contact@muyangproperty.com', link: 'mailto:contact@muyangproperty.com' },
  { icon: '🕒', value: '周一至周五 9:00-18:00', link: null },
]

const filterByCity = (city) => {
  router.push({
    path: '/properties',
    query: { city },
  })
}
</script>

<style scoped>
.site-footer {
  background: #1a2634;
  color: #e0e0e0;
  padding: 60px 0 20px;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px;
  margin-bottom: 40px;
}

/* Logo区域 */
.footer-logo {
  height: 50px;
  width: auto;
  object-fit: contain;
  border-radius: 6px;
  margin-bottom: 20px;
}

.footer-desc {
  line-height: 1.8;
  margin-bottom: 20px;
  color: #b0b7c2;
}

/* 社交链接 */
.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s;
}

.social-link:hover {
  background: #2c8bff;
  transform: translateY(-3px);
}

/* 链接区域 */
.footer-title {
  color: white;
  font-size: 18px;
  margin-bottom: 20px;
  position: relative;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0 !important;
  width: 40px;
  height: 2px;
  background: #2c8bff;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #b0b7c2;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #2c8bff;
}

/* 联系方式 */
.contact-list {
  list-style: none;
  padding: 0;
}

.contact-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 15px;
  color: #b0b7c2;
}

.contact-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.contact-list a {
  color: #b0b7c2;
  text-decoration: none;
  transition: color 0.3s;
}

.contact-list a:hover {
  color: #2c8bff;
}

/* 底部版权 */
.footer-bottom {
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: #8a949e;
  font-size: 14px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer-section:first-child {
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }

  .footer-title::after {
    left: 3% !important;
    transform: translateX(-50%);
  }

  .contact-list li {
    justify-content: center;
  }
}
</style>
