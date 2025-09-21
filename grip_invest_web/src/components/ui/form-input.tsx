import * as React from "react"
import { Input } from "./input"
import { Label } from "./label"

interface FormInputProps extends React.ComponentProps<"input"> {
    label?: string
    error?: string
    helperText?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ className = '', label, error, helperText, id, style, ...props }, ref) => {
        const inputId = id || React.useId()

        const containerStyles: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-xs)'
        };

        const errorInputStyles: React.CSSProperties = error ? {
            borderColor: 'var(--accent-danger)',
            boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
        } : {};

        return (
            <div style={containerStyles}>
                {label && (
                    <Label htmlFor={inputId} style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'var(--text-primary)'
                    }}>
                        {label}
                    </Label>
                )}
                <Input
                    id={inputId}
                    className={className}
                    style={{
                        ...errorInputStyles,
                        ...style
                    }}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--accent-danger)'
                    }}>
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)'
                    }}>
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

FormInput.displayName = "FormInput"

export { FormInput }