import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/FuturisticUI';
import { RiVideoLine, RiLockLine } from 'react-icons/ri';
import { useToolAction } from '../hooks/useToolAction';

const TextToVideo = () => {
  const handleToolAction = useToolAction('/text-to-video');
  
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
            Text to Video
          </h1>
          <p className="text-light/60 text-lg max-w-2xl text-center mb-12">
            Transform your text descriptions into stunning video content with AI-powered animation.
          </p>

          <GlassCard variant="cyber" className="max-w-2xl w-full p-8 relative">
            {/* Glow effects */}
            <div className="absolute -inset-px bg-gradient-to-r from-secondary/50 via-accent/50 to-secondary/50 rounded-2xl blur-xl opacity-20" />
            <div className="relative">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-secondary to-accent p-[1px]">
                  <div className="w-full h-full rounded-2xl bg-black/30 backdrop-blur-xl flex items-center justify-center">
                    <RiVideoLine className="w-10 h-10 text-light" />
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-light mb-3">Coming Soon</h2>
                  <p className="text-light/60 mb-8">
                    We're working hard to bring you powerful text to video generation capabilities.
                    Stay tuned for updates!
                  </p>
                </div>

                <div className="flex items-center gap-2 text-accent">
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

export default TextToVideo; 