import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NeonButton, GlassCard } from '../components/FuturisticUI';
import { RiTeamLine, RiRocketLine, RiBrainLine, RiShieldLine } from 'react-icons/ri';

const values = [
  {
    title: 'Innovation First',
    description: 'Pushing the boundaries of AI technology to create tools that empower creators.',
    icon: RiRocketLine,
  },
  {
    title: 'AI Ethics',
    description: 'Committed to responsible AI development and transparent practices.',
    icon: RiBrainLine,
  },
  {
    title: 'User Privacy',
    description: 'Your data security and privacy are our top priorities.',
    icon: RiShieldLine,
  },
  {
    title: 'Community Driven',
    description: 'Built by creators, for creators, with continuous community feedback.',
    icon: RiTeamLine,
  },
];

const About: React.FC = () => {
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
          Our Mission
        </h1>
        <p className="text-lg text-futuristic-silver/80 font-inter">
          Empowering creators with cutting-edge AI tools to bring their visions to life
        </p>
      </motion.div>

      {/* Story Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <GlassCard variant="cyber" className="p-8">
          <h2 className="text-2xl font-orbitron text-futuristic-silver mb-6">
            Our Story
          </h2>
          <div className="space-y-4 text-futuristic-silver/80 font-inter">
            <p>
              DiToolz was born from a simple idea: make advanced AI technology accessible to everyone. 
              What started as a passion project among AI researchers and creative technologists has grown 
              into a comprehensive suite of AI-powered creative tools.
            </p>
            <p>
              Today, we're proud to serve thousands of creators worldwide, from individual artists 
              to enterprise teams, helping them push the boundaries of what's possible in digital creation.
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Values Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-7xl mx-auto mb-16"
      >
        <h2 className="text-2xl font-orbitron text-futuristic-silver mb-8 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <GlassCard variant="cyber" className="p-6 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-lg bg-gradient-cyber flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-orbitron text-futuristic-silver mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-futuristic-silver/60 font-inter">
                    {value.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="max-w-7xl mx-auto mb-16"
      >
        <h2 className="text-2xl font-orbitron text-futuristic-silver mb-8 text-center">
          Our Team
        </h2>
        <GlassCard variant="cyber" className="p-8">
          <div className="text-center">
            <p className="text-futuristic-silver/80 font-inter mb-8">
              We're a diverse team of AI researchers, engineers, designers, and creators, 
              united by our passion for innovation and creativity.
            </p>
            <Link to="/careers">
              <NeonButton variant="primary">
                Join Our Team
              </NeonButton>
            </Link>
          </div>
        </GlassCard>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <GlassCard variant="cyber" className="p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-orbitron text-futuristic-silver mb-4">
            Be Part of Our Journey
          </h2>
          <p className="text-lg text-futuristic-silver/80 font-inter mb-8">
            Join thousands of creators who are already using DiToolz to bring their ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <NeonButton
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/auth'}
            >
              Get Started
            </NeonButton>
            <NeonButton
              variant="secondary"
              size="lg"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Us
            </NeonButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default About; 