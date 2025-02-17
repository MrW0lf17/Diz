import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiArrowLeftLine } from 'react-icons/ri';
import { GlassCard } from '../../components/FuturisticUI';

const BestPractices = () => {
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
          Best Practices
        </h1>
        <p className="text-lg text-futuristic-silver/80 font-inter">
          Tips and recommendations for achieving optimal results with our tools
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
          {/* Image Quality Guidelines */}
          <GlassCard variant="cyber" className="p-8">
            <h2 className="text-2xl font-orbitron text-neon-cyan mb-6">Image Quality Guidelines</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">Input Image Resolution</h3>
                <p className="text-futuristic-silver/80">
                  Use images with a minimum resolution of 1024x1024 pixels for best results.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">File Formats</h3>
                <p className="text-futuristic-silver/80">
                  Supported formats include PNG, JPEG, and WebP. PNG is recommended for highest quality.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">File Size</h3>
                <p className="text-futuristic-silver/80">
                  Keep file sizes under 10MB for optimal processing speed.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Performance Optimization */}
          <GlassCard variant="cyber" className="p-8" glowColor="magenta">
            <h2 className="text-2xl font-orbitron text-neon-cyan mb-6">Performance Optimization</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">Batch Processing</h3>
                <p className="text-futuristic-silver/80">
                  Process multiple images in batch for improved efficiency.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">Caching Strategy</h3>
                <p className="text-futuristic-silver/80">
                  Cache processed images to reduce redundant processing.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Security Recommendations */}
          <GlassCard variant="cyber" className="p-8">
            <h2 className="text-2xl font-orbitron text-neon-cyan mb-6">Security Recommendations</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">Content Validation</h3>
                <p className="text-futuristic-silver/80">
                  Implement proper input validation and sanitization.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">Access Control</h3>
                <p className="text-futuristic-silver/80">
                  Use role-based access control for different feature sets.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Related Resources */}
          <GlassCard variant="cyber" className="p-8" glowColor="magenta">
            <h2 className="text-2xl font-orbitron text-neon-cyan mb-6">Related Resources</h2>
            <div className="space-y-4">
              <Link to="/docs/tutorials" className="block text-futuristic-silver hover:text-neon-cyan transition-colors">
                Tutorials
              </Link>
              <Link to="/docs/troubleshooting" className="block text-futuristic-silver hover:text-neon-cyan transition-colors">
                Troubleshooting Guide
              </Link>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
};

export default BestPractices; 