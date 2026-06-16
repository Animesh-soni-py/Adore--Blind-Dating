import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { data: adminProfile } = await supabaseClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!adminProfile?.is_admin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { data: profiles } = await supabaseClient
      .from('profiles')
      .select('id, gender, seeking, city, interests, onboarding_data')
      .eq('onboarding_completed', true)
      .order('created_at', { ascending: true })

    if (!profiles || profiles.length < 2) {
      return new Response(JSON.stringify({ matches: [], message: 'Need at least 2 users to match' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { data: existingMatches } = await supabaseClient
      .from('matches')
      .select('user_a_id, user_b_id')
      .in('status', ['active', 'pending', 'reveal_requested', 'revealed'])

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

      const scored = candidates.map((c) => ({
        id: c.id,
        score: calculateScore(userA, c),
      }))
      scored.sort((a, b) => b.score - a.score)

      const top = scored[0]
      if (!top || top.score < 30) continue

      const aId = userA.id < top.id ? userA.id : top.id
      const bId = userA.id < top.id ? top.id : userA.id

      if (alreadyMatched.has(`${aId}-${bId}`)) continue

      try {
        const { data: match } = await supabaseClient
          .from('matches')
          .insert({
            user_a_id: aId,
            user_b_id: bId,
            compatibility_score: top.score,
            status: 'active',
            matched_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .select()
          .single()

        if (match) {
          alreadyMatched.add(`${aId}-${bId}`)
          alreadyMatched.add(`${bId}-${aId}`)
          matchesCreated.push(match)
        }
      } catch (_e) {
        // Skip duplicates
      }
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
