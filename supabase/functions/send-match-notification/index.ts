import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;

interface MatchNotificationPayload {
  type: 'new_match' | 'match_expiring';
  recipientEmail: string;
  recipientName: string;
  matchName: string;
  compatibilityScore: number;
  expiresAt?: string;
}

serve(async (req: Request) => {
  try {
    const payload: MatchNotificationPayload = await req.json();
    const { type, recipientEmail, recipientName, matchName, compatibilityScore, expiresAt } = payload;

    if (!recipientEmail || !type) {
      return new Response(JSON.stringify({ error: 'recipientEmail and type are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const displayName = recipientName || 'there';
    const displayMatch = matchName || 'someone special';

    let subject: string;
    let bodyContent: string;

    if (type === 'new_match') {
      subject = `You have a new match on ADORE! 💕`;
      bodyContent = `
        <div class="hero-text">New Match Alert! <span>💕</span></div>
        <p class="body-text">
          Hey ${displayName}, exciting news! We found someone who shares <strong>${compatibilityScore}% compatibility</strong> with you.
        </p>
        <p class="body-text">
          Your new match, <strong>${displayMatch}</strong>, is waiting to connect. Remember — no photos yet! Get to know their personality first through 7 days of blind chat.
        </p>
        <div class="score-badge">${compatibilityScore}% Match</div>
        <div class="cta-wrapper">
          <a href="https://adore.dating/matches" class="cta-btn">Start Chatting →</a>
        </div>
      `;
    } else {
      const expDate = expiresAt ? new Date(expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'soon';
      subject = `Your match with ${displayMatch} expires ${expDate} ⏰`;
      bodyContent = `
        <div class="hero-text">Don't Let This <span>Connection</span> Expire! ⏰</div>
        <p class="body-text">
          Hey ${displayName}, your match with <strong>${displayMatch}</strong> expires on <strong>${expDate}</strong>.
        </p>
        <p class="body-text">
          You still have time to chat, connect, and decide if you want to do the Big Reveal. Don't let a great connection slip away!
        </p>
        <div class="cta-wrapper">
          <a href="https://adore.dating/matches" class="cta-btn">Continue Chatting →</a>
        </div>
      `;
    }

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
          .logo { font-size: 28px; font-weight: 800; color: #1A1A2E; }
          .logo span { color: #FF5E8A; font-weight: 600; }
          .card { background: #FFFFFF; border-radius: 20px; padding: 40px 32px; border: 1px solid rgba(200,168,240,0.3); }
          .hero-text { font-size: 22px; font-weight: 700; color: #1A1A2E; margin-bottom: 16px; }
          .hero-text span { color: #FF5E8A; }
          .body-text { font-size: 15px; color: rgba(26,26,46,0.65); line-height: 1.7; margin-bottom: 16px; }
          .cta-btn { display: inline-block; background: #FF5E8A; color: white; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 4px 4px 0px #1A1A2E; }
          .cta-wrapper { text-align: center; margin: 32px 0; }
          .score-badge { display: inline-block; background: #F5F0FF; color: #FF5E8A; font-size: 18px; font-weight: 800; padding: 12px 24px; border-radius: 100px; border: 2px solid rgba(200,168,240,0.3); margin: 16px 0; text-align: center; width: 100%; }
          .footer { text-align: center; padding: 24px 0; font-size: 12px; color: rgba(26,26,46,0.35); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ADORE <span>Blind Dating</span></div>
          </div>
          <div class="card">
            ${bodyContent}
          </div>
          <div class="footer">
            © 2026 ADORE Blind Dating. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ADORE <hello@adore.dating>',
        to: [recipientEmail],
        subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
