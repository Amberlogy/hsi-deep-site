// MACD (移動平均線匯聚/發散指標) 繪製工具
// 輸入: 圖表實例、MACD數據、容器ID
// 輸出: 繪製完成的MACD圖表

import { IChartApi, LineStyle, createChart, ISeriesApi, HistogramData } from 'lightweight-charts';
import { ChartDataPoint } from '@/data/fakeChartData';

interface MACDDrawOptions {
  height?: number;
  colors?: {
    macd?: string;
    signal?: string;
    histogramUp?: string;
    histogramDown?: string;
    background?: string;
    text?: string;
  };
}

// 默認配置
const defaultOptions: MACDDrawOptions = {
  height: 150,
  colors: {
    macd: '#2196f3',          // MACD線顏色 (藍色)
    signal: '#ff9800',         // 信號線顏色 (橙色)
    histogramUp: '#26a69a',    // 柱狀圖上漲顏色 (綠色)
    histogramDown: '#ef5350',  // 柱狀圖下跌顏色 (紅色)
    background: '#131722',     // 背景顏色
    text: '#d1d4dc',           // 文字顏色
  }
};

/**
 * 繪製MACD指標
 * @param container 容器ID或DOM元素
 * @param data 圖表數據
 * @param options 配置選項
 * @returns 返回圖表實例和繪製的系列
 */
export function drawMACD(
  container: string | HTMLElement,
  data: ChartDataPoint[],
  options: MACDDrawOptions = {}
): { 
  chart: IChartApi; 
  macdSeries: ISeriesApi<"Line">; 
  signalSeries: ISeriesApi<"Line">;
  histogramSeries: ISeriesApi<"Histogram">;
} {
  // 合併選項
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    colors: { ...defaultOptions.colors, ...options.colors },
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

  // 格式化MACD數據
  const macdLineData = data.map(item => ({
    time: item.date,
    value: item.macd
  }));

  const signalLineData = data.map(item => ({
    time: item.date,
    value: item.macdSignal
  }));

  const histogramData: HistogramData[] = data.map(item => ({
    time: item.date,
    value: item.macdHistogram,
    color: item.macdHistogram >= 0 
      ? mergedOptions.colors!.histogramUp! 
      : mergedOptions.colors!.histogramDown!
  }));

  // 添加MACD線
  const macdSeries = chart.addLineSeries({
    color: mergedOptions.colors!.macd!,
    lineWidth: 2,
    priceFormat: {
      type: 'price',
      precision: 2,
      minMove: 0.01,
    },
    title: 'MACD',
  });
  macdSeries.setData(macdLineData);

  // 添加Signal線
  const signalSeries = chart.addLineSeries({
    color: mergedOptions.colors!.signal!,
    lineWidth: 2,
    priceFormat: {
      type: 'price',
      precision: 2,
      minMove: 0.01,
    },
    title: 'Signal',
  });
  signalSeries.setData(signalLineData);

  // 添加柱狀圖
  const histogramSeries = chart.addHistogramSeries({
    priceFormat: {
      type: 'price',
      precision: 2,
      minMove: 0.01,
    },
    title: 'Histogram',
  });
  histogramSeries.setData(histogramData);

  // 添加零線
  const zeroLineSeries = chart.addLineSeries({
    color: 'rgba(255, 255, 255, 0.3)',
    lineWidth: 1,
    lineStyle: LineStyle.Dashed,
    priceFormat: {
      type: 'price',
      precision: 2,
      minMove: 0.01,
    },
    lastValueVisible: false,
    title: '',
  });
  
  // 設置零線數據
  const zeroLineData = data.map(item => ({
    time: item.date,
    value: 0
  }));
  
  zeroLineSeries.setData(zeroLineData);

  return { 
    chart, 
    macdSeries, 
    signalSeries, 
    histogramSeries 
  };
} 