import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/FuturisticUI';

const Terms = () => {
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
            Terms of Service
          </h1>
          <p className="text-light/60 text-lg mb-8">
            Please read these terms carefully before using our services
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
                  1. Acceptance of Terms
                </h2>
                <p className="text-light/80">
                  By accessing or using our services, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                  2. Use of Services
                </h2>
                <ul className="space-y-2 text-light/80">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    You must be at least 13 years old to use our services
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    You are responsible for maintaining the security of your account
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    You agree not to misuse our services or help anyone else do so
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    You must comply with all applicable laws and regulations
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                  3. Content Guidelines
                </h2>
                <p className="text-light/80">
                  You retain ownership of any content you upload to our platform. However, by using our 
                  services, you grant us a license to use, store, and share your content as necessary to 
                  provide our services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                  4. Service Changes and Availability
                </h2>
                <p className="text-light/80">
                  We reserve the right to modify, suspend, or discontinue any part of our services at any 
                  time. We will provide reasonable notice of any significant changes.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                  5. Limitation of Liability
                </h2>
                <p className="text-light/80">
                  Our services are provided "as is" without any warranties. We are not liable for any 
                  damages arising from your use of our services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                  6. Contact Information
                </h2>
                <p className="text-light/80">
                  For questions about these terms, please contact us at{" "}
                  <a 
                    href="mailto:legal@example.com" 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    legal@example.com
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

export default Terms; 