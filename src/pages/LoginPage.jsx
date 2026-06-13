import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const justSignedUp = location.state?.justSignedUp;

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return null;
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your blind dating journey."
    >
      {justSignedUp && (
        <div className="mb-6 p-4 rounded-xl bg-lime/10 border border-lime/30 text-sm text-lime text-center font-medium">
          ✓ Account created! Your email has been confirmed — sign in below.
        </div>
      )}
      <LoginForm />
    </AuthLayout>
  );
}
