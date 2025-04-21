'use client';

// RSI 相對強弱指數圖表元件
// 輸入: 圖表數據、容器高度、配置選項
// 輸出: 渲染 RSI 線圖和參考線 (超買/超賣)

import React, { useEffect, useRef } from 'react';
import { 
  createChart, 
  LineStyle,
  CrosshairMode,
  IChartApi,
  LineSeries
} from 'lightweight-charts';
import { ChartDataPoint } from '@/lib/mockChartData';

interface RSIChartProps {
  data: ChartDataPoint[];
  height?: number;
  width?: number;
  period?: number;
  upperBound?: number;
  lowerBound?: number;
  onCrosshairMove?: (param: any) => void;
}

export default function RSIChart({ 
  data, 
  height = 150, 
  width,
  period = 14,
  upperBound = 70,
  lowerBound = 30,
  onCrosshairMove
}: RSIChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  // 當元件卸載時清理圖表資源
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  // 當數據或尺寸變更時重新繪製圖表
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 清理現有圖表實例
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }
    
    // 創建新的圖表實例
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#0D1037' },
        textColor: 'white',
        fontFamily: 'Noto Sans TC, Roboto, sans-serif',
      },
      grid: {
        vertLines: { color: '#1C2263' },
        horzLines: { color: '#1C2263' },
      },
      width: width || chartContainerRef.current.clientWidth,
      height: height,
      rightPriceScale: { 
        borderColor: '#1C2263',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: '#1C2263',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 1,
          color: '#FFFFFF',
          style: LineStyle.Solid,
        },
        horzLine: {
          width: 1,
          color: '#FFFFFF',
          style: LineStyle.Solid,
        },
      },
      localization: {
        locale: 'zh-TW',
      },
    });
    
    chartRef.current = chart;

    // 添加 RSI 線系列
    const rsiSeries = chart.addSeries(LineSeries, {
      color: '#FF3333',  // 紅色
      lineWidth: 2,
      title: `RSI(${period})`,
    });

    // 轉換數據為 RSI 格式
    const rsiData = data
      .filter(d => d.rsi !== undefined)
      .map(d => ({
        time: d.date as any,
        value: d.rsi as number,
      }));
    
    rsiSeries.setData(rsiData);

    // 添加超買線
    const timeRange = data.map(d => d.date);
    if (timeRange.length > 0) {
      const overboughtSeries = chart.addSeries(LineSeries, {
        color: 'rgba(255, 255, 255, 0.5)',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        title: `超買(${upperBound})`,
      });
      
      overboughtSeries.setData([
        { time: timeRange[0] as any, value: upperBound },
        { time: timeRange[timeRange.length - 1] as any, value: upperBound },
      ]);
      
      // 添加超賣線
      const oversoldSeries = chart.addSeries(LineSeries, {
        color: 'rgba(255, 255, 255, 0.5)',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        title: `超賣(${lowerBound})`,
      });
      
      oversoldSeries.setData([
        { time: timeRange[0] as any, value: lowerBound },
        { time: timeRange[timeRange.length - 1] as any, value: lowerBound },
      ]);
      
      // 添加中間線 (50)
      const middleSeries = chart.addSeries(LineSeries, {
        color: 'rgba(255, 255, 255, 0.3)',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        title: '中線(50)',
      });
      
      middleSeries.setData([
        { time: timeRange[0] as any, value: 50 },
        { time: timeRange[timeRange.length - 1] as any, value: 50 },
      ]);
    }

    // 處理十字線移動事件
    if (onCrosshairMove) {
      chart.subscribeCrosshairMove(onCrosshairMove);
    }

    // 適應視窗大小變化
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const newWidth = width || chartContainerRef.current.clientWidth;
        chartRef.current.applyOptions({ width: newWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (onCrosshairMove && chartRef.current) {
        chartRef.current.unsubscribeCrosshairMove(onCrosshairMove);
      }
    };
  }, [data, height, width, period, upperBound, lowerBound, onCrosshairMove]);

  return (
    <div className="rsi-chart w-full" style={{ height: `${height}px` }}>
      <div ref={chartContainerRef} className="h-full w-full" />
    </div>
  );
} 