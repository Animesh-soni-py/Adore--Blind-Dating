import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { supabase } from '../../lib/supabase';

const loginSchema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const forgotSchema = yup.object({
  resetEmail: yup.string().email('Please enter a valid email').required('Email is required'),
});

export default function LoginForm() {
  const { signIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const {
    register: forgotRegister,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
  } = useForm({
    resolver: yupResolver(forgotSchema),
  });

  async function onLogin(data) {
    try {
      setLoading(true);
      await signIn({ email: data.email, password: data.password });
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('email not confirmed')) {
        toast.error('Please check your email for the confirmation link, or try signing up again.');
      } else {
        toast.error(msg || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function onResetPassword(data) {
    try {
      setResetLoading(true);
      const { error: fnError } = await supabase.functions.invoke('forgot-password', {
        body: { email: data.resetEmail, siteUrl: window.location.origin },
      });
      if (fnError) throw fnError;
      toast.success('Password reset link sent to your email!');
      setCooldown(60);
      setShowForgot(false);
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  }

  if (showForgot) {
    return (
      <div>
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
          <span className="text-4xl block mb-3">🔑</span>
          <h3 className="font-display text-xl font-bold text-white mb-1">Reset Password</h3>
          <p className="font-body text-sm text-white/50 mb-6">
            Enter your email and we'll send a password reset link.
          </p>

          <form onSubmit={handleForgotSubmit(onResetPassword)} noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={forgotErrors.resetEmail?.message}
              {...forgotRegister('resetEmail')}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-5"
              loading={resetLoading}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? `Try again in ${cooldown}s` : 'Send Reset Link'}
            </Button>
          </form>
        </div>
        <p className="text-center mt-4">
          <button
            type="button"
            onClick={() => setShowForgot(false)}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            ← Back to Sign In
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onLogin)} noValidate>
      <div className="space-y-5">
        <Input
          label="Email"
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          rightIcon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {showPassword ? (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              ) : (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          }
          onRightIconClick={() => setShowPassword(!showPassword)}
          {...register('password')}
        />
      </div>

      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={() => setShowForgot(true)}
          className="text-sm text-pink font-semibold hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-6"
        loading={loading}
      >
        Sign In
      </Button>

      <p className="text-center text-base text-white/45 mt-8 font-medium">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="text-pink font-bold hover:underline">
          Join Now
        </Link>
      </p>
    </form>
  );
}
