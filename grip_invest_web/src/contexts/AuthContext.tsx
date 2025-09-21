'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { authUtils } from '@/lib/auth';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (userData: {
        first_name: string;
        last_name?: string;
        email: string;
        password: string;
        risk_appetite?: 'low' | 'moderate' | 'high';
    }) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const initAuth = async () => {
            try {
                const token = authUtils.getToken();
                const userData = authUtils.getUser();

                if (token && userData) {
                    // Verify token is still valid
                    const response = await authAPI.getProfile();
                    setUser(response.data.user);
                }
            } catch (error) {
                // Token is invalid, clear auth data
                authUtils.logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await authAPI.login({ email, password });
            const { token, user: userData } = response.data;

            authUtils.setAuth(token, userData);
            setUser(userData);

            toast.success(`Welcome back, ${userData.first_name}!`);
            return true;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return false;
        }
    };

    const signup = async (userData: {
        first_name: string;
        last_name?: string;
        email: string;
        password: string;
        risk_appetite?: 'low' | 'moderate' | 'high';
    }): Promise<boolean> => {
        try {
            await authAPI.signup(userData);
            toast.success('Account created successfully! Please login.');
            return true;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Signup failed';
            toast.error(message);
            return false;
        }
    };

    const logout = () => {
        authUtils.logout();
        setUser(null);
        toast.success('Logged out successfully');
        window.location.href = '/login';
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
