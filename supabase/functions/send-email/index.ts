// supabase/functions/send-email/index.js
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const RESEND_API_URL = 'https://api.resend.com/emails'

Deno.serve(async (req) => {
  // 處理 CORS 預檢請求
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  try {
    const { formData, recipientEmail } = await req.json()

    const emailBody = {
      from: '木羊物业 <onboarding@resend.dev>',
      // to: [recipientEmail],
      to: ['a1771550@gmail.com'],  // ✅ 暫時只發給自己
      bcc: ['a1771550@gmail.com'],
      subject: `【木羊物业】新留言来自 ${formData.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2c8bff;">木羊物业 - 新客户留言</h2>
          <hr />
          <p><strong>姓名：</strong> ${formData.name}</p>
          <p><strong>电话：</strong> ${formData.phone}</p>
          <p><strong>邮箱：</strong> ${formData.email || '未填写'}</p>
          <p><strong>意向楼盘：</strong> ${formData.property || '未填写'}</p>
          <p><strong>留言内容：</strong></p>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${formData.message}</p>
          <hr />
          <p style="color: #999; font-size: 12px;">发送时间：${new Date().toLocaleString()}</p>
        </body>
        </html>
      `
    }

    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailBody)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || '发送失败')
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})
