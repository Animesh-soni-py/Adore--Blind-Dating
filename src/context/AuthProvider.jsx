import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from './AuthContext';

async function confirmUser(userId) {
  try {
    await supabase.functions.invoke('confirm-signup', {
      body: { userId },
    });
  } catch (err) {
    console.error('confirmUser failed:', err);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* Get initial session */
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    /* Listen for auth state changes */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        /* Profile doesn't exist yet — create it */
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const newProfile = {
            id: userData.user.id,
            email: userData.user.email,
          };
          const { data: created } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
          setProfile(created);
        }
      } else if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }

  async function signUp({ email, password, firstName, lastName }) {
    setLoading(true);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
      },
    });

    if (signUpError) {
      setLoading(false);
      throw signUpError;
    }

    let autoSignedIn = false;

    if (signUpData?.user) {
      await confirmUser(signUpData.user.id);

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!signInError && signInData?.session) {
        setSession(signInData.session);
        setUser(signInData.user);
        autoSignedIn = true;
      }
    }

    setLoading(false);
    return { ...signUpData, autoSignedIn };
  }

  async function signIn({ email, password }) {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      throw error;
    }

    setLoading(false);
    return data;
  }

  async function signOut() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoading(false);
      throw error;
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    setLoading(false);
  }

  async function refreshProfile() {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    isAuthenticated: !!session,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
