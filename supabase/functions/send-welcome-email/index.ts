import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { email, firstName } = await req.json()

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const displayName = firstName || 'there'

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { margin: 0; padding: 0; background: #FAFAF8; font-family: 'Helvetica Neue', Arial, sans-serif; }
          .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
          .header { text-align: center; padding: 32px 0; }
          .logo { font-size: 28px; font-weight: 800; color: #1A1A2E; letter-spacing: -0.5px; }
          .logo span { color: #FF5E8A; font-weight: 600; }
          .card { background: #FFFFFF; border-radius: 20px; padding: 40px 32px; border: 1px solid rgba(200,168,240,0.3); }
          .hero-text { font-size: 24px; font-weight: 700; color: #1A1A2E; margin-bottom: 16px; line-height: 1.2; }
          .hero-text span { color: #FF5E8A; }
          .body-text { font-size: 15px; color: rgba(26,26,46,0.65); line-height: 1.7; margin-bottom: 24px; }
          .cta-btn { display: inline-block; background: #FF5E8A; color: white; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 4px 4px 0px #1A1A2E; }
          .cta-wrapper { text-align: center; margin: 32px 0; }
          .divider { height: 1px; background: rgba(200,168,240,0.3); margin: 24px 0; }
          .steps { padding: 0; list-style: none; }
          .steps li { padding: 8px 0; font-size: 14px; color: rgba(26,26,46,0.7); }
          .steps li strong { color: #1A1A2E; }
          .footer { text-align: center; padding: 24px 0; font-size: 12px; color: rgba(26,26,46,0.35); }
          .heart { color: #FF5E8A; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ADORE <span>Blind Dating</span></div>
          </div>
          <div class="card">
            <div class="hero-text">Welcome to ADORE, <span>${displayName}</span>! 💘</div>
            <p class="body-text">
              You just took the first step toward finding a real connection. At ADORE, we believe love starts with personality — not photos. Here's how it works:
            </p>
            <ul class="steps">
              <li><strong>1. Complete your profile</strong> — Tell us about your values, interests, and what makes you, you.</li>
              <li><strong>2. Get matched</strong> — Our AI finds your top compatibility matches every week.</li>
              <li><strong>3. Chat blindly</strong> — Spend 7 days getting to know someone through conversation alone.</li>
              <li><strong>4. The big reveal</strong> — When you're both ready, choose to reveal photos and continue.</li>
            </ul>
            <div class="cta-wrapper">
              <a href="https://adore.dating/profile/setup" class="cta-btn">Complete Your Profile →</a>
            </div>
            <div class="divider"></div>
            <p class="body-text" style="font-size:13px; margin-bottom:0;">
              Fall in love with their soul first. <span class="heart">♥</span>
            </p>
          </div>
          <div class="footer">
            © 2026 ADORE Blind Dating. All rights reserved.<br/>
            You received this because you signed up at adore.dating
          </div>
        </div>
      </body>
      </html>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ADORE <hello@adore.dating>',
        to: [email],
        subject: `Welcome to ADORE, ${displayName}! 💘`,
        html: htmlContent,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
