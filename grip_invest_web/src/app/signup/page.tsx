'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import { SignupFormData } from '@/types';
import { User, Mail, Lock, Target } from 'lucide-react';
import { MdTrendingUp } from 'react-icons/md';

export default function SignupPage() {
    const { signup, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignupFormData>();

    const password = watch('password');

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        try {
            const success = await signup({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
                risk_appetite: data.risk_appetite,
            });
            if (success) {
                router.push('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated) {
        return null; // Will redirect to dashboard
    }

    const selectStyles: React.CSSProperties = {
        width: '100%',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'all 0.2s ease',
        height: '44px'
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary px-sm py-lg">
            <div className="w-full" style={{
                maxWidth: '500px',
                padding: '0 var(--spacing-sm)'
            }}>
                {/* Header */}
                <div className="text-center mb-xl animate-fadeIn">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-sm mb-lg"
                        style={{ textDecoration: 'none' }}
                    >
                        <MdTrendingUp size={40} color="var(--accent-primary)" />
                        <span className="text-2xl font-bold text-primary">Grip Invest</span>
                    </Link>
                    <h2 className="font-bold text-primary mb-sm" style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)'
                    }}>
                        Create your account
                    </h2>
                    <p className="text-sm text-secondary">
                        Start your investment journey with Grip Invest
                    </p>
                </div>

                {/* Signup Form */}
                <Card className="animate-slideInUp" variant="glass">
                    <CardHeader>
                        <CardTitle style={{ fontSize: '1.25rem' }}>Sign Up</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg">
                            {/* Name Fields */}
                            <div className="grid grid-cols-1 grid-cols-2-sm gap-md">
                                <div style={{ position: 'relative' }}>
                                    <User
                                        size={20}
                                        color="var(--text-muted)"
                                        style={{
                                            position: 'absolute',
                                            left: 'var(--spacing-sm)',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'none',
                                            zIndex: 1
                                        }}
                                    />
                                    <FormInput
                                        label="First Name"
                                        type="text"
                                        placeholder="First name"
                                        style={{
                                            paddingLeft: '2.5rem',
                                            height: '44px',
                                            fontSize: '16px'
                                        }}
                                        error={errors.first_name?.message}
                                        {...register('first_name', {
                                            required: 'First name is required',
                                            minLength: {
                                                value: 2,
                                                message: 'First name must be at least 2 characters',
                                            },
                                        })}
                                    />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <User
                                        size={20}
                                        color="var(--text-muted)"
                                        style={{
                                            position: 'absolute',
                                            left: 'var(--spacing-sm)',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'none',
                                            zIndex: 1
                                        }}
                                    />
                                    <FormInput
                                        label="Last Name"
                                        type="text"
                                        placeholder="Last name"
                                        style={{
                                            paddingLeft: '2.5rem',
                                            height: '44px',
                                            fontSize: '16px'
                                        }}
                                        {...register('last_name')}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div style={{ position: 'relative' }}>
                                <Mail
                                    size={20}
                                    color="var(--text-muted)"
                                    style={{
                                        position: 'absolute',
                                        left: 'var(--spacing-sm)',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        pointerEvents: 'none',
                                        zIndex: 1
                                    }}
                                />
                                <FormInput
                                    label="Email Address"
                                    type="email"
                                    placeholder="Enter your email"
                                    style={{
                                        paddingLeft: '2.5rem',
                                        height: '44px',
                                        fontSize: '16px'
                                    }}
                                    error={errors.email?.message}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Please enter a valid email address',
                                        },
                                    })}
                                />
                            </div>

                            {/* Password */}
                            <div style={{ position: 'relative' }}>
                                <Lock
                                    size={20}
                                    color="var(--text-muted)"
                                    style={{
                                        position: 'absolute',
                                        left: 'var(--spacing-sm)',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        pointerEvents: 'none',
                                        zIndex: 1
                                    }}
                                />
                                <FormInput
                                    label="Password"
                                    type="password"
                                    placeholder="Create a password"
                                    style={{
                                        paddingLeft: '2.5rem',
                                        height: '44px',
                                        fontSize: '16px'
                                    }}
                                    error={errors.password?.message}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters',
                                        },
                                    })}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div style={{ position: 'relative' }}>
                                <Lock
                                    size={20}
                                    color="var(--text-muted)"
                                    style={{
                                        position: 'absolute',
                                        left: 'var(--spacing-sm)',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        pointerEvents: 'none',
                                        zIndex: 1
                                    }}
                                />
                                <FormInput
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="Confirm your password"
                                    style={{
                                        paddingLeft: '2.5rem',
                                        height: '44px',
                                        fontSize: '16px'
                                    }}
                                    error={errors.confirmPassword?.message}
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (value) =>
                                            value === password || 'Passwords do not match',
                                    })}
                                />
                            </div>

                            {/* Risk Appetite */}
                            <div className="flex flex-col gap-xs">
                                <div className="flex items-center gap-sm">
                                    <Target size={20} color="var(--accent-primary)" />
                                    <label className="text-sm font-medium text-primary">
                                        Risk Appetite
                                    </label>
                                </div>
                                <select
                                    style={selectStyles}
                                    {...register('risk_appetite', {
                                        required: 'Please select your risk appetite',
                                    })}
                                    defaultValue="moderate"
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--accent-primary)';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--border-primary)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    <option value="low" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                                        Low - Conservative investments
                                    </option>
                                    <option value="moderate" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                                        Moderate - Balanced approach
                                    </option>
                                    <option value="high" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                                        High - Aggressive growth
                                    </option>
                                </select>
                                {errors.risk_appetite && (
                                    <p className="text-sm" style={{ color: 'var(--accent-danger)' }}>
                                        {errors.risk_appetite.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full"
                                size="lg"
                                style={{ height: '48px' }}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-sm">
                                        <LoadingSpinner size="sm" color="primary" />
                                        <span>Creating Account...</span>
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>

                        <div className="mt-lg text-center">
                            <p className="text-sm text-secondary">
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    style={{
                                        color: 'var(--accent-primary)',
                                        textDecoration: 'none',
                                        fontWeight: '500'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'var(--accent-primary-hover)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'var(--accent-primary)';
                                    }}
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Terms */}
                <div className="text-center mt-lg animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                    <p className="text-xs text-secondary">
                        By creating an account, you agree to our{' '}
                        <Link
                            href="#"
                            style={{
                                color: 'var(--accent-primary)',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--accent-primary-hover)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--accent-primary)';
                            }}
                        >
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                            href="#"
                            style={{
                                color: 'var(--accent-primary)',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--accent-primary-hover)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--accent-primary)';
                            }}
                        >
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}