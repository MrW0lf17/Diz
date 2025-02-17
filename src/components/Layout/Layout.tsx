import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { HolographicBackground } from '../FuturisticUI';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

  // Close sidebar by default on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <HolographicBackground />
      
      {/* Glass overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-none" />
      
      <div className="relative z-10">
        <Header />
        <div className="flex min-h-[calc(100vh-4rem)] relative">
          <AnimatePresence>
            {user && (
              <>
                {/* Sidebar Toggle Button - Mobile */}
                <motion.button
                  type="button"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden fixed bottom-4 right-4 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/80 text-white shadow-lg hover:bg-blue-400/80 active:bg-blue-600/80 backdrop-blur-sm transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">Toggle Sidebar</span>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isSidebarOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </motion.button>

                {/* Sidebar */}
                <motion.div
                  initial={{ x: -320 }}
                  animate={{ x: isSidebarOpen ? 0 : -320 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="fixed inset-y-0 left-0 z-30 w-64 lg:relative bg-black/40 backdrop-blur-md border-r border-white/10"
                >
                  <Sidebar onCloseSidebar={() => setIsSidebarOpen(false)} />
                </motion.div>

                {/* Backdrop */}
               
              </>
            )}
          </AnimatePresence>

          {/* Main content */}
          <main className="flex-1 w-full overflow-x-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="px-4 py-4 lg:px-8"
            >
              <Outlet />
            </motion.div>

            {/* Footer */}
            <footer className="mt-8 border-t border-white/10 pt-8 pb-12 px-4 lg:px-8 bg-black/20 backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-blue-400 tracking-wider uppercase">Product</h3>
                  <ul className="mt-4 space-y-2 sm:space-y-4">
                    <li>
                      <Link to="/features" className="block py-2 sm:py-0 text-base text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200">
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link to="/pricing" className="block py-2 sm:py-0 text-base text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200">
                        Pricing
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-400 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-2 sm:space-y-4">
                    <li>
                      <Link to="/docs" className="block py-2 sm:py-0 text-base text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200">
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="block py-2 sm:py-0 text-base text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-400 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-2 sm:space-y-4">
                    <li>
                      <Link to="/about" className="block py-2 sm:py-0 text-base text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link to="/blog" className="block py-2 sm:py-0 text-base text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200">
                        Blog
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-400 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-2 sm:space-y-4">
                    <li>
                      <Link to="/privacy" className="block py-2 sm:py-0 text-base text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200">
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <Link to="/terms" className="block py-2 sm:py-0 text-base text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200">
                        Terms
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 border-t border-white/10 pt-8">
                <p className="text-base text-white/60 text-center">
                  &copy; 2024 DiToolz Pro. All rights reserved.
                </p>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout; 