'use client';

// 成交量圖表元件
// 輸入: 圖表數據、容器高度、配置選項
// 輸出: 渲染成交量柱狀圖和移動平均線

import React, { useEffect, useRef } from 'react';
import { 
  createChart, 
  LineStyle,
  CrosshairMode,
  IChartApi,
  HistogramSeries,
  LineSeries
} from 'lightweight-charts';
import { ChartDataPoint } from '@/lib/mockChartData';

interface VolumeChartProps {
  data: ChartDataPoint[];
  height?: number;
  width?: number;
  showSMA?: boolean;
  smaPeriod?: number;
  onCrosshairMove?: (param: any) => void;
}

export default function VolumeChart({ 
  data, 
  height = 150, 
  width,
  showSMA = true,
  smaPeriod = 20,
  onCrosshairMove
}: VolumeChartProps) {
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
        priceFormatter: (price: number) => {
          // 格式化成交量，如果超過1百萬則顯示為 x.xxM
          if (price >= 1000000) {
            return (price / 1000000).toFixed(2) + 'M';
          } else if (price >= 1000) {
            return (price / 1000).toFixed(1) + 'K';
          }
          return price.toFixed(0);
        },
      },
    });
    
    chartRef.current = chart;

    // 添加成交量柱狀圖
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: 'volume',
      },
      title: '成交量',
    });
    
    // 轉換數據為成交量格式，根據當前收盤價與前一天相比設置顏色
    const volumeData = data.map((d, index) => {
      // 判斷是漲還是跌
      const isUp = index === 0 ? true : d.close >= data[index - 1].close;
      
      return {
        time: d.date as any,
        value: d.volume,
        color: isUp ? '#00FF00' : '#FF0000', // 上漲綠色，下跌紅色
      };
    });
    
    volumeSeries.setData(volumeData);

    // 添加移動平均線（如果啟用）
    if (showSMA) {
      const volumeSMASeries = chart.addSeries(LineSeries, {
        color: '#FFFFFF',  // 白色
        lineWidth: 1,
        title: `成交量 SMA(${smaPeriod})`,
      });
      
      const volumeSMAData = data
        .filter(d => d.volumeSMA !== undefined)
        .map(d => ({
          time: d.date as any,
          value: d.volumeSMA as number,
        }));
      
      volumeSMASeries.setData(volumeSMAData);
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
  }, [data, height, width, showSMA, smaPeriod, onCrosshairMove]);

  return (
    <div className="volume-chart w-full" style={{ height: `${height}px` }}>
      <div ref={chartContainerRef} className="h-full w-full" />
    </div>
  );
} 