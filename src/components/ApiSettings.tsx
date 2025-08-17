import { useState } from 'react';
import { Settings, Key, ExternalLink, Info, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateApiConfig, apiConfig, API_KEY_INSTRUCTIONS } from '@/config/apiConfig';

interface ApiSettingsProps {
  onClose: () => void;
}

const ApiSettings: React.FC<ApiSettingsProps> = ({ onClose }) => {
  const [coingeckoKey, setCoingeckoKey] = useState(apiConfig.coingeckoApiKey || '');
  const [coinmarketcapKey, setCoinmarketcapKey] = useState(apiConfig.coinmarketcapApiKey || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateApiConfig({
      coingeckoApiKey: coingeckoKey.trim() || undefined,
      coinmarketcapApiKey: coinmarketcapKey.trim() || undefined,
    });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // Refresh the page to apply new API keys
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API Settings - Get REAL Live Data
            </CardTitle>
            <Button onClick={onClose} variant="outline" size="sm">
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="setup">API Keys Setup</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup" className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Add your free API keys below to get REAL live cryptocurrency data instead of simulated data.
                  All keys are stored locally in your browser and never shared.
                </AlertDescription>
              </Alert>

              {/* CoinGecko API Key */}
              <div className="space-y-3">
                <Label htmlFor="coingecko-key" className="text-base font-semibold">
                  CoinGecko API Key (FREE - Recommended)
                </Label>
                <Input
                  id="coingecko-key"
                  type="password"
                  placeholder="Enter your CoinGecko Demo API key..."
                  value={coingeckoKey}
                  onChange={(e) => setCoingeckoKey(e.target.value)}
                  className="font-mono"
                />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-crypto-green" />
                  <span>FREE • 30 calls/minute • 100+ cryptocurrencies</span>
                </div>
              </div>

              {/* CoinMarketCap API Key */}
              <div className="space-y-3">
                <Label htmlFor="coinmarketcap-key" className="text-base font-semibold">
                  CoinMarketCap API Key (FREE - Optional)
                </Label>
                <Input
                  id="coinmarketcap-key"
                  type="password"
                  placeholder="Enter your CoinMarketCap API key..."
                  value={coinmarketcapKey}
                  onChange={(e) => setCoinmarketcapKey(e.target.value)}
                  className="font-mono"
                />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-crypto-green" />
                  <span>FREE • 10,000 calls/month • Professional data</span>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-4">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  {saved ? 'Saved! Refreshing...' : 'Save API Keys'}
                </Button>
                
                {saved && (
                  <div className="flex items-center gap-2 text-crypto-green">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Keys saved! Page will refresh to apply changes.</span>
                  </div>
                )}
              </div>

              <Alert className="border-crypto-blue/20 bg-crypto-blue/5">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Current Status:</strong> Using {apiConfig.coingeckoApiKey ? 'CoinGecko API key' : 'multiple free APIs'} + 
                  {apiConfig.coinmarketcapApiKey ? ' CoinMarketCap API key' : ' fallback data sources'}
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="instructions" className="space-y-6">
              {/* CoinGecko Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    {API_KEY_INSTRUCTIONS.coingecko.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {API_KEY_INSTRUCTIONS.coingecko.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-crypto-green/10 rounded-lg">
                    <h4 className="font-semibold text-crypto-green mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {API_KEY_INSTRUCTIONS.coingecko.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-crypto-green" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button asChild className="w-full">
                    <a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get Free CoinGecko API Key
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* CoinMarketCap Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    {API_KEY_INSTRUCTIONS.coinmarketcap.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {API_KEY_INSTRUCTIONS.coinmarketcap.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-crypto-blue/10 rounded-lg">
                    <h4 className="font-semibold text-crypto-blue mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {API_KEY_INSTRUCTIONS.coinmarketcap.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-crypto-blue" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button asChild className="w-full" variant="outline">
                    <a href="https://pro.coinmarketcap.com/signup" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get Free CoinMarketCap API Key
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiSettings;