'use client';

// 熱門股票組件：顯示市場熱門股票及其表現
// 輸入: 股票數據列表
// 輸出: 熱門股票表格

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StockData {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number; // 成交量，單位：百萬
}

interface TrendingSymbolsProps {
  stocks?: StockData[];
}

// 預設熱門股票資料
const defaultStocks: StockData[] = [
  {
    code: '00700',
    name: '騰訊控股',
    price: 325.80,
    change: 7.20,
    changePercent: 2.26,
    volume: 5.8
  },
  {
    code: '09988',
    name: '阿里巴巴',
    price: 76.45,
    change: -1.55,
    changePercent: -1.99,
    volume: 8.2
  },
  {
    code: '03690',
    name: '美團',
    price: 92.30,
    change: 2.70,
    changePercent: 3.01,
    volume: 4.5
  },
  {
    code: '00939',
    name: '建設銀行',
    price: 5.18,
    change: 0.08,
    changePercent: 1.57,
    volume: 7.2
  },
  {
    code: '01810',
    name: '小米集團',
    price: 12.24,
    change: -0.18,
    changePercent: -1.45,
    volume: 6.1
  }
];

const TrendingSymbols: React.FC<TrendingSymbolsProps> = ({ 
  stocks = defaultStocks 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>熱門股票</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-2">代碼</th>
                <th className="pb-2">名稱</th>
                <th className="pb-2 text-right">價格</th>
                <th className="pb-2 text-right">漲跌</th>
                <th className="pb-2 text-right">成交量(百萬)</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.code} className="border-b border-gray-700">
                  <td className="py-2">{stock.code}</td>
                  <td className="py-2">{stock.name}</td>
                  <td className="py-2 text-right">{stock.price.toFixed(2)}</td>
                  <td className={`py-2 text-right ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                  </td>
                  <td className="py-2 text-right">{stock.volume.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingSymbols; 