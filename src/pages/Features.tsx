import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NeonButton, GlassCard } from '../components/FuturisticUI';
import {
  RiImageLine,
  RiScissorsCutLine,
  RiMagicLine,
  RiVideoLine,
  RiRobot2Line,
  RiLineChartLine,
  RiPaintBrushLine,
  RiVoiceprintLine
} from 'react-icons/ri';

const features = [
  {
    category: 'Image Tools',
    items: [
      {
        name: 'AI Image Generation',
        description: 'Create stunning images from text descriptions using state-of-the-art AI models.',
        icon: RiImageLine,
        path: '/ai-image-generation',
        demo: '/assets/demos/image-gen.mp4'
      },
      {
        name: 'Background Removal',
        description: 'Remove backgrounds from images with one click using advanced AI technology.',
        icon: RiScissorsCutLine,
        path: '/bg-remove',
        demo: '/assets/demos/bg-remove.mp4'
      },
      {
        name: 'AI Enhancement',
        description: 'Enhance image quality and resolution using AI-powered upscaling.',
        icon: RiMagicLine,
        path: '/enhance',
        demo: '/assets/demos/enhance.mp4'
      }
    ]
  },
  {
    category: 'Video Tools',
    items: [
      {
        name: 'Text to Video',
        description: 'Generate videos from text descriptions with AI-powered animation.',
        icon: RiVideoLine,
        path: '/text-to-video',
        demo: '/assets/demos/text-to-video.mp4',
        pro: true
      },
      {
        name: 'Motion Brush',
        description: 'Bring still images to life with AI-powered motion effects.',
        icon: RiPaintBrushLine,
        path: '/motion-brush',
        demo: '/assets/demos/motion-brush.mp4',
        pro: true
      },
      {
        name: 'Lipsync',
        description: 'Create realistic lip-sync animations for any audio.',
        icon: RiVoiceprintLine,
        path: '/lipsync',
        demo: '/assets/demos/lipsync.mp4',
        pro: true
      }
    ]
  },
  {
    category: 'AI Tools',
    items: [
      {
        name: 'AI Chat Assistant',
        description: 'Get instant help and creative suggestions from our AI assistant.',
        icon: RiRobot2Line,
        path: '/ai-chat',
        demo: '/assets/demos/ai-chat.mp4'
      },
      {
        name: 'AI Market Analyst',
        description: 'Get AI-powered market insights and trading suggestions.',
        icon: RiLineChartLine,
        path: '/market-analyst',
        demo: '/assets/demos/market-analyst.mp4',
        pro: true
      }
    ]
  }
];

const Features: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-orbitron font-bold bg-gradient-to-r from-neon-cyan via-holographic-teal to-ai-magenta bg-clip-text text-transparent mb-4">
          AI-Powered Features
        </h1>
        <p className="text-lg text-futuristic-silver/80 font-inter">
          Explore our suite of cutting-edge AI tools designed to transform your creative workflow
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto">
        {features.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-orbitron text-futuristic-silver mb-6">
              {category.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((feature, featureIndex) => (
                <Link
                  key={feature.name}
                  to={feature.path}
                  className="block h-full"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: categoryIndex * 0.2 + featureIndex * 0.1
                    }}
                  >
                    <GlassCard
                      variant="cyber"
                      className="h-full group hover:border-neon-cyan/40"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-gradient-cyber flex items-center justify-center">
                              <feature.icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-orbitron text-futuristic-silver group-hover:text-neon-cyan transition-colors">
                                {feature.name}
                              </h3>
                              {feature.pro && (
                                <span className="px-2 py-0.5 text-xs font-orbitron bg-gradient-cyber text-white rounded">
                                  PRO
                                </span>
                              )}
                            </div>
                            <p className="mt-2 text-sm text-futuristic-silver/60 font-inter">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="max-w-4xl mx-auto mt-20"
      >
        <GlassCard variant="cyber" className="p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-orbitron text-futuristic-silver mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-futuristic-silver/80 font-inter mb-8">
            Join thousands of creators using our AI tools to bring their ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <NeonButton
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/auth'}
            >
              Start Creating
            </NeonButton>
            <NeonButton
              variant="secondary"
              size="lg"
              onClick={() => window.location.href = '/pricing'}
            >
              View Pricing
            </NeonButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Features; 