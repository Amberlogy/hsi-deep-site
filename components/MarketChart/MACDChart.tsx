'use client';

// MACD 指標圖表元件
// 輸入: 圖表數據、容器高度、配置選項
// 輸出: 渲染 MACD、Signal 線和直方圖

import React, { useEffect, useRef } from 'react';
import { 
  createChart, 
  LineStyle,
  CrosshairMode,
  IChartApi,
  LineSeries,
  HistogramSeries
} from 'lightweight-charts';
import { ChartDataPoint } from '@/lib/mockChartData';

interface MACDChartProps {
  data: ChartDataPoint[];
  height?: number;
  width?: number;
  fastPeriod?: number;
  slowPeriod?: number;
  signalPeriod?: number;
  onCrosshairMove?: (param: any) => void;
}

export default function MACDChart({ 
  data, 
  height = 150, 
  width,
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9,
  onCrosshairMove
}: MACDChartProps) {
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

    // 添加柱狀圖 (Histogram)
    const histogramSeries = chart.addSeries(HistogramSeries, {
      title: 'Histogram',
      priceScaleId: 'left',
    });
    
    // 轉換數據為直方圖格式
    const histogramData = data
      .filter(d => d.macdHistogram !== undefined)
      .map(d => {
        const histValue = d.macdHistogram as number;
        return {
          time: d.date as any,
          value: histValue,
          color: histValue >= 0 ? '#00FF00' : '#FF0000', // 正值為綠色，負值為紅色
        };
      });
    
    histogramSeries.setData(histogramData);

    // 添加 MACD 線系列
    const macdSeries = chart.addSeries(LineSeries, {
      color: '#FFD700',  // 黃色
      lineWidth: 2,
      title: 'MACD',
      priceScaleId: 'right',
    });
    
    // 轉換數據為 MACD 格式
    const macdData = data
      .filter(d => d.macd !== undefined)
      .map(d => ({
        time: d.date as any,
        value: d.macd as number,
      }));
    
    macdSeries.setData(macdData);

    // 添加 Signal 線系列
    const signalSeries = chart.addSeries(LineSeries, {
      color: '#33A1FF',  // 藍色
      lineWidth: 2,
      title: 'Signal',
      priceScaleId: 'right',
    });
    
    // 轉換數據為 Signal 格式
    const signalData = data
      .filter(d => d.macdSignal !== undefined)
      .map(d => ({
        time: d.date as any,
        value: d.macdSignal as number,
      }));
    
    signalSeries.setData(signalData);

    // 添加零線
    const timeRange = data.map(d => d.date);
    if (timeRange.length > 0) {
      const zeroSeries = chart.addSeries(LineSeries, {
        color: 'rgba(255, 255, 255, 0.3)',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        title: '零線',
        priceScaleId: 'right',
      });
      
      zeroSeries.setData([
        { time: timeRange[0] as any, value: 0 },
        { time: timeRange[timeRange.length - 1] as any, value: 0 },
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
  }, [data, height, width, fastPeriod, slowPeriod, signalPeriod, onCrosshairMove]);

  return (
    <div className="macd-chart w-full" style={{ height: `${height}px` }}>
      <div ref={chartContainerRef} className="h-full w-full" />
    </div>
  );
} 