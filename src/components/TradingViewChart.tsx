import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, ReferenceLine } from 'recharts';
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
  return (
    <div className="w-full bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Price Chart</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-crypto-green"></div>
            <span>Bullish</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-crypto-red"></div>
            <span>Bearish</span>
          </div>
        </div>
      </div>
      
      <div style={{ height: `${height}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis 
              yAxisId="price"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${value < 1 ? value.toFixed(6) : value.toFixed(2)}`}
            />
            {showVolume && (
              <YAxis 
                yAxisId="volume"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1e6).toFixed(0)}M`}
              />
            )}
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
            
            {/* Volume bars */}
            {showVolume && (
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="hsl(var(--muted))"
                opacity={0.3}
              />
            )}
            
            {/* Custom candlestick rendering using reference lines and bars */}
            {data.map((point, index) => {
              const isGreen = point.close >= point.open;
              const color = isGreen ? 'hsl(var(--crypto-green))' : 'hsl(var(--crypto-red))';
              
              return (
                <g key={`candle-${index}`}>
                  {/* Wick - High to Low */}
                  <ReferenceLine 
                    yAxisId="price"
                    y={point.high}
                    stroke={color}
                    strokeWidth={1}
                  />
                  <ReferenceLine 
                    yAxisId="price"
                    y={point.low}
                    stroke={color}
                    strokeWidth={1}
                  />
                  
                  {/* Body will be rendered as a custom shape */}
                </g>
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Chart controls */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">O:</span>
            <span className="font-mono">${data[data.length - 1]?.open.toFixed(4)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">H:</span>
            <span className="font-mono text-crypto-green">${Math.max(...data.map(d => d.high)).toFixed(4)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">L:</span>
            <span className="font-mono text-crypto-red">${Math.min(...data.map(d => d.low)).toFixed(4)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">C:</span>
            <span className="font-mono">${data[data.length - 1]?.close.toFixed(4)}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {data.length} candles
        </div>
      </div>
    </div>
  );
};

export default TradingViewChart;