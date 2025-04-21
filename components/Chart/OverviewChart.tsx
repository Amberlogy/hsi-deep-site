'use client';

// 專業金融圖表元件 - 符合 AASTOCKS 風格
// 輸入: 圖表設定與資料
// 輸出: 互動式金融圖表

import React, { useEffect, useRef } from 'react';
import { 
  createChart, 
  LineStyle,
  CandlestickSeries,
  LineSeries,
  CrosshairMode,
  IChartApi,
  HistogramSeries
} from 'lightweight-charts';
import { getFakeChartData, ChartDataPoint } from '@/data/fakeChartData';
import { ChartSettings } from './ProfessionalChart';

interface OverviewChartProps {
  settings?: ChartSettings;
  data?: ChartDataPoint[];
}

export default function OverviewChart({ data, settings }: OverviewChartProps = {}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const rsiContainerRef = useRef<HTMLDivElement>(null);
  const macdContainerRef = useRef<HTMLDivElement>(null);
  const volumeContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const rsiChartRef = useRef<IChartApi | null>(null);
  const macdChartRef = useRef<IChartApi | null>(null);
  const volumeChartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !rsiContainerRef.current || 
        !macdContainerRef.current || !volumeContainerRef.current) return;

    const chartData = data || getFakeChartData();
    
    // 主圖表配置
    const mainChart = createChart(chartContainerRef.current, {
          layout: {
        background: { color: '#0D1037' },
        textColor: 'white',
          },
          grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
          timeScale: {
        borderColor: '#71649C',
            timeVisible: true,
            secondsVisible: false,
          },
      rightPriceScale: { borderColor: '#71649C' },
          crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: {
              width: 1,
          color: '#aaa',
              style: LineStyle.Solid,
            },
            horzLine: {
          color: '#aaa',
          style: LineStyle.Solid,
              width: 1,
            },
          },
        });
        
    chartRef.current = mainChart;

    // 陰陽燭圖
    const candleSeries = mainChart.addSeries(CandlestickSeries, {
      upColor: '#00ff00',
      downColor: '#ff0000',
      borderVisible: false,
      wickUpColor: '#00ff00',
      wickDownColor: '#ff0000',
    });

    const candleData = chartData.map(item => ({
      time: item.date as any,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }));
        
    candleSeries.setData(candleData);

    // SMA20
    const sma20Series = mainChart.addSeries(LineSeries, {
      color: '#FFA500',
      lineWidth: 1,
    });

    sma20Series.setData(
      chartData.map(d => ({
        time: d.date as any,
        value: d.sma20,
      }))
    );

    // SMA50
    const sma50Series = mainChart.addSeries(LineSeries, {
      color: '#00BFFF',
      lineWidth: 1,
    });

    sma50Series.setData(
      chartData.map(d => ({
        time: d.date as any,
        value: d.sma50,
      }))
    );
    
    // RSI 圖表配置
    const rsiChart = createChart(rsiContainerRef.current, {
      layout: {
        background: { color: '#0D1037' },
        textColor: 'white',
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      width: rsiContainerRef.current.clientWidth,
      height: 150,
      timeScale: { 
        borderColor: '#71649C',
        visible: false, // 隱藏時間刻度
      },
      rightPriceScale: { 
        borderColor: '#71649C',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 1,
          color: '#aaa',
          style: LineStyle.Solid,
        },
        horzLine: {
          color: '#aaa',
          style: LineStyle.Solid,
          width: 1,
        },
      },
    });
    
    rsiChartRef.current = rsiChart;
    
    // 添加 RSI 線條
    const rsiSeries = rsiChart.addSeries(LineSeries, {
      color: '#f44336',  // 紅色
      lineWidth: 2,
      title: 'RSI-14',
    });
    
    // 設置 RSI 數據
    rsiSeries.setData(
      chartData.map(d => ({
        time: d.date as any,
        value: d.rsi || 50, // 使用數據中的 rsi 值，如果沒有則默認為 50
      }))
    );
    
    // 添加超買線 (70)
    const overboughtSeries = rsiChart.addSeries(LineSeries, {
      color: 'rgba(255, 255, 255, 0.5)',
            lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      title: '超買(70)',
    });
    
    // 添加超賣線 (30)
    const oversoldSeries = rsiChart.addSeries(LineSeries, {
      color: 'rgba(255, 255, 255, 0.5)',
            lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      title: '超賣(30)',
    });
    
    // 設置超買超賣參考線數據
    const timeRange = chartData.map(item => item.date as any);
    if (timeRange.length > 0) {
      overboughtSeries.setData([
        { time: timeRange[0], value: 70 },
        { time: timeRange[timeRange.length - 1], value: 70 }
      ]);
      
      oversoldSeries.setData([
        { time: timeRange[0], value: 30 },
        { time: timeRange[timeRange.length - 1], value: 30 }
      ]);
    }
    
    // MACD 圖表配置
    const macdChart = createChart(macdContainerRef.current, {
      layout: {
        background: { color: '#0D1037' },
        textColor: 'white',
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      width: macdContainerRef.current.clientWidth,
      height: 150,
      timeScale: { 
        borderColor: '#71649C',
        visible: false, // 隱藏時間刻度
      },
      rightPriceScale: { 
        borderColor: '#71649C',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 1,
          color: '#aaa',
          style: LineStyle.Solid,
        },
        horzLine: {
          color: '#aaa',
          style: LineStyle.Solid,
          width: 1,
        },
      },
    });
    
    macdChartRef.current = macdChart;
    
    // 添加 MACD 線條
    const macdSeries = macdChart.addSeries(LineSeries, {
      color: '#2196F3',  // 藍色
      lineWidth: 2,
      title: 'MACD',
    });
    
    // 添加 MACD 信號線
    const signalSeries = macdChart.addSeries(LineSeries, {
      color: '#FF9800',  // 橙色
      lineWidth: 1,
      title: 'Signal',
    });
    
    // 添加 MACD 柱狀圖
    const histogramSeries = macdChart.addSeries(HistogramSeries, {
      title: 'Histogram',
    });
    
    // 設置 MACD 數據
    macdSeries.setData(
      chartData.map(d => ({
        time: d.date as any,
        value: d.macd || 0,
      }))
    );
    
    // 設置信號線數據
    signalSeries.setData(
      chartData.map(d => ({
        time: d.date as any,
        value: d.macdSignal || 0,
      }))
    );
    
    // 設置柱狀圖數據
    histogramSeries.setData(
      chartData.map(d => {
        const histValue = d.macdHistogram || 0;
        return {
          time: d.date as any,
          value: histValue,
          color: histValue >= 0 ? '#26A69A' : '#EF5350',  // 上漲綠色，下跌紅色
        };
      })
    );
    
    // 添加零線
    const zeroSeries = macdChart.addSeries(LineSeries, {
      color: 'rgba(255, 255, 255, 0.3)',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
    });
    
    // 設置零線數據
    zeroSeries.setData([
      { time: timeRange[0], value: 0 },
      { time: timeRange[timeRange.length - 1], value: 0 }
    ]);
    
    // 成交量圖表配置
    const volumeChart = createChart(volumeContainerRef.current, {
      layout: {
        background: { color: '#0D1037' },
        textColor: 'white',
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      width: volumeContainerRef.current.clientWidth,
      height: 150,
      timeScale: { 
        borderColor: '#71649C',
        visible: false, // 隱藏時間刻度
      },
      rightPriceScale: { 
        borderColor: '#71649C',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 1,
          color: '#aaa',
          style: LineStyle.Solid,
        },
        horzLine: {
          color: '#aaa',
          style: LineStyle.Solid,
          width: 1,
        },
      },
    });
    
    volumeChartRef.current = volumeChart;
    
    // 添加成交量柱狀圖
    const volumeSeries = volumeChart.addSeries(HistogramSeries, {
      priceFormat: {
        type: 'volume',
      },
      title: '成交量',
    });
    
    // 設置成交量數據，漲跌用不同顏色
    volumeSeries.setData(
      chartData.map((d, index) => {
        const isUp = index === 0 ? true : d.close >= chartData[index - 1].close;
        return {
          time: d.date as any,
          value: d.volume,
          color: isUp ? '#26A69A' : '#EF5350',  // 上漲綠色，下跌紅色
        };
      })
    );
    
    // 同步所有圖表的時間軸範圍
    mainChart.timeScale().subscribeVisibleLogicalRangeChange(timeRange => {
      if (!timeRange) return;
      
      // 同步 RSI 圖表
      if (rsiChartRef.current) {
        rsiChartRef.current.timeScale().setVisibleLogicalRange(timeRange);
      }
      
      // 同步 MACD 圖表
      if (macdChartRef.current) {
        macdChartRef.current.timeScale().setVisibleLogicalRange(timeRange);
      }
      
      // 同步成交量圖表
      if (volumeChartRef.current) {
        volumeChartRef.current.timeScale().setVisibleLogicalRange(timeRange);
      }
    });
    
    // 響應式調整大小
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const width = chartContainerRef.current.clientWidth;
        chartRef.current.applyOptions({ width });
      }
      
      if (rsiContainerRef.current && rsiChartRef.current) {
        const width = rsiContainerRef.current.clientWidth;
        rsiChartRef.current.applyOptions({ width });
      }
      
      if (macdContainerRef.current && macdChartRef.current) {
        const width = macdContainerRef.current.clientWidth;
        macdChartRef.current.applyOptions({ width });
      }
      
      if (volumeContainerRef.current && volumeChartRef.current) {
        const width = volumeContainerRef.current.clientWidth;
        volumeChartRef.current.applyOptions({ width });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) chartRef.current.remove();
      if (rsiChartRef.current) rsiChartRef.current.remove();
      if (macdChartRef.current) macdChartRef.current.remove();
      if (volumeChartRef.current) volumeChartRef.current.remove();
    };
  }, [data, settings]);
  
  return (
    <div className="w-full">
      {/* 主圖表 */}
      <div ref={chartContainerRef} className="w-full mb-1" style={{ height: '400px' }} />
      
      {/* RSI 技術指標圖表 */}
      <div className="mb-1">
        <div className="text-white text-sm pl-2 pb-1">RSI(14)</div>
        <div ref={rsiContainerRef} className="w-full" style={{ height: '150px' }} />
      </div>
      
      {/* MACD 技術指標圖表 */}
      <div className="mb-1">
        <div className="text-white text-sm pl-2 pb-1">MACD(12,26,9)</div>
        <div ref={macdContainerRef} className="w-full" style={{ height: '150px' }} />
      </div>
      
      {/* 成交量圖表 */}
      <div>
        <div className="text-white text-sm pl-2 pb-1">成交量</div>
        <div ref={volumeContainerRef} className="w-full" style={{ height: '150px' }} />
      </div>
    </div>
  );
}