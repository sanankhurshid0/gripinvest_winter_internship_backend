import React from 'react';
import {
    FaUniversity,
    FaPiggyBank,
    FaChartLine,
    FaCoins,
    FaHandHoldingUsd,
    FaBuilding,
    FaGem,
    FaShieldAlt
} from 'react-icons/fa';
import {
    MdAccountBalance,
    MdTrendingUp,
    MdSavings,
    MdBusinessCenter
} from 'react-icons/md';
import {
    RiStockLine,
    RiExchangeLine,
    RiBankLine,
    RiSafeLine
} from 'react-icons/ri';

interface InvestmentIconProps {
    type: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    color?: string;
}

const InvestmentIcon: React.FC<InvestmentIconProps> = ({
    type,
    size = 'md',
    className = '',
    color
}) => {
    const sizeMap = {
        sm: 16,
        md: 24,
        lg: 32,
        xl: 48
    };

    const iconSize = sizeMap[size];

    const getIcon = (investmentType: string) => {
        const normalizedType = investmentType.toLowerCase().replace(/[^a-z]/g, '');

        switch (normalizedType) {
            case 'bond':
            case 'bonds':
            case 'governmentbond':
            case 'corporatebond':
                return <FaUniversity size={iconSize} className={className} style={{ color }} />;

            case 'fd':
            case 'fixeddeposit':
            case 'deposit':
                return <RiBankLine size={iconSize} className={className} style={{ color }} />;

            case 'mf':
            case 'mutualfund':
            case 'mutualfunds':
                return <FaChartLine size={iconSize} className={className} style={{ color }} />;

            case 'etf':
            case 'etfs':
            case 'exchangetradedfund':
                return <RiExchangeLine size={iconSize} className={className} style={{ color }} />;

            case 'equity':
            case 'stock':
            case 'stocks':
                return <RiStockLine size={iconSize} className={className} style={{ color }} />;

            case 'savings':
            case 'savingsaccount':
                return <FaPiggyBank size={iconSize} className={className} style={{ color }} />;

            case 'gold':
            case 'commodity':
            case 'commodities':
                return <FaGem size={iconSize} className={className} style={{ color }} />;

            case 'insurance':
            case 'lifeinsurance':
                return <FaShieldAlt size={iconSize} className={className} style={{ color }} />;

            case 'realestate':
            case 'reit':
            case 'property':
                return <FaBuilding size={iconSize} className={className} style={{ color }} />;

            case 'crypto':
            case 'cryptocurrency':
            case 'bitcoin':
                return <FaCoins size={iconSize} className={className} style={{ color }} />;

            default:
                return <MdBusinessCenter size={iconSize} className={className} style={{ color }} />;
        }
    };

    return (
        <div className="investment-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
            {getIcon(type)}
        </div>
    );
};

export default InvestmentIcon;
