import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RATE_LIMIT_WINDOW = 60_000
const ipMap = new Map<string, number>()

setInterval(() => {
  const cutoff = Date.now() - RATE_LIMIT_WINDOW * 2
  for (const [ip, time] of ipMap) {
    if (time < cutoff) ipMap.delete(ip)
  }
}, 60_000)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown'

  const now = Date.now()
  const lastAttempt = ipMap.get(ip)
  if (lastAttempt && now - lastAttempt < RATE_LIMIT_WINDOW) {
    const retryAfter = Math.ceil((RATE_LIMIT_WINDOW - (now - lastAttempt)) / 1000)
    return new Response(
      JSON.stringify({ error: `Too many requests. Try again in ${retryAfter} seconds.` }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const { email, siteUrl } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const originHeader = req.headers.get('origin')
    const refererHeader = req.headers.get('referer')
    let fallbackOrigin = 'https://adoreblinddating.netlify.app'
    if (originHeader) {
      fallbackOrigin = originHeader
    } else if (refererHeader) {
      try {
        const parsed = new URL(refererHeader)
        fallbackOrigin = parsed.origin
      } catch (_e) { /* ignore */ }
    }

    const redirectOrigin = siteUrl || fallbackOrigin
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectOrigin}/reset-password`,
    })

    if (error) throw error

    ipMap.set(ip, now)

    return new Response(
      JSON.stringify({ sent: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
