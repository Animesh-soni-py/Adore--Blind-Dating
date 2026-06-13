import { motion } from 'framer-motion';

export default function TestimonialIllustration({ className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <svg
        viewBox="0 0 360 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Happy couple holding a sign, representing successful matches across all ages"
        role="img"
        className="w-full h-auto"
      >
        {/* Background circle */}
        <circle cx="180" cy="160" r="140" fill="#C8A8F0" opacity="0.1" />

        {/* ─── LEFT PERSON (Older man, rounder face) ─── */}
        <g>
          {/* Body */}
          <path
            d="M100 320 L100 240 C100 225 110 215 125 212 L145 208 C148 207 152 210 152 214 L152 320Z"
            fill="#B8F0E4"
            stroke="#1A1A2E"
            strokeWidth="2"
          />

          {/* Head - rounder */}
          <ellipse cx="127" cy="175" rx="30" ry="33" fill="#FDDCB5" stroke="#1A1A2E" strokeWidth="2" />

          {/* Hair (greying at temples) */}
          <path
            d="M99 170 C99 148 110 138 127 138 C144 138 155 148 155 170"
            fill="#7A7A8A"
            stroke="#1A1A2E"
            strokeWidth="1.5"
          />
          <path d="M99 170 C99 165 103 162 107 165" fill="#7A7A8A" />
          <path d="M155 170 C155 165 151 162 147 165" fill="#7A7A8A" />

          {/* Glasses */}
          <circle cx="118" cy="175" r="9" stroke="#1A1A2E" strokeWidth="1.5" fill="none" />
          <circle cx="138" cy="175" r="9" stroke="#1A1A2E" strokeWidth="1.5" fill="none" />
          <line x1="127" y1="175" x2="129" y2="175" stroke="#1A1A2E" strokeWidth="1.5" />
          <line x1="109" y1="173" x2="100" y2="170" stroke="#1A1A2E" strokeWidth="1" />
          <line x1="147" y1="173" x2="155" y2="170" stroke="#1A1A2E" strokeWidth="1" />

          {/* Eyes behind glasses */}
          <circle cx="118" cy="175" r="2.5" fill="#1A1A2E" />
          <circle cx="138" cy="175" r="2.5" fill="#1A1A2E" />
          <circle cx="119" cy="174" r="0.8" fill="white" />
          <circle cx="139" cy="174" r="0.8" fill="white" />

          {/* Big warm smile */}
          <path d="M116 190 Q127 200 138 190" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Crow's feet (smile lines) */}
          <path d="M108 172 L105 169" stroke="#1A1A2E" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
          <path d="M108 177 L105 180" stroke="#1A1A2E" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
          <path d="M148 172 L151 169" stroke="#1A1A2E" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
          <path d="M148 177 L151 180" stroke="#1A1A2E" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />

          {/* Blush */}
          <circle cx="113" cy="185" r="4" fill="#FF5E8A" opacity="0.2" />
          <circle cx="141" cy="185" r="4" fill="#FF5E8A" opacity="0.2" />

          {/* Thumbs up hand */}
          <g>
            <path
              d="M85 230 C80 225 78 230 80 238 L82 248 C82 252 86 254 90 252 L95 248"
              fill="#FDDCB5"
              stroke="#1A1A2E"
              strokeWidth="1.5"
            />
            {/* Thumb */}
            <path
              d="M82 238 C78 235 76 228 80 225 C83 222 87 226 86 232"
              fill="#FDDCB5"
              stroke="#1A1A2E"
              strokeWidth="1.5"
            />
          </g>
        </g>

        {/* ─── RIGHT PERSON (Older woman, warmer) ─── */}
        <g>
          {/* Body */}
          <path
            d="M208 320 L208 240 C208 225 218 215 235 212 L255 208 C258 207 262 210 262 214 L262 320Z"
            fill="#FFB3C6"
            stroke="#1A1A2E"
            strokeWidth="2"
          />
          {/* Neckline detail */}
          <path d="M215 225 Q235 218 255 225" stroke="#FF5E8A" strokeWidth="1" opacity="0.3" fill="none" />

          {/* Head */}
          <ellipse cx="235" cy="175" rx="28" ry="31" fill="#C68B59" stroke="#1A1A2E" strokeWidth="2" />

          {/* Hair - voluminous curly */}
          <path
            d="M207 168 C205 142 215 132 235 132 C255 132 265 142 263 168"
            fill="#2A1A0A"
            stroke="#1A1A2E"
            strokeWidth="1.5"
          />
          <path d="M207 168 C204 178 202 188 208 195" fill="#2A1A0A" stroke="#1A1A2E" strokeWidth="1" />
          <path d="M263 168 C266 178 268 188 262 195" fill="#2A1A0A" stroke="#1A1A2E" strokeWidth="1" />
          {/* Curly hair detail */}
          <circle cx="210" cy="148" r="5" fill="#2A1A0A" />
          <circle cx="260" cy="148" r="5" fill="#2A1A0A" />
          <circle cx="235" cy="133" r="6" fill="#2A1A0A" />

          {/* Eyes */}
          <ellipse cx="226" cy="175" rx="3" ry="3.5" fill="#1A1A2E" />
          <ellipse cx="244" cy="175" rx="3" ry="3.5" fill="#1A1A2E" />
          <circle cx="227" cy="174" r="1" fill="white" />
          <circle cx="245" cy="174" r="1" fill="white" />

          {/* Eyelashes */}
          <path d="M222 171 L220 168" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />
          <path d="M224 170 L223 167" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />
          <path d="M240 171 L239 168" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />
          <path d="M242 170 L244 167" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />

          {/* Big warm smile */}
          <path d="M224 190 Q235 200 246 190" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Blush */}
          <circle cx="221" cy="184" r="4" fill="#FF5E8A" opacity="0.25" />
          <circle cx="249" cy="184" r="4" fill="#FF5E8A" opacity="0.25" />

          {/* Earrings */}
          <circle cx="207" cy="180" r="3" fill="#E8C97A" stroke="#1A1A2E" strokeWidth="0.5" />
          <circle cx="263" cy="180" r="3" fill="#E8C97A" stroke="#1A1A2E" strokeWidth="0.5" />
        </g>

        {/* ─── YELLOW SIGN they're holding ─── */}
        <motion.g
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '180px 260px' }}
        >
          <rect x="110" y="240" width="140" height="50" rx="8" fill="#FFF3B0" stroke="#1A1A2E" strokeWidth="2" />
          <text x="135" y="262" fill="#1A1A2E" fontSize="11" fontWeight="800" fontFamily="sans-serif">WE MET ON</text>
          <text x="140" y="280" fill="#FF5E8A" fontSize="14" fontWeight="800" fontFamily="sans-serif">ADORE! 💕</text>
        </motion.g>

        {/* Floating hearts around the couple */}
        <motion.path
          d="M70 130 C70 130 63 125 63 120 C63 117 66 115 69 115 C70 115 70 116 70 117 C70 116 71 115 72 115 C75 115 78 117 78 120 C78 125 70 130 70 130Z"
          fill="#FF5E8A"
          opacity="0.4"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M300 110 C300 110 295 106 295 102 C295 100 297 98 299 98 C300 98 300 99 300 100 C300 99 301 98 302 98 C304 98 306 100 306 102 C306 106 300 110 300 110Z"
          fill="#C8A8F0"
          opacity="0.5"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </svg>
    </motion.div>
  );
}
