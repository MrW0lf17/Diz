import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCoins } from '../contexts/CoinContext';
import { NeonButton, GlassCard } from '../components/FuturisticUI';
import { COIN_PACKAGES } from '../contexts/CoinContext';
import { toast } from 'react-hot-toast';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance, purchaseCoins, convertToPremium } = useCoins();

  const handlePurchase = async (packageId: string) => {
    try {
      // Get the selected package
      const selectedPackage = COIN_PACKAGES.find(pkg => pkg.id === packageId);
      if (!selectedPackage) {
        throw new Error('Invalid package selected');
      }

      // Create a Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId,
          priceId: selectedPackage.stripePriceId,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
    }
  };

  const handlePremiumConversion = async (days: number) => {
    await convertToPremium(days);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-orbitron font-bold bg-gradient-to-r from-neon-cyan via-holographic-teal to-ai-magenta bg-clip-text text-transparent mb-4">
          NUT Coins & Premium Access
        </h1>
        <p className="text-lg text-futuristic-silver/80 font-inter">
          Purchase coins or convert them to premium time
        </p>
      </motion.div>

      {/* Coin Packages */}
      <h2 className="text-2xl font-orbitron text-futuristic-silver mb-6">Coin Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {COIN_PACKAGES.map((pkg) => (
          <GlassCard key={pkg.id} variant="cyber" className="p-6">
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="text-xl font-orbitron text-futuristic-silver mb-2">{pkg.coins} Coins</h3>
                {pkg.bonus > 0 && (
                  <p className="text-neon-cyan text-sm mb-4">+{pkg.bonus} Bonus Coins</p>
                )}
                <p className="text-2xl font-bold text-holographic-teal mb-4">${pkg.price}</p>
              </div>
              <button
                onClick={() => handlePurchase(pkg.id)}
                className="w-full py-2 rounded-lg font-orbitron bg-gradient-cyber text-white transition-opacity hover:opacity-90"
              >
                Purchase
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Premium Conversion */}
      <h2 className="text-2xl font-orbitron text-futuristic-silver mb-6">Convert Coins to Premium</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { days: 1, coins: 100, label: '1 Day' },
          { days: 3, coins: 250, label: '3 Days', popular: true },
          { days: 7, coins: 500, label: '7 Days' },
          { days: 30, coins: 1800, label: '30 Days' }
        ].map((option) => (
          <GlassCard
            key={option.days}
            variant="cyber"
            className={`p-6 relative ${option.popular ? 'border-neon-cyan' : ''}`}
          >
            {option.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-1 bg-gradient-to-r from-neon-cyan to-ai-magenta rounded-full text-xs font-orbitron text-white whitespace-nowrap">
                  Best Value
                </span>
              </div>
            )}
            <div className="text-center">
              <h3 className="text-lg font-orbitron font-bold text-futuristic-silver mb-2">{option.label}</h3>
              <p className="text-3xl font-bold text-neon-cyan font-orbitron mb-1">
                {option.coins} <span className="text-sm">NUT</span>
              </p>
              <p className="text-futuristic-silver/60 text-sm mb-4">
                {(option.coins / option.days).toFixed(1)} NUT/day
              </p>
              <NeonButton
                variant={option.popular ? 'primary' : 'secondary'}
                onClick={() => handlePremiumConversion(option.days)}
                disabled={balance < option.coins}
                className="w-full"
              >
                {balance < option.coins ? (
                  <>Need {option.coins - balance} more</>
                ) : (
                  <>Convert to {option.label}</>
                )}
              </NeonButton>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Current Balance Display */}
      <GlassCard variant="cyber" className="p-6 mb-12">
        <div className="text-center">
          <h2 className="text-xl font-orbitron font-bold text-futuristic-silver mb-2">Your NUT Balance</h2>
          <p className="text-4xl font-bold text-ai-magenta font-orbitron">{balance}</p>
        </div>
      </GlassCard>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="max-w-4xl mx-auto mt-20"
      >
        <h2 className="text-2xl sm:text-3xl font-orbitron text-center text-futuristic-silver mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6">
          <GlassCard variant="cyber" className="p-6">
            <h3 className="text-lg font-orbitron text-neon-cyan mb-2">
              What can I do with NUT coins?
            </h3>
            <p className="text-futuristic-silver/80 font-inter">
              NUT coins can be used to access premium features and tools. You can also convert them to premium time for unlimited access.
            </p>
          </GlassCard>
          <GlassCard variant="cyber" className="p-6">
            <h3 className="text-lg font-orbitron text-neon-cyan mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-futuristic-silver/80 font-inter">
              We accept all major credit cards, PayPal, and cryptocurrency payments for coin purchases.
            </p>
          </GlassCard>
          <GlassCard variant="cyber" className="p-6">
            <h3 className="text-lg font-orbitron text-neon-cyan mb-2">
              Do coins expire?
            </h3>
            <p className="text-futuristic-silver/80 font-inter">
              No, your NUT coins never expire and can be used at any time for premium features or conversion to premium time.
            </p>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
};

export default Pricing; 