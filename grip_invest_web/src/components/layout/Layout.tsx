'use client';

import React from 'react';
import Header from './Header';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-primary">
            <Header />
            <main className="flex-1">{children}</main>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-lg)'
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: 'var(--accent-secondary)',
                            secondary: 'var(--text-primary)',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: 'var(--accent-danger)',
                            secondary: 'var(--text-primary)',
                        },
                    },
                }}
            />
        </div>
    );
};

export default Layout;