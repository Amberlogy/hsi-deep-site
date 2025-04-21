'use client';

// 市場總覽頁面 - 展示專業金融圖表、市場數據與分析
// 輸入: 用戶選項和互動
// 輸出: 動態金融圖表與市場數據

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// import { 
//   LineChart, Line, AreaChart, Area, BarChart, Bar, 
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
//   ResponsiveContainer, ComposedChart
// } from 'recharts';
import dynamic from 'next/dynamic'; // 需要動態導入 ProfessionalChart

// 導入 ProfessionalChart 和相關類型
import type { ChartSettings } from '@/components/Chart/ProfessionalChart';
import type { ChartDataPoint } from '@/data/fakeChartData'; // 確保導入 ChartDataPoint

// 動態導入 ProfessionalChart，禁用 SSR
const ProfessionalChart = dynamic(
  () => import('@/components/Chart/ProfessionalChart'),
  { ssr: false }
);


// // 簡化版的圖表設定 (由 ProfessionalChart 定義)
// interface ChartSettings {
//   chartType: 'candlestick' | 'bar' | 'line' | 'area' | 'ohlc' | 'hlc';
//   timeframe: string;
//   mainIndicator: string;
//   subCharts: string[];
// }

// 模擬金融數據 (改用 ChartDataPoint 格式)
// interface FinancialData {
//   date: string;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
//   volume: number;
//   sma20?: number;
//   sma50?: number;
//   ema20?: number;
//   rsi?: number;
//   macd?: number;
//   signal?: number;
//   histogram?: number;
// }

// 生成模擬金融數據 (修改返回類型為 ChartDataPoint)
const generateFinancialData = (days: number = 60): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
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
    const macdSignal = parseFloat((macd + Math.random() * 40 - 20).toFixed(2)); // 屬性名改為 macdSignal
    const macdHistogram = parseFloat((macd - macdSignal).toFixed(2)); // 屬性名改為 macdHistogram
    
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
      macdSignal, // 使用正確的屬性名
      macdHistogram // 使用正確的屬性名
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
  
  // 金融數據狀態 (使用 ChartDataPoint[])
  const [financialData, setFinancialData] = useState<ChartDataPoint[]>([]);
  
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
  const [isLoading, setIsLoading] = useState(true); // 初始設為 true
  
  // 初始化載入數據
  useEffect(() => {
    setIsLoading(true);
    // 異步獲取數據，模擬 API 調用
    const fetchData = async () => {
      // 實際應用中應從 API 獲取數據
      const data = generateFinancialData(90); // 預設 3 個月數據
      setFinancialData(data);
      setIsLoading(false);
    };
    fetchData();
  }, []); // 初始載入
  
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
    // 可以在這裡觸發重新獲取數據
    // handleRefreshChart(); // 取消註釋以在時間區間改變時刷新數據
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
    // 檢查是否選擇了 "無"
    if (e.target.value === '') {
      // 如果選擇 "無"，則移除該位置的指標
      newSubCharts.splice(index, 1);
    } else {
      // 否則更新或添加指標
      newSubCharts[index] = e.target.value;
    }
    setChartSettings({
      ...chartSettings,
      // 過濾掉可能因選擇 "無" 而產生的 undefined 值
      subCharts: newSubCharts.filter(Boolean),
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
    }, 500); // 縮短延遲
  };
  
  // // 移除 Recharts 相關的數據格式化函數
  // const formatPrice = (value: number) => { ... };
  // const formatDate = (dateStr: string) => { ... };
  // const getLineChartData = () => { ... };
  // const getAreaChartData = () => { ... };
  // const getBarChartData = () => { ... };
  // const getVolumeData = () => { ... };
  // const getRSIData = () => { ... };
  // const getMACDData = () => { ... };
  
  // // 移除 Recharts 的圖表渲染函數
  // const renderMainChart = () => { ... };

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
                  value={chartSettings.subCharts[index] || ''} // 確保空值處理
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
                        chartSettings.subCharts[index] !== option.value
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
        
        {/* 圖表顯示區域 - 改用 ProfessionalChart */}
        <div className="mt-6">
          {isLoading ? (
            <div className="h-[600px] flex items-center justify-center text-white">
              載入圖表中...
            </div>
          ) : (
            <ProfessionalChart settings={chartSettings} data={financialData} />
          )}
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