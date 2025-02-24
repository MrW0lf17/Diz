import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './lib/supabase';
import { AuthProvider } from './contexts/AuthContext';
import { CoinProvider } from './contexts/CoinContext';
import { initializeCleanupJob } from './lib/cleanupUtils';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Generate from './pages/Generate';
import AIGenerator from './pages/AIGenerator';
import ImageEditor from './pages/ImageEditor';
import Auth from './pages/Auth';
import BgRemove from './pages/BgRemove';
import Enhance from './pages/Enhance';
import ComingSoon from './pages/ComingSoon';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Subscribe from './pages/Subscribe';
import SubscribeSuccess from './pages/SubscribeSuccess';
import Features from './pages/Features';
import Documentation from './pages/Documentation';
import GettingStarted from './pages/Documentation/GettingStarted';
import Tutorials from './pages/Documentation/Tutorials';
import BestPractices from './pages/Documentation/BestPractices';
import FAQs from './pages/Documentation/FAQs';
import Troubleshooting from './pages/Documentation/Troubleshooting';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AIImageGeneration from './pages/AIImageGeneration';
import Gallery from './pages/Gallery';
import Dashboard from './pages/Dashboard';
import MarketAnalyst from './pages/MarketAnalyst';
import TrendCatcher from './pages/TrendCatcher';
import IndicatorCreator from './pages/IndicatorCreator';
import TradingSignal from './pages/TradingSignal';
import Expand from './pages/Expand';
import Resize from './pages/Resize';
import TextToVideo from './pages/TextToVideo';
import ImageToVideo from './pages/ImageToVideo';
import Lipsync from './pages/Lipsync';
import MotionBrush from './pages/MotionBrush';
import AIChat from './pages/AIChat';
import Careers from './pages/Careers';
import Callback from './pages/Auth/Callback';
import ImageEnhance from './pages/ImageEnhance';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/auth', element: <Auth /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/generate', element: <Generate /> },
      { path: '/ai-generator', element: <AIGenerator /> },
      { path: '/image-editor', element: <ImageEditor /> },
      { path: '/bg-remove', element: <BgRemove /> },
      { path: '/enhance', element: <ComingSoon /> },
      { path: '/gen-fill', element: <ComingSoon /> },
      { path: '/expand', element: <Expand /> },
      { path: '/resize', element: <Resize /> },
      { path: '/pricing', element: <Pricing /> },
      { path: '/contact', element: <Contact /> },
      { path: '/subscribe/:tierId', element: <Subscribe /> },
      { path: '/subscribe/success', element: <SubscribeSuccess /> },
      { path: '/features', element: <Features /> },
      {
        path: '/docs',
        element: <Documentation />,
        children: [
          { path: 'getting-started', element: <GettingStarted /> },
          { path: 'tutorials', element: <Tutorials /> },
          { path: 'best-practices', element: <BestPractices /> },
          { path: 'faqs', element: <FAQs /> },
          { path: 'troubleshooting', element: <Troubleshooting /> }
        ]
      },
      { path: '/about', element: <About /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog/:postId', element: <BlogPost /> },
      { path: '/privacy', element: <Privacy /> },
      { path: '/terms', element: <Terms /> },
      { path: '/ai-image-generation', element: <AIImageGeneration /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/market-analyst', element: <MarketAnalyst /> },
      { path: '/trend-catcher', element: <TrendCatcher /> },
      { path: '/indicator-creator', element: <IndicatorCreator /> },
      { path: '/trading-signal', element: <TradingSignal /> },
      { path: '/text-to-video', element: <TextToVideo /> },
      { path: '/image-to-video', element: <ImageToVideo /> },
      { path: '/lipsync', element: <Lipsync /> },
      { path: '/motion-brush', element: <MotionBrush /> },
      { path: '/ai-chat', element: <AIChat /> },
      { path: '/careers', element: <Careers /> },
      { path: '/auth/callback', element: <Callback /> }
    ]
  }
]);

const App: React.FC = () => {
  useEffect(() => {
    // Initialize cleanup job
    const cleanup = initializeCleanupJob();
    return () => cleanup();
  }, []);

  return (
    <React.StrictMode>
      <SessionContextProvider supabaseClient={supabase}>
        <AuthProvider>
          <CoinProvider>
            <RouterProvider router={router} />
            <Toaster position="top-center" />
          </CoinProvider>
        </AuthProvider>
      </SessionContextProvider>
    </React.StrictMode>
  );
};

export default App;
