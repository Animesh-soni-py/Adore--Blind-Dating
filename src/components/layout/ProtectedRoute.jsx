import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F0A1E' }}>
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="font-body text-sm text-white/40">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!profile) {
    if (location.pathname === '/profile/setup') {
      return children;
    }
    return <Navigate to="/profile/setup" replace />;
  }

  const isOnboardingCompleted = !!profile.onboarding_completed;
  const isQuizCompleted = !!profile.quiz_completed;
  const isOnboardingPath = location.pathname === '/profile/setup';
  const isQuizPath = location.pathname === '/personality-quiz';

  if (!isOnboardingCompleted && !isOnboardingPath) {
    return <Navigate to="/profile/setup" replace />;
  }

  if (isOnboardingCompleted && isOnboardingPath && !isQuizCompleted) {
    return <Navigate to="/personality-quiz" replace />;
  }

  if (isOnboardingCompleted && isOnboardingPath && isQuizCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isOnboardingCompleted && !isQuizCompleted && !isQuizPath) {
    return <Navigate to="/personality-quiz" replace />;
  }

  return children;
}
