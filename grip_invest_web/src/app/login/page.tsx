'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import { LoginFormData } from '@/types';
import { Mail, Lock } from 'lucide-react';
import { MdTrendingUp } from 'react-icons/md';

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const success = await login(data.email, data.password);
            if (success) {
                router.push('/dashboard');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated) {
        return null; // Will redirect to dashboard
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary px-sm py-lg">
            <div className="w-full" style={{
                maxWidth: '400px',
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
                        Welcome back
                    </h2>
                    <p className="text-sm text-secondary">
                        Sign in to your account to continue investing
                    </p>
                </div>

                {/* Login Form */}
                <Card className="animate-slideInUp" variant="glass">
                    <CardHeader>
                        <CardTitle style={{ fontSize: '1.25rem' }}>Sign In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg">
                            <div className="flex flex-col gap-xs">
                                <Label htmlFor="email">Email Address</Label>
                                <div style={{ position: 'relative' }}>
                                    <Mail
                                        size={20}
                                        color="var(--text-muted)"
                                        style={{
                                            position: 'absolute',
                                            left: 'var(--spacing-sm)',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        style={{
                                            paddingLeft: '2.5rem',
                                            height: '44px',
                                            fontSize: '16px' // Prevents zoom on iOS
                                        }}
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Please enter a valid email address',
                                            },
                                        })}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm" style={{ color: 'var(--accent-danger)' }}>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-xs">
                                <Label htmlFor="password">Password</Label>
                                <div style={{ position: 'relative' }}>
                                    <Lock
                                        size={20}
                                        color="var(--text-muted)"
                                        style={{
                                            position: 'absolute',
                                            left: 'var(--spacing-sm)',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        style={{
                                            paddingLeft: '2.5rem',
                                            height: '44px',
                                            fontSize: '16px' // Prevents zoom on iOS
                                        }}
                                        {...register('password', {
                                            required: 'Password is required',
                                        })}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-sm" style={{ color: 'var(--accent-danger)' }}>
                                        {errors.password.message}
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
                                        <span>Signing In...</span>
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        <div className="mt-lg text-center">
                            <p className="text-sm text-secondary">
                                Don't have an account?{' '}
                                <Link
                                    href="/signup"
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
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Demo Credentials */}
                <div className="mt-lg p-md rounded-lg border animate-slideInUp"
                    style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderColor: 'var(--accent-primary)',
                        animationDelay: '0.2s'
                    }}>
                    <h3 className="text-sm font-medium mb-sm" style={{ color: 'var(--accent-primary)' }}>
                        Demo Credentials
                    </h3>
                    <div className="text-xs text-secondary flex flex-col gap-xs">
                        <p>
                            <strong>Email:</strong> alice@example.com
                        </p>
                        <p>
                            <strong>Password:</strong> password123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}