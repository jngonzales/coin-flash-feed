import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Cell } from 'recharts';
import { PricePoint } from '@/data/cryptoData';

interface TradingViewChartProps {
  data: PricePoint[];
  showVolume?: boolean;
  height?: number;
}

// Custom Candlestick component
const Candlestick = ({ payload, x, y, width, height }: any) => {
  if (!payload) return null;
  
  const { open, high, low, close } = payload;
  const isGreen = close >= open;
  const color = isGreen ? '#10b981' : '#ef4444'; // green-500 : red-500
  
  // Calculate positions
  const centerX = x + width / 2;
  const bodyTop = Math.min(open, close);
  const bodyBottom = Math.max(open, close);
  const bodyHeight = Math.abs(close - open);
  
  // Wick (thin line)
  const wickWidth = 1;
  
  // Body width (thick rectangle)
  const bodyWidth = Math.max(width * 0.6, 2);
  
  return (
    <g>
      {/* High-Low Wick */}
      <line
        x1={centerX}
        y1={y + (high - payload.high) * height / (payload.high - payload.low)}
        x2={centerX}
        y2={y + (low - payload.high) * height / (payload.high - payload.low)}
        stroke={color}
        strokeWidth={wickWidth}
      />
      
      {/* Open-Close Body */}
      <rect
        x={centerX - bodyWidth / 2}
        y={y + (bodyTop - payload.high) * height / (payload.high - payload.low)}
        width={bodyWidth}
        height={Math.max(bodyHeight * height / (payload.high - payload.low), 1)}
        fill={isGreen ? color : 'transparent'}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

// Custom candlestick chart component
const CandlestickChart: React.FC<{ data: PricePoint[] }> = ({ data }) => {
  const processedData = data.map((point) => ({
    ...point,
    wickHigh: point.high,
    wickLow: point.low,
    bodyTop: Math.max(point.open, point.close),
    bodyBottom: Math.min(point.open, point.close),
    isGreen: point.close >= point.open
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          interval="preserveStartEnd"
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          domain={['dataMin - 50', 'dataMax + 50']}
          tickFormatter={(value) => `$${value < 1 ? value.toFixed(6) : value.toFixed(2)}`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--foreground))'
          }}
          formatter={(value: any, name: string) => {
            if (name === 'open') return [`$${Number(value).toFixed(6)}`, 'Open'];
            if (name === 'high') return [`$${Number(value).toFixed(6)}`, 'High'];
            if (name === 'low') return [`$${Number(value).toFixed(6)}`, 'Low'];
            if (name === 'close') return [`$${Number(value).toFixed(6)}`, 'Close'];
            if (name === 'volume') return [`${(Number(value) / 1e6).toFixed(2)}M`, 'Volume'];
            return [value, name];
          }}
          labelFormatter={(label) => `Date: ${label}`}
        />
        
        {/* Render candlesticks manually */}
        {processedData.map((point, index) => {
          const x = (index / (processedData.length - 1)) * 100; // Approximate x position
          const isGreen = point.close >= point.open;
          const color = isGreen ? 'hsl(var(--crypto-green))' : 'hsl(var(--crypto-red))';
          
          return (
            <g key={index}>
              {/* This is a simplified version - in a real implementation, you'd need to calculate exact positions */}
            </g>
          );
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  data, 
  showVolume = true, 
  height = 400 
}) => {
  // Process data for better candlestick rendering
  const processedData = data.map((candle, index) => {
    const isGreen = candle.close >= candle.open;
    const bodyHeight = Math.abs(candle.close - candle.open);
    const bodyTop = Math.max(candle.open, candle.close);
    const bodyBottom = Math.min(candle.open, candle.close);
    
    return {
      ...candle,
      index,
      isGreen,
      bodyHeight,
      bodyTop,
      bodyBottom,
      wickTop: candle.high,
      wickBottom: candle.low,
      // Create separate data points for body rendering
      candleBody: bodyHeight,
      candleWickHigh: candle.high - bodyTop,
      candleWickLow: bodyTop - candle.low,
    };
  });

  return (
    <div className="w-full bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Price Chart</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-crypto-green rounded-sm"></div>
            <span>Bullish Candle</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-crypto-red rounded-sm"></div>
            <span>Bearish Candle</span>
          </div>
        </div>
      </div>
      
      <div style={{ height: `${height}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              interval="preserveStartEnd"
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              yAxisId="price"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              domain={['dataMin * 0.98', 'dataMax * 1.02']}
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
                return [value, name];
              }}
              labelFormatter={(label) => `${label}`}
            />
            
            {/* Volume bars with color coding */}
            {showVolume && (
              <Bar yAxisId="volume" dataKey="volume" opacity={0.4}>
                {processedData.map((entry, index) => (
                  <Cell 
                    key={`volume-${index}`} 
                    fill={entry.isGreen ? 'hsl(var(--crypto-green))' : 'hsl(var(--crypto-red))'}
                  />
                ))}
              </Bar>
            )}
            
            {/* Candlestick bodies */}
            <Bar yAxisId="price" dataKey="bodyTop" stackId="candle">
              {processedData.map((entry, index) => (
                <Cell 
                  key={`body-${index}`} 
                  fill={entry.isGreen ? 'hsl(var(--crypto-green))' : 'hsl(var(--crypto-red))'}
                  stroke={entry.isGreen ? 'hsl(var(--crypto-green))' : 'hsl(var(--crypto-red))'}
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Professional OHLC display */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground font-medium">O:</span>
            <span className="font-mono text-foreground">${data[data.length - 1]?.open.toFixed(4)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground font-medium">H:</span>
            <span className="font-mono text-crypto-green">${Math.max(...data.map(d => d.high)).toFixed(4)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground font-medium">L:</span>
            <span className="font-mono text-crypto-red">${Math.min(...data.map(d => d.low)).toFixed(4)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground font-medium">C:</span>
            <span className={`font-mono ${data[data.length - 1]?.close >= data[data.length - 1]?.open ? 'text-crypto-green' : 'text-crypto-red'}`}>
              ${data[data.length - 1]?.close.toFixed(4)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{data.length} candles</span>
          <span>Vol: ${(data.reduce((sum, d) => sum + d.volume, 0) / 1e6).toFixed(1)}M</span>
        </div>
      </div>
    </div>
  );
};

export default TradingViewChart;