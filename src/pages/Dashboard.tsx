import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { NeonButton, GlassCard, AILoadingSpinner } from '../components/FuturisticUI';
import { useCoins } from '../contexts/CoinContext';
import { COIN_PACKAGES, type CoinPackage } from '../contexts/CoinContext';
import CoinShopModal from '../components/CoinShopModal';
import AdModal from '../components/AdModal';
import { format } from 'date-fns';
import { Chart } from 'react-chartjs-2';

interface RecentImage {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

interface UsageStats {
  imagesGenerated: number;
  creditsRemaining: number;
  favoriteTools: string[];
  weeklyStats: number[];
}

const PRO_MEMBERSHIP_COST = 2000; // Cost in NUT coins

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { balance, purchaseCoins, earnCoinsFromAd, convertToPremium } = useCoins();
  const [showCoinShopModal, setShowCoinShopModal] = useState(false);
  const [recentImages, setRecentImages] = useState<RecentImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'market' | 'convert'>('overview');
  const [selectedImage, setSelectedImage] = useState<RecentImage | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    imagesGenerated: 0,
    creditsRemaining: 0,
    favoriteTools: [],
    weeklyStats: [0, 0, 0, 0, 0, 0, 0],
  });
  const [showAdModal, setShowAdModal] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  useEffect(() => {
    loadRecentImages();
    const interval = setInterval(loadRecentImages, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const loadRecentImages = async () => {
    try {
      if (!user?.id) {
        setUsageStats({
          imagesGenerated: 0,
          creditsRemaining: balance,
          favoriteTools: [],
          weeklyStats: []
        });
        setRecentImages([]);
        return;
      }

      setLoadingImages(true);
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;

      const verifiedImages = (data || []).filter(image => 
        image && image.image_url && image.id && image.prompt && image.created_at
      );

      setRecentImages(verifiedImages);
      
      // Get total images generated count
      const imagesCountResponse = await supabase
        .from('generated_images')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      // Set usage stats with available data
      setUsageStats({
        imagesGenerated: imagesCountResponse.count || 0,
        creditsRemaining: balance,
        favoriteTools: [], // This can be implemented later if needed
        weeklyStats: [] // This can be implemented later if needed
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoadingImages(false);
    }
  };

  const handleImageError = (imageId: string) => {
    setRecentImages(current => 
      current.map(img => 
        img.id === imageId ? { ...img, image_url: '' } : img
      )
    );
  };

  const handleBuyCoins = async (packageId: string) => {
    try {
      // Get the selected package
      const selectedPackage = COIN_PACKAGES.find(pkg => pkg.id === packageId);
      if (!selectedPackage) {
        throw new Error('Invalid package selected');
      }

      // Create a Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId,
          priceId: selectedPackage.stripePriceId,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
    }
  };

  const handleConvertToPro = async (days: number) => {
    try {
      const response = await fetch('/api/create-subscription-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          days,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription session');
      }

      const session = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to initiate subscription');
    }
  };

  const handleWatchAd = () => {
    if (isWatchingAd) {
      toast.error('Please wait for the current ad to finish');
      return;
    }
    setShowAdModal(true);
    setIsWatchingAd(true);
  };

  const handleAdComplete = async () => {
    try {
      const success = await earnCoinsFromAd();
      if (success) {
        toast.success('Earned 5 coins from watching the ad!');
      }
    } catch (error) {
      console.error('Error processing ad reward:', error);
      toast.error('Failed to process ad reward');
    } finally {
      setShowAdModal(false);
      setIsWatchingAd(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 max-w-7xl mx-auto space-y-8"
    >
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold font-orbitron bg-gradient-to-r from-neon-cyan to-ai-magenta bg-clip-text text-transparent">
          Welcome back, {user?.user_metadata?.full_name || 'Creator'}
        </h1>
        <p className="text-futuristic-silver/60 mt-2">Your creative journey continues here</p>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-4 p-1 bg-cyber-black/30 rounded-lg">
          {(['overview', 'market', 'convert'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2 rounded-md font-orbitron transition-all duration-200 ${
                selectedTab === tab
                  ? 'bg-gradient-to-r from-neon-cyan/20 to-ai-magenta/20 text-white'
                  : 'text-futuristic-silver/60 hover:text-white'
              }`}
            >
              {tab === 'market' ? 'Coin Market' : tab === 'convert' ? 'Pro Upgrade' : 'Overview'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <GlassCard variant="cyber" className="p-6 transform hover:scale-105 transition-transform">
                  <h3 className="text-futuristic-silver/60 text-sm font-orbitron">Images Generated</h3>
                  <p className="text-4xl font-bold text-neon-cyan mt-2 font-orbitron">{usageStats.imagesGenerated}</p>
                  <div className="mt-2 text-xs text-futuristic-silver/40">+12% from last week</div>
                </GlassCard>

                <GlassCard variant="cyber" className="p-6 transform hover:scale-105 transition-transform">
                  <h3 className="text-futuristic-silver/60 text-sm font-orbitron">Coin Balance</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-4xl font-bold text-ai-magenta font-orbitron">{balance}</p>
                    <button
                      onClick={() => setShowCoinShopModal(true)}
                      className="text-metallic-gold hover:text-holographic-teal transition-colors"
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 2a6 6 0 100 12 6 6 0 000-12z" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-futuristic-silver/40">Click + to get more coins</div>
                </GlassCard>

                <GlassCard variant="cyber" className="p-6 transform hover:scale-105 transition-transform">
                  <h3 className="text-futuristic-silver/60 text-sm font-orbitron">Premium Status</h3>
                  {user?.user_metadata?.premium_until ? (
                    <>
                      <p className="text-2xl font-bold text-metallic-bronze mt-2 font-orbitron">
                        {(() => {
                          const premiumUntil = new Date(user.user_metadata.premium_until);
                          const now = new Date();
                          const daysLeft = Math.ceil((premiumUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                          return `${daysLeft} Days Left`;
                        })()}
                      </p>
                      <Link to="/pricing" className="mt-2 text-xs text-neon-cyan hover:text-ai-magenta transition-colors">
                        Extend Premium →
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-metallic-bronze mt-2 font-orbitron">
                        Free User
                      </p>
                      <Link to="/pricing" className="mt-2 text-xs text-neon-cyan hover:text-ai-magenta transition-colors">
                        Get Premium →
                      </Link>
                    </>
                  )}
                </GlassCard>
              </div>

              {/* Ad Space */}
              <div className="w-full h-[250px] mb-8 bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden flex items-center justify-center">
                <div id="dashboard-ad-container" className="w-full h-full">
                  {/* Ad will be injected here */}
                  <div className="w-full h-full flex items-center justify-center text-futuristic-silver/40">
                    <span>Advertisement Space</span>
                  </div>
                </div>
              </div>

              {/* Recent Creations */}
              <GlassCard variant="cyber" className="p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-orbitron font-bold text-futuristic-silver">Recent Creations</h2>
                  <Link to="/gallery">
                    <NeonButton variant="primary" size="sm">
                      View Gallery
                    </NeonButton>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {loadingImages ? (
                    Array(4).fill(null).map((_, index) => (
                      <div key={index} className="aspect-square rounded-xl overflow-hidden bg-cyber-black/30 animate-pulse" />
                    ))
                  ) : recentImages.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <p className="text-futuristic-silver/40 mb-4">No images generated yet.</p>
                      <Link to="/ai-image-generation">
                        <NeonButton variant="accent">
                          Create your first image
                          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </NeonButton>
                      </Link>
                    </div>
                  ) : (
                    recentImages.map(image => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImage(image)}
                        className="group relative aspect-square rounded-xl overflow-hidden transform hover:scale-105 transition-transform focus:outline-none"
                      >
                        <img
                          src={image.image_url}
                          alt={image.prompt}
                          onError={() => handleImageError(image.id)}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 p-4">
                            <p className="text-white text-sm line-clamp-2">{image.prompt}</p>
                            <p className="text-futuristic-silver/60 text-xs mt-1">
                              {format(new Date(image.created_at), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </GlassCard>
            </>
          )}

          {selectedTab === 'market' && (
            <div className="space-y-8">
              {/* Current Balance */}
              <GlassCard variant="cyber" className="p-6">
                <div className="text-center">
                  <h2 className="text-xl font-orbitron font-bold text-futuristic-silver mb-2">Your NUT Balance</h2>
                  <p className="text-4xl font-bold text-ai-magenta font-orbitron">{balance}</p>
                  <p className="text-futuristic-silver/60 text-sm mt-2">Purchase more coins to unlock premium features</p>
                </div>
              </GlassCard>

              {/* Coin Packages */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {COIN_PACKAGES.map((pkg) => (
                  <GlassCard
                    key={pkg.id}
                    variant="cyber"
                    className={`p-6 relative ${pkg.isPopular ? 'border-neon-cyan' : ''}`}
                  >
                    {pkg.isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="px-4 py-1 bg-gradient-to-r from-neon-cyan to-ai-magenta rounded-full text-xs font-orbitron text-white">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="text-lg font-orbitron font-bold text-futuristic-silver mb-2">{pkg.name}</h3>
                      <p className="text-3xl font-bold text-neon-cyan font-orbitron mb-1">
                        {pkg.coins} <span className="text-sm">NUT</span>
                      </p>
                      {pkg.bonus > 0 && (
                        <p className="text-ai-magenta text-sm font-medium mb-2">+{pkg.bonus} Bonus</p>
                      )}
                      <p className="text-2xl text-futuristic-silver font-orbitron mb-4">${pkg.price}</p>
                      <NeonButton
                        variant={pkg.isPopular ? 'primary' : 'secondary'}
                        onClick={() => handleBuyCoins(pkg.id)}
                        className="w-full"
                      >
                        Purchase
                      </NeonButton>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Watch Ad Option */}
              <div className="text-center">
                <NeonButton
                  variant="primary"
                  onClick={handleWatchAd}
                  disabled={isWatchingAd}
                  className="w-full md:w-auto"
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {isWatchingAd ? 'Watching Ad...' : 'Watch Ad for 5 Coins'}
                </NeonButton>
              </div>

              {/* Purchase Information */}
              <GlassCard variant="cyber" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-neon-cyan to-ai-magenta flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-orbitron font-medium text-futuristic-silver">Secure Payment</h3>
                    <p className="text-futuristic-silver/60 text-sm mt-1">256-bit SSL encryption</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-ai-magenta to-metallic-bronze flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-orbitron font-medium text-futuristic-silver">Instant Delivery</h3>
                    <p className="text-futuristic-silver/60 text-sm mt-1">Credits added immediately</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-holographic-teal to-neon-cyan flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="font-orbitron font-medium text-futuristic-silver">100% Safe</h3>
                    <p className="text-futuristic-silver/60 text-sm mt-1">Money-back guarantee</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {selectedTab === 'convert' && (
            <div className="space-y-8">
              {/* Duration-based Premium Conversion */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                  { days: 1, coins: 100, label: '1 Day' },
                  { days: 3, coins: 250, label: '3 Days', popular: true },
                  { days: 7, coins: 500, label: '7 Days' },
                  { days: 30, coins: 1800, label: '30 Days' }
                ].map((option) => (
                  <GlassCard
                    key={option.days}
                    variant="cyber"
                    className={`p-6 relative ${option.popular ? 'border-neon-cyan' : ''}`}
                  >
                    {option.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="px-4 py-1 bg-gradient-to-r from-neon-cyan to-ai-magenta rounded-full text-xs font-orbitron text-white whitespace-nowrap">
                          Best Value
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="text-lg font-orbitron font-bold text-futuristic-silver mb-2">{option.label}</h3>
                      <p className="text-3xl font-bold text-neon-cyan font-orbitron mb-1">
                        {option.coins} <span className="text-sm">NUT</span>
                      </p>
                      <p className="text-futuristic-silver/60 text-sm mb-4">
                        {(option.coins / option.days).toFixed(1)} NUT/day
                      </p>
                      <NeonButton
                        variant={option.popular ? 'primary' : 'secondary'}
                        onClick={() => handleConvertToPro(option.days)}
                        disabled={balance < option.coins}
                        className="w-full"
                      >
                        {balance < option.coins ? (
                          <>Need {option.coins - balance} more</>
                        ) : (
                          <>Convert to {option.label}</>
                        )}
                      </NeonButton>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Current Balance Display */}
              <GlassCard variant="cyber" className="p-6 mb-12">
                <div className="text-center">
                  <h2 className="text-xl font-orbitron font-bold text-futuristic-silver mb-2">Your NUT Balance</h2>
                  <p className="text-4xl font-bold text-ai-magenta font-orbitron">{balance}</p>
                  <p className="text-futuristic-silver/60 text-sm mt-2">Select a duration to convert your coins</p>
                </div>
              </GlassCard>

              {/* Pro Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard variant="cyber" className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-neon-cyan to-ai-magenta flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-orbitron font-medium text-futuristic-silver">Faster Generation</h3>
                    <p className="text-futuristic-silver/60 text-sm mt-1">Priority processing for all your creations</p>
                  </div>
                </GlassCard>

                <GlassCard variant="cyber" className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-ai-magenta to-metallic-bronze flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <h3 className="font-orbitron font-medium text-futuristic-silver">Advanced Settings</h3>
                    <p className="text-futuristic-silver/60 text-sm mt-1">Fine-tune your AI generations</p>
                  </div>
                </GlassCard>

                <GlassCard variant="cyber" className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-holographic-teal to-neon-cyan flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h3 className="font-orbitron font-medium text-futuristic-silver">Exclusive Features</h3>
                    <p className="text-futuristic-silver/60 text-sm mt-1">Access to pro-only tools and features</p>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-neon-cyan transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <GlassCard variant="cyber" className="overflow-hidden">
              <div className="relative aspect-square md:aspect-[16/9]">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.prompt}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 space-y-2">
                <p className="text-futuristic-silver font-inter">{selectedImage.prompt}</p>
                <p className="text-futuristic-silver/60 text-sm">
                  Generated on {format(new Date(selectedImage.created_at), 'MMMM dd, yyyy')}
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Coin Shop Modal */}
      <CoinShopModal
        isOpen={showCoinShopModal}
        onClose={() => setShowCoinShopModal(false)}
      />

      {/* Ad Modal */}
      <AdModal
        isOpen={showAdModal}
        onClose={() => {
          setShowAdModal(false);
          setIsWatchingAd(false);
        }}
        onComplete={handleAdComplete}
        adDuration={30}
      />
    </motion.div>
  );
};

export default Dashboard; 