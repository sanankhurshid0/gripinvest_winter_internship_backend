'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import InvestmentIcon from '@/components/InvestmentIcon';
import { useAuth } from '@/contexts/AuthContext';
import { investmentsAPI, productsAPI } from '@/lib/api';
import {
    formatCurrency,
    formatDate,
    getRiskLevelColor,
    getInvestmentTypeColor,
} from '@/lib/utils';
import { Investment, PortfolioSummary, InvestmentProduct } from '@/types';
import {
    TrendingUp,
    Wallet,
    Target,
    Activity,
    Plus,
    ArrowUpRight,
    Calendar,
} from 'lucide-react';
import { MdDashboard } from 'react-icons/md';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [portfolioSummary, setPortfolioSummary] =
        useState<PortfolioSummary | null>(null);
    const [recommendations, setRecommendations] = useState<InvestmentProduct[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch investments and recommendations in parallel
                const [investmentsResponse, recommendationsResponse] =
                    await Promise.all([
                        investmentsAPI.getInvestments(),
                        productsAPI.getRecommendations(),
                    ]);

                setInvestments(investmentsResponse.data.investments || []);
                setPortfolioSummary(investmentsResponse.data.portfolio_summary);
                setRecommendations(recommendationsResponse.data.recommendations || []);
            } catch (error: any) {
                console.error('Dashboard data fetch error:', error);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center bg-primary">
                    <div className="text-center animate-fadeIn">
                        <LoadingSpinner size="lg" variant="dots" color="primary" />
                        <p className="text-secondary mt-md">Loading your dashboard...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const summaryCards = [
        {
            title: 'Total Invested',
            value: formatCurrency(portfolioSummary?.total_invested || 0),
            icon: <Wallet size={24} />,
            gradient: 'var(--gradient-primary)',
            color: '#3b82f6'
        },
        {
            title: 'Expected Returns',
            value: formatCurrency(portfolioSummary?.total_expected_return || 0),
            icon: <TrendingUp size={24} />,
            gradient: 'var(--gradient-success)',
            color: '#10b981'
        },
        {
            title: 'Total Gains',
            value: formatCurrency(portfolioSummary?.total_gain || 0),
            icon: <Target size={24} />,
            gradient: 'var(--gradient-purple)',
            color: '#8b5cf6',
            subtitle: portfolioSummary?.total_invested && portfolioSummary.total_invested > 0
                ? `${((portfolioSummary.total_gain / portfolioSummary.total_invested) * 100).toFixed(1)}% returns`
                : '0% returns'
        },
        {
            title: 'Active Investments',
            value: portfolioSummary?.active_investments || 0,
            icon: <Activity size={24} />,
            gradient: 'var(--gradient-orange)',
            color: '#f97316'
        }
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-primary">
                <div className="container py-lg py-xl animate-fadeIn">
                    {/* Header */}
                    <div className="mb-lg mb-xl">
                        <div className="flex items-center gap-sm gap-md mb-sm">
                            <MdDashboard size={28} color="var(--accent-primary)" />
                            <h1 className="font-bold text-primary" style={{
                                fontSize: 'clamp(1.5rem, 5vw, 2rem)'
                            }}>
                                Welcome back, {user?.first_name}!
                            </h1>
                        </div>
                        <p className="text-secondary text-sm">
                            Here's an overview of your investment portfolio
                        </p>
                    </div>

                    {error && (
                        <div className="mb-lg p-md rounded-lg border animate-slideInUp"
                            style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                borderColor: 'var(--accent-danger)',
                                color: 'var(--accent-danger)'
                            }}>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Portfolio Summary Cards */}
                    <div className="grid grid-cols-1 grid-cols-2-xs grid-cols-2-sm grid-cols-4-lg gap-sm gap-md gap-lg mb-lg mb-xl">
                        {summaryCards.map((card, index) => (
                            <Card
                                key={card.title}
                                className="animate-slideInUp hover-lift"
                                style={{
                                    background: card.gradient,
                                    color: 'var(--text-primary)',
                                    border: 'none',
                                    animationDelay: `${index * 0.1}s`,
                                    padding: 'var(--spacing-sm)'
                                }}
                            >
                                <CardContent style={{ padding: 'var(--spacing-md)' }}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-xs text-sm font-medium" style={{ opacity: 0.9 }}>
                                                {card.title}
                                            </p>
                                            <p className="font-bold mt-xs" style={{
                                                fontSize: 'clamp(1rem, 4vw, 1.5rem)'
                                            }}>
                                                {card.value}
                                            </p>
                                            {card.subtitle && (
                                                <div className="flex items-center mt-xs gap-xs">
                                                    <ArrowUpRight size={12} style={{ opacity: 0.8 }} />
                                                    <span className="text-xs" style={{ opacity: 0.8 }}>
                                                        {card.subtitle}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ opacity: 0.8 }}>
                                            {card.icon}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 grid-cols-3-lg gap-lg gap-xl">
                        {/* Recent Investments */}
                        <div className="lg:col-span-2">
                            <Card className="animate-slideInUp">
                                <CardHeader>
                                    <div className="flex flex-col flex-row-md justify-between items-start items-center-md gap-sm">
                                        <CardTitle className="flex items-center gap-sm text-base text-lg">
                                            <Activity size={18} color="var(--accent-primary)" />
                                            <span>Recent Investments</span>
                                        </CardTitle>
                                        <Link href="/investments">
                                            <Button variant="outline" size="sm">
                                                View All
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {investments.length === 0 ? (
                                        <div className="text-center py-lg py-xl">
                                            <Target size={40} color="var(--text-muted)" className="mx-auto mb-md" />
                                            <h3 className="text-base text-lg font-medium text-primary mb-sm">
                                                No investments yet
                                            </h3>
                                            <p className="text-secondary mb-md text-sm">
                                                Start your investment journey today
                                            </p>
                                            <Link href="/products">
                                                <Button>
                                                    <Plus size={16} />
                                                    Explore Products
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-sm gap-md">
                                            {investments.slice(0, 5).map((investment, index) => (
                                                <div
                                                    key={investment.id}
                                                    className="flex flex-col flex-row-sm items-start items-center-sm justify-between p-sm p-md rounded-lg border transition-colors animate-slideInRight"
                                                    style={{
                                                        backgroundColor: 'var(--bg-tertiary)',
                                                        borderColor: 'var(--border-secondary)',
                                                        animationDelay: `${index * 0.1}s`,
                                                        gap: 'var(--spacing-sm)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                                        e.currentTarget.style.borderColor = 'var(--border-accent)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                                                        e.currentTarget.style.borderColor = 'var(--border-secondary)';
                                                    }}
                                                >
                                                    <div className="flex-1 w-full">
                                                        <div className="flex items-center gap-sm gap-md">
                                                            <InvestmentIcon
                                                                type={investment.investment_type}
                                                                size="sm"
                                                                color="var(--accent-primary)"
                                                            />
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-primary text-sm">
                                                                    {investment.product_name}
                                                                </h4>
                                                                <div className="flex flex-wrap items-center gap-xs mt-xs">
                                                                    <Badge variant="info">
                                                                        {investment.investment_type.toUpperCase()}
                                                                    </Badge>
                                                                    <Badge variant="secondary">
                                                                        {investment.risk_level}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right text-center-xs w-full flex-shrink-0" style={{ minWidth: 'fit-content' }}>
                                                        <p className="font-semibold text-primary text-sm">
                                                            {formatCurrency(investment.amount)}
                                                        </p>
                                                        <p className="text-xs text-secondary flex items-center justify-end justify-center-xs gap-xs">
                                                            <Calendar size={10} />
                                                            {formatDate(investment.invested_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <Card className="animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-sm text-base text-lg">
                                        <Target size={18} color="var(--accent-secondary)" />
                                        <span>Recommended for You</span>
                                    </CardTitle>
                                    <p className="text-xs text-sm text-secondary">
                                        Based on your {user?.risk_appetite} risk appetite
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    {recommendations.length === 0 ? (
                                        <div className="text-center py-md">
                                            <p className="text-secondary text-sm">
                                                No recommendations available
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-sm gap-md">
                                            {recommendations.slice(0, 3).map((product, index) => (
                                                <div
                                                    key={product.id}
                                                    className="border rounded-lg p-sm p-md transition-all hover-lift animate-slideInUp"
                                                    style={{
                                                        borderColor: 'var(--border-primary)',
                                                        animationDelay: `${index * 0.1}s`
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = 'var(--border-primary)';
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start mb-sm">
                                                        <div className="flex items-center gap-xs gap-sm flex-1">
                                                            <InvestmentIcon
                                                                type={product.investment_type}
                                                                size="sm"
                                                                color="var(--accent-secondary)"
                                                            />
                                                            <h4 className="font-medium text-primary text-xs text-sm flex-1">
                                                                {product.name}
                                                            </h4>
                                                        </div>
                                                        <Badge variant="success">
                                                            {product.investment_type.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-base text-lg font-bold" style={{ color: 'var(--accent-secondary)' }}>
                                                                {product.annual_yield}%
                                                            </p>
                                                            <p className="text-xs text-secondary">
                                                                {product.tenure_months} months
                                                            </p>
                                                        </div>
                                                        <Link href={`/products/${product.id}`}>
                                                            <Button size="sm" variant="outline">
                                                                Invest
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="mt-md">
                                        <Link href="/products">
                                            <Button variant="outline" className="w-full" size="sm">
                                                View All Products
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}