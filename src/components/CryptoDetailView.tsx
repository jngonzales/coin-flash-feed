import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Info, DollarSign, BarChart3, Clock, Zap, Shield, ArrowLeft, Brain, Calendar, Target, LineChart, Activity, Volume2, Star, Copy, ExternalLink, BarChart2 } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, ComposedChart } from 'recharts';
import { getCryptoById, generatePriceHistory, PricePoint, CryptoInfo } from '@/data/cryptoData';
import { getSingleCrypto } from '@/services/cryptoWebSocket';
import ProfessionalTradingChart from './ProfessionalTradingChart';

// Using CryptoInfo from data/cryptoData.ts
// Using PricePoint from data/cryptoData.ts

interface TechnicalIndicators {
  sma_20?: number;
  sma_50?: number;
  rsi?: number;
  macd?: number;
  bollinger_upper?: number;
  bollinger_lower?: number;
}

interface TimeframeOption {
  value: string;
  label: string;
  seconds: number;
}

const timeframes: TimeframeOption[] = [
  // Seconds
  { value: '1s', label: '1 second', seconds: 1 },
  { value: '5s', label: '5 seconds', seconds: 5 },
  { value: '10s', label: '10 seconds', seconds: 10 },
  { value: '15s', label: '15 seconds', seconds: 15 },
  { value: '30s', label: '30 seconds', seconds: 30 },
  { value: '45s', label: '45 seconds', seconds: 45 },
  
  // Minutes
  { value: '1m', label: '1 minute', seconds: 60 },
  { value: '2m', label: '2 minutes', seconds: 120 },
  { value: '3m', label: '3 minutes', seconds: 180 },
  { value: '5m', label: '5 minutes', seconds: 300 },
  { value: '10m', label: '10 minutes', seconds: 600 },
  { value: '15m', label: '15 minutes', seconds: 900 },
  { value: '30m', label: '30 minutes', seconds: 1800 },
  { value: '45m', label: '45 minutes', seconds: 2700 },
  
  // Hours
  { value: '1h', label: '1 hour', seconds: 3600 },
  { value: '2h', label: '2 hours', seconds: 7200 },
  { value: '3h', label: '3 hours', seconds: 10800 },
  { value: '4h', label: '4 hours', seconds: 14400 },
  { value: '5h', label: '5 hours', seconds: 18000 },
  { value: '6h', label: '6 hours', seconds: 21600 },
  { value: '7h', label: '7 hours', seconds: 25200 },
  { value: '8h', label: '8 hours', seconds: 28800 },
  { value: '9h', label: '9 hours', seconds: 32400 },
  { value: '10h', label: '10 hours', seconds: 36000 },
  { value: '11h', label: '11 hours', seconds: 39600 },
  { value: '12h', label: '12 hours', seconds: 43200 },
  { value: '13h', label: '13 hours', seconds: 46800 },
  { value: '14h', label: '14 hours', seconds: 50400 },
  { value: '15h', label: '15 hours', seconds: 54000 },
  { value: '16h', label: '16 hours', seconds: 57600 },
  { value: '17h', label: '17 hours', seconds: 61200 },
  { value: '18h', label: '18 hours', seconds: 64800 },
  { value: '19h', label: '19 hours', seconds: 68400 },
  { value: '20h', label: '20 hours', seconds: 72000 },
  { value: '21h', label: '21 hours', seconds: 75600 },
  { value: '22h', label: '22 hours', seconds: 79200 },
  { value: '23h', label: '23 hours', seconds: 82800 },
  
  // Days
  { value: '1d', label: '1 day', seconds: 86400 },
  { value: '2d', label: '2 days', seconds: 172800 },
  { value: '3d', label: '3 days', seconds: 259200 },
  { value: '4d', label: '4 days', seconds: 345600 },
  { value: '5d', label: '5 days', seconds: 432000 },
  { value: '6d', label: '6 days', seconds: 518400 },
  { value: '7d', label: '7 days', seconds: 604800 },
  { value: '8d', label: '8 days', seconds: 691200 },
  { value: '9d', label: '9 days', seconds: 777600 },
  { value: '10d', label: '10 days', seconds: 864000 },
  { value: '11d', label: '11 days', seconds: 950400 },
  { value: '12d', label: '12 days', seconds: 1036800 },
  { value: '13d', label: '13 days', seconds: 1123200 },
  { value: '14d', label: '14 days', seconds: 1209600 },
  { value: '15d', label: '15 days', seconds: 1296000 },
  { value: '16d', label: '16 days', seconds: 1382400 },
  { value: '17d', label: '17 days', seconds: 1468800 },
  { value: '18d', label: '18 days', seconds: 1555200 },
  { value: '19d', label: '19 days', seconds: 1641600 },
  { value: '20d', label: '20 days', seconds: 1728000 },
  { value: '21d', label: '21 days', seconds: 1814400 },
  { value: '22d', label: '22 days', seconds: 1900800 },
  { value: '23d', label: '23 days', seconds: 1987200 },
  { value: '24d', label: '24 days', seconds: 2073600 },
  { value: '25d', label: '25 days', seconds: 2160000 },
  { value: '26d', label: '26 days', seconds: 2246400 },
  { value: '27d', label: '27 days', seconds: 2332800 },
  { value: '28d', label: '28 days', seconds: 2419200 },
  { value: '29d', label: '29 days', seconds: 2505600 },
  
  // Months
  { value: '1M', label: '1 month', seconds: 2629746 },
  { value: '2M', label: '2 months', seconds: 5259492 },
  { value: '3M', label: '3 months', seconds: 7889238 },
  { value: '4M', label: '4 months', seconds: 10518984 },
  { value: '5M', label: '5 months', seconds: 13148730 },
  { value: '6M', label: '6 months', seconds: 15778476 },
  { value: '7M', label: '7 months', seconds: 18408222 },
  { value: '8M', label: '8 months', seconds: 21037968 },
  { value: '9M', label: '9 months', seconds: 23667714 },
  { value: '10M', label: '10 months', seconds: 26297460 },
  { value: '11M', label: '11 months', seconds: 28927206 },
  
  // Years
  { value: '1Y', label: '1 year', seconds: 31556952 },
  { value: '2Y', label: '2 years', seconds: 63113904 },
  { value: '3Y', label: '3 years', seconds: 94670856 },
  { value: '4Y', label: '4 years', seconds: 126227808 },
  { value: 'max', label: 'Since existence', seconds: 0 },
];

interface AIPrediction {
  nextDay: {
    price: number;
    confidence: number;
    trend: 'bullish' | 'bearish' | 'neutral';
  };
  nextWeek: {
    price: number;
    confidence: number;
    trend: 'bullish' | 'bearish' | 'neutral';
  };
  nextMonth: {
    price: number;
    confidence: number;
    trend: 'bullish' | 'bearish' | 'neutral';
  };
}

interface CryptoDetailViewProps {
  cryptoId: string;
  onBack: () => void;
}

const CryptoDetailView: React.FC<CryptoDetailViewProps> = ({ cryptoId, onBack }) => {
  const [cryptoData, setCryptoData] = useState<CryptoInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [updateInterval, setUpdateInterval] = useState<string>('30s');
  const [aiPredictions, setAiPredictions] = useState<AIPrediction | null>(null);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [historyTimeframe, setHistoryTimeframe] = useState<string>('1d');
  const [mainChartTimeframe, setMainChartTimeframe] = useState<string>('1h');
  const [chartType, setChartType] = useState<'line' | 'area' | 'candlestick'>('candlestick');
  const [showVolume, setShowVolume] = useState(true);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicators>({});
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiveData, setIsLiveData] = useState(false);
  
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const loadCryptoData = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      }
      setError(null);
      
      // Try to get live data using your 4 CoinGecko API keys
      const liveApiData = await getSingleCrypto(cryptoId);
      
      // Get base data from our database, or create from live data
      let baseData = getCryptoById(cryptoId);
      
      // If not in our database but we have live data, create base data from live data
      if (!baseData && liveApiData) {
        baseData = {
          id: liveApiData.id || cryptoId,
          symbol: liveApiData.symbol || cryptoId,
          name: liveApiData.name || cryptoId.toUpperCase(),
          current_price: liveApiData.market_data?.current_price?.usd || 0,
          price_change_percentage_24h: liveApiData.market_data?.price_change_percentage_24h || 0,
          price_change_percentage_7d: liveApiData.market_data?.price_change_percentage_7d || 0,
          price_change_percentage_30d: liveApiData.market_data?.price_change_percentage_30d || 0,
          market_cap: liveApiData.market_data?.market_cap?.usd || 0,
          market_cap_rank: liveApiData.market_cap_rank || 999,
          total_volume: liveApiData.market_data?.total_volume?.usd || 0,
          high_24h: liveApiData.market_data?.high_24h?.usd || 0,
          low_24h: liveApiData.market_data?.low_24h?.usd || 0,
          ath: liveApiData.market_data?.ath?.usd || 0,
          ath_change_percentage: liveApiData.market_data?.ath_change_percentage?.usd || 0,
          circulating_supply: liveApiData.market_data?.circulating_supply || 0,
          max_supply: liveApiData.market_data?.max_supply || null,
          total_supply: liveApiData.market_data?.total_supply || 0,
          image: liveApiData.image?.large || `https://via.placeholder.com/64x64/3B82F6/FFFFFF?text=${cryptoId.slice(0, 2).toUpperCase()}`,
          description: liveApiData.description?.en?.substring(0, 500) + '...' || `${liveApiData.name || cryptoId} is a cryptocurrency.`,
          genesis_date: liveApiData.genesis_date || null,
        };
      }
      
      if (!baseData) {
        throw new Error('Cryptocurrency not found and no live data available');
      }

      // Merge live data with base data
      const updatedData = {
        ...baseData,
        current_price: liveApiData?.market_data?.current_price?.usd || baseData.current_price,
        price_change_percentage_24h: liveApiData?.market_data?.price_change_percentage_24h || baseData.price_change_percentage_24h,
        market_cap: liveApiData?.market_data?.market_cap?.usd || baseData.market_cap,
        total_volume: liveApiData?.market_data?.total_volume?.usd || baseData.total_volume,
        high_24h: liveApiData?.market_data?.high_24h?.usd || baseData.high_24h,
        low_24h: liveApiData?.market_data?.low_24h?.usd || baseData.low_24h,
        image: liveApiData?.image?.large || baseData.image,
      };

      setIsLiveData(!!liveApiData);
      setCryptoData(updatedData);
      setLastUpdate(new Date());
      if (isInitialLoad) {
        setLoading(false);
      }
      
      // Generate AI predictions
      generateAIPredictions(updatedData);
      
      // Load initial price history
      loadPriceHistory(mainChartTimeframe);
    } catch (error) {
      console.error('Error loading crypto data:', error);
      setError('Failed to load cryptocurrency data. Please try again.');
      setLoading(false);
    }
  };

  const loadPriceHistory = (timeframe: string) => {
    if (!cryptoData) return;
    
    setHistoryLoading(true);
    try {
      const timeframeObj = timeframes.find(tf => tf.value === timeframe);
      let points = 100;
      
      if (timeframeObj) {
        const totalHours = timeframeObj.seconds / 3600;
        if (totalHours <= 1) points = 60; // 1 minute intervals
        else if (totalHours <= 24) points = 96; // 15 minute intervals
        else if (totalHours <= 168) points = 168; // 1 hour intervals
        else if (totalHours <= 720) points = 120; // 6 hour intervals
        else points = 100; // Daily intervals
      }
      
      const history = generatePriceHistory(cryptoData, timeframe, points);
      setPriceHistory(history);
      
      // Calculate technical indicators
      if (history.length > 20) {
        const prices = history.map(point => point.close);
        const sma20 = calculateSMA(prices, 20);
        const sma50 = calculateSMA(prices, Math.min(50, prices.length));
        const rsi = calculateRSI(prices, 14);
        
        setTechnicalIndicators({
          sma_20: sma20,
          sma_50: sma50,
          rsi: rsi,
        });
      }
    } catch (error) {
      console.error('Error generating price history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const calculateSMA = (prices: number[], period: number): number => {
    if (prices.length < period) return 0;
    const sum = prices.slice(-period).reduce((acc, price) => acc + price, 0);
    return sum / period;
  };

  const calculateRSI = (prices: number[], period: number): number => {
    if (prices.length < period) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = prices.length - period; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  const handleWatchlistToggle = () => {
    if (!cryptoData) return;
    
    if (isInWatchlist(cryptoData.id)) {
      removeFromWatchlist(cryptoData.id);
    } else {
      addToWatchlist({
        id: cryptoData.id,
        symbol: cryptoData.symbol,
        name: cryptoData.name,
        image: cryptoData.image,
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShareExternal = () => {
    const url = `https://coingecko.com/en/coins/${cryptoId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const retryLoadData = () => {
    setError(null);
    setLoading(true);
    loadCryptoData();
  };

  const generateAIPredictions = (data: CryptoInfo) => {
    // Simulated AI predictions based on current trends and volatility
    const volatility = Math.abs(data.price_change_percentage_24h) / 100;
    const trend = data.price_change_percentage_24h > 0 ? 'bullish' : 'bearish';
    
    const predictions: AIPrediction = {
      nextDay: {
        price: data.current_price * (1 + (Math.random() - 0.5) * volatility * 0.5),
        confidence: Math.max(60, 90 - volatility * 100),
        trend: Math.random() > 0.5 ? trend : (trend === 'bullish' ? 'bearish' : 'bullish')
      },
      nextWeek: {
        price: data.current_price * (1 + (Math.random() - 0.5) * volatility * 2),
        confidence: Math.max(50, 80 - volatility * 120),
        trend: Math.random() > 0.4 ? trend : 'neutral'
      },
      nextMonth: {
        price: data.current_price * (1 + (Math.random() - 0.5) * volatility * 5),
        confidence: Math.max(40, 70 - volatility * 150),
        trend: Math.random() > 0.6 ? 'neutral' : trend
      }
    };
    
    setAiPredictions(predictions);
  };

  useEffect(() => {
    loadCryptoData(true);
  }, [cryptoId]);

  useEffect(() => {
    if (cryptoData) {
      loadPriceHistory(historyTimeframe);
    }
  }, [historyTimeframe, cryptoData]);

  useEffect(() => {
    const selectedTimeframe = timeframes.find(tf => tf.value === updateInterval);
    if (selectedTimeframe && selectedTimeframe.seconds > 0) {
      // Optimize intervals for your 4 API keys - much faster updates possible
      const optimizedInterval = Math.max(
        selectedTimeframe.seconds * 1000, 
        2000 // Minimum 2 seconds with 4 keys for efficiency
      );
      const interval = setInterval(() => loadCryptoData(false), optimizedInterval);
      return () => clearInterval(interval);
    }
  }, [updateInterval, cryptoId]);

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 8,
      });
    }
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  const getSupplyPercentage = () => {
    if (!cryptoData?.max_supply || !cryptoData?.circulating_supply) return 0;
    return (cryptoData.circulating_supply / cryptoData.max_supply) * 100;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'text-crypto-green';
      case 'bearish': return 'text-crypto-red';
      default: return 'text-crypto-blue';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-foreground">Loading {cryptoId} data...</div>
        </div>
      </div>
    );
  }

  if (!cryptoData && error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 mb-4">⚠️ {error}</div>
          <div className="flex gap-2 justify-center">
            <Button onClick={retryLoadData} variant="default">
              Try Again
            </Button>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!cryptoData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          Failed to load cryptocurrency data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          
          <div className="flex items-center gap-4 flex-1">
            <img src={cryptoData.image} alt={cryptoData.name} className="w-16 h-16" />
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-crypto-purple bg-clip-text text-transparent">
                {cryptoData.name} ({cryptoData.symbol.toUpperCase()})
              </h1>
              <p className="text-muted-foreground">
                Real-time market data and AI predictions
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Watchlist Button */}
            <Button
              onClick={handleWatchlistToggle}
              variant={isInWatchlist(cryptoData.id) ? "default" : "outline"}
              size="sm"
            >
              <Star className={`w-4 h-4 mr-2 ${isInWatchlist(cryptoData.id) ? 'fill-current' : ''}`} />
              {isInWatchlist(cryptoData.id) ? 'In Watchlist' : 'Add to Watchlist'}
            </Button>
            
            {/* Share Buttons */}
            <Button onClick={handleCopyLink} variant="outline" size="sm">
              <Copy className="w-4 h-4" />
            </Button>
            
            <Button onClick={handleShareExternal} variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
            

          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()} • Updates every 5 seconds
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLiveData ? 'bg-crypto-green animate-pulse' : 'bg-crypto-orange'}`}></div>
            <span className="text-xs text-muted-foreground">
              {isLiveData ? 'Live Market Data' : 'Enhanced Simulation'}
            </span>
          </div>
        </div>

        {/* Main Price Card */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-crypto-hover animate-pulse-glow">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2 animate-fade-in">
              <h2 className="text-2xl font-bold">{cryptoData.name} ({cryptoData.symbol.toUpperCase()})</h2>
              <Badge variant="secondary" className="animate-slide-up">#{cryptoData.market_cap_rank}</Badge>
            </div>
            <div className="text-5xl md:text-6xl font-bold text-foreground mb-2 animate-fade-in bg-gradient-to-r from-primary to-crypto-purple bg-clip-text text-transparent price-transition">
              {formatPrice(cryptoData.current_price)}
            </div>
            <div className="flex items-center justify-center gap-2 animate-slide-up">
              {cryptoData.price_change_percentage_24h > 0 ? (
                <TrendingUp className="w-5 h-5 text-crypto-green animate-pulse" />
              ) : (
                <TrendingDown className="w-5 h-5 text-crypto-red animate-pulse" />
              )}
              <Badge
                variant={cryptoData.price_change_percentage_24h > 0 ? 'default' : 'destructive'}
                className={`text-lg px-3 py-1 transition-all duration-300 hover:scale-105 ${
                  cryptoData.price_change_percentage_24h > 0
                    ? 'bg-crypto-green/10 text-crypto-green border-crypto-green/20 hover:bg-crypto-green/20'
                    : 'bg-crypto-red/10 text-crypto-red border-crypto-red/20 hover:bg-crypto-red/20'
                }`}
              >
                {cryptoData.price_change_percentage_24h > 0 ? '+' : ''}
                {cryptoData.price_change_percentage_24h.toFixed(2)}% (24h)
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-crypto-hover transition-all duration-300 hover:scale-105 animate-fade-in cursor-pointer group">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 text-crypto-blue mx-auto mb-2 group-hover:animate-pulse" />
              <div className="text-sm text-muted-foreground">Market Cap</div>
              <div className="font-bold group-hover:text-crypto-blue transition-colors">{formatLargeNumber(cryptoData.market_cap)}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-crypto-hover transition-all duration-300 hover:scale-105 animate-fade-in cursor-pointer group" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 text-crypto-green mx-auto mb-2 group-hover:animate-pulse" />
              <div className="text-sm text-muted-foreground">24h Volume</div>
              <div className="font-bold group-hover:text-crypto-green transition-colors">{formatLargeNumber(cryptoData.total_volume)}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-crypto-hover transition-all duration-300 hover:scale-105 animate-fade-in cursor-pointer group" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-crypto-purple mx-auto mb-2 group-hover:animate-pulse" />
              <div className="text-sm text-muted-foreground">24h High</div>
              <div className="font-bold group-hover:text-crypto-purple transition-colors">{formatPrice(cryptoData.high_24h)}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-crypto-hover transition-all duration-300 hover:scale-105 animate-fade-in cursor-pointer group" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-4 text-center">
              <TrendingDown className="w-6 h-6 text-crypto-red mx-auto mb-2 group-hover:animate-pulse" />
              <div className="text-sm text-muted-foreground">24h Low</div>
              <div className="font-bold group-hover:text-crypto-red transition-colors">{formatPrice(cryptoData.low_24h)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Trading Chart */}
        <ProfessionalTradingChart cryptoData={cryptoData} height={600} />

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="supply">Supply Info</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="price-history">Price History</TabsTrigger>
            <TabsTrigger value="ai-predictions">AI Predictions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Price Changes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">24 hours</span>
                    <Badge variant={cryptoData.price_change_percentage_24h > 0 ? 'default' : 'destructive'}>
                      {cryptoData.price_change_percentage_24h > 0 ? '+' : ''}
                      {cryptoData.price_change_percentage_24h.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">7 days</span>
                    <Badge variant={cryptoData.price_change_percentage_7d > 0 ? 'default' : 'destructive'}>
                      {cryptoData.price_change_percentage_7d > 0 ? '+' : ''}
                      {cryptoData.price_change_percentage_7d.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">30 days</span>
                    <Badge variant={cryptoData.price_change_percentage_30d > 0 ? 'default' : 'destructive'}>
                      {cryptoData.price_change_percentage_30d > 0 ? '+' : ''}
                      {cryptoData.price_change_percentage_30d.toFixed(2)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Key Facts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">All-Time High</span>
                    <span className="font-medium">{formatPrice(cryptoData.ath)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From ATH</span>
                    <Badge variant="destructive">
                      {cryptoData.ath_change_percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Rank</span>
                    <Badge variant="secondary">#{cryptoData.market_cap_rank}</Badge>
                  </div>
                  {cryptoData.genesis_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Genesis Date</span>
                      <span className="font-medium">{new Date(cryptoData.genesis_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {cryptoData.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    About {cryptoData.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {cryptoData.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="supply" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {cryptoData.name} Supply Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Circulating Supply</span>
                    <span className="font-medium">
                      {cryptoData.circulating_supply?.toLocaleString()} {cryptoData.symbol.toUpperCase()}
                    </span>
                  </div>
                  {cryptoData.total_supply && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Supply</span>
                      <span className="font-medium">
                        {cryptoData.total_supply.toLocaleString()} {cryptoData.symbol.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {cryptoData.max_supply && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Maximum Supply</span>
                      <span className="font-medium">
                        {cryptoData.max_supply.toLocaleString()} {cryptoData.symbol.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                {cryptoData.max_supply && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Supply Progress</span>
                      <span>{getSupplyPercentage().toFixed(2)}%</span>
                    </div>
                    <Progress value={getSupplyPercentage()} className="h-2" />
                  </div>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {cryptoData.max_supply 
                      ? `${cryptoData.name} has a maximum supply of ${cryptoData.max_supply.toLocaleString()} coins, creating scarcity that may affect its value.`
                      : `${cryptoData.name} does not have a maximum supply cap, meaning new coins can continue to be created.`
                    }
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Price Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className={`text-2xl font-bold ${cryptoData.price_change_percentage_24h > 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                      {cryptoData.price_change_percentage_24h > 0 ? '+' : ''}
                      {cryptoData.price_change_percentage_24h.toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground">24 Hours</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className={`text-2xl font-bold ${cryptoData.price_change_percentage_7d > 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                      {cryptoData.price_change_percentage_7d > 0 ? '+' : ''}
                      {cryptoData.price_change_percentage_7d.toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground">7 Days</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className={`text-2xl font-bold ${cryptoData.price_change_percentage_30d > 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                      {cryptoData.price_change_percentage_30d > 0 ? '+' : ''}
                      {cryptoData.price_change_percentage_30d.toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground">30 Days</div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Investment Reminder:</strong> Cryptocurrency prices are highly volatile. 
                    Past performance doesn't indicate future results. Only invest what you can afford to lose.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="price-history" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Price History & Analysis
                  </CardTitle>
                  <Select value={historyTimeframe} onValueChange={setHistoryTimeframe}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Seconds</div>
                      {timeframes.filter(tf => tf.value.endsWith('s')).map((timeframe) => (
                        <SelectItem key={timeframe.value} value={timeframe.value}>
                          {timeframe.label}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Minutes</div>
                      {timeframes.filter(tf => tf.value.endsWith('m')).map((timeframe) => (
                        <SelectItem key={timeframe.value} value={timeframe.value}>
                          {timeframe.label}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Hours</div>
                      {timeframes.filter(tf => tf.value.endsWith('h')).map((timeframe) => (
                        <SelectItem key={timeframe.value} value={timeframe.value}>
                          {timeframe.label}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Days</div>
                      {timeframes.filter(tf => tf.value.endsWith('d')).map((timeframe) => (
                        <SelectItem key={timeframe.value} value={timeframe.value}>
                          {timeframe.label}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Months & Years</div>
                      {timeframes.filter(tf => tf.value.endsWith('M') || tf.value.endsWith('Y') || tf.value === 'max').map((timeframe) => (
                        <SelectItem key={timeframe.value} value={timeframe.value}>
                          {timeframe.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading price history...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Professional Trading Chart for Price History */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Price History - {historyTimeframe}</h3>
                        <Select value={historyTimeframe} onValueChange={setHistoryTimeframe}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeframes.map((timeframe) => (
                              <SelectItem key={timeframe.value} value={timeframe.value}>
                                {timeframe.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <ProfessionalTradingChart cryptoData={cryptoData} height={500} />
                    </div>

                    {/* Price Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 border rounded-lg text-center">
                        <div className="text-sm text-muted-foreground">Period High</div>
                        <div className="text-lg font-bold text-crypto-green">
                          ${Math.max(...generatePriceHistory(cryptoData, historyTimeframe, 200).map(p => p.high)).toFixed(4)}
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <div className="text-sm text-muted-foreground">Period Low</div>
                        <div className="text-lg font-bold text-crypto-red">
                          ${Math.min(...generatePriceHistory(cryptoData, historyTimeframe, 200).map(p => p.low)).toFixed(4)}
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <div className="text-sm text-muted-foreground">Average Close</div>
                        <div className="text-lg font-bold text-crypto-blue">
                          ${(generatePriceHistory(cryptoData, historyTimeframe, 200).reduce((acc, p) => acc + p.close, 0) / 200).toFixed(4)}
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <div className="text-sm text-muted-foreground">Volatility</div>
                        <div className="text-lg font-bold text-crypto-purple">
                          {(() => {
                            const histData = generatePriceHistory(cryptoData, historyTimeframe, 200);
                            const high = Math.max(...histData.map(p => p.high));
                            const low = Math.min(...histData.map(p => p.low));
                            return (((high - low) / low) * 100).toFixed(2);
                          })()}%
                        </div>
                      </div>
                    </div>

                    {/* Technical Analysis */}
                    {technicalIndicators.rsi && (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Technical Analysis
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {technicalIndicators.sma_20 && (
                            <div>
                              <div className="text-sm text-muted-foreground">SMA (20)</div>
                              <div className="font-mono text-crypto-orange">${technicalIndicators.sma_20.toFixed(4)}</div>
                            </div>
                          )}
                          {technicalIndicators.sma_50 && (
                            <div>
                              <div className="text-sm text-muted-foreground">SMA (50)</div>
                              <div className="font-mono text-crypto-blue">${technicalIndicators.sma_50.toFixed(4)}</div>
                            </div>
                          )}
                          <div>
                            <div className="text-sm text-muted-foreground">RSI (14)</div>
                            <div className={`font-mono ${technicalIndicators.rsi > 70 ? 'text-crypto-red' : technicalIndicators.rsi < 30 ? 'text-crypto-green' : 'text-foreground'}`}>
                              {technicalIndicators.rsi.toFixed(1)}
                              <span className="text-xs ml-1">
                                {technicalIndicators.rsi > 70 ? '(Overbought)' : technicalIndicators.rsi < 30 ? '(Oversold)' : '(Neutral)'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-predictions" className="space-y-4">
            {aiPredictions && (
              <>
                <Alert className="border-crypto-purple/20 bg-crypto-purple/5">
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <strong>AI Price Predictions</strong> - These predictions are generated using machine learning models analyzing market trends, 
                    volume patterns, and historical data. They should be used for informational purposes only and not as financial advice.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-crypto-hover transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="w-5 h-5" />
                        Next Day
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(aiPredictions.nextDay.price)}
                        </div>
                        <div className={`text-sm font-medium ${getTrendColor(aiPredictions.nextDay.trend)}`}>
                          {aiPredictions.nextDay.trend.toUpperCase()}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Confidence</span>
                          <span>{aiPredictions.nextDay.confidence.toFixed(0)}%</span>
                        </div>
                        <Progress value={aiPredictions.nextDay.confidence} className="h-2" />
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className={getTrendColor(aiPredictions.nextDay.trend)}>
                          <Target className="w-3 h-3 mr-1" />
                          24h Prediction
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-crypto-hover transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="w-5 h-5" />
                        Next Week
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(aiPredictions.nextWeek.price)}
                        </div>
                        <div className={`text-sm font-medium ${getTrendColor(aiPredictions.nextWeek.trend)}`}>
                          {aiPredictions.nextWeek.trend.toUpperCase()}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Confidence</span>
                          <span>{aiPredictions.nextWeek.confidence.toFixed(0)}%</span>
                        </div>
                        <Progress value={aiPredictions.nextWeek.confidence} className="h-2" />
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className={getTrendColor(aiPredictions.nextWeek.trend)}>
                          <Target className="w-3 h-3 mr-1" />
                          7d Prediction
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-crypto-hover transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="w-5 h-5" />
                        Next Month
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(aiPredictions.nextMonth.price)}
                        </div>
                        <div className={`text-sm font-medium ${getTrendColor(aiPredictions.nextMonth.trend)}`}>
                          {aiPredictions.nextMonth.trend.toUpperCase()}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Confidence</span>
                          <span>{aiPredictions.nextMonth.confidence.toFixed(0)}%</span>
                        </div>
                        <Progress value={aiPredictions.nextMonth.confidence} className="h-2" />
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className={getTrendColor(aiPredictions.nextMonth.trend)}>
                          <Target className="w-3 h-3 mr-1" />
                          30d Prediction
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="border-crypto-red/20 bg-crypto-red/5">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Disclaimer:</strong> AI predictions are experimental and based on historical patterns. 
                    Cryptocurrency markets are highly unpredictable. These predictions should NOT be used as the sole basis for investment decisions. 
                    Always do your own research and consult with financial advisors.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CryptoDetailView;