import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

export default function AdminDashboardPage() {
  const { profile, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [tab, setTab] = useState('users');

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchPayments();
    }
  }, [isAuthenticated]);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPayments() {
    try {
      const { data, error } = await supabase
        .from('payment_verifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setPayments(data || []);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    }
  }

  async function fetchQuizAnswers(userId) {
    try {
      const { data, error } = await supabase
        .from('quiz_answers')
        .select('*')
        .eq('user_id', userId);
      if (!error) setQuizAnswers(data || []);
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
    }
  }

  function viewUser(user) {
    setSelectedUser(user);
    fetchQuizAnswers(user.id);
  }

  async function handleVerify(id, userId, planName) {
    try {
      setVerifyingId(id);
      const { error } = await supabase.functions.invoke('admin-verify-payment', {
        body: { action: 'verify', verificationId: id, userId, planName, period: 'one-time' },
      });
      if (error) throw error;
      fetchPayments();
    } catch (err) {
      alert('Verification failed: ' + (err.message || 'Unknown error'));
    } finally {
      setVerifyingId(null);
    }
  }

  async function handleReject(id) {
    try {
      setVerifyingId(id);
      await supabase.functions.invoke('admin-verify-payment', {
        body: { action: 'reject', verificationId: id },
      });
      fetchPayments();
    } catch (err) {
      alert('Rejection failed: ' + (err.message || 'Unknown error'));
    } finally {
      setVerifyingId(null);
    }
  }

  const pendingPayments = payments.filter((p) => p.status === 'pending');

  if (!isAuthenticated || !profile?.is_admin) {
    return (
      <main className="pt-[72px] min-h-screen flex items-center justify-center" style={{ background: '#0F0A1E' }} id="main-content">
        <p className="text-white/40 font-body">Admin access required.</p>
      </main>
    );
  }

  return (
    <main className="pt-[72px] min-h-screen" style={{ background: '#0F0A1E' }} id="main-content">
      <div className="container-adore py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-extrabold text-white italic">Admin Dashboard</h1>
          <span className="text-sm text-white/40 font-body">{users.length} users</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{users.length}</p>
            <p className="text-xs text-white/40">Total Users</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-2xl font-bold text-yellow-400">{pendingPayments.length}</p>
            <p className="text-xs text-white/40">Pending Payments</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-2xl font-bold text-lime">{users.filter((u) => u.is_premium).length}</p>
            <p className="text-xs text-white/40">Premium Users</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-2xl font-bold text-pink">{users.filter((u) => u.onboarding_completed).length}</p>
            <p className="text-xs text-white/40">Onboarded</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/10">
          <button onClick={() => { setTab('users'); setSelectedUser(null); }} className={`pb-3 text-sm font-medium transition-colors ${tab === 'users' ? 'text-pink border-b-2 border-pink' : 'text-white/50 hover:text-white'}`}>Users</button>
          <button onClick={() => { setTab('payments'); setSelectedUser(null); }} className={`pb-3 text-sm font-medium transition-colors ${tab === 'payments' ? 'text-pink border-b-2 border-pink' : 'text-white/50 hover:text-white'}`}>Payments {pendingPayments.length > 0 && <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-pink text-white rounded-full">{pendingPayments.length}</span>}</button>
        </div>

        {/* User Detail View */}
        {selectedUser ? (
          <div>
            <button onClick={() => setSelectedUser(null)} className="text-sm text-pink hover:text-pink/80 mb-4">&larr; Back to list</button>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">{selectedUser.email}</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-white/40">Name:</span> <span className="text-white">{selectedUser.first_name} {selectedUser.last_name}</span></div>
                <div><span className="text-white/40">Phone:</span> <span className="text-white">{selectedUser.phone || '—'}</span></div>
                <div><span className="text-white/40">Gender:</span> <span className="text-white">{selectedUser.gender || '—'}</span></div>
                <div><span className="text-white/40">Seeking:</span> <span className="text-white">{selectedUser.seeking || '—'}</span></div>
                <div><span className="text-white/40">City:</span> <span className="text-white">{selectedUser.city || '—'}</span></div>
                <div><span className="text-white/40">DOB:</span> <span className="text-white">{selectedUser.date_of_birth || '—'}</span></div>
                <div><span className="text-white/40">Premium:</span> <span className={selectedUser.is_premium ? 'text-lime' : 'text-white/50'}>{selectedUser.is_premium ? 'Yes' : 'No'}</span></div>
                <div><span className="text-white/40">Verified:</span> <span className={selectedUser.is_verified ? 'text-lime' : 'text-white/50'}>{selectedUser.is_verified ? 'Yes' : 'No'}</span></div>
                <div><span className="text-white/40">Admin:</span> <span className={selectedUser.is_admin ? 'text-pink' : 'text-white/50'}>{selectedUser.is_admin ? 'Yes' : 'No'}</span></div>
                <div><span className="text-white/40">Joined:</span> <span className="text-white">{new Date(selectedUser.created_at).toLocaleDateString()}</span></div>
              </div>
              {selectedUser.bio && <div className="mt-4"><span className="text-white/40 text-sm">Bio:</span><p className="text-white text-sm mt-1">{selectedUser.bio}</p></div>}
              {selectedUser.interests?.length > 0 && <div className="mt-4"><span className="text-white/40 text-sm">Interests:</span><div className="flex flex-wrap gap-2 mt-1">{selectedUser.interests.map((i) => <span key={i} className="px-2 py-1 text-xs bg-white/10 text-white/70 rounded-full">{i}</span>)}</div></div>}
            </div>

            {/* Onboarding Data */}
            {selectedUser.onboarding_data && typeof selectedUser.onboarding_data === 'object' && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Onboarding Data</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(selectedUser.onboarding_data).filter(([k]) => k !== 'quiz_answers').map(([key, val]) => (
                    val !== null && val !== undefined && <div key={key}><span className="text-white/40">{key}:</span> <span className="text-white">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span></div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Answers */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">Quiz Answers ({quizAnswers.length})</h3>
              {quizAnswers.length === 0 ? (
                <p className="text-sm text-white/40">No quiz answers yet.</p>
              ) : (
                <div className="space-y-2">
                  {quizAnswers.map((qa) => (
                    <div key={qa.id} className="flex justify-between items-start py-2 border-b border-white/5 last:border-0">
                      <span className="text-sm text-white/70">{qa.question_key}</span>
                      <span className="text-sm text-white font-mono max-w-[60%] text-right break-all">{qa.answer}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : tab === 'users' ? (
          /* Users List */
          <div className="space-y-2">
            {loading ? (
              <p className="text-white/40">Loading...</p>
            ) : users.length === 0 ? (
              <p className="text-white/40">No users yet.</p>
            ) : (
              users.map((u) => (
                <div key={u.id} onClick={() => viewUser(u)} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{u.first_name} {u.last_name} <span className="text-white/40 font-normal">({u.email})</span></p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {u.phone || 'No phone'} &middot; {u.gender || '—'} &middot; {u.city || '—'}
                        {u.is_premium && <span className="ml-2 text-lime">Premium</span>}
                        {u.is_admin && <span className="ml-2 text-pink">Admin</span>}
                      </p>
                    </div>
                    <span className="text-xs text-white/30">{new Date(u.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Payments Tab */
          <div className="space-y-4">
            {payments.length === 0 ? (
              <p className="text-white/40">No payment verifications yet.</p>
            ) : (
              payments.map((p) => {
                const user = users.find((u) => u.id === p.user_id);
                return (
                  <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-white font-semibold">{p.plan_name} Plan</p>
                        <p className="text-sm text-white/50">User: {user?.first_name || user?.email || p.user_id}</p>
                        <p className="text-sm text-white/50">Amount: ₹{p.amount} | UTR: <span className="font-mono text-pink">{p.utr}</span></p>
                        <p className="text-sm text-white/50">Status: <span className={p.status === 'verified' ? 'text-lime' : p.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}>{p.status}</span></p>
                        {p.created_at && <p className="text-xs text-white/30">{new Date(p.created_at).toLocaleString()}</p>}
                      </div>
                      {p.status === 'pending' && (
                        <div className="flex gap-2 shrink-0">
                          <Button variant="primary" size="sm" onClick={() => handleVerify(p.id, p.user_id, p.plan_name)} loading={verifyingId === p.id}>Verify</Button>
                          <Button variant="ghost" size="sm" className="text-red-400 border-red-400/30 hover:bg-red-400/10" onClick={() => handleReject(p.id)} loading={verifyingId === p.id}>Reject</Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </main>
  );
}
