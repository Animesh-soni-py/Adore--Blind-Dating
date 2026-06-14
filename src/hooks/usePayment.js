import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

export function usePayment() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function submitPayment({ planName, amount, utr, upiId }) {
    if (!user) {
      toast.error('Please sign in first.');
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from('payment_verifications').insert({
        user_id: user.id,
        plan_name: planName,
        amount,
        period: 'one-time',
        utr: utr.trim(),
        upi_id: upiId || null,
        status: 'pending',
      });

      if (error) throw error;

      toast.success('Payment submitted! We will verify and activate your plan shortly.');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to submit payment.');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { submitPayment, loading };
}
