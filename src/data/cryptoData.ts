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
    image: getCryptoImage('bitcoin', 'btc'),
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
    image: getCryptoImage('ethereum', 'eth'),
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
    image: getCryptoImage('tether', 'usdt'),
    description: 'Tether gives you the joint benefits of open blockchain technology and traditional currency by converting your cash into a stable digital currency equivalent.',
    genesis_date: '2014-10-06'
  },
  // Add more cryptocurrencies...
];

// Comprehensive cryptocurrency image mapping
const cryptoImageMap: { [key: string]: string } = {
  'bitcoin': 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  'ethereum': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  'tether': 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
  'binancecoin': 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
  'ripple': 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
  'solana': 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  'usd-coin': 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
  'cardano': 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
  'dogecoin': 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
  'avalanche-2': 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
  'tron': 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
  'chainlink': 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
  'matic-network': 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
  'wrapped-bitcoin': 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png',
  'polkadot': 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
  'litecoin': 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
  'shiba-inu': 'https://assets.coingecko.com/coins/images/11939/large/shiba.png',
  'dai': 'https://assets.coingecko.com/coins/images/9956/large/4943.png',
  'bitcoin-cash': 'https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png',
  'uniswap': 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
  'cosmos': 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png',
  'leo-token': 'https://assets.coingecko.com/coins/images/8418/large/leo-token.png',
  'ethereum-classic': 'https://assets.coingecko.com/coins/images/453/large/ethereum-classic-logo.png',
  'monero': 'https://assets.coingecko.com/coins/images/69/large/monero_logo.png',
  'stellar': 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
  'okb': 'https://assets.coingecko.com/coins/images/4463/large/WeChat_Image_20220118095654.png',
  'filecoin': 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png',
  'hedera-hashgraph': 'https://assets.coingecko.com/coins/images/3441/large/Hedera_Hashgraph_Logo.png',
};

// Generate fallback image URL
const getFallbackImage = (symbol: string): string => {
  return `https://via.placeholder.com/32x32/3B82F6/FFFFFF?text=${symbol.toUpperCase().slice(0, 2)}`;
};

// Get crypto image with fallback
export const getCryptoImage = (id: string, symbol: string): string => {
  return cryptoImageMap[id] || cryptoImageMap[symbol] || getFallbackImage(symbol);
};

// Generate additional cryptocurrencies
const generateMoreCryptos = (): CryptoInfo[] => {
  const additionalCryptos = [
    { name: 'BNB', symbol: 'bnb', id: 'binancecoin', basePrice: 310 },
    { name: 'XRP', symbol: 'xrp', id: 'ripple', basePrice: 0.62 },
    { name: 'Solana', symbol: 'sol', id: 'solana', basePrice: 98 },
    { name: 'USDC', symbol: 'usdc', id: 'usd-coin', basePrice: 1.00 },
    { name: 'Cardano', symbol: 'ada', id: 'cardano', basePrice: 0.48 },
    { name: 'Dogecoin', symbol: 'doge', id: 'dogecoin', basePrice: 0.082 },
    { name: 'Avalanche', symbol: 'avax', id: 'avalanche-2', basePrice: 37 },
    { name: 'TRON', symbol: 'trx', id: 'tron', basePrice: 0.105 },
    { name: 'Chainlink', symbol: 'link', id: 'chainlink', basePrice: 15.2 },
    { name: 'Polygon', symbol: 'matic', id: 'matic-network', basePrice: 0.89 },
    { name: 'Wrapped Bitcoin', symbol: 'wbtc', id: 'wrapped-bitcoin', basePrice: 43200 },
    { name: 'Polkadot', symbol: 'dot', id: 'polkadot', basePrice: 7.1 },
    { name: 'Litecoin', symbol: 'ltc', id: 'litecoin', basePrice: 73 },
    { name: 'Shiba Inu', symbol: 'shib', id: 'shiba-inu', basePrice: 0.0000095 },
    { name: 'Dai', symbol: 'dai', id: 'dai', basePrice: 1.00 },
    { name: 'Bitcoin Cash', symbol: 'bch', id: 'bitcoin-cash', basePrice: 245 },
    { name: 'Uniswap', symbol: 'uni', id: 'uniswap', basePrice: 6.8 },
    { name: 'Cosmos', symbol: 'atom', id: 'cosmos', basePrice: 10.2 },
    { name: 'LEO Token', symbol: 'leo', id: 'leo-token', basePrice: 3.9 },
    { name: 'Ethereum Classic', symbol: 'etc', id: 'ethereum-classic', basePrice: 21 },
    { name: 'Monero', symbol: 'xmr', id: 'monero', basePrice: 158 },
    { name: 'Stellar', symbol: 'xlm', id: 'stellar', basePrice: 0.12 },
    { name: 'OKB', symbol: 'okb', id: 'okb', basePrice: 49 },
    { name: 'Filecoin', symbol: 'fil', id: 'filecoin', basePrice: 5.2 },
    { name: 'Hedera', symbol: 'hbar', id: 'hedera-hashgraph', basePrice: 0.062 }
  ];

  return additionalCryptos.map((crypto, index) => {
    const rank = cryptoDatabase.length + index + 1;
    const volatility = Math.random() * 0.1 + 0.02; // 2-12% volatility
    const change24h = (Math.random() - 0.5) * 20; // -10% to +10%
    const change7d = (Math.random() - 0.5) * 30; // -15% to +15%
    const change30d = (Math.random() - 0.5) * 60; // -30% to +30%
    
    return {
      id: crypto.id,
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
      image: getCryptoImage(crypto.id, crypto.symbol),
      description: `${crypto.name} is a cryptocurrency that aims to provide innovative blockchain solutions.`,
      genesis_date: `20${15 + Math.floor(Math.random() * 8)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    };
  });
};

export const allCryptos = [...cryptoDatabase, ...generateMoreCryptos()];

// Generate realistic OHLCV data with proper trading patterns
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
  } else if (timeframeValue.includes('w')) {
    timeStepMs = 7 * 24 * 60 * 60 * 1000;
  } else if (timeframeValue.includes('M')) {
    timeStepMs = parseInt(timeframeValue) * 30 * 24 * 60 * 60 * 1000;
  } else if (timeframeValue.includes('Y')) {
    timeStepMs = parseInt(timeframeValue) * 365 * 24 * 60 * 60 * 1000;
  } else {
    timeStepMs = 60 * 60 * 1000; // Default to 1 hour
  }

  const totalTimeSpan = timeStepMs * points;
  const startTime = now - totalTimeSpan;
  
  // Create realistic market patterns
  const baseVolatility = Math.abs(crypto.price_change_percentage_24h) / 100 * 0.05;
  const trendStrength = crypto.price_change_percentage_24h / 100;
  
  // Start from a price that would result in current price after trend
  let currentPrice = crypto.current_price / (1 + trendStrength);
  
  // Add market patterns: support/resistance, trends, consolidation
  const patterns = {
    trend: Math.random() > 0.5 ? 1 : -1, // Overall trend direction
    volatility: 0.02 + Math.random() * 0.08, // 2-10% volatility
    momentum: Math.random() * 0.5 + 0.5, // Momentum strength
  };
  
  for (let i = 0; i < points; i++) {
    const timestamp = startTime + (i * timeStepMs);
    const date = new Date(timestamp);
    const progress = i / points;
    
    // Calculate trend component (gradual move toward current price)
    const targetPrice = crypto.current_price;
    const trendComponent = (targetPrice - currentPrice) * (progress * 0.1);
    
    // Add realistic noise and patterns
    const noise = (Math.random() - 0.5) * patterns.volatility * currentPrice;
    const momentum = Math.sin(progress * Math.PI * 4) * patterns.momentum * baseVolatility * currentPrice;
    
    // Create more realistic price movements
    const open = currentPrice;
    const priceChange = trendComponent + noise + momentum;
    const close = Math.max(0.0001, open + priceChange);
    
    // Generate realistic high and low with proper wicks
    const wickRange = patterns.volatility * currentPrice * (0.3 + Math.random() * 0.7);
    const bodyRange = Math.abs(close - open);
    
    // High and low should extend beyond the body realistically
    const high = Math.max(open, close) + wickRange * Math.random() * 0.8;
    const low = Math.min(open, close) - wickRange * Math.random() * 0.8;
    
    // Volume should correlate with price movement intensity
    const priceMovementIntensity = Math.abs(priceChange) / currentPrice;
    const volumeMultiplier = 0.5 + priceMovementIntensity * 5 + Math.random() * 2;
    const volume = crypto.total_volume * volumeMultiplier * (0.1 + Math.random() * 0.9);
    
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
  
  // Ensure the last price is close to the actual current price
  if (history.length > 0) {
    const lastCandle = history[history.length - 1];
    lastCandle.close = crypto.current_price;
    lastCandle.high = Math.max(lastCandle.high, crypto.current_price);
    lastCandle.low = Math.min(lastCandle.low, crypto.current_price);
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