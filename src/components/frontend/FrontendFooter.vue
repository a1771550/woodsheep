<template>
  <footer class="site-footer">
    <div class="container">
      <!-- 移動端：簡化佈局，只顯示重要信息 -->
      <div class="footer-content">
        <!-- 關於我們 -->
        <div class="footer-section">
          <img src="@/assets/logo/woodsheep_logo.jpg" alt="木羊物业" class="footer-logo" />
          <p class="footer-desc">
            木羊物业成立于2020年，专注于珠海、中山地区优质楼盘代理服务。
            我们以专业、诚信、高效为服务宗旨。
          </p>
        </div>

        <!-- 快速連結 - 動態生成 -->
        <div class="footer-section desktop-only">
          <h3 class="footer-title">快速链接</h3>
          <ul class="footer-links">
            <li v-for="route in quickLinks" :key="route.path">
              <router-link :to="route.path">{{ route.title }}</router-link>
            </li>
          </ul>
        </div>

        <!-- 熱門城市（移動端隱藏） -->
        <div class="footer-section desktop-only">
          <h3 class="footer-title">热门城市</h3>
          <ul class="footer-links">
            <li><a href="#" @click.prevent="filterByCity('珠海')">珠海楼盘</a></li>
            <li><a href="#" @click.prevent="filterByCity('中山')">中山楼盘</a></li>
          </ul>
        </div>

        <!-- 聯繫方式 -->
        <div class="footer-section">
          <h3 class="footer-title">联系我们</h3>
          <div class="contact-list">
            <div class="contact-item">
              <span class="contact-icon">📍</span>
              <span>{{ contactAddress }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📞</span>
              <a :href="`tel:${contactPhone}`">{{ contactPhone }}</a>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
            </div>
            <div class="contact-item">
              <div class="contact-icon">💬</div>
              <div class="contact-details">
                <h3>微信客服</h3>
                <div class="qrcode-container">
                  <img
                    src="@/assets/images/wechat-qrcode.jpg"
                    alt="微信二维码"
                    class="wechat-qrcode"
                    @click="showQRCodeModal = true"
                  />
                  <p>点击二维码放大</p>
                </div>
              </div>
            </div>

            <!-- 二维码放大彈窗 -->
            <div v-if="showQRCodeModal" class="qrcode-modal" @click="showQRCodeModal = false">
              <img src="@/assets/images/wechat-qrcode.jpg" alt="微信二维码" />
            </div>
            <div class="contact-item">
              <span class="contact-icon">🕒</span>
              <span>周一至周五 9:00-18:00</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 社交鏈接 -->
      <div class="social-section">
        <div class="social-links">
          <a href="#" class="social-link">📱 微信</a>
          <a href="#" class="social-link">💬 公众号</a>
          <a :href="`mailto:${contactEmail}`" class="social-link">📧 邮箱</a>
        </div>
      </div>

      <!-- 版權信息 -->
      <div class="footer-bottom">
        <p>&copy; 2026 木羊物业 版权所有 | 粤ICP备xxxxxxxx号</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settingsStore'
import { frontendRoutes } from '@/router/index.js' // ✅ 導入前台路由
import { ref } from 'vue'

const showQRCodeModal = ref(false)
const router = useRouter()
const settingsStore = useSettingsStore()

// ✅ 只顯示未被隱藏的路由
const quickLinks = computed(() => {
  return frontendRoutes.filter((route) => route.title && !route.meta?.hidden)
})

const contactPhone = computed(() => settingsStore.settings?.contactPhone || '0756-xxxxxxx')
const contactEmail = computed(
  () => settingsStore.settings?.contactEmail || 'contact@muyangproperty.com',
)
const contactAddress = computed(
  () => settingsStore.settings?.contactAddress || '香港屯门 / 珠海香洲',
)

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
  padding: 40px 0 20px;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 桌面版佈局（4列） */
.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px;
  margin-bottom: 30px;
}

/* Logo 區域 */
.footer-logo {
  height: 50px;
  width: auto;
  object-fit: contain;
  border-radius: 6px;
  margin-bottom: 15px;
}

.footer-desc {
  line-height: 1.8;
  color: #b0b7c2;
  font-size: 14px;
}

/* 標題 */
.footer-title {
  color: white;
  font-size: 18px;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: var(--color-primary);
}

/* 鏈接列表 */
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
  color: var(--color-primary);
}

/* 聯繫方式 - 改為 flex 垂直佈局 */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #b0b7c2;
  font-size: 14px;
  line-height: 1.4;
}

.contact-icon {
  font-size: 18px;
  min-width: 28px;
  text-align: center;
}

.contact-item a {
  color: #b0b7c2;
  text-decoration: none;
  transition: color 0.3s;
}

.contact-item a:hover {
  color: var(--color-primary);
}

/* 社交鏈接區域 */
.social-section {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.social-link {
  color: #b0b7c2;
  text-decoration: none;
  transition: color 0.3s;
  padding: 5px 10px;
}

.social-link:hover {
  color: var(--color-primary);
}

/* 版權信息 */
.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #8a949e;
  font-size: 12px;
}
.wechat-qrcode {
  width: 120px;
  height: 120px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: transform 0.3s;
}

.wechat-qrcode:hover {
  transform: scale(1.05);
}

.qrcode-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.qrcode-modal img {
  max-width: 80%;
  max-height: 80%;
  border-radius: 12px;
}
/* ========================================
   移動端響應式
   ======================================== */
@media (max-width: 768px) {
  .site-footer {
    padding: 30px 0 15px;
  }

  /* 移動端改為單列佈局 */
  .footer-content {
    grid-template-columns: 1fr;
    gap: 25px;
    margin-bottom: 20px;
  }

  /* 隱藏桌面版才顯示的區域 */
  .desktop-only {
    display: none;
  }

  /* 移動端 Logo 和描述居中 */
  .footer-section {
    text-align: center;
  }

  .footer-logo {
    margin: 0 auto 15px;
  }

  .footer-desc {
    text-align: center;
    font-size: 13px;
  }

  /* 移動端標題居中 */
  .footer-title {
    text-align: center;
    margin-bottom: 15px;
  }

  .footer-title::after {
    left: 50%;
    transform: translateX(-50%);
  }

  /* 移動端聯繫方式居中 */
  .contact-list {
    align-items: center;
  }

  .contact-item {
    justify-content: center;
  }

  /* 移動端社交鏈接 */
  .social-links {
    gap: 20px;
  }

  .social-link {
    font-size: 13px;
    padding: 4px 8px;
  }

  /* 移動端版權信息 */
  .footer-bottom p {
    font-size: 11px;
  }
}

/* 平板設備 */
@media (min-width: 769px) and (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  .desktop-only {
    display: block;
  }
}
</style>
