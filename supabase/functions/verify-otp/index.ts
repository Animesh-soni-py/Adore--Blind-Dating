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
    const { phone, otp, userId } = await req.json()

    if (!phone || !otp || !userId) {
      return new Response(
        JSON.stringify({ error: 'Phone, OTP, and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Look up the OTP
    const { data: otpRecord, error: lookupError } = await supabaseClient
      .from('phone_otps')
      .select('*')
      .eq('user_id', userId)
      .eq('phone', phone)
      .eq('otp', otp)
      .single()

    if (lookupError || !otpRecord) {
      return new Response(
        JSON.stringify({ verified: false, error: 'Invalid OTP' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      // Clean up expired OTP
      await supabaseClient.from('phone_otps').delete().eq('id', otpRecord.id)
      return new Response(
        JSON.stringify({ verified: false, error: 'OTP has expired' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // OTP is valid — mark phone as verified
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ phone, phone_verified: true })
      .eq('id', userId)

    if (updateError) throw updateError

    // Clean up used OTP
    await supabaseClient.from('phone_otps').delete().eq('id', otpRecord.id)

    return new Response(
      JSON.stringify({ verified: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
