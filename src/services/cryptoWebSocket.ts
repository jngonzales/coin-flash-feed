// WebSocket service for real-time crypto data
export interface LivePriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
}

class CryptoWebSocketService {
  private ws: WebSocket | null = null;
  private subscribers: Set<(data: LivePriceData) => void> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      // Using Binance WebSocket Stream (public, no auth required)
      this.ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (Array.isArray(data)) {
            data.forEach((ticker: any) => {
              const liveData: LivePriceData = {
                symbol: ticker.s?.toLowerCase().replace('usdt', ''),
                price: parseFloat(ticker.c),
                change24h: parseFloat(ticker.P),
                volume24h: parseFloat(ticker.v),
                timestamp: Date.now(),
              };
              
              this.subscribers.forEach(callback => callback(liveData));
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket data:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  public subscribe(callback: (data: LivePriceData) => void) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
  }
}

// Singleton instance
export const cryptoWebSocket = new CryptoWebSocketService();

// Alternative: HTTP-based live data fetcher with multiple sources
export class LiveDataFetcher {
  private static instance: LiveDataFetcher;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 30000; // 30 seconds

  static getInstance() {
    if (!LiveDataFetcher.instance) {
      LiveDataFetcher.instance = new LiveDataFetcher();
    }
    return LiveDataFetcher.instance;
  }

  async getLivePrice(cryptoId: string): Promise<LivePriceData | null> {
    // Check cache first
    const cached = this.cache.get(cryptoId);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Try multiple endpoints
      const endpoints = [
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd&include_24hr_change=true`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.coinpaprika.com/v1/tickers/${cryptoId}`)}`,
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const data = await response.json();
            
            let liveData: LivePriceData | null = null;
            
            if (endpoint.includes('coingecko')) {
              if (data[cryptoId]) {
                liveData = {
                  symbol: cryptoId,
                  price: data[cryptoId].usd,
                  change24h: data[cryptoId].usd_24h_change || 0,
                  volume24h: 0,
                  timestamp: Date.now(),
                };
              }
            } else if (endpoint.includes('coinpaprika')) {
              if (data.quotes?.USD) {
                liveData = {
                  symbol: cryptoId,
                  price: data.quotes.USD.price,
                  change24h: data.quotes.USD.percent_change_24h || 0,
                  volume24h: data.quotes.USD.volume_24h || 0,
                  timestamp: Date.now(),
                };
              }
            }

            if (liveData) {
              this.cache.set(cryptoId, { data: liveData, timestamp: Date.now() });
              return liveData;
            }
          }
        } catch (error) {
          console.log(`Endpoint ${endpoint} failed:`, error);
          continue;
        }
      }
    } catch (error) {
      console.error('All live data sources failed:', error);
    }

    return null;
  }

  async getLivePrices(cryptoIds: string[]): Promise<Map<string, LivePriceData>> {
    const results = new Map<string, LivePriceData>();
    
    // Process in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < cryptoIds.length; i += batchSize) {
      const batch = cryptoIds.slice(i, i + batchSize);
      const promises = batch.map(id => this.getLivePrice(id));
      const batchResults = await Promise.allSettled(promises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          results.set(batch[index], result.value);
        }
      });
      
      // Small delay between batches
      if (i + batchSize < cryptoIds.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }
}

export const liveDataFetcher = LiveDataFetcher.getInstance();