<template>
  <div class="about-view">
    <div class="container">
      <!-- 頁面標題 -->
      <div class="page-header">
        <h1>关于我们</h1>
        <p>了解木羊物业的故事与使命</p>
      </div>

      <!-- 公司簡介 -->
      <section class="section company-intro">
        <div class="intro-content">
          <h2>木羊物业</h2>
          <p class="intro-text">
            木羊物业成立于2020年，是一家专注于珠海、中山地区优质楼盘代理服务的专业地产公司。
            我们以专业、诚信、高效为服务宗旨，致力于为客户提供最优质的购房体验。
          </p>
          <p class="intro-text">
            凭借多年的行业经验和对市场的深刻理解，我们已经成功帮助超过1000位客户找到理想家园。
            我们与区域内50多个优质楼盘建立了深度合作关系，为客户提供最全面的房源选择。
          </p>
        </div>
        <div class="intro-image">
          <img src="@/assets/images/about/about-us.jpg" alt="关于木羊物业" />
        </div>
      </section>

      <!-- 核心價值 -->
      <section class="section core-values">
        <h2>我们的核心价值</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">🎯</div>
            <h3>专业</h3>
            <p>十年行业经验，专业地产顾问团队，为您提供最专业的购房建议</p>
          </div>
          <div class="value-card">
            <div class="value-icon">🤝</div>
            <h3>诚信</h3>
            <p>价格透明公开，无隐藏费用，让您买得放心，住得安心</p>
          </div>
          <div class="value-card">
            <div class="value-icon">⚡</div>
            <h3>高效</h3>
            <p>一站式购房服务，从看房到签约，全程专人跟进，省时省心</p>
          </div>
          <div class="value-card">
            <div class="value-icon">❤️</div>
            <h3>贴心</h3>
            <p>24小时在线咨询，售后持续跟进，让您感受家一般的温暖</p>
          </div>
        </div>
      </section>

      <!-- 服務流程 -->
      <section class="section service-flow">
        <h2>我们的服务流程</h2>
        <div class="flow-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-icon">🔍</div>
            <h4>需求分析</h4>
            <p>了解您的购房预算、区域偏好、户型需求</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-icon">🏠</div>
            <h4>精选房源</h4>
            <p>专业顾问为您推荐最适合的楼盘</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-icon">👀</div>
            <h4>实地看房</h4>
            <p>专车接送，全程陪同，实地考察</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-icon">📝</div>
            <h4>签约交易</h4>
            <p>专业律师把关，确保交易安全</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">5</div>
            <div class="step-icon">🔑</div>
            <h4>验房交楼</h4>
            <p>专业验房，安心收楼</p>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">6</div>
            <div class="step-icon">🎉</div>
            <h4>售后服务</h4>
            <p>入住后持续跟进，解决后顾之忧</p>
          </div>
        </div>
      </section>

      <!-- 合作夥伴 -->
      <section class="section partners">
        <h2>我们的合作伙伴</h2>
        <div class="partners-grid">
          <div class="partner-item">
            <div class="partner-icon">🏢</div>
            <p>盛东集团</p>
          </div>
          <div class="partner-item">
            <div class="partner-icon">🏗️</div>
            <p>华发地产</p>
          </div>
          <div class="partner-item">
            <div class="partner-icon">🏘️</div>
            <p>远洋地产</p>
          </div>
          <div class="partner-item">
            <div class="partner-icon">🏙️</div>
            <p>时代中国</p>
          </div>
          <div class="partner-item">
            <div class="partner-icon">🏡</div>
            <p>保利发展</p>
          </div>
          <div class="partner-item">
            <div class="partner-icon">🏛️</div>
            <p>中澳集团</p>
          </div>
        </div>
      </section>

      <!-- 聯繫我們 -->
      <section class="section contact-us">
        <div class="contact-card">
          <h2>联系我们</h2>
          <p>有任何问题？我们随时为您解答</p>
          <div class="contact-info-grid">
            <div class="contact-info-item">
              <span class="contact-icon">📞</span>
              <div>
                <strong>咨询热线</strong>
                <a :href="`tel:${contactPhone}`">{{ contactPhone }}</a>
              </div>
            </div>
            <div class="contact-info-item">
              <span class="contact-icon">📧</span>
              <div>
                <strong>电子邮箱</strong>
                <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
              </div>
            </div>
            <div class="contact-info-item">
              <span class="contact-icon">📍</span>
              <div>
                <strong>公司地址</strong>
                <span>{{ contactAddress }}</span>
              </div>
            </div>
            <div class="contact-info-item">
              <span class="contact-icon">🕒</span>
              <div>
                <strong>工作时间</strong>
                <span>周一至周五 9:00 - 18:00</span>
              </div>
            </div>
          </div>
          <router-link to="/contact" class="btn-contact">在线留言</router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()

const contactPhone = computed(() => settingsStore.settings?.contactPhone || '0756-xxxxxxx')
const contactEmail = computed(
  () => settingsStore.settings?.contactEmail || 'contact@muyangproperty.com',
)
const contactAddress = computed(
  () => settingsStore.settings?.contactAddress || '香港屯门 / 珠海香洲',
)
</script>

<style scoped>
.about-view {
  padding: 40px 0;
  min-height: 70vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 頁面標題 */
.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-header h1 {
  font-size: 42px;
  color: #333;
  margin-bottom: 15px;
}

.page-header p {
  font-size: 18px;
  color: #666;
}

/* 通用章節 */
.section {
  margin-bottom: 60px;
}

.section h2 {
  text-align: center;
  font-size: 32px;
  color: #333;
  margin-bottom: 40px;
  position: relative;
}

.section h2::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--color-primary);
}

/* 公司簡介 */
.company-intro {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: center;
}

.intro-text {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 20px;
}

.intro-image img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* 核心價值 */
.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.value-card {
  text-align: center;
  padding: 30px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.value-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.value-card h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.value-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* 服務流程 */
.flow-steps {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.step {
  flex: 1;
  min-width: 150px;
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.step-number {
  width: 30px;
  height: 30px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  font-weight: bold;
}

.step-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.step h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.step p {
  font-size: 12px;
  color: #666;
}

.step-arrow {
  font-size: 24px;
  color: var(--color-primary);
}

/* 合作夥伴 */
.partners-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  text-align: center;
}

.partner-item {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.partner-item:hover {
  background: var(--color-primary-light);
  transform: translateY(-3px);
}

.partner-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.partner-item p {
  font-size: 14px;
  color: #333;
}

/* 聯繫我們 */
.contact-card {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
}

.contact-card h2 {
  color: white;
}

.contact-card h2::after {
  background: white;
}

.contact-card p {
  margin-bottom: 30px;
  opacity: 0.9;
}

.contact-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  text-align: left;
}

.contact-info-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.contact-icon {
  font-size: 24px;
}

.contact-info-item a {
  color: white;
  text-decoration: none;
}

.contact-info-item a:hover {
  text-decoration: underline;
}

.btn-contact {
  display: inline-block;
  padding: 12px 30px;
  background: white;
  color: var(--color-primary);
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-contact:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 響應式 */
@media (max-width: 1024px) {
  .values-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .partners-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .flow-steps {
    flex-direction: column;
  }

  .step-arrow {
    transform: rotate(90deg);
  }
}

@media (max-width: 768px) {
  .company-intro {
    grid-template-columns: 1fr;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }

  .partners-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .contact-info-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 32px;
  }

  .section h2 {
    font-size: 24px;
  }
}
</style>
