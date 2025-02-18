import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './lib/supabase';
import { AuthProvider } from './contexts/AuthContext';
import { CoinProvider } from './contexts/CoinContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
import AIGenerator from './pages/AIGenerator';
import ImageEditor from './pages/ImageEditor';
import BgRemove from './pages/BgRemove';
import Enhance from './pages/Enhance';
import GenFill from './pages/GenFill';
import Expand from './pages/Expand';
import Resize from './pages/Resize';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Subscribe from './pages/Subscribe';
import SubscribeSuccess from './pages/SubscribeSuccess';
import Features from './pages/Features';
import Documentation from './pages/Documentation';
import GettingStarted from './pages/docs/GettingStarted';
import Tutorials from './pages/docs/Tutorials';
import BestPractices from './pages/docs/BestPractices';
import FAQs from './pages/docs/FAQs';
import Troubleshooting from './pages/docs/Troubleshooting';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AIImageGeneration from './pages/AIImageGeneration';
import Gallery from './pages/Gallery';
import MarketAnalyst from './pages/MarketAnalyst';
import TrendCatcher from './pages/TrendCatcher';
import IndicatorCreator from './pages/IndicatorCreator';
import TradingSignal from './pages/TradingSignal';
import TextToVideo from './pages/TextToVideo';
import ImageToVideo from './pages/ImageToVideo';
import Lipsync from './pages/Lipsync';
import MotionBrush from './pages/MotionBrush';
import AIChat from './pages/AIChat';
import Careers from './pages/Careers';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

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
      { path: '/enhance', element: <Enhance /> },
      { path: '/gen-fill', element: <GenFill /> },
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
      { path: '/terms-of-service', element: <TermsOfService /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/auth/callback', element: <Navigate to="/" /> }
    ]
  }
]);

const App: React.FC = () => {
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
