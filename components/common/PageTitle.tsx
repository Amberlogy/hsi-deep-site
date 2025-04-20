'use client';

// 頁面標題組件：統一頁面標題樣式
// 輸入: 標題文字和可選的子標題
// 輸出: 格式一致的頁面標題

import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ 
  title, 
  subtitle, 
  className = '' 
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-gray-300">{subtitle}</p>
      )}
    </div>
  );
};

export default PageTitle; 