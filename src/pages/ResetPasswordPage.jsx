import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery') && !ready) {
      setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) setReady(true);
        });
      }, 2000);
    }

    return () => subscription.unsubscribe();
  }, []);

  async function handleReset(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      toast.success('Password updated! Sign in with your new password.');
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F0A1E' }}>
      <div className="w-full max-w-[420px] p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 mb-6">
            <span className="font-display text-xl font-extrabold text-white italic">ADORE</span>
            <span className="font-display text-xl font-semibold text-pink italic">Blind Dating</span>
          </Link>
          <h1 className="font-display text-3xl font-extrabold text-white italic mb-2">Reset Password</h1>
          <p className="font-body text-sm text-white/50">
            {ready ? 'Enter your new password below.' : 'Checking your reset link...'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-pink/10 border border-pink/30 text-sm text-pink text-center font-medium">
            {error}
          </div>
        )}

        {ready ? (
          <form onSubmit={handleReset} className="space-y-5">
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
            />
            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
              Update Password
            </Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-pink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-white/40 font-body">
              Verifying your reset link...
            </p>
          </div>
        )}

        <p className="text-center mt-6">
          <Link to="/login" className="text-sm text-pink font-semibold hover:underline">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
