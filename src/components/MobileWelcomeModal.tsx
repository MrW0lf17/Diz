import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, NeonButton } from './FuturisticUI';
import { RiArrowRightLine, RiCloseLine } from 'react-icons/ri';

interface MobileWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileWelcomeModal: React.FC<MobileWelcomeModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to DIZ! 🎉",
      content: (
        <div className="space-y-3">
          <p className="text-futuristic-silver/80">
            You've received <span className="text-neon-cyan font-bold">100 free coins</span> and <span className="text-neon-cyan font-bold">3 days of Pro access</span>!
          </p>
          <div className="w-16 h-16 mx-auto my-4 rounded-full bg-gradient-to-r from-neon-cyan to-ai-magenta flex items-center justify-center">
            <span className="text-2xl">🎁</span>
          </div>
        </div>
      )
    },
    {
      title: "Quick Navigation 📱",
      content: (
        <div className="space-y-3">
          <div className="bg-cyber-black/30 p-3 rounded-lg text-sm">
            <p className="mb-2">To access tools:</p>
            <ol className="space-y-2 text-left">
              <li>1. Tap the menu icon ☰</li>
              <li>2. Browse available tools</li>
              <li>3. Tap to use a tool</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: "Earn More Coins 💰",
      content: (
        <div className="space-y-3">
          <div className="bg-cyber-black/30 p-3 rounded-lg text-sm">
            <ul className="space-y-2 text-left">
              <li>👀 Watch ads for free coins</li>
              <li>⭐ Complete daily tasks</li>
              <li>🚀 Enjoy your Pro trial</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="w-full max-w-sm"
        >
          <GlassCard variant="cyber" className="p-6 m-4 relative">
            {/* Close button */}
            {currentStep === steps.length - 1 && (
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-2 text-futuristic-silver/60"
              >
                <RiCloseLine className="w-5 h-5" />
              </button>
            )}

            {/* Progress indicator */}
            <div className="flex justify-center space-x-1 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-8 rounded-full transition-colors ${
                    index === currentStep ? 'bg-neon-cyan' : 'bg-futuristic-silver/20'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="text-center space-y-4">
              <h2 className="text-xl font-orbitron font-bold text-futuristic-silver">
                {steps[currentStep].title}
              </h2>
              
              <div className="min-h-[120px] flex items-center justify-center">
                {steps[currentStep].content}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-center pt-4">
                {currentStep < steps.length - 1 ? (
                  <NeonButton
                    variant="primary"
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="w-full"
                  >
                    <span>Next</span>
                    <RiArrowRightLine className="ml-2" />
                  </NeonButton>
                ) : (
                  <NeonButton
                    variant="primary"
                    onClick={() => {
                      onClose();
                      window.location.href = '/dashboard';
                    }}
                    className="w-full"
                  >
                    Start Creating
                  </NeonButton>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MobileWelcomeModal; 