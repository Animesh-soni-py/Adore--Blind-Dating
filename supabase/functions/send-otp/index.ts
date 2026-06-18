import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, userId } = await req.json()

    if (!phone || !userId) {
      return new Response(
        JSON.stringify({ error: 'Phone number and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if an OTP was sent recently (60-second cooldown)
    const { data: existingOtp } = await supabaseClient
      .from('phone_otps')
      .select('created_at')
      .eq('user_id', userId)
      .maybeSingle()

    if (existingOtp) {
      const timeSinceLast = Date.now() - new Date(existingOtp.created_at).getTime()
      const cooldownMs = 60 * 1000
      if (timeSinceLast < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - timeSinceLast) / 1000)
        return new Response(
          JSON.stringify({ error: `Please wait ${remainingSeconds} seconds before requesting a new OTP.` }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    await supabaseClient
      .from('phone_otps')
      .delete()
      .eq('user_id', userId)

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    const { error: insertError } = await supabaseClient
      .from('phone_otps')
      .insert({ user_id: userId, phone, otp, expires_at: expiresAt })

    if (insertError) throw insertError

    const MSG91_AUTH_KEY = Deno.env.get('MSG91_AUTH_KEY') ?? ''

    if (!MSG91_AUTH_KEY) {
      console.log(`[DEV] OTP for ${phone}: ${otp}`)
    } else {
      const MSG91_SENDER_ID = Deno.env.get('MSG91_SENDER_ID') ?? 'ADORE'
      const MSG91_ROUTE = '4'

      const msg = `Your ADORE verification code is: ${otp}. Valid for 5 minutes.`

      const params = new URLSearchParams({
        authkey: MSG91_AUTH_KEY,
        mobiles: phone,
        message: msg,
        sender: MSG91_SENDER_ID,
        route: MSG91_ROUTE,
        country: '91',
      })

      const smsRes = await fetch(`https://api.msg91.com/api/sendhttp.php?${params.toString()}`, {
        method: 'GET',
      })

      const smsText = await smsRes.text()
      console.log(`[MSG91] Response for ${phone}: ${smsText}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'OTP sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
