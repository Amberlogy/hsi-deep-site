'use client';

// 專業金融圖表元件 - 支援多種圖表類型和技術指標
// 輸入: 圖表設定與資料
// 輸出: 互動式金融圖表

import React, { useEffect, useState, useRef } from 'react';
import { 
  createChart, 
  IChartApi, 
  ISeriesApi, 
  UTCTimestamp, 
  CrosshairMode,
  LineStyle,
  PriceScaleMode,
} from 'lightweight-charts';
import { getFakeChartData, ChartDataPoint } from '@/data/fakeChartData';
import { drawRSI } from '@/utils/chartHelpers/drawRSI';
import { drawMACD } from '@/utils/chartHelpers/drawMACD';
import { drawVolume } from '@/utils/chartHelpers/drawVolume';

// 圖表設定類型
export interface ChartSettings {
  chartType: 'candlestick' | 'bar' | 'line' | 'area' | 'ohlc' | 'hlc';
  timeframe: string;
  mainIndicator: string;
  subCharts: string[];
}

// 元件屬性
interface OverviewChartProps {
  settings: ChartSettings;
}

// 圖表顏色配置
const chartColors = {
  backgroundColor: '#0D1037', // 深藍背景
  textColor: '#d1d4dc',
  upColor: '#26a69a',       // 漲綠
  downColor: '#ef5350',     // 跌紅
  borderUpColor: '#26a69a', 
  borderDownColor: '#ef5350',
  wickUpColor: '#26a69a',
  wickDownColor: '#ef5350',
  rsiLine: '#f44336',       // RSI紅線
  macdLine: '#2196f3',      // MACD快線藍色
  macdSignalLine: '#ff9800',// MACD慢線橙色
  macdHistogramUp: '#26a69a',// MACD柱狀圖上漲
  macdHistogramDown: '#ef5350',// MACD柱狀圖下跌
  volumeUp: '#26a69a',      // 成交量上漲
  volumeDown: '#ef5350',    // 成交量下跌
  sma20: '#f44336',         // 20日均線紅色
  sma50: '#2196f3'          // 50日均線藍色
};

// 主圖表組件
const OverviewChart: React.FC<OverviewChartProps> = ({ settings }) => {
  // 客戶端渲染檢查
  const [isClient, setIsClient] = useState(false);
  const [chartError, setChartError] = useState<Error | null>(null);
  
  // 圖表參考
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const rsiChartRef = useRef<HTMLDivElement>(null);
  const macdChartRef = useRef<HTMLDivElement>(null);
  const volumeChartRef = useRef<HTMLDivElement>(null);
  
  // 圖表實例引用
  const chartRef = useRef<IChartApi | null>(null);
  const rsiChartApiRef = useRef<IChartApi | null>(null);
  const macdChartApiRef = useRef<IChartApi | null>(null);
  const volumeChartApiRef = useRef<IChartApi | null>(null);
  
  // 圖表系列引用
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const barSeriesRef = useRef<ISeriesApi<'Bar'> | null>(null);
  const ohlcSeriesRef = useRef<ISeriesApi<'OHLC'> | null>(null);
  const sma20SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const sma50SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  
  // 在客戶端環境中設置標誌
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // 初始化並繪製圖表
  useEffect(() => {
    if (!isClient) return;
    
    const initializeCharts = async () => {
      try {
        // 清除現有圖表
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
        if (rsiChartApiRef.current) {
          rsiChartApiRef.current.remove();
          rsiChartApiRef.current = null;
        }
        if (macdChartApiRef.current) {
          macdChartApiRef.current.remove();
          macdChartApiRef.current = null;
        }
        if (volumeChartApiRef.current) {
          volumeChartApiRef.current.remove();
          volumeChartApiRef.current = null;
        }
        
        // 確保容器存在
        if (!chartContainerRef.current) {
          return;
        }
        
        // 獲取數據
        const chartData = getFakeChartData();
        
        // 設置主圖表高度
        const mainChartHeight = 400;
        
        // 建立主圖表
        const chart = createChart(chartContainerRef.current, {
          height: mainChartHeight,
          layout: {
            background: { color: chartColors.backgroundColor },
            textColor: chartColors.textColor,
          },
          grid: {
            vertLines: {
              color: 'rgba(42, 46, 57, 0.2)',
              style: LineStyle.Dotted,
            },
            horzLines: {
              color: 'rgba(42, 46, 57, 0.2)',
              style: LineStyle.Dotted,
            },
          },
          rightPriceScale: {
            borderColor: 'rgba(197, 203, 206, 0.4)',
            mode: PriceScaleMode.Normal,
          },
          timeScale: {
            borderColor: 'rgba(197, 203, 206, 0.4)',
            timeVisible: true,
            secondsVisible: false,
          },
          crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: {
              color: 'rgba(197, 203, 206, 0.4)',
              width: 1,
              style: LineStyle.Solid,
              labelBackgroundColor: '#0D1037',
            },
            horzLine: {
              color: 'rgba(197, 203, 206, 0.4)',
              width: 1,
              style: LineStyle.Solid,
              labelBackgroundColor: '#0D1037',
            },
          },
        });
        
        // 保存圖表實例
        chartRef.current = chart;
        
        // 格式化數據
        const formattedData = chartData.map(item => ({
          time: new Date(item.date).getTime() / 1000 as UTCTimestamp,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }));
        
        // 根據選定的圖表類型繪製
        switch (settings.chartType) {
          case 'candlestick':
            const candlestickSeries = chart.addCandlestickSeries({
              upColor: chartColors.upColor,
              downColor: chartColors.downColor,
              borderUpColor: chartColors.borderUpColor,
              borderDownColor: chartColors.borderDownColor,
              wickUpColor: chartColors.wickUpColor,
              wickDownColor: chartColors.wickDownColor,
            });
            candlestickSeries.setData(formattedData);
            candlestickSeriesRef.current = candlestickSeries;
            break;
          
          case 'line':
            const lineSeries = chart.addLineSeries({
              color: chartColors.sma20,
              lineWidth: 2,
            });
            
            // 線圖使用收盤價
            const lineData = chartData.map(item => ({
              time: new Date(item.date).getTime() / 1000 as UTCTimestamp,
              value: item.close,
            }));
            
            lineSeries.setData(lineData);
            lineSeriesRef.current = lineSeries;
            break;
          
          case 'area':
            const areaSeries = chart.addAreaSeries({
              topColor: `${chartColors.sma20}50`,
              bottomColor: `${chartColors.sma20}00`,
              lineColor: chartColors.sma20,
              lineWidth: 2,
            });
            
            // 區域圖使用收盤價
            const areaData = chartData.map(item => ({
              time: new Date(item.date).getTime() / 1000 as UTCTimestamp,
              value: item.close,
            }));
            
            areaSeries.setData(areaData);
            areaSeriesRef.current = areaSeries;
            break;
          
          case 'bar':
            const barSeries = chart.addBarSeries({
              upColor: chartColors.upColor,
              downColor: chartColors.downColor,
            });
            
            barSeries.setData(formattedData);
            barSeriesRef.current = barSeries;
            break;
          
          case 'ohlc':
          case 'hlc':
            const ohlcSeries = chart.addCandlestickSeries({
              upColor: 'rgba(0, 0, 0, 0)',  // 透明填充
              downColor: 'rgba(0, 0, 0, 0)',
              borderUpColor: chartColors.upColor,
              borderDownColor: chartColors.downColor,
              wickUpColor: chartColors.wickUpColor,
              wickDownColor: chartColors.wickDownColor,
            });
            
            // HLC模式下，開盤價設為高低價的中間值
            if (settings.chartType === 'hlc') {
              const hlcData = formattedData.map(item => ({
                ...item,
                open: (item.high + item.low) / 2,
              }));
              ohlcSeries.setData(hlcData);
            } else {
              ohlcSeries.setData(formattedData);
            }
            
            ohlcSeriesRef.current = ohlcSeries;
            break;
        }
        
        // 添加主圖指標
        if (settings.mainIndicator === 'sma') {
          // 添加20日均線
          const sma20Data = chartData.map(item => ({
            time: new Date(item.date).getTime() / 1000 as UTCTimestamp,
            value: item.sma20,
          }));
          
          const sma20Series = chart.addLineSeries({
            color: chartColors.sma20,
            lineWidth: 1,
            title: 'SMA20',
          });
          sma20Series.setData(sma20Data);
          sma20SeriesRef.current = sma20Series;
          
          // 添加50日均線
          const sma50Data = chartData.map(item => ({
            time: new Date(item.date).getTime() / 1000 as UTCTimestamp,
            value: item.sma50,
          }));
          
          const sma50Series = chart.addLineSeries({
            color: chartColors.sma50,
            lineWidth: 1,
            title: 'SMA50',
          });
          sma50Series.setData(sma50Data);
          sma50SeriesRef.current = sma50Series;
        }
        
        // 添加副圖
        const subCharts = settings.subCharts;
        const chartElements = [
          { id: 'RSI', ref: rsiChartRef, drawFn: drawRSI, apiRef: rsiChartApiRef },
          { id: 'MACD', ref: macdChartRef, drawFn: drawMACD, apiRef: macdChartApiRef },
          { id: 'Volume', ref: volumeChartRef, drawFn: drawVolume, apiRef: volumeChartApiRef },
        ];
        
        for (const element of chartElements) {
          if (subCharts.includes(element.id) && element.ref.current) {
            const { chart: subChart } = element.drawFn(element.ref.current, chartData, {
              colors: {
                background: chartColors.backgroundColor,
                text: chartColors.textColor,
              }
            });
            element.apiRef.current = subChart;
            
            // 將副圖的時間軸綁定到主圖表
            chart.timeScale().subscribeVisibleTimeRangeChange(timeRange => {
              if (timeRange && subChart) {
                subChart.timeScale().setVisibleRange(timeRange);
              }
            });
            
            // 將副圖的十字線綁定到主圖表
            chart.subscribeCrosshairMove(param => {
              if (param && param.time && subChart) {
                subChart.setCrosshairPosition(
                  param.time as UTCTimestamp, 
                  param.point?.y || 0
                );
              }
            });
          }
        }
        
        // 圖表響應式調整
        const handleResize = () => {
          if (chartContainerRef.current && chart) {
            chart.applyOptions({ 
              width: chartContainerRef.current.clientWidth 
            });
            
            // 調整副圖表寬度
            for (const element of chartElements) {
              if (element.apiRef.current && element.ref.current) {
                element.apiRef.current.applyOptions({
                  width: element.ref.current.clientWidth
                });
              }
            }
          }
        };
        
        // 初始調整
        handleResize();
        
        // 監聽視窗大小變化
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
        
      } catch (error) {
        console.error("Failed to initialize chart:", error);
        setChartError(error as Error);
      }
    };
    
    initializeCharts();
    
    // 清理函數
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      if (rsiChartApiRef.current) {
        rsiChartApiRef.current.remove();
        rsiChartApiRef.current = null;
      }
      if (macdChartApiRef.current) {
        macdChartApiRef.current.remove();
        macdChartApiRef.current = null;
      }
      if (volumeChartApiRef.current) {
        volumeChartApiRef.current.remove();
        volumeChartApiRef.current = null;
      }
    };
  }, [isClient, settings]);
  
  // 如果不是客戶端環境，返回空白區域
  if (!isClient) return <div className="w-full h-[600px] bg-[#0D1037]"></div>;
  
  // 如果發生錯誤，顯示錯誤訊息
  if (chartError) {
    return (
      <div className="w-full h-[600px] bg-[#0D1037] rounded-lg overflow-hidden flex justify-center items-center">
        <div className="text-white text-center p-8">
          <h3 className="text-xl mb-2">圖表渲染錯誤</h3>
          <p>{chartError.message}</p>
          <button 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            onClick={() => setChartError(null)}
          >
            重試
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col w-full bg-[#0D1037] rounded-lg overflow-hidden">
      {/* 主圖表 */}
      <div className="w-full" ref={chartContainerRef} />
      
      {/* 副圖表 - 根據設定顯示 */}
      {settings.subCharts.includes('RSI') && (
        <div className="w-full mt-1" ref={rsiChartRef} />
      )}
      
      {settings.subCharts.includes('MACD') && (
        <div className="w-full mt-1" ref={macdChartRef} />
      )}
      
      {settings.subCharts.includes('Volume') && (
        <div className="w-full mt-1" ref={volumeChartRef} />
      )}
    </div>
  );
};

export default OverviewChart; 