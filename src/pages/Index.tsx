import { useState } from 'react';
import CryptoPriceTracker from '@/components/CryptoPriceTracker';
import CryptoDetailView from '@/components/CryptoDetailView';
import { ThemeToggle } from '@/components/ThemeToggle';
import heroImage from '@/assets/crypto-hero.jpg';
import { TrendingUp, Coins, Brain, Zap } from 'lucide-react';

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);

  const handleCryptoClick = (cryptoId: string) => {
    setSelectedCrypto(cryptoId);
  };

  const handleBackToList = () => {
    setSelectedCrypto(null);
  };

  if (selectedCrypto) {
    return <CryptoDetailView cryptoId={selectedCrypto} onBack={handleBackToList} />;
  }

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
            Advanced Crypto Tracker
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Click any cryptocurrency to view detailed real-time data, market analysis, and AI-powered price predictions. 
            Choose your update frequency from seconds to years.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2 text-crypto-green">
              <TrendingUp className="w-4 h-4" />
              Real-time Updates
            </div>
            <div className="flex items-center gap-2 text-crypto-blue">
              <Coins className="w-4 h-4" />
              250+ Cryptocurrencies
            </div>
            <div className="flex items-center gap-2 text-crypto-purple">
              <Brain className="w-4 h-4" />
              AI Predictions
            </div>
            <div className="flex items-center gap-2 text-crypto-orange">
              <Zap className="w-4 h-4" />
              Custom Timeframes
            </div>
          </div>
          
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Content */}
      <CryptoPriceTracker onCryptoClick={handleCryptoClick} />
    </div>
  );
};

export default Index;