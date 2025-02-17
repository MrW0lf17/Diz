import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiArrowLeftLine } from 'react-icons/ri';
import { GlassCard } from '../../components/FuturisticUI';

const FAQs = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto mb-12"
      >
        <Link 
          to="/docs" 
          className="text-neon-cyan hover:text-holographic-teal transition-colors inline-flex items-center mb-8"
        >
          <RiArrowLeftLine className="mr-2" />
          Back to Documentation
        </Link>
        <h1 className="text-4xl sm:text-5xl font-orbitron font-bold bg-gradient-to-r from-neon-cyan via-holographic-teal to-ai-magenta bg-clip-text text-transparent mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-futuristic-silver/80 font-inter">
          Quick answers to common questions about our platform
        </p>
      </motion.div>

      {/* Content Sections */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <div className="space-y-8">
          {/* General Questions */}
          <GlassCard variant="cyber" className="p-8">
            <h2 className="text-2xl font-orbitron text-neon-cyan mb-6">General Questions</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">What is DiToolz Pro?</h3>
                <p className="text-futuristic-silver/80">
                  DiToolz Pro is an AI-powered image editing platform that provides advanced tools for image manipulation,
                  generation, and enhancement using cutting-edge artificial intelligence technology.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">How do I get started?</h3>
                <p className="text-futuristic-silver/80">
                  Simply sign up for an account, choose your subscription plan, and you can start using our tools immediately.
                  Check out our <Link to="/docs/getting-started" className="text-neon-cyan hover:text-holographic-teal">Getting Started guide</Link> for
                  detailed instructions.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Pricing & Plans */}
          <GlassCard variant="cyber" className="p-8" glowColor="magenta">
            <h2 className="text-2xl font-orbitron text-neon-cyan mb-6">Pricing & Plans</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">What plans are available?</h3>
                <p className="text-futuristic-silver/80">
                  We offer Free, Pro, and Enterprise plans. Each plan includes different features and processing quotas.
                  Visit our <Link to="/pricing" className="text-neon-cyan hover:text-holographic-teal">pricing page</Link> for detailed information.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">Can I upgrade or downgrade my plan?</h3>
                <p className="text-futuristic-silver/80">
                  Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Technical Questions */}
          <GlassCard variant="cyber" className="p-8">
            <h2 className="text-2xl font-orbitron text-neon-cyan mb-6">Technical Questions</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">What image formats are supported?</h3>
                <p className="text-futuristic-silver/80">
                  We support PNG, JPEG, and WebP formats. For best results, we recommend using PNG format for maximum quality.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Still Have Questions */}
          <GlassCard variant="cyber" className="p-8" glowColor="magenta">
            <h2 className="text-2xl font-orbitron text-neon-cyan mb-6">Still Have Questions?</h2>
            <p className="text-futuristic-silver/80 mb-6">
              If you couldn't find the answer you're looking for, please contact our support team or check these resources:
            </p>
            <div className="space-y-4">
              <Link to="/docs/tutorials" className="block text-futuristic-silver hover:text-neon-cyan transition-colors">
                Tutorials
              </Link>
              <Link to="/docs/troubleshooting" className="block text-futuristic-silver hover:text-neon-cyan transition-colors">
                Troubleshooting Guide
              </Link>
              <a href="mailto:support@ditoolz.pro" className="block text-futuristic-silver hover:text-neon-cyan transition-colors">
                Contact Support
              </a>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQs; 