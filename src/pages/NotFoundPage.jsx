import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <main className="pt-[72px] min-h-screen flex items-center justify-center" style={{ background: '#0F0A1E' }} id="main-content">
        <div className="text-center px-4">
          <div className="mb-6">
            <svg viewBox="0 0 200 180" fill="none" className="w-40 mx-auto" aria-hidden="true">
              {/* Broken heart */}
              <path
                d="M100 150 C100 150 40 100 40 65 C40 45 56 30 75 30 C87 30 98 40 100 50 C102 40 113 30 125 30 C144 30 160 45 160 65 C160 100 100 150 100 150Z"
                stroke="#FF5E8A"
                strokeWidth="3"
                fill="#FFB3C6"
                opacity="0.4"
              />
              <line x1="85" y1="70" x2="95" y2="85" stroke="#FF5E8A" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="95" y1="85" x2="85" y2="100" stroke="#FF5E8A" strokeWidth="2.5" strokeLinecap="round" />
              {/* 404 text */}
              <text x="50" y="45" fontFamily="Syne, sans-serif" fontSize="36" fontWeight="800" fill="#FF5E8A" opacity="0.15">
                404
              </text>
            </svg>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-white mb-3">
            Page Not Found
          </h1>
          <p className="text-body text-white/50 max-w-[400px] mx-auto mb-8 leading-relaxed">
            Looks like this connection didn&apos;t work out. Let&apos;s get you back to finding real love — the ADORE way.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
  );
}
