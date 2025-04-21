'use client';

// 圖表主容器模組
// 輸入: 用戶選擇的配置
// 輸出: 具有主圖和副圖層的完整圖表

import React, { useState, useEffect, useRef } from 'react';
import CandlestickChart from './CandlestickChart';
import RSIChart from './RSIChart';
import MACDChart from './MACDChart';
import VolumeChart from './VolumeChart';
import { getMockChartData, ChartDataPoint } from '@/lib/mockChartData';

export interface ChartConfig {
  timeInterval: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';
  chartType: 'candlestick' | 'line' | 'area';
  smaLines: ('SMA10' | 'SMA20' | 'SMA50' | 'SMA100' | 'SMA150')[];
  subCharts: ('RSI' | 'MACD' | 'Volume')[];
}

const defaultConfig: ChartConfig = {
  timeInterval: '3M',
  chartType: 'candlestick',
  smaLines: ['SMA10', 'SMA20', 'SMA50', 'SMA100'],
  subCharts: ['RSI', 'MACD', 'Volume'],
};

export default function ChartContainer() {
  // 圖表配置狀態
  const [config, setConfig] = useState<ChartConfig>(defaultConfig);
  
  // 圖表數據狀態
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  // 選擇框狀態
  const [timeInterval, setTimeInterval] = useState<ChartConfig['timeInterval']>('3M');
  const [chartType, setChartType] = useState<ChartConfig['chartType']>('candlestick');
  const [selectedSMA, setSelectedSMA] = useState<ChartConfig['smaLines']>(['SMA10', 'SMA20', 'SMA50', 'SMA100']);
  const [selectedSubCharts, setSelectedSubCharts] = useState<ChartConfig['subCharts']>(['RSI', 'MACD', 'Volume']);
  
  // 同步圖表的十字線參考位置
  const syncCrosshairRef = useRef<any>(null);

  // 初始加載數據
  useEffect(() => {
    // 獲取模擬數據
    const data = getMockChartData();
    setChartData(data);
  }, []);

  // 更新圖表配置
  const updateChartConfig = () => {
    setConfig({
      timeInterval,
      chartType,
      smaLines: selectedSMA,
      subCharts: selectedSubCharts,
    });
  };

  // 處理十字線同步
  const handleCrosshairMove = (param: any) => {
    syncCrosshairRef.current = param;
  };

  // 將 SMA 選項轉換為圖表選項
  const getSMAOptions = () => {
    return {
      showSMA10: selectedSMA.includes('SMA10'),
      showSMA20: selectedSMA.includes('SMA20'),
      showSMA50: selectedSMA.includes('SMA50'),
      showSMA100: selectedSMA.includes('SMA100'),
      showSMA150: selectedSMA.includes('SMA150'),
    };
  };

  // 篩選要顯示的副圖
  const showRSI = selectedSubCharts.includes('RSI');
  const showMACD = selectedSubCharts.includes('MACD');
  const showVolume = selectedSubCharts.includes('Volume');

  return (
    <div className="market-chart-container w-full bg-[#0D1037] text-white p-4 rounded-lg">
      {/* 圖表控制區 */}
      <div className="chart-controls mb-4 flex flex-wrap gap-4">
        {/* 時間區間選擇 */}
        <div className="time-interval">
          <label className="block text-sm mb-1">時間區間</label>
          <select 
            className="bg-[#1C2263] border border-[#71649C] text-white px-2 py-1 rounded"
            value={timeInterval}
            onChange={(e) => setTimeInterval(e.target.value as ChartConfig['timeInterval'])}
          >
            <option value="1D">1天</option>
            <option value="1W">1週</option>
            <option value="1M">1個月</option>
            <option value="3M">3個月</option>
            <option value="6M">6個月</option>
            <option value="1Y">1年</option>
          </select>
        </div>
        
        {/* 圖表類型選擇 */}
        <div className="chart-type">
          <label className="block text-sm mb-1">圖表類型</label>
          <select 
            className="bg-[#1C2263] border border-[#71649C] text-white px-2 py-1 rounded"
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartConfig['chartType'])}
          >
            <option value="candlestick">陰陽燭圖</option>
            <option value="line">線圖</option>
            <option value="area">面積圖</option>
          </select>
        </div>
        
        {/* 移動平均線選擇 */}
        <div className="sma-lines">
          <label className="block text-sm mb-1">移動平均線</label>
          <div className="flex gap-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={selectedSMA.includes('SMA10')} 
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSMA([...selectedSMA, 'SMA10']);
                  } else {
                    setSelectedSMA(selectedSMA.filter(sma => sma !== 'SMA10'));
                  }
                }}
                className="mr-1"
              />
              <span className="text-[#FFCC00]">SMA10</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={selectedSMA.includes('SMA20')} 
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSMA([...selectedSMA, 'SMA20']);
                  } else {
                    setSelectedSMA(selectedSMA.filter(sma => sma !== 'SMA20'));
                  }
                }}
                className="mr-1"
              />
              <span className="text-[#FF00CC]">SMA20</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={selectedSMA.includes('SMA50')} 
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSMA([...selectedSMA, 'SMA50']);
                  } else {
                    setSelectedSMA(selectedSMA.filter(sma => sma !== 'SMA50'));
                  }
                }}
                className="mr-1"
              />
              <span className="text-[#00FFFF]">SMA50</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={selectedSMA.includes('SMA100')} 
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSMA([...selectedSMA, 'SMA100']);
                  } else {
                    setSelectedSMA(selectedSMA.filter(sma => sma !== 'SMA100'));
                  }
                }}
                className="mr-1"
              />
              <span className="text-white">SMA100</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={selectedSMA.includes('SMA150')} 
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSMA([...selectedSMA, 'SMA150']);
                  } else {
                    setSelectedSMA(selectedSMA.filter(sma => sma !== 'SMA150'));
                  }
                }}
                className="mr-1"
              />
              <span className="text-[#999999]">SMA150</span>
            </label>
          </div>
        </div>
        
        {/* 副圖選擇 */}
        <div className="sub-charts">
          <label className="block text-sm mb-1">技術指標</label>
          <div className="flex gap-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={selectedSubCharts.includes('RSI')} 
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSubCharts([...selectedSubCharts, 'RSI']);
                  } else {
                    setSelectedSubCharts(selectedSubCharts.filter(chart => chart !== 'RSI'));
                  }
                }}
                className="mr-1"
              />
              <span>RSI</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={selectedSubCharts.includes('MACD')} 
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSubCharts([...selectedSubCharts, 'MACD']);
                  } else {
                    setSelectedSubCharts(selectedSubCharts.filter(chart => chart !== 'MACD'));
                  }
                }}
                className="mr-1"
              />
              <span>MACD</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={selectedSubCharts.includes('Volume')} 
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSubCharts([...selectedSubCharts, 'Volume']);
                  } else {
                    setSelectedSubCharts(selectedSubCharts.filter(chart => chart !== 'Volume'));
                  }
                }}
                className="mr-1"
              />
              <span>成交量</span>
            </label>
          </div>
        </div>
        
        {/* 更新圖表按鈕 */}
        <div className="update-chart ml-auto self-end">
          <button 
            className="bg-[#2E3192] text-white px-4 py-2 rounded hover:bg-[#1C2263] transition-colors"
            onClick={updateChartConfig}
          >
            更新圖表
          </button>
        </div>
      </div>
      
      {/* 圖表顯示區 */}
      <div className="charts-display">
        {/* 股票信息和價格標籤 */}
        <div className="stock-info mb-2 flex justify-between items-center">
          <div className="stock-name text-lg font-bold">
            恒生指數 (HSI)
          </div>
          <div className="price-tag bg-[#00FF00] text-black px-2 py-1 rounded">
            18,452.32 +432.56 (+2.4%)
          </div>
        </div>
        
        {/* 主圖 - 蠟燭圖 */}
        {chartData.length > 0 && (
          <div className="main-chart mb-1">
            <CandlestickChart 
              data={chartData}
              height={400}
              options={getSMAOptions()}
              onCrosshairMove={handleCrosshairMove}
            />
          </div>
        )}
        
        {/* 副圖 - RSI */}
        {showRSI && chartData.length > 0 && (
          <div className="sub-chart mb-1">
            <div className="text-sm pl-2 pb-1">RSI(14)</div>
            <RSIChart 
              data={chartData}
              height={150}
              onCrosshairMove={handleCrosshairMove}
            />
          </div>
        )}
        
        {/* 副圖 - MACD */}
        {showMACD && chartData.length > 0 && (
          <div className="sub-chart mb-1">
            <div className="text-sm pl-2 pb-1">MACD(12,26,9)</div>
            <MACDChart 
              data={chartData}
              height={150}
              onCrosshairMove={handleCrosshairMove}
            />
          </div>
        )}
        
        {/* 副圖 - 成交量 */}
        {showVolume && chartData.length > 0 && (
          <div className="sub-chart">
            <div className="text-sm pl-2 pb-1">成交量</div>
            <VolumeChart 
              data={chartData}
              height={150}
              onCrosshairMove={handleCrosshairMove}
            />
          </div>
        )}
      </div>
    </div>
  );
} 