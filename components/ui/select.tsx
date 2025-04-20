'use client';

// Select 組件: 提供下拉選擇功能
// 輸入: 選項列表、當前值、變更處理函數
// 輸出: 可互動的下拉選擇框

import React, { ComponentPropsWithoutRef, forwardRef } from 'react';

export interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  // 組件特定屬性可在此添加
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      className={`w-full p-2 bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-blue-500 ${className || ''}`}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
);

Select.displayName = 'Select';

export const SelectTrigger = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <div
    className={`flex items-center justify-between p-2 bg-gray-700 rounded border border-gray-600 cursor-pointer ${className || ''}`}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));

SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<'span'>
>(({ className, children, ...props }, ref) => (
  <span
    className={`block truncate ${className || ''}`}
    ref={ref}
    {...props}
  >
    {children}
  </span>
));

SelectValue.displayName = 'SelectValue';

export const SelectContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <div
    className={`absolute z-50 mt-1 w-full p-1 bg-gray-700 rounded border border-gray-600 shadow-lg ${className || ''}`}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));

SelectContent.displayName = 'SelectContent';

export const SelectGroup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <div
    className={`p-1 ${className || ''}`}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));

SelectGroup.displayName = 'SelectGroup';

export const SelectItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <div
    className={`px-2 py-1 rounded hover:bg-gray-600 cursor-pointer ${className || ''}`}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));

SelectItem.displayName = 'SelectItem'; 