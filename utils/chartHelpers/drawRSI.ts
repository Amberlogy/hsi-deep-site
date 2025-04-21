// RSI (相對強弱指標) 繪製工具
// 輸入: 圖表實例、RSI數據、容器ID
// 輸出: 繪製完成的RSI圖表

import { IChartApi, LineStyle, createChart, ISeriesApi, LineData } from 'lightweight-charts';
import { ChartDataPoint } from '@/data/fakeChartData';

interface RSIDrawOptions {
  height?: number;
  colors?: {
    line?: string;
    overSold?: string;
    overBought?: string;
    background?: string;
    text?: string;
  };
  levels?: {
    overBought?: number;
    overSold?: number;
  };
}

// 默認配置
const defaultOptions: RSIDrawOptions = {
  height: 150,
  colors: {
    line: '#f44336',        // RSI線顏色
    overSold: '#990000',    // 超賣區域顏色
    overBought: '#000099',  // 超買區域顏色
    background: '#131722',  // 背景顏色
    text: '#d1d4dc',        // 文字顏色
  },
  levels: {
    overBought: 70,
    overSold: 30,
  }
};

/**
 * 繪製RSI指標
 * @param container 容器ID或DOM元素
 * @param data 圖表數據
 * @param options 配置選項
 * @returns 返回圖表實例和繪製的系列
 */
export function drawRSI(
  container: string | HTMLElement,
  data: ChartDataPoint[],
  options: RSIDrawOptions = {}
): { chart: IChartApi; series: ISeriesApi<"Line"> } {
  // 合併選項
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    colors: { ...defaultOptions.colors, ...options.colors },
    levels: { ...defaultOptions.levels, ...options.levels },
  };

  // 創建圖表
  const chart = createChart(container, {
    height: mergedOptions.height,
    layout: {
      background: { color: mergedOptions.colors!.background! },
      textColor: mergedOptions.colors!.text!,
    },
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
      borderVisible: false,
    },
    timeScale: {
      borderVisible: false,
      fixLeftEdge: true,
      fixRightEdge: true,
    },
    grid: {
      horzLines: {
        color: 'rgba(42, 46, 57, 0.2)',
        style: LineStyle.Dotted,
      },
      vertLines: {
        color: 'rgba(42, 46, 57, 0.2)',
        style: LineStyle.Dotted,
      },
    },
    crosshair: {
      mode: 0, // 設置為0，因為主圖表會處理十字線
    },
  });

  // 格式化RSI數據
  const rsiData: LineData[] = data.map(item => ({
    time: new Date(item.date).getTime() / 1000,
    value: item.rsi
  }));

  // 添加RSI線
  const rsiSeries = chart.addLineSeries({
    color: mergedOptions.colors!.line!,
    lineWidth: 2,
    priceFormat: {
      type: 'price',
      precision: 2,
      minMove: 0.01,
    },
    title: 'RSI(14)',
  });
  rsiSeries.setData(rsiData);

  // 添加超買/超賣水平線
  const overBoughtLine = chart.addLineSeries({
    color: mergedOptions.colors!.overBought!,
    lineWidth: 1,
    lineStyle: LineStyle.Dashed,
    priceFormat: {
      type: 'price',
      precision: 0,
      minMove: 1,
    },
    lastValueVisible: false,
    title: '',
  });
  
  const overSoldLine = chart.addLineSeries({
    color: mergedOptions.colors!.overSold!,
    lineWidth: 1,
    lineStyle: LineStyle.Dashed,
    priceFormat: {
      type: 'price',
      precision: 0,
      minMove: 1,
    },
    lastValueVisible: false,
    title: '',
  });

  // 設置超買/超賣水平線數據
  const horizontalLinesData = data.map(item => ({
    time: new Date(item.date).getTime() / 1000,
  }));

  overBoughtLine.setData(horizontalLinesData.map(item => ({
    ...item,
    value: mergedOptions.levels!.overBought!
  })));
  
  overSoldLine.setData(horizontalLinesData.map(item => ({
    ...item,
    value: mergedOptions.levels!.overSold!
  })));

  return { chart, series: rsiSeries };
} 