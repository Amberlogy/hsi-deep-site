// 模擬圖表數據生成模組
// 輸入: 無或自定義參數
// 輸出: 金融圖表所需的完整模擬數據集，包含K線、技術指標等數據

// 定義圖表數據點類型
export interface ChartDataPoint {
  date: string;        // 日期，格式為 'yyyy-MM-dd'
  open: number;        // 開盤價
  high: number;        // 最高價
  low: number;         // 最低價
  close: number;       // 收盤價
  volume: number;      // 成交量
  sma10?: number;      // 10日簡單移動平均線
  sma20?: number;      // 20日簡單移動平均線
  sma50?: number;      // 50日簡單移動平均線
  sma100?: number;     // 100日簡單移動平均線
  sma150?: number;     // 150日簡單移動平均線
  rsi?: number;        // 相對強弱指標 (通常為14日)
  macd?: number;       // MACD線
  macdSignal?: number; // MACD信號線
  macdHistogram?: number; // MACD柱狀圖
  volumeSMA?: number;  // 成交量移動平均線
}

/**
 * 生成指定數量的隨機股票數據
 * @param days 需要生成的天數，默認90天
 * @param basePrice 基礎價格，默認為100
 * @param volatility 波動率，默認為2
 * @returns 模擬的圖表數據數組
 */
export function generateMockChartData(days: number = 90, basePrice: number = 100, volatility: number = 2): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let currentPrice = basePrice;
  
  // 生成基本價格和成交量數據
  for (let i = 0; i < days; i++) {
    // 計算日期，從當前日期往前推算
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    const dateStr = date.toISOString().split('T')[0];
    
    // 隨機生成漲跌
    const changePercent = (Math.random() - 0.5) * volatility / 100;
    const change = currentPrice * changePercent;
    
    // 計算今日價格
    const open = currentPrice;
    const close = open + change;
    currentPrice = close;
    
    // 最高和最低價隨機波動
    const highLowRange = Math.abs(open * volatility / 100);
    const high = Math.max(open, close) + Math.random() * highLowRange;
    const low = Math.min(open, close) - Math.random() * highLowRange;
    
    // 生成隨機成交量
    const volume = Math.floor(Math.random() * 10000000) + 500000;
    
    // 添加到數據數組
    data.push({
      date: dateStr,
      open,
      high,
      low,
      close,
      volume
    });
  }

  // 計算技術指標
  calculateIndicators(data);
  
  return data;
}

/**
 * 計算各種技術指標
 * @param data 價格數據數組
 */
function calculateIndicators(data: ChartDataPoint[]): void {
  // 計算移動平均線
  calculateSMA(data, 10, 'sma10');
  calculateSMA(data, 20, 'sma20');
  calculateSMA(data, 50, 'sma50');
  calculateSMA(data, 100, 'sma100');
  calculateSMA(data, 150, 'sma150');
  
  // 計算成交量移動平均線
  calculateVolumeSMA(data, 20);
  
  // 計算RSI (14日)
  calculateRSI(data, 14);
  
  // 計算MACD
  calculateMACD(data, 12, 26, 9);
}

/**
 * 計算簡單移動平均線
 * @param data 價格數據數組
 * @param period 週期
 * @param targetKey 結果存儲的鍵名
 */
function calculateSMA<K extends 'sma10' | 'sma20' | 'sma50' | 'sma100' | 'sma150'>(
  data: ChartDataPoint[], 
  period: number, 
  targetKey: K
): void {
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      data[i][targetKey] = undefined;
      continue;
    }
    
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    data[i][targetKey] = sum / period;
  }
}

/**
 * 計算成交量移動平均線
 * @param data 價格數據數組
 * @param period 週期
 */
function calculateVolumeSMA(data: ChartDataPoint[], period: number): void {
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      data[i].volumeSMA = undefined;
      continue;
    }
    
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].volume;
    }
    data[i].volumeSMA = sum / period;
  }
}

/**
 * 計算RSI指標
 * @param data 價格數據數組
 * @param period 週期（通常為14）
 */
function calculateRSI(data: ChartDataPoint[], period: number): void {
  if (data.length <= period) {
    return;
  }
  
  // 計算價格變化
  const changes: number[] = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].close - data[i-1].close);
  }
  
  // 初始化前period日的RSI為undefined
  for (let i = 0; i < period; i++) {
    data[i].rsi = undefined;
  }
  
  // 計算首個RSI值
  let gains = 0;
  let losses = 0;
  
  for (let i = 0; i < period; i++) {
    if (changes[i] >= 0) {
      gains += changes[i];
    } else {
      losses -= changes[i];
    }
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // 避免除以零
  if (avgLoss === 0) {
    data[period].rsi = 100;
  } else {
    const rs = avgGain / avgLoss;
    data[period].rsi = 100 - (100 / (1 + rs));
  }
  
  // 計算其餘日期的RSI
  for (let i = period + 1; i < data.length; i++) {
    const change = changes[i-1];
    
    if (change >= 0) {
      avgGain = ((avgGain * (period - 1)) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = ((avgLoss * (period - 1)) - change) / period;
    }
    
    if (avgLoss === 0) {
      data[i].rsi = 100;
    } else {
      const rs = avgGain / avgLoss;
      data[i].rsi = 100 - (100 / (1 + rs));
    }
  }
}

/**
 * 計算MACD指標
 * @param data 價格數據數組
 * @param fastPeriod 快線週期（通常為12）
 * @param slowPeriod 慢線週期（通常為26）
 * @param signalPeriod 信號線週期（通常為9）
 */
function calculateMACD(data: ChartDataPoint[], fastPeriod: number, slowPeriod: number, signalPeriod: number): void {
  // 計算快線EMA
  const fastEMA = calculateEMA(data.map(d => d.close), fastPeriod);
  
  // 計算慢線EMA
  const slowEMA = calculateEMA(data.map(d => d.close), slowPeriod);
  
  // 計算MACD線
  const macdLine: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < slowPeriod - 1) {
      macdLine.push(0);
      data[i].macd = undefined;
    } else {
      const macd = fastEMA[i] - slowEMA[i];
      macdLine.push(macd);
      data[i].macd = macd;
    }
  }
  
  // 計算信號線 (MACD的EMA)
  const signalLine = calculateEMA(macdLine, signalPeriod);
  
  // 計算柱狀圖 (MACD - Signal)
  for (let i = 0; i < data.length; i++) {
    if (i < slowPeriod + signalPeriod - 2) {
      data[i].macdSignal = undefined;
      data[i].macdHistogram = undefined;
    } else {
      data[i].macdSignal = signalLine[i];
      data[i].macdHistogram = data[i].macd! - signalLine[i];
    }
  }
}

/**
 * 計算指數移動平均線
 * @param prices 價格數組
 * @param period 週期
 * @returns EMA值數組
 */
function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // 計算首個EMA值，使用SMA作為種子值
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  const sma = sum / period;
  
  // 填充前period-1個位置
  for (let i = 0; i < period - 1; i++) {
    ema.push(0);
  }
  
  // 添加首個EMA
  ema.push(sma);
  
  // 計算剩餘的EMA
  for (let i = period; i < prices.length; i++) {
    const currentEMA = (prices[i] - ema[i-1]) * multiplier + ema[i-1];
    ema.push(currentEMA);
  }
  
  return ema;
}

/**
 * 獲取測試用的模擬圖表數據
 * @returns 模擬的圖表數據集
 */
export function getMockChartData(): ChartDataPoint[] {
  // 生成90天的數據，起始價格100，波動率2%
  return generateMockChartData(90, 100, 2);
} 