'use client';

// 卡片組件: 提供內容分組和顯示
// 輸入: 標題、內容和子組件
// 輸出: 樣式統一的卡片元素

import React, { ComponentPropsWithoutRef, forwardRef } from 'react';

export const Card = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-gray-800 rounded-lg overflow-hidden shadow-md ${className || ''}`}
    {...props}
  />
));

Card.displayName = 'Card';

export const CardHeader = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`px-5 py-4 border-b border-gray-700 ${className || ''}`}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<'h3'>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-xl font-semibold ${className || ''}`}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-5 ${className || ''}`}
    {...props}
  />
));

CardContent.displayName = 'CardContent'; 