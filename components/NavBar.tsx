// NavBar.tsx - 網站導航欄組件
// 輸入: 無
// 輸出: 展示網站各頁面入口的導航欄

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

// 定義導航項目類型
interface NavItem {
  name: string;
  path: string;
  description: string;
}

const NavBar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 導航列表
  const navItems: NavItem[] = [
    { name: '首頁', path: '/', description: '顯示最新策略推薦、即時恆指數據總覽、今日市場摘要、推薦熱股與熱門板塊入口導覽' },
    { name: '市場總覽', path: '/market-overview', description: '提供恆生指數與主要市場指數的即時報價、K線圖、成交量動態圖與市場分析' },
    { name: '活躍板塊分析', path: '/sector-radar', description: '分析每日最活躍的行業板塊，統計資金流向、輪動趨勢與強弱對比' },
    { name: '明星股分析', path: '/star-stocks', description: '追蹤市場中最具熱度的個股，並結合技術與基本面摘要' },
    { name: '深度技術分析', path: '/technical-analysis', description: '提供完整技術指標圖示與說明，輔以歷史案例與訊號解讀' },
    { name: '陰陽燭辨識', path: '/candlestick-ai', description: '使用AI自動辨識K線形態，並結合機率分析產出強弱信號與入場建議區間' },
    { name: '新聞分析中心', path: '/news-intelligence', description: '採集並分類每日財經新聞、公告與突發事件，結合NLP判別新聞情緒' },
    { name: '深度策略中心', path: '/strategy-center', description: '提供多種系統化投資策略，搭配回測報告與策略信心分數' },
    { name: '預測框架', path: '/forecast-frame', description: '建構當日與當月高低點預測模型，提供價格區間機率圖與風險提示' },
    { name: '模擬交易', path: '/simulation-trade', description: '提供模擬下單、停利停損設置、策略搭配交易模擬與績效回顧' },
    { name: '我的帳戶', path: '/dashboard', description: '個人化儀表板，包括歷史操作紀錄、資金變化追蹤與通知推播管理' },
    { name: '學習中心', path: '/learn', description: '提供指標教學、K線形態解析、策略設計原理與模擬示範' },
    { name: '關於與聯絡', path: '/about', description: '團隊介紹、平台發展歷程、版本更新公告與使用者意見反饋入口' },
  ];

  // 切換導航選單開關
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo區域 */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold">
              HSI Deep Site
            </Link>
          </div>
          
          {/* 大螢幕導航 */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.slice(0, 6).map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium
                    ${pathname === item.path 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                  `}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* 更多選單 */}
              <div className="relative group">
                <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  更多
                </button>
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                  <div className="py-1">
                    {navItems.slice(6).map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 行動版選單按鈕 */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 行動版選單內容 */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  block px-3 py-2 rounded-md text-base font-medium
                  ${pathname === item.path 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar; 