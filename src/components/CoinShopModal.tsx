import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoins } from '../contexts/CoinContext';
import { COIN_PACKAGES } from '../contexts/CoinContext';
import GlassCard from './ui/GlassCard';
import NeonButton from './ui/NeonButton';

interface CoinShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CoinShopModal: React.FC<CoinShopModalProps> = ({ isOpen, onClose }) => {
  const { balance, earnCoinsFromAd, purchaseCoins } = useCoins();

  const handlePurchase = async (packageId: string) => {
    const success = await purchaseCoins(packageId);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-5xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <GlassCard variant="cyber" className="p-4 sm:p-6">
            {/* Close Button - More visible on mobile */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 text-futuristic-silver/60 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Current Balance */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-orbitron font-bold text-futuristic-silver mb-2">Your NUT Balance</h2>
              <p className="text-3xl sm:text-4xl font-bold text-ai-magenta font-orbitron">{balance}</p>
              <p className="text-futuristic-silver/60 text-xs sm:text-sm mt-2">Purchase more coins to unlock premium features</p>
            </div>

            {/* Coin Packages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {COIN_PACKAGES.map((pkg) => (
                <GlassCard
                  key={pkg.id}
                  variant="cyber"
                  className={`p-4 sm:p-6 relative ${pkg.isPopular ? 'border-neon-cyan' : ''}`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-3 sm:px-4 py-1 bg-gradient-to-r from-neon-cyan to-ai-magenta rounded-full text-xs font-orbitron text-white whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-orbitron font-bold text-futuristic-silver mb-2">{pkg.name}</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-neon-cyan font-orbitron mb-1">
                      {pkg.coins} <span className="text-xs sm:text-sm">NUT</span>
                    </p>
                    {pkg.bonus > 0 && (
                      <p className="text-ai-magenta text-xs sm:text-sm font-medium mb-2">+{pkg.bonus} Bonus</p>
                    )}
                    <p className="text-xl sm:text-2xl text-futuristic-silver font-orbitron mb-3 sm:mb-4">${pkg.price}</p>
                    <NeonButton
                      variant={pkg.isPopular ? 'primary' : 'secondary'}
                      onClick={() => handlePurchase(pkg.id)}
                      className="w-full text-sm sm:text-base"
                    >
                      Purchase
                    </NeonButton>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Watch Ad Option */}
            <div className="text-center mt-6 sm:mt-8">
              <NeonButton
                variant="primary"
                onClick={earnCoinsFromAd}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Ad for 5 Coins
              </NeonButton>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CoinShopModal; 