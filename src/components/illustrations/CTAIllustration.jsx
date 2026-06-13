import { motion } from 'framer-motion';

export default function CTAIllustration({ className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      <svg
        viewBox="0 0 400 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Whimsical illustration of a woman fishing with a heart rod, catching a man from a phone screen"
        role="img"
        className="w-full h-auto"
      >
        {/* Coral tropical leaves background */}
        <motion.g
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '350px 100px' }}
        >
          <path
            d="M340 60 C360 40 380 50 375 75 C372 90 355 100 340 95 C330 92 325 75 340 60Z"
            fill="#FF6B6B"
            opacity="0.5"
            stroke="#1A1A2E"
            strokeWidth="1"
          />
          <line x1="342" y1="63" x2="365" y2="85" stroke="#1A1A2E" strokeWidth="0.5" opacity="0.3" />
        </motion.g>
        <motion.g
          animate={{ rotate: [2, -2, 2] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{ transformOrigin: '50px 80px' }}
        >
          <path
            d="M55 50 C35 35 20 50 30 72 C35 82 52 88 60 80 C66 74 68 60 55 50Z"
            fill="#FF6B6B"
            opacity="0.4"
            stroke="#1A1A2E"
            strokeWidth="1"
          />
          <line x1="52" y1="53" x2="35" y2="72" stroke="#1A1A2E" strokeWidth="0.5" opacity="0.3" />
        </motion.g>
        <motion.g
          animate={{ rotate: [-1, 3, -1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ transformOrigin: '370px 270px' }}
        >
          <path
            d="M365 250 C385 235 395 250 388 270 C383 280 368 285 360 278 C354 272 355 258 365 250Z"
            fill="#FF6B6B"
            opacity="0.35"
            stroke="#1A1A2E"
            strokeWidth="1"
          />
        </motion.g>

        {/* Large leaf behind */}
        <path
          d="M30 320 C10 280 25 240 50 250 C60 254 55 280 42 305 C38 315 32 320 30 320Z"
          fill="#E8C97A"
          opacity="0.5"
          stroke="#1A1A2E"
          strokeWidth="1"
        />

        {/* ─── PHONE SCREEN (where man floats) ─── */}
        <g>
          <rect x="140" y="200" width="120" height="170" rx="20" fill="white" stroke="#1A1A2E" strokeWidth="2" />
          <rect x="150" y="215" width="100" height="140" rx="12" fill="#F5F0FF" />

          {/* Man floating inside phone */}
          <motion.g
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Body */}
            <path
              d="M185 340 L185 305 C185 295 192 290 200 288 L200 288 C208 290 215 295 215 305 L215 340"
              fill="#B8F0E4"
              stroke="#1A1A2E"
              strokeWidth="1.5"
            />
            {/* Head */}
            <circle cx="200" cy="272" r="18" fill="#8B6B4A" stroke="#1A1A2E" strokeWidth="1.5" />
            {/* Hair */}
            <path d="M183 268 C183 255 190 250 200 250 C210 250 217 255 217 268" fill="#2A1A0A" stroke="#1A1A2E" strokeWidth="1" />
            {/* Eyes */}
            <circle cx="194" cy="272" r="2" fill="#1A1A2E" />
            <circle cx="206" cy="272" r="2" fill="#1A1A2E" />
            {/* Smile */}
            <path d="M195 280 Q200 285 205 280" stroke="#1A1A2E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Blush */}
            <circle cx="191" cy="278" r="3" fill="#FF5E8A" opacity="0.25" />
            <circle cx="209" cy="278" r="3" fill="#FF5E8A" opacity="0.25" />
            {/* Arms reaching up */}
            <path d="M185 300 L175 280" stroke="#8B6B4A" strokeWidth="3" strokeLinecap="round" />
            <path d="M215 300 L225 280" stroke="#8B6B4A" strokeWidth="3" strokeLinecap="round" />
            {/* Hands */}
            <circle cx="175" cy="278" r="4" fill="#8B6B4A" stroke="#1A1A2E" strokeWidth="1" />
            <circle cx="225" cy="278" r="4" fill="#8B6B4A" stroke="#1A1A2E" strokeWidth="1" />
          </motion.g>
        </g>

        {/* ─── WOMAN FISHING (top, holding rod) ─── */}
        <g>
          {/* Body / Dress */}
          <path
            d="M80 200 L80 140 C80 128 88 122 100 118 L115 114 C118 113 122 116 122 120 L122 200Z"
            fill="#FFB3C6"
            stroke="#1A1A2E"
            strokeWidth="2"
          />

          {/* Head */}
          <ellipse cx="100" cy="82" rx="24" ry="27" fill="#FDDCB5" stroke="#1A1A2E" strokeWidth="2" />

          {/* Hair - flowing */}
          <path
            d="M77 76 C77 55 86 48 100 48 C114 48 123 55 123 76"
            fill="#5C3A1E"
            stroke="#1A1A2E"
            strokeWidth="1.5"
          />
          <path d="M77 76 C75 88 73 100 78 108" fill="#5C3A1E" stroke="#1A1A2E" strokeWidth="1" />
          <path d="M123 76 C125 88 127 100 122 108" fill="#5C3A1E" stroke="#1A1A2E" strokeWidth="1" />

          {/* Eyes */}
          <ellipse cx="92" cy="82" rx="2.5" ry="3" fill="#1A1A2E" />
          <ellipse cx="108" cy="82" rx="2.5" ry="3" fill="#1A1A2E" />
          <circle cx="93" cy="81" r="0.8" fill="white" />
          <circle cx="109" cy="81" r="0.8" fill="white" />

          {/* Eyelashes */}
          <path d="M89 78 L87 75" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />
          <path d="M105 78 L103 75" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />

          {/* Cheerful smile */}
          <path d="M93 93 Q100 100 107 93" stroke="#1A1A2E" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Blush */}
          <circle cx="88" cy="90" r="3.5" fill="#FF5E8A" opacity="0.3" />
          <circle cx="112" cy="90" r="3.5" fill="#FF5E8A" opacity="0.3" />

          {/* Arm holding fishing rod */}
          <path
            d="M122 130 L145 105 L200 60"
            stroke="#1A1A2E"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Hand */}
          <circle cx="145" cy="105" r="5" fill="#FDDCB5" stroke="#1A1A2E" strokeWidth="1.5" />
        </g>

        {/* ─── FISHING ROD ─── */}
        <g>
          {/* Rod */}
          <line x1="145" y1="105" x2="280" y2="40" stroke="#E8C97A" strokeWidth="3" strokeLinecap="round" />
          <line x1="278" y1="38" x2="282" y2="42" stroke="#E8C97A" strokeWidth="2" />

          {/* Fishing line */}
          <path
            d="M280 40 Q290 120 200 230"
            stroke="#1A1A2E"
            strokeWidth="1"
            strokeDasharray="4 3"
            fill="none"
            opacity="0.5"
          />

          {/* Heart-shaped hook at end of line */}
          <motion.g
            animate={{ y: [0, -4, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '200px 230px' }}
          >
            <path
              d="M200 248 C200 248 188 240 188 232 C188 227 192 224 196 224 C198 224 200 225 200 227 C200 225 202 224 204 224 C208 224 212 227 212 232 C212 240 200 248 200 248Z"
              fill="#FF5E8A"
              stroke="#1A1A2E"
              strokeWidth="1.5"
            />
          </motion.g>
        </g>

        {/* ─── Small decorative elements ─── */}
        {/* Sparkles */}
        <motion.g
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '300px 140px' }}
        >
          <path d="M300 135 L300 145 M295 140 L305 140" stroke="#E8C97A" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
        <motion.g
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          style={{ transformOrigin: '60px 170px' }}
        >
          <path d="M60 165 L60 175 M55 170 L65 170" stroke="#FF5E8A" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>

        {/* Tiny hearts */}
        <motion.path
          d="M320 180 C320 180 316 177 316 174 C316 172 318 171 319 171 C320 171 320 172 320 172 C320 172 321 171 322 171 C323 171 325 172 325 174 C325 177 320 180 320 180Z"
          fill="#FF5E8A"
          opacity="0.5"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </motion.div>
  );
}
