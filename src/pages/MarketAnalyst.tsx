import React, { useState, useEffect } from 'react';
import { useToolAction } from '../hooks/useToolAction';
import { useAuth } from '../contexts/AuthContext';
import { useCoins } from '../contexts/CoinContext';
import { TOOL_COSTS } from '../config/coinConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { RiCoinLine } from 'react-icons/ri';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InfoIcon from '@mui/icons-material/Info';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SearchIcon from '@mui/icons-material/Search';
import TimelineIcon from '@mui/icons-material/Timeline';
import WarningIcon from '@mui/icons-material/Warning';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PublicIcon from '@mui/icons-material/Public';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { alpha, styled } from '@mui/material/styles';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Time frame options for analysis
const TIME_FRAMES = [
  { value: '5m', label: 'Last 5 Minutes' },
  { value: '15m', label: 'Last 15 Minutes' },
  { value: '1h', label: 'Last Hour' },
  { value: '4h', label: 'Last 4 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
];

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Price Chart',
    },
  },
  scales: {
    y: {
      beginAtZero: false,
    },
  },
};

interface MarketMetrics {
  price: number;
  volume: string;
  priceChange: string;
  marketCap: string;
  newsHeadlines?: string[];
  timePoints: string[];
  prices: number[];
  metrics: {
    [key: string]: string | number;
  };
  recentNews?: NewsItem[];
}

interface NewsItem {
  title: string;
  url: string;
  source: string;
  published_at: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: number; // 0-100
}

interface MarketAnalysis {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  marketSentiment: string;
  technicalAnalysis: string;
  riskFactors: string[];
  opportunities: string[];
  keyLevels: {
    support: number[];
    resistance: number[];
  };
  summary: string[];
  newsAnalysis: {
    overallSentiment: string;
    majorEvents: string[];
    potentialImpact: string;
  };
}

interface AnalysisData {
  marketData: MarketMetrics;
  analysis: MarketAnalysis;
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      tension: number;
      fill: boolean;
      backgroundColor?: string;
    }[];
  };
}

// Add these styles at the top after imports
const styles = {
  gradientBackground: {
    background: 'linear-gradient(135deg, #1a237e 0%, #000051 100%)',
    minHeight: '100vh',
    color: 'white',
  },
  containerBox: {
    padding: {
      xs: '16px',
      sm: '24px',
      md: '32px'
    },
    width: '100%',
    overflow: 'hidden'
  } as const,
  glassCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  },
  gradientText: {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
  },
  glowingBorder: {
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 0 15px rgba(33, 150, 243, 0.3)',
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 0 20px rgba(33, 150, 243, 0.5)',
    },
  },
  chartContainer: {
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
};

// Add this styled component definition after the styles object
const CoinBalanceContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
}));

const CoinDisplay = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: '#2196F3'
});

const CostDisplay = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.6)',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
  },
}));

// Add these styled components after the existing styled components
const MainContainer = styled(Box)({
  background: 'linear-gradient(135deg, #1a237e 0%, #000051 100%)',
  minHeight: '100vh',
  color: 'white'
});

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4)
  }
}));

const PageTitle = styled(Typography)<{ component?: React.ElementType }>(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.75rem',
    textAlign: 'center'
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '2.25rem',
    textAlign: 'left'
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '3rem'
  }
}));

// Add these styled components for the loading overlay
const LoadingOverlay = styled(Box)({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  padding: '24px'
});

const LoadingContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  color: 'white'
});

const MarketAnalyst: React.FC = () => {
  const handleToolAction = useToolAction('market-analyst');
  const { user } = useAuth();
  const { balance } = useCoins();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [timeFrame, setTimeFrame] = useState('24h');
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  // Validate symbol format
  const validateSymbol = (input: string) => {
    // Basic validation: uppercase letters and numbers only
    return /^[A-Z0-9]+$/.test(input);
  };

  // Fetch market data from Binance API
  const fetchMarketData = async (symbol: string, timeFrame: string) => {
    try {
      // Convert timeframe to Binance interval format
      const interval = timeFrame === '5m' ? '1m' :
                      timeFrame === '15m' ? '1m' :
                      timeFrame === '1h' ? '1m' :
                      timeFrame === '4h' ? '5m' :
                      timeFrame === '24h' ? '1h' : 
                      timeFrame === '7d' ? '4h' : 
                      timeFrame === '30d' ? '1d' : '1d';
      
      // Convert timeframe to limit
      const limit = timeFrame === '5m' ? 5 :
                   timeFrame === '15m' ? 15 :
                   timeFrame === '1h' ? 60 :
                   timeFrame === '4h' ? 48 :
                   timeFrame === '24h' ? 24 : 
                   timeFrame === '7d' ? 42 : 
                   timeFrame === '30d' ? 30 : 90;

      // Add USDT to symbol for Binance pair format
      const pair = `${symbol}USDT`;
      
      // Fetch market data from Binance
      const [klineResponse, tickerResponse] = await Promise.all([
        fetch(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`),
        fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`)
      ]);

      if (!klineResponse.ok || !tickerResponse.ok) {
        console.error('API Response Status:', {
          klines: klineResponse.status,
          ticker: tickerResponse.status
        });
        throw new Error('Failed to fetch market data');
      }

      const [klineData, tickerData] = await Promise.all([
        klineResponse.json(),
        tickerResponse.json()
      ]);

      // Process price data from klines
      // Kline structure: [openTime, open, high, low, close, volume, closeTime, ...]
      const prices = klineData.map((k: any[]) => parseFloat(k[4])); // Using close price
      const timePoints = klineData.map((k: any[]) => {
        const date = new Date(k[0]);
        return timeFrame === '24h' || timeFrame === '7d'
          ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : timeFrame === '30d' || timeFrame === '90d'
          ? date.toLocaleDateString()
          : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      });

      // Calculate price change
      const priceChange = parseFloat(tickerData.priceChangePercent).toFixed(2);
      
      // Format volume
      const volume = parseFloat(tickerData.volume).toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });

      // Get market data summary
      const currentPrice = parseFloat(tickerData.lastPrice);
      const high24h = parseFloat(tickerData.highPrice);
      const low24h = parseFloat(tickerData.lowPrice);

      // Generate news headlines based on available data
      const newsHeadlines = [
        `${symbol} 24h Trading Volume: ${volume}`,
        `24h Price Range: $${low24h.toLocaleString()} - $${high24h.toLocaleString()}`,
        `${symbol} price is ${parseFloat(priceChange) > 0 ? 'up' : 'down'} ${Math.abs(parseFloat(priceChange))}% in the last 24h`
      ];

      // Fetch news data with fallback to CryptoCompare
      const recentNews = await fetchNews(symbol);

      return {
        price: currentPrice,
        volume,
        priceChange: `${priceChange}%`,
        marketCap: 'N/A', // Binance doesn't provide market cap data
        newsHeadlines,
        timePoints,
        prices,
        metrics: {
          'Price (USD)': currentPrice.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }),
          '24h High': high24h.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }),
          '24h Low': low24h.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }),
          '24h Volume': volume,
          'Price Change': `${priceChange}%`,
          'Number of Trades': tickerData.count.toLocaleString(),
        },
        recentNews,
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  };

  // Fetch news data with fallback to CryptoCompare
  const fetchNews = async (symbol: string) => {
    try {
      // Remove USD from symbol if present
      const cleanSymbol = symbol.replace('/USD', '').toUpperCase();
      
      try {
        // First try NewsAPI
        const newsApiResponse = await fetch(
          `https://newsapi.org/v2/everything?` +
          `q=${cleanSymbol}+crypto&` +
          `language=en&` +
          `sortBy=publishedAt&` +
          `pageSize=10&` +
          `apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
        );

        if (newsApiResponse.ok) {
          const data = await newsApiResponse.json();
          const processedNews = data.articles
            .filter((article: any) => article.title && article.url)
            .map((article: any) => ({
              title: article.title,
              url: article.url,
              source: article.source.name,
              published_at: article.publishedAt,
              sentiment: determineSentiment(article.title + ' ' + (article.description || '')),
              impact: calculateNewsImpact(article)
            }));

          if (processedNews.length > 0) {
            return processedNews;
          }
        }
      } catch (newsApiError) {
        console.warn('NewsAPI fetch failed, falling back to CryptoCompare:', newsApiError);
      }

      // Fallback to CryptoCompare News API
      const cryptoCompareResponse = await fetch(
        `https://min-api.cryptocompare.com/data/v2/news/?categories=${cleanSymbol},Crypto&excludeCategories=Sponsored`
      );

      if (!cryptoCompareResponse.ok) {
        throw new Error('Failed to fetch news data from all sources');
      }

      const cryptoCompareData = await cryptoCompareResponse.json();
      
      const processedNews = cryptoCompareData.Data
        .slice(0, 10)
        .map((article: any) => ({
          title: article.title,
          url: article.url,
          source: article.source,
          published_at: new Date(article.published_on * 1000).toISOString(),
          sentiment: determineSentiment(article.title + ' ' + (article.body || '')),
          impact: calculateCryptoCompareImpact(article)
        }));

      return processedNews.length > 0 ? processedNews : generateDefaultNews(symbol);

    } catch (error) {
      console.error('Error fetching news:', error);
      return generateDefaultNews(symbol);
    }
  };

  // Enhanced sentiment analysis
  const determineSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = [
      'surge', 'jump', 'gain', 'bull', 'up', 'high', 'rise', 'grow', 'positive', 'rally',
      'breakthrough', 'success', 'boost', 'improve', 'advantage', 'profit', 'win', 'strong',
      'support', 'confidence'
    ];
    
    const negativeWords = [
      'drop', 'fall', 'crash', 'bear', 'down', 'low', 'decline', 'negative', 'plunge', 'dump',
      'loss', 'risk', 'weak', 'concern', 'fear', 'threat', 'trouble', 'fail', 'resist', 'warning'
    ];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  // Calculate news impact based on various factors
  const calculateNewsImpact = (article: any): number => {
    let impact = 50; // Base impact score
    
    // Adjust based on source reputation
    const majorSources = ['Reuters', 'Bloomberg', 'CNBC', 'CoinDesk', 'Cointelegraph'];
    if (majorSources.includes(article.source.name)) impact += 20;
    
    // Adjust based on title prominence
    if (article.title.includes('BREAKING') || article.title.includes('URGENT')) impact += 15;
    
    // Adjust based on recency
    const hoursAgo = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
    if (hoursAgo < 1) impact += 15;
    else if (hoursAgo < 6) impact += 10;
    else if (hoursAgo < 24) impact += 5;
    
    return Math.min(Math.round(impact), 100);
  };

  // Calculate impact score for CryptoCompare news
  const calculateCryptoCompareImpact = (article: any): number => {
    let impact = 50; // Base impact score
    
    // Adjust based on source reputation
    const majorSources = ['Reuters', 'Bloomberg', 'CNBC', 'CoinDesk', 'Cointelegraph', 'CryptoCompare'];
    if (majorSources.includes(article.source)) impact += 20;
    
    // Adjust based on title prominence
    if (article.title.includes('BREAKING') || article.title.includes('URGENT')) impact += 15;
    
    // Adjust based on upvotes and views
    if (article.upvotes > 10) impact += 10;
    if (article.views > 1000) impact += 5;
    
    // Adjust based on recency
    const hoursAgo = (Date.now() - (article.published_on * 1000)) / (1000 * 60 * 60);
    if (hoursAgo < 1) impact += 15;
    else if (hoursAgo < 6) impact += 10;
    else if (hoursAgo < 24) impact += 5;
    
    return Math.min(Math.round(impact), 100);
  };

  // Helper function to generate default news when none are found
  const generateDefaultNews = (symbol: string): NewsItem[] => {
    return [
      {
        title: `${symbol} Market Update: Price Movement Analysis`,
        url: '#',
        source: 'Market Analysis',
        published_at: new Date().toISOString(),
        sentiment: 'neutral',
        impact: 50
      },
      {
        title: `${symbol} Trading Volume Shows Market Activity`,
        url: '#',
        source: 'Market Analysis',
        published_at: new Date().toISOString(),
        sentiment: 'neutral',
        impact: 40
      }
    ];
  };

  // Get AI analysis using Together API
  const getAIAnalysis = async (symbol: string, marketData: any) => {
    try {
      const messages = [
        {
          role: "system",
          content: "You are an expert financial analyst specializing in cryptocurrency and stock market analysis. Analyze market data and news to provide comprehensive insights."
        },
        {
          role: "user",
          content: `Analyze the following market data and news for ${symbol}:

Current Price: ${marketData.price}
24h Volume: ${marketData.volume}
Price Change (${timeFrame}): ${marketData.priceChange}
Market Cap: ${marketData.marketCap}

Recent News Headlines:
${marketData.newsHeadlines?.join('\n')}

Recent Market Events:
${marketData.recentNews?.map((news: any) => `- ${news.title} (${news.source})`).join('\n')}

Provide a comprehensive market analysis including:
1. Current market sentiment and key drivers
2. Technical analysis of price action
3. News sentiment analysis and potential impact
4. Potential risk factors
5. Growth opportunities
6. Key price levels to watch

Format your response as a JSON object with the following structure:
{
  "sentiment": "bullish|bearish|neutral",
  "confidence": number (0-100),
  "marketSentiment": "detailed explanation of current market sentiment",
  "technicalAnalysis": "detailed technical analysis",
  "riskFactors": ["risk1", "risk2", "risk3"],
  "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
  "keyLevels": {
    "support": [number1, number2],
    "resistance": [number1, number2]
  },
  "summary": ["key point 1", "key point 2", "key point 3"],
  "newsAnalysis": {
    "overallSentiment": "analysis of news sentiment",
    "majorEvents": ["event1", "event2", "event3"],
    "potentialImpact": "analysis of potential impact on price"
  }
}`
        }
      ];

      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + import.meta.env.VITE_TOGETHER_API_KEY
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
          messages,
          temperature: 0.7,
          max_tokens: 1000,
          context_length_exceeded_behavior: "error"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.message || 'Failed to get AI analysis'}`);
      }
      
      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      // Extract the JSON object from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI analysis response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleAnalyze = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    
    if (!symbol) {
      setError('Please enter a symbol');
      return;
    }

    if (!validateSymbol(symbol)) {
      setError('Invalid symbol format. Please use uppercase letters and numbers only.');
      return;
    }

    if (!user) {
      toast.error('Please log in to use this feature');
      return;
    }

    if (balance < TOOL_COSTS['market-analyst']) {
      toast.error(`Not enough coins. You need ${TOOL_COSTS['market-analyst']} coins.`);
      navigate('/shop');
      return;
    }

    setLoading(true);
    try {
      // First check if user can pay
      const canProceed = await handleToolAction();
      if (!canProceed) {
        throw new Error('Failed to process payment');
      }

      // Only proceed with analysis after successful payment
      const marketData = await fetchMarketData(symbol, timeFrame);
      const analysis = await getAIAnalysis(symbol, marketData);
      
      setAnalysisData({
        marketData,
        analysis,
        chartData: {
          labels: marketData.timePoints,
          datasets: [
            {
              label: symbol,
              data: marketData.prices,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              fill: true,
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
            },
          ],
        },
      });
    } catch (error) {
      console.error('Analysis error:', error);
      const message = error instanceof Error ? error.message : 'Failed to analyze market data. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer>
      <ContentContainer>
        <PageTitle variant="h3" component="h1" gutterBottom>
          AI Market Analyst
        </PageTitle>

        {/* Add coin balance display */}
        <CoinBalanceContainer>
          <CoinDisplay>
            <RiCoinLine />
            <Typography>{balance} coins</Typography>
          </CoinDisplay>
          <CostDisplay>
            Cost: {TOOL_COSTS['market-analyst']} coins per analysis
          </CostDisplay>
        </CoinBalanceContainer>

        {/* Input Form */}
        <Paper sx={{ 
          ...styles.glassCard, 
          p: { xs: 2, sm: 3, md: 4 }, 
          mb: { xs: 3, sm: 4 },
          '& .MuiInputBase-root': {
            color: 'white',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2196F3',
            },
          },
        }}>
          <form onSubmit={handleAnalyze}>
            <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Enter Coin Symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g., BTC"
                  helperText="Use uppercase letters and numbers only"
                  error={!!error}
                  sx={{
                    '& .MuiFormHelperText-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Time Frame</InputLabel>
                  <Select
                    value={timeFrame}
                    label="Time Frame"
                    onChange={(e) => setTimeFrame(e.target.value)}
                    sx={{
                      color: 'white',
                      '& .MuiSelect-icon': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    {TIME_FRAMES.map((tf) => (
                      <MenuItem key={tf.value} value={tf.value}>
                        {tf.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    height: { xs: '48px', sm: '56px' },
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1EA5D2 90%)',
                    },
                  }}
                >
                  {loading ? 'Analyzing...' : 'Analyze Market'}
                </Button>
              </Grid>
            </Grid>
          </form>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2,
                background: 'rgba(211, 47, 47, 0.1)',
                color: '#ff1744',
              }}
            >
              {error}
            </Alert>
          )}
        </Paper>

        {/* Analysis Results */}
        {analysisData && (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Market Sentiment */}
            <Grid item xs={12} md={4}>
              <Card sx={{ ...styles.glassCard, height: '100%' }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" gutterBottom sx={{
                    ...styles.gradientText,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Market Sentiment
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {analysisData.analysis.sentiment === 'bullish' ? (
                      <TrendingUpIcon sx={{ color: '#4caf50', fontSize: { xs: 32, sm: 40 } }} />
                    ) : analysisData.analysis.sentiment === 'bearish' ? (
                      <TrendingDownIcon sx={{ color: '#f44336', fontSize: { xs: 32, sm: 40 } }} />
                    ) : (
                      <TimelineIcon sx={{ color: '#ffb74d', fontSize: { xs: 32, sm: 40 } }} />
                    )}
                    <Box>
                      <Typography 
                        variant="h4" 
                        sx={{
                          fontSize: { xs: '1.5rem', sm: '2rem' },
                          color: analysisData.analysis.sentiment === 'bullish' 
                            ? '#4caf50'
                            : analysisData.analysis.sentiment === 'bearish'
                            ? '#f44336'
                            : '#ffb74d'
                        }}
                      >
                        {analysisData.analysis.sentiment.charAt(0).toUpperCase() + 
                         analysisData.analysis.sentiment.slice(1)}
                      </Typography>
                      <Chip
                        label={`Confidence: ${analysisData.analysis.confidence}%`}
                        sx={{
                          mt: 1,
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          color: 'white',
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Key Metrics */}
            <Grid item xs={12} md={8}>
              <Card sx={styles.glassCard}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" gutterBottom sx={{
                    ...styles.gradientText,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Key Metrics
                  </Typography>
                  <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    {Object.entries(analysisData.marketData.metrics).map(([key, value]) => (
                      <Grid item xs={6} sm={3} key={key}>
                        <Box sx={{
                          p: { xs: 1.5, sm: 2 },
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.05)',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                          },
                        }}>
                          <Typography variant="subtitle2" sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: { xs: '0.7rem', sm: '0.875rem' }
                          }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Typography>
                          <Typography variant="h6" sx={{ 
                            color: '#2196F3',
                            fontSize: { xs: '0.9rem', sm: '1.25rem' },
                            wordBreak: 'break-word'
                          }}>
                            {value}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Price Chart */}
            <Grid item xs={12}>
              <Box sx={styles.chartContainer}>
                <Line 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: `${symbol} Price Chart (${TIME_FRAMES.find(tf => tf.value === timeFrame)?.label})`,
                        color: 'white',
                      },
                      legend: {
                        ...chartOptions.plugins.legend,
                        labels: {
                          color: 'white',
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                        ticks: {
                          color: 'white',
                        },
                      },
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                        ticks: {
                          color: 'white',
                        },
                      },
                    },
                  }} 
                  data={{
                    ...analysisData.chartData,
                    datasets: [{
                      ...analysisData.chartData.datasets[0],
                      borderColor: '#2196F3',
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    }],
                  }}
                />
              </Box>
            </Grid>

            {/* Analysis Details */}
            <Grid item xs={12}>
              <Card sx={styles.glassCard}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AnalyticsIcon color="primary" />
                    <Typography variant="h6" sx={styles.gradientText}>Market Analysis</Typography>
                  </Box>
                  <Grid container spacing={3}>
                    {/* Market Sentiment */}
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Market Sentiment
                        </Typography>
                        <Typography>
                          {analysisData.analysis.marketSentiment}
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Technical Analysis */}
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Technical Analysis
                        </Typography>
                        <Typography>
                          {analysisData.analysis.technicalAnalysis}
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Risk Factors */}
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Risk Factors
                        </Typography>
                        <List>
                          {analysisData.analysis.riskFactors.map((risk: string, index: number) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <WarningIcon color="error" />
                              </ListItemIcon>
                              <ListItemText primary={risk} />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>

                    {/* Opportunities */}
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Growth Opportunities
                        </Typography>
                        <List>
                          {analysisData.analysis.opportunities.map((opportunity: string, index: number) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <LightbulbIcon color="success" />
                              </ListItemIcon>
                              <ListItemText primary={opportunity} />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>

                    {/* Key Levels */}
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Key Price Levels
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="success.main" gutterBottom>
                              Support Levels
                            </Typography>
                            {analysisData.analysis.keyLevels.support.map((level: number, index: number) => (
                              <Chip
                                key={index}
                                label={`$${level.toLocaleString()}`}
                                color="success"
                                variant="outlined"
                                sx={{ m: 0.5 }}
                              />
                            ))}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="error.main" gutterBottom>
                              Resistance Levels
                            </Typography>
                            {analysisData.analysis.keyLevels.resistance.map((level: number, index: number) => (
                              <Chip
                                key={index}
                                label={`$${level.toLocaleString()}`}
                                color="error"
                                variant="outlined"
                                sx={{ m: 0.5 }}
                              />
                            ))}
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* News Analysis */}
            <Grid item xs={12}>
              <Card sx={styles.glassCard}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <NewspaperIcon color="primary" />
                    <Typography variant="h6" sx={styles.gradientText}>News Analysis</Typography>
                  </Box>
                  <Grid container spacing={3}>
                    {/* News Sentiment */}
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          News Sentiment
                        </Typography>
                        <Typography>
                          {analysisData.analysis.newsAnalysis.overallSentiment}
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Major Events */}
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Major Events
                        </Typography>
                        <List>
                          {analysisData.analysis.newsAnalysis.majorEvents.map((event, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <PublicIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={event} />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>

                    {/* Potential Impact */}
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Potential Impact
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingFlatIcon />
                          <Typography>
                            {analysisData.analysis.newsAnalysis.potentialImpact}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>

                    {/* Recent News */}
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Recent News
                        </Typography>
                        <List>
                          {analysisData.marketData.recentNews?.map((news: NewsItem, index: number) => (
                            <React.Fragment key={index}>
                              {index > 0 && <Divider />}
                              <ListItem>
                                <ListItemIcon>
                                  {news.sentiment === 'positive' ? (
                                    <TrendingUpIcon color="success" />
                                  ) : news.sentiment === 'negative' ? (
                                    <TrendingDownIcon color="error" />
                                  ) : (
                                    <TrendingFlatIcon color="action" />
                                  )}
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <span>{news.title}</span>
                                      <Chip
                                        label={`Impact: ${news.impact}%`}
                                        size="small"
                                        color={
                                          news.impact > 70
                                            ? 'error'
                                            : news.impact > 40
                                            ? 'warning'
                                            : 'default'
                                        }
                                      />
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography component="span" sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                      <span>{news.source}</span>
                                      <span>{new Date(news.published_at).toLocaleString()}</span>
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            </React.Fragment>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Loading indicator */}
        {loading && (
          <LoadingOverlay>
            <LoadingContent>
              <CircularProgress size={30} sx={{ color: '#2196F3' }} />
              <Typography variant="h6">
                Analyzing {symbol}...
              </Typography>
            </LoadingContent>
          </LoadingOverlay>
        )}
      </ContentContainer>
    </MainContainer>
  );
};

export default MarketAnalyst; 