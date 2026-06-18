import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

const optionVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.25 },
  }),
};

const scaleVariants = {
  inactive: { scale: 1 },
  active: { scale: [1, 1.15, 1], transition: { duration: 0.3 } },
};

function QuizInner() {
  const { profile, submitQuizAnswers, updateProfile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const toast = useToast();
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [justSelected, setJustSelected] = useState(null);
  const questionRefs = useRef({});

  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => {
    const a = answers[q.key];
    if (a === null || a === undefined) return false;
    if (q.type === 'multiselect') return Array.isArray(a) && a.length > 0;
    return true;
  }).length;
  const skippedCount = questions.filter((q) => answers[q.key] === null).length;
  const progress = ((answeredCount + skippedCount) / totalQuestions) * 100;

  const getAnswer = useCallback((key) => answers[key] ?? null, [answers]);

  const setAnswer = useCallback((key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  function handleSelect(key, value) {
    setAnswer(key, value);
    setJustSelected(key);
    const idx = questions.findIndex((q) => q.key === key);
    if (idx < totalQuestions - 1) {
      setTimeout(() => {
        const nextEl = questionRefs.current[questions[idx + 1].key];
        if (nextEl) {
          nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setJustSelected(null);
      }, 400);
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

  function handleSkip(key) {
    setAnswer(key, null);
  }

  function allRequiredAnswered() {
    return skippedCount + answeredCount === totalQuestions;
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

      toast.success('Personality quiz completed!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Failed to save quiz answers');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
        className="pt-[72px] min-h-screen overflow-y-auto"
        style={{ background: 'linear-gradient(180deg, #0F0A1E 0%, #1A1A2E 100%)' }}
        id="main-content"
      >
        <div className="container-adore py-8 lg:py-12 max-w-[640px] mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.span
              className="text-5xl block mb-4"
              animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1.1, 1] }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              📝
            </motion.span>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-normal italic">
              Personality Quiz
            </h1>
            <p className="font-body text-base text-white/50 mt-2">
              {answeredCount} of {totalQuestions} answered
            </p>
          </motion.div>

          <div className="w-full bg-white/10 rounded-full h-2 mb-8 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-pink to-lavender h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
          >
            {questions.map((q, idx) => (
              <motion.div
                key={q.key}
                ref={(el) => { questionRefs.current[q.key] = el; }}
                variants={cardVariants}
                custom={idx}
                className={`bg-white/5 rounded-2xl border transition-all duration-300 ${
                  justSelected === q.key
                    ? 'border-pink/40 shadow-glow-pink'
                    : 'border-white/10 hover:border-white/20'
                } p-6 md:p-8`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <motion.span
                    className="text-lg"
                    animate={justSelected === q.key ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    {categoryIcons[q.key] || '📝'}
                  </motion.span>
                  <span className="text-xs text-white/30 font-body">Question {idx + 1}</span>
                  {getAnswer(q.key) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto text-xs text-pink font-bold bg-pink/10 px-2 py-0.5 rounded-full"
                    >
                      {q.type === 'multiselect'
                        ? `${(getAnswer(q.key) || []).length} selected`
                        : 'Answered'}
                    </motion.span>
                  )}
                </div>
                <h2 className="font-display text-lg md:text-xl font-bold text-white mb-2">
                  {q.question}
                </h2>
                {q.subtitle && (
                  <p className="font-body text-sm text-white/40 mb-4">{q.subtitle}</p>
                )}

                {q.type === 'select' && (
                  <motion.div className="space-y-2 mt-4">
                    {q.options.map((opt, oi) => (
                      <motion.button
                        key={opt.value}
                        variants={optionVariants}
                        custom={oi}
                        type="button"
                        onClick={() => handleSelect(q.key, opt.value)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-[1.5px] text-sm font-medium transition-all duration-200 ${
                          getAnswer(q.key) === opt.value
                            ? 'border-pink bg-pink/10 text-pink shadow-glow-pink'
                            : 'border-white/10 text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                        }`}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {opt.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {q.type === 'multiselect' && (
                  <div className="space-y-2 mt-4">
                    {q.options.map((opt, oi) => {
                      const selected = (getAnswer(q.key) || []).includes(opt.value);
                      return (
                        <motion.button
                          key={opt.value}
                          variants={optionVariants}
                          custom={oi}
                          type="button"
                          onClick={() => handleMultiselect(q.key, opt.value)}
                          className={`w-full text-left px-4 py-3 rounded-xl border-[1.5px] text-sm font-medium transition-all duration-200 ${
                            selected
                              ? 'border-pink bg-pink/10 text-pink shadow-glow-pink'
                              : 'border-white/10 text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                          }`}
                          whileHover={{ scale: 1.01, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className={`mr-2 transition-all duration-200 ${selected ? 'opacity-100' : 'opacity-0'}`}>
                            ✓
                          </span>
                          {opt.label}
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {q.type === 'scale' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-white/40 font-body">{q.leftLabel}</span>
                      <span className="text-xs text-white/40 font-body">{q.rightLabel}</span>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {Array.from({ length: q.max }, (_, i) => i + 1).map((val) => {
                        const isActive = getAnswer(q.key) === val;
                        return (
                          <motion.button
                            key={val}
                            type="button"
                            onClick={() => setAnswer(q.key, val)}
                            variants={scaleVariants}
                            animate={isActive ? 'active' : 'inactive'}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-10 h-10 rounded-full text-base font-bold transition-all duration-200 ${
                              isActive
                                ? 'bg-pink text-white shadow-glow-pink'
                                : 'bg-white/10 text-white/40 hover:bg-white/20 hover:text-white'
                            }`}
                          >
                            {val}
                          </motion.button>
                        );
                      })}
                    </div>
                    {getAnswer(q.key) && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-xs text-pink font-medium mt-2"
                      >
                        You selected: {getAnswer(q.key)}
                      </motion.p>
                    )}
                  </div>
                )}

                <div className="mt-4 text-center">
                  <motion.button
                    type="button"
                    onClick={() => handleSkip(q.key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-xs transition-colors underline underline-offset-2 ${
                      getAnswer(q.key) === null
                        ? 'text-pink/60 hover:text-pink'
                        : 'text-white/30 hover:text-white/50'
                    }`}
                  >
                    {getAnswer(q.key) === null ? 'Skipped' : 'Skip this question'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-col items-center mt-8 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!allRequiredAnswered() || submitting || profileLoading}
                loading={submitting}
              >
                {allRequiredAnswered() ? 'Complete Quiz' : `${totalQuestions - answeredCount - skippedCount} unanswered, ${skippedCount} skipped`}
              </Button>
            </motion.div>
          </motion.div>
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
