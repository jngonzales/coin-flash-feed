// Multi-API service for real-time crypto data
export interface LivePriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  timestamp: number;
  source: string;
}

export interface CryptoApiResponse {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
}

class MultiCryptoApiService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 30000; // 30 seconds
  private lastApiCall = 0;
  private minApiInterval = 2000; // 2 seconds between calls

  // API endpoints in priority order
  private apis = [
    {
      name: 'CoinGecko',
      endpoint: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h',
      parser: this.parseCoinGeckoData.bind(this),
      requiresKey: false,
    },
    {
      name: 'Binance',
      endpoint: 'https://api.binance.com/api/v3/ticker/24hr',
      parser: this.parseBinanceData.bind(this),
      requiresKey: false,
    },
    {
      name: 'CryptoCompare',
      endpoint: 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BNB,XRP,ADA,SOL,DOGE,DOT,MATIC,LTC&tsyms=USD',
      parser: this.parseCryptoCompareData.bind(this),
      requiresKey: false,
    },
    {
      name: 'Kraken',
      endpoint: 'https://api.kraken.com/0/public/Ticker?pair=BTCUSD,ETHUSD,XRPUSD,ADAUSD,SOLUSD,DOGUSD',
      parser: this.parseKrakenData.bind(this),
      requiresKey: false,
    }
  ];

  private parseCoinGeckoData(data: any[]): CryptoApiResponse[] {
    return data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
    }));
  }

  private parseBinanceData(data: any[]): CryptoApiResponse[] {
    const symbolMap: { [key: string]: string } = {
      'BTCUSDT': 'bitcoin',
      'ETHUSDT': 'ethereum', 
      'BNBUSDT': 'binancecoin',
      'XRPUSDT': 'ripple',
      'ADAUSDT': 'cardano',
      'SOLUSDT': 'solana',
      'DOGEUSDT': 'dogecoin',
      'DOTUSDT': 'polkadot',
      'MATICUSDT': 'matic-network',
      'LTCUSDT': 'litecoin'
    };

    return data
      .filter(ticker => symbolMap[ticker.symbol])
      .map(ticker => ({
        id: symbolMap[ticker.symbol],
        symbol: ticker.symbol.replace('USDT', '').toLowerCase(),
        name: symbolMap[ticker.symbol],
        current_price: parseFloat(ticker.lastPrice),
        price_change_percentage_24h: parseFloat(ticker.priceChangePercent),
        market_cap: 0, // Binance doesn't provide market cap
        total_volume: parseFloat(ticker.volume) * parseFloat(ticker.lastPrice),
        high_24h: parseFloat(ticker.highPrice),
        low_24h: parseFloat(ticker.lowPrice),
      }));
  }

  private parseCryptoCompareData(data: any): CryptoApiResponse[] {
    const results: CryptoApiResponse[] = [];
    const symbolMap: { [key: string]: string } = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'BNB': 'binancecoin',
      'XRP': 'ripple',
      'ADA': 'cardano',
      'SOL': 'solana',
      'DOGE': 'dogecoin',
      'DOT': 'polkadot',
      'MATIC': 'matic-network',
      'LTC': 'litecoin'
    };

    Object.entries(data.RAW || {}).forEach(([symbol, coinData]: [string, any]) => {
      if (coinData.USD && symbolMap[symbol]) {
        results.push({
          id: symbolMap[symbol],
          symbol: symbol.toLowerCase(),
          name: symbolMap[symbol],
          current_price: coinData.USD.PRICE,
          price_change_percentage_24h: coinData.USD.CHANGEPCT24HOUR,
          market_cap: coinData.USD.MKTCAP,
          total_volume: coinData.USD.VOLUME24HOURTO,
          high_24h: coinData.USD.HIGH24HOUR,
          low_24h: coinData.USD.LOW24HOUR,
        });
      }
    });

    return results;
  }

  private parseKrakenData(data: any): CryptoApiResponse[] {
    const results: CryptoApiResponse[] = [];
    const symbolMap: { [key: string]: string } = {
      'XXBTZUSD': 'bitcoin',
      'XETHZUSD': 'ethereum',
      'XXRPZUSD': 'ripple',
      'ADAUSD': 'cardano',
      'SOLUSD': 'solana',
    };

    Object.entries(data.result || {}).forEach(([pair, ticker]: [string, any]) => {
      if (symbolMap[pair]) {
        results.push({
          id: symbolMap[pair],
          symbol: pair,
          name: symbolMap[pair],
          current_price: parseFloat(ticker.c[0]), // Last trade closed price
          price_change_percentage_24h: 0, // Kraken doesn't provide 24h change directly
          market_cap: 0,
          total_volume: parseFloat(ticker.v[1]), // Volume last 24 hours
          high_24h: parseFloat(ticker.h[1]), // High last 24 hours
          low_24h: parseFloat(ticker.l[1]), // Low last 24 hours
        });
      }
    });

    return results;
  }

  async getCryptoData(): Promise<CryptoApiResponse[]> {
    // Check cache first
    const cacheKey = 'all_cryptos';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('Using cached data');
      return cached.data;
    }

    // Rate limiting
    const now = Date.now();
    if (now - this.lastApiCall < this.minApiInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minApiInterval - (now - this.lastApiCall)));
    }

    // Try each API in order
    for (const api of this.apis) {
      try {
        console.log(`Trying ${api.name} API...`);
        this.lastApiCall = Date.now();
        
        const response = await fetch(api.endpoint);
        
        if (response.ok) {
          const data = await response.json();
          const parsedData = api.parser(data);
          
          if (parsedData && parsedData.length > 0) {
            console.log(`✅ ${api.name} API successful - ${parsedData.length} coins`);
            this.cache.set(cacheKey, { data: parsedData, timestamp: Date.now() });
            return parsedData;
          }
        } else {
          console.log(`❌ ${api.name} API failed with status: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${api.name} API error:`, error);
        continue;
      }
    }

    console.log('❌ All APIs failed, returning empty array');
    return [];
  }

  async getSingleCoinPrice(coinId: string): Promise<LivePriceData | null> {
    // Try specific single-coin endpoints for better success rate
    const singleCoinApis = [
      {
        name: 'CoinGecko Simple',
        url: `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
        parser: (data: any) => {
          if (data[coinId]) {
            return {
              symbol: coinId,
              price: data[coinId].usd,
              change24h: data[coinId].usd_24h_change || 0,
              volume24h: data[coinId].usd_24h_vol || 0,
              marketCap: data[coinId].usd_market_cap || 0,
              timestamp: Date.now(),
              source: 'CoinGecko'
            };
          }
          return null;
        }
      },
      {
        name: 'CryptoCompare',
        url: `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coinId.toUpperCase()}&tsyms=USD`,
        parser: (data: any) => {
          const coinData = data.RAW?.[coinId.toUpperCase()]?.USD;
          if (coinData) {
            return {
              symbol: coinId,
              price: coinData.PRICE,
              change24h: coinData.CHANGEPCT24HOUR || 0,
              volume24h: coinData.VOLUME24HOURTO || 0,
              marketCap: coinData.MKTCAP || 0,
              timestamp: Date.now(),
              source: 'CryptoCompare'
            };
          }
          return null;
        }
      }
    ];

    for (const api of singleCoinApis) {
      try {
        const response = await fetch(api.url);
        if (response.ok) {
          const data = await response.json();
          const result = api.parser(data);
          if (result) {
            console.log(`✅ Got live data for ${coinId} from ${api.name}`);
            return result;
          }
        }
      } catch (error) {
        console.log(`❌ ${api.name} failed for ${coinId}:`, error);
        continue;
      }
    }

    return null;
  }
}

// Singleton instance
export const multiApiService = new MultiCryptoApiService();

// Legacy interface for backward compatibility
export class LiveDataFetcher {
  private static instance: LiveDataFetcher;

  static getInstance() {
    if (!LiveDataFetcher.instance) {
      LiveDataFetcher.instance = new LiveDataFetcher();
    }
    return LiveDataFetcher.instance;
  }

  async getLivePrice(cryptoId: string): Promise<LivePriceData | null> {
    return await multiApiService.getSingleCoinPrice(cryptoId);
  }

  async getLivePrices(cryptoIds: string[]): Promise<Map<string, LivePriceData>> {
    const results = new Map<string, LivePriceData>();
    
    // Try to get data from multiple APIs
    const apiData = await multiApiService.getCryptoData();
    
    cryptoIds.forEach(id => {
      const found = apiData.find(coin => coin.id === id);
      if (found) {
        results.set(id, {
          symbol: found.symbol,
          price: found.current_price,
          change24h: found.price_change_percentage_24h,
          volume24h: found.total_volume,
          marketCap: found.market_cap,
          timestamp: Date.now(),
          source: 'MultiAPI'
        });
      }
    });
    
    return results;
  }
}

export const liveDataFetcher = LiveDataFetcher.getInstance();