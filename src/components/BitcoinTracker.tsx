import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Info, DollarSign, BarChart3, Clock, Zap, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BitcoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  ath: number;
  ath_change_percentage: number;
  circulating_supply: number;
  max_supply: number;
  image: string;
}

const BitcoinTracker = () => {
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  const fetchBitcoinData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true'
      );
      const data = await response.json();
      
      const formattedData: BitcoinData = {
        id: data.id,
        symbol: data.symbol,
        name: data.name,
        current_price: data.market_data.current_price.usd,
        price_change_percentage_24h: data.market_data.price_change_percentage_24h,
        price_change_percentage_7d: data.market_data.price_change_percentage_7d,
        price_change_percentage_30d: data.market_data.price_change_percentage_30d,
        market_cap: data.market_data.market_cap.usd,
        market_cap_rank: data.market_cap_rank,
        total_volume: data.market_data.total_volume.usd,
        high_24h: data.market_data.high_24h.usd,
        low_24h: data.market_data.low_24h.usd,
        ath: data.market_data.ath.usd,
        ath_change_percentage: data.market_data.ath_change_percentage.usd,
        circulating_supply: data.market_data.circulating_supply,
        max_supply: data.market_data.max_supply,
        image: data.image.large,
      };

      setBitcoinData(formattedData);
      if (data.market_data.sparkline_7d?.price) {
        setPriceHistory(data.market_data.sparkline_7d.price.slice(-24)); // Last 24 hours
      }
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Bitcoin data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBitcoinData();
    const interval = setInterval(fetchBitcoinData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
    if (!bitcoinData?.max_supply || !bitcoinData?.circulating_supply) return 0;
    return (bitcoinData.circulating_supply / bitcoinData.max_supply) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-foreground">Loading Bitcoin data...</div>
        </div>
      </div>
    );
  }

  if (!bitcoinData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          Failed to load Bitcoin data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src={bitcoinData.image} alt="Bitcoin" className="w-16 h-16" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-crypto-orange to-crypto-blue bg-clip-text text-transparent">
                Bitcoin Tracker
              </h1>
              <p className="text-muted-foreground">
                Real-time Bitcoin price and market data
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>

        {/* Beginner Info Alert */}
        <Alert className="border-crypto-blue/20 bg-crypto-blue/5">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>New to Bitcoin?</strong> Bitcoin is a digital currency that operates without a central authority. 
            Its price can be volatile, so always do your research before investing.
          </AlertDescription>
        </Alert>

        {/* Main Price Card */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-crypto-hover animate-pulse-glow">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2 animate-fade-in">
              <h2 className="text-2xl font-bold">Bitcoin (BTC)</h2>
              <Badge variant="secondary" className="animate-slide-up">#{bitcoinData.market_cap_rank}</Badge>
            </div>
            <div className="text-5xl md:text-6xl font-bold text-foreground mb-2 animate-fade-in bg-gradient-to-r from-crypto-orange to-crypto-blue bg-clip-text text-transparent">
              {formatPrice(bitcoinData.current_price)}
            </div>
            <div className="flex items-center justify-center gap-2 animate-slide-up">
              {bitcoinData.price_change_percentage_24h > 0 ? (
                <TrendingUp className="w-5 h-5 text-crypto-green animate-pulse" />
              ) : (
                <TrendingDown className="w-5 h-5 text-crypto-red animate-pulse" />
              )}
              <Badge
                variant={bitcoinData.price_change_percentage_24h > 0 ? 'default' : 'destructive'}
                className={`text-lg px-3 py-1 transition-all duration-300 hover:scale-105 ${
                  bitcoinData.price_change_percentage_24h > 0
                    ? 'bg-crypto-green/10 text-crypto-green border-crypto-green/20 hover:bg-crypto-green/20'
                    : 'bg-crypto-red/10 text-crypto-red border-crypto-red/20 hover:bg-crypto-red/20'
                }`}
              >
                {bitcoinData.price_change_percentage_24h > 0 ? '+' : ''}
                {bitcoinData.price_change_percentage_24h.toFixed(2)}% (24h)
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
              <div className="font-bold group-hover:text-crypto-blue transition-colors">{formatLargeNumber(bitcoinData.market_cap)}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-crypto-hover transition-all duration-300 hover:scale-105 animate-fade-in cursor-pointer group" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 text-crypto-green mx-auto mb-2 group-hover:animate-pulse" />
              <div className="text-sm text-muted-foreground">24h Volume</div>
              <div className="font-bold group-hover:text-crypto-green transition-colors">{formatLargeNumber(bitcoinData.total_volume)}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-crypto-hover transition-all duration-300 hover:scale-105 animate-fade-in cursor-pointer group" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-crypto-purple mx-auto mb-2 group-hover:animate-pulse" />
              <div className="text-sm text-muted-foreground">24h High</div>
              <div className="font-bold group-hover:text-crypto-purple transition-colors">{formatPrice(bitcoinData.high_24h)}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-crypto-hover transition-all duration-300 hover:scale-105 animate-fade-in cursor-pointer group" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-4 text-center">
              <TrendingDown className="w-6 h-6 text-crypto-red mx-auto mb-2 group-hover:animate-pulse" />
              <div className="text-sm text-muted-foreground">24h Low</div>
              <div className="font-bold group-hover:text-crypto-red transition-colors">{formatPrice(bitcoinData.low_24h)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="supply">Supply Info</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
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
                    <Badge variant={bitcoinData.price_change_percentage_24h > 0 ? 'default' : 'destructive'}>
                      {bitcoinData.price_change_percentage_24h > 0 ? '+' : ''}
                      {bitcoinData.price_change_percentage_24h.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">7 days</span>
                    <Badge variant={bitcoinData.price_change_percentage_7d > 0 ? 'default' : 'destructive'}>
                      {bitcoinData.price_change_percentage_7d > 0 ? '+' : ''}
                      {bitcoinData.price_change_percentage_7d.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">30 days</span>
                    <Badge variant={bitcoinData.price_change_percentage_30d > 0 ? 'default' : 'destructive'}>
                      {bitcoinData.price_change_percentage_30d > 0 ? '+' : ''}
                      {bitcoinData.price_change_percentage_30d.toFixed(2)}%
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
                    <span className="font-medium">{formatPrice(bitcoinData.ath)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From ATH</span>
                    <Badge variant="destructive">
                      {bitcoinData.ath_change_percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Rank</span>
                    <Badge variant="secondary">#{bitcoinData.market_cap_rank}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="supply" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Bitcoin Supply Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Circulating Supply</span>
                    <span className="font-medium">
                      {bitcoinData.circulating_supply.toLocaleString()} BTC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maximum Supply</span>
                    <span className="font-medium">
                      {bitcoinData.max_supply?.toLocaleString()} BTC
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Supply Progress</span>
                    <span>{getSupplyPercentage().toFixed(2)}%</span>
                  </div>
                  <Progress value={getSupplyPercentage()} className="h-2" />
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Bitcoin has a maximum supply of 21 million coins. This scarcity is one of the key factors 
                    that gives Bitcoin its value proposition as "digital gold."
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
                    <div className="text-2xl font-bold text-crypto-green">
                      {bitcoinData.price_change_percentage_24h > 0 ? '+' : ''}
                      {bitcoinData.price_change_percentage_24h.toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground">24 Hours</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-crypto-blue">
                      {bitcoinData.price_change_percentage_7d > 0 ? '+' : ''}
                      {bitcoinData.price_change_percentage_7d.toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground">7 Days</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-crypto-purple">
                      {bitcoinData.price_change_percentage_30d > 0 ? '+' : ''}
                      {bitcoinData.price_change_percentage_30d.toFixed(2)}%
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
        </Tabs>
      </div>
    </div>
  );
};

export default BitcoinTracker;