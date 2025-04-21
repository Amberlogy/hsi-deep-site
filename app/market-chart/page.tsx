'use client';

// 市場圖表頁面
// 展示恒生指數 AASTOCKS 風格圖表

import React from 'react';
import ChartContainer from '@/components/MarketChart/ChartContainer';

export default function MarketChartPage() {
  return (
    <div className="market-chart-page p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">恒生指數技術分析</h1>
      
      <div className="chart-wrapper">
        <ChartContainer />
      </div>
    </div>
  );
} 