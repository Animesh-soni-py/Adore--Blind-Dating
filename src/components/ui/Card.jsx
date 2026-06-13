import { cn } from '../../lib/utils';

export default function Card({
  children,
  className = '',
  bgColor,
  hoverable = true,
  padding = 'p-7',
  ...props
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-lavender-light',
        padding,
        hoverable &&
          'transition-all duration-250 ease-out hover:-translate-y-1 hover:shadow-card-hover',
        bgColor || 'bg-card-bg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
