"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  variant?: 'default' | 'required';
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className = '', variant = 'default', style, ...props }, ref) => {
  const baseStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-xs)',
    fontSize: '0.875rem',
    lineHeight: '1',
    fontWeight: '500',
    color: 'var(--text-primary)',
    userSelect: 'none'
  };

  const variantStyles = {
    default: {},
    required: {
      '::after': {
        content: '"*"',
        color: 'var(--accent-danger)',
        marginLeft: 'var(--spacing-xs)'
      }
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...style
  };

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={className}
      style={combinedStyles}
      {...props}
    />
  )
})

Label.displayName = "Label"

export { Label }