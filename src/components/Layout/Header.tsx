import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useCoins } from '../../contexts/CoinContext';
import { NeonButton } from '../FuturisticUI';
import CoinShopModal from '../CoinShopModal';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const { user, signOut, signInWithGoogle, signInWithTestCredentials, isTestLoginLoading } = useAuth();
  const { balance } = useCoins();
  const isDevelopment = import.meta.env.DEV;
  const navigate = useNavigate();

  const handleTestLogin = async () => {
    try {
      await signInWithTestCredentials();
    } catch (error) {
      // Error is already handled in AuthContext
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="relative z-50">
      {/* Glass background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md border-b border-white/10 pointer-events-none" />
      
      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pointer-events-auto" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <a
              href={user ? '/dashboard' : '/'}
              onClick={handleLogoClick}
              className="flex items-center active:opacity-80 transition-opacity"
            >
              <motion.img 
                src="/nutlogo.png"
                alt="DiToolz Logo" 
                className="h-10 w-10 mr-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="text-4xl font-orbitron font-bold relative">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-neon-cyan to-holographic-teal bg-clip-text text-transparent inline-block"
                >
                  DI
                </motion.span>
                <motion.span
                  className="animate-z-fade bg-gradient-to-r from-neon-cyan to-holographic-teal bg-clip-text text-transparent inline-block"
                >
                  Z
                </motion.span>
                <motion.span
                  className="animate-toolz-expand bg-gradient-to-r from-neon-cyan to-holographic-teal bg-clip-text text-transparent absolute left-[1.3ch] whitespace-nowrap"
                >
                  TOOLZ
                </motion.span>
              </div>
            </a>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 mr-2">
                    <button
                      onClick={() => setIsShopOpen(true)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors border border-white/10"
                    >
                      <span className="text-lg font-orbitron text-neon-cyan">{balance}</span>
                      <span className="text-metallic-gold">coins</span>
                      <svg className="w-4 h-4 text-neon-cyan ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                  <NeonButton
                    variant="accent"
                    onClick={() => window.location.href = '/gallery'}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Gallery
                  </NeonButton>
                  <NeonButton
                    variant="secondary"
                    onClick={() => {
                      console.log('Header: Sign out clicked');
                      signOut();
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </NeonButton>
                </>
              ) : (
                <>
                  {isDevelopment && (
                    <NeonButton
                      variant="accent"
                      onClick={handleTestLogin}
                      disabled={isTestLoginLoading}
                    >
                      {isTestLoginLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          Dev Login
                        </>
                      )}
                    </NeonButton>
                  )}
                  <NeonButton
                    variant="primary"
                    onClick={signInWithGoogle}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </NeonButton>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2.5 text-white hover:bg-white/10 active:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
        
        {/* Mobile menu container */}
        <div className={`lg:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden pointer-events-auto"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="fixed inset-y-0 right-0 w-full max-w-xs bg-black/40 backdrop-blur-md p-6 overflow-y-auto z-50 border-l border-white/10 pointer-events-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-xl font-bold text-white">Menu</div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white hover:text-blue-400 active:text-blue-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  <div className="space-y-4">
                    {user ? (
                      <>
                        <button
                          onClick={() => setIsShopOpen(true)}
                          className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors border border-white/10 mb-4"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-orbitron text-neon-cyan">{balance}</span>
                            <span className="text-metallic-gold">coins</span>
                          </div>
                          <svg className="w-4 h-4 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                        <NeonButton
                          variant="accent"
                          onClick={() => window.location.href = '/gallery'}
                          className="w-full"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Gallery
                        </NeonButton>
                        <NeonButton
                          variant="secondary"
                          onClick={() => {
                            console.log('Header Mobile: Sign out clicked');
                            signOut();
                          }}
                          className="w-full"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </NeonButton>
                      </>
                    ) : (
                      <>
                        {isDevelopment && (
                          <NeonButton
                            variant="accent"
                            onClick={handleTestLogin}
                            disabled={isTestLoginLoading}
                            className="w-full"
                          >
                            {isTestLoginLoading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                Dev Login
                              </>
                            )}
                          </NeonButton>
                        )}
                        <NeonButton
                          variant="primary"
                          onClick={signInWithGoogle}
                          className="w-full"
                        >
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Continue with Google
                        </NeonButton>
                      </>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </nav>
      <CoinShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </header>
  );
};

export default Header; 