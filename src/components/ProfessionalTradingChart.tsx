import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, TrendingUp, TrendingDown, MousePointer, Minus, Square, 
  Triangle, Flag, Eye, EyeOff, Settings, Volume2, Bell, Info 
} from 'lucide-react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Line, Area, Cell } from 'recharts';
import { PricePoint, CryptoInfo, generatePriceHistory } from '@/data/cryptoData';

interface TechnicalIndicator {
  id: string;
  name: string;
  enabled: boolean;
  color: string;
  values: number[];
}

interface DrawingTool {
  id: string;
  type: 'trendline' | 'horizontal' | 'rectangle' | 'triangle';
  points: { x: number; y: number }[];
  color: string;
}

interface ChartPattern {
  id: string;
  name: string;
  type: 'head-shoulders' | 'double-top' | 'double-bottom' | 'triangle' | 'flag' | 'pennant';
  points: number[];
  confidence: number;
  description: string;
}

interface ProfessionalTradingChartProps {
  cryptoData: CryptoInfo;
  height?: number;
}

const timeframeOptions = [
  { value: '1m', label: '1m', seconds: 60 },
  { value: '5m', label: '5m', seconds: 300 },
  { value: '15m', label: '15m', seconds: 900 },
  { value: '30m', label: '30m', seconds: 1800 },
  { value: '1h', label: '1H', seconds: 3600 },
  { value: '4h', label: '4H', seconds: 14400 },
  { value: '1d', label: '1D', seconds: 86400 },
  { value: '1w', label: '1W', seconds: 604800 },
];

const ProfessionalTradingChart: React.FC<ProfessionalTradingChartProps> = ({ 
  cryptoData, 
  height = 600 
}) => {
  const [timeframe, setTimeframe] = useState('1h');
  const [chartData, setChartData] = useState<PricePoint[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([]);
  const [drawings, setDrawings] = useState<DrawingTool[]>([]);
  const [patterns, setPatterns] = useState<ChartPattern[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('pointer');
  const [showVolume, setShowVolume] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  
  const chartRef = useRef<HTMLDivElement>(null);

  // Initialize technical indicators
  useEffect(() => {
    const defaultIndicators: TechnicalIndicator[] = [
      { id: 'sma20', name: 'SMA(20)', enabled: false, color: '#f59e0b', values: [] },
      { id: 'sma50', name: 'SMA(50)', enabled: false, color: '#3b82f6', values: [] },
      { id: 'ema20', name: 'EMA(20)', enabled: false, color: '#ef4444', values: [] },
      { id: 'rsi', name: 'RSI(14)', enabled: false, color: '#8b5cf6', values: [] },
      { id: 'macd', name: 'MACD', enabled: false, color: '#10b981', values: [] },
      { id: 'bb', name: 'Bollinger Bands', enabled: false, color: '#6b7280', values: [] },
    ];
    setIndicators(defaultIndicators);
  }, []);

  // Generate chart data when timeframe changes
  useEffect(() => {
    const data = generatePriceHistory(cryptoData, timeframe, 200);
    setChartData(data);
    calculateIndicators(data);
    detectPatterns(data);
  }, [cryptoData, timeframe]);

  // Calculate technical indicators
  const calculateIndicators = (data: PricePoint[]) => {
    const prices = data.map(d => d.close);
    
    setIndicators(prev => prev.map(indicator => {
      let values: number[] = [];
      
      switch (indicator.id) {
        case 'sma20':
          values = calculateSMA(prices, 20);
          break;
        case 'sma50':
          values = calculateSMA(prices, 50);
          break;
        case 'ema20':
          values = calculateEMA(prices, 20);
          break;
        case 'rsi':
          values = calculateRSI(prices, 14);
          break;
        case 'macd':
          values = calculateMACD(prices);
          break;
        case 'bb':
          values = calculateBollingerBands(prices, 20, 2);
          break;
      }
      
      return { ...indicator, values };
    }));
  };

  // Technical indicator calculations
  const calculateSMA = (prices: number[], period: number): number[] => {
    const sma: number[] = [];
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        sma.push(0);
      } else {
        const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        sma.push(sum / period);
      }
    }
    return sma;
  };

  const calculateEMA = (prices: number[], period: number): number[] => {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    ema[0] = prices[0];
    for (let i = 1; i < prices.length; i++) {
      ema[i] = (prices[i] * multiplier) + (ema[i - 1] * (1 - multiplier));
    }
    return ema;
  };

  const calculateRSI = (prices: number[], period: number): number[] => {
    const rsi: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? -change : 0);
    }
    
    for (let i = 0; i < gains.length; i++) {
      if (i < period - 1) {
        rsi.push(50);
      } else {
        const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
        const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    
    return [50, ...rsi]; // Add initial value
  };

  const calculateMACD = (prices: number[]): number[] => {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    return ema12.map((val, i) => val - ema26[i]);
  };

  const calculateBollingerBands = (prices: number[], period: number, stdDev: number): number[] => {
    const sma = calculateSMA(prices, period);
    const bands: number[] = [];
    
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        bands.push(0);
      } else {
        const slice = prices.slice(i - period + 1, i + 1);
        const mean = sma[i];
        const variance = slice.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period;
        const standardDeviation = Math.sqrt(variance);
        bands.push(standardDeviation * stdDev);
      }
    }
    return bands;
  };

  // Pattern detection
  const detectPatterns = (data: PricePoint[]) => {
    const detectedPatterns: ChartPattern[] = [];
    
    // Head and Shoulders detection (simplified)
    if (data.length > 20) {
      const highs = data.map((d, i) => ({ price: d.high, index: i }))
        .sort((a, b) => b.price - a.price)
        .slice(0, 5);
      
      if (highs.length >= 3) {
        detectedPatterns.push({
          id: 'hs1',
          name: 'Potential Head & Shoulders',
          type: 'head-shoulders',
          points: highs.slice(0, 3).map(h => h.index),
          confidence: 0.7,
          description: 'Bearish reversal pattern detected'
        });
      }
    }

    // Double Top detection
    const recentHighs = data.slice(-50).map((d, i) => ({ price: d.high, index: i + data.length - 50 }))
      .filter((_, i, arr) => {
        const prev = arr[i - 1];
        const next = arr[i + 1];
        return (!prev || arr[i].price > prev.price) && (!next || arr[i].price > next.price);
      });

    if (recentHighs.length >= 2) {
      const [first, second] = recentHighs.slice(-2);
      if (Math.abs(first.price - second.price) / first.price < 0.02) {
        detectedPatterns.push({
          id: 'dt1',
          name: 'Double Top',
          type: 'double-top',
          points: [first.index, second.index],
          confidence: 0.8,
          description: 'Bearish reversal pattern - potential sell signal'
        });
      }
    }

    // Triangle pattern detection
    if (data.length > 30) {
      const recentData = data.slice(-30);
      const highs = recentData.filter((d, i) => 
        i > 0 && i < recentData.length - 1 && 
        d.high > recentData[i-1].high && d.high > recentData[i+1].high
      );
      const lows = recentData.filter((d, i) => 
        i > 0 && i < recentData.length - 1 && 
        d.low < recentData[i-1].low && d.low < recentData[i+1].low
      );

      if (highs.length >= 2 && lows.length >= 2) {
        detectedPatterns.push({
          id: 'triangle1',
          name: 'Triangle Pattern',
          type: 'triangle',
          points: [...highs.slice(-2), ...lows.slice(-2)].map((_, i) => data.length - 15 + i),
          confidence: 0.6,
          description: 'Consolidation pattern - breakout expected'
        });
      }
    }

    setPatterns(detectedPatterns);
  };

  // Toggle indicator
  const toggleIndicator = (indicatorId: string) => {
    setIndicators(prev => prev.map(ind => 
      ind.id === indicatorId ? { ...ind, enabled: !ind.enabled } : ind
    ));
  };

  // Enhanced chart data with indicators
  const enhancedChartData = chartData.map((candle, index) => {
    const enhanced: any = { ...candle };
    
    indicators.forEach(indicator => {
      if (indicator.enabled && indicator.values[index]) {
        enhanced[indicator.id] = indicator.values[index];
      }
    });
    
    return enhanced;
  });

  return (
    <div className="w-full space-y-4">
      {/* Chart Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Professional Trading Chart
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Timeframe Selector */}
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframeOptions.map(tf => (
                    <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Volume Toggle */}
              <Button
                variant={showVolume ? "default" : "outline"}
                size="sm"
                onClick={() => setShowVolume(!showVolume)}
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Drawing Tools */}
          <div className="flex items-center gap-2 mb-4 p-2 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">Tools:</span>
            {[
              { id: 'pointer', icon: MousePointer, label: 'Select' },
              { id: 'trendline', icon: TrendingUp, label: 'Trendline' },
              { id: 'horizontal', icon: Minus, label: 'Horizontal' },
              { id: 'rectangle', icon: Square, label: 'Rectangle' },
            ].map(tool => (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTool(tool.id)}
                className="h-8 px-2"
              >
                <tool.icon className="w-3 h-3" />
              </Button>
            ))}
          </div>

          {/* Main Chart */}
          <div 
            ref={chartRef}
            className="relative"
            style={{ height: `${height}px` }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={enhancedChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  yAxisId="price"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  domain={['dataMin * 0.995', 'dataMax * 1.005']}
                  tickFormatter={(value) => `$${value < 1 ? value.toFixed(6) : value.toFixed(2)}`}
                />
                {showVolume && (
                  <YAxis 
                    yAxisId="volume"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickFormatter={(value) => `${(value / 1e6).toFixed(0)}M`}
                  />
                )}
                
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'open') return [`$${Number(value).toFixed(6)}`, 'Open'];
                    if (name === 'high') return [`$${Number(value).toFixed(6)}`, 'High'];
                    if (name === 'low') return [`$${Number(value).toFixed(6)}`, 'Low'];
                    if (name === 'close') return [`$${Number(value).toFixed(6)}`, 'Close'];
                    if (name === 'volume') return [`${(Number(value) / 1e6).toFixed(2)}M`, 'Volume'];
                    if (name.includes('sma') || name.includes('ema')) return [`$${Number(value).toFixed(4)}`, name.toUpperCase()];
                    if (name === 'rsi') return [`${Number(value).toFixed(1)}`, 'RSI'];
                    return [value, name];
                  }}
                />

                {/* Volume Bars */}
                {showVolume && (
                  <Bar yAxisId="volume" dataKey="volume" opacity={0.4}>
                    {enhancedChartData.map((entry, index) => (
                      <Cell 
                        key={`volume-${index}`} 
                        fill={entry.close >= entry.open ? 'hsl(var(--crypto-green))' : 'hsl(var(--crypto-red))'}
                      />
                    ))}
                  </Bar>
                )}

                {/* Candlestick representation using bars */}
                <Bar yAxisId="price" dataKey="high" opacity={0.1}>
                  {enhancedChartData.map((entry, index) => (
                    <Cell 
                      key={`wick-${index}`} 
                      fill={entry.close >= entry.open ? 'hsl(var(--crypto-green))' : 'hsl(var(--crypto-red))'}
                    />
                  ))}
                </Bar>

                {/* Technical Indicators */}
                {indicators.filter(ind => ind.enabled).map(indicator => (
                  <Line
                    key={indicator.id}
                    yAxisId="price"
                    type="monotone"
                    dataKey={indicator.id}
                    stroke={indicator.color}
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray={indicator.id === 'bb' ? "5 5" : "0"}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
            
            {/* Pattern Overlays */}
            {patterns.map(pattern => (
              <div
                key={pattern.id}
                className="absolute top-4 left-4 bg-background/90 border rounded-lg p-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <Triangle className="w-3 h-3 text-crypto-blue" />
                  <span className="font-medium">{pattern.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {(pattern.confidence * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">{pattern.description}</p>
              </div>
            ))}
          </div>

          {/* Chart Info Bar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground font-medium">O:</span>
                <span className="font-mono">${chartData[chartData.length - 1]?.open.toFixed(4)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground font-medium">H:</span>
                <span className="font-mono text-crypto-green">${Math.max(...chartData.map(d => d.high)).toFixed(4)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground font-medium">L:</span>
                <span className="font-mono text-crypto-red">${Math.min(...chartData.map(d => d.low)).toFixed(4)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground font-medium">C:</span>
                <span className={`font-mono ${chartData[chartData.length - 1]?.close >= chartData[chartData.length - 1]?.open ? 'text-crypto-green' : 'text-crypto-red'}`}>
                  ${chartData[chartData.length - 1]?.close.toFixed(4)}
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {chartData.length} candles • Vol: ${(chartData.reduce((sum, d) => sum + d.volume, 0) / 1e6).toFixed(1)}M
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Analysis Panel */}
      <Tabs defaultValue="indicators" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="indicators">Technical Indicators</TabsTrigger>
          <TabsTrigger value="patterns">Chart Patterns</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="indicators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technical Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {indicators.map(indicator => {
                  const currentValue = indicator.values[indicator.values.length - 1];
                  return (
                    <div key={indicator.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Button
                          variant={indicator.enabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleIndicator(indicator.id)}
                          className="h-6 w-6 p-0"
                        >
                          {indicator.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </Button>
                        <div>
                          <div className="font-medium text-sm">{indicator.name}</div>
                          {currentValue && (
                            <div className="text-xs text-muted-foreground">
                              {indicator.id === 'rsi' ? 
                                `${currentValue.toFixed(1)} ${currentValue > 70 ? '(Overbought)' : currentValue < 30 ? '(Oversold)' : '(Neutral)'}` :
                                `$${currentValue.toFixed(4)}`
                              }
                            </div>
                          )}
                        </div>
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: indicator.color }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detected Chart Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              {patterns.length > 0 ? (
                <div className="space-y-3">
                  {patterns.map(pattern => (
                    <div key={pattern.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Flag className="w-4 h-4 text-crypto-blue" />
                          <span className="font-medium">{pattern.name}</span>
                        </div>
                        <Badge variant="outline">
                          {(pattern.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{pattern.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Flag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No chart patterns detected in current timeframe</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Price Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Bell className="h-4 w-4" />
                <AlertDescription>
                  <strong>Smart Alerts:</strong> Automatic alerts when RSI &gt; 70 (overbought) or RSI &lt; 30 (oversold), 
                  and when price crosses moving averages.
                </AlertDescription>
              </Alert>
              
              {/* Current Alert Status */}
              <div className="mt-4 space-y-2">
                {(() => {
                  const rsi = indicators.find(ind => ind.id === 'rsi');
                  const currentRSI = rsi?.values[rsi.values.length - 1];
                  const alerts = [];
                  
                  if (currentRSI && currentRSI > 70) {
                    alerts.push({ type: 'warning', message: `RSI Overbought: ${currentRSI.toFixed(1)}` });
                  }
                  if (currentRSI && currentRSI < 30) {
                    alerts.push({ type: 'success', message: `RSI Oversold: ${currentRSI.toFixed(1)}` });
                  }
                  
                  return alerts.map((alert, index) => (
                    <div key={index} className={`p-2 rounded text-sm ${
                      alert.type === 'warning' ? 'bg-crypto-red/10 text-crypto-red' : 'bg-crypto-green/10 text-crypto-green'
                    }`}>
                      🚨 {alert.message}
                    </div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessionalTradingChart;