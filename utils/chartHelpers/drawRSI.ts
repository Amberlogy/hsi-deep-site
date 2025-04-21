// RSI (相對強弱指標) 繪製工具
// 輸入: 圖表實例、RSI數據、容器ID
// 輸出: 繪製完成的RSI圖表

import { IChartApi, LineStyle, createChart, ISeriesApi, LineData, Time, SeriesOptionsMap, LineSeries, UTCTimestamp, DeepPartial, ChartOptions, PriceScaleOptions, SeriesType } from 'lightweight-charts';
import { ChartDataPoint } from '@/data/fakeChartData';

interface RSIChartColors {
  background: string;
  text: string;
  line?: string;
  overbought?: string;
  oversold?: string;
}

interface RSIOptions {
  colors: RSIChartColors;
  height?: number;
  overboughtLevel?: number;
  oversoldLevel?: number;
}

interface RSIResult {
  chart: IChartApi;
}

/**
 * 繪製 RSI 指標圖表
 * @param container - RSI 圖表容器元素
 * @param data - 圖表數據
 * @param options - 圖表配置選項
 * @returns 包含圖表實例的結果對象
 */
export function drawRSI(
  container: HTMLElement,
  data: ChartDataPoint[],
  options: RSIOptions
): RSIResult {
  // 預設配置
  const defaultOptions: Required<RSIOptions> = {
    colors: {
      background: '#131722',
      text: '#d1d4dc',
      line: '#f44336',
      overbought: 'rgba(242, 54, 69, 0.2)',
      oversold: 'rgba(8, 153, 129, 0.2)'
    },
    height: 150,
    overboughtLevel: 70,
    oversoldLevel: 30
  };
  
  // 合併用戶選項與預設選項
  const mergedOpts = {
    ...defaultOptions,
    ...options,
    colors: {
      ...defaultOptions.colors,
      ...options.colors
    }
  };
  
  // 圖表配置
  const chartOptions: DeepPartial<ChartOptions> = {
    height: mergedOpts.height,
    layout: {
      background: { color: mergedOpts.colors.background },
      textColor: mergedOpts.colors.text,
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
    },
    timeScale: {
      borderColor: 'rgba(197, 203, 206, 0.4)',
      timeVisible: true,
      secondsVisible: false,
    }
  };
  
  // 建立圖表
  const chart = createChart(container, chartOptions);
  
  // 設置 RSI 尺度範圍 (0-100)
  chart.priceScale('right').applyOptions({
    autoScale: false,
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
    entireTextOnly: true,
    minimumHeight: 1,
    mode: 2, // PriceScaleMode.Percentage
  } as DeepPartial<PriceScaleOptions>);
  
  // 建立 RSI 數據
  const rsiData = data
    .filter(item => item.rsi !== undefined)
    .map(item => ({
      time: new Date(item.date).getTime() / 1000 as UTCTimestamp,
      value: item.rsi || 50, // 默認值
    }));
  
  // 添加 RSI 線
  const rsiSeries = chart.addSeries(LineSeries, {
    color: mergedOpts.colors.line || '#f44336',
    lineWidth: 2,
    title: 'RSI-14',
    priceLineVisible: false,
    lastValueVisible: true,
  });
  rsiSeries.setData(rsiData);
  
  // 添加超買區域水平線
  const overboughtSeries = chart.addSeries(LineSeries, {
    color: 'rgba(197, 203, 206, 0.4)',
    lineWidth: 1,
    lineStyle: LineStyle.Dashed,
    priceLineVisible: false,
    lastValueVisible: false,
  });
  overboughtSeries.setData([
    { time: rsiData[0].time, value: mergedOpts.overboughtLevel },
    { time: rsiData[rsiData.length - 1].time, value: mergedOpts.overboughtLevel },
  ]);
  
  // 添加超賣區域水平線
  const oversoldSeries = chart.addSeries(LineSeries, {
    color: 'rgba(197, 203, 206, 0.4)',
    lineWidth: 1,
    lineStyle: LineStyle.Dashed,
    priceLineVisible: false,
    lastValueVisible: false,
  });
  oversoldSeries.setData([
    { time: rsiData[0].time, value: mergedOpts.oversoldLevel },
    { time: rsiData[rsiData.length - 1].time, value: mergedOpts.oversoldLevel },
  ]);
  
  // 調整圖表大小以適應容器
  const handleResize = () => {
    const { clientWidth } = container;
    chart.resize(clientWidth, mergedOpts.height);
  };
  
  // 初始自適應
  handleResize();
  
  return { chart };
} 