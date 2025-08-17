// API Configuration
export interface ApiConfig {
  coingeckoApiKey?: string;
  coinmarketcapApiKey?: string;
  enableCorsProxy: boolean;
  rateLimitDelay: number;
  cacheTimeout: number;
}

// Default configuration
export const defaultApiConfig: ApiConfig = {
  coingeckoApiKey: undefined, // Add your CoinGecko API key here
  coinmarketcapApiKey: undefined, // Add your CoinMarketCap API key here
  enableCorsProxy: true,
  rateLimitDelay: 2000, // 2 seconds between calls
  cacheTimeout: 30000, // 30 seconds cache
};

// You can override this with your own API keys
export let apiConfig: ApiConfig = { ...defaultApiConfig };

export const updateApiConfig = (newConfig: Partial<ApiConfig>) => {
  apiConfig = { ...apiConfig, ...newConfig };
};

// Instructions for getting API keys
export const API_KEY_INSTRUCTIONS = {
  coingecko: {
    title: "CoinGecko Free API Key",
    steps: [
      "1. Go to https://www.coingecko.com/en/api",
      "2. Click 'Get Your Free API Key'",
      "3. Sign up for Demo Account (FREE)",
      "4. Copy your API key",
      "5. Add it to apiConfig.coingeckoApiKey"
    ],
    benefits: [
      "30 calls/minute (vs 5-15 without key)",
      "More stable access",
      "Priority over non-authenticated users",
      "Better error handling"
    ]
  },
  coinmarketcap: {
    title: "CoinMarketCap Free API Key", 
    steps: [
      "1. Go to https://pro.coinmarketcap.com/signup",
      "2. Sign up for free Basic plan",
      "3. Get 10,000 calls/month free",
      "4. Copy your API key",
      "5. Add it to apiConfig.coinmarketcapApiKey"
    ],
    benefits: [
      "10,000 calls/month free",
      "Reliable data source",
      "Good rate limits",
      "Professional API"
    ]
  }
};