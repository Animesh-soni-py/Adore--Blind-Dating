import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useMatches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = useCallback(async () => {
    await Promise.resolve();
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('matches')
        .select(`
          *,
          user_a:profiles!matches_user_a_id_fkey(id, first_name, city, bio, profile_photo_url),
          user_b:profiles!matches_user_b_id_fkey(id, first_name, city, bio, profile_photo_url)
        `)
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const enriched = (data || []).map((match) => {
        const isUserA = match.user_a_id === user.id;
        return {
          ...match,
          partner: isUserA ? match.user_b : match.user_a,
          myRevealConsent: isUserA ? match.user_a_reveal_consent : match.user_b_reveal_consent,
          partnerRevealConsent: isUserA ? match.user_b_reveal_consent : match.user_a_reveal_consent,
        };
      });

      setMatches(enriched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchMatches();
    });
  }, [fetchMatches]);

  async function updateMatchStatus(matchId, status) {
    if (!user?.id) throw new Error('Not authenticated');
    try {
      const { data: match, error: fetchError } = await supabase
        .from('matches')
        .select('id, user_a_id, user_b_id')
        .eq('id', matchId)
        .single();

      if (fetchError) throw fetchError;
      if (!match) throw new Error('Match not found');
      if (match.user_a_id !== user.id && match.user_b_id !== user.id) {
        throw new Error('You are not a participant in this match');
      }

      const { error: updateError } = await supabase
        .from('matches')
        .update({ status })
        .eq('id', matchId);

      if (updateError) throw updateError;
      await fetchMatches();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  function getActiveMatches() {
    return matches.filter((m) => ['active', 'reveal_requested'].includes(m.status));
  }

  function getRevealedMatches() {
    return matches.filter((m) => m.status === 'revealed');
  }

  return {
    matches,
    loading,
    error,
    updateMatchStatus,
    getActiveMatches,
    getRevealedMatches,
    refetch: fetchMatches,
  };
}
