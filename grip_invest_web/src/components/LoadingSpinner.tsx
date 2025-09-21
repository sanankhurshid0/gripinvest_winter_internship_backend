import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
    className?: string;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    variant = 'spinner',
    className = '',
    color = 'primary'
}) => {
    const sizeClasses = {
        sm: '16px',
        md: '32px',
        lg: '48px',
        xl: '64px'
    };

    const colorClasses = {
        primary: 'var(--accent-primary)',
        secondary: 'var(--text-secondary)',
        success: 'var(--accent-secondary)',
        warning: 'var(--accent-warning)',
        danger: 'var(--accent-danger)'
    };

    const spinnerSize = sizeClasses[size];
    const spinnerColor = colorClasses[color];

    if (variant === 'spinner') {
        return (
            <div
                className={`loading-spinner ${className}`}
                style={{
                    width: spinnerSize,
                    height: spinnerSize,
                    border: `3px solid ${spinnerColor}20`,
                    borderTop: `3px solid ${spinnerColor}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}
            />
        );
    }

    if (variant === 'dots') {
        const dotSize = parseInt(spinnerSize) / 4;
        return (
            <div className={`loading-dots ${className}`} style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: `${dotSize}px`,
                            height: `${dotSize}px`,
                            backgroundColor: spinnerColor,
                            borderRadius: '50%',
                            animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`
                        }}
                    />
                ))}
            </div>
        );
    }

    if (variant === 'pulse') {
        return (
            <div
                className={`loading-pulse ${className}`}
                style={{
                    width: spinnerSize,
                    height: spinnerSize,
                    backgroundColor: spinnerColor,
                    borderRadius: '50%',
                    animation: 'pulse 1.5s ease-in-out infinite'
                }}
            />
        );
    }

    if (variant === 'bars') {
        const barWidth = parseInt(spinnerSize) / 6;
        const barHeight = parseInt(spinnerSize);
        return (
            <div className={`loading-bars ${className}`} style={{ display: 'flex', gap: '2px', alignItems: 'end' }}>
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: `${barWidth}px`,
                            height: `${barHeight * 0.6}px`,
                            backgroundColor: spinnerColor,
                            borderRadius: '2px',
                            animation: `bounce 1.2s ease-in-out ${i * 0.1}s infinite`,
                            transformOrigin: 'bottom'
                        }}
                    />
                ))}
            </div>
        );
    }

    return null;
};

export default LoadingSpinner;