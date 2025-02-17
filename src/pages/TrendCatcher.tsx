import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/FuturisticUI';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  Alert,
  Button,
  Container,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  RiLineChartLine,
  RiTimeLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiBarChartBoxLine,
  RiRefreshLine,
  RiSearchLine,
  RiAlertLine,
} from 'react-icons/ri';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import SearchIcon from '@mui/icons-material/Search';
import { useToolAction } from '../hooks/useToolAction';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Trend {
  name: string;
  strength: number;
  direction: 'up' | 'down' | 'neutral';
  description: string;
  timeframe: string;
}

interface ChartDataset {
  label: string;
  data: (number | undefined)[];
  borderColor: string;
  tension: number;
  fill: boolean;
  backgroundColor?: string;
  borderDash?: number[];
  pointRadius?: number;
}

const TrendCatcher = () => {
  const handleToolAction = useToolAction('/trend-catcher');

  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState('BTC');
  const [timeframe, setTimeframe] = useState('1H');
  const [trendType, setTrendType] = useState('technical');
  const [error, setError] = useState<string | null>(null);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: ChartDataset[];
  }>({
    labels: [],
    datasets: []
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: true,
          color: 'rgba(255,255,255,0.5)',
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: true,
          color: 'rgba(255,255,255,0.5)',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      intersect: false,
    },
  };

  // Technical Indicator Calculations
  const calculateRSI = (prices: number[], period: number = 14): number[] => {
    const rsi = [];
    let gains = 0;
    let losses = 0;

    // Calculate initial average gain/loss
    for (let i = 1; i < period + 1; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Calculate RSI values
    for (let i = period + 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) {
        avgGain = (avgGain * (period - 1) + diff) / period;
        avgLoss = (avgLoss * (period - 1)) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = (avgLoss * (period - 1) - diff) / period;
      }
      
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }

    return Array(period).fill(undefined).concat(rsi);
  };

  const calculateSuperTrend = (klineData: any[], period: number = 10, multiplier: number = 3): any[] => {
    const supertrend: Array<{
      value: number;
      upperBand: number;
      lowerBand: number;
      upTrend: boolean;
    } | undefined> = [];
    const atr: number[] = [];
    let upTrend = true;

    // Calculate True Range and ATR
    for (let i = 0; i < klineData.length; i++) {
      const high = parseFloat(klineData[i][2]);
      const low = parseFloat(klineData[i][3]);
      const close = parseFloat(klineData[i][4]);
      const prevClose = i > 0 ? parseFloat(klineData[i-1][4]) : close;

      const tr = Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      );

      if (i < period) {
        atr.push(tr);
        supertrend.push(undefined);
        continue;
      }

      // Calculate ATR
      const atrValue: number = (atr[i-1] * (period - 1) + tr) / period;
      atr.push(atrValue);

      // Calculate SuperTrend
      const basicUpperBand = (high + low) / 2 + multiplier * atrValue;
      const basicLowerBand = (high + low) / 2 - multiplier * atrValue;

      const prevSupertrend = supertrend[i-1];
      const prevFinalUpperBand = prevSupertrend?.upperBand ?? basicUpperBand;
      const prevFinalLowerBand = prevSupertrend?.lowerBand ?? basicLowerBand;

      let finalUpperBand = basicUpperBand;
      let finalLowerBand = basicLowerBand;

      if (basicUpperBand < prevFinalUpperBand || close > prevFinalUpperBand) {
        finalUpperBand = basicUpperBand;
      } else {
        finalUpperBand = prevFinalUpperBand;
      }

      if (basicLowerBand > prevFinalLowerBand || close < prevFinalLowerBand) {
        finalLowerBand = basicLowerBand;
      } else {
        finalLowerBand = prevFinalLowerBand;
      }

      let supertrendValue: number;
      if (!prevSupertrend?.value) {
        supertrendValue = (high + low) / 2;
        upTrend = close > (high + low) / 2;
      } else {
        if (prevFinalUpperBand === prevSupertrend.value && close < finalUpperBand) {
          upTrend = false;
        } else if (prevFinalLowerBand === prevSupertrend.value && close > finalLowerBand) {
          upTrend = true;
        }
        supertrendValue = upTrend ? finalLowerBand : finalUpperBand;
      }

      supertrend.push({
        value: supertrendValue,
        upperBand: finalUpperBand,
        lowerBand: finalLowerBand,
        upTrend
      });
    }

    return supertrend;
  };

  const calculateIchimokuCloud = (klineData: any[]): any => {
    const tenkanPeriod = 9;
    const kijunPeriod = 26;
    const senkouBPeriod = 52;
    const displacement = 26;

    const calculateLine = (period: number, index: number) => {
      if (index < period - 1) return undefined;
      const slice = klineData.slice(index - period + 1, index + 1);
      const highs = slice.map(k => parseFloat(k[2]));
      const lows = slice.map(k => parseFloat(k[3]));
      return (Math.max(...highs) + Math.min(...lows)) / 2;
    };

    const tenkanSen = klineData.map((_, i) => calculateLine(tenkanPeriod, i));
    const kijunSen = klineData.map((_, i) => calculateLine(kijunPeriod, i));
    
    // Calculate Senkou Span A (Leading Span A)
    const senkouSpanA = tenkanSen.map((_, i) => {
      if (!tenkanSen[i] || !kijunSen[i]) return undefined;
      return (tenkanSen[i] + kijunSen[i]) / 2;
    });

    // Calculate Senkou Span B (Leading Span B)
    const senkouSpanB = klineData.map((_, i) => calculateLine(senkouBPeriod, i));

    // Shift clouds forward
    const shiftedSpanA = [...Array(displacement).fill(undefined), ...senkouSpanA.slice(0, -displacement)];
    const shiftedSpanB = [...Array(displacement).fill(undefined), ...senkouSpanB.slice(0, -displacement)];

    return {
      tenkanSen,
      kijunSen,
      senkouSpanA: shiftedSpanA,
      senkouSpanB: shiftedSpanB
    };
  };

  // Fetch market data from Binance
  const fetchMarketData = async (symbol: string, timeframe: string) => {
    try {
      // Convert timeframe to Binance interval format
      const interval = timeframe === '1H' ? '1m' :
                      timeframe === '4H' ? '5m' :
                      timeframe === '1D' ? '15m' :
                      timeframe === '1W' ? '1h' : '4h';
      
      // Calculate limit based on timeframe
      const limit = timeframe === '1H' ? 60 :
                   timeframe === '4H' ? 48 :
                   timeframe === '1D' ? 96 :
                   timeframe === '1W' ? 168 : 90;

      const pair = `${symbol}USDT`;
      
      const [klineResponse, tickerResponse] = await Promise.all([
        fetch(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`),
        fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`)
      ]);

      if (!klineResponse.ok || !tickerResponse.ok) {
        throw new Error('Failed to fetch market data');
      }

      const [klineData, tickerData] = await Promise.all([
        klineResponse.json(),
        tickerResponse.json()
      ]);

      // Process price data
      const prices = klineData.map((k: any[]) => parseFloat(k[4]));
      const timePoints = klineData.map((k: any[]) => {
        const date = new Date(k[0]);
        return timeframe === '1D' || timeframe === '1W'
          ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleString();
      });

      // Calculate indicators based on timeframe
      const indicators: any = {
        ma20: calculateMA(prices, 20),
        ma50: calculateMA(prices, 50),
        rsi: calculateRSI(prices),
        supertrend: calculateSuperTrend(klineData)
      };

      // Add Ichimoku Cloud for 4H and higher timeframes
      if (['4H', '1D', '1W'].includes(timeframe)) {
        indicators.ichimoku = calculateIchimokuCloud(klineData);
      }

      return {
        prices,
        timePoints,
        indicators,
        currentPrice: parseFloat(tickerData.lastPrice),
        priceChange: parseFloat(tickerData.priceChangePercent),
        volume: parseFloat(tickerData.volume),
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  };

  // Calculate Moving Average
  const calculateMA = (prices: number[], period: number): (number | undefined)[] => {
    const ma = [];
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        ma.push(undefined);
        continue;
      }
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      ma.push(sum / period);
    }
    return ma;
  };

  // Get AI trend analysis
  const getTrendAnalysis = async (marketData: any) => {
    try {
      const messages = [
        {
          role: "system",
          content: "You are an expert technical analyst specializing in cryptocurrency trend analysis. Analyze the provided market data and identify key trends, patterns, and potential market movements."
        },
        {
          role: "user",
          content: `Analyze the following market data for ${symbol}:

Current Price: $${marketData.currentPrice}
Price Change: ${marketData.priceChange}%
Volume: ${marketData.volume}
Timeframe: ${timeframe}

Identify the following:
1. Major trend patterns
2. Support/resistance breakouts
3. Volume analysis
4. Momentum indicators
5. Key levels to watch

Format your response as a JSON array of trend objects with the following structure:
[
  {
    "name": "trend name",
    "strength": number (0-100),
    "direction": "up" | "down" | "neutral",
    "description": "detailed trend description",
    "timeframe": "short" | "medium" | "long"
  }
]`
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
        throw new Error('Failed to get AI analysis');
      }
      
      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      // Extract the JSON array from the response
      const jsonMatch = analysisText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI analysis response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error getting trend analysis:', error);
      throw error;
    }
  };

  const handleTimeframeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeframe: string
  ) => {
    if (newTimeframe !== null) {
      setTimeframe(newTimeframe);
    }
  };

  const handleTrendTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTrendType: string
  ) => {
    if (newTrendType !== null) {
      setTrendType(newTrendType);
    }
  };

  const refreshData = async (currentSymbol: string = symbol, currentTimeframe: string = timeframe) => {
    if (loading) return;
    
    // Check if user has enough coins before proceeding
    const canProceed = await handleToolAction();
    if (!canProceed) return;

    setLoading(true);
    setError(null);
    
    try {
      const marketData = await fetchMarketData(currentSymbol, currentTimeframe);
      const trends = await getTrendAnalysis(marketData);
      
      setTrends(trends);

      // Simplified dataset with only price data for a cleaner look
      const datasets: ChartDataset[] = [
        {
          label: `${currentSymbol} Price`,
          data: marketData.prices,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(75, 192, 192, 0.05)',
          pointRadius: 0,
        }
      ];

      setChartData({
        labels: marketData.timePoints,
        datasets
      });
    } catch (error) {
      setError('Failed to fetch trend data. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-light relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-radial-at-t from-blue-500/20 via-transparent to-transparent blur-3xl" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-radial-at-b from-blue-400/20 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Header Section */}
        <GlassCard variant="cyber" className="mb-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 animate-gradient-x">
                AI Trend Catcher
              </h1>
              <p className="text-light/60">
                Analyze market trends with advanced AI technology
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center justify-end">
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="Symbol (e.g., BTC)"
                className="px-4 py-2 rounded-xl bg-black/20 border border-white/10 text-light placeholder-light/40
                  focus:outline-none focus:border-blue-500/50 transition-all duration-200"
              />
              
              <div className="flex rounded-xl bg-black/20 border border-white/10 p-1">
                {['1H', '4H', '1D', '1W'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      timeframe === tf
                        ? 'bg-blue-500 text-dark'
                        : 'text-light/60 hover:text-light'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="flex rounded-xl bg-black/20 border border-white/10 p-1">
                {['technical', 'sentiment'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTrendType(type)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      trendType === type
                        ? 'bg-blue-500 text-dark'
                        : 'text-light/60 hover:text-light'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => refreshData()}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-dark font-medium
                  hover:from-blue-400/90 hover:to-blue-600/90 transition-all duration-200 flex items-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RiSearchLine className="w-5 h-5" />
                    Start Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </GlassCard>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2">
            <RiAlertLine className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Chart and Stats Section */}
        <GlassCard variant="cyber" className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
            <div className="lg:col-span-3 bg-black/20 rounded-xl border border-white/10 p-4">
              {loading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : (
                <Line options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      labels: {
                        color: 'rgba(255,255,255,0.7)',
                      },
                    },
                    title: {
                      ...chartOptions.plugins.title,
                      color: 'rgba(255,255,255,0.9)',
                    },
                  },
                  scales: {
                    y: {
                      ...chartOptions.scales.y,
                      grid: {
                        color: 'rgba(255,255,255,0.1)',
                      },
                      ticks: {
                        color: 'rgba(255,255,255,0.7)',
                      },
                    },
                    x: {
                      grid: {
                        color: 'rgba(255,255,255,0.1)',
                      },
                      ticks: {
                        color: 'rgba(255,255,255,0.7)',
                      },
                    },
                  },
                }} data={chartData} />
              )}
            </div>

            <div className="space-y-4">
              {/* Market Summary */}
              <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                <h3 className="text-lg font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                  Market Summary
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-light/40 text-sm">Symbol</span>
                    <p className="text-light font-medium">{symbol}/USDT</p>
                  </div>
                  <div>
                    <span className="text-light/40 text-sm">Timeframe</span>
                    <p className="text-light font-medium">{timeframe}</p>
                  </div>
                  <div>
                    <span className="text-light/40 text-sm">Analysis Type</span>
                    <p className="text-light font-medium capitalize">{trendType}</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                <h3 className="text-lg font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-light/40 text-sm">Total Trends</span>
                    <p className="text-3xl font-bold text-blue-500">{trends.length}</p>
                  </div>
                  <div>
                    <span className="text-light/40 text-sm mb-2 block">Trend Direction</span>
                    <div className="flex gap-2">
                      <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-1">
                        <RiArrowUpLine />
                        {trends.filter(t => t.direction === 'up').length}
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-1">
                        <RiArrowDownLine />
                        {trends.filter(t => t.direction === 'down').length}
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-light/60 flex items-center gap-1">
                        <RiBarChartBoxLine />
                        {trends.filter(t => t.direction === 'neutral').length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Trend Analysis Section */}
        <GlassCard variant="cyber" className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
            Trend Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trends.map((trend, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-black/20 border border-white/10 transition-all duration-200
                  hover:bg-black/30 hover:border-white/20 hover:transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-xl ${
                    trend.direction === 'up'
                      ? 'bg-green-500/10 text-green-500'
                      : trend.direction === 'down'
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-white/5 text-light/60'
                  }`}>
                    {trend.direction === 'up' ? (
                      <RiArrowUpLine className="w-6 h-6" />
                    ) : trend.direction === 'down' ? (
                      <RiArrowDownLine className="w-6 h-6" />
                    ) : (
                      <RiBarChartBoxLine className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-light">{trend.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-sm ${
                        trend.strength > 70
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                          : trend.strength > 30
                          ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {trend.strength}%
                      </span>
                    </div>
                    <p className="text-light/60 text-sm">{trend.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-light/40 text-sm">
                      <RiTimeLine className="w-4 h-4" />
                      {trend.timeframe}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {trends.length === 0 && !loading && (
              <div className="md:col-span-2 text-center py-12">
                <RiLineChartLine className="w-12 h-12 text-light/20 mx-auto mb-4" />
                <p className="text-light/40">No trends analyzed yet</p>
                <p className="text-light/60 text-sm">Click the Start Analysis button to begin</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default TrendCatcher; 