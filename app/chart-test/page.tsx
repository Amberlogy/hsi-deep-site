'use client';

// 圖表測試頁面 - 用於測試新的專業金融圖表元件
// 輸出: 展示各種圖表類型與技術指標的頁面

import React, { useState } from 'react';
import ProfessionalChart from '@/components/Chart/ProfessionalChart';
import { ChartSettings } from '@/components/Chart/ProfessionalChart';

export default function ChartTestPage() {
  // 圖表設定
  const [chartSettings, setChartSettings] = useState<ChartSettings>({
    chartType: 'candlestick',
    timeframe: '1D',
    mainIndicator: 'sma',
    subCharts: ['RSI', 'MACD', 'Volume']
  });

  // 切換圖表類型
  const handleChangeChartType = (type: ChartSettings['chartType']) => {
    setChartSettings(prev => ({
      ...prev,
      chartType: type
    }));
  };

  // 切換技術指標
  const handleToggleIndicator = (indicator: string) => {
    setChartSettings(prev => {
      const newSubCharts = prev.subCharts.includes(indicator)
        ? prev.subCharts.filter(item => item !== indicator)
        : [...prev.subCharts, indicator];
      
      return {
        ...prev,
        subCharts: newSubCharts
      };
    });
  };

  // 切換主圖指標
  const handleChangeMainIndicator = (indicator: string) => {
    setChartSettings(prev => ({
      ...prev,
      mainIndicator: indicator === prev.mainIndicator ? '' : indicator
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">專業金融圖表測試頁面</h1>
      
      {/* 圖表控制區 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <div className="p-4 bg-gray-800 rounded-md w-full md:w-auto">
          <h3 className="text-white font-semibold mb-2">圖表類型</h3>
          <div className="flex flex-wrap gap-2">
            {(['candlestick', 'bar', 'line', 'area', 'ohlc', 'hlc'] as const).map(type => (
              <button
                key={type}
                className={`px-3 py-1 rounded ${
                  chartSettings.chartType === type 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-200'
                }`}
                onClick={() => handleChangeChartType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-gray-800 rounded-md w-full md:w-auto">
          <h3 className="text-white font-semibold mb-2">主圖指標</h3>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded ${
                chartSettings.mainIndicator === 'sma' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-200'
              }`}
              onClick={() => handleChangeMainIndicator('sma')}
            >
              SMA
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-gray-800 rounded-md w-full md:w-auto">
          <h3 className="text-white font-semibold mb-2">副圖指標</h3>
          <div className="flex flex-wrap gap-2">
            {['RSI', 'MACD', 'Volume'].map(indicator => (
              <button
                key={indicator}
                className={`px-3 py-1 rounded ${
                  chartSettings.subCharts.includes(indicator) 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-200'
                }`}
                onClick={() => handleToggleIndicator(indicator)}
              >
                {indicator}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 圖表區域 */}
      <div className="bg-gray-900 p-2 rounded-md shadow-lg h-[800px] flex flex-col">
        <ProfessionalChart settings={chartSettings} />
      </div>
      
      {/* 當前設定顯示 */}
      <div className="mt-6 p-4 bg-gray-800 rounded-md">
        <h3 className="text-white font-semibold mb-2">當前圖表設定</h3>
        <pre className="text-gray-300 overflow-auto text-sm">
          {JSON.stringify(chartSettings, null, 2)}
        </pre>
      </div>
    </div>
  );
} 