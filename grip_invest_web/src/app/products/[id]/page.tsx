'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import LoadingSpinner from '@/components/LoadingSpinner';
import { productsAPI, investmentsAPI } from '@/lib/api';
import {
    formatCurrency,
    calculateReturns,
    getRiskLevelColor,
    getInvestmentTypeColor,
} from '@/lib/utils';
import { InvestmentProduct } from '@/types';
import {
    ArrowLeft,
    TrendingUp,
    Calendar,
    DollarSign,
    Target,
    Info,
    Calculator,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const [product, setProduct] = useState<InvestmentProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [investing, setInvesting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [investmentAmount, setInvestmentAmount] = useState<number>(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await productsAPI.getProduct(productId);
                const productData = response.data.product;
                setProduct(productData);
                setInvestmentAmount(productData.min_investment);
            } catch (error: any) {
                console.error('Product fetch error:', error);
                setError('Failed to load product details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleInvest = async () => {
        if (!product) return;

        if (investmentAmount < product.min_investment) {
            toast.error(
                `Minimum investment amount is ${formatCurrency(product.min_investment)}`
            );
            return;
        }

        if (product.max_investment && investmentAmount > product.max_investment) {
            toast.error(
                `Maximum investment amount is ${formatCurrency(product.max_investment)}`
            );
            return;
        }

        try {
            setInvesting(true);
            await investmentsAPI.createInvestment({
                product_id: product.id,
                amount: investmentAmount,
            });

            toast.success('Investment created successfully!');
            router.push('/investments');
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Investment failed. Please try again.';
            toast.error(message);
        } finally {
            setInvesting(false);
        }
    };

    const expectedReturn = product
        ? calculateReturns(
            investmentAmount,
            product.annual_yield,
            product.tenure_months
        )
        : 0;

    const totalGain = expectedReturn - investmentAmount;

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            </ProtectedRoute>
        );
    }

    if (error || !product) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                Product Not Found
                            </h1>
                            <p className="text-gray-600 mb-8">
                                {error || 'The requested product could not be found.'}
                            </p>
                            <Link href="/products">
                                <Button>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link href="/products">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Products
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Product Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-2xl">{product.name}</CardTitle>
                                            <p className="text-gray-600 mt-2">
                                                {product.description}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Badge
                                                className={getInvestmentTypeColor(
                                                    product.investment_type
                                                )}
                                            >
                                                {product.investment_type.toUpperCase()}
                                            </Badge>
                                            <Badge className={getRiskLevelColor(product.risk_level)}>
                                                {product.risk_level} risk
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-green-600">
                                                {product.annual_yield}%
                                            </p>
                                            <p className="text-sm text-gray-600">Annual Yield</p>
                                        </div>
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-blue-600">
                                                {product.tenure_months}
                                            </p>
                                            <p className="text-sm text-gray-600">Months</p>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                                            <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                                            <p className="text-lg font-bold text-purple-600">
                                                {formatCurrency(product.min_investment)}
                                            </p>
                                            <p className="text-sm text-gray-600">Min Investment</p>
                                        </div>
                                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                                            <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                                            <p className="text-lg font-bold text-orange-600">
                                                {product.max_investment
                                                    ? formatCurrency(product.max_investment)
                                                    : 'No Limit'}
                                            </p>
                                            <p className="text-sm text-gray-600">Max Investment</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Product Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Info className="h-5 w-5" />
                                        <span>Product Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">
                                                Investment Type
                                            </h4>
                                            <p className="text-gray-600">
                                                {product.investment_type === 'bond' &&
                                                    'Government and corporate bonds offering stable returns with varying risk levels.'}
                                                {product.investment_type === 'fd' &&
                                                    'Fixed Deposits with guaranteed returns and flexible tenure options.'}
                                                {product.investment_type === 'mf' &&
                                                    'Professionally managed mutual funds diversified across multiple assets.'}
                                                {product.investment_type === 'etf' &&
                                                    'Exchange-traded funds providing broad market exposure with low fees.'}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">
                                                Risk Level
                                            </h4>
                                            <p className="text-gray-600">
                                                {product.risk_level === 'low' &&
                                                    'Conservative investment with minimal risk of loss and stable returns.'}
                                                {product.risk_level === 'moderate' &&
                                                    'Balanced approach with moderate risk for reasonable returns.'}
                                                {product.risk_level === 'high' &&
                                                    'Higher risk investment with potential for significant returns.'}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">
                                                Key Features
                                            </h4>
                                            <ul className="text-gray-600 space-y-1">
                                                <li>
                                                    • Expected annual return of {product.annual_yield}%
                                                </li>
                                                <li>
                                                    • Investment tenure of {product.tenure_months} months
                                                </li>
                                                <li>
                                                    • Minimum investment:{' '}
                                                    {formatCurrency(product.min_investment)}
                                                </li>
                                                {product.max_investment && (
                                                    <li>
                                                        • Maximum investment:{' '}
                                                        {formatCurrency(product.max_investment)}
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Investment Calculator */}
                        <div>
                            <Card className="sticky top-8">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Calculator className="h-5 w-5" />
                                        <span>Investment Calculator</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <FormInput
                                            label="Investment Amount"
                                            type="number"
                                            value={investmentAmount || ''}
                                            onChange={(e) =>
                                                setInvestmentAmount(Number(e.target.value))
                                            }
                                            placeholder={`Min: ${formatCurrency(product.min_investment)}`}
                                            helperText={`Range: ${formatCurrency(product.min_investment)} - ${product.max_investment
                                                ? formatCurrency(product.max_investment)
                                                : 'No limit'
                                                }`}
                                        />

                                        {/* Calculation Results */}
                                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Investment Amount:
                                                </span>
                                                <span className="font-semibold">
                                                    {formatCurrency(investmentAmount)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Expected Return:</span>
                                                <span className="font-semibold text-green-600">
                                                    {formatCurrency(expectedReturn)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between border-t pt-4">
                                                <span className="text-gray-600">Total Gain:</span>
                                                <span className="font-bold text-green-600">
                                                    {formatCurrency(totalGain)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Return Rate:</span>
                                                <span className="font-bold text-blue-600">
                                                    {investmentAmount > 0
                                                        ? ((totalGain / investmentAmount) * 100).toFixed(1)
                                                        : 0}
                                                    %
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleInvest}
                                            className="w-full"
                                            size="lg"
                                            disabled={investing || investmentAmount < product.min_investment}
                                        >
                                            <DollarSign className="h-4 w-4 mr-2" />
                                            {investing ? 'Investing...' : `Invest ${formatCurrency(investmentAmount)}`}
                                        </Button>

                                        <p className="text-xs text-gray-500 text-center">
                                            By investing, you agree to our terms and conditions.
                                        </p>
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
