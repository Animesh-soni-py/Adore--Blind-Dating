import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CitySelectionPage() {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem('selectedCity', 'Jabalpur');
    navigate('/signup', { replace: true });
  }, [navigate]);

  return (
    <main className="pt-[72px] min-h-screen flex items-center justify-center" style={{ background: '#0F0A1E' }} id="main-content">
      <p className="text-white/40 font-body">Redirecting...</p>
    </main>
  );
}
