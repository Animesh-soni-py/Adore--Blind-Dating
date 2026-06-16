import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BLOCKED_WORDS = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'bastard', 'crap',
  'dick', 'piss', 'slut', 'whore', 'cock', 'cunt', 'motherfucker',
  'nigga', 'nigger', 'porn', 'sex', 'fucking', 'bullshit', 'asshole',
  'bollocks', 'arse', 'bloody', 'wanker', 'prick', 'twat', 'douche',
]

function containsProfanity(text) {
  if (!text) return false
  const lower = text.toLowerCase()
  return BLOCKED_WORDS.some((word) =>
    new RegExp(`\\b${word}\\b`, 'i').test(lower)
  )
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, fields } = await req.json()

    const results = {}

    if (text) {
      results._global = containsProfanity(text)
    }

    if (fields) {
      for (const [key, value] of Object.entries(fields)) {
        results[key] = containsProfanity(value)
      }
    }

    return new Response(
      JSON.stringify({ allowed: !Object.values(results).some(Boolean), flags: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
