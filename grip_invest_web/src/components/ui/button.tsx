import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--spacing-sm)',
      whiteSpace: 'nowrap',
      borderRadius: 'var(--radius-md)',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      textDecoration: 'none'
    };

    const sizeStyles = {
      default: {
        height: '36px',
        padding: '0 var(--spacing-md)'
      },
      sm: {
        height: '32px',
        padding: '0 var(--spacing-sm)',
        fontSize: '0.75rem'
      },
      lg: {
        height: '44px',
        padding: '0 var(--spacing-lg)',
        fontSize: '1rem'
      },
      icon: {
        width: '36px',
        height: '36px',
        padding: '0'
      }
    };

    const variantStyles = {
      default: {
        backgroundColor: 'var(--accent-primary)',
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-sm)'
      },
      destructive: {
        backgroundColor: 'var(--accent-danger)',
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-sm)'
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-sm)'
      },
      secondary: {
        backgroundColor: 'var(--bg-tertiary)',
        color: 'var(--text-secondary)',
        boxShadow: 'var(--shadow-sm)'
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)'
      },
      link: {
        backgroundColor: 'transparent',
        color: 'var(--accent-primary)',
        textDecoration: 'underline'
      }
    };

    const combinedStyles = {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant]
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) return;

      const target = e.currentTarget;
      switch (variant) {
        case 'default':
          target.style.backgroundColor = 'var(--accent-primary-hover)';
          target.style.transform = 'translateY(-1px)';
          break;
        case 'destructive':
          target.style.backgroundColor = '#dc2626';
          target.style.transform = 'translateY(-1px)';
          break;
        case 'outline':
          target.style.backgroundColor = 'var(--bg-hover)';
          target.style.borderColor = 'var(--accent-primary)';
          break;
        case 'secondary':
          target.style.backgroundColor = 'var(--bg-hover)';
          break;
        case 'ghost':
          target.style.backgroundColor = 'var(--bg-hover)';
          break;
        case 'link':
          target.style.color = 'var(--accent-primary-hover)';
          break;
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) return;

      const target = e.currentTarget;
      Object.assign(target.style, combinedStyles);
    };

    const disabledStyles = props.disabled ? {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none' as const
    } : {};

    return (
      <Comp
        ref={ref}
        className={className}
        style={{
          ...combinedStyles,
          ...disabledStyles
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }