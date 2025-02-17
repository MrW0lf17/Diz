export const TOOL_COSTS = {
  // Image Tools
  'ai-image-generation': 10,
  'bg-remove': 5,
  'gen-fill': 20,
  'enhance': 15,
  'resize': 3,

  // Video Tools
  'text-to-video': 30,
  'image-to-video': 25,
  'motion-brush': 20,
  'lipsync': 25,

  // Trading Tools
  'market-analyst': 20,
  'trend-catcher': 15,
  'indicator-creator': 20,
  'trading-signal': 15,

  // Text Tools
  'ai-chat': 5
};

export const PREMIUM_CONVERSION = {
  hourly: 50,
  daily: 100,
  weekly: 600,
  monthly: 2000
};

export const COIN_PACKAGES = [
  {
    id: 'starter',
    coins: 100,
    price: 0.99,
    bonus: 0
  },
  {
    id: 'popular',
    coins: 500,
    price: 4.99,
    bonus: 50
  },
  {
    id: 'pro',
    coins: 1200,
    price: 9.99,
    bonus: 200
  },
  {
    id: 'ultimate',
    coins: 3000,
    price: 19.99,
    bonus: 1000
  }
]; 