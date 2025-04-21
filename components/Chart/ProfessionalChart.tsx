'use client';

// 專業金融圖表元件 - 符合 AASTOCKS 風格
// 輸入: 圖表設定與資料
// 輸出: 互動式金融圖表

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  createChart, 
  IChartApi, 
  ISeriesApi, 
  UTCTimestamp, 
  CrosshairMode,
  LineStyle,
  PriceScaleMode,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  BarSeries,
  HistogramSeries,
  Time,
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
interface ProfessionalChartProps {
  settings: ChartSettings;
  data?: ChartDataPoint[]; // 可選數據屬性
}

// 圖表顏色配置 - AASTOCKS 風格
const chartColors = {
  backgroundColor: '#0D1037', // 深藍背景
  textColor: '#d1d4dc',       // 文字顏色
  upColor: '#26a69a',         // 漲綠
  downColor: '#ef5350',       // 跌紅
  borderUpColor: '#26a69a',   // 上漲K線邊框
  borderDownColor: '#ef5350', // 下跌K線邊框
  wickUpColor: '#26a69a',     // 上漲K線影線
  wickDownColor: '#ef5350',   // 下跌K線影線
  lineColor: '#FFFFFF',       // 收盤線顏色 (白色)
  rsiLine: '#f44336',         // RSI紅線
  macdLine: '#2196f3',        // MACD快線藍色
  macdSignalLine: '#ff9800',  // MACD慢線橙色
  macdHistogramUp: '#26a69a', // MACD柱狀圖上漲
  macdHistogramDown: '#ef5350',// MACD柱狀圖下跌
  volumeUp: '#26a69a',        // 成交量上漲
  volumeDown: '#ef5350',      // 成交量下跌
  sma20: '#f44336',           // 20日均線紅色
  sma50: '#2196f3'            // 50日均線藍色
};

/**
 * 專業金融圖表元件
 * 支援多種圖表類型和技術指標
 */
const ProfessionalChart: React.FC<ProfessionalChartProps> = ({ settings, data }) => {
  // 客戶端渲染檢查
  const [isClient, setIsClient] = useState(false);
  const [chartError, setChartError] = useState<Error | null>(null);
  
  // 主圖表參考
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // 副圖表參考
  const rsiChartRef = useRef<HTMLDivElement>(null);
  const macdChartRef = useRef<HTMLDivElement>(null);
  const volumeChartRef = useRef<HTMLDivElement>(null);
  
  // 圖表實例引用
  const chartRef = useRef<IChartApi | null>(null);
  const rsiChartApiRef = useRef<IChartApi | null>(null);
  const macdChartApiRef = useRef<IChartApi | null>(null);
  const volumeChartApiRef = useRef<IChartApi | null>(null);
  
  // 圖表系列引用
  const mainSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const sma20SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const sma50SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  
  // 確保只在客戶端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // 處理視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        const width = chartContainerRef.current.clientWidth;
        chartRef.current.resize(width, chartRef.current.options().height);
      }
      if (rsiChartApiRef.current && rsiChartRef.current) {
        const width = rsiChartRef.current.clientWidth;
        rsiChartApiRef.current.resize(width, rsiChartApiRef.current.options().height);
      }
      if (macdChartApiRef.current && macdChartRef.current) {
        const width = macdChartRef.current.clientWidth;
        macdChartApiRef.current.resize(width, macdChartApiRef.current.options().height);
      }
      if (volumeChartApiRef.current && volumeChartRef.current) {
        const width = volumeChartRef.current.clientWidth;
        volumeChartApiRef.current.resize(width, volumeChartApiRef.current.options().height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 同步時間尺度
  const syncTimeScales = useCallback(() => {
    if (!chartRef.current) return;
    
    const mainTimeScale = chartRef.current.timeScale();
    
    [rsiChartApiRef, macdChartApiRef, volumeChartApiRef].forEach(ref => {
      if (ref.current) {
        const subTimeScale = ref.current.timeScale();
        
        // 同步可見範圍
        const logicalRange = mainTimeScale.getVisibleLogicalRange();
        if (logicalRange) {
          subTimeScale.setVisibleLogicalRange(logicalRange);
        }
        
        // 綁定時間尺度事件
        mainTimeScale.subscribeVisibleLogicalRangeChange(() => {
          if (ref.current) {
            const logicalRange = mainTimeScale.getVisibleLogicalRange();
            if (logicalRange) {
              ref.current.timeScale().setVisibleLogicalRange(logicalRange);
            }
          }
        });
      }
    });
  }, []);
  
  // 初始化所有圖表
  useEffect(() => {
    if (!isClient) return;
    
    const initializeCharts = async () => {
      try {
        // 清除現有圖表實例
        [chartRef, rsiChartApiRef, macdChartApiRef, volumeChartApiRef].forEach(ref => {
          if (ref.current) {
            ref.current.remove();
            ref.current = null;
          }
        });
        
        // 獲取數據
        const chartData = data || getFakeChartData();
        
        // 初始化主圖表的內部函數
        const initializeMainChartInternal = (chartData: ChartDataPoint[]) => {
          if (!chartContainerRef.current) return null;
          
          // 清除現有圖表
          if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
          }
          
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
                labelBackgroundColor: chartColors.backgroundColor,
              },
              horzLine: {
                color: 'rgba(197, 203, 206, 0.4)',
                width: 1,
                style: LineStyle.Solid,
                labelBackgroundColor: chartColors.backgroundColor,
              },
            },
          });
          
          // 保存圖表實例
          chartRef.current = chart;
          
          // 格式化OHLC數據
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
              const candlestickSeries = chart.addSeries(CandlestickSeries, {
                upColor: chartColors.upColor,
                downColor: chartColors.downColor,
                borderUpColor: chartColors.borderUpColor,
                borderDownColor: chartColors.borderDownColor,
                wickUpColor: chartColors.wickUpColor,
                wickDownColor: chartColors.wickDownColor,
              });
              candlestickSeries.setData(formattedData);
              mainSeriesRef.current = candlestickSeries;
              break;
            
            case 'line':
              const lineSeries = chart.addSeries(LineSeries, {
                color: chartColors.lineColor,
                lineWidth: 2,
              });
              
              // 線圖使用收盤價
              const lineData = chartData.map(item => ({
                time: new Date(item.date).getTime() / 1000 as UTCTimestamp,
                value: item.close,
              }));
              
              lineSeries.setData(lineData);
              mainSeriesRef.current = lineSeries;
              break;
            
            case 'area':
              const areaSeries = chart.addSeries(AreaSeries, {
                topColor: `${chartColors.lineColor}50`,
                bottomColor: `${chartColors.lineColor}00`,
                lineColor: chartColors.lineColor,
                lineWidth: 2,
              });
              
              // 區域圖使用收盤價
              const areaData = chartData.map(item => ({
                time: new Date(item.date).getTime() / 1000 as UTCTimestamp,
                value: item.close,
              }));
              
              areaSeries.setData(areaData);
              mainSeriesRef.current = areaSeries;
              break;
            
            case 'bar':
              const barSeries = chart.addSeries(BarSeries, {
                upColor: chartColors.upColor,
                downColor: chartColors.downColor,
              });
              
              barSeries.setData(formattedData);
              mainSeriesRef.current = barSeries;
              break;
            
            case 'ohlc':
            case 'hlc':
              const ohlcSeries = chart.addSeries(CandlestickSeries, {
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
              
              mainSeriesRef.current = ohlcSeries;
              break;
          }
          
          // 添加主圖指標 (例如移動平均線)
          if (settings.mainIndicator === 'sma') {
            // 添加20日均線
            const sma20Data = chartData.map(item => ({
              time: new Date(item.date).getTime() / 1000 as UTCTimestamp,
              value: item.sma20,
            }));
            
            const sma20Series = chart.addSeries(LineSeries, {
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
            
            const sma50Series = chart.addSeries(LineSeries, {
              color: chartColors.sma50,
              lineWidth: 1,
              title: 'SMA50',
            });
            sma50Series.setData(sma50Data);
            sma50SeriesRef.current = sma50Series;
          }
          
          return chart;
        };
        
        // 初始化主圖表
        initializeMainChartInternal(chartData);
        
        // 處理副圖 (技術指標)
        const subCharts = settings.subCharts || [];
        
        // 創建技術指標圖表
        if (subCharts.includes('RSI') && rsiChartRef.current) {
          const { chart } = drawRSI(rsiChartRef.current, chartData, {
            colors: {
              line: chartColors.rsiLine,
              background: chartColors.backgroundColor,
              text: chartColors.textColor,
            }
          });
          rsiChartApiRef.current = chart;
        }
        
        if (subCharts.includes('MACD') && macdChartRef.current) {
          const { chart } = drawMACD(macdChartRef.current, chartData, {
            colors: {
              macd: chartColors.macdLine,
              signal: chartColors.macdSignalLine,
              histogramUp: chartColors.macdHistogramUp,
              histogramDown: chartColors.macdHistogramDown,
              background: chartColors.backgroundColor,
              text: chartColors.textColor,
            }
          });
          macdChartApiRef.current = chart;
        }
        
        if (subCharts.includes('Volume') && volumeChartRef.current) {
          const { chart } = drawVolume(volumeChartRef.current, chartData, {
            colors: {
              up: chartColors.volumeUp,
              down: chartColors.volumeDown,
              background: chartColors.backgroundColor,
              text: chartColors.textColor,
            }
          });
          volumeChartApiRef.current = chart;
        }
        
        // 同步所有圖表的時間尺度
        syncTimeScales();
        
      } catch (error) {
        if (error instanceof Error) {
          console.error('圖表初始化錯誤:', error);
          setChartError(error);
        }
      }
    };
    
    initializeCharts();
    
    // 組件卸載時清理圖表實例
    return () => {
      [chartRef, rsiChartApiRef, macdChartApiRef, volumeChartApiRef].forEach(ref => {
        if (ref.current) {
          ref.current.remove();
          ref.current = null;
        }
      });
    };
  }, [isClient, settings, data, syncTimeScales]);
  
  // 如果出現錯誤，顯示錯誤信息
  if (chartError) {
    return <div className="text-red-500 p-4 bg-gray-800 rounded">圖表載入錯誤: {chartError.message}</div>;
  }
  
  return (
    <div className="professional-chart w-full">
      {/* 主圖表容器 */}
      <div ref={chartContainerRef} className="w-full main-chart-container" />
      
      {/* 技術指標區 */}
      <div className="indicators-container w-full">
        {/* RSI 指標 */}
        {settings.subCharts?.includes('RSI') && (
          <div ref={rsiChartRef} className="w-full indicator-chart" />
        )}
        
        {/* MACD 指標 */}
        {settings.subCharts?.includes('MACD') && (
          <div ref={macdChartRef} className="w-full indicator-chart" />
        )}
        
        {/* 成交量 */}
        {settings.subCharts?.includes('Volume') && (
          <div ref={volumeChartRef} className="w-full indicator-chart" />
        )}
      </div>
    </div>
  );
};

export default ProfessionalChart;
