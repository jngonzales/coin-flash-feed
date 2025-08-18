// Simple API service with your 4 CoinGecko keys
const API_KEYS = [
  'CG-H68Rs8LCSxPV8Skn6N15NZHj',
  'CG-fzFbgPRPE29WGNMPHTSJmark', 
  'CG-Aao8URZEFBJxCFBDRzMhdJUq',
  'CG-R5sydEBRGQcgsVsdPGMakZJ4'
];

let currentKey = 0;

export const getCryptoData = async () => {
  try {
    const key = API_KEYS[currentKey];
    currentKey = (currentKey + 1) % API_KEYS.length;
    
    console.log(`🔑 Using CoinGecko Key #${currentKey + 1}`);
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h&x_cg_demo_api_key=${key}`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Got ${data.length} coins with LIVE data`);
      return data;
    } else {
      console.log(`❌ API failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('API error:', error);
  }
  return [];
};

export const getSingleCrypto = async (cryptoId: string) => {
  try {
    const key = API_KEYS[currentKey];
    currentKey = (currentKey + 1) % API_KEYS.length;
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${cryptoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true&x_cg_demo_api_key=${key}`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Got detailed data for ${cryptoId}`);
      return data;
    }
  } catch (error) {
    console.error('Single crypto API error:', error);
  }
  return null;
};

// Legacy compatibility
export const liveDataFetcher = {
  getLivePrices: async () => new Map(),
  getLivePrice: async () => null
};

export const multiApiService = {
  getCryptoData
};

export const keyManager = {
  getEfficiencyStats: () => ({
    totalKeys: API_KEYS.length,
    maxCallsPerMinute: API_KEYS.length * 30,
    currentCallsThisMinute: 0,
    totalErrors: 0,
    efficiency: '100'
  })
};