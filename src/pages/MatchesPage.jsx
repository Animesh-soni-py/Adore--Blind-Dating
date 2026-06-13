import { Link } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

function MatchesInner() {
  const { matches, loading } = useMatches();

  const activeMatches = matches.filter((m) => ['active', 'reveal_requested'].includes(m.status));
  const revealedMatches = matches.filter((m) => m.status === 'revealed');
  const expiredMatches = matches.filter((m) => ['expired', 'unmatched'].includes(m.status));

  return (
    <main className="pt-[72px] min-h-screen" style={{ background: '#0F0A1E' }} id="main-content">
        <div className="container-adore py-8 lg:py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-white/10">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-normal">
                Your Matches
              </h1>
              <p className="font-body text-base md:text-lg text-white/50 mt-2">
                See your compatibility scores and manage connections.
              </p>
            </div>
            <div>
              <Link to="/dashboard">
                <Button variant="primary" size="md" className="px-5 py-2.5 font-bold">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} bgColor="bg-white/5" padding="p-6" hoverable={false} className="border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton width="160px" height="20px" />
                      <Skeleton width="240px" height="16px" />
                    </div>
                    <Skeleton width="80px" height="32px" rounded="rounded-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Active Matches */}
              <section className="mb-12">
                <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                  Active Matches
                  {activeMatches.length > 0 && (
                    <span className="text-xs bg-pink/10 text-pink px-2 py-0.5 rounded-full font-bold">
                      {activeMatches.length}
                    </span>
                  )}
                </h2>

                {activeMatches.length === 0 ? (
                  <Card bgColor="bg-white/5" padding="p-8" hoverable={false} className="border border-white/10">
                    <div className="text-center py-8">
                      <p className="font-display text-lg font-bold text-white/45 mb-2">
                        No active matches
                      </p>
                      <p className="text-sm text-white/40">
                        New matches will appear here once they're ready.
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {activeMatches.map((match) => (
                      <Card key={match.id} bgColor="bg-white/5" padding="p-6" className="border border-white/10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-display text-lg font-bold text-white">
                                Match #{match.id?.slice(0, 8)}
                              </span>
                              <Badge variant={match.status === 'reveal_requested' ? 'lavender' : 'mint'}>
                                {match.status === 'reveal_requested' ? 'Reveal Requested' : 'Blind Chat'}
                              </Badge>
                            </div>
                            <p className="text-sm text-white/50">
                              Matched {new Date(match.matched_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                            {match.expires_at && (
                              <p className="text-xs text-white/35 mt-0.5">
                                Expires {new Date(match.expires_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="font-display text-2xl font-extrabold text-pink">
                              {match.compatibility_score}%
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              {/* Revealed Matches */}
              {revealedMatches.length > 0 && (
                <section className="mb-12">
                  <h2 className="font-display text-xl font-bold text-white mb-6">
                    Revealed Matches
                  </h2>
                  <div className="space-y-4">
                    {revealedMatches.map((match) => (
                      <Card key={match.id} bgColor="bg-white/5" padding="p-6" className="border border-white/10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            {match.partner?.profile_photo_url ? (
                              <img
                                src={match.partner.profile_photo_url}
                                alt={match.partner.first_name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-lavender/30"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-lavender/10 flex items-center justify-center font-display text-lg font-bold text-lavender">
                                {(match.partner?.first_name || 'S')[0].toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="font-display text-lg font-bold text-white">
                                  {match.partner?.first_name || 'Someone special'}
                                </span>
                                <Badge variant="lavender">Revealed</Badge>
                              </div>
                              <p className="text-sm text-white/50">
                                {match.partner?.city ? `${match.partner.city} · ` : ''}Matched {new Date(match.matched_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </p>
                              {match.partner?.bio && (
                                <p className="text-xs text-white/40 mt-1.5 italic line-clamp-1 max-w-md">
                                  &ldquo;{match.partner.bio}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="font-display text-2xl font-extrabold text-lavender">
                              {match.compatibility_score}%
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Past Matches */}
              {expiredMatches.length > 0 && (
                <section>
                  <h2 className="font-display text-xl font-bold text-white mb-6">
                    Past Matches
                  </h2>
                  <div className="space-y-4">
                    {expiredMatches.map((match) => (
                      <Card key={match.id} bgColor="bg-white/5" padding="p-6" hoverable={false} className="border border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-display text-base font-bold text-white/40">
                              Match #{match.id?.slice(0, 8)}
                            </span>
                            <p className="text-xs text-white/30">
                              {match.status === 'expired' ? 'Expired' : 'Unmatched'}
                            </p>
                          </div>
                          <span className="font-display text-lg font-bold text-white/30">
                            {match.compatibility_score}%
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
  );
}

export default function MatchesPage() {
  return (
    <ProtectedRoute>
      <MatchesInner />
    </ProtectedRoute>
  );
}
