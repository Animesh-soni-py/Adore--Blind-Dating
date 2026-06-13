import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;

interface RevealPayload {
  type: 'reveal_request' | 'lead_nurture';
  recipientEmail: string;
  recipientName: string;
  matchName?: string;
}

serve(async (req: Request) => {
  try {
    const payload: RevealPayload = await req.json();
    const { type, recipientEmail, recipientName, matchName } = payload;

    if (!recipientEmail || !type) {
      return new Response(JSON.stringify({ error: 'recipientEmail and type are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const displayName = recipientName || 'there';
    let subject: string;
    let bodyContent: string;

    if (type === 'reveal_request') {
      const displayMatch = matchName || 'Your match';
      subject = `${displayMatch} wants to reveal photos! 👀`;
      bodyContent = `
        <div class="hero-text">The Big <span>Reveal</span> Moment! 👀</div>
        <p class="body-text">
          Hey ${displayName}, <strong>${displayMatch}</strong> has requested a photo reveal! This means they feel a genuine connection with you and want to take the next step.
        </p>
        <p class="body-text">
          The reveal only happens when <strong>both of you agree</strong>. If you're feeling it too, head to your matches and accept the reveal. If you need more time — that's perfectly okay!
        </p>
        <div class="cta-wrapper">
          <a href="https://adore.dating/matches" class="cta-btn">View Reveal Request →</a>
        </div>
        <p class="body-text" style="font-size:13px; color: rgba(26,26,46,0.45); margin-top: 24px;">
          Remember: there's no pressure. Only reveal when you're genuinely ready.
        </p>
      `;
    } else {
      subject = `Your journey to real connection starts here 💕`;
      bodyContent = `
        <div class="hero-text">Thanks for Your <span>Interest</span>, ${displayName}! 💕</div>
        <p class="body-text">
          We're thrilled you're curious about ADORE Blind Dating — the platform where personality comes before photos.
        </p>
        <p class="body-text">
          Here's why thousands of people are choosing blind dating:
        </p>
        <ul class="steps">
          <li><strong>No superficial swiping</strong> — Connect based on who someone really is</li>
          <li><strong>Verified profiles</strong> — Every member is identity-verified for safety</li>
          <li><strong>94% satisfaction rate</strong> — Our members love the experience</li>
          <li><strong>7-day connection window</strong> — Enough time to build real chemistry</li>
        </ul>
        <div class="cta-wrapper">
          <a href="https://adore.dating/signup" class="cta-btn">Join ADORE Free →</a>
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
          .steps { padding: 0 0 0 20px; margin: 16px 0; }
          .steps li { padding: 6px 0; font-size: 14px; color: rgba(26,26,46,0.7); line-height: 1.6; }
          .steps li strong { color: #1A1A2E; }
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
            © 2026 ADORE Blind Dating. All rights reserved.<br/>
            <a href="https://adore.dating/unsubscribe" style="color: rgba(26,26,46,0.35);">Unsubscribe</a>
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
