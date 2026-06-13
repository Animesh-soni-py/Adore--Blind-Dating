import { motion } from 'framer-motion';

function PolaroidCard({ x, y, rotation, delay, blurColor = '#C8A8F0' }) {
  return (
    <motion.g
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ transformOrigin: `${x + 25}px ${y + 30}px` }}
    >
      <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
        {/* Card body */}
        <rect width="50" height="60" rx="4" fill="white" stroke="#1A1A2E" strokeWidth="1.5" />
        {/* Photo area (blurred silhouette - represents blind matching) */}
        <rect x="5" y="5" width="40" height="36" rx="2" fill={blurColor} opacity="0.3" />
        {/* Silhouette head */}
        <circle cx="25" cy="18" r="8" fill={blurColor} opacity="0.5" />
        {/* Silhouette shoulders */}
        <path d="M12 36 Q25 28 38 36" fill={blurColor} opacity="0.4" />
        {/* Heart badge */}
        <path
          d="M25 50 C25 50 20 47 20 44.5 C20 43 21.5 42 23 42 C24 42 25 42.5 25 43 C25 42.5 26 42 27 42 C28.5 42 30 43 30 44.5 C30 47 25 50 25 50Z"
          fill="#FF5E8A"
        />
      </g>
    </motion.g>
  );
}

function FloatingHeart({ cx, cy, size = 8, color = '#FF5E8A', delay = 0, duration = 3 }) {
  const s = size;
  return (
    <motion.path
      d={`M${cx} ${cy + s} C${cx} ${cy + s} ${cx - s} ${cy + s * 0.4} ${cx - s} ${cy} C${cx - s} ${cy - s * 0.5} ${cx - s * 0.3} ${cy - s} ${cx} ${cy - s * 0.6} C${cx + s * 0.3} ${cy - s} ${cx + s} ${cy - s * 0.5} ${cx + s} ${cy} C${cx + s} ${cy + s * 0.4} ${cx} ${cy + s} ${cx} ${cy + s}Z`}
      fill={color}
      opacity="0.4"
      animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

function GoldLeaf({ x, y, rotation = 0, scale = 1, delay = 0 }) {
  return (
    <motion.g
      animate={{ y: [0, -8, 0], rotate: [rotation - 5, rotation + 5, rotation - 5] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`}>
        <path
          d="M0 0 C-5 -15 3 -25 15 -20 C20 -18 17 -5 10 2 C7 5 2 5 0 0Z"
          fill="#E8C97A"
          stroke="#1A1A2E"
          strokeWidth="0.8"
          opacity="0.75"
        />
        <line x1="2" y1="-1" x2="13" y2="-18" stroke="#1A1A2E" strokeWidth="0.4" opacity="0.35" />
        <line x1="6" y1="0" x2="15" y2="-12" stroke="#1A1A2E" strokeWidth="0.3" opacity="0.25" />
      </g>
    </motion.g>
  );
}

function CloudPuff({ x, y, scale = 1, delay = 0 }) {
  return (
    <motion.g
      opacity="0.2"
      animate={{ x: [0, 6, 0], y: [0, -4, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        <circle cx="0" cy="0" r="12" fill="#FFB3C6" />
        <circle cx="14" cy="-4" r="16" fill="#FFB3C6" />
        <circle cx="30" cy="0" r="12" fill="#FFB3C6" />
      </g>
    </motion.g>
  );
}

export default function FloatingDecorators({ className = '' }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full absolute inset-0 pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        {/* Polaroid match cards */}
        <PolaroidCard x={30} y={40} rotation={-12} delay={0} blurColor="#C8A8F0" />
        <PolaroidCard x={400} y={60} rotation={8} delay={0.7} blurColor="#FFB3C6" />
        <PolaroidCard x={420} y={280} rotation={-6} delay={1.2} blurColor="#B8F0E4" />

        {/* Floating hearts */}
        <FloatingHeart cx={100} cy={80} size={6} delay={0.3} duration={3.5} />
        <FloatingHeart cx={380} cy={150} size={5} color="#C8A8F0" delay={0.8} duration={4} />
        <FloatingHeart cx={460} cy={50} size={7} delay={1.5} duration={3} />
        <FloatingHeart cx={50} cy={300} size={4} color="#FFB3C6" delay={0.5} duration={3.8} />

        {/* Gold botanical leaves */}
        <GoldLeaf x={60} y={250} rotation={-20} scale={1.2} delay={0} />
        <GoldLeaf x={440} y={200} rotation={15} scale={0.9} delay={0.6} />
        <GoldLeaf x={20} y={150} rotation={-35} scale={0.7} delay={1.2} />

        {/* Cloud puffs */}
        <CloudPuff x={70} y={30} scale={0.8} delay={0} />
        <CloudPuff x={350} y={20} scale={0.6} delay={1} />
      </svg>
    </div>
  );
}
