'use client';

// 標籤頁組件: 提供內容分頁顯示
// 輸入: 頁籤和對應內容
// 輸出: 可切換的標籤頁界面

import React, { ComponentPropsWithoutRef, forwardRef, useState } from 'react';

export const Tabs = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`w-full ${className || ''}`}
    {...props}
  />
));

Tabs.displayName = 'Tabs';

interface TabsListProps extends ComponentPropsWithoutRef<'div'> {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, defaultValue, onValueChange, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex space-x-1 border-b border-gray-700 ${className || ''}`}
      {...props}
    />
  )
);

TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends ComponentPropsWithoutRef<'button'> {
  value: string;
  isActive?: boolean;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, isActive, ...props }, ref) => (
    <button
      ref={ref}
      className={`px-4 py-2 font-medium border-b-2 -mb-px ${
        isActive 
          ? 'border-blue-500 text-blue-500' 
          : 'border-transparent hover:text-gray-300'
      } ${className || ''}`}
      value={value}
      {...props}
    />
  )
);

TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends ComponentPropsWithoutRef<'div'> {
  value: string;
  activeValue?: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, activeValue, ...props }, ref) => (
    <div
      ref={ref}
      className={`mt-2 ${value === activeValue ? 'block' : 'hidden'} ${
        className || ''
      }`}
      {...props}
    />
  )
);

TabsContent.displayName = 'TabsContent'; 