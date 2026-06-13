import { useState } from 'react';
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

export default function PaymentModal({ isOpen, onClose, plan }) {
  const { submitPayment, loading } = usePayment();
  const [utr, setUtr] = useState('');

  if (!plan) return null;

  const upiUrl = getUpiUrl(plan.price, plan.name);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Upgrade to ${plan.name}`}>
      <div className="space-y-6">
        {/* Plan summary */}
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
        </div>

        {/* Instructions */}
        <div className="bg-amber/5 border border-amber/20 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-amber font-body uppercase tracking-wide">How to Pay</p>
          <ol className="text-xs text-dark/60 font-body space-y-1.5 list-decimal list-inside">
            <li>Take a screenshot of the QR code below (or note the UPI ID)</li>
            <li>Open any UPI app (Google Pay, PhonePe, Paytm, BHIM)</li>
            <li>Scan the QR or enter the UPI ID manually</li>
            <li>Pay exactly <strong>₹{plan.price}</strong></li>
            <li>Copy the <strong>UTR (Transaction Reference)</strong> number from the payment success screen</li>
            <li>Paste the UTR below and click "Submit for Verification"</li>
          </ol>
        </div>

        {/* UPI QR */}
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold text-dark font-body">Scan & Pay with any UPI app</p>
          <div className="inline-block p-3 bg-white rounded-xl border border-lavender-light">
            <img src={qrUrl} alt="UPI QR Code" className="w-48 h-48 mx-auto" />
          </div>
          <p className="text-xs text-dark/40 font-body">
            UPI ID: <span className="font-mono text-dark/60">{UPI_ID}</span>
          </p>
          <p className="text-sm font-semibold text-dark font-body">Amount: ₹{plan.price}</p>
        </div>

        {/* UTR Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark font-body block">
            Enter UTR Number <span className="text-red-400">*</span>
          </label>
          <p className="text-xs text-dark/40 font-body">
            After payment, enter the UTR number from your bank/UPI app
          </p>
          <input
            type="text"
            value={utr}
            onChange={(e) => setUtr(e.target.value.toUpperCase())}
            placeholder="e.g. HDFC123456789"
            className="w-full px-4 py-3 rounded-xl border border-lavender-light font-body text-sm text-dark focus:outline-none focus:ring-2 focus:ring-pink/50"
          />
        </div>

        {/* Submit */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            loading={loading}
            disabled={!utr.trim()}
          >
            Submit for Verification
          </Button>
          <p className="text-xs text-dark/30 text-center font-body">
            We will verify and activate your plan within 24 hours
          </p>
        </div>
      </div>
    </Modal>
  );
}
