'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu, X } from 'lucide-react';
import { MdTrendingUp } from 'react-icons/md';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const navLinkStyle: React.CSSProperties = {
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        borderRadius: 'var(--radius-md)',
        transition: 'all 0.2s ease',
        display: 'block',
        fontSize: '0.875rem'
    };

    return (
        <header style={{
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div className="container">
                <div className="flex justify-between items-center" style={{ height: '64px' }}>
                    {/* Logo */}
                    <Link
                        href={isAuthenticated ? '/dashboard' : '/'}
                        className="flex items-center gap-sm transition-colors"
                        style={{ textDecoration: 'none' }}
                        onClick={closeMobileMenu}
                    >
                        <MdTrendingUp size={32} color="var(--accent-primary)" />
                        <span className="text-xl font-bold text-primary">Grip Invest</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="flex items-center gap-lg" style={{
                        display: 'none'
                    }}>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    style={navLinkStyle}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'var(--accent-primary)';
                                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/products"
                                    style={navLinkStyle}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'var(--accent-primary)';
                                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    Explore
                                </Link>
                                <Link
                                    href="/investments"
                                    style={navLinkStyle}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'var(--accent-primary)';
                                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    My Investments
                                </Link>

                                {/* User Menu */}
                                <div className="flex items-center gap-md">
                                    <div className="flex items-center gap-sm">
                                        <User size={16} color="var(--text-muted)" />
                                        <span className="text-sm text-secondary">
                                            {user?.first_name}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={logout}
                                        style={{
                                            color: 'var(--text-muted)',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            padding: 'var(--spacing-sm)',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--accent-danger)';
                                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-muted)';
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <LogOut size={16} />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    style={navLinkStyle}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'var(--accent-primary)';
                                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    Login
                                </Link>
                                <Link href="/signup">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        style={{
                            display: 'block',
                            padding: 'var(--spacing-sm)',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-primary)',
                        borderTop: 'none',
                        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)',
                        zIndex: 40
                    }}>
                        <nav className="flex flex-col p-md gap-xs">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        style={navLinkStyle}
                                        onClick={closeMobileMenu}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--accent-primary)';
                                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/products"
                                        style={navLinkStyle}
                                        onClick={closeMobileMenu}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--accent-primary)';
                                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        Explore Products
                                    </Link>
                                    <Link
                                        href="/investments"
                                        style={navLinkStyle}
                                        onClick={closeMobileMenu}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--accent-primary)';
                                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        My Investments
                                    </Link>

                                    <div style={{
                                        borderTop: '1px solid var(--border-secondary)',
                                        marginTop: 'var(--spacing-sm)',
                                        paddingTop: 'var(--spacing-sm)'
                                    }}>
                                        <div className="flex items-center gap-sm p-sm">
                                            <User size={16} color="var(--text-muted)" />
                                            <span className="text-sm text-secondary">
                                                {user?.first_name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                closeMobileMenu();
                                            }}
                                            style={{
                                                ...navLinkStyle,
                                                width: '100%',
                                                textAlign: 'left',
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: 'var(--accent-danger)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <div className="flex items-center gap-sm">
                                                <LogOut size={16} />
                                                <span>Logout</span>
                                            </div>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        style={navLinkStyle}
                                        onClick={closeMobileMenu}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--accent-primary)';
                                            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        Login
                                    </Link>
                                    <Link href="/signup" onClick={closeMobileMenu}>
                                        <Button size="sm" className="w-full mt-sm">
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>

            <style jsx>{`
                @media (min-width: 769px) {
                    nav {
                        display: flex !important;
                    }
                    button:last-child {
                        display: none !important;
                    }
                }
            `}</style>
        </header>
    );
};

export default Header;