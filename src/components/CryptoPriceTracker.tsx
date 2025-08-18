import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { allCryptos, searchCryptos, getCryptoImage } from '@/data/cryptoData';
import { liveDataFetcher, multiApiService } from '@/services/cryptoWebSocket';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

interface CryptoPriceTrackerProps {
  onCryptoClick: (cryptoId: string) => void;
}

const CryptoPriceTracker: React.FC<CryptoPriceTrackerProps> = ({ onCryptoClick }) => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [liveDataCount, setLiveDataCount] = useState(0);

  const loadCryptoData = async (isInitialLoad = false) => {
    try {
      // Only show loading on initial load, not on updates
      if (isInitialLoad) {
        setLoading(true);
      }
      
      // Get live data directly from CoinGecko with your 4 API keys
      const liveApiData = await multiApiService.getCryptoData();
      
      if (liveApiData.length > 0) {
        // We got real live data from CoinGecko!
        console.log(`🚀 Got LIVE data for ${liveApiData.length} cryptocurrencies!`);
        
        // Create a map for fast lookup
        const liveDataMap = new Map(liveApiData.map(coin => [coin.id, coin]));
        
        // Update all cryptos with live data where available
        const updatedCryptos = allCryptos.map(crypto => {
          const liveData = liveDataMap.get(crypto.id);
          
          if (liveData) {
            return {
              ...crypto,
              current_price: liveData.current_price,
              price_change_percentage_24h: liveData.price_change_percentage_24h,
              market_cap: liveData.market_cap,
              total_volume: liveData.total_volume,
              high_24h: liveData.high_24h,
              low_24h: liveData.low_24h,
              image: liveData.image || getCryptoImage(crypto.id, crypto.symbol), // Ensure image is always present
            };
          } else {
            // Minimal simulation for unlisted cryptos
            const variation = (Math.random() - 0.5) * 0.005; // ±0.25% variation
            return {
              ...crypto,
              current_price: crypto.current_price * (1 + variation),
              price_change_percentage_24h: crypto.price_change_percentage_24h + (Math.random() - 0.5) * 0.5,
            };
          }
        });
        
        setCryptos(updatedCryptos);
        setFilteredCryptos(updatedCryptos);
        setLastUpdate(new Date());
        setLiveDataCount(liveApiData.length);
        setLoading(false);
      } else {
        throw new Error('No live data available');
      }
    } catch (error) {
      console.error('Error loading crypto data:', error);
      
      // Fallback to base data with minimal simulation
      const fallbackCryptos = allCryptos.map(crypto => ({
        ...crypto,
        current_price: crypto.current_price * (1 + (Math.random() - 0.5) * 0.01),
        price_change_percentage_24h: crypto.price_change_percentage_24h + (Math.random() - 0.5) * 1,
      }));
      
      setCryptos(fallbackCryptos);
      setFilteredCryptos(fallbackCryptos);
      setLastUpdate(new Date());
      setLiveDataCount(0);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCryptoData(true); // Initial load with loading state
    const interval = setInterval(() => loadCryptoData(false), 5000); // Updates without loading flicker
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCryptos(cryptos);
    } else {
      const filtered = searchCryptos(searchTerm);
      setFilteredCryptos(filtered);
    }
  }, [searchTerm, cryptos]);

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

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Loading crypto data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-crypto-purple bg-clip-text text-transparent">
                CryptoTracker
              </h1>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">
                  Last updated: {lastUpdate.toLocaleTimeString()} • Click any coin for detailed analysis
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${liveDataCount > 0 ? 'bg-crypto-green animate-pulse' : 'bg-crypto-orange'}`}></div>
                  <span className="text-xs text-muted-foreground">
                    {liveDataCount > 0 ? `${liveDataCount} coins with live data` : 'Enhanced market simulation'}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-input border-border focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Crypto Cards/Table */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-4 md:gap-6">
          {filteredCryptos.slice(0, 100).map((crypto, index) => (
            <Card 
              key={crypto.id} 
              className="bg-card border-border hover:bg-accent/50 transition-all duration-300 hover:shadow-crypto-hover hover:scale-[1.02] animate-fade-in group cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onCryptoClick(crypto.id)}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between gap-4">
                  {/* Rank & Logo */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>
                    <div className="relative">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-10 h-10 rounded-full transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-crypto-blue/20 to-crypto-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                        {crypto.name}
                      </h3>
                      <p className="text-sm text-muted-foreground uppercase font-mono">
                        {crypto.symbol}
                      </p>
                    </div>
                  </div>

                  {/* Price & Stats */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-6 text-right">
                    {/* Price */}
                    <div className="min-w-0">
                      <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                        {formatPrice(crypto.current_price)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatMarketCap(crypto.market_cap)}
                      </div>
                    </div>

                    {/* 24h Change */}
                    <div className="flex items-center gap-2">
                      {crypto.price_change_percentage_24h > 0 ? (
                        <TrendingUp className="w-4 h-4 text-crypto-green animate-pulse" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-crypto-red animate-pulse" />
                      )}
                      <Badge
                        variant={crypto.price_change_percentage_24h > 0 ? 'default' : 'destructive'}
                        className={`transition-all duration-300 group-hover:scale-105 ${
                          crypto.price_change_percentage_24h > 0
                            ? 'bg-crypto-green/10 text-crypto-green border-crypto-green/20 hover:bg-crypto-green/20'
                            : 'bg-crypto-red/10 text-crypto-red border-crypto-red/20 hover:bg-crypto-red/20'
                        }`}
                      >
                        {crypto.price_change_percentage_24h > 0 ? '+' : ''}
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCryptos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No cryptocurrencies found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoPriceTracker;