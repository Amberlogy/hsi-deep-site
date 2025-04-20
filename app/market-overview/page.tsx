'use client';

// 市場總覽頁面 - 展示專業金融圖表、市場數據與分析
// 輸入: 用戶選項和互動
// 輸出: 動態金融圖表與市場數據

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart
} from 'recharts';

// 簡化版的圖表設定
interface ChartSettings {
  chartType: 'candlestick' | 'bar' | 'line' | 'area' | 'ohlc' | 'hlc';
  timeframe: string;
  mainIndicator: string;
  subCharts: string[];
}

// 模擬金融數據
interface FinancialData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  ema20?: number;
  rsi?: number;
  macd?: number;
  signal?: number;
  histogram?: number;
}

// 生成模擬金融數據
const generateFinancialData = (days: number = 60): FinancialData[] => {
  const data: FinancialData[] = [];
  let basePrice = 28000;
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // 跳過週末
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }
    
    // 日期格式
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // 產生價格波動 (約2%範圍內)
    const dailyVolatility = basePrice * 0.02;
    const changePercent = (Math.random() - 0.5) * 2;
    const change = changePercent * dailyVolatility;
    
    // 產生OHLC數據
    const open = basePrice;
    const close = Math.round((basePrice + change) * 100) / 100;
    const high = Math.round(Math.max(open, close) * (1 + Math.random() * 0.01) * 100) / 100;
    const low = Math.round(Math.min(open, close) * (1 - Math.random() * 0.01) * 100) / 100;
    
    // 產生成交量
    const volume = Math.round(Math.random() * 2000 + 1000);
    
    // 技術指標
    const sma20 = Math.round((basePrice + Math.random() * 200 - 100) * 100) / 100;
    const sma50 = Math.round((basePrice + Math.random() * 300 - 150) * 100) / 100;
    const rsi = Math.round(Math.random() * 40 + 30); // 介於30-70
    const macd = parseFloat((Math.random() * 200 - 100).toFixed(2));
    const signal = parseFloat((macd + Math.random() * 40 - 20).toFixed(2));
    const histogram = parseFloat((macd - signal).toFixed(2));
    
    data.push({
      date: dateStr,
      open,
      high,
      low,
      close,
      volume,
      sma20,
      sma50,
      rsi,
      macd,
      signal,
      histogram
    });
    
    // 更新下一個交易日的基礎價格
    basePrice = close;
  }
  
  return data;
};

// 圖表類型選項
const chartTypes = [
  { value: 'candlestick', label: '陰陽燭圖' },
  { value: 'bar', label: '柱形圖' },
  { value: 'line', label: '線形圖' },
  { value: 'area', label: '山形圖' },
  { value: 'ohlc', label: 'OHLC圖' },
  { value: 'hlc', label: 'HLC圖' },
];

// 時間區間選項
const timeframeOptions = [
  { value: '1m', label: '1分鐘', group: '分鐘' },
  { value: '3m', label: '3分鐘', group: '分鐘' },
  { value: '5m', label: '5分鐘', group: '分鐘' },
  { value: '10m', label: '10分鐘', group: '分鐘' },
  { value: '15m', label: '15分鐘', group: '分鐘' },
  { value: '30m', label: '30分鐘', group: '分鐘' },
  { value: '10d', label: '10天', group: '小時' },
  { value: '20d', label: '20天', group: '小時' },
  { value: '1mo', label: '1個月', group: '日線' },
  { value: '3mo', label: '3個月', group: '日線' },
  { value: '6mo', label: '6個月', group: '日線' },
  { value: '1y', label: '1年', group: '日線' },
  { value: '3y', label: '3年', group: '日線' },
  { value: '5y', label: '5年', group: '日線' },
  { value: '1w', label: '週線圖', group: '週線' },
  { value: '1M', label: '月線圖', group: '月線' },
];

// 主圖指標選項
const mainIndicatorOptions = [
  { value: 'none', label: '無' },
  { value: 'sma', label: 'SMA (簡單移動平均線)' },
  { value: 'ema', label: 'EMA (指數移動平均線)' },
  { value: 'wma', label: 'WMA (加權移動平均線)' },
  { value: 'sar', label: 'SAR (拋物線指標)' },
  { value: 'bollinger', label: '布林通道' },
];

// 副圖指標選項
const subChartOptions = [
  { value: 'RSI', label: 'RSI (相對強弱指標)' },
  { value: 'MACD', label: 'MACD (移動平均匯聚/發散指標)' },
  { value: 'Volume', label: '成交量' },
  { value: 'ATR', label: 'ATR (平均真實範圍)' },
  { value: 'Stochastic', label: '隨機指標' },
];

// 市場總覽頁面組件
export default function MarketOverviewPage() {
  // 圖表設定狀態
  const [chartSettings, setChartSettings] = useState<ChartSettings>({
    chartType: 'candlestick',
    timeframe: '3mo',
    mainIndicator: 'sma',
    subCharts: ['RSI', 'MACD', 'Volume'],
  });
  
  // 模擬金融數據狀態
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  
  // 模擬指數數據狀態
  const [marketData, setMarketData] = useState({
    hsiIndex: '28,432.74',
    hsiChange: '+247.38',
    hsiPercent: '+0.88%',
    hsceiIndex: '9,846.31',
    hsceiChange: '-78.12', 
    hsceiPercent: '-0.79%',
    hsciIndex: '3,651.28',
    hsciChange: '+12.45',
    hsciPercent: '+0.34%'
  });
  
  // 載入狀態
  const [isLoading, setIsLoading] = useState(false);
  
  // 初始化載入數據
  useEffect(() => {
    setFinancialData(generateFinancialData(60));
  }, []);
  
  // 更新圖表類型
  const handleChartTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChartSettings({
      ...chartSettings,
      chartType: e.target.value as ChartSettings['chartType'],
    });
  };

  // 更新時間區間
  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChartSettings({
      ...chartSettings,
      timeframe: e.target.value,
    });
  };

  // 更新主圖指標
  const handleMainIndicatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChartSettings({
      ...chartSettings,
      mainIndicator: e.target.value,
    });
  };

  // 更新副圖選擇
  const handleSubChartChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const newSubCharts = [...chartSettings.subCharts];
    newSubCharts[index] = e.target.value;
    setChartSettings({
      ...chartSettings,
      subCharts: newSubCharts,
    });
  };

  // 獲取指定指標的目前索引
  const getSubChartIndex = (indicator: string) => {
    return chartSettings.subCharts.indexOf(indicator);
  };

  // 重新載入數據並更新圖表
  const handleRefreshChart = () => {
    setIsLoading(true);
    
    // 模擬載入數據的延遲
    setTimeout(() => {
      // 根據不同時間週期生成不同長度的數據
      let days = 60;
      
      if (chartSettings.timeframe === '1mo') days = 30;
      if (chartSettings.timeframe === '3mo') days = 90;
      if (chartSettings.timeframe === '6mo') days = 180;
      if (chartSettings.timeframe === '1y') days = 365;
      
      setFinancialData(generateFinancialData(days));
      setIsLoading(false);
    }, 1000);
  };
  
  // 自定義價格格式化函數
  const formatPrice = (value: number) => {
    return value.toLocaleString('zh-HK');
  };
  
  // 自定義時間格式化函數
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth()+1}/${date.getDate()}`;
  };
  
  // 針對線性圖表的數據變形
  const getLineChartData = () => {
    return financialData.map(item => ({
      date: item.date,
      close: item.close,
      sma20: item.sma20,
      sma50: item.sma50
    }));
  };
  
  // 針對面積圖表的數據變形
  const getAreaChartData = () => {
    return financialData.map(item => ({
      date: item.date,
      close: item.close
    }));
  };
  
  // 針對柱狀圖表的數據變形
  const getBarChartData = () => {
    return financialData.map(item => ({
      date: item.date,
      range: item.high - item.low,
      close: item.close
    }));
  };
  
  // 針對成交量數據變形
  const getVolumeData = () => {
    return financialData.map(item => ({
      date: item.date,
      volume: item.volume,
      upDown: item.close >= item.open ? 'up' : 'down'
    }));
  };

  // 針對RSI數據變形
  const getRSIData = () => {
    return financialData.map(item => ({
      date: item.date,
      rsi: item.rsi
    }));
  };
  
  // 針對MACD數據變形
  const getMACDData = () => {
    return financialData.map(item => ({
      date: item.date,
      macd: item.macd,
      signal: item.signal,
      histogram: item.histogram
    }));
  };
  
  // 用於繪製不同類型的圖表
  const renderMainChart = () => {
    if (chartSettings.chartType === 'line') {
      return (
        <LineChart data={getLineChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis tickFormatter={formatPrice} domain={['auto', 'auto']} />
          <Tooltip
            formatter={(value: number) => [formatPrice(value), '價格']}
            labelFormatter={(label) => `日期: ${label}`} 
          />
          <Legend />
          <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} name="收盤價" />
          {chartSettings.mainIndicator === 'sma' && (
            <>
              <Line type="monotone" dataKey="sma20" stroke="#ff4500" dot={false} name="SMA20" />
              <Line type="monotone" dataKey="sma50" stroke="#00bfff" dot={false} name="SMA50" />
            </>
          )}
        </LineChart>
      );
    }
    
    if (chartSettings.chartType === 'area') {
      return (
        <AreaChart data={getAreaChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis tickFormatter={formatPrice} domain={['auto', 'auto']} />
          <Tooltip 
            formatter={(value: number) => [formatPrice(value), '價格']}
            labelFormatter={(label) => `日期: ${label}`}
          />
          <Legend />
          <Area type="monotone" dataKey="close" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="收盤價" />
        </AreaChart>
      );
    }
    
    if (chartSettings.chartType === 'bar') {
      return (
        <BarChart data={getBarChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis tickFormatter={formatPrice} domain={['auto', 'auto']} />
          <Tooltip 
            formatter={(value: number) => [formatPrice(value), '價格']}
            labelFormatter={(label) => `日期: ${label}`}
          />
          <Legend />
          <Bar dataKey="close" fill="#8884d8" name="收盤價" />
        </BarChart>
      );
    }
    
    // 蠟燭圖、OHLC圖、HLC圖 都用這個簡化版實現
    return (
      <ComposedChart data={financialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="date" tickFormatter={formatDate} />
        <YAxis tickFormatter={formatPrice} domain={['auto', 'auto']} />
        <Tooltip 
          formatter={(value: number) => [formatPrice(value), '價格']}
          labelFormatter={(label) => `日期: ${label}`}
          contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
          itemStyle={{ color: '#fff' }}
        />
        <Legend />
        <Bar dataKey="close" name="價格" fill="#26a69a" />
        {chartSettings.mainIndicator === 'sma' && (
          <>
            <Line type="monotone" dataKey="sma20" stroke="#ff4500" dot={false} name="SMA20" />
            <Line type="monotone" dataKey="sma50" stroke="#00bfff" dot={false} name="SMA50" />
          </>
        )}
      </ComposedChart>
    );
  };

  return (
    <div className="min-h-screen bg-[#0D1037] text-white pb-10">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">市場總覽</h1>
        
        {/* 圖表設定面板 */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">圖表設定</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* 圖表類型選擇 */}
            <div>
              <label className="block mb-2 text-sm font-medium">圖表類型</label>
              <select
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-blue-500"
                value={chartSettings.chartType}
                onChange={handleChartTypeChange}
              >
                {chartTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 時間區間選擇 */}
            <div>
              <label className="block mb-2 text-sm font-medium">時間區間</label>
              <select
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-blue-500"
                value={chartSettings.timeframe}
                onChange={handleTimeframeChange}
              >
                {/* 依分組顯示選項 */}
                <optgroup label="分鐘圖">
                  {timeframeOptions
                    .filter((option) => option.group === '分鐘')
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="小時圖">
                  {timeframeOptions
                    .filter((option) => option.group === '小時')
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="日線圖">
                  {timeframeOptions
                    .filter((option) => option.group === '日線')
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="其他">
                  {timeframeOptions
                    .filter((option) => ['週線', '月線'].includes(option.group))
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>
            
            {/* 主圖指標選擇 */}
            <div>
              <label className="block mb-2 text-sm font-medium">主圖指標</label>
              <select
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-blue-500"
                value={chartSettings.mainIndicator}
                onChange={handleMainIndicatorChange}
              >
                {mainIndicatorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* 副圖1-5選擇 */}
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index}>
                <label className="block mb-2 text-sm font-medium">副圖 {index + 1}</label>
                <select
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-blue-500"
                  value={chartSettings.subCharts[index] || ''}
                  onChange={(e) => handleSubChartChange(e, index)}
                >
                  <option value="">無</option>
                  {subChartOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={
                        // 如果指標已在其他副圖使用，且不是當前選擇的指標，則禁用
                        chartSettings.subCharts.includes(option.value) &&
                        getSubChartIndex(option.value) !== index
                      }
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          
          {/* 更新圖表按鈕 */}
          <div className="mt-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              onClick={handleRefreshChart}
              disabled={isLoading}
            >
              {isLoading ? '載入中...' : '更新圖表'}
            </button>
          </div>
        </div>
        
        {/* 圖表顯示區域 - 使用 Recharts */}
        <div className="mt-6">
          <div className="w-full bg-[#0D1037] rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-800 rounded-lg mb-2">
              <h3 className="text-xl mb-2">恆生指數 ({chartSettings.timeframe}) - {chartTypes.find(t => t.value === chartSettings.chartType)?.label}</h3>
              <p className="text-sm text-gray-400">{mainIndicatorOptions.find(i => i.value === chartSettings.mainIndicator)?.label}</p>
            </div>
            
            {/* 主圖表 */}
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <p>載入中...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  {renderMainChart()}
                </ResponsiveContainer>
              )}
            </div>
            
            {/* 副圖 - RSI */}
            {chartSettings.subCharts.includes('RSI') && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h4 className="text-sm mb-2">RSI(14)</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={getRSIData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis domain={[0, 100]} ticks={[30, 50, 70]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rsi" stroke="#f44336" dot={false} />
                    {/* 參考線 */}
                    <CartesianGrid y={30} stroke="#990000" strokeDasharray="3 3" horizontal={false} />
                    <CartesianGrid y={70} stroke="#000099" strokeDasharray="3 3" horizontal={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {/* 副圖 - MACD */}
            {chartSettings.subCharts.includes('MACD') && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h4 className="text-sm mb-2">MACD(12,26,9)</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <ComposedChart data={getMACDData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="histogram" fill="#8884d8" name="柱狀" />
                    <Line type="monotone" dataKey="macd" stroke="#2196f3" dot={false} name="MACD" />
                    <Line type="monotone" dataKey="signal" stroke="#ff9800" dot={false} name="Signal" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {/* 副圖 - 成交量 */}
            {chartSettings.subCharts.includes('Volume') && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h4 className="text-sm mb-2">成交量</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={getVolumeData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="volume" name="成交量" fill="#26a69a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
        
        {/* 市場摘要資訊 */}
        <div className="bg-gray-800 rounded-lg p-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">市場摘要</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <h3 className="text-lg font-medium mb-2">恆生指數</h3>
              <p className="text-2xl font-bold text-green-500">{marketData.hsiIndex}</p>
              <p className="text-green-500">{marketData.hsiChange} ({marketData.hsiPercent})</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <h3 className="text-lg font-medium mb-2">國企指數</h3>
              <p className="text-2xl font-bold text-red-500">{marketData.hsceiIndex}</p>
              <p className="text-red-500">{marketData.hsceiChange} ({marketData.hsceiPercent})</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <h3 className="text-lg font-medium mb-2">紅籌指數</h3>
              <p className="text-2xl font-bold text-green-500">{marketData.hsciIndex}</p>
              <p className="text-green-500">{marketData.hsciChange} ({marketData.hsciPercent})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 