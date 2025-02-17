import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/FuturisticUI';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-light relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-radial-at-t from-blue-500/20 via-transparent to-transparent blur-3xl" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-radial-at-b from-blue-400/20 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 animate-gradient-x">
            Privacy Policy
          </h1>
          <p className="text-light/60 text-lg mb-8">
            We are committed to protecting your privacy and personal data
          </p>

          <GlassCard variant="cyber" className="p-8 relative">
            {/* Glow effects */}
            <div className="absolute -inset-px bg-gradient-to-r from-blue-500/50 via-blue-400/50 to-blue-500/50 rounded-2xl blur-xl opacity-20" />
            <div className="relative space-y-8">
              <div className="text-light/60 mb-6">
                Last updated: March 1, 2024
              </div>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                  Introduction
                </h2>
                <p className="text-light/80">
                  We respect your privacy and are committed to protecting your personal data. This privacy 
                  policy explains how we collect, use, and safeguard your information when you use our services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                  Information We Collect
                </h2>
                <ul className="space-y-2 text-light/80">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Account information (email, username)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Usage data and preferences
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Images and files you upload
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Payment information (processed securely by our payment providers)
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                  How We Use Your Information
                </h2>
                <ul className="space-y-2 text-light/80">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    To provide and improve our services
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    To process your transactions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    To communicate with you about our services
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    To ensure the security of our platform
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                  Data Security
                </h2>
                <p className="text-light/80">
                  We implement appropriate security measures to protect your personal information. Your data 
                  is encrypted in transit and at rest, and we regularly review our security practices.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                  Contact Us
                </h2>
                <p className="text-light/80">
                  If you have any questions about our privacy policy, please contact us at{" "}
                  <a 
                    href="mailto:privacy@example.com" 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    privacy@example.com
                  </a>
                </p>
              </section>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy; 