import { cn } from '../../lib/utils';

export default function Badge({ children, variant = 'pink', className = '', ...props }) {
  const variants = {
    pink: 'bg-pink/10 text-pink',
    lavender: 'bg-lavender/20 text-dark-purple',
    mint: 'bg-mint/30 text-dark',
    yellow: 'bg-yellow/40 text-dark',
    white: 'bg-white/20 text-white border border-white/30',
    dark: 'bg-dark/10 text-dark',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
        'font-display text-[11px] font-bold tracking-[2px] uppercase',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
