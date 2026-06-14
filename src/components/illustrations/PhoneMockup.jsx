import { motion } from 'framer-motion';

export default function PhoneMockup({ className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <svg
        viewBox="0 0 280 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Phone showing ADORE app interface with blind profile cards"
        role="img"
        className="w-full h-auto max-w-[280px] mx-auto"
      >
        {/* Phone body with slight 3D perspective */}
        <g style={{ transform: 'perspective(800px) rotateY(-3deg)', transformStyle: 'preserve-3d' }}>
          {/* Phone frame */}
          <rect x="20" y="10" width="240" height="480" rx="36" fill="#1A1A2E" />
          {/* Screen */}
          <rect x="28" y="22" width="224" height="456" rx="28" fill="#FAFAF8" />

          {/* Status bar */}
          <g>
            <text x="48" y="48" fill="#1A1A2E" fontSize="12" fontWeight="600" fontFamily="sans-serif">9:41</text>
            {/* Signal bars */}
            <rect x="195" y="39" width="3" height="6" rx="1" fill="#1A1A2E" opacity="0.4" />
            <rect x="200" y="37" width="3" height="8" rx="1" fill="#1A1A2E" opacity="0.6" />
            <rect x="205" y="35" width="3" height="10" rx="1" fill="#1A1A2E" opacity="0.8" />
            <rect x="210" y="33" width="3" height="12" rx="1" fill="#1A1A2E" />
            {/* Battery */}
            <rect x="220" y="36" width="20" height="10" rx="3" stroke="#1A1A2E" strokeWidth="1.5" fill="none" />
            <rect x="222" y="38" width="14" height="6" rx="1.5" fill="#A8E4B4" />
          </g>

          {/* App header */}
          <text x="85" y="75" fill="#1A1A2E" fontSize="16" fontWeight="800" fontFamily="sans-serif">ADORE</text>
          <text x="135" y="75" fill="#FF5E8A" fontSize="16" fontWeight="600" fontFamily="sans-serif"> ♥</text>

          {/* Profile card 1 (active, front) */}
          <g>
            <rect x="44" y="95" width="192" height="280" rx="20" fill="white" stroke="rgba(200,168,240,0.3)" strokeWidth="1.5" />
            {/* Blind silhouette area */}
            <rect x="54" y="105" width="172" height="160" rx="14" fill="#F5F0FF" />
            {/* Silhouette */}
            <circle cx="140" cy="155" r="35" fill="#C8A8F0" opacity="0.4" />
            <path d="M95 250 Q140 220 185 250" fill="#C8A8F0" opacity="0.3" />
            {/* Question mark overlay */}
            <text x="128" y="175" fill="#C8A8F0" fontSize="40" fontWeight="800" fontFamily="sans-serif" opacity="0.6">?</text>
            {/* Blind badge */}
            <rect x="105" y="230" width="70" height="22" rx="11" fill="#FF5E8A" opacity="0.15" />
            <text x="115" y="245" fill="#FF5E8A" fontSize="9" fontWeight="700" fontFamily="sans-serif">BLIND MODE</text>

            {/* Info below photo */}
            <text x="64" y="290" fill="#1A1A2E" fontSize="18" fontWeight="700" fontFamily="sans-serif">Anonymous, 27</text>
            <text x="64" y="308" fill="#1A1A2E" fontSize="11" fontFamily="sans-serif" opacity="0.5">Jabalpur · 92% Compatible</text>

            {/* Interest tags */}
            <rect x="64" y="320" width="50" height="20" rx="10" fill="#B8F0E4" opacity="0.5" />
            <text x="73" y="334" fill="#1A1A2E" fontSize="9" fontWeight="500" fontFamily="sans-serif">Travel</text>
            <rect x="120" y="320" width="55" height="20" rx="10" fill="#FFF3B0" opacity="0.6" />
            <text x="129" y="334" fill="#1A1A2E" fontSize="9" fontWeight="500" fontFamily="sans-serif">Movies</text>
            <rect x="181" y="320" width="44" height="20" rx="10" fill="#FFB3C6" opacity="0.4" />
            <text x="189" y="334" fill="#1A1A2E" fontSize="9" fontWeight="500" fontFamily="sans-serif">Dogs</text>

            {/* Compatibility bar */}
            <rect x="64" y="350" width="152" height="6" rx="3" fill="#F5F0FF" />
            <rect x="64" y="350" width="140" height="6" rx="3" fill="url(#compatGrad)" />
          </g>

          {/* Action buttons at bottom */}
          <g>
            {/* Skip button */}
            <circle cx="95" cy="410" r="24" fill="white" stroke="rgba(200,168,240,0.3)" strokeWidth="1.5" />
            <path d="M88 403L102 417M102 403L88 417" stroke="#C8A8F0" strokeWidth="2.5" strokeLinecap="round" />

            {/* Heart/like button */}
            <circle cx="185" cy="410" r="28" fill="#FF5E8A" />
            <path
              d="M185 420 C185 420 175 414 175 408 C175 405 177 403 180 403 C182 403 184 404 185 406 C186 404 188 403 190 403 C193 403 195 405 195 408 C195 414 185 420 185 420Z"
              fill="white"
            />

            {/* Chat button */}
            <circle cx="140" cy="415" r="22" fill="white" stroke="rgba(200,168,240,0.3)" strokeWidth="1.5" />
            <path d="M132 411 L148 411 M132 417 L144 417" stroke="#FF5E8A" strokeWidth="2" strokeLinecap="round" />
            <path d="M130 405 L130 422 Q130 425 133 425 L147 425 Q150 425 150 422 L150 405 Q150 402 147 402 L133 402 Q130 402 130 405Z" stroke="#FF5E8A" strokeWidth="1.5" fill="none" />
          </g>

          {/* Bottom nav indicator */}
          <rect x="110" y="462" width="60" height="4" rx="2" fill="#1A1A2E" opacity="0.2" />

          {/* Notch */}
          <rect x="100" y="12" width="80" height="24" rx="12" fill="#1A1A2E" />
        </g>

        {/* Hand holding phone */}
        <g opacity="0.15">
          <path
            d="M10 400 C5 380 15 360 25 370 L25 460 C25 475 10 475 10 460Z"
            fill="#FDDCB5"
            stroke="#1A1A2E"
            strokeWidth="1"
          />
          <path
            d="M260 370 C270 360 275 380 270 400 L270 460 C270 475 260 475 260 460Z"
            fill="#FDDCB5"
            stroke="#1A1A2E"
            strokeWidth="1"
          />
        </g>

        <defs>
          <linearGradient id="compatGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF5E8A" />
            <stop offset="100%" stopColor="#C8A8F0" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
