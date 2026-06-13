import { cn } from '../../lib/utils';

export default function Skeleton({ className = '', width, height, rounded = 'rounded-lg' }) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-card-bg via-lavender/10 to-card-bg bg-[length:200%_100%] animate-shimmer',
        rounded,
        className
      )}
      style={{
        width: width || '100%',
        height: height || '20px',
      }}
      aria-hidden="true"
    />
  );
}
