// page.tsx - 網站首頁
// 輸入: 無
// 輸出: 展示五大功能區塊的首頁內容

import Card from '@/components/Card';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

// 策略推薦區塊類型
interface Strategy {
  id: string;
  title: string;
  description: string;
  returnRate: string;
  confidence: number;
}

// 股票資料類型
interface Stock {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

// 熱門板塊類型
interface Sector {
  id: string;
  name: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export default function Home() {
  // 策略推薦假資料
  const strategies: Strategy[] = [
    {
      id: 'strategy-1',
      title: '恆指震盪區間交易策略',
      description: '基於布林帶與相對強弱指標RSI的恆指日內高頻交易策略，適合目前高波動環境',
      returnRate: '+18.5%',
      confidence: 85,
    },
    {
      id: 'strategy-2',
      title: '科技股動能捕捉策略',
      description: '結合成交量與價格突破的科技板塊選股策略，鎖定短期爆發潛力個股',
      returnRate: '+24.3%',
      confidence: 78,
    },
    {
      id: 'strategy-3',
      title: '金融板塊價值投資組合',
      description: '針對低估值高息率金融股的篩選策略，平衡風險的長線投資組合',
      returnRate: '+12.7%',
      confidence: 92,
    },
  ];

  // 熱門股票假資料
  const hotStocks: Stock[] = [
    {
      code: '00700',
      name: '騰訊控股',
      price: 368.4,
      change: 7.8,
      changePercent: 2.16,
    },
    {
      code: '09988',
      name: '阿里巴巴',
      price: 85.7,
      change: -2.3,
      changePercent: -2.61,
    },
    {
      code: '00388',
      name: '香港交易所',
      price: 294.6,
      change: 4.2,
      changePercent: 1.45,
    },
  ];

  // 熱門板塊假資料
  const sectors: Sector[] = [
    { id: 'tech', name: '科技', trend: 'up', icon: '💻' },
    { id: 'finance', name: '金融', trend: 'up', icon: '🏦' },
    { id: 'property', name: '地產', trend: 'down', icon: '🏢' },
    { id: 'consumer', name: '消費', trend: 'neutral', icon: '🛍️' },
    { id: 'healthcare', name: '醫療', trend: 'up', icon: '💊' },
  ];

  // 恆指假資料
  const hsiData = {
    current: 18252.4,
    change: 245.3,
    changePercent: 1.36,
    open: 18050.1,
    high: 18276.5,
    low: 18032.8,
    volume: '84.5億',
    timestamp: '2023-10-25 16:08:22',
  };

  // 顯示價格漲跌顏色
  const getPriceClass = (change: number) => {
    return change > 0 ? 'market-up' : change < 0 ? 'market-down' : 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">香港股市深度分析平台</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">專業交易策略、即時市場資訊與技術分析</p>
      </div>

      {/* 兩欄佈局：左側大欄（恆指總覽 + 市場摘要）、右側小欄（策略推薦） */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側大欄 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 即時恆指總覽 */}
          <Card title="即時恆指總覽" className="overflow-hidden">
            <div className="p-2">
              <div className="flex flex-wrap items-end justify-between">
                <div>
                  <span className="text-3xl font-bold">{hsiData.current.toLocaleString()}</span>
                  <span className={`ml-2 text-xl font-semibold ${getPriceClass(hsiData.change)}`}>
                    {hsiData.change > 0 ? '+' : ''}{hsiData.change.toLocaleString()} ({hsiData.changePercent > 0 ? '+' : ''}{hsiData.changePercent}%)
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  更新時間: {hsiData.timestamp}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">開盤</div>
                  <div className="font-medium">{hsiData.open.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">最高</div>
                  <div className="font-medium">{hsiData.high.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">最低</div>
                  <div className="font-medium">{hsiData.low.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">成交額</div>
                  <div className="font-medium">{hsiData.volume}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* 今日市場摘要 */}
          <Card title="今日市場摘要" className="overflow-hidden">
            <div className="p-2">
              <div className="chart-container">
                <div className="chart-placeholder">
                  市場摘要圖表 - 此區域將顯示恆生指數與各行業板塊漲跌幅度對比
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">市場情緒</div>
                  <div className="font-medium">適度樂觀</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">上漲/下跌股數</div>
                  <div className="font-medium">735 / 482</div>
                </div>
              </div>
            </div>
          </Card>

          {/* 推薦熱股 */}
          <Card title="推薦熱股" className="overflow-hidden">
            <div className="p-2">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>股票代碼</th>
                      <th>名稱</th>
                      <th className="text-right">現價</th>
                      <th className="text-right">漲跌</th>
                      <th className="text-right">漲跌幅</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotStocks.map((stock) => (
                      <tr key={stock.code} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="font-medium">{stock.code}</td>
                        <td>{stock.name}</td>
                        <td className="text-right">{stock.price.toFixed(1)}</td>
                        <td className={`text-right ${getPriceClass(stock.change)}`}>
                          {stock.change > 0 ? '+' : ''}{stock.change.toFixed(1)}
                        </td>
                        <td className={`text-right ${getPriceClass(stock.change)}`}>
                          {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <Link href="/star-stocks" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  查看更多熱門股票 →
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* 右側小欄 */}
        <div className="space-y-6">
          {/* 最新策略推薦 */}
          <Card title="最新策略推薦" className="overflow-hidden">
            <div className="p-2 space-y-4">
              {strategies.map((strategy) => (
                <div 
                  key={strategy.id} 
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">{strategy.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{strategy.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm font-medium market-up">{strategy.returnRate}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      信心指數: {strategy.confidence}%
                    </span>
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <Link href="/strategy-center" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  探索更多策略 →
                </Link>
              </div>
            </div>
          </Card>

          {/* 熱門板塊入口 */}
          <Card title="熱門板塊入口" className="overflow-hidden">
            <div className="p-2 grid grid-cols-1 gap-3">
              {sectors.map((sector) => (
                <Link 
                  href={`/sector-radar/${sector.id}`} 
                  key={sector.id}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-2xl mr-3">{sector.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{sector.name}板塊</h3>
                    <p className={`text-sm ${
                      sector.trend === 'up' 
                        ? 'market-up' 
                        : sector.trend === 'down' 
                          ? 'market-down' 
                          : 'text-gray-500'
                    }`}>
                      {sector.trend === 'up' 
                        ? '↗ 上升趨勢' 
                        : sector.trend === 'down' 
                          ? '↘ 下降趨勢' 
                          : '→ 橫盤整理'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 