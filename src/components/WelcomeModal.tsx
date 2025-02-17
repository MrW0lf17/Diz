import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, NeonButton } from './FuturisticUI';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-2xl"
        >
          <GlassCard variant="cyber" className="p-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-neon-cyan to-ai-magenta flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-orbitron font-bold text-futuristic-silver">
                Welcome to DIZ! 🎉
              </h2>
              
              <div className="space-y-4 text-futuristic-silver/80 font-inter">
                <p>
                  We've added <span className="text-neon-cyan font-bold">100 free coins</span> to your account and activated your <span className="text-neon-cyan font-bold">3-day Pro trial</span>!
                </p>
                
                <div className="bg-cyber-black/30 p-4 rounded-lg">
                  <h3 className="font-orbitron text-lg mb-2">Quick Start Guide:</h3>
                  <ul className="text-left space-y-2">
                    <li>🎨 Visit the Dashboard to explore all tools</li>
                    <li>💰 Use coins to access premium features</li>
                    <li>⭐ Watch ads to earn more coins</li>
                    <li>🚀 Enjoy your 3-day Pro trial</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-8">
                <NeonButton
                  variant="primary"
                  onClick={() => {
                    onClose();
                    window.location.href = '/dashboard';
                  }}
                >
                  Go to Dashboard
                </NeonButton>
                <NeonButton
                  variant="secondary"
                  onClick={onClose}
                >
                  Got it!
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WelcomeModal; 