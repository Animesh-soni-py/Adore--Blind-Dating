import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const variants = {
  primary:
    'bg-pink text-white shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-pink-hover active:shadow-neo-active active:translate-x-[4px] active:translate-y-[4px]',
  secondary:
    'bg-white text-dark border-2 border-dark shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-neo-active active:translate-x-[4px] active:translate-y-[4px]',
  ghost:
    'bg-transparent text-current border border-current/30 hover:border-current/60 hover:bg-white/10',
  danger:
    'bg-coral text-white shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-neo-active active:translate-x-[4px] active:translate-y-[4px]',
};

const sizes = {
  sm: 'px-4 py-2 text-xs font-semibold rounded-md',
  md: 'px-6 py-3 text-sm font-bold rounded-lg',
  lg: 'px-8 py-4 text-base font-bold rounded-xl',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    type = 'button',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-display transition-all duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;
