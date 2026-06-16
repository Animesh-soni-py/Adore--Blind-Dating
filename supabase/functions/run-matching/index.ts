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

    const { data: callerProfile } = await supabaseClient
      .from('profiles')
      .select('id, gender, seeking, city, interests, onboarding_data, onboarding_completed')
      .eq('id', user.id)
      .single()

    if (!callerProfile?.onboarding_completed) {
      return new Response(JSON.stringify({ error: 'Complete your profile first' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { data: existingMatches } = await supabaseClient
      .from('matches')
      .select('user_a_id, user_b_id')
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
      .in('status', ['active', 'pending', 'reveal_requested', 'revealed'])

    const matchedIds = new Set()
    if (existingMatches) {
      for (const m of existingMatches) {
        matchedIds.add(m.user_a_id === user.id ? m.user_b_id : m.user_a_id)
      }
    }

    let compatibleGender
    if (callerProfile.seeking === 'everyone') {
      compatibleGender = 'everyone'
    } else {
      compatibleGender = callerProfile.seeking
    }

    const { data: candidates } = await supabaseClient
      .from('profiles')
      .select('id, gender, seeking, city, interests, onboarding_data')
      .eq('onboarding_completed', true)
      .neq('id', user.id)

    if (!candidates || candidates.length === 0) {
      return new Response(JSON.stringify({ matches: [], message: 'No candidates found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const eligible = candidates.filter((c) => {
      if (matchedIds.has(c.id)) return false
      if (compatibleGender !== 'everyone' && c.gender !== compatibleGender) return false
      if (c.seeking === 'everyone') return true
      return true
    })

    if (eligible.length === 0) {
      return new Response(JSON.stringify({ matches: [], message: 'No compatible users found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const callerData = callerProfile
    const scored = eligible.map((c) => ({
      id: c.id,
      score: calculateScore(callerData, c),
    }))
    scored.sort((a, b) => b.score - a.score)

    const topMatch = scored[0]
    if (!topMatch || topMatch.score < 30) {
      return new Response(JSON.stringify({ matches: [], message: 'No compatible users found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { data: userA } = await supabaseClient.from('profiles').select('email').eq('id', user.id).single()
    const { data: userB } = await supabaseClient.from('profiles').select('email').eq('id', topMatch.id).single()

    const aId = user.id < topMatch.id ? user.id : topMatch.id
    const bId = user.id < topMatch.id ? topMatch.id : user.id

    const { data: match, error: insertError } = await supabaseClient
      .from('matches')
      .insert({
        user_a_id: aId,
        user_b_id: bId,
        compatibility_score: topMatch.score,
        status: 'active',
        matched_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      if (insertError.message?.includes('duplicate') || insertError.code === '23505') {
        return new Response(JSON.stringify({ matches: [], message: 'Already matched with this user' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      throw insertError
    }

    return new Response(
      JSON.stringify({ matches: [match], message: 'New match found!' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
