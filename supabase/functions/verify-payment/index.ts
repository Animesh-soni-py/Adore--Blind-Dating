import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'https://deno.land/std@0.168.0/crypto/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, userId, planName, period } = await req.json()

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!razorpayKeySecret) {
      throw new Error('Razorpay secret not configured')
    }

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId
    const encoder = new TextEncoder()
    const key = encoder.encode(razorpayKeySecret)
    const data = encoder.encode(body)

    const cryptoKey = await crypto.subtle.importKey(
      'raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, data)
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (expectedSignature !== razorpaySignature) {
      return new Response(
        JSON.stringify({ verified: false, error: 'Invalid payment signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Payment verified — update database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update order status
    await supabaseClient
      .from('payment_orders')
      .update({
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        status: 'paid',
      })
      .eq('razorpay_order_id', razorpayOrderId)

    // Update user subscription
    const expiresAt = new Date()
    if (period === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1)
    }

    // Update user premium status in profiles
    await supabaseClient
      .from('profiles')
      .update({
        is_premium: true,
      })
      .eq('id', userId)

    // Insert subscription record
    await supabaseClient
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan: planName.toLowerCase(),
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        payment_provider: 'razorpay',
        external_subscription_id: razorpayPaymentId,
      })

    return new Response(
      JSON.stringify({ verified: true, plan: planName }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
