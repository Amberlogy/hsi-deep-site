// layout.tsx - 網站主佈局組件
// 輸入: children (子頁面內容)
// 輸出: 具有統一導航風格的頁面佈局

import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';
import React from 'react';

// 加載 Inter 字體
const inter = Inter({ subsets: ['latin'] });

// 網站元數據
export const metadata: Metadata = {
  title: 'HSI Deep Site - 香港股市深度分析平台',
  description: '提供恆生指數專業分析、股票篩選、技術指標與交易策略的綜合金融平台',
};

// 根佈局組件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900 min-h-screen`}>
        <NavBar />
        <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4">
            <p className="text-center">© {new Date().getFullYear()} HSI Deep Site. 版權所有。</p>
          </div>
        </footer>
      </body>
    </html>
  );
} 