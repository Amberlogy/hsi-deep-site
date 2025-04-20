// Card.tsx - 可重用的卡片元件
// 輸入: title (標題), children (內容), className (額外樣式)
// 輸出: 包含標題和內容的卡片元件，具有 hover 效果

import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {title && (
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Card; 