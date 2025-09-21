import * as React from "react"

interface CardProps extends React.ComponentProps<"div"> {
  variant?: 'default' | 'gradient' | 'glass';
}

function Card({ className = '', variant = 'default', ...props }: CardProps) {
  const baseStyles: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-primary)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-lg)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border-primary)',
    padding: 'var(--spacing-lg)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.2s ease'
  };

  const variantStyles = {
    default: {},
    gradient: {
      background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-tertiary) 100%)',
      border: '1px solid var(--border-accent)'
    },
    glass: {
      backgroundColor: 'rgba(22, 22, 22, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles[variant]
  };

  return (
    <div
      className={`card ${className}`}
      style={combinedStyles}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
      {...props}
    />
  )
}

function CardHeader({ className = '', ...props }: React.ComponentProps<"div">) {
  const styles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'start',
    gap: 'var(--spacing-sm)',
    paddingBottom: 'var(--spacing-md)',
    borderBottom: '1px solid var(--border-secondary)'
  };

  return (
    <div
      className={`card-header ${className}`}
      style={styles}
      {...props}
    />
  )
}

function CardTitle({ className = '', ...props }: React.ComponentProps<"div">) {
  const styles: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: '600',
    lineHeight: '1.2',
    color: 'var(--text-primary)'
  };

  return (
    <div
      className={`card-title ${className}`}
      style={styles}
      {...props}
    />
  )
}

function CardDescription({ className = '', ...props }: React.ComponentProps<"div">) {
  const styles: React.CSSProperties = {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  };

  return (
    <div
      className={`card-description ${className}`}
      style={styles}
      {...props}
    />
  )
}

function CardAction({ className = '', ...props }: React.ComponentProps<"div">) {
  const styles: React.CSSProperties = {
    gridColumn: '2',
    gridRow: '1 / -1',
    justifySelf: 'end',
    alignSelf: 'start'
  };

  return (
    <div
      className={`card-action ${className}`}
      style={styles}
      {...props}
    />
  )
}

function CardContent({ className = '', ...props }: React.ComponentProps<"div">) {
  const styles: React.CSSProperties = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)'
  };

  return (
    <div
      className={`card-content ${className}`}
      style={styles}
      {...props}
    />
  )
}

function CardFooter({ className = '', ...props }: React.ComponentProps<"div">) {
  const styles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
    paddingTop: 'var(--spacing-md)',
    borderTop: '1px solid var(--border-secondary)'
  };

  return (
    <div
      className={`card-footer ${className}`}
      style={styles}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}