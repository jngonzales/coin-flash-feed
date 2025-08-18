// API Configuration with multiple CoinGecko keys support
export interface ApiConfig {
  coingeckoApiKeys: string[]; // Multiple CoinGecko API keys for rotation
  coinmarketcapApiKey?: string;
  enableCorsProxy: boolean;
  rateLimitDelay: number;
  cacheTimeout: number;
}

// Default configuration
export const defaultApiConfig: ApiConfig = {
  coingeckoApiKeys: [], // Add your 4 CoinGecko API keys here
  coinmarketcapApiKey: undefined,
  enableCorsProxy: true,
  rateLimitDelay: 500, // Reduced with multiple keys
  cacheTimeout: 30000, // 30 seconds cache
};

// You can override this with your own API keys
export let apiConfig: ApiConfig = { ...defaultApiConfig };

export const updateApiConfig = (newConfig: Partial<ApiConfig>) => {
  apiConfig = { ...apiConfig, ...newConfig };
  
  // Save to localStorage for persistence
  localStorage.setItem('crypto-api-config', JSON.stringify(apiConfig));
};

// Load config from localStorage on startup
export const loadApiConfig = () => {
  try {
    const saved = localStorage.getItem('crypto-api-config');
    if (saved) {
      const savedConfig = JSON.parse(saved);
      apiConfig = { ...defaultApiConfig, ...savedConfig };
    }
  } catch (error) {
    console.error('Error loading API config:', error);
  }
};

// Initialize config
loadApiConfig();

// API Key rotation manager
export class ApiKeyManager {
  private currentKeyIndex = 0;
  private keyUsageCount = new Map<string, number>();
  private keyLastUsed = new Map<string, number>();
  private maxUsagePerKey = 25; // Leave buffer under 30/min limit

  getNextApiKey(): string | null {
    const keys = apiConfig.coingeckoApiKeys.filter(key => key.trim());
    if (keys.length === 0) return null;

    // Find the least recently used key that hasn't hit limits
    const now = Date.now();
    const oneMinute = 60000;

    for (let i = 0; i < keys.length; i++) {
      const keyIndex = (this.currentKeyIndex + i) % keys.length;
      const key = keys[keyIndex];
      const lastUsed = this.keyLastUsed.get(key) || 0;
      const usageCount = this.keyUsageCount.get(key) || 0;

      // Reset usage count if more than a minute has passed
      if (now - lastUsed > oneMinute) {
        this.keyUsageCount.set(key, 0);
      }

      // Use this key if it's under the limit
      if ((this.keyUsageCount.get(key) || 0) < this.maxUsagePerKey) {
        this.currentKeyIndex = keyIndex;
        this.keyUsageCount.set(key, (this.keyUsageCount.get(key) || 0) + 1);
        this.keyLastUsed.set(key, now);
        return key;
      }
    }

    // If all keys are at limit, use the oldest one
    this.currentKeyIndex = (this.currentKeyIndex + 1) % keys.length;
    const key = keys[this.currentKeyIndex];
    this.keyUsageCount.set(key, 1);
    this.keyLastUsed.set(key, now);
    return key;
  }

  getKeyStats() {
    return {
      totalKeys: apiConfig.coingeckoApiKeys.length,
      activeKeys: apiConfig.coingeckoApiKeys.filter(key => key.trim()).length,
      currentIndex: this.currentKeyIndex,
      usage: Array.from(this.keyUsageCount.entries()),
    };
  }
}

export const apiKeyManager = new ApiKeyManager();

// Instructions for getting API keys
export const API_KEY_INSTRUCTIONS = {
  coingecko: {
    title: "CoinGecko Free API Keys (4 Accounts)",
    steps: [
      "1. Go to https://www.coingecko.com/en/api",
      "2. Click 'Get Your Free API Key'", 
      "3. Sign up for Demo Account #1 (FREE)",
      "4. Copy your first API key",
      "5. Repeat steps 1-4 for 3 more accounts",
      "6. Add all 4 keys below (one per line)"
    ],
    benefits: [
      "120 calls/minute total (30 per key × 4 keys)",
      "Automatic key rotation",
      "Maximum reliability",
      "100+ cryptocurrencies with live data",
      "Priority access on all keys"
    ]
  },
  coinmarketcap: {
    title: "CoinMarketCap Free API Key (Backup)", 
    steps: [
      "1. Go to https://pro.coinmarketcap.com/signup",
      "2. Sign up for free Basic plan",
      "3. Get 10,000 calls/month free",
      "4. Copy your API key",
      "5. Add it as backup source"
    ],
    benefits: [
      "10,000 calls/month free",
      "Reliable backup data source",
      "Professional API quality",
      "Good for high-frequency updates"
    ]
  }
};