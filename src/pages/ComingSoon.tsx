import React from 'react';
import { motion } from 'framer-motion';
import { RiArrowLeftLine, RiTimeLine, RiNotification3Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { NeonButton, GlassCard } from '../components/FuturisticUI';

const ComingSoon: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-4rem)] bg-base-dark text-futuristic-silver p-4 sm:p-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <NeonButton
            variant="secondary"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <RiArrowLeftLine className="mr-2" />
            Go Back
          </NeonButton>
        </motion.div>

        <GlassCard variant="cyber" className="p-6 sm:p-12">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="w-24 h-24 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-holographic-teal to-ai-magenta rounded-full animate-pulse" style={{ filter: 'blur(20px)' }} />
              <div className="relative flex items-center justify-center w-full h-full">
                <RiTimeLine className="w-12 h-12 text-neon-cyan" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-orbitron font-bold bg-gradient-to-r from-neon-cyan via-holographic-teal to-ai-magenta bg-clip-text text-transparent mb-6">
              Enhancement Lab
            </h1>
            
            <p className="text-xl sm:text-2xl text-futuristic-silver/80 font-inter mb-8">
              Our AI engineers are crafting something extraordinary
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="grid gap-6 mb-12">
                <GlassCard variant="cyber" className="p-6 border-neon-cyan/20">
                  <h3 className="text-lg font-orbitron text-neon-cyan mb-2">Advanced AI Enhancement</h3>
                  <p className="text-futuristic-silver/60">
                    Revolutionary image enhancement powered by cutting-edge artificial intelligence.
                  </p>
                </GlassCard>
                
                <GlassCard variant="cyber" className="p-6 border-holographic-teal/20">
                  <h3 className="text-lg font-orbitron text-holographic-teal mb-2">Smart Restoration</h3>
                  <p className="text-futuristic-silver/60">
                    Intelligent algorithms to restore and improve image quality beyond imagination.
                  </p>
                </GlassCard>

                <GlassCard variant="cyber" className="p-6 border-ai-magenta/20">
                  <h3 className="text-lg font-orbitron text-ai-magenta mb-2">Neural Processing</h3>
                  <p className="text-futuristic-silver/60">
                    State-of-the-art neural networks for unparalleled image processing capabilities.
                  </p>
                </GlassCard>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <NeonButton
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto group"
                >
                  <RiNotification3Line className="mr-2 group-hover:animate-bounce" />
                  Notify When Ready
                </NeonButton>
              </div>
            </div>
          </motion.div>
        </GlassCard>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-futuristic-silver/40 text-sm"
        >
          <p>Expected launch: Q2 2024</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ComingSoon; 