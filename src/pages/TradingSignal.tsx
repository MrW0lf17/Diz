import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/FuturisticUI';
import { RiSignalTowerLine, RiLockLine, RiBellLine } from 'react-icons/ri';
import { useToolAction } from '../hooks/useToolAction';

const TradingSignal = () => {
  const handleToolAction = useToolAction('/trading-signal');
  
  const handleNotify = async () => {
    // Check if user has enough coins before proceeding
    const canProceed = await handleToolAction();
    if (!canProceed) return;

    // TODO: Implement notification signup
    alert('Thank you for your interest! We will notify you when this feature becomes available.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-primary to-gray-900 text-light relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-radial-at-t from-secondary/20 via-transparent to-transparent blur-3xl" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-radial-at-b from-accent/20 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-secondary animate-gradient-x">
            AI Trading Signals
          </h1>
          <p className="text-light/60 text-lg max-w-2xl text-center mb-12">
            Get real-time trading signals powered by advanced AI algorithms and predictive analytics.
          </p>

          <GlassCard variant="cyber" className="max-w-2xl w-full p-8 relative">
            {/* Glow effects */}
            <div className="absolute -inset-px bg-gradient-to-r from-secondary/50 via-accent/50 to-secondary/50 rounded-2xl blur-xl opacity-20" />
            <div className="relative">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-secondary to-accent p-[1px]">
                  <div className="w-full h-full rounded-2xl bg-black/30 backdrop-blur-xl flex items-center justify-center">
                    <RiSignalTowerLine className="w-10 h-10 text-light" />
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-light mb-3">Coming Soon</h2>
                  <p className="text-light/60 mb-8">
                    Our advanced AI-powered trading signal system is currently under development.
                    Get ready for intelligent market analysis and real-time trading recommendations.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
                      <h3 className="text-lg font-medium mb-2">Real-time Analysis</h3>
                      <p className="text-light/60 text-sm">
                        Get instant signals based on market movements and AI predictions
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
                      <h3 className="text-lg font-medium mb-2">Smart Alerts</h3>
                      <p className="text-light/60 text-sm">
                        Receive customized notifications for your trading strategies
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNotify}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-accent text-dark font-medium
                      hover:from-secondary/90 hover:to-accent/90 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <RiBellLine className="w-5 h-5" />
                    Notify Me When Available
                  </button>
                </div>

                <div className="flex items-center gap-2 text-accent mt-4">
                  <RiLockLine className="w-5 h-5" />
                  <span className="text-sm font-medium">Pro Feature</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default TradingSignal; 