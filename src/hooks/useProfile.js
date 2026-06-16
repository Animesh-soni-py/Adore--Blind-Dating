import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useProfile() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    await Promise.resolve();
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setProfile(data);
        refreshProfile();
      } else {
        setProfile(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchProfile();
    });

    function handleFocus() {
      fetchProfile();
    }
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchProfile]);

  async function updateProfile(updates) {
    if (!user?.id) throw new Error('No authenticated user');

    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email || '';

      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, email, ...updates }, { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Failed to save profile');

      setProfile(data);
      await refreshProfile();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function submitQuizAnswers(answers) {
    if (!user?.id) throw new Error('No authenticated user');

    try {
      const rows = answers.map(({ questionKey, answer, answerScore }) => ({
        user_id: user.id,
        question_key: questionKey,
        answer,
        answer_score: answerScore,
      }));

      const { error: quizError } = await supabase
        .from('quiz_answers')
        .upsert(rows, { onConflict: 'user_id,question_key' });

      if (quizError) throw quizError;

      await updateProfile({ quiz_completed: true });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function completeOnboarding() {
    return updateProfile({ onboarding_completed: true });
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    submitQuizAnswers,
    completeOnboarding,
    refetch: fetchProfile,
  };
}
