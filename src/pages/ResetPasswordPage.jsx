import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setSessionReady(true);
      }
    });

    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setSessionReady(true);
      });
    }
  }, []);

  async function handleReset(e) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated! Sign in with your new password.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F0A1E' }}>
      <div className="w-full max-w-[420px] p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-extrabold text-white italic mb-2">Reset Password</h1>
          <p className="font-body text-sm text-white/50">Enter your new password below.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            disabled={!sessionReady}
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
            disabled={!sessionReady}
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={!sessionReady}
          >
            Update Password
          </Button>
        </form>

        {!sessionReady && (
          <p className="text-center text-sm text-white/40 mt-6 font-body">
            Checking your reset link...
          </p>
        )}
      </div>
    </div>
  );
}
