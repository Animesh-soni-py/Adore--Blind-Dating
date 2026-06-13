import { useState } from 'react';
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

  async function onResetPassword(data) {
    try {
      setResetLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(data.resetEmail, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      toast.success('Password reset link sent to your email!');
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
            >
              Send Reset Link
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
          type="password"
          name="password"
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
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
