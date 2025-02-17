import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './FuturisticUI';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  adDuration?: number; // in seconds
}

const AdModal: React.FC<AdModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  adDuration = 30
}) => {
  const [timeLeft, setTimeLeft] = useState(adDuration);
  const [adLoaded, setAdLoaded] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(adDuration);
      setHasCompleted(false);
      return;
    }

    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !hasCompleted) {
      setHasCompleted(true);
      onComplete();
      onClose();
    }
  }, [isOpen, timeLeft, onComplete, adDuration, hasCompleted, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Initialize Google AdSense ad
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        }
      } catch (error) {
        console.error('Error loading AdSense ad:', error);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
    >
      <GlassCard variant="cyber" className="w-full max-w-2xl p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-orbitron font-bold text-futuristic-silver mb-2">
            Watch Ad to Earn Coins
          </h3>
          <p className="text-futuristic-silver/60">
            Time remaining: <span className="text-neon-cyan">{timeLeft}s</span>
          </p>
          {/* Progress bar */}
          <div className="w-full h-2 bg-cyber-black/30 rounded-full mt-2">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-cyan to-ai-magenta rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / adDuration) * 100}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Ad Container */}
        <div className="relative w-full aspect-video bg-cyber-black/30 rounded-lg overflow-hidden">
          {!adLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-cyan" />
            </div>
          )}
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID}
            data-ad-slot={import.meta.env.VITE_ADSENSE_SLOT_ID}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-futuristic-silver/60 text-sm">
            Please wait {timeLeft} seconds to claim your reward
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default AdModal; 