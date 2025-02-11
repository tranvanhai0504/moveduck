import type {
  CoreAssistantMessage,
  CoreMessage,
  CoreToolMessage,
  Message,
  ToolInvocation,
} from 'ai';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Message as DBMessage, Document } from '@/lib/db/schema';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.',
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): Array<Message> {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId,
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: 'result',
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}

export function convertToUIMessages(
  messages: Array<DBMessage>,
): Array<Message> {
  return messages.reduce((chatMessages: Array<Message>, message) => {
    if (message.role === 'tool') {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = '';
    const toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === 'string') {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === 'text') {
          textContent += content.text;
        } else if (content.type === 'tool-call') {
          toolInvocations.push({
            state: 'call',
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    chatMessages.push({
      id: message.id,
      role: message.role as Message['role'],
      content: textContent,
      toolInvocations,
    });

    return chatMessages;
  }, []);
}

export function sanitizeResponseMessages(
  messages: Array<CoreToolMessage | CoreAssistantMessage>,
): Array<CoreToolMessage | CoreAssistantMessage> {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === 'tool') {
      for (const content of message.content) {
        if (content.type === 'tool-result') {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== 'assistant') return message;

    if (typeof message.content === 'string') return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === 'tool-call'
        ? toolResultIds.includes(content.toolCallId)
        : content.type === 'text'
          ? content.text.length > 0
          : true,
    );

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0,
  );
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== 'assistant') return message;

    if (!message.toolInvocations) return message;

    const toolResultIds: Array<string> = [];

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === 'result') {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      (toolInvocation) =>
        toolInvocation.state === 'result' ||
        toolResultIds.includes(toolInvocation.toolCallId),
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 ||
      (message.toolInvocations && message.toolInvocations.length > 0),
  );
}

export function getMostRecentUserMessage(messages: Array<CoreMessage>) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number,
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}

export function getMessageIdFromAnnotations(message: Message) {
  if (!message.annotations) return message.id;

  const [annotation] = message.annotations;
  if (!annotation) return message.id;

  // @ts-expect-error messageIdFromServer is not defined in MessageAnnotation
  return annotation.messageIdFromServer;
}

// Calculate RSI helper functions
export function calculateRSI(ohlcvData: number[][], periods = 14) {
  const closePrices = ohlcvData.map(candle => candle[4]); // Close prices
  const gains = [];
  const losses = [];
  
  // Calculate price changes
  for(let i = 1; i < closePrices.length; i++) {
    const change = closePrices[i] - closePrices[i-1];
    gains.push(change >= 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  // Calculate RSI
  const rsiData = [];
  for(let i = periods; i < gains.length; i++) {
    const avgGain = gains.slice(i-periods, i).reduce((a,b) => a + b) / periods;
    const avgLoss = losses.slice(i-periods, i).reduce((a,b) => a + b) / periods;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    rsiData.push(rsi);
  }

  return rsiData;
}

export function analyzeRSI(currentRSI: number) {
  if (currentRSI >= 70) {
    return {
      signal: 'Overbought',
      strength: 'Strong sell signal',
      description: 'The asset is currently overbought, suggesting a potential reversal or price correction.'
    };
  } else if (currentRSI <= 30) {
    return {
      signal: 'Oversold',
      strength: 'Strong buy signal',
      description: 'The asset is currently oversold, suggesting a potential reversal or price increase.'
    };
  } else {
    return {
      signal: 'Neutral',
      strength: 'No clear signal',
      description: 'The asset is trading in neutral territory, suggesting no immediate strong buy or sell signals.'
    };
  }
}

export function calculateBB(ohlcvData: number[][], period = 20, multiplier = 2) {
  const closePrices = ohlcvData.map(candle => candle[4]);
  const bbandsData = [];

  for(let i = period - 1; i < closePrices.length; i++) {
    const slice = closePrices.slice(i - period + 1, i + 1);
    const sma = slice.reduce((a, b) => a + b) / period;
    const stdDev = Math.sqrt(
      slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period
    );
    
    bbandsData.push({
      middle: sma,
      upper: sma + (multiplier * stdDev),
      lower: sma - (multiplier * stdDev),
      price: closePrices[i]
    });
  }

  return bbandsData;
}

export function analyzeBB(bbData: { middle: number, upper: number, lower: number, price: number }) {
  const { middle, upper, lower, price } = bbData;
  
  if (price >= upper) {
    return {
      signal: 'Overbought',
      strength: 'Strong sell signal',
      description: 'Price is above the upper Bollinger Band, indicating potential overbought conditions.'
    };
  } else if (price <= lower) {
    return {
      signal: 'Oversold',
      strength: 'Strong buy signal',
      description: 'Price is below the lower Bollinger Band, indicating potential oversold conditions.'
    };
  } else {
    const bandwidth = ((upper - lower) / middle) * 100;
    return {
      signal: 'Neutral',
      strength: 'Monitor for breakout',
      description: `Price is within Bollinger Bands. Band width: ${bandwidth.toFixed(2)}% - ${
        bandwidth < 10 ? 'Squeeze forming, potential breakout ahead' : 'Normal volatility'
      }`
    };
  }
}

// Moving Averages
export function calculateSMA(ohlcvData: number[][], period: number) {
  const closePrices = ohlcvData.map(candle => candle[4]);
  const smaData = [];
  
  for(let i = period - 1; i < closePrices.length; i++) {
    const slice = closePrices.slice(i - period + 1, i + 1);
    const sma = slice.reduce((a, b) => a + b) / period;
    smaData.push(sma);
  }
  return smaData;
}

export function calculateEMA(ohlcvData: number[][], period: number) {
  const closePrices = ohlcvData.map(candle => candle[4]);
  const multiplier = 2 / (period + 1);
  const emaData = [closePrices[0]];
  
  for(let i = 1; i < closePrices.length; i++) {
    const ema = (closePrices[i] * multiplier) + (emaData[i-1] * (1 - multiplier));
    emaData.push(ema);
  }
  return emaData;
}

export function calculateMACD(ohlcvData: number[][], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const fastEMA = calculateEMA(ohlcvData, fastPeriod);
  const slowEMA = calculateEMA(ohlcvData, slowPeriod);
  const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
  const signalLine = calculateEMA(macdLine.map(m => [0,0,0,0,m]), signalPeriod);
  
  return {
    macdLine,
    signalLine,
    histogram: macdLine.map((macd, i) => macd - signalLine[i])
  };
}

// Moving Averages
export function calculateWMA(ohlcvData: number[][], period: number) {
  const closePrices = ohlcvData.map(candle => candle[4]);
  const wmaData = [];
  
  for(let i = period - 1; i < closePrices.length; i++) {
    const slice = closePrices.slice(i - period + 1, i + 1);
    let weightedSum = 0;
    let weightSum = 0;
    
    for(let j = 0; j < period; j++) {
      const weight = j + 1;
      weightedSum += slice[j] * weight;
      weightSum += weight;
    }
    
    wmaData.push(weightedSum / weightSum);
  }
  return wmaData;
}

export function calculateHMA(ohlcvData: number[][], period: number) {
  const wma1 = calculateWMA(ohlcvData, Math.floor(period/2));
  const wma2 = calculateWMA(ohlcvData, period);
  
  // Calculate 2*WMA(n/2) - WMA(n)
  const diffData = wma1.map((val, i) => 2 * val - wma2[i]);
  
  // Calculate WMA of the difference
  const hmaData = calculateWMA(diffData.map(d => [0,0,0,0,d]), Math.floor(Math.sqrt(period)));
  return hmaData;
}

export function calculateADX(ohlcvData: number[][], period = 14) {
  const tr = [];
  const plusDM = [];
  const minusDM = [];
  
  for(let i = 1; i < ohlcvData.length; i++) {
    const high = ohlcvData[i][2];
    const low = ohlcvData[i][3];
    const prevHigh = ohlcvData[i-1][2];
    const prevLow = ohlcvData[i-1][3];
    
    tr.push(Math.max(
      high - low,
      Math.abs(high - prevLow),
      Math.abs(low - prevHigh)
    ));
    
    plusDM.push(high - prevHigh > prevLow - low ? Math.max(high - prevHigh, 0) : 0);
    minusDM.push(prevLow - low > high - prevHigh ? Math.max(prevLow - low, 0) : 0);
  }
  
  const smoothedTR = calculateEMA(tr.map(t => [0,0,0,0,t]), period);
  const smoothedPlusDM = calculateEMA(plusDM.map(d => [0,0,0,0,d]), period);
  const smoothedMinusDM = calculateEMA(minusDM.map(d => [0,0,0,0,d]), period);
  
  const plusDI = smoothedPlusDM.map((dm, i) => (dm / smoothedTR[i]) * 100);
  const minusDI = smoothedMinusDM.map((dm, i) => (dm / smoothedTR[i]) * 100);
  
  const dx = plusDI.map((plus, i) => 
    Math.abs(plus - minusDI[i]) / (plus + minusDI[i]) * 100
  );
  
  return {
    adx: calculateEMA(dx.map(d => [0,0,0,0,d]), period),
    plusDI,
    minusDI
  };
}

export function calculateParabolicSAR(ohlcvData: number[][], acceleration = 0.02, maximum = 0.2) {
  const highs = ohlcvData.map(candle => candle[2]);
  const lows = ohlcvData.map(candle => candle[3]);
  const sarData = [];
  
  let isUpTrend = true;
  let sar = lows[0];
  let extremePoint = highs[0];
  let accelerationFactor = acceleration;
  
  for(let i = 1; i < ohlcvData.length; i++) {
    // Calculate SAR
    sar = sar + accelerationFactor * (extremePoint - sar);
    
    // Update trend and extreme point
    if(isUpTrend) {
      if(lows[i] < sar) {
        isUpTrend = false;
        sar = Math.max(...highs.slice(Math.max(0, i-5), i));
        extremePoint = lows[i];
        accelerationFactor = acceleration;
      } else {
        if(highs[i] > extremePoint) {
          extremePoint = highs[i];
          accelerationFactor = Math.min(accelerationFactor + acceleration, maximum);
        }
      }
    } else {
      if(highs[i] > sar) {
        isUpTrend = true;
        sar = Math.min(...lows.slice(Math.max(0, i-5), i));
        extremePoint = highs[i];
        accelerationFactor = acceleration;
      } else {
        if(lows[i] < extremePoint) {
          extremePoint = lows[i];
          accelerationFactor = Math.min(accelerationFactor + acceleration, maximum);
        }
      }
    }
    
    sarData.push({
      sar,
      isUpTrend
    });
  }
  
  return sarData;
}

// Momentum Indicators
export function calculateStochastic(ohlcvData: number[][], period = 14) {
  const highs = ohlcvData.map(candle => candle[2]);
  const lows = ohlcvData.map(candle => candle[3]);
  const closes = ohlcvData.map(candle => candle[4]);
  const stochData = [];

  for(let i = period - 1; i < closes.length; i++) {
    const periodHigh = Math.max(...highs.slice(i - period + 1, i + 1));
    const periodLow = Math.min(...lows.slice(i - period + 1, i + 1));
    const k = ((closes[i] - periodLow) / (periodHigh - periodLow)) * 100;
    stochData.push(k);
  }
  return stochData;
}

// Volatility Indicators
export function calculateATR(ohlcvData: number[][], period = 14) {
  const trueRanges = [];
  const atrData = [];

  for(let i = 1; i < ohlcvData.length; i++) {
    const high = ohlcvData[i][2];
    const low = ohlcvData[i][3];
    const prevClose = ohlcvData[i-1][4];
    
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trueRanges.push(tr);
  }

  // Calculate ATR using simple moving average of true ranges
  for(let i = period - 1; i < trueRanges.length; i++) {
    const atr = trueRanges.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
    atrData.push(atr);
  }
  return atrData;
}

// Volume Indicators
export function calculateOBV(ohlcvData: number[][]) {
  const obvData = [0];
  
  for(let i = 1; i < ohlcvData.length; i++) {
    const currentClose = ohlcvData[i][4];
    const prevClose = ohlcvData[i-1][4];
    const volume = ohlcvData[i][5];
    
    if(currentClose > prevClose) {
      obvData.push(obvData[i-1] + volume);
    } else if(currentClose < prevClose) {
      obvData.push(obvData[i-1] - volume);
    } else {
      obvData.push(obvData[i-1]);
    }
  }
  return obvData;
}

// Analysis functions for each indicator
export function analyzeSMA(currentPrice: number, sma: number) {
  const deviation = ((currentPrice - sma) / sma) * 100;
  
  if(deviation > 5) {
    return {
      signal: 'Overbought',
      strength: 'Price significantly above SMA',
      description: `Price is ${deviation.toFixed(2)}% above SMA, suggesting overbought conditions.`
    };
  } else if(deviation < -5) {
    return {
      signal: 'Oversold',
      strength: 'Price significantly below SMA',
      description: `Price is ${Math.abs(deviation).toFixed(2)}% below SMA, suggesting oversold conditions.`
    };
  }
  return {
    signal: 'Neutral',
    strength: 'Price near SMA',
    description: 'Price is trading close to SMA, suggesting neutral conditions.'
  };
}

export function analyzeMACD(macd: {macdLine: number[], signalLine: number[], histogram: number[]}) {
  const currentMACD = macd.macdLine[macd.macdLine.length - 1];
  const currentSignal = macd.signalLine[macd.signalLine.length - 1];
  const currentHist = macd.histogram[macd.histogram.length - 1];
  
  if(currentHist > 0 && currentHist > macd.histogram[macd.histogram.length - 2]) {
    return {
      signal: 'Bullish',
      strength: 'Strong buy signal',
      description: 'MACD histogram is positive and increasing, indicating strong bullish momentum.'
    };
  } else if(currentHist < 0 && currentHist < macd.histogram[macd.histogram.length - 2]) {
    return {
      signal: 'Bearish',
      strength: 'Strong sell signal',
      description: 'MACD histogram is negative and decreasing, indicating strong bearish momentum.'
    };
  }
  return {
    signal: 'Neutral',
    strength: 'No clear signal',
    description: 'MACD shows mixed signals, suggesting consolidation.'
  };
}

// Analysis functions for new indicators
export function analyzeADX(adxData: {adx: number[], plusDI: number[], minusDI: number[]}) {
  const currentADX = adxData.adx[adxData.adx.length - 1];
  const currentPlusDI = adxData.plusDI[adxData.plusDI.length - 1];
  const currentMinusDI = adxData.minusDI[adxData.minusDI.length - 1];
  
  let signal: 'Bullish' | 'Bearish' | 'Neutral';
  let strength: string;
  let description: string;
  
  if(currentADX > 25) {
    if(currentPlusDI > currentMinusDI) {
      signal = 'Bullish';
      strength = 'Strong trend';
      description = 'Strong upward trend detected with ADX above 25 and +DI above -DI.';
    } else {
      signal = 'Bearish';
      strength = 'Strong trend';
      description = 'Strong downward trend detected with ADX above 25 and -DI above +DI.';
    }
  } else {
    signal = 'Neutral';
    strength = 'Weak trend';
    description = 'No strong trend detected. Market may be consolidating.';
  }
  
  return { signal, strength, description };
}

// Williams %R
export function calculateWilliamsR(ohlcvData: number[][], period = 14) {
  const highs = ohlcvData.map(candle => candle[2]);
  const lows = ohlcvData.map(candle => candle[3]);
  const closes = ohlcvData.map(candle => candle[4]);
  const wrData = [];

  for(let i = period - 1; i < closes.length; i++) {
    const periodHigh = Math.max(...highs.slice(i - period + 1, i + 1));
    const periodLow = Math.min(...lows.slice(i - period + 1, i + 1));
    const wr = ((periodHigh - closes[i]) / (periodHigh - periodLow)) * -100;
    wrData.push(wr);
  }
  return wrData;
}

// Chande Momentum Oscillator
export function calculateCMO(ohlcvData: number[][], period = 14) {
  const closePrices = ohlcvData.map(candle => candle[4]);
  const cmoData = [];
  
  for(let i = period; i < closePrices.length; i++) {
    let sumGain = 0;
    let sumLoss = 0;
    
    for(let j = i - period + 1; j <= i; j++) {
      const change = closePrices[j] - closePrices[j-1];
      if(change > 0) sumGain += change;
      else sumLoss += Math.abs(change);
    }
    
    const cmo = ((sumGain - sumLoss) / (sumGain + sumLoss)) * 100;
    cmoData.push(cmo);
  }
  return cmoData;
}

// Keltner Channels
export function calculateKC(ohlcvData: number[][], period = 20, multiplier = 2) {
  const ema = calculateEMA(ohlcvData, period);
  const atr = calculateATR(ohlcvData, period);
  const kcData = [];

  for(let i = 0; i < ema.length; i++) {
    kcData.push({
      middle: ema[i],
      upper: ema[i] + (multiplier * atr[i]),
      lower: ema[i] - (multiplier * atr[i]),
      price: ohlcvData[i + period - 1][4]
    });
  }
  return kcData;
}

// Donchian Channels
export function calculateDC(ohlcvData: number[][], period = 20) {
  const highs = ohlcvData.map(candle => candle[2]);
  const lows = ohlcvData.map(candle => candle[3]);
  const dcData = [];

  for(let i = period - 1; i < ohlcvData.length; i++) {
    const upper = Math.max(...highs.slice(i - period + 1, i + 1));
    const lower = Math.min(...lows.slice(i - period + 1, i + 1));
    const middle = (upper + lower) / 2;
    dcData.push({ upper, middle, lower, price: ohlcvData[i][4] });
  }
  return dcData;
}

// Chaikin Money Flow
export function calculateCMF(ohlcvData: number[][], period = 20) {
  const cmfData = [];
  
  for(let i = period - 1; i < ohlcvData.length; i++) {
    let sumMFV = 0;
    let sumVolume = 0;
    
    for(let j = i - period + 1; j <= i; j++) {
      const high = ohlcvData[j][2];
      const low = ohlcvData[j][3];
      const close = ohlcvData[j][4];
      const volume = ohlcvData[j][5];
      
      const mfm = ((close - low) - (high - close)) / (high - low);
      const mfv = mfm * volume;
      
      sumMFV += mfv;
      sumVolume += volume;
    }
    
    cmfData.push(sumMFV / sumVolume);
  }
  return cmfData;
}

// VWAP
export function calculateVWAP(ohlcvData: number[][]) {
  let cumulativeTPV = 0; // Typical Price * Volume
  let cumulativeVolume = 0;
  const vwapData = [];

  for(let i = 0; i < ohlcvData.length; i++) {
    const high = ohlcvData[i][2];
    const low = ohlcvData[i][3];
    const close = ohlcvData[i][4];
    const volume = ohlcvData[i][5];
    
    const typicalPrice = (high + low + close) / 3;
    cumulativeTPV += typicalPrice * volume;
    cumulativeVolume += volume;
    
    vwapData.push(cumulativeTPV / cumulativeVolume);
  }
  return vwapData;
}

// Analysis functions for new indicators
export function analyzeWilliamsR(wr: number) {
  if(wr < -80) {
    return {
      signal: 'Oversold',
      strength: 'Strong buy signal',
      description: 'Williams %R indicates deeply oversold conditions, suggesting a potential bullish reversal.'
    };
  } else if(wr > -20) {
    return {
      signal: 'Overbought',
      strength: 'Strong sell signal',
      description: 'Williams %R indicates overbought conditions, suggesting a potential bearish reversal.'
    };
  }
  return {
    signal: 'Neutral',
    strength: 'No clear signal',
    description: 'Williams %R is in neutral territory.'
  };
}

export function analyzeCMO(cmo: number) {
  if(cmo > 50) {
    return {
      signal: 'Overbought',
      strength: 'Strong sell signal',
      description: 'CMO indicates overbought conditions, suggesting potential price reversal.'
    };
  } else if(cmo < -50) {
    return {
      signal: 'Oversold',
      strength: 'Strong buy signal',
      description: 'CMO indicates oversold conditions, suggesting potential price reversal.'
    };
  }
  return {
    signal: 'Neutral',
    strength: 'No clear signal',
    description: 'CMO is in neutral territory.'
  };
}

export function analyzeKC(kcData: { middle: number, upper: number, lower: number, price: number }) {
  const { middle, upper, lower, price } = kcData;
  
  if(price > upper) {
    return {
      signal: 'Overbought',
      strength: 'Strong sell signal',
      description: 'Price is above the upper Keltner Channel, indicating potential overbought conditions.'
    };
  } else if(price < lower) {
    return {
      signal: 'Oversold',
      strength: 'Strong buy signal',
      description: 'Price is below the lower Keltner Channel, indicating potential oversold conditions.'
    };
  }
  return {
    signal: 'Neutral',
    strength: 'Monitor for breakout',
    description: 'Price is within Keltner Channels, suggesting ranging conditions.'
  };
}

export function analyzeDC(dcData: { upper: number, middle: number, lower: number, price: number }) {
  const { upper, middle, lower, price } = dcData;
  
  if(price >= upper) {
    return {
      signal: 'Bullish Breakout',
      strength: 'Strong buy signal',
      description: 'Price has broken above the upper Donchian Channel, indicating strong bullish momentum.'
    };
  } else if(price <= lower) {
    return {
      signal: 'Bearish Breakout',
      strength: 'Strong sell signal',
      description: 'Price has broken below the lower Donchian Channel, indicating strong bearish momentum.'
    };
  }
  return {
    signal: 'Neutral',
    strength: 'Range-bound',
    description: 'Price is within Donchian Channels, suggesting consolidation.'
  };
}

export function analyzeCMF(cmf: number) {
  if(cmf > 0.25) {
    return {
      signal: 'Bullish',
      strength: 'Strong buying pressure',
      description: 'High positive CMF indicates strong accumulation by buyers.'
    };
  } else if(cmf < -0.25) {
    return {
      signal: 'Bearish',
      strength: 'Strong selling pressure',
      description: 'High negative CMF indicates strong distribution by sellers.'
    };
  }
  return {
    signal: 'Neutral',
    strength: 'No clear pressure',
    description: 'CMF near zero indicates balanced buying and selling pressure.'
  };
}

export function analyzeVWAP(price: number, vwap: number) {
  const deviation = ((price - vwap) / vwap) * 100;
  
  if(deviation > 2) {
    return {
      signal: 'Overbought',
      strength: 'Above VWAP',
      description: `Price is ${deviation.toFixed(2)}% above VWAP, suggesting potential resistance.`
    };
  } else if(deviation < -2) {
    return {
      signal: 'Oversold',
      strength: 'Below VWAP',
      description: `Price is ${Math.abs(deviation).toFixed(2)}% below VWAP, suggesting potential support.`
    };
  }
  return {
    signal: 'Neutral',
    strength: 'Near VWAP',
    description: 'Price is trading close to VWAP, suggesting equilibrium.'
  };
}

// Stochastic Analysis
export function analyzeStochastic(stoch: number) {
  if(stoch > 80) {
    return {
      signal: 'Overbought',
      strength: 'Strong sell signal',
      description: 'Stochastic indicates overbought conditions, suggesting potential reversal.'
    };
  } else if(stoch < 20) {
    return {
      signal: 'Oversold',
      strength: 'Strong buy signal',
      description: 'Stochastic indicates oversold conditions, suggesting potential reversal.'
    };
  }
  return {
    signal: 'Neutral',
    strength: 'No clear signal',
    description: 'Stochastic is in neutral territory.'
  };
}

// ATR Analysis
export function analyzeATR(atr: number, currentPrice: number) {
  const atrPercent = (atr / currentPrice) * 100;
  
  if(atrPercent > 5) {
    return {
      signal: 'High Volatility',
      strength: 'Strong movement expected',
      description: `High volatility with ATR at ${atrPercent.toFixed(2)}% of price. Consider wider stops.`
    };
  } else if(atrPercent < 1) {
    return {
      signal: 'Low Volatility',
      strength: 'Breakout potential',
      description: `Low volatility with ATR at ${atrPercent.toFixed(2)}% of price. Watch for breakouts.`
    };
  }
  return {
    signal: 'Normal Volatility',
    strength: 'Moderate movement',
    description: `Normal volatility with ATR at ${atrPercent.toFixed(2)}% of price.`
  };
}

// OBV Analysis
export function analyzeOBV(obvData: number[]) {
  const currentOBV = obvData[1];
  const previousOBV = obvData[0];
  const obvChange = ((currentOBV - previousOBV) / previousOBV) * 100;
  
  if(obvChange > 5) {
    return {
      signal: 'Bullish',
      strength: 'Strong volume confirmation',
      description: 'OBV is increasing significantly, confirming buying pressure.'
    };
  } else if(obvChange < -5) {
    return {
      signal: 'Bearish',
      strength: 'Strong volume confirmation',
      description: 'OBV is decreasing significantly, confirming selling pressure.'
    };
  }
  return {
    signal: 'Neutral',
    strength: 'No clear volume trend',
    description: 'OBV shows balanced volume, no clear directional pressure.'
  };
}

// CCI Calculation and Analysis
export function calculateCCI(ohlcvData: number[][], period = 20) {
  const typicalPrices = ohlcvData.map(candle => 
    (candle[2] + candle[3] + candle[4]) / 3
  );
  
  const cciData = [];
  for(let i = period - 1; i < typicalPrices.length; i++) {
    const slice = typicalPrices.slice(i - period + 1, i + 1);
    const sma = slice.reduce((a, b) => a + b) / period;
    const meanDeviation = slice.reduce((sum, price) => 
      sum + Math.abs(price - sma), 0
    ) / period;
    
    cciData.push((typicalPrices[i] - sma) / (0.015 * meanDeviation));
  }
  
  return cciData;
}

export function analyzeCCI(cci: number) {
  if(cci > 100) {
    return {
      signal: 'Overbought',
      strength: 'Strong sell signal',
      description: 'CCI indicates strongly overbought conditions.'
    };
  } else if(cci < -100) {
    return {
      signal: 'Oversold',
      strength: 'Strong buy signal',
      description: 'CCI indicates strongly oversold conditions.'
    };
  }
  return {
    signal: 'Neutral',
    strength: 'No clear signal',
    description: 'CCI is in neutral territory.'
  };
}

// ROC Calculation and Analysis
export function calculateROC(ohlcvData: number[][], period = 12) {
  const closePrices = ohlcvData.map(candle => candle[4]);
  const rocData = [];
  
  for(let i = period; i < closePrices.length; i++) {
    const roc = ((closePrices[i] - closePrices[i - period]) / closePrices[i - period]) * 100;
    rocData.push(roc);
  }
  
  return rocData;
}

export function analyzeROC(roc: number) {
  if(roc > 10) {
    return {
      signal: 'Overbought',
      strength: 'Strong momentum',
      description: 'Price change rate is high, suggesting strong upward momentum.'
    };
  } else if(roc < -10) {
    return {
      signal: 'Oversold',
      strength: 'Strong downward momentum',
      description: 'Price change rate is low, suggesting strong downward momentum.'
    };
  }
  return {
    signal: 'Neutral',
    strength: 'Moderate momentum',
    description: 'Price change rate is normal, suggesting balanced momentum.'
  };
}

// Thêm các hàm phân tích SAR
export function analyzeSAR(sarData: { sar: number, isUpTrend: boolean }) {
  const { sar, isUpTrend } = sarData;
  
  if(isUpTrend) {
    return {
      signal: 'Bullish',
      strength: 'Uptrend',
      description: 'Price is above SAR, indicating an uptrend. SAR acts as support.'
    };
  } else {
    return {
      signal: 'Bearish',
      strength: 'Downtrend',
      description: 'Price is below SAR, indicating a downtrend. SAR acts as resistance.'
    };
  }
}

export function shortenWalletAddress(address: string, length = 6): string {
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}