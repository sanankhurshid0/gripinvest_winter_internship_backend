import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  asChild?: boolean;
}

function Badge({
  className = '',
  variant = 'default',
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    padding: '2px 8px',
    fontSize: '0.75rem',
    fontWeight: '500',
    width: 'fit-content',
    whiteSpace: 'nowrap',
    gap: '4px',
    transition: 'all 0.2s ease'
  };

  const variantStyles = {
    default: {
      backgroundColor: 'var(--accent-primary)',
      color: 'var(--text-primary)',
      borderColor: 'transparent'
    },
    secondary: {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-secondary)',
      borderColor: 'var(--border-primary)'
    },
    destructive: {
      backgroundColor: 'var(--accent-danger)',
      color: 'var(--text-primary)',
      borderColor: 'transparent'
    },
    success: {
      backgroundColor: 'var(--accent-secondary)',
      color: 'var(--text-primary)',
      borderColor: 'transparent'
    },
    warning: {
      backgroundColor: 'var(--accent-warning)',
      color: 'var(--bg-primary)',
      borderColor: 'transparent'
    },
    info: {
      backgroundColor: 'var(--accent-purple)',
      color: 'var(--text-primary)',
      borderColor: 'transparent'
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
      borderColor: 'var(--border-primary)'
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles[variant]
  };

  return (
    <Comp
      className={`badge ${className}`}
      style={combinedStyles}
      {...props}
    />
  )
}

export { Badge }