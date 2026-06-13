import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

export default function AdminPaymentsPage() {
  const { user, profile, isAuthenticated, refreshProfile } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) fetchPayments();
  }, [isAuthenticated]);

  async function fetchPayments() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_verifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(id, userId, planName, period) {
    try {
      setVerifyingId(id);
      const { error } = await supabase.functions.invoke('admin-verify-payment', {
        body: { action: 'verify', verificationId: id, userId, planName, period },
      });
      if (error) throw error;
      if (user.id === userId) refreshProfile();
      fetchPayments();
    } catch (err) {
      console.error('Verification failed:', err);
      alert('Verification failed: ' + (err.message || 'Unknown error'));
    } finally {
      setVerifyingId(null);
    }
  }

  async function handleReject(id) {
    try {
      setVerifyingId(id);
      const { error } = await supabase.functions.invoke('admin-verify-payment', {
        body: { action: 'reject', verificationId: id },
      });
      if (error) throw error;
      fetchPayments();
    } catch (err) {
      console.error('Rejection failed:', err);
      alert('Rejection failed: ' + (err.message || 'Unknown error'));
    } finally {
      setVerifyingId(null);
    }
  }

  if (!isAuthenticated || !profile?.is_admin) {
    return (
      <main className="pt-[72px] min-h-screen flex items-center justify-center" style={{ background: '#0F0A1E' }} id="main-content">
        <p className="text-white/40 font-body">Admin access required. Sign in with an admin account.</p>
      </main>
    );
  }

  return (
    <main className="pt-[72px] min-h-screen" style={{ background: '#0F0A1E' }} id="main-content">
      <div className="container-adore py-8 lg:py-12">
        <h1 className="font-display text-3xl font-extrabold text-white mb-8 italic">Payment Verifications</h1>

        {loading ? (
          <p className="text-white/40 font-body">Loading...</p>
        ) : payments.length === 0 ? (
          <p className="text-white/40 font-body">No payment verifications yet.</p>
        ) : (
          <div className="space-y-4">
            {payments.map((p) => (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-white font-semibold font-body">{p.plan_name} Plan</p>
                    <p className="text-sm text-white/50 font-body">
                      User: <span className="font-mono text-xs">{p.user_id}</span>
                    </p>
                    <p className="text-sm text-white/50 font-body">
                      Amount: ₹{p.amount} | Period: {p.period}
                    </p>
                    <p className="text-sm text-white/50 font-body">
                      UTR: <span className="font-mono text-pink">{p.utr}</span>
                    </p>
                    <p className="text-sm text-white/50 font-body">
                      Status: <span className={
                        p.status === 'verified' ? 'text-lime' : p.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                      }>{p.status}</span>
                    </p>
                    {p.created_at && (
                      <p className="text-xs text-white/30 font-body">{new Date(p.created_at).toLocaleString()}</p>
                    )}
                  </div>
                  {p.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <Button variant="primary" size="sm"
                        onClick={() => handleVerify(p.id, p.user_id, p.plan_name, p.period)}
                        loading={verifyingId === p.id}>Verify</Button>
                      <Button variant="ghost" size="sm"
                        className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                        onClick={() => handleReject(p.id)}
                        loading={verifyingId === p.id}>Reject</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
