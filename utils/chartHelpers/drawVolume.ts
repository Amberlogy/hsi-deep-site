// Volume (成交量) 繪製工具
// 輸入: 圖表實例、成交量數據、容器ID
// 輸出: 繪製完成的成交量圖表

import { IChartApi, LineStyle, createChart, ISeriesApi, HistogramData } from 'lightweight-charts';
import { ChartDataPoint } from '@/data/fakeChartData';

interface VolumeDrawOptions {
  height?: number;
  colors?: {
    up?: string;
    down?: string;
    background?: string;
    text?: string;
  };
}

// 默認配置
const defaultOptions: VolumeDrawOptions = {
  height: 150,
  colors: {
    up: '#26a69a',      // 上漲成交量顏色 (綠色)
    down: '#ef5350',    // 下跌成交量顏色 (紅色)
    background: '#131722', // 背景顏色
    text: '#d1d4dc',    // 文字顏色
  }
};

/**
 * 繪製成交量指標
 * @param container 容器ID或DOM元素
 * @param data 圖表數據
 * @param options 配置選項
 * @returns 返回圖表實例和繪製的系列
 */
export function drawVolume(
  container: string | HTMLElement,
  data: ChartDataPoint[],
  options: VolumeDrawOptions = {}
): { 
  chart: IChartApi; 
  series: ISeriesApi<"Histogram">; 
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

  // 格式化成交量數據
  const volumeData: HistogramData[] = data.map((item, index) => {
    // 確定漲跌 (與前一交易日相比)
    const isUp = index === 0 ? true : item.close >= data[index - 1].close;
    
    return {
      time: item.date,
      value: item.volume,
      color: isUp ? mergedOptions.colors!.up! : mergedOptions.colors!.down!
    };
  });

  // 添加成交量柱狀圖
  const volumeSeries = chart.addHistogramSeries({
    priceFormat: {
      type: 'volume',
      precision: 0,
    },
    title: '成交量',
  });
  
  volumeSeries.setData(volumeData);

  // 添加成交量平均線 (可選功能)
  // 計算5日平均成交量
  const avgPeriod = 5;
  if (data.length >= avgPeriod) {
    const avgVolumeData = [];
    
    for (let i = avgPeriod - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = 0; j < avgPeriod; j++) {
        sum += data[i - j].volume;
      }
      
      avgVolumeData.push({
        time: data[i].date,
        value: sum / avgPeriod
      });
    }
    
    // 添加平均成交量線
    const avgVolumeSeries = chart.addLineSeries({
      color: 'rgba(255, 255, 255, 0.5)',
      lineWidth: 1,
      priceFormat: {
        type: 'volume',
        precision: 0,
      },
      title: '5日均量',
    });
    
    avgVolumeSeries.setData(avgVolumeData);
  }

  return { chart, series: volumeSeries };
} 