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
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.replace('Bearer ', '')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden — admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, verificationId, userId, planName, period } = await req.json()

    if (!action || !verificationId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch the verification record first to prevent IDOR parameter tampering
    const { data: verification, error: verificationError } = await adminClient
      .from('payment_verifications')
      .select('user_id, plan_name, period, status')
      .eq('id', verificationId)
      .maybeSingle()

    if (verificationError || !verification) {
      return new Response(
        JSON.stringify({ error: 'Payment verification record not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (verification.status !== 'pending') {
      return new Response(
        JSON.stringify({ error: 'This payment has already been verified or rejected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const targetUserId = verification.user_id;
    const targetPlanName = verification.plan_name;
    const targetPeriod = verification.period;

    if (action === 'verify') {
      const expiresAt = new Date()
      if (targetPeriod === 'yearly') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1)
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1)
      }

      await adminClient
        .from('payment_verifications')
        .update({
          status: 'verified',
          admin_id: user.id,
          verified_at: new Date().toISOString(),
        })
        .eq('id', verificationId)

      await adminClient
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', targetUserId)

      await adminClient
        .from('subscriptions')
        .insert({
          user_id: targetUserId,
          plan: targetPlanName.toLowerCase(),
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          payment_provider: 'upi',
        })

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'reject') {
      await adminClient
        .from('payment_verifications')
        .update({
          status: 'rejected',
          admin_id: user.id,
          verified_at: new Date().toISOString(),
        })
        .eq('id', verificationId)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
