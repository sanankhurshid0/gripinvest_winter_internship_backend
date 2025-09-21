'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import InvestmentIcon from '@/components/InvestmentIcon';
import { Shield, Target, Users, ArrowRight } from 'lucide-react';
import { MdTrendingUp } from 'react-icons/md';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  const features = [
    {
      icon: <Target size={24} />,
      title: 'Personalized Recommendations',
      description: 'Get investment suggestions tailored to your risk appetite and financial goals.',
      color: 'var(--accent-primary)'
    },
    {
      icon: <Shield size={24} />,
      title: 'Secure & Reliable',
      description: 'Your investments are protected with bank-level security and transparency.',
      color: 'var(--accent-secondary)'
    },
    {
      icon: <Users size={24} />,
      title: 'Expert Guidance',
      description: 'Access curated investment products from trusted financial institutions.',
      color: 'var(--accent-purple)'
    }
  ];

  const investmentTypes = [
    {
      type: 'bond',
      title: 'Government Bonds',
      description: 'Safe, government-backed investments with steady returns.'
    },
    {
      type: 'fd',
      title: 'Fixed Deposits',
      description: 'Guaranteed returns with flexible tenure options.'
    },
    {
      type: 'mf',
      title: 'Mutual Funds',
      description: 'Diversified portfolios managed by investment experts.'
    },
    {
      type: 'etf',
      title: 'ETFs',
      description: 'Exchange-traded funds for broad market exposure.'
    }
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="py-xl py-2xl" style={{
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%)'
      }}>
        <div className="container">
          <div className="text-center animate-fadeIn">
            <div className="flex justify-center items-center mb-md mb-lg">
              <MdTrendingUp size={48} color="var(--accent-primary)" />
            </div>
            <h1 className="font-bold text-primary mb-md mb-lg" style={{
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              lineHeight: '1.1'
            }}>
              Smart Investing Made
              <span style={{ color: 'var(--accent-primary)' }}> Simple</span>
            </h1>
            <p className="text-lg text-secondary mb-lg mb-xl mx-auto" style={{
              maxWidth: '48rem',
              fontSize: 'clamp(1rem, 3vw, 1.25rem)'
            }}>
              Discover personalized investment opportunities in bonds, fixed
              deposits, mutual funds, and ETFs. Start building your wealth with
              Grip Invest today.
            </p>
            <div className="flex flex-col flex-row-sm gap-sm gap-md justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="w-full" style={{
                  minWidth: '200px',
                  height: '48px'
                }}>
                  Start Investing
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  style={{
                    minWidth: '200px',
                    height: '48px'
                  }}
                >
                  Login to Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-xl py-2xl bg-secondary">
        <div className="container">
          <div className="text-center mb-lg mb-2xl animate-slideInUp">
            <h2 className="font-bold text-primary mb-md" style={{
              fontSize: 'clamp(1.5rem, 5vw, 2rem)'
            }}>
              Why Choose Grip Invest?
            </h2>
            <p className="text-lg text-secondary mx-auto" style={{
              maxWidth: '32rem',
              fontSize: 'clamp(1rem, 3vw, 1.125rem)'
            }}>
              Built for modern investors who want intelligent, personalized
              investment solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-3-md gap-lg gap-xl">
            {features.map((feature, index) => (
              <div key={feature.title} className="text-center p-md p-lg animate-slideInUp" style={{ animationDelay: `${index * 0.2}s` }}>
                <div
                  className="rounded-full flex items-center justify-center mx-auto mb-md hover-scale transition"
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: `${feature.color}20`,
                    color: feature.color
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-primary mb-sm" style={{
                  fontSize: 'clamp(1.125rem, 4vw, 1.25rem)'
                }}>
                  {feature.title}
                </h3>
                <p className="text-secondary text-sm" style={{
                  fontSize: 'clamp(0.875rem, 3vw, 1rem)'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Types Section */}
      <section className="py-xl py-2xl bg-tertiary">
        <div className="container">
          <div className="text-center mb-lg mb-2xl animate-slideInUp">
            <h2 className="font-bold text-primary mb-md" style={{
              fontSize: 'clamp(1.5rem, 5vw, 2rem)'
            }}>
              Investment Options
            </h2>
            <p className="text-lg text-secondary" style={{
              fontSize: 'clamp(1rem, 3vw, 1.125rem)'
            }}>
              Choose from a variety of investment products to diversify your
              portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-4-lg gap-md gap-lg">
            {investmentTypes.map((investment, index) => (
              <div
                key={investment.type}
                className="bg-card rounded-lg p-md p-lg shadow-sm border hover-lift transition animate-slideInUp"
                style={{
                  borderColor: 'var(--border-primary)',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="mb-md">
                  <InvestmentIcon
                    type={investment.type}
                    size="lg"
                    color="var(--accent-primary)"
                  />
                </div>
                <h3 className="font-semibold text-primary mb-sm" style={{
                  fontSize: 'clamp(1rem, 4vw, 1.125rem)'
                }}>
                  {investment.title}
                </h3>
                <p className="text-sm text-secondary" style={{
                  fontSize: 'clamp(0.75rem, 3vw, 0.875rem)'
                }}>
                  {investment.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-xl py-2xl" style={{ background: 'var(--gradient-primary)' }}>
        <div className="container text-center animate-slideInUp">
          <h2 className="font-bold text-primary mb-md" style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)'
          }}>
            Ready to Start Your Investment Journey?
          </h2>
          <p className="mb-lg mb-xl" style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: 'clamp(1rem, 3vw, 1.25rem)'
          }}>
            Join thousands of investors who trust Grip Invest for their financial
            goals.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" style={{
              minWidth: '250px',
              height: '48px'
            }}>
              Create Free Account
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}