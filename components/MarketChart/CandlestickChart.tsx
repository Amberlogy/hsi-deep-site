'use client';

// 蠟燭圖主圖層元件
// 輸入: 圖表數據、配置選項、容器高度
// 輸出: 渲染陰陽燭圖和移動平均線

import React, { useEffect, useRef } from 'react';
import { 
  createChart, 
  LineStyle,
  CrosshairMode,
  IChartApi,
  CandlestickSeries,
  LineSeries
} from 'lightweight-charts';
import { ChartDataPoint } from '@/lib/mockChartData';

interface CandlestickChartProps {
  data: ChartDataPoint[];
  height?: number;
  width?: number;
  options?: {
    showSMA10?: boolean;
    showSMA20?: boolean;
    showSMA50?: boolean;
    showSMA100?: boolean;
    showSMA150?: boolean;
  };
  onCrosshairMove?: (param: any) => void;
}

export default function CandlestickChart({ 
  data, 
  height = 400, 
  width,
  options = {
    showSMA10: true,
    showSMA20: true,
    showSMA50: true,
    showSMA100: true,
    showSMA150: false
  },
  onCrosshairMove
}: CandlestickChartProps) {
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

  // 當數據、尺寸或選項變更時重新繪製圖表
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
          top: 0.05,
          bottom: 0.05,
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

    // 添加蠟燭圖系列
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00FF00',    // 綠色（漲）
      downColor: '#FF0000',  // 紅色（跌）
      borderVisible: false,
      wickUpColor: '#00FF00',
      wickDownColor: '#FF0000',
    });

    // 轉換數據為蠟燭圖格式
    const candlestickData = data.map(d => ({
      time: d.date as any,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));
    
    candlestickSeries.setData(candlestickData);

    // 添加移動平均線系列（如果啟用）
    if (options.showSMA10) {
      const sma10Series = chart.addSeries(LineSeries, {
        color: '#FFCC00',  // 黃色
        lineWidth: 1,
        title: 'SMA10',
      });
      
      const sma10Data = data
        .filter(d => d.sma10 !== undefined)
        .map(d => ({
          time: d.date as any,
          value: d.sma10 as number,
        }));
      
      sma10Series.setData(sma10Data);
    }
    
    if (options.showSMA20) {
      const sma20Series = chart.addSeries(LineSeries, {
        color: '#FF00CC',  // 粉紅色
        lineWidth: 1,
        title: 'SMA20',
      });
      
      const sma20Data = data
        .filter(d => d.sma20 !== undefined)
        .map(d => ({
          time: d.date as any,
          value: d.sma20 as number,
        }));
      
      sma20Series.setData(sma20Data);
    }
    
    if (options.showSMA50) {
      const sma50Series = chart.addSeries(LineSeries, {
        color: '#00FFFF',  // 青綠色
        lineWidth: 1,
        title: 'SMA50',
      });
      
      const sma50Data = data
        .filter(d => d.sma50 !== undefined)
        .map(d => ({
          time: d.date as any,
          value: d.sma50 as number,
        }));
      
      sma50Series.setData(sma50Data);
    }
    
    if (options.showSMA100) {
      const sma100Series = chart.addSeries(LineSeries, {
        color: '#FFFFFF',  // 白色
        lineWidth: 1,
        title: 'SMA100',
      });
      
      const sma100Data = data
        .filter(d => d.sma100 !== undefined)
        .map(d => ({
          time: d.date as any,
          value: d.sma100 as number,
        }));
      
      sma100Series.setData(sma100Data);
    }
    
    if (options.showSMA150) {
      const sma150Series = chart.addSeries(LineSeries, {
        color: '#999999',  // 灰色
        lineWidth: 1,
        title: 'SMA150',
      });
      
      const sma150Data = data
        .filter(d => d.sma150 !== undefined)
        .map(d => ({
          time: d.date as any,
          value: d.sma150 as number,
        }));
      
      sma150Series.setData(sma150Data);
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
  }, [data, height, width, options, onCrosshairMove]);

  return (
    <div className="candlestick-chart w-full" style={{ height: `${height}px` }}>
      <div ref={chartContainerRef} className="h-full w-full" />
    </div>
  );
} 