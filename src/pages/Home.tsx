import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NeonButton, GlassCard } from '../components/FuturisticUI';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    title: 'AI Image Generation',
    description: 'Create stunning images from text descriptions using state-of-the-art AI models.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    link: '/ai-image-generation',
  },
  {
    title: 'Background Removal',
    description: 'Remove backgrounds from images with one click using advanced AI technology.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    link: '/bg-remove',
  },
  {
    title: 'Image Enhancement',
    description: 'Enhance image quality and resolution using AI-powered upscaling.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    link: '/enhance',
  },
];

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartCreating = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-orbitron font-bold bg-gradient-to-r from-neon-cyan via-holographic-teal to-ai-magenta bg-clip-text text-transparent"
            >
              Next-Gen AI Image Tools
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-4 text-xl text-futuristic-silver/80 max-w-3xl mx-auto font-inter"
            >
              Transform your creative workflow with our suite of AI-powered image editing tools.
              Generate, enhance, and manipulate images with unprecedented ease.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 flex justify-center gap-4"
            >
              <NeonButton size="lg" variant="primary" onClick={handleStartCreating}>
                {user ? 'Go to Dashboard' : 'Start Creating'}
              </NeonButton>
              <NeonButton size="lg" variant="secondary" onClick={() => navigate('/pricing')}>
                View Pricing
              </NeonButton>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Link to={feature.link}>
                  <GlassCard
                    hover
                    variant="cyber"
                    glowColor={index % 2 === 0 ? 'cyan' : 'magenta'}
                    className="h-full p-6"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-cyber text-white mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-orbitron font-semibold text-futuristic-silver mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-futuristic-silver/70 font-inter">
                      {feature.description}
                    </p>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard
            variant="cyber"
            glowColor="bronze"
            className="p-8 sm:p-12 text-center"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-orbitron font-bold bg-gradient-to-r from-neon-cyan to-ai-magenta bg-clip-text text-transparent mb-4"
            >
              Ready to Transform Your Creative Process?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-futuristic-silver/80 max-w-3xl mx-auto mb-8 font-inter"
            >
              Join thousands of creators using DiToolz Pro to bring their ideas to life.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center gap-4"
            >
              <NeonButton size="lg" variant="accent" onClick={() => navigate('/auth')}>
                Get Started Now
              </NeonButton>
            </motion.div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default Home; 