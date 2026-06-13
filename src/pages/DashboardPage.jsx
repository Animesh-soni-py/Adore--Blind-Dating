import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useMatches } from '../hooks/useMatches';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/useToast';

function ProgressRing({ percent, size = 56, stroke = 4 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="white"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="progress-ring-circle"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".35em"
        className="fill-white font-display text-xs font-bold"
      >
        {percent}%
      </text>
    </svg>
  );
}

function getProfileCompletion(profile) {
  if (!profile) return 0;
  let score = 0;
  if (profile.date_of_birth) score += 15;
  if (profile.gender) score += 10;
  if (profile.seeking) score += 10;
  if (profile.city) score += 10;
  if (profile.bio) score += 15;
  if (profile.quiz_completed) score += 20;
  if (profile.interests?.length >= 3) score += 10;
  if (profile.profile_photo_url) score += 10;
  return Math.min(score, 100);
}

function DashboardInner() {
  const { profile } = useProfile();
  const { matches, loading: matchesLoading, refetch: refetchMatches } = useMatches();
  const toast = useToast();
  const [finding, setFinding] = useState(false);

  const activeMatches = matches.filter((m) => ['active', 'reveal_requested'].includes(m.status));
  const completionPercent = getProfileCompletion(profile);

  return (
    <main className="pt-[72px] min-h-screen" style={{ background: 'linear-gradient(180deg, #0F0A1E 0%, #1A1A2E 100%)' }} id="main-content">
        <div className="container-adore py-8 lg:py-12">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-dark-purple via-dark to-dark-plum p-8 lg:p-10 mb-10 shadow-glow-lavender">
            {/* Ambient blobs */}
            <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,94,138,0.2) 0%, transparent 70%)' }} />
            <div className="absolute bottom-[-30px] left-[-30px] w-[150px] h-[150px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,168,240,0.15) 0%, transparent 70%)' }} />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-normal mb-2">
                  Welcome back, {profile?.first_name || 'there'}! 💘
                </h1>
                <p className="font-body text-base text-white/50 max-w-[400px]">
                  Your blind dating journey continues. Check your matches and keep the conversations flowing.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ProgressRing percent={completionPercent} />
                <div>
                  <p className="text-xs text-white/40 font-body">Profile</p>
                  <p className="text-sm text-white font-semibold font-body">
                    {completionPercent === 100 ? 'Complete!' : `${completionPercent}% done`}
                  </p>
                </div>
              </div>
            </div>
          </div>



          {/* Active Matches */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">
                Active Matches
              </h2>
              <Link to="/matches" className="text-sm text-pink font-semibold hover:underline">
                View All
              </Link>
            </div>

            {matchesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} bgColor="bg-white/5" padding="p-6" hoverable={false} className="border border-white/10">
                    <Skeleton width="60%" height="20px" className="mb-3" />
                    <Skeleton width="100%" height="40px" className="mb-2" />
                    <Skeleton width="40%" height="16px" />
                  </Card>
                ))}
              </div>
            ) : activeMatches.length === 0 ? (
              <Card bgColor="bg-white/5" padding="p-8" hoverable={false} className="border border-white/10">
                <div className="text-center py-8">
                  <span className="text-5xl mb-4 block">💘</span>
                  <p className="font-display text-lg font-bold text-white/45 mb-2">
                    No active matches yet
                  </p>
                  <p className="text-sm text-white/40 mb-6">
                    Find your first match now!
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                      variant="primary"
                      size="md"
                      loading={finding}
                      onClick={async () => {
                        setFinding(true);
                        try {
                          const { error } = await supabase.functions.invoke('run-matching');
                          if (error) throw error;
                          toast.success('New match found! Check your matches.');
                          refetchMatches();
                        } catch (err) {
                          toast.error(err.message || 'No compatible users found yet. Try again later.');
                        } finally {
                          setFinding(false);
                        }
                      }}
                    >
                      Find Matches
                    </Button>
                    <Link to={profile?.onboarding_completed ? '/profile/edit' : '/profile/setup'}>
                      <Button variant="ghost" size="md">
                        {profile?.onboarding_completed ? 'Modify Profile' : 'Complete Profile'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeMatches.slice(0, 6).map((match) => (
                  <Card key={match.id} bgColor="bg-white/5" padding="p-6" className="border border-white/10">
                    <Link to={match.id ? `/chat/${match.id}` : '#'} className="block">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-display text-sm font-bold text-white">
                          Match #{match.id?.slice(0, 6)}
                        </span>
                        <span className="text-xs font-bold text-white bg-pink px-2.5 py-1 rounded-full shadow-sm">
                          {match.compatibility_score}%
                        </span>
                      </div>
                      <p className="text-sm text-white/50 mb-1">
                        {match.status === 'reveal_requested' ? '✨ Reveal requested' : '💬 Blind chat active'}
                      </p>
                      <p className="text-xs text-white/35">
                        Matched {new Date(match.matched_at).toLocaleDateString()}
                      </p>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="font-display text-xl font-bold text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to={profile?.onboarding_completed ? '/profile/edit' : '/profile/setup'}>
                <Card bgColor="bg-white/5" padding="p-6" className="border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">📝</span>
                    <h3 className="font-display text-base font-bold text-white">
                      {profile?.onboarding_completed ? 'Modify Profile' : 'Complete Profile'}
                    </h3>
                  </div>
                  <p className="text-xs text-white/50">
                    {profile?.onboarding_completed ? 'Edit your details and retake quiz' : 'Get better matches'}
                  </p>
                </Card>
              </Link>
              <Link to="/matches">
                <Card bgColor="bg-white/5" padding="p-6" className="border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">💘</span>
                    <h3 className="font-display text-base font-bold text-white">
                      View Matches
                    </h3>
                  </div>
                  <p className="text-xs text-white/50">
                    See your compatibility scores
                  </p>
                </Card>
              </Link>
              {!profile?.is_premium && (
                <Link to="/pricing">
                  <Card bgColor="bg-white/5" padding="p-6" className="border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">⭐</span>
                      <h3 className="font-display text-base font-bold text-white">
                        Upgrade Plan
                      </h3>
                    </div>
                    <p className="text-xs text-white/50">
                      Unlock premium features
                    </p>
                  </Card>
                </Link>
              )}
            </div>
          </section>
        </div>
      </main>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardInner />
    </ProtectedRoute>
  );
}
