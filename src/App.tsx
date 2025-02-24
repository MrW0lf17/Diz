import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <SessionContextProvider supabaseClient={supabase}>
          <AuthProvider>
            <CoinProvider>
              <Layout />
            </CoinProvider>
          </AuthProvider>
        </SessionContextProvider>
      }
      errorElement={<ErrorBoundary />}
    >
      <Route index element={<Home />} />
      <Route path="auth" element={<Auth />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="generate" element={<Generate />} />
      <Route path="ai-generator" element={<AIGenerator />} />
      <Route path="image-editor" element={<ImageEditor />} />
      <Route path="bg-remove" element={<BgRemove />} />
      <Route path="enhance" element={<ComingSoon />} />
      <Route path="gen-fill" element={<ComingSoon />} />
      <Route path="expand" element={<Expand />} />
      <Route path="resize" element={<Resize />} />
      <Route path="pricing" element={<Pricing />} />
      <Route path="contact" element={<Contact />} />
      <Route path="subscribe/:tierId" element={<Subscribe />} />
      <Route path="subscribe/success" element={<SubscribeSuccess />} />
      <Route path="features" element={<Features />} />
      <Route path="docs" element={<Documentation />}>
        <Route path="getting-started" element={<GettingStarted />} />
        <Route path="tutorials" element={<Tutorials />} />
        <Route path="best-practices" element={<BestPractices />} />
        <Route path="faqs" element={<FAQs />} />
        <Route path="troubleshooting" element={<Troubleshooting />} />
      </Route>
      <Route path="about" element={<About />} />
      <Route path="blog" element={<Blog />} />
      <Route path="blog/:postId" element={<BlogPost />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="terms" element={<Terms />} />
      <Route path="ai-image-generation" element={<AIImageGeneration />} />
      <Route path="gallery" element={<Gallery />} />
      <Route path="market-analyst" element={<MarketAnalyst />} />
      <Route path="trend-catcher" element={<TrendCatcher />} />
      <Route path="indicator-creator" element={<IndicatorCreator />} />
      <Route path="trading-signal" element={<TradingSignal />} />
      <Route path="text-to-video" element={<TextToVideo />} />
      <Route path="image-to-video" element={<ImageToVideo />} />
      <Route path="lipsync" element={<Lipsync />} />
      <Route path="motion-brush" element={<MotionBrush />} />
      <Route path="ai-chat" element={<AIChat />} />
      <Route path="careers" element={<Careers />} />
      <Route path="auth/callback" element={<Callback />} />
    </Route>
  )
);

const App: React.FC = () => {
  useEffect(() => {
    // Initialize cleanup job
    const cleanup = initializeCleanupJob();
    return () => cleanup();
  }, []);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </React.StrictMode>
  );
};

export default App;
