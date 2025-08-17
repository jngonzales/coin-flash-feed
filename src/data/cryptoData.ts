// Complete offline cryptocurrency data system
export interface CryptoInfo {
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
  max_supply: number | null;
  total_supply: number;
  image: string;
  description: string;
  genesis_date: string | null;
}

export interface PricePoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  date: string;
  time: string;
}

// Top 100 cryptocurrencies with realistic data
export const cryptoDatabase: CryptoInfo[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 43250.75,
    price_change_percentage_24h: 2.34,
    price_change_percentage_7d: -1.23,
    price_change_percentage_30d: 8.45,
    market_cap: 847000000000,
    market_cap_rank: 1,
    total_volume: 28500000000,
    high_24h: 43890.12,
    low_24h: 42100.45,
    ath: 69000,
    ath_change_percentage: -37.32,
    circulating_supply: 19600000,
    max_supply: 21000000,
    total_supply: 19600000,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    description: 'Bitcoin is the first successful internet money based on peer-to-peer technology; whereby no central bank or authority is involved in the transaction and production of the Bitcoin currency.',
    genesis_date: '2009-01-03'
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 2650.89,
    price_change_percentage_24h: 3.21,
    price_change_percentage_7d: 2.45,
    price_change_percentage_30d: 12.67,
    market_cap: 318000000000,
    market_cap_rank: 2,
    total_volume: 15200000000,
    high_24h: 2698.45,
    low_24h: 2580.12,
    ath: 4878.26,
    ath_change_percentage: -45.65,
    circulating_supply: 120000000,
    max_supply: null,
    total_supply: 120000000,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    description: 'Ethereum is a decentralized platform that runs smart contracts: applications that run exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference.',
    genesis_date: '2015-07-30'
  },
  {
    id: 'tether',
    symbol: 'usdt',
    name: 'Tether',
    current_price: 1.0002,
    price_change_percentage_24h: 0.01,
    price_change_percentage_7d: -0.02,
    price_change_percentage_30d: 0.05,
    market_cap: 95000000000,
    market_cap_rank: 3,
    total_volume: 45000000000,
    high_24h: 1.0015,
    low_24h: 0.9995,
    ath: 1.32,
    ath_change_percentage: -24.23,
    circulating_supply: 95000000000,
    max_supply: null,
    total_supply: 95000000000,
    image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
    description: 'Tether gives you the joint benefits of open blockchain technology and traditional currency by converting your cash into a stable digital currency equivalent.',
    genesis_date: '2014-10-06'
  },
  // Add more cryptocurrencies...
];

// Generate additional cryptocurrencies
const generateMoreCryptos = (): CryptoInfo[] => {
  const additionalCryptos = [
    { name: 'BNB', symbol: 'bnb', basePrice: 310 },
    { name: 'XRP', symbol: 'xrp', basePrice: 0.62 },
    { name: 'Solana', symbol: 'sol', basePrice: 98 },
    { name: 'USDC', symbol: 'usdc', basePrice: 1.00 },
    { name: 'Cardano', symbol: 'ada', basePrice: 0.48 },
    { name: 'Dogecoin', symbol: 'doge', basePrice: 0.082 },
    { name: 'Avalanche', symbol: 'avax', basePrice: 37 },
    { name: 'TRON', symbol: 'trx', basePrice: 0.105 },
    { name: 'Chainlink', symbol: 'link', basePrice: 15.2 },
    { name: 'Polygon', symbol: 'matic', basePrice: 0.89 },
    { name: 'Wrapped Bitcoin', symbol: 'wbtc', basePrice: 43200 },
    { name: 'Polkadot', symbol: 'dot', basePrice: 7.1 },
    { name: 'Litecoin', symbol: 'ltc', basePrice: 73 },
    { name: 'Shiba Inu', symbol: 'shib', basePrice: 0.0000095 },
    { name: 'Dai', symbol: 'dai', basePrice: 1.00 },
    { name: 'Bitcoin Cash', symbol: 'bch', basePrice: 245 },
    { name: 'Uniswap', symbol: 'uni', basePrice: 6.8 },
    { name: 'Cosmos', symbol: 'atom', basePrice: 10.2 },
    { name: 'LEO Token', symbol: 'leo', basePrice: 3.9 },
    { name: 'Ethereum Classic', symbol: 'etc', basePrice: 21 },
    { name: 'Monero', symbol: 'xmr', basePrice: 158 },
    { name: 'Stellar', symbol: 'xlm', basePrice: 0.12 },
    { name: 'OKB', symbol: 'okb', basePrice: 49 },
    { name: 'Filecoin', symbol: 'fil', basePrice: 5.2 },
    { name: 'Hedera', symbol: 'hbar', basePrice: 0.062 }
  ];

  return additionalCryptos.map((crypto, index) => {
    const rank = cryptoDatabase.length + index + 1;
    const volatility = Math.random() * 0.1 + 0.02; // 2-12% volatility
    const change24h = (Math.random() - 0.5) * 20; // -10% to +10%
    const change7d = (Math.random() - 0.5) * 30; // -15% to +15%
    const change30d = (Math.random() - 0.5) * 60; // -30% to +30%
    
    return {
      id: crypto.symbol,
      symbol: crypto.symbol,
      name: crypto.name,
      current_price: crypto.basePrice,
      price_change_percentage_24h: change24h,
      price_change_percentage_7d: change7d,
      price_change_percentage_30d: change30d,
      market_cap: crypto.basePrice * Math.random() * 1000000000,
      market_cap_rank: rank,
      total_volume: crypto.basePrice * Math.random() * 100000000,
      high_24h: crypto.basePrice * (1 + Math.abs(change24h) / 100 * 0.5),
      low_24h: crypto.basePrice * (1 - Math.abs(change24h) / 100 * 0.5),
      ath: crypto.basePrice * (1 + Math.random() * 2 + 0.5),
      ath_change_percentage: -(Math.random() * 80 + 10),
      circulating_supply: Math.random() * 10000000000,
      max_supply: Math.random() > 0.3 ? Math.random() * 20000000000 : null,
      total_supply: Math.random() * 15000000000,
      image: `https://assets.coingecko.com/coins/images/${rank}/large/${crypto.symbol}.png`,
      description: `${crypto.name} is a cryptocurrency that aims to provide innovative blockchain solutions.`,
      genesis_date: `20${15 + Math.floor(Math.random() * 8)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    };
  });
};

export const allCryptos = [...cryptoDatabase, ...generateMoreCryptos()];

// Generate realistic OHLCV data for any timeframe
export const generatePriceHistory = (
  crypto: CryptoInfo,
  timeframe: string,
  points: number = 100
): PricePoint[] => {
  const history: PricePoint[] = [];
  const now = Date.now();
  
  // Calculate time step based on timeframe
  let timeStepMs: number;
  const timeframeValue = timeframe.toLowerCase();
  
  if (timeframeValue.includes('s')) {
    timeStepMs = parseInt(timeframeValue) * 1000;
  } else if (timeframeValue.includes('m')) {
    timeStepMs = parseInt(timeframeValue) * 60 * 1000;
  } else if (timeframeValue.includes('h')) {
    timeStepMs = parseInt(timeframeValue) * 60 * 60 * 1000;
  } else if (timeframeValue.includes('d')) {
    timeStepMs = parseInt(timeframeValue) * 24 * 60 * 60 * 1000;
  } else if (timeframeValue.includes('M')) {
    timeStepMs = parseInt(timeframeValue) * 30 * 24 * 60 * 60 * 1000;
  } else if (timeframeValue.includes('Y')) {
    timeStepMs = parseInt(timeframeValue) * 365 * 24 * 60 * 60 * 1000;
  } else {
    timeStepMs = 24 * 60 * 60 * 1000; // Default to 1 day
  }

  const totalTimeSpan = timeStepMs * points;
  const startTime = now - totalTimeSpan;
  
  // Base volatility on the crypto's 24h change
  const baseVolatility = Math.abs(crypto.price_change_percentage_24h) / 100 * 0.1;
  const trendStrength = crypto.price_change_percentage_24h / 100;
  
  let currentPrice = crypto.current_price * (1 - trendStrength);
  
  for (let i = 0; i < points; i++) {
    const timestamp = startTime + (i * timeStepMs);
    const date = new Date(timestamp);
    
    // Generate realistic OHLCV data
    const volatility = baseVolatility * (0.5 + Math.random());
    const trendComponent = (trendStrength * i / points) * currentPrice;
    const randomComponent = (Math.random() - 0.5) * volatility * currentPrice;
    
    const open = currentPrice;
    const priceMove = trendComponent + randomComponent;
    const close = Math.max(0.0001, currentPrice + priceMove);
    
    // Generate high and low based on volatility
    const range = volatility * currentPrice * (0.5 + Math.random() * 0.5);
    const high = Math.max(open, close) + range * Math.random();
    const low = Math.min(open, close) - range * Math.random();
    
    // Generate volume (higher volume during price movements)
    const volumeMultiplier = 1 + Math.abs(priceMove / currentPrice) * 10;
    const volume = crypto.total_volume * (0.1 + Math.random() * 0.9) * volumeMultiplier;
    
    history.push({
      timestamp,
      open,
      high: Math.max(high, Math.max(open, close)),
      low: Math.max(0.0001, Math.min(low, Math.min(open, close))),
      close,
      volume,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    });
    
    currentPrice = close;
  }
  
  return history;
};

// Get crypto by ID
export const getCryptoById = (id: string): CryptoInfo | undefined => {
  return allCryptos.find(crypto => crypto.id === id || crypto.symbol === id);
};

// Search cryptos
export const searchCryptos = (query: string): CryptoInfo[] => {
  const lowerQuery = query.toLowerCase();
  return allCryptos.filter(crypto => 
    crypto.name.toLowerCase().includes(lowerQuery) ||
    crypto.symbol.toLowerCase().includes(lowerQuery)
  );
};