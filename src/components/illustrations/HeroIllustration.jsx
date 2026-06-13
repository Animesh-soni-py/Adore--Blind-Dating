import { motion } from 'framer-motion';

export default function HeroIllustration({ className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <svg
        viewBox="0 0 500 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Two people connecting over a heart symbol, representing blind dating"
        role="img"
        className="w-full h-auto"
      >
        {/* Background blob */}
        <ellipse cx="250" cy="220" rx="200" ry="170" fill="#FFB3C6" opacity="0.25" />

        {/* Ambient glow */}
        <circle cx="250" cy="200" r="120" fill="url(#heroGlow)" opacity="0.3" />

        {/* Center Heart - outer */}
        <path
          d="M250 320 C250 320 140 240 140 180 C140 148 166 120 200 120 C220 120 238 132 250 148 C262 132 280 120 300 120 C334 120 360 148 360 180 C360 240 250 320 250 320Z"
          stroke="#FF5E8A"
          strokeWidth="3"
          fill="none"
          opacity="0.4"
        />

        {/* Center Heart - inner */}
        <motion.path
          d="M250 290 C250 290 175 230 175 190 C175 166 194 148 218 148 C234 148 247 157 250 168 C253 157 266 148 282 148 C306 148 325 166 325 190 C325 230 250 290 250 290Z"
          fill="#FF5E8A"
          opacity="0.85"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.3, duration: 0.6, ease: 'backOut' }}
          style={{ transformOrigin: '250px 220px' }}
        />

        {/* ─── LEFT CHARACTER (Dark skin, lime green hoodie) ─── */}
        <g>
          {/* Body / Hoodie */}
          <path
            d="M120 350 L120 270 C120 250 130 240 150 235 L175 228 C180 227 185 230 185 235 L185 350Z"
            fill="#A8E4B4"
            stroke="#1A1A2E"
            strokeWidth="2"
          />
          {/* Hood drawstrings */}
          <line x1="140" y1="255" x2="140" y2="275" stroke="#1A1A2E" strokeWidth="1.5" opacity="0.3" />
          <line x1="165" y1="252" x2="165" y2="272" stroke="#1A1A2E" strokeWidth="1.5" opacity="0.3" />

          {/* Head */}
          <ellipse cx="152" cy="195" rx="32" ry="36" fill="#8B6B4A" stroke="#1A1A2E" strokeWidth="2" />

          {/* Hair */}
          <path
            d="M122 185 C122 162 135 152 152 152 C169 152 182 162 182 185"
            fill="#2A1A0A"
            stroke="#1A1A2E"
            strokeWidth="1.5"
          />
          <path d="M122 185 C122 178 128 172 135 175" fill="#2A1A0A" />
          <path d="M182 185 C182 178 176 172 169 175" fill="#2A1A0A" />

          {/* Eyes */}
          <ellipse cx="142" cy="195" rx="3.5" ry="4" fill="#1A1A2E" />
          <ellipse cx="162" cy="195" rx="3.5" ry="4" fill="#1A1A2E" />
          <circle cx="143.5" cy="193.5" r="1.2" fill="white" />
          <circle cx="163.5" cy="193.5" r="1.2" fill="white" />

          {/* Eyebrows */}
          <path d="M137 188 Q142 185 147 188" stroke="#1A1A2E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M157 188 Q162 185 167 188" stroke="#1A1A2E" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Warm smile */}
          <path d="M143 207 Q152 215 161 207" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Hand on cheek (right hand on right cheek) */}
          <path
            d="M180 200 C188 195 192 200 190 210 C188 215 182 218 178 215"
            fill="#8B6B4A"
            stroke="#1A1A2E"
            strokeWidth="1.5"
          />
          {/* Arm */}
          <path
            d="M185 245 C192 235 192 215 190 205"
            stroke="#1A1A2E"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Blush spots */}
          <circle cx="138" cy="204" r="4" fill="#FF5E8A" opacity="0.25" />
          <circle cx="166" cy="204" r="4" fill="#FF5E8A" opacity="0.25" />
        </g>

        {/* ─── RIGHT CHARACTER (Light skin, pink dress, phone) ─── */}
        <g>
          {/* Body / Dress */}
          <path
            d="M315 350 L315 260 C315 245 325 238 340 234 L355 230 C360 229 365 232 365 237 L365 260 L380 350Z"
            fill="#FFB3C6"
            stroke="#1A1A2E"
            strokeWidth="2"
          />
          {/* Dress detail line */}
          <path d="M325 280 Q348 275 370 280" stroke="#FF5E8A" strokeWidth="1" opacity="0.4" fill="none" />

          {/* Head */}
          <ellipse cx="348" cy="195" rx="30" ry="34" fill="#FDDCB5" stroke="#1A1A2E" strokeWidth="2" />

          {/* Hair */}
          <path
            d="M318 188 C318 158 330 148 348 148 C366 148 378 158 378 188"
            fill="#5C3A1E"
            stroke="#1A1A2E"
            strokeWidth="1.5"
          />
          <path d="M318 188 C316 200 314 210 318 215" fill="#5C3A1E" stroke="#1A1A2E" strokeWidth="1" />
          <path d="M378 188 C380 200 382 210 378 215" fill="#5C3A1E" stroke="#1A1A2E" strokeWidth="1" />

          {/* Eyes */}
          <ellipse cx="339" cy="195" rx="3.5" ry="4" fill="#1A1A2E" />
          <ellipse cx="357" cy="195" rx="3.5" ry="4" fill="#1A1A2E" />
          <circle cx="340.5" cy="193.5" r="1.2" fill="white" />
          <circle cx="358.5" cy="193.5" r="1.2" fill="white" />

          {/* Eyelashes */}
          <path d="M335 190 L333 187" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />
          <path d="M353 190 L351 187" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />

          {/* Eyebrows */}
          <path d="M334 187 Q339 184 344 187" stroke="#5C3A1E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M352 187 Q357 184 362 187" stroke="#5C3A1E" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Warm smile */}
          <path d="M340 207 Q348 214 356 207" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Blush spots */}
          <circle cx="334" cy="203" r="4" fill="#FF5E8A" opacity="0.3" />
          <circle cx="362" cy="203" r="4" fill="#FF5E8A" opacity="0.3" />

          {/* Phone in hand */}
          <g>
            {/* Hand */}
            <path
              d="M305 235 C298 230 295 238 298 245 L305 255"
              fill="#FDDCB5"
              stroke="#1A1A2E"
              strokeWidth="1.5"
            />
            {/* Phone body */}
            <rect x="290" y="242" width="22" height="38" rx="4" fill="#1A1A2E" stroke="#1A1A2E" strokeWidth="1" />
            {/* Phone screen */}
            <rect x="293" y="247" width="16" height="28" rx="2" fill="#C8A8F0" opacity="0.6" />
            {/* Screen heart */}
            <path
              d="M301 256 C301 256 296 253 296 250 C296 248 298 247 300 247 C301 247 301 248 301 249 C301 248 302 247 303 247 C305 247 307 248 307 250 C307 253 301 256 301 256Z"
              fill="#FF5E8A"
            />
          </g>
        </g>

        {/* ─── DECORATIVE ELEMENTS ─── */}

        {/* Small floating hearts */}
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M95 140 C95 140 88 135 88 130 C88 127 91 125 94 125 C95 125 95 126 95 127 C95 126 96 125 97 125 C100 125 103 127 103 130 C103 135 95 140 95 140Z" fill="#FF5E8A" opacity="0.6" />
        </motion.g>

        <motion.g
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <path d="M400 120 C400 120 393 115 393 110 C393 107 396 105 399 105 C400 105 400 106 400 107 C400 106 401 105 402 105 C405 105 408 107 408 110 C408 115 400 120 400 120Z" fill="#C8A8F0" opacity="0.5" />
        </motion.g>

        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <path d="M220 100 C220 100 215 96 215 92 C215 90 217 88 219 88 C220 88 220 89 220 90 C220 89 221 88 222 88 C224 88 226 90 226 92 C226 96 220 100 220 100Z" fill="#FF5E8A" opacity="0.35" />
        </motion.g>

        {/* Gold botanical leaf left */}
        <motion.g
          animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '70px 280px' }}
        >
          <path
            d="M65 270 C60 255 68 240 80 245 C85 247 82 260 75 268 C72 272 67 273 65 270Z"
            fill="#E8C97A"
            stroke="#1A1A2E"
            strokeWidth="1"
            opacity="0.7"
          />
          <line x1="68" y1="268" x2="78" y2="248" stroke="#1A1A2E" strokeWidth="0.5" opacity="0.4" />
        </motion.g>

        {/* Gold botanical leaf right */}
        <motion.g
          animate={{ y: [0, -6, 0], rotate: [3, -3, 3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          style={{ transformOrigin: '430px 260px' }}
        >
          <path
            d="M435 255 C440 240 432 225 420 230 C415 232 418 245 425 253 C428 257 433 258 435 255Z"
            fill="#E8C97A"
            stroke="#1A1A2E"
            strokeWidth="1"
            opacity="0.7"
          />
          <line x1="432" y1="253" x2="422" y2="233" stroke="#1A1A2E" strokeWidth="0.5" opacity="0.4" />
        </motion.g>

        {/* Cloud puffs */}
        <motion.g
          opacity="0.2"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="80" cy="120" r="14" fill="#FFB3C6" />
          <circle cx="95" cy="115" r="18" fill="#FFB3C6" />
          <circle cx="112" cy="120" r="14" fill="#FFB3C6" />
        </motion.g>

        <motion.g
          opacity="0.15"
          animate={{ x: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <circle cx="380" cy="90" r="12" fill="#FFB3C6" />
          <circle cx="393" cy="85" r="16" fill="#FFB3C6" />
          <circle cx="408" cy="90" r="12" fill="#FFB3C6" />
        </motion.g>

        {/* Gradient definitions */}
        <defs>
          <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5E8A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF5E8A" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
