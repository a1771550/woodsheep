<template>
  <a
    v-if="isWhatsApp"
    :href="whatsappLink"
    target="_blank"
    rel="noopener noreferrer"
    class="whatsapp-link"
    :class="customClass"
  >
    <span class="whatsapp-icon">📱</span>
    <span>{{ displayText }}</span>
  </a>
  <span v-else :class="customClass">
    {{ displayText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  contact: {
    type: String,
    default: '',
  },
  customClass: {
    type: String,
    default: '',
  },
})

// 提取電話號碼
const phoneNumber = computed(() => {
  if (!props.contact) return ''
  const numbers = props.contact.match(/\d+/g)
  if (!numbers) return ''
  let phone = numbers.join('')
  // 移除開頭的 852
  phone = phone.replace(/^852/, '')
  // 移除開頭的 0
  phone = phone.replace(/^0+/, '')
  return phone
})

// 是否為 WhatsApp 號碼
const isWhatsApp = computed(() => {
  return (
    props.contact &&
    (props.contact.toLowerCase().includes('whatsapp') || props.contact.match(/\d{8,11}/))
  )
})

// WhatsApp 鏈接
const whatsappLink = computed(() => {
  if (!phoneNumber.value) return '#'
  return `https://wa.me/${phoneNumber.value}`
})

// 顯示文字（移除 "whatsapp:" 前綴）
const displayText = computed(() => {
  if (!props.contact) return ''
  return props.contact.replace(/^whatsapp:/i, '').trim()
})
</script>

<style scoped>
.whatsapp-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #25d366;
  text-decoration: none;
  font-weight: 500;
}

.whatsapp-link:hover {
  text-decoration: underline;
}

.whatsapp-icon {
  font-size: 1.1em;
}
</style>
