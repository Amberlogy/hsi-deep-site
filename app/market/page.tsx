'use client';

// 市場頁面 - 展示專業金融圖表、市場數據與分析
// 輸入: 用戶選項和互動
// 輸出: 動態金融圖表與市場數據

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { getFakeChartData } from '@/data/fakeChartData';
import type { ChartSettings } from '@/components/Chart/ProfessionalChart';

// 客戶端動態導入圖表組件，禁用SSR
const OverviewChart = dynamic(
  () => import('@/components/Chart/OverviewChart'),
  { ssr: false }
);

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

// 市場頁面組件 - 客戶端組件
export default function MarketPage() {
  // 圖表設定狀態
  const [chartSettings, setChartSettings] = useState<ChartSettings>({
    chartType: 'candlestick',
    timeframe: '3mo',
    mainIndicator: 'sma',
    subCharts: ['RSI', 'MACD', 'Volume'],
  });

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

  // 重新渲染圖表
  const handleRefreshChart = () => {
    // 僅重新渲染圖表，不改變設定
    setChartSettings({ ...chartSettings });
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
            >
              更新圖表
            </button>
          </div>
        </div>
        
        {/* 圖表顯示區域 */}
        <div className="mt-6">
          <OverviewChart data={getFakeChartData()} settings={chartSettings} />
        </div>
        
        {/* 市場摘要資訊 */}
        <div className="bg-gray-800 rounded-lg p-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">市場摘要</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <h3 className="text-lg font-medium mb-2">恆生指數</h3>
              <p className="text-2xl font-bold text-green-500">28,432.74</p>
              <p className="text-green-500">+247.38 (+0.88%)</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <h3 className="text-lg font-medium mb-2">國企指數</h3>
              <p className="text-2xl font-bold text-red-500">9,846.31</p>
              <p className="text-red-500">-78.12 (-0.79%)</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <h3 className="text-lg font-medium mb-2">紅籌指數</h3>
              <p className="text-2xl font-bold text-green-500">3,651.28</p>
              <p className="text-green-500">+12.45 (+0.34%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 