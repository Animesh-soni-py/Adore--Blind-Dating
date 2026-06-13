import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { useToast } from '../hooks/useToast';
import PhotoUpload from '../components/profile/PhotoUpload';
import PhoneVerification from '../components/profile/PhoneVerification';

function EditInner() {
  const { profile, loading, updateProfile, refetch } = useProfile();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({});

  function valueFor(field) {
    if (field in draft) return draft[field];
    return profile?.[field] || '';
  }

  function handleChange(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile(draft);
      setDraft({});
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center" style={{ background: '#0F0A1E' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <main className="pt-[72px] min-h-screen" style={{ background: 'linear-gradient(180deg, #0F0A1E 0%, #1A1A2E 100%)' }} id="main-content">
        <div className="container-adore py-8 lg:py-12 max-w-[640px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-normal italic">Edit Profile</h1>
              <p className="font-body text-base md:text-lg text-white/50 mt-2">Update your personal information.</p>
            </div>
            <div>
              <Link to="/dashboard">
                <Button variant="primary" size="md" className="px-5 py-2.5 font-bold">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <Card bgColor="bg-white/5" padding="p-8" className="border border-white/10">
            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex flex-col items-center pb-6 border-b border-white/10 mb-6">
                <PhotoUpload
                  currentUrl={profile?.profile_photo_url}
                  onUpload={() => {
                    refetch();
                  }}
                />
              </div>

              <div className="pb-6 border-b border-white/10 mb-6">
                <PhoneVerification
                  initialPhone={profile?.phone}
                  onVerified={async (phone) => {
                    await updateProfile({ phone });
                    refetch();
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={valueFor('first_name')}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                />
                <Input
                  label="Last Name"
                  value={valueFor('last_name')}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium font-body text-white/80 mb-1.5 block">Date of Birth</label>
                <input
                  type="date"
                  value={valueFor('date_of_birth')}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  className="w-full px-4 py-3.5 rounded-md border-[1.5px] border-white/10 bg-white/5 font-body text-[15px] text-white input-adore focus:border-pink/50 focus:bg-white/[0.08]"
                />
              </div>

              <div>
                <label className="text-sm font-medium font-body text-white/80 mb-1.5 block">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {['man', 'woman', 'non-binary', 'prefer-not-to-say'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleChange('gender', opt)}
                      className={`px-4 py-3 rounded-lg border-[1.5px] text-sm font-medium transition-all ${
                        valueFor('gender') === opt
                          ? 'border-pink bg-pink/10 text-pink shadow-glow-pink'
                          : 'border-white/10 text-white/50 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium font-body text-white/80 mb-1.5 block">Looking for</label>
                <div className="grid grid-cols-3 gap-3">
                  {['man', 'woman', 'everyone'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleChange('seeking', opt)}
                      className={`px-4 py-3 rounded-lg border-[1.5px] text-sm font-medium transition-all ${
                        valueFor('seeking') === opt
                          ? 'border-pink bg-pink/10 text-pink shadow-glow-pink'
                          : 'border-white/10 text-white/50 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="City"
                value={valueFor('city')}
                onChange={(e) => handleChange('city', e.target.value)}
              />

              <div>
                <label className="text-sm font-medium font-body text-white/80 mb-1.5 block">
                  Bio <span className="text-white/30">(max 500)</span>
                </label>
                <textarea
                  value={valueFor('bio')}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-3.5 rounded-md border-[1.5px] border-white/10 bg-white/5 font-body text-[15px] text-white placeholder:text-white/30 input-adore resize-none focus:border-pink/50 focus:bg-white/[0.08]"
                />
                <p className="text-xs text-white/30 mt-1 text-right">{valueFor('bio').length}/500</p>
              </div>

              {/* Social Handles */}
              <div className="pb-6 border-b border-white/10 mb-6">
                <h3 className="font-display text-lg font-bold text-white mb-4">Social Handles</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium font-body text-white/80 mb-1.5 block">WhatsApp Number</label>
                    <input
                      type="text"
                      value={valueFor('onboarding_data')?.whatsapp || ''}
                      onChange={(e) => {
                        const current = draft.onboarding_data ?? profile?.onboarding_data ?? {};
                        const od = { ...current, whatsapp: e.target.value };
                        handleChange('onboarding_data', od);
                      }}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3.5 rounded-md border-[1.5px] border-white/10 bg-white/5 font-body text-[15px] text-white placeholder:text-white/30 input-adore focus:border-pink/50 focus:bg-white/[0.08]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium font-body text-white/80 mb-1.5 block">Instagram Handle</label>
                    <input
                      type="text"
                      value={valueFor('onboarding_data')?.instagram || ''}
                      onChange={(e) => {
                        const current = draft.onboarding_data ?? profile?.onboarding_data ?? {};
                        const od = { ...current, instagram: e.target.value };
                        handleChange('onboarding_data', od);
                      }}
                      placeholder="@yourhandle"
                      className="w-full px-4 py-3.5 rounded-md border-[1.5px] border-white/10 bg-white/5 font-body text-[15px] text-white placeholder:text-white/30 input-adore focus:border-pink/50 focus:bg-white/[0.08]"
                    />
                  </div>
                </div>
              </div>

              {/* Quiz Section */}
              <div className="pb-6 border-b border-white/10 mb-6">
                <h3 className="font-display text-lg font-bold text-white mb-4">Personality Quiz</h3>
                {profile?.onboarding_data?.quiz_answers && (
                  <div className="space-y-2 mb-4">
                    {Object.entries(profile.onboarding_data.quiz_answers).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2 text-sm">
                        <span className="text-white/50 font-body capitalize min-w-[140px]">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-white font-body">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  to="/personality-quiz"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-pink/10 border border-pink/30 text-pink font-semibold text-sm hover:bg-pink/20 transition-all"
                >
                  📝 Retake Personality Quiz →
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" variant="primary" size="lg" loading={saving}>
                  Save Changes
                </Button>
                <Link to="/dashboard">
                  <Button variant="ghost" size="lg">Cancel</Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </main>
  );
}

export default function ProfileEditPage() {
  return (
    <ProtectedRoute>
      <EditInner />
    </ProtectedRoute>
  );
}
