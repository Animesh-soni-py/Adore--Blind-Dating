import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { usePayment } from '../../hooks/usePayment';

const UPI_ID = import.meta.env.VITE_UPI_ID || 'yourname@upi';
const UPI_NAME = import.meta.env.VITE_UPI_NAME || 'ADORE';

function getUpiUrl(amount, name) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_NAME,
    am: String(amount),
    cu: 'INR',
    tn: `ADORE ${name}`,
  });
  return `upi://pay?${params.toString()}`;
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            i <= current ? 'bg-pink text-white' : 'bg-lavender-light/50 text-dark/30'
          }`}>
            {i + 1}
          </div>
          {i < total - 1 && (
            <div className={`w-8 h-0.5 rounded transition-colors ${i < current ? 'bg-pink' : 'bg-lavender-light/50'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function PaymentModal({ isOpen, onClose, plan }) {
  const { submitPayment, loading } = usePayment();
  const [step, setStep] = useState(0);
  const [utr, setUtr] = useState('');
  const [dir, setDir] = useState(1);

  if (!plan) return null;

  const upiUrl = getUpiUrl(plan.price, plan.name);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;
  const totalSteps = 3;

  function goNext() {
    if (step < totalSteps - 1) {
      setDir(1);
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    if (step > 0) {
      setDir(-1);
      setStep((s) => s - 1);
    }
  }

  async function handleSubmit() {
    if (!utr.trim()) return;
    try {
      await submitPayment({
        planName: plan.name,
        amount: plan.price,
        period: plan.period,
        utr: utr.trim(),
        upiId: UPI_ID,
      });
      onClose();
    } catch {
      // Error shown via toast
    }
  }

  const steps = [
    {
      title: 'Plan Summary',
      content: (
        <div className="bg-gradient-to-br from-pink/5 to-lavender/5 rounded-xl p-6 border border-lavender-light">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-dark">{plan.name} Plan</h3>
              <p className="text-sm text-dark/50 font-body">
                {plan.period === 'yearly' ? 'Annual billing' : 'Monthly billing'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-extrabold text-pink">₹{plan.price}</p>
              <p className="text-xs text-dark/40">/{plan.period === 'yearly' ? 'year' : 'month'}</p>
            </div>
          </div>
          {plan.features && (
            <ul className="space-y-2 border-t border-lavender-light pt-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-dark/70 font-body">
                  <svg className="w-4 h-4 text-pink flex-shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          )}
          <Button variant="primary" size="lg" className="w-full mt-6" onClick={goNext}>
            Continue to Payment →
          </Button>
        </div>
      ),
    },
    {
      title: 'Pay via UPI',
      content: (
        <div className="space-y-5">
          <div className="bg-amber/5 border border-amber/20 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-amber font-body uppercase tracking-wide">How to Pay</p>
            <ol className="text-xs text-dark/60 font-body space-y-1.5 list-decimal list-inside">
              <li>Take a screenshot of the QR code below (or note the UPI ID)</li>
              <li>Open any UPI app (Google Pay, PhonePe, Paytm, BHIM)</li>
              <li>Scan the QR or enter the UPI ID manually</li>
              <li>Pay exactly <strong>₹{plan.price}</strong></li>
              <li>Copy the <strong>UTR (Transaction Reference)</strong> number</li>
            </ol>
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-dark font-body">Scan & Pay with any UPI app</p>
            <div className="inline-block p-3 bg-white rounded-xl border border-lavender-light">
              <img src={qrUrl} alt="UPI QR Code" className="w-48 h-48 mx-auto" />
            </div>
            <p className="text-xs text-dark/40 font-body break-all">
              UPI ID: <span className="font-mono text-dark/60">{UPI_ID}</span>
            </p>
            <p className="text-sm font-semibold text-dark font-body">Amount: ₹{plan.price}</p>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" size="lg" className="flex-1" onClick={goBack}>
              ← Back
            </Button>
            <Button variant="primary" size="lg" className="flex-1" onClick={goNext}>
              I've Paid →
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: 'Confirm Payment',
      content: (
        <div className="space-y-5">
          <div className="bg-pink/5 border border-pink/20 rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-dark">{plan.name} Plan</p>
            <p className="text-3xl font-extrabold text-pink mt-1">₹{plan.price}</p>
            <p className="text-xs text-dark/40">{plan.period === 'yearly' ? 'Annual billing' : 'Monthly billing'}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark font-body block">
              Enter UTR Number <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-dark/40 font-body">
              Paste the UTR number from your payment success screen
            </p>
            <input
              type="text"
              value={utr}
              onChange={(e) => setUtr(e.target.value.toUpperCase())}
              placeholder="e.g. HDFC123456789"
              className="w-full px-4 py-3 rounded-xl border border-lavender-light font-body text-sm text-dark focus:outline-none focus:ring-2 focus:ring-pink/50"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" size="lg" className="flex-1" onClick={goBack}>
              ← Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleSubmit}
              loading={loading}
              disabled={!utr.trim()}
            >
              Submit
            </Button>
          </div>

          <p className="text-xs text-dark/30 text-center font-body">
            We will verify and activate your plan within 24 hours
          </p>
        </div>
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Upgrade to ${plan.name}`}>
      <StepIndicator current={step} total={totalSteps} />
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {steps[step].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </Modal>
  );
}
