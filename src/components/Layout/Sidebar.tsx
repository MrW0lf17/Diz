import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { GlassCard } from '../FuturisticUI';
import { useCoins } from '../../contexts/CoinContext';
import CoinShopModal from '../CoinShopModal';

const toolCategories = [
  {
    category: "Image Tools",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    tools: [
      { 
        name: 'AI Image Generation',
        path: '/ai-image-generation',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        pro: false
      },
      { 
        name: 'Remove Background',
        path: '/bg-remove',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        pro: false
      },
      {
        name: 'AI Generative Fill',
        path: '/gen-fill',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
        ),
        pro: true
      },
      {
        name: 'Image Enhancer',
        path: '/enhance',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        ),
        pro: false
      },
      {
        name: 'Expand',
        path: '/expand',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        ),
        pro: true
      },
      {
        name: 'Resize',
        path: '/resize',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        ),
        pro: false
      }
    ]
  },
  {
    category: "Video Tools",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    tools: [
      {
        name: 'Text to Video',
        path: '/text-to-video',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        ),
        pro: true
      },
      {
        name: 'Image to Video',
        path: '/image-to-video',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        pro: true
      },
      {
        name: 'Motion Brush',
        path: '/motion-brush',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21l2-2m2-2l2-2m2-2l2-2" />
          </svg>
        ),
        pro: true
      },
      {
        name: 'Lipsync',
        path: '/lipsync',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        ),
        pro: true
      },
    ]
  },
  {
    category: "Trading Tools",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    tools: [
      {
        name: 'AI Market Analyst',
        path: '/market-analyst',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        pro: true
      },
      {
        name: 'AI Trend Catcher',
        path: '/trend-catcher',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
        pro: true
      },
      {
        name: 'AI Indicator Creator',
        path: '/indicator-creator',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5M8 8v8m-4-8v8m0-8h20" />
          </svg>
        ),
        pro: true
      },
      {
        name: 'AI Signal',
        path: '/trading-signal',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
        pro: true
      }
    ]
  },
  {
    category: "Text Tools",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    tools: [
      {
        name: 'AI Chat',
        path: '/ai-chat',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
        pro: false
      }
    ]
  }
];

const Sidebar: React.FC<{ onCloseSidebar?: () => void }> = ({ onCloseSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance, useCoinsForTool } = useCoins();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showCoinShopModal, setShowCoinShopModal] = useState(false);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleToolClick = async (tool: any, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Close sidebar on mobile when tool is selected
    if (window.innerWidth < 1024 && onCloseSidebar) {
      onCloseSidebar();
    }

    if (user?.user_metadata?.is_premium) {
      navigate(tool.path);
      return;
    }

    if (tool.pro && !user?.user_metadata?.is_premium) {
      toast.error('This feature requires a premium subscription');
      navigate('/pricing');
      return;
    }

    const success = await useCoinsForTool(tool.path);
    if (!success) {
      toast.error('Not enough coins! Purchase more or watch ads to earn coins.');
      setShowCoinShopModal(true);
      return;
    }

    navigate(tool.path);
  };

  return (
    <>
      <div className="h-full flex flex-col bg-black/30 backdrop-blur-md border-r border-white/10">
        {/* Spacer for mobile view */}
        <div className="h-14 lg:h-0"></div>
        
        {/* Balance Card - Sticky at top */}
        <div className="sticky top-14 lg:top-0 z-10 px-2 pt-2 pb-2 bg-black/30 backdrop-blur-md">
          <GlassCard variant="cyber" className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-orbitron text-futuristic-silver">Balance</span>
              <div className="flex items-center space-x-2">
                <span className="text-neon-cyan">{balance}</span>
                <button
                  onClick={() => setShowCoinShopModal(true)}
                  className="text-metallic-gold hover:text-holographic-teal transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 2a6 6 0 100 12 6 6 0 000-12z" />
                  </svg>
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="relative flex-1 flex flex-col min-h-0 overflow-y-auto touch-pan-y">
          <nav className="flex-1 px-2 pt-3 pb-4 space-y-2">
            {toolCategories.map((category) => (
              <div key={category.category} className="mb-3">
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full flex items-center p-1.5 text-white hover:bg-white/5 rounded-lg transition-colors active:bg-white/10 touch-manipulation"
                >
                  <GlassCard
                    variant="cyber"
                    hover={false}
                    className={`w-full transition-all duration-200 ${
                      expandedCategories.includes(category.category)
                        ? 'bg-gradient-cyber bg-opacity-20'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <div className={`text-neon-cyan transition-colors duration-200 ${
                          expandedCategories.includes(category.category)
                            ? 'text-holographic-teal'
                            : 'group-hover:text-holographic-teal'
                        }`}>
                          {category.icon}
                        </div>
                        <span className="font-orbitron text-sm text-futuristic-silver">
                          {category.category}
                        </span>
                      </div>
                      <motion.div
                        animate={{
                          rotate: expandedCategories.includes(category.category) ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="text-futuristic-silver/60"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    </div>
                  </GlassCard>
                </button>
                
                <AnimatePresence>
                  {expandedCategories.includes(category.category) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 ml-4 space-y-1 overflow-hidden"
                    >
                      {category.tools.map((tool) => {
                        const isActive = location.pathname === tool.path;
                        return (
                          <motion.div
                            key={tool.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Link
                              to={tool.path}
                              onClick={(e) => handleToolClick(tool, e)}
                              className={`group flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                isActive
                                  ? 'bg-gradient-cyber text-white'
                                  : 'text-futuristic-silver/60 hover:text-futuristic-silver hover:bg-white/5'
                              }`}
                            >
                              <div className={`mr-3 transition-colors duration-200 ${
                                isActive ? 'text-white' : 'text-futuristic-silver/60 group-hover:text-neon-cyan'
                              }`}>
                                {tool.icon}
                              </div>
                              <span className="font-inter">{tool.name}</span>
                              {tool.pro && (
                                <span className="ml-auto flex items-center">
                                  <span className="px-1.5 py-0.5 text-xs font-orbitron bg-gradient-cyber text-white rounded">
                                    PRO
                                  </span>
                                </span>
                              )}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <CoinShopModal
        isOpen={showCoinShopModal}
        onClose={() => setShowCoinShopModal(false)}
      />
    </>
  );
};

export default Sidebar; 