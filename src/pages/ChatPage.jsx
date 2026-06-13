import { Link } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';

function ChatFallback() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen flex items-center justify-center" style={{ background: '#0F0A1E' }} id="main-content">
        <div className="text-center max-w-md px-4">
          <span className="text-6xl block mb-6">💬</span>
          <h1 className="font-display text-2xl font-bold text-white mb-3">Chatting is currently unavailable</h1>
          <p className="text-white/50 mb-8">The chat feature has been removed from this version. Check your matches for more details.</p>
          <Link to="/matches">
            <Button variant="primary" size="lg">View Matches</Button>
          </Link>
        </div>
      </main>
    </>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatFallback />
    </ProtectedRoute>
  );
}
