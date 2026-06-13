import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(function Input(
  {
    label,
    error,
    id,
    type = 'text',
    className = '',
    containerClassName = '',
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('flex flex-col gap-2', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[15px] md:text-[16px] font-semibold font-body text-white/80 tracking-normal"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={cn(
          'w-full px-4 py-4 rounded-lg border-[1.5px] font-body text-base text-white',
          'border-white/10 bg-white/5',
          'transition-all duration-200 ease-out',
          'placeholder:text-white/30 focus:border-pink/50 focus:bg-white/[0.08]',
          'input-adore',
          error && 'border-pink',
          className
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-xs text-pink font-medium mt-0.5"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
