import CryptoPriceTracker from '@/components/CryptoPriceTracker';
import heroImage from '@/assets/crypto-hero.jpg';

const Index = () => {
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
            Real-Time Crypto Prices
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Track the latest cryptocurrency prices with live updates every 10 seconds. Professional trading data at your fingertips.
          </p>
        </div>
      </div>

      {/* Crypto Tracker */}
      <CryptoPriceTracker />
    </div>
  );
};

export default Index;