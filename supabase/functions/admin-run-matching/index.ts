import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

async function supabaseQuery(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`
  const key = options.useServiceRole ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY
  const token = options.useServiceRole ? SUPABASE_SERVICE_ROLE_KEY : (options.token || SUPABASE_ANON_KEY)
  const res = await fetch(url, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    method: options.method || 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = await res.json()
  return { data, error: res.ok ? null : data, status: res.status }
}

function calculateScore(a, b) {
  let score = 50
  const aInterests = Array.isArray(a.interests) ? a.interests : []
  const bInterests = Array.isArray(b.interests) ? b.interests : []
  if (aInterests.length > 0 && bInterests.length > 0) {
    const common = aInterests.filter((i) => bInterests.includes(i)).length
    const max = Math.max(aInterests.length, bInterests.length)
    score += (common / max) * 25
  }
  if (a.city && b.city && a.city === b.city) score += 10
  const aOd = a.onboarding_data || {}
  const bOd = b.onboarding_data || {}
  if (aOd.dateVibe && bOd.dateVibe && aOd.dateVibe === bOd.dateVibe) score += 5
  if (aOd.smoking && bOd.smoking && aOd.smoking === bOd.smoking) score += 5
  if (aOd.drinking && bOd.drinking && aOd.drinking === bOd.drinking) score += 5
  return Math.round(Math.min(score, 99))
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.replace('Bearer ', '')

    // Validate user via auth API
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}` },
    })
    if (!authRes.ok) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const user = await authRes.json()

    // Check admin
    const { data: adminProfile } = await supabaseQuery(`profiles?id=eq.${user.id}&select=is_admin`, { token })
    if (!adminProfile?.[0]?.is_admin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Get eligible profiles
    const { data: profiles } = await supabaseQuery('profiles?select=id,gender,seeking,city,interests,onboarding_data&onboarding_completed=eq.true&order=created_at.asc', { useServiceRole: true })
    if (!profiles || profiles.length < 2) {
      return new Response(JSON.stringify({ matches: [], message: 'Need at least 2 users' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Get existing matches
    const { data: existingMatches } = await supabaseQuery('matches?select=user_a_id,user_b_id&status=in.(active,pending,reveal_requested,revealed)', { useServiceRole: true })
    const alreadyMatched = new Set()
    if (existingMatches) {
      for (const m of existingMatches) {
        alreadyMatched.add(`${m.user_a_id}-${m.user_b_id}`)
        alreadyMatched.add(`${m.user_b_id}-${m.user_a_id}`)
      }
    }

    const matchesCreated = []
    for (let i = 0; i < profiles.length; i++) {
      const userA = profiles[i]
      const seeking = userA.seeking || 'everyone'
      const candidates = profiles.filter((c, j) => {
        if (i === j) return false
        if (alreadyMatched.has(`${userA.id}-${c.id}`)) return false
        if (seeking !== 'everyone' && c.gender !== seeking) return false
        return true
      })
      if (candidates.length === 0) continue

      const scored = candidates.map((c) => ({ id: c.id, score: calculateScore(userA, c) }))
      scored.sort((a, b) => b.score - a.score)
      const top = scored[0]
      if (!top || top.score < 30) continue

      const aId = userA.id < top.id ? userA.id : top.id
      const bId = userA.id < top.id ? top.id : userA.id
      if (alreadyMatched.has(`${aId}-${bId}`)) continue

      try {
        const { data: match } = await supabaseQuery('matches', {
          method: 'POST',
          useServiceRole: true,
          body: {
            user_a_id: aId,
            user_b_id: bId,
            compatibility_score: top.score,
            status: 'active',
            matched_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          },
          headers: { 'Prefer': 'return=representation' },
        })
        if (match?.[0]) {
          alreadyMatched.add(`${aId}-${bId}`)
          alreadyMatched.add(`${bId}-${aId}`)
          matchesCreated.push(match[0])
        }
      } catch (_e) { /* skip duplicates */ }
    }

    return new Response(
      JSON.stringify({ matches: matchesCreated, count: matchesCreated.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
