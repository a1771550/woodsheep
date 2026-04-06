// src/services/emailService.js
import { supabase } from './supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const getRecipientEmail = async () => {
  try {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'site_settings')
      .maybeSingle()

    return data?.value?.contactEmail || 'contact@muyangproperty.com'
  } catch (error) {
    console.error('獲取收件郵箱失敗:', error)
    return 'contact@muyangproperty.com'
  }
}

export const sendContactEmail = async (formData) => {
  try {
    const recipientEmail = await getRecipientEmail()

    // ✅ 關鍵：這裡應該調用 Edge Function，不是 Resend API
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        formData,
        recipientEmail,
      }),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || '发送失败')
    }

    // 存入記錄
    await supabase.from('contact_messages').insert([
      {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        property: formData.property,
        message: formData.message,
        sent_to: recipientEmail,
        created_at: new Date().toISOString(),
      },
    ])

    return { success: true, data: result.data }
  } catch (error) {
    console.error('郵件發送失敗:', error)
    return { success: false, error: error.message }
  }
}
