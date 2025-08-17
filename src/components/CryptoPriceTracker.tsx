import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h'
      );
      const data = await response.json();
      setCryptos(data);
      setFilteredCryptos(data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCryptos(filtered);
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
              <p className="text-muted-foreground text-sm">
                Last updated: {lastUpdate.toLocaleTimeString()} • Click any coin for detailed analysis
              </p>
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