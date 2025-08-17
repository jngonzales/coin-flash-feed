import { useState } from 'react';
import CryptoPriceTracker from '@/components/CryptoPriceTracker';
import BitcoinTracker from '@/components/BitcoinTracker';
import { ThemeToggle } from '@/components/ThemeToggle';
import heroImage from '@/assets/crypto-hero.jpg';
import { Button } from '@/components/ui/button';
import { Bitcoin, TrendingUp, Coins } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState<'crypto' | 'bitcoin'>('crypto');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-crypto-purple bg-clip-text text-transparent">
            Crypto Price Tracker
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Track real-time cryptocurrency prices with live updates. Get comprehensive market data and beginner-friendly insights.
          </p>
          
          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Button
              onClick={() => setActiveView('crypto')}
              variant={activeView === 'crypto' ? 'default' : 'outline'}
              size="lg"
              className="flex items-center gap-2"
            >
              <Coins className="w-5 h-5" />
              All Cryptocurrencies
            </Button>
            <Button
              onClick={() => setActiveView('bitcoin')}
              variant={activeView === 'bitcoin' ? 'default' : 'outline'}
              size="lg"
              className="flex items-center gap-2"
            >
              <Bitcoin className="w-5 h-5" />
              Bitcoin Tracker
            </Button>
          </div>
          
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Content */}
      {activeView === 'crypto' ? <CryptoPriceTracker /> : <BitcoinTracker />}
    </div>
  );
};

export default Index;