'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import InvestmentIcon from '@/components/InvestmentIcon';
import { productsAPI } from '@/lib/api';
import {
    formatCurrency,
    getRiskLevelColor,
    getInvestmentTypeColor,
} from '@/lib/utils';
import { InvestmentProduct } from '@/types';
import {
    Search,
    Filter,
    TrendingUp,
    Calendar,
    Target,
    DollarSign,
} from 'lucide-react';
import { MdExplore } from 'react-icons/md';
import Link from 'next/link';

export default function ProductsPage() {
    const [products, setProducts] = useState<InvestmentProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<InvestmentProduct[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedRisk, setSelectedRisk] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('annual_yield');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await productsAPI.getProducts({ sort_by: sortBy });
                setProducts(response.data.products || []);
                setFilteredProducts(response.data.products || []);
            } catch (error: any) {
                console.error('Products fetch error:', error);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [sortBy]);

    // Filter and search products
    useEffect(() => {
        let filtered = products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType =
                !selectedType || product.investment_type === selectedType;
            const matchesRisk = !selectedRisk || product.risk_level === selectedRisk;

            return matchesSearch && matchesType && matchesRisk;
        });

        setFilteredProducts(filtered);
    }, [products, searchTerm, selectedType, selectedRisk]);

    const investmentTypes = [
        { value: '', label: 'All Types' },
        { value: 'bond', label: 'Bonds' },
        { value: 'fd', label: 'Fixed Deposits' },
        { value: 'mf', label: 'Mutual Funds' },
        { value: 'etf', label: 'ETFs' },
    ];

    const riskLevels = [
        { value: '', label: 'All Risk Levels' },
        { value: 'low', label: 'Low Risk' },
        { value: 'moderate', label: 'Moderate Risk' },
        { value: 'high', label: 'High Risk' },
    ];

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center bg-primary">
                    <div className="text-center animate-fadeIn">
                        <LoadingSpinner size="lg" variant="pulse" color="primary" />
                        <p className="text-secondary mt-md">Loading investment products...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const inputStyles: React.CSSProperties = {
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
        <ProtectedRoute>
            <div className="min-h-screen bg-primary">
                <div className="container py-lg py-xl animate-fadeIn">
                    {/* Header */}
                    <div className="mb-lg mb-xl">
                        <div className="flex items-center gap-sm gap-md mb-sm">
                            <MdExplore size={28} color="var(--accent-primary)" />
                            <h1 className="font-bold text-primary" style={{
                                fontSize: 'clamp(1.5rem, 5vw, 2rem)'
                            }}>
                                Investment Products
                            </h1>
                        </div>
                        <p className="text-secondary text-sm">
                            Discover investment opportunities tailored to your goals
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

                    {/* Filters */}
                    <Card className="mb-lg mb-xl animate-slideInUp">
                        <CardContent style={{ padding: 'var(--spacing-md)' }}>
                            <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-4-lg gap-sm gap-md">
                                {/* Search */}
                                <div style={{ position: 'relative' }}>
                                    <Search
                                        size={16}
                                        color="var(--text-muted)"
                                        style={{
                                            position: 'absolute',
                                            left: 'var(--spacing-sm)',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            ...inputStyles,
                                            paddingLeft: '2.5rem',
                                            fontSize: '16px' // Prevents zoom on iOS
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--accent-primary)';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'var(--border-primary)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                {/* Investment Type Filter */}
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    style={{
                                        ...inputStyles,
                                        fontSize: '16px' // Prevents zoom on iOS
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--accent-primary)';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--border-primary)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    {investmentTypes.map((type) => (
                                        <option key={type.value} value={type.value} style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>

                                {/* Risk Level Filter */}
                                <select
                                    value={selectedRisk}
                                    onChange={(e) => setSelectedRisk(e.target.value)}
                                    style={{
                                        ...inputStyles,
                                        fontSize: '16px' // Prevents zoom on iOS
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--accent-primary)';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--border-primary)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    {riskLevels.map((risk) => (
                                        <option key={risk.value} value={risk.value} style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                                            {risk.label}
                                        </option>
                                    ))}
                                </select>

                                {/* Sort By */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{
                                        ...inputStyles,
                                        fontSize: '16px' // Prevents zoom on iOS
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--accent-primary)';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--border-primary)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    <option value="annual_yield" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Sort by Yield</option>
                                    <option value="tenure_months" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Sort by Tenure</option>
                                    <option value="min_investment" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Sort by Min Investment</option>
                                    <option value="created_at" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Sort by Latest</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products Grid */}
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-xl py-2xl animate-slideInUp">
                            <Filter size={40} color="var(--text-muted)" className="mx-auto mb-md" />
                            <h3 className="text-base text-lg font-medium text-primary mb-sm">
                                No products found
                            </h3>
                            <p className="text-secondary text-sm">
                                Try adjusting your filters or search terms
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg gap-md gap-lg">
                            {filteredProducts.map((product, index) => (
                                <Card
                                    key={product.id}
                                    className="hover-lift animate-slideInUp"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <CardHeader style={{ padding: 'var(--spacing-md)' }}>
                                        <div className="flex flex-col flex-row-md justify-between items-start gap-sm">
                                            <div className="flex items-center gap-sm flex-1">
                                                <InvestmentIcon
                                                    type={product.investment_type}
                                                    size="md"
                                                    color="var(--accent-primary)"
                                                />
                                                <CardTitle className="text-base text-lg flex-1">{product.name}</CardTitle>
                                            </div>
                                            <div className="flex flex-wrap gap-xs">
                                                <Badge variant="info">
                                                    {product.investment_type.toUpperCase()}
                                                </Badge>
                                                <Badge variant="secondary">
                                                    {product.risk_level} risk
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent style={{ padding: 'var(--spacing-md)', paddingTop: 0 }}>
                                        <div className="flex flex-col gap-md">
                                            {/* Key Metrics */}
                                            <div className="grid grid-cols-2 gap-sm gap-md">
                                                <div className="text-center p-sm p-md rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                                    <TrendingUp size={18} color="var(--accent-secondary)" className="mx-auto mb-xs" />
                                                    <p className="text-lg text-xl font-bold" style={{ color: 'var(--accent-secondary)' }}>
                                                        {product.annual_yield}%
                                                    </p>
                                                    <p className="text-xs text-secondary">Annual Yield</p>
                                                </div>
                                                <div className="text-center p-sm p-md rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                                    <Calendar size={18} color="var(--accent-primary)" className="mx-auto mb-xs" />
                                                    <p className="text-lg text-xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                                                        {product.tenure_months}
                                                    </p>
                                                    <p className="text-xs text-secondary">Months</p>
                                                </div>
                                            </div>

                                            {/* Investment Range */}
                                            <div className="flex flex-col gap-xs">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-sm text-secondary">
                                                        Min Investment:
                                                    </span>
                                                    <span className="font-semibold text-primary text-sm">
                                                        {formatCurrency(product.min_investment)}
                                                    </span>
                                                </div>
                                                {product.max_investment && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-sm text-secondary">
                                                            Max Investment:
                                                        </span>
                                                        <span className="font-semibold text-primary text-sm">
                                                            {formatCurrency(product.max_investment)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description */}
                                            {product.description && (
                                                <p className="text-xs text-sm text-secondary" style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {product.description}
                                                </p>
                                            )}

                                            {/* Action Button */}
                                            <Link href={`/products/${product.id}`}>
                                                <Button className="w-full" style={{ height: '44px' }}>
                                                    <DollarSign size={16} />
                                                    Invest Now
                                                </Button>
                                            </Link>
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