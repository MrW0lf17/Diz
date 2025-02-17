import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiArrowLeftLine } from 'react-icons/ri';
import { GlassCard } from '../../components/FuturisticUI';

const Troubleshooting = () => {
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
          Troubleshooting
        </h1>
        <p className="text-lg text-futuristic-silver/80 font-inter">
          Solutions to common issues and technical problems
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
          {/* Common Issues */}
          <GlassCard variant="cyber" className="p-8">
            <h2 className="text-2xl font-orbitron text-neon-cyan mb-6">Common Issues</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">Image Processing Errors</h3>
                <p className="text-futuristic-silver/80 mb-4">
                  If you're experiencing issues with image processing, try these solutions:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-futuristic-silver/80">
                  <li>Ensure your image meets the minimum resolution requirements (1024x1024 pixels)</li>
                  <li>Check if the file format is supported (PNG, JPEG, or WebP)</li>
                  <li>Verify that the file size is under the maximum limit (10MB)</li>
                  <li>Try processing the image in smaller batches if dealing with multiple files</li>
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* Error Messages */}
          <GlassCard variant="cyber" className="p-8" glowColor="magenta">
            <h2 className="text-2xl font-orbitron text-neon-cyan mb-6">Error Messages</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">Error Code: 1001 - Invalid Input</h3>
                <p className="text-futuristic-silver/80">
                  This error occurs when the input image doesn't meet our requirements. Make sure your image
                  follows our <Link to="/docs/best-practices" className="text-neon-cyan hover:text-holographic-teal">image quality guidelines</Link>.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">Error Code: 1002 - Rate Limit Exceeded</h3>
                <p className="text-futuristic-silver/80">
                  You've reached your plan's processing limit. Consider upgrading your plan or waiting until
                  your quota resets.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-futuristic-silver mb-3">Error Code: 1003 - Processing Failed</h3>
                <p className="text-futuristic-silver/80">
                  A general processing error occurred. Try reducing the complexity of your request or
                  contact support if the issue persists.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Performance Optimization */}
          <GlassCard variant="cyber" className="p-8">
            <h2 className="text-2xl font-orbitron text-neon-cyan mb-6">Performance Optimization</h2>
            <p className="text-futuristic-silver/80 mb-4">
              If you're experiencing slow performance, consider these optimization tips:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-futuristic-silver/80">
              <li>Compress images before uploading to reduce processing time</li>
              <li>Implement proper caching strategies</li>
              <li>Use batch processing for multiple images</li>
              <li>Optimize your network connection and reduce latency</li>
            </ul>
          </GlassCard>

          {/* Need More Help */}
          <GlassCard variant="cyber" className="p-8" glowColor="magenta">
            <h2 className="text-2xl font-orbitron text-neon-cyan mb-6">Need More Help?</h2>
            <p className="text-futuristic-silver/80 mb-6">
              If you're still experiencing issues, you can:
            </p>
            <div className="space-y-4">
              <Link to="/docs/best-practices" className="block text-futuristic-silver hover:text-neon-cyan transition-colors">
                Check our Best Practices
              </Link>
              <a href="mailto:support@ditoolz.pro" className="block text-futuristic-silver hover:text-neon-cyan transition-colors">
                Contact our Support Team
              </a>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
};

export default Troubleshooting; 