'use client';
import { useTheme } from 'next-themes';

interface CryptoPriceData {
  price: {
    usd: number;
    usd_24h_change: number;
    usd_24h_vol: number;
    usd_market_cap: number;
  };
  technicalAnalysis: {
    rsi: number[];
    rsiAnalysis: {
      signal: string;
      strength: string;
      description: string;
    };
    indicator: string;
    data: number[];
    analysis: {
      signal: string;
      strength: string;
      description: string;
    };
  };
  metadata: {
    id: string;
    currency: string;
  };
}

// Define available technical indicators grouped by category
const TECHNICAL_INDICATORS = {
  trend: [
    { id: 'SMA', name: 'Simple Moving Average' },
    { id: 'EMA', name: 'Exponential Moving Average' },
    { id: 'WMA', name: 'Weighted Moving Average' },
    { id: 'HMA', name: 'Hull Moving Average' },
    { id: 'MACD', name: 'MACD' },
    { id: 'ADX', name: 'Average Directional Index' },
    { id: 'ParabolicSAR', name: 'Parabolic SAR' },
  ],
  momentum: [
    { id: 'RSI', name: 'Relative Strength Index' },
    { id: 'Stoch', name: 'Stochastic Oscillator' },
    { id: 'CCI', name: 'Commodity Channel Index' },
    { id: 'ROC', name: 'Rate of Change' },
    { id: 'WilliamsR', name: 'Williams %R' },
    { id: 'CMO', name: 'Chande Momentum Oscillator' },
    { id: 'Mom', name: 'Momentum' },
  ],
  volatility: [
    { id: 'BB', name: 'Bollinger Bands' },
    { id: 'ATR', name: 'Average True Range' },
    { id: 'KC', name: 'Keltner Channels' },
    { id: 'DC', name: 'Donchian Channels' },
  ],
  volume: [
    { id: 'Volume', name: 'Volume' },
    { id: 'OBV', name: 'On Balance Volume' },
    { id: 'CMF', name: 'Chaikin Money Flow' },
    { id: 'AD', name: 'Accumulation/Distribution' },
    { id: 'VWAP', name: 'Volume Weighted Average Price' },
  ],
  fibonacci: [
    { id: 'FibRetracement', name: 'Fibonacci Retracement' },
    { id: 'FibExtension', name: 'Fibonacci Extension' },
    { id: 'FibFan', name: 'Fibonacci Fan' },
  ],
  other: [
    { id: 'IchimokuCloud', name: 'Ichimoku Cloud' },
    { id: 'PivotPoints', name: 'Pivot Points' },
    { id: 'ZigZag', name: 'Zig Zag' },
    { id: 'DPO', name: 'Detrended Price Oscillator' },
    { id: 'TRIX', name: 'Triple Exponential Average' },
  ],
};

const getSymbolForTradingView = (id: string): string => {
  const symbolMap: Record<string, string> = {
    'ethereum': 'ETH',
    'bitcoin': 'BTC',
  };
  return symbolMap[id.toLowerCase()] || id.toUpperCase();
};

export function CryptoPrice({
  cryptoData,
  indicators = [] 
}: {
  cryptoData?: CryptoPriceData;
  indicators?: string[];
}) {
  const { theme } = useTheme();
  const symbol = getSymbolForTradingView(cryptoData?.metadata.id || '');

  if (!cryptoData) return null;

  const { technicalAnalysis = {
    indicator: 'RSI',
    data: [],
    analysis: {
      signal: 'Neutral',
      strength: 'No data',
      description: 'Analysis not available'
    }
  } } = cryptoData;

  const { indicator, data, analysis } = technicalAnalysis;

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card w-full max-w-2xl">
      {/* Price Info */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold capitalize">
            {cryptoData.metadata.id}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl">
              ${(cryptoData.price.usd || 0).toLocaleString()}
            </span>
            <span className={`${cryptoData.price.usd_24h_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {(cryptoData.price.usd_24h_change || 0).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Technical Analysis Section */}
      <div className="flex flex-col gap-2">
        <h4 className="text-lg font-semibold">Technical Analysis</h4>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span>{indicator}:</span>
            <span className={getIndicatorColorClass(analysis.signal)}>
              {indicator === 'RSI' ? data[data.length - 1].toFixed(2) : 'See chart'}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">{analysis.signal} - {analysis.strength}</p>
            <p>{analysis.description}</p>
          </div>
        </div>
      </div>

      {/* TradingView Chart */}
      <div className="w-full h-[400px] mt-4">
        <iframe
          key={`${theme}-${indicator}`}
          title={`${symbol}USD Price Chart`}
          src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${symbol}USD&interval=D&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=f1f3f6&studies=${indicator}@tv-basicstudies&theme=${theme}&style=1&timezone=exchange&withdateranges=1`}
          className="size-full rounded-lg"
          frameBorder="0"
          allowFullScreen
        />
      </div>

      {/* Market Info */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col text-sm text-muted-foreground">
          <div>
            Volume: ${((cryptoData.price.usd_24h_vol || 0) / 1e6).toFixed(2)}M
          </div>
          <div>
            Market Cap: ${((cryptoData.price.usd_market_cap || 0) / 1e9).toFixed(2)}B
          </div>
        </div>
      </div>
    </div>
  );
}

function getRSIColorClass(rsi: number) {
  if (rsi >= 70) return 'text-red-500';
  if (rsi <= 30) return 'text-green-500';
  return 'text-gray-500';
}

function getIndicatorColorClass(signal: string) {
  switch (signal) {
    case 'Overbought':
      return 'text-red-500';
    case 'Oversold':
      return 'text-green-500';
    case 'Neutral':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
}