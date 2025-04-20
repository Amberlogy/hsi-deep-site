// 模擬圖表資料：包含6個月K線資料
// 輸出: 陣列形式的模擬金融資料，用於顯示各種圖表與指標
// 每個數據點包含日期、開盤價、最高價、最低價、收盤價、成交量及各種技術指標

export interface ChartDataPoint {
  date: string;      // 日期 (yyyy-mm-dd 格式)
  open: number;      // 開盤價
  high: number;      // 最高價
  low: number;       // 最低價
  close: number;     // 收盤價
  volume: number;    // 成交量
  rsi: number;       // 相對強弱指標
  macd: number;      // MACD指標
  macdSignal: number;// MACD訊號線
  macdHistogram: number; // MACD柱狀圖
  sma20: number;     // 20日簡單移動平均線
  sma50: number;     // 50日簡單移動平均線
}

// 生成隨機價格波動函數
const generateRandomPrice = (basePrice: number, volatility: number): number => {
  return Math.round((basePrice + (Math.random() - 0.5) * volatility) * 100) / 100;
};

// 生成6個月的模擬資料
const generateSixMonthsData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  
  // 模擬起始價格
  let basePrice = 28000; // 恆指基本點位
  const startDate = new Date('2024-01-01');
  
  // 生成每個交易日資料
  for (let i = 0; i < 120; i++) { // 約6個月交易日
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // 跳過週末
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }
    
    // 日期格式化為 yyyy-mm-dd
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // 基於前一天價格生成漲跌
    const dailyVolatility = basePrice * 0.02; // 每日波動率約2%
    
    // 生成OHLC數據
    const open = basePrice;
    const high = generateRandomPrice(open, dailyVolatility * 0.5);
    const low = generateRandomPrice(open, dailyVolatility * 0.5);
    const close = generateRandomPrice((high + low) / 2, dailyVolatility * 0.3);
    
    // 生成成交量（百萬股）
    const volume = Math.round(Math.random() * 2000 + 1000);
    
    // 模擬技術指標
    const rsi = Math.round(Math.random() * 40 + 30); // RSI介於30-70
    const macd = parseFloat((Math.random() * 200 - 100).toFixed(2));
    const macdSignal = parseFloat((macd + Math.random() * 40 - 20).toFixed(2));
    const macdHistogram = parseFloat((macd - macdSignal).toFixed(2));
    
    // 移動平均線
    const sma20 = parseFloat((basePrice + Math.random() * 200 - 100).toFixed(2));
    const sma50 = parseFloat((basePrice + Math.random() * 300 - 150).toFixed(2));
    
    // 添加資料點
    data.push({
      date: dateStr,
      open,
      high: Math.max(open, close, high),
      low: Math.min(open, close, low),
      close,
      volume,
      rsi,
      macd,
      macdSignal,
      macdHistogram,
      sma20,
      sma50
    });
    
    // 收盤價成為下一個交易日的基本價格
    basePrice = close;
  }
  
  return data;
};

// 生成並導出模擬資料
const fakeChartData = generateSixMonthsData();

export default fakeChartData; 