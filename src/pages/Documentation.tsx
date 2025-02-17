import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiRocketLine, RiCodeLine, RiBookLine, RiLightbulbLine, RiQuestionLine, RiToolsLine } from 'react-icons/ri';
import { GlassCard } from '../components/FuturisticUI';

const Documentation: React.FC = () => {
  const location = useLocation();
  const isRootPath = location.pathname === '/docs';

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      {isRootPath ? (
        <>
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-orbitron font-bold bg-gradient-to-r from-neon-cyan via-holographic-teal to-ai-magenta bg-clip-text text-transparent mb-4">
              Documentation
            </h1>
            <p className="text-lg text-futuristic-silver/80 font-inter">
              Everything you need to know about our AI-powered tools
            </p>
          </motion.div>

          {/* Documentation Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {docSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <Link to={section.link}>
                    <GlassCard
                      variant="cyber"
                      hover
                      className="h-full p-6 group"
                      glowColor={index % 2 === 0 ? 'cyan' : 'magenta'}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-cyber flex items-center justify-center mr-4">
                            <section.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-orbitron text-futuristic-silver group-hover:text-neon-cyan transition-colors">
                            {section.title}
                          </h3>
                        </div>
                        
                        <p className="text-futuristic-silver/60 font-inter mb-4 flex-grow">
                          {section.description}
                        </p>

                        <div className="flex items-center text-neon-cyan group-hover:text-holographic-teal transition-colors">
                          <span className="text-sm font-orbitron">Learn more</span>
                          <svg
                            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

const docSections = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of using our AI tools and get up to speed quickly',
    icon: RiRocketLine,
    link: '/docs/getting-started'
  },
  {
    title: 'Tutorials',
    description: 'Step-by-step guides for common use cases and advanced techniques',
    icon: RiBookLine,
    link: '/docs/tutorials'
  },
  {
    title: 'Best Practices',
    description: 'Tips and recommendations for achieving optimal results with our tools',
    icon: RiLightbulbLine,
    link: '/docs/best-practices'
  },
  {
    title: 'FAQs',
    description: 'Quick answers to frequently asked questions about our platform',
    icon: RiQuestionLine,
    link: '/docs/faqs'
  },
  {
    title: 'Troubleshooting',
    description: 'Solutions to common issues and technical problems you might encounter',
    icon: RiToolsLine,
    link: '/docs/troubleshooting'
  }
];

export default Documentation; 