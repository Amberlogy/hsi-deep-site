'use client';

// 市場概覽組件：顯示主要市場指數和數據
// 輸入: 市場指數數據
// 輸出: 市場指數數據卡片組

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MarketIndexData {
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface MarketOverviewProps {
  indices?: MarketIndexData[];
}

const defaultIndices: MarketIndexData[] = [
  {
    name: '恆生指數',
    price: 28432.74,
    change: 247.38,
    changePercent: 0.88
  },
  {
    name: '國企指數',
    price: 9846.31,
    change: -78.12,
    changePercent: -0.79
  },
  {
    name: '紅籌指數',
    price: 3651.28,
    change: 12.45,
    changePercent: 0.34
  }
];

const MarketOverview: React.FC<MarketOverviewProps> = ({ 
  indices = defaultIndices 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {indices.map((index) => (
        <Card key={index.name}>
          <CardHeader>
            <CardTitle>{index.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {index.price.toLocaleString('zh-HK')}
            </p>
            <p className={`${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MarketOverview; 