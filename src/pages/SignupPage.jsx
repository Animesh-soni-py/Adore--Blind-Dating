import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/auth/AuthLayout';
import SignupForm from '../components/auth/SignupForm';

export default function SignupPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return null; // Don't render form while checking session
  }

  return (
    <AuthLayout
      title="Join ADORE"
      subtitle="Create your account and start your blind dating journey."
    >
      <SignupForm />
    </AuthLayout>
  );
}
