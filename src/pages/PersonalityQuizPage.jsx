import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';

const questions = [
  {
    key: 'energy_level',
    question: 'How would you describe your energy level?',
    type: 'select',
    options: [
      { label: 'Energetic & Outgoing', value: 'energetic_outgoing', score: 5 },
      { label: 'Calm & Relaxed', value: 'calm_relaxed', score: 2 },
      { label: 'Balanced', value: 'balanced', score: 3 },
      { label: 'Reserved & Quiet', value: 'reserved_quiet', score: 1 },
    ],
  },
  {
    key: 'communication_style',
    question: 'What\'s your communication style?',
    type: 'select',
    options: [
      { label: 'Direct & Honest', value: 'direct_honest', score: 4 },
      { label: 'Thoughtful & Deep', value: 'thoughtful_deep', score: 5 },
      { label: 'Playful & Fun', value: 'playful_fun', score: 3 },
      { label: 'Quiet & Observant', value: 'quiet_observant', score: 1 },
    ],
  },
  {
    key: 'love_languages',
    question: 'Which love languages matter most to you?',
    type: 'multiselect',
    subtitle: 'Select all that apply',
    options: [
      { label: 'Words of Affirmation', value: 'words_affirmation', score: 4 },
      { label: 'Quality Time', value: 'quality_time', score: 5 },
      { label: 'Acts of Service', value: 'acts_service', score: 3 },
      { label: 'Physical Touch', value: 'physical_touch', score: 4 },
      { label: 'Gifts', value: 'gifts', score: 2 },
    ],
  },
  {
    key: 'spontaneity',
    question: 'How spontaneous vs. planned are you?',
    type: 'scale',
    leftLabel: 'Very Planned',
    rightLabel: 'Very Spontaneous',
    max: 5,
  },
  {
    key: 'social_battery',
    question: 'What\'s your social style?',
    type: 'select',
    options: [
      { label: 'Extrovert — I thrive in groups', value: 'extrovert', score: 5 },
      { label: 'Ambivert — I enjoy both', value: 'ambivert', score: 3 },
      { label: 'Introvert — I prefer small gatherings or one-on-one', value: 'introvert', score: 1 },
    ],
  },
  {
    key: 'conflict_style',
    question: 'How do you handle disagreements in a relationship?',
    type: 'select',
    options: [
      { label: 'I talk it out immediately', value: 'talk_immediately', score: 4 },
      { label: 'I need space first, then talk', value: 'space_first', score: 3 },
      { label: 'I listen carefully then respond', value: 'listen_respond', score: 5 },
      { label: 'I tend to avoid conflict', value: 'avoid_conflict', score: 1 },
    ],
  },
  {
    key: 'core_values',
    question: 'What values matter most to you in a relationship?',
    type: 'multiselect',
    subtitle: 'Select all that apply',
    options: [
      { label: 'Honesty', value: 'honesty', score: 5 },
      { label: 'Loyalty', value: 'loyalty', score: 5 },
      { label: 'Ambition', value: 'ambition', score: 3 },
      { label: 'Kindness', value: 'kindness', score: 4 },
      { label: 'Humor', value: 'humor', score: 3 },
      { label: 'Intelligence', value: 'intelligence', score: 3 },
      { label: 'Independence', value: 'independence', score: 2 },
      { label: 'Family', value: 'family', score: 4 },
      { label: 'Spirituality', value: 'spirituality', score: 2 },
      { label: 'Adventure', value: 'adventure', score: 3 },
    ],
  },
  {
    key: 'quality_time',
    question: 'What\'s your idea of quality time?',
    type: 'select',
    options: [
      { label: 'Deep conversations over coffee', value: 'deep_conversations', score: 5 },
      { label: 'Shared activities like cooking or games', value: 'shared_activities', score: 4 },
      { label: 'Quiet presence — just being together', value: 'quiet_presence', score: 3 },
      { label: 'Adventures & travel', value: 'adventures_travel', score: 4 },
      { label: 'Date nights out — movies, dinners', value: 'date_nights', score: 2 },
    ],
  },
  {
    key: 'ambition',
    question: 'How important is ambition in a partner?',
    type: 'scale',
    leftLabel: 'Not important',
    rightLabel: 'Very important',
    max: 5,
  },
  {
    key: 'emotional_availability',
    question: 'How emotionally available are you?',
    type: 'select',
    options: [
      { label: 'Very open — I share my feelings easily', value: 'very_open', score: 4 },
      { label: 'Selective — I open up over time', value: 'selective', score: 3 },
      { label: 'Guarded — I take time to trust', value: 'guarded', score: 2 },
      { label: 'Working on it', value: 'working_on_it', score: 1 },
    ],
  },
  {
    key: 'humor',
    question: 'What kind of humor do you enjoy?',
    type: 'select',
    options: [
      { label: 'Witty & Sarcastic', value: 'witty_sarcastic', score: 4 },
      { label: 'Goofy & Silly', value: 'goofy_silly', score: 3 },
      { label: 'Dry & Deadpan', value: 'dry_deadpan', score: 2 },
      { label: 'Observational', value: 'observational', score: 3 },
      { label: 'Dark Humor', value: 'dark_humor', score: 1 },
    ],
  },
  {
    key: 'weekend_vibe',
    question: 'Your ideal weekend looks like?',
    type: 'select',
    options: [
      { label: 'Going out & socializing', value: 'going_out', score: 5 },
      { label: 'Relaxing at home', value: 'relaxing_home', score: 2 },
      { label: 'Adventure & outdoors', value: 'adventure_outdoors', score: 4 },
      { label: 'Cultural events — museums, shows', value: 'cultural_events', score: 3 },
      { label: 'Trying new things', value: 'trying_new', score: 4 },
    ],
  },
  {
    key: 'dealbreakers',
    question: 'What are your dealbreakers in a relationship?',
    type: 'multiselect',
    subtitle: 'Select all that apply',
    options: [
      { label: 'Dishonesty', value: 'dishonesty', score: 5 },
      { label: 'Disrespect', value: 'disrespect', score: 5 },
      { label: 'Lack of ambition', value: 'lack_ambition', score: 3 },
      { label: 'Poor hygiene', value: 'poor_hygiene', score: 4 },
      { label: 'Close-mindedness', value: 'close_mindedness', score: 3 },
      { label: 'Negativity', value: 'negativity', score: 4 },
      { label: 'Unreliability', value: 'unreliability', score: 3 },
    ],
  },
  {
    key: 'looking_for',
    question: 'What are you looking for right now?',
    type: 'select',
    options: [
      { label: 'A serious relationship', value: 'serious_relationship', score: 5 },
      { label: 'Something casual', value: 'casual', score: 1 },
      { label: 'Open to anything', value: 'open_anything', score: 3 },
      { label: 'Friendship first', value: 'friendship_first', score: 2 },
      { label: 'Not sure yet', value: 'not_sure', score: 1 },
    ],
  },
  {
    key: 'chronotype',
    question: 'Are you a morning person or night owl?',
    type: 'select',
    options: [
      { label: 'Morning person — I wake up early and energized', value: 'morning_person', score: 2 },
      { label: 'Night owl — I come alive at night', value: 'night_owl', score: 4 },
      { label: 'In between — depends on the day', value: 'in_between', score: 3 },
    ],
  },
  {
    key: 'travel_style',
    question: 'What\'s your travel style?',
    type: 'select',
    options: [
      { label: 'Backpacker — budget and adventurous', value: 'backpacker', score: 3 },
      { label: 'Luxury — comfort and indulgence', value: 'luxury', score: 2 },
      { label: 'Cultural explorer — museums, food, history', value: 'cultural_explorer', score: 4 },
      { label: 'Adventure seeker — hiking, extreme sports', value: 'adventure_seeker', score: 5 },
      { label: 'Staycation — home is where the heart is', value: 'staycation', score: 1 },
    ],
  },
];

function getScoreForQuestion(question, answer) {
  if (!answer) return 0;
  if (question.type === 'scale') {
    return answer;
  }
  if (question.type === 'multiselect') {
    if (!Array.isArray(answer)) return 0;
    const scores = answer.map((val) => {
      const opt = question.options.find((o) => o.value === val);
      return opt?.score || 0;
    });
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }
  const opt = question.options.find((o) => o.value === answer);
  return opt?.score || 0;
}

const categoryIcons = {
  energy_level: '⚡',
  communication_style: '💬',
  love_languages: '❤️',
  spontaneity: '🎲',
  social_battery: '🔋',
  conflict_style: '🤝',
  core_values: '💎',
  quality_time: '🌟',
  ambition: '🎯',
  emotional_availability: '🫂',
  humor: '😂',
  weekend_vibe: '🎉',
  dealbreakers: '🚩',
  looking_for: '🔍',
  chronotype: '🌙',
  travel_style: '✈️',
};

function QuizInner() {
  const { profile, submitQuizAnswers, updateProfile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const containerRef = useRef(null);

  const current = questions[step];
  const progress = ((step + 1) / questions.length) * 100;
  const isLast = step === questions.length - 1;

  const getAnswer = useCallback((key) => answers[key] ?? null, [answers]);

  const setAnswer = useCallback((key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  function handleSelect(key, value) {
    setAnswer(key, value);
    if (step < questions.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 250);
    }
  }

  function handleMultiselect(key, value) {
    const currentAnswers = getAnswer(key) || [];
    if (currentAnswers.includes(value)) {
      setAnswer(key, currentAnswers.filter((v) => v !== value));
    } else {
      setAnswer(key, [...currentAnswers, value]);
    }
  }

  function handleNext() {
    if (isLast) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep((s) => s - 1);
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function canProceed() {
    const answer = getAnswer(current.key);
    if (!answer) return false;
    if (current.type === 'multiselect') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const quizData = questions.map((q) => ({
        questionKey: q.key,
        answer: JSON.stringify(getAnswer(q.key)),
        answerScore: getScoreForQuestion(q, getAnswer(q.key)),
      }));
      await submitQuizAnswers(quizData);

      const quizSummary = {};
      questions.forEach((q) => {
        quizSummary[q.key] = getAnswer(q.key);
      });

      const currentOnboarding = profile?.onboarding_data || {};
      await updateProfile({
        onboarding_data: { ...currentOnboarding, quiz_answers: quizSummary },
      });

      toast.success('Personality quiz completed! 🎉');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Failed to save quiz answers');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
        ref={containerRef}
        className="pt-[72px] min-h-screen overflow-y-auto"
        style={{ background: 'linear-gradient(180deg, #0F0A1E 0%, #1A1A2E 100%)' }}
        id="main-content"
      >
        <div className="container-adore py-8 lg:py-12 max-w-[640px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">{categoryIcons[current.key] || '📝'}</span>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-normal italic">
              Personality Quiz
            </h1>
            <p className="font-body text-base text-white/50 mt-2">
              Question {step + 1} of {questions.length}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-8">
            <div
              className="bg-gradient-to-r from-pink to-lavender h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
              {current.question}
            </h2>
            {current.subtitle && (
              <p className="font-body text-sm text-white/40 mb-6">{current.subtitle}</p>
            )}

            {/* Select Type */}
            {current.type === 'select' && (
              <div className="space-y-3 mt-6">
                {current.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(current.key, opt.value)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-[1.5px] text-base font-medium transition-all duration-200 ${
                      getAnswer(current.key) === opt.value
                        ? 'border-pink bg-pink/10 text-pink shadow-glow-pink'
                        : 'border-white/10 text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Multiselect Type */}
            {current.type === 'multiselect' && (
              <div className="space-y-3 mt-6">
                {current.options.map((opt) => {
                  const selected = (getAnswer(current.key) || []).includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleMultiselect(current.key, opt.value)}
                      className={`w-full text-left px-5 py-4 rounded-xl border-[1.5px] text-base font-medium transition-all duration-200 ${
                        selected
                          ? 'border-pink bg-pink/10 text-pink shadow-glow-pink'
                          : 'border-white/10 text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {selected ? '✓ ' : ''}{opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Scale Type */}
            {current.type === 'scale' && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/40 font-body">{current.leftLabel}</span>
                  <span className="text-sm text-white/40 font-body">{current.rightLabel}</span>
                </div>
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: current.max }, (_, i) => i + 1).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAnswer(current.key, val)}
                      className={`w-12 h-12 rounded-full text-lg font-bold transition-all duration-200 ${
                        getAnswer(current.key) === val
                          ? 'bg-pink text-white shadow-glow-pink scale-110'
                          : 'bg-white/10 text-white/40 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-white/30 font-body">1</span>
                  <span className="text-xs text-white/30 font-body">{current.max}</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              size="md"
              onClick={handleBack}
              disabled={step === 0}
            >
              ← Back
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={handleNext}
              disabled={!canProceed() || submitting || profileLoading}
              loading={submitting}
            >
              {isLast ? 'Complete Quiz' : 'Next →'}
            </Button>
          </div>
        </div>
      </main>
  );
}

export default function PersonalityQuizPage() {
  return (
    <ProtectedRoute>
      <QuizInner />
    </ProtectedRoute>
  );
}
