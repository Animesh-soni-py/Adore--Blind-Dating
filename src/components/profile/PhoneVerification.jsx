import { useState } from 'react';
import Button from '../ui/Button';

export default function PhoneVerification({ initialPhone: phoneProp = '', onVerified }) {
  const knownCodes = ['+91', '+1', '+44', '+61', '+971'];

  const [phone, setPhone] = useState(() => {
    if (!phoneProp) return '';
    const code = knownCodes.find((c) => phoneProp.startsWith(c));
    if (code) return phoneProp.slice(code.length);
    return phoneProp.replace(/^\+\d+/, '');
  });
  const [countryCode, setCountryCode] = useState(() => {
    if (phoneProp) {
      const code = knownCodes.find((c) => phoneProp.startsWith(c));
      if (code) return code;
    }
    return '+91';
  });
  const [saved, setSaved] = useState(!!phoneProp);

  function handleSave() {
    const fullPhone = `${countryCode}${phone.trim()}`;
    onVerified?.(fullPhone);
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-lime/10 border border-lime/30">
        <span className="text-xl">📱</span>
        <div>
          <p className="text-sm font-semibold text-white">Phone Number</p>
          <p className="text-xs text-white/50">{countryCode} {phone}</p>
        </div>
        <button
          onClick={() => setSaved(false)}
          className="ml-auto text-xs text-pink/60 hover:text-pink transition-colors"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div>
      <label className="text-sm font-medium font-body text-white/80 block mb-2">Phone Number</label>
      <div className="flex items-center gap-2">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="shrink-0 w-16 px-2 py-3 rounded-lg border-[1.5px] border-white/10 bg-white/5 font-body text-sm text-white input-adore focus:border-pink/50 focus:bg-white/[0.08]"
        >
          <option value="+91" className="bg-[#1A1A2E] text-white">+91</option>
          <option value="+1" className="bg-[#1A1A2E] text-white">+1</option>
          <option value="+44" className="bg-[#1A1A2E] text-white">+44</option>
          <option value="+61" className="bg-[#1A1A2E] text-white">+61</option>
          <option value="+971" className="bg-[#1A1A2E] text-white">+971</option>
        </select>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          placeholder="9876543210"
          maxLength={10}
          className="w-32 px-3 py-3 rounded-lg border-[1.5px] border-white/10 bg-white/5 font-body text-[15px] text-white placeholder:text-white/30 input-adore focus:border-pink/50 focus:bg-white/[0.08]"
        />
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          disabled={phone.length < 10}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
