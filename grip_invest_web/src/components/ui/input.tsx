import * as React from "react"

interface InputProps extends React.ComponentProps<"input"> {
  variant?: 'default' | 'filled';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', variant = 'default', type, style, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      display: 'flex',
      height: '36px',
      width: '100%',
      minWidth: '0',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-primary)',
      backgroundColor: variant === 'filled' ? 'var(--bg-tertiary)' : 'transparent',
      padding: '0 var(--spacing-sm)',
      fontSize: '0.875rem',
      color: 'var(--text-primary)',
      transition: 'all 0.2s ease',
      outline: 'none'
    };

    const combinedStyles = {
      ...baseStyles,
      ...style
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = 'var(--accent-primary)';
      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = 'var(--border-primary)';
      e.target.style.boxShadow = 'none';
      props.onBlur?.(e);
    };

    const disabledStyles = props.disabled ? {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none' as const
    } : {};

    return (
      <input
        type={type}
        ref={ref}
        className={className}
        style={{
          ...combinedStyles,
          ...disabledStyles
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }