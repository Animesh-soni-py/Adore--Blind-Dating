import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function useMessages(matchId) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const channelRef = useRef(null);
  const safeMatchId = matchId && UUID_RE.test(matchId) ? matchId : null;

  const fetchMessages = useCallback(async () => {
    await Promise.resolve();
    if (!matchId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  /* Initial fetch + realtime subscription */
  useEffect(() => {
    Promise.resolve().then(() => {
      fetchMessages();
    });

    if (!safeMatchId) return;

    /* Subscribe to new messages in this match */
    const channel = supabase
      .channel(`messages:${safeMatchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${safeMatchId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${safeMatchId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
    }, [safeMatchId, fetchMessages]);

  async function sendMessage(content) {
    if (!user?.id || !safeMatchId || !content.trim()) return;

    try {
      const { data, error: sendError } = await supabase
        .from('messages')
        .insert({
          match_id: safeMatchId,
          sender_id: user.id,
          content: content.trim(),
        })
        .select()
        .single();

      if (sendError) throw sendError;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  const markAsRead = useCallback(async () => {
    if (!user?.id || !safeMatchId) return;

    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('match_id', safeMatchId)
        .neq('sender_id', user.id)
        .eq('is_read', false);
    } catch (err) {
      console.warn('Failed to mark messages as read:', err);
    }
  }, [user, safeMatchId]);

  function getUnreadCount() {
    if (!user?.id) return 0;
    return messages.filter((m) => m.sender_id !== user.id && !m.is_read).length;
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    getUnreadCount,
    refetch: fetchMessages,
  };
}
