import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../hooks/useProfile';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import PhotoUpload from '../components/profile/PhotoUpload';

// ── All 23 onboarding steps ─────────────────────────────────────────
const onboardingSteps = [
  // BASIC DETAILS (1-4)
  { key: 'photo', category: 'Basic Details', catIndex: 1, catTotal: 4, type: 'photo', label: 'Add your best photo' },
  { key: 'dateOfBirth', category: 'Basic Details', catIndex: 2, catTotal: 4, type: 'date', label: "What's your date of birth?" },
  { key: 'gender', category: 'Basic Details', catIndex: 3, catTotal: 4, type: 'select', label: 'What\'s your gender?', options: ['Man', 'Woman', 'Non-binary', 'Prefer not to say'] },
  { key: 'city', category: 'Basic Details', catIndex: 4, catTotal: 4, type: 'text', label: 'Which city are you in?', placeholder: 'e.g. Jabalpur' },

  // CONTACT & SOCIAL (5-6)
  { key: 'whatsapp', category: 'Contact & Social', catIndex: 1, catTotal: 2, type: 'text', label: 'Your WhatsApp number', placeholder: '+91 98765 43210', subtext: 'We\'ll use this only for match notifications' },
  { key: 'instagram', category: 'Contact & Social', catIndex: 2, catTotal: 2, type: 'text', label: 'Your Instagram handle', placeholder: '@yourhandle', subtext: 'Optional — shown only after mutual match' },

  // DATE PREFERENCES (7-12)
  { key: 'seeking', category: 'Date Preferences', catIndex: 1, catTotal: 6, type: 'select', label: 'Who are you looking for?', options: ['Man', 'Woman', 'Everyone'] },
  { key: 'ageRange', category: 'Date Preferences', catIndex: 2, catTotal: 6, type: 'range', label: 'Preferred age range?', min: 18, max: 50 },
  { key: 'availability', category: 'Date Preferences', catIndex: 3, catTotal: 6, type: 'select', label: 'When are you usually free?', options: ['Weekdays', 'Weekends', 'Flexible'] },
  { key: 'dateType', category: 'Date Preferences', catIndex: 4, catTotal: 6, type: 'select', label: 'Indoor or outdoor dates?', options: ['Indoor', 'Outdoor', 'Both work for me'] },
  { key: 'dateVibe', category: 'Date Preferences', catIndex: 5, catTotal: 6, type: 'select', label: 'What\'s your ideal date vibe?', options: ['Chill café', 'Adventure & outdoors', 'Fine dining', 'Surprise me!'] },
  { key: 'budget', category: 'Date Preferences', catIndex: 6, catTotal: 6, type: 'select', label: 'Comfortable spending range?', options: ['Under ₹500', '₹500 - ₹1,000', '₹1,000 - ₹2,000', '₹2,000+', 'Doesn\'t matter'] },

  // PERSONAL (13-14)
  { key: 'occupation', category: 'Personal', catIndex: 1, catTotal: 2, type: 'text', label: 'What do you do?', placeholder: 'e.g. Software Engineer, Student, Designer' },
  { key: 'interests', category: 'Personal', catIndex: 2, catTotal: 2, type: 'multiselect', label: 'Your hobbies & interests', subtext: 'Select at least 3' },

  // LIFESTYLE (15-18)
  { key: 'conversationOpenness', category: 'Lifestyle', catIndex: 1, catTotal: 4, type: 'rating', label: 'How open are you in conversations?', subtext: '1 = Reserved, 5 = Open book' },
  { key: 'smoking', category: 'Lifestyle', catIndex: 2, catTotal: 4, type: 'select', label: 'Do you smoke?', options: ['Yes', 'No', 'Occasionally'] },
  { key: 'drinking', category: 'Lifestyle', catIndex: 3, catTotal: 4, type: 'select', label: 'Do you drink?', options: ['Yes', 'No', 'Occasionally'] },
  { key: 'pets', category: 'Lifestyle', catIndex: 4, catTotal: 4, type: 'select', label: 'How do you feel about pets?', options: ['Love them! 🐾', 'I\'m okay with them', 'Prefer no pets'] },

  // ABOUT YOU (19-20)
  { key: 'threeWords', category: 'About You', catIndex: 1, catTotal: 2, type: 'text', label: 'Describe yourself in 3 words', placeholder: 'e.g. Curious, Kind, Adventurous' },
  { key: 'greenFlags', category: 'About You', catIndex: 2, catTotal: 2, type: 'textarea', label: 'What are your green flags in a person?', placeholder: 'What makes someone instantly attractive to you...' },

  // FUN QUESTIONS (21-23)
  { key: 'dealBreaker', category: 'Fun Questions', catIndex: 1, catTotal: 3, type: 'textarea', label: 'What\'s your deal-breaker?', placeholder: 'One thing you absolutely can\'t compromise on...' },
  { key: 'perfectDate', category: 'Fun Questions', catIndex: 2, catTotal: 3, type: 'textarea', label: 'Describe your perfect first date', placeholder: 'Paint us a picture of your dream date...' },
  { key: 'anythingElse', category: 'Fun Questions', catIndex: 3, catTotal: 3, type: 'textarea', label: 'Anything else we should know?', placeholder: 'Fun facts, quirks, or a message to your future match...', optional: true },
];

const interestOptions = [
  { name: 'Travel', icon: '✈️' },
  { name: 'Cooking', icon: '🍳' },
  { name: 'Reading', icon: '📚' },
  { name: 'Fitness', icon: '💪' },
  { name: 'Music', icon: '🎵' },
  { name: 'Art', icon: '🎨' },
  { name: 'Movies', icon: '🎬' },
  { name: 'Photography', icon: '📸' },
  { name: 'Hiking', icon: '🥾' },
  { name: 'Yoga', icon: '🧘' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Dancing', icon: '💃' },
  { name: 'Writing', icon: '✍️' },
  { name: 'Volunteering', icon: '🤝' },
  { name: 'Meditation', icon: '🧘‍♀️' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Coffee', icon: '☕' },
  { name: 'Fashion', icon: '👗' },
  { name: 'Tech', icon: '💻' },
  { name: 'Pets', icon: '🐕' },
];

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -100 : 100, opacity: 0 }),
};

// ── Step rendering components ─────────────────────────────────────
function PhotoStep({ profile, onRefetch }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-white/40 text-sm font-body mb-6 text-center">
        A great photo helps create a memorable first impression when you choose to reveal.
      </p>
      <PhotoUpload
        currentUrl={profile?.profile_photo_url}
        onUpload={onRefetch}
      />
    </div>
  );
}

function DateStep({ value, onChange }) {
  return (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-4 rounded-xl border-[1.5px] border-white/10 bg-white/5 font-body text-lg text-white focus:outline-none focus:border-pink/50 focus:bg-white/[0.08] transition-all"
    />
  );
}

function TextStep({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-5 py-4 rounded-xl border-[1.5px] border-white/10 bg-white/5 font-body text-lg text-white placeholder:text-white/25 focus:outline-none focus:border-pink/50 focus:bg-white/[0.08] transition-all"
      autoFocus
    />
  );
}

function TextareaStep({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full px-5 py-4 rounded-xl border-[1.5px] border-white/10 bg-white/5 font-body text-lg text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-pink/50 focus:bg-white/[0.08] transition-all"
      autoFocus
    />
  );
}

function SelectStep({ options, value, onChange }) {
  return (
    <div className="space-y-3">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`w-full text-left px-5 py-4 rounded-xl border-2 text-base md:text-lg font-bold transition-all duration-200 ${
            value === opt
              ? 'border-pink bg-pink/10 text-pink shadow-glow-pink'
              : 'border-white/10 text-white/70 hover:border-white/20 hover:bg-white/5'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function RangeStep({ value, onChange, min, max }) {
  const range = value || { min: 18, max: 30 };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <label className="text-xs text-white/40 font-body block mb-2">Minimum Age</label>
          <input
            type="number"
            min={min}
            max={range.max}
            value={range.min}
            onChange={(e) => onChange({ ...range, min: Math.max(min, parseInt(e.target.value) || min) })}
            className="w-20 px-3 py-3 rounded-xl border-[1.5px] border-white/10 bg-white/5 font-body text-xl text-white text-center focus:outline-none focus:border-pink/50 transition-all"
          />
        </div>
        <span className="text-white/30 text-2xl font-bold mt-5">—</span>
        <div className="text-center">
          <label className="text-xs text-white/40 font-body block mb-2">Maximum Age</label>
          <input
            type="number"
            min={range.min}
            max={max}
            value={range.max}
            onChange={(e) => onChange({ ...range, max: Math.min(max, parseInt(e.target.value) || max) })}
            className="w-20 px-3 py-3 rounded-xl border-[1.5px] border-white/10 bg-white/5 font-body text-xl text-white text-center focus:outline-none focus:border-pink/50 transition-all"
          />
        </div>
      </div>
      <p className="text-center text-sm text-white/40 font-body">
        Looking for ages <span className="text-pink font-bold">{range.min}</span> to <span className="text-pink font-bold">{range.max}</span>
      </p>
    </div>
  );
}

function RatingStep({ value, onChange }) {
  const rating = value || 0;
  const emojis = ['😶', '🙂', '😊', '😄', '🤗'];
  return (
    <div className="flex justify-center gap-3">
      {[1, 2, 3, 4, 5].map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
            rating === r
              ? 'border-pink bg-pink/10 shadow-glow-pink scale-110'
              : 'border-white/10 hover:border-white/20 hover:bg-white/5'
          }`}
        >
          <span className="text-2xl">{emojis[r - 1]}</span>
          <span className={`text-xs font-bold ${rating === r ? 'text-pink' : 'text-white/40'}`}>{r}</span>
        </button>
      ))}
    </div>
  );
}

function MultiSelectStep({ value, onChange }) {
  const selected = value || [];
  function toggle(name) {
    if (selected.includes(name)) {
      onChange(selected.filter((n) => n !== name));
    } else {
      onChange([...selected, name]);
    }
  }
  return (
    <div className="flex flex-wrap gap-3">
      {interestOptions.map((interest) => (
        <button
          key={interest.name}
          type="button"
          onClick={() => toggle(interest.name)}
          className={`px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
            selected.includes(interest.name)
              ? 'border-pink bg-pink/10 text-pink shadow-glow-pink'
              : 'border-white/10 text-white/60 hover:border-white/20 hover:bg-white/5'
          }`}
        >
          <span className="mr-1.5">{interest.icon}</span>
          {interest.name}
        </button>
      ))}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────
function SetupInner() {
  const { profile, updateProfile, completeOnboarding, refetch } = useProfile();
  const toast = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);

  function computeInitialAnswers() {
    const savedCity = sessionStorage.getItem('selectedCity');
    if (savedCity) {
      sessionStorage.removeItem('selectedCity');
      return { city: savedCity };
    }
    return {};
  }
  const [answers, setAnswers] = useState(computeInitialAnswers);

  useEffect(() => {
    if (!profile) return;
    const prefill = {};
    if (profile.date_of_birth) prefill.dateOfBirth = profile.date_of_birth.substring(0, 10);
    if (profile.gender) prefill.gender = profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1).replace('-', ' ');
    if (profile.seeking) prefill.seeking = profile.seeking.charAt(0).toUpperCase() + profile.seeking.slice(1);
    if (profile.city) prefill.city = profile.city;
    if (profile.bio) prefill.bio = profile.bio;
    if (profile.interests) prefill.interests = profile.interests;
    if (profile.onboarding_data) {
      try {
        const saved = typeof profile.onboarding_data === 'string'
          ? JSON.parse(profile.onboarding_data)
          : profile.onboarding_data;
        Object.assign(prefill, saved);
      } catch { /* ignore parse errors */ }
    }
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setAnswers((prev) => ({ ...prev, ...prefill }));
  }, [profile]);

  const totalSteps = onboardingSteps.length;
  const step = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  function setAnswer(value) {
    setAnswers((prev) => ({ ...prev, [step.key]: value }));
  }

  function getAnswer() {
    return answers[step.key];
  }

  function isCurrentStepValid() {
    const val = getAnswer();
    if (step.optional) return true;
    if (step.type === 'photo') return true; // Photo is optional
    if (step.type === 'multiselect') return val && val.length >= 3;
    if (step.type === 'range') return val && val.min && val.max;
    if (step.type === 'rating') return val && val >= 1;
    return val && String(val).trim() !== '';
  }

  function goNext() {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function goBack() {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async function handleFinish() {
    if (!isCurrentStepValid()) {
      toast.error('Please complete this step before finishing.');
      return;
    }

    try {
      setLoading(true);

      // Build the profile update
      const profileUpdate = {
        date_of_birth: answers.dateOfBirth || null,
        gender: answers.gender?.toLowerCase().replace(/\s+/g, '-') || null,
        seeking: answers.seeking?.toLowerCase() || null,
        city: answers.city || null,
        bio: answers.threeWords || null,
        interests: answers.interests || [],
      };

      // Store extended onboarding data as JSON
      const onboardingData = {
        whatsapp: answers.whatsapp || null,
        instagram: answers.instagram || null,
        ageRange: answers.ageRange || null,
        availability: answers.availability || null,
        dateType: answers.dateType || null,
        dateVibe: answers.dateVibe || null,
        budget: answers.budget || null,
        occupation: answers.occupation || null,
        conversationOpenness: answers.conversationOpenness || null,
        smoking: answers.smoking || null,
        drinking: answers.drinking || null,
        pets: answers.pets || null,
        threeWords: answers.threeWords || null,
        greenFlags: answers.greenFlags || null,
        dealBreaker: answers.dealBreaker || null,
        perfectDate: answers.perfectDate || null,
        anythingElse: answers.anythingElse || null,
      };

      profileUpdate.onboarding_data = onboardingData;

      await updateProfile(profileUpdate);
      await completeOnboarding();
      toast.success('Profile completed! Getting your matches ready... ✨');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Auto-advance for select type on click
  function handleSelectAndAdvance(value) {
    setAnswer(value);
    if (currentStep < totalSteps - 1) {
      setTimeout(() => {
        setDirection(1);
        setCurrentStep((s) => s + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    }
  }

  function renderStepContent() {
    switch (step.type) {
      case 'photo':
        return <PhotoStep profile={profile} onRefetch={refetch} />;
      case 'date':
        return <DateStep value={getAnswer()} onChange={setAnswer} />;
      case 'text':
        return <TextStep value={getAnswer()} onChange={setAnswer} placeholder={step.placeholder} />;
      case 'textarea':
        return <TextareaStep value={getAnswer()} onChange={setAnswer} placeholder={step.placeholder} />;
      case 'select':
        return <SelectStep options={step.options} value={getAnswer()} onChange={handleSelectAndAdvance} />;
      case 'range':
        return <RangeStep value={getAnswer()} onChange={setAnswer} min={step.min} max={step.max} />;
      case 'rating':
        return <RatingStep value={getAnswer()} onChange={setAnswer} />;
      case 'multiselect':
        return <MultiSelectStep value={getAnswer()} onChange={setAnswer} />;
      default:
        return null;
    }
  }

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <main className="pt-[72px] min-h-screen pb-16" style={{ background: '#0F0A1E' }} id="main-content">
        <div className="container-adore py-8 lg:py-12 max-w-[640px]">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white italic mb-2">
              Tell Us About You
            </h1>
            <p className="font-body text-sm text-white/40">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </motion.div>

          {/* Category Label */}
          <div className="text-center mb-4">
            <span className="font-display text-xs font-bold tracking-[3px] uppercase text-pink">
              {step.category} ({step.catIndex}/{step.catTotal})
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-pink to-lavender"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h2 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
                  {step.label}
                </h2>
                {step.subtext && (
                  <p className="text-sm text-white/40 font-body mb-6">{step.subtext}</p>
                )}
                {!step.subtext && <div className="mb-6" />}

                {renderStepContent()}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 gap-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={goBack}
              disabled={currentStep === 0 || loading}
              className="text-white border-white/20 hover:bg-white/10"
            >
              ← Back
            </Button>

            {isLastStep ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleFinish}
                disabled={!isCurrentStepValid() || loading}
                loading={loading}
                className="shadow-glow-pink"
              >
                Complete Profile ✨
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={goNext}
                disabled={!isCurrentStepValid()}
                className="shadow-glow-pink"
              >
                Next →
              </Button>
            )}
          </div>
        </div>
      </main>
  );
}

export default function ProfileSetupPage() {
  return (
    <ProtectedRoute>
      <SetupInner />
    </ProtectedRoute>
  );
}
