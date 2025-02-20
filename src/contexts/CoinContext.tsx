import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthContext';
import { GlassCard } from '../components/FuturisticUI';
import toast from 'react-hot-toast';

interface CoinContextType {
  balance: number;
  lifetimeEarned: number;
  earnCoinsFromAd: () => Promise<boolean>;
  purchaseCoins: (packageId: string) => Promise<boolean>;
  useCoinsForTool: (toolPath: ToolPath) => Promise<boolean>;
  refreshBalance: () => Promise<void>;
  convertToPremium: (days: number) => Promise<boolean>;
}

type ToolPath = 
  | 'ai-image-generation'
  | 'bg-remove'
  | 'gen-fill'
  | 'expand'
  | 'resize'
  | 'text-to-video'
  | 'image-to-video'
  | 'motion-brush'
  | 'lipsync'
  | 'market-analyst'
  | 'trend-catcher'
  | 'indicator-creator'
  | 'trading-signal'
  | 'ai-chat';

export interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  bonus: number;
  isPopular?: boolean;
  stripePriceId: string;
}

export const COIN_PACKAGES: CoinPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    coins: 100,
    price: 4.99,
    bonus: 0,
    stripePriceId: 'price_starter'
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    coins: 500,
    price: 19.99,
    bonus: 50,
    isPopular: true,
    stripePriceId: 'price_popular'
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    coins: 1200,
    price: 39.99,
    bonus: 200,
    stripePriceId: 'price_pro'
  },
  {
    id: 'ultimate',
    name: 'Ultimate Pack',
    coins: 3000,
    price: 89.99,
    bonus: 800,
    stripePriceId: 'price_ultimate'
  }
];

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export const TOOL_COSTS: Record<ToolPath, number> = {
  'ai-image-generation': 10,
  'bg-remove': 5,
  'gen-fill': 15,
  'expand': 8,
  'resize': 3,
  'text-to-video': 20,
  'image-to-video': 15,
  'motion-brush': 10,
  'lipsync': 12,
  'market-analyst': 25,
  'trend-catcher': 20,
  'indicator-creator': 15,
  'trading-signal': 18,
  'ai-chat': 5
};

export const PREMIUM_CONVERSION = {
  1: 100,   // 1 day
  3: 250,   // 3 days
  7: 500,   // 7 days
  30: 1800  // 30 days
} as const;

interface PremiumWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  daysLeft: number;
  daysToAdd: number;
  totalDays: number;
}

const PremiumWarningModal: React.FC<PremiumWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  daysLeft,
  daysToAdd,
  totalDays,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg"
      >
        <GlassCard variant="cyber" className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-r from-neon-cyan to-ai-magenta flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-orbitron font-bold text-futuristic-silver">
              Extend Premium Time
            </h3>
            <p className="text-futuristic-silver/80 font-inter">
              You currently have <span className="text-neon-cyan">{daysLeft} days</span> of premium remaining.
            </p>
            <p className="text-futuristic-silver/80 font-inter">
              Adding <span className="text-ai-magenta">{daysToAdd} days</span> will give you a total of{' '}
              <span className="text-holographic-teal">{totalDays} days</span> of premium access.
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg font-orbitron text-futuristic-silver/60 hover:text-futuristic-silver transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-6 py-2 rounded-lg font-orbitron bg-gradient-cyber text-white transition-opacity hover:opacity-90"
              >
                Confirm
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export const CoinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [lifetimeEarned, setLifetimeEarned] = useState(0);
  const [showPremiumWarning, setShowPremiumWarning] = useState(false);
  const [premiumWarningData, setPremiumWarningData] = useState<{
    daysLeft: number;
    daysToAdd: number;
    totalDays: number;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const supabase = useSupabaseClient();
  const { user } = useAuth();

  const refreshBalance = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_coins')
      .select('balance, lifetime_earned')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching coin balance:', error);
      return;
    }

    if (data) {
      setBalance(data.balance);
      setLifetimeEarned(data.lifetime_earned);
    } else {
      // Initialize user_coins record if it doesn't exist
      const { error: insertError } = await supabase
        .from('user_coins')
        .insert([{ user_id: user.id }]);

      if (insertError) {
        console.error('Error initializing user coins:', insertError);
      }
    }
  };

  useEffect(() => {
    if (user) {
      refreshBalance();
    } else {
      setBalance(0);
      setLifetimeEarned(0);
    }
  }, [user]);

  const earnCoinsFromAd = async () => {
    if (!user) {
      toast.error('Please sign in to earn coins');
      return false;
    }

    const now = new Date();
    const { data: userData } = await supabase
      .from('user_coins')
      .select('last_ad_watch')
      .eq('user_id', user.id)
      .single();

    if (userData?.last_ad_watch) {
      const lastWatch = new Date(userData.last_ad_watch);
      const hoursSinceLastWatch = (now.getTime() - lastWatch.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastWatch < 1) {
        toast.error('Please wait an hour between watching ads');
        return false;
      }
    }

    // TODO: Implement actual ad watching logic here
    // For now, we'll just simulate it
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { error: updateError } = await supabase
      .from('user_coins')
      .update({
        balance: balance + 5,
        lifetime_earned: lifetimeEarned + 5,
        last_ad_watch: now.toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      toast.error('Failed to award coins');
      return false;
    }

    await supabase
      .from('coin_transactions')
      .insert([{
        user_id: user.id,
        amount: 5,
        transaction_type: 'ad_reward'
      }]);

    await refreshBalance();
    toast.success('Earned 5 coins!');
    return true;
  };

  const purchaseCoins = async (packageId: string) => {
    if (!user) {
      toast.error('Please sign in to purchase coins');
      return false;
    }

    const coinPackage = COIN_PACKAGES.find(pkg => pkg.id === packageId);
    if (!coinPackage) {
      toast.error('Invalid coin package');
      return false;
    }

    // TODO: Implement actual payment processing here
    // For now, we'll just simulate it
    await new Promise(resolve => setTimeout(resolve, 1000));

    const totalCoins = coinPackage.coins + coinPackage.bonus;
    const { error: updateError } = await supabase
      .from('user_coins')
      .update({
        balance: balance + totalCoins,
        lifetime_earned: lifetimeEarned + totalCoins
      })
      .eq('user_id', user.id);

    if (updateError) {
      toast.error('Failed to add coins');
      return false;
    }

    await supabase
      .from('coin_transactions')
      .insert([{
        user_id: user.id,
        amount: totalCoins,
        transaction_type: 'purchase',
        metadata: { package_id: packageId, price: coinPackage.price }
      }]);

    await refreshBalance();
    toast.success(`Added ${totalCoins} coins to your balance!`);
    return true;
  };

  const useCoinsForTool = async (toolPath: ToolPath) => {
    if (!user) {
      toast.error('Please sign in to use this tool');
      return false;
    }

    const cost = TOOL_COSTS[toolPath];
    if (!cost) {
      console.error('No cost defined for tool:', toolPath);
      return true; // Allow free usage if cost isn't defined
    }

    if (balance < cost) {
      toast.error(`Not enough coins! This tool requires ${cost} coins`);
      return false;
    }

    const { error: updateError } = await supabase
      .from('user_coins')
      .update({
        balance: balance - cost
      })
      .eq('user_id', user.id);

    if (updateError) {
      toast.error('Failed to process coin payment');
      return false;
    }

    await supabase
      .from('coin_transactions')
      .insert([{
        user_id: user.id,
        amount: -cost,
        transaction_type: 'tool_usage',
        tool_used: toolPath
      }]);

    await refreshBalance();
    toast.success(`Used ${cost} coins`);
    return true;
  };

  const convertToPremium = async (days: number) => {
    if (!user) {
      toast.error('Please sign in to convert coins to premium');
      return false;
    }

    const cost = PREMIUM_CONVERSION[days as keyof typeof PREMIUM_CONVERSION];
    if (!cost) {
      toast.error('Invalid conversion duration');
      return false;
    }

    if (balance < cost) {
      toast.error(`Not enough coins! Converting to ${days} days premium requires ${cost} coins`);
      return false;
    }

    // Check if user already has premium time
    const currentPremiumUntil = user.user_metadata?.premium_until;
    if (currentPremiumUntil) {
      const currentEndDate = new Date(currentPremiumUntil);
      const now = new Date();
      
      if (currentEndDate > now) {
        const daysLeft = Math.ceil((currentEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const totalDays = daysLeft + days;
        
        // Show warning modal
        setPremiumWarningData({
          daysLeft,
          daysToAdd: days,
          totalDays,
          onConfirm: async () => {
            const success = await processPremiumConversion(days, currentEndDate);
            if (success) {
              setShowPremiumWarning(false);
              setPremiumWarningData(null);
            }
          }
        });
        setShowPremiumWarning(true);
        return false;
      }
    }

    return processPremiumConversion(days);
  };

  const processPremiumConversion = async (days: number, startFromDate?: Date) => {
    if (!user) {
      toast.error('Please sign in to convert coins to premium');
      return false;
    }

    // Update user's premium status
    const premiumEndDate = startFromDate || new Date();
    premiumEndDate.setDate(premiumEndDate.getDate() + days);

    const { error: userUpdateError } = await supabase.auth.updateUser({
      data: {
        is_premium: true,
        premium_until: premiumEndDate.toISOString()
      }
    });

    if (userUpdateError) {
      toast.error('Failed to update premium status');
      return false;
    }

    const cost = PREMIUM_CONVERSION[days as keyof typeof PREMIUM_CONVERSION];

    // Deduct coins
    const { error: updateError } = await supabase
      .from('user_coins')
      .update({
        balance: balance - cost
      })
      .eq('user_id', user.id);

    if (updateError) {
      toast.error('Failed to deduct coins');
      return false;
    }

    // Record transaction
    await supabase
      .from('coin_transactions')
      .insert([{
        user_id: user.id,
        amount: -cost,
        transaction_type: 'premium_conversion',
        metadata: { days, end_date: premiumEndDate.toISOString() }
      }]);

    await refreshBalance();
    toast.success(`Successfully converted ${cost} coins to ${days} days of premium!`);
    return true;
  };

  return (
    <CoinContext.Provider
      value={{
        balance,
        lifetimeEarned,
        earnCoinsFromAd,
        purchaseCoins,
        useCoinsForTool,
        refreshBalance,
        convertToPremium
      }}
    >
      {children}
      <AnimatePresence>
        {showPremiumWarning && premiumWarningData && (
          <PremiumWarningModal
            isOpen={showPremiumWarning}
            onClose={() => {
              setShowPremiumWarning(false);
              setPremiumWarningData(null);
            }}
            onConfirm={premiumWarningData.onConfirm}
            daysLeft={premiumWarningData.daysLeft}
            daysToAdd={premiumWarningData.daysToAdd}
            totalDays={premiumWarningData.totalDays}
          />
        )}
      </AnimatePresence>
    </CoinContext.Provider>
  );
};

export const useCoins = () => {
  const context = useContext(CoinContext);
  if (context === undefined) {
    throw new Error('useCoins must be used within a CoinProvider');
  }
  return context;
};

export default CoinContext; 