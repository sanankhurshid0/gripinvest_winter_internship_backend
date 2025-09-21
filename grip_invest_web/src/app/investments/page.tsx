'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { investmentsAPI } from '@/lib/api';
import {
    formatCurrency,
    formatDate,
    getRiskLevelColor,
    getInvestmentTypeColor,
} from '@/lib/utils';
import { Investment, PortfolioSummary } from '@/types';
import {
    TrendingUp,
    Calendar,
    DollarSign,
    Activity,
    AlertCircle,
    CheckCircle,
    XCircle,
    Plus,
    Target,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function InvestmentsPage() {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [portfolioSummary, setPortfolioSummary] =
        useState<PortfolioSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState<string | null>(null);

    useEffect(() => {
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await investmentsAPI.getInvestments();
            setInvestments(response.data.investments || []);
            setPortfolioSummary(response.data.portfolio_summary);
        } catch (error: any) {
            console.error('Investments fetch error:', error);
            setError('Failed to load investments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelInvestment = async (investmentId: string) => {
        if (
            !confirm(
                'Are you sure you want to cancel this investment? This action cannot be undone.'
            )
        ) {
            return;
        }

        try {
            setCancelling(investmentId);
            await investmentsAPI.cancelInvestment(investmentId);
            toast.success('Investment cancelled successfully');
            fetchInvestments(); // Refresh the list
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Failed to cancel investment';
            toast.error(message);
        } finally {
            setCancelling(null);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'matured':
                return <Target className="h-4 w-4 text-blue-600" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4 text-red-600" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
            case 'matured':
                return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Matured</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const canCancelInvestment = (investment: Investment) => {
        if (investment.status !== 'active') return false;

        const investmentTime = new Date(investment.invested_at);
        const currentTime = new Date();
        const hoursDifference =
            (currentTime.getTime() - investmentTime.getTime()) / (1000 * 60 * 60);

        return hoursDifference <= 24;
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                My Investments
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Track and manage your investment portfolio
                            </p>
                        </div>
                        <Link href="/products">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                New Investment
                            </Button>
                        </Link>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Portfolio Summary */}
                    {portfolioSummary && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100 text-sm font-medium">
                                                Total Invested
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(portfolioSummary.total_invested)}
                                            </p>
                                        </div>
                                        <DollarSign className="h-8 w-8 text-blue-200" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-100 text-sm font-medium">
                                                Expected Returns
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(portfolioSummary.total_expected_return)}
                                            </p>
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-green-200" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100 text-sm font-medium">
                                                Total Gains
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(portfolioSummary.total_gain)}
                                            </p>
                                        </div>
                                        <Target className="h-8 w-8 text-purple-200" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-orange-100 text-sm font-medium">
                                                Active Investments
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {portfolioSummary.active_investments}
                                            </p>
                                        </div>
                                        <Activity className="h-8 w-8 text-orange-200" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Investments List */}
                    {investments.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Target className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No investments yet
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Start building your investment portfolio today
                                </p>
                                <Link href="/products">
                                    <Button size="lg">
                                        <Plus className="h-5 w-5 mr-2" />
                                        Browse Investment Products
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {investments.map((investment) => (
                                <Card
                                    key={investment.id}
                                    className="hover:shadow-md transition-shadow"
                                >
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                            {/* Investment Info */}
                                            <div className="lg:col-span-2">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {investment.product_name}
                                                        </h3>
                                                        <div className="flex items-center space-x-2 mt-2">
                                                            <Badge
                                                                className={getInvestmentTypeColor(
                                                                    investment.investment_type
                                                                )}
                                                            >
                                                                {investment.investment_type.toUpperCase()}
                                                            </Badge>
                                                            <Badge
                                                                className={getRiskLevelColor(
                                                                    investment.risk_level
                                                                )}
                                                            >
                                                                {investment.risk_level} risk
                                                            </Badge>
                                                            {getStatusBadge(investment.status)}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(investment.status)}
                                                    </div>
                                                </div>
                                                {investment.description && (
                                                    <p className="text-gray-600 text-sm">
                                                        {investment.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Investment Details */}
                                            <div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Invested Amount
                                                        </p>
                                                        <p className="text-lg font-semibold text-gray-900">
                                                            {formatCurrency(investment.amount)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Expected Return
                                                        </p>
                                                        <p className="text-lg font-semibold text-green-600">
                                                            {formatCurrency(investment.expected_return)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Potential Gain
                                                        </p>
                                                        <p className="text-lg font-semibold text-purple-600">
                                                            {formatCurrency(
                                                                investment.expected_return - investment.amount
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dates & Actions */}
                                            <div>
                                                <div className="space-y-3 mb-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">
                                                                Invested On
                                                            </p>
                                                            <p className="text-sm font-medium">
                                                                {formatDate(investment.invested_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Target className="h-4 w-4 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">
                                                                Maturity Date
                                                            </p>
                                                            <p className="text-sm font-medium">
                                                                {formatDate(investment.maturity_date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="space-y-2">
                                                    <Link href={`/investments/${investment.id}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                    {canCancelInvestment(investment) && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={() =>
                                                                handleCancelInvestment(investment.id)
                                                            }
                                                            disabled={cancelling === investment.id}
                                                        >
                                                            {cancelling === investment.id ? 'Cancelling...' : 'Cancel Investment'}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
