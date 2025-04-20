'use client';

// 專業金融圖表元件 - 支援多種圖表類型和技術指標
// 輸入: 圖表設定與資料
// 輸出: 互動式金融圖表

import React, { useEffect, useState } from 'react';
import {
  ChartCanvas,
  Chart,
  CandlestickSeries,
  LineSeries,
  BarSeries,
  AreaSeries,
  OHLCSeries,
  discontinuousTimeScaleProviderBuilder,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  MovingAverageTooltip,
  MACDSeries,
  RSISeries,
  macd,
  rsi,
  sma,
  ema
} from "react-financial-charts";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import type { ChartDataPoint } from '@/data/fakeChartData';

// 圖表設定類型
export interface ChartSettings {
  chartType: 'candlestick' | 'bar' | 'line' | 'area' | 'ohlc' | 'hlc';
  timeframe: string;
  mainIndicator: string;
  subCharts: string[];
}

// 元件屬性
interface OverviewChartProps {
  data: ChartDataPoint[]; 
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

// 格式化函數
const dateFormat = timeFormat("%Y-%m-%d");
const numberFormat = format(".2f");
const volumeFormat = format(".0s");

// 主圖表組件
const OverviewChart: React.FC<OverviewChartProps> = ({ data, settings }) => {
  // 客戶端渲染檢查
  const [isClient, setIsClient] = useState(false);
  
  // 在客戶端環境中設置標誌
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 如果不是客戶端環境，返回空白區域
  if (!isClient) return <div className="w-full h-[600px] bg-[#0D1037]"></div>;

  // 轉換數據格式
  const chartData = data.map((d) => ({
    date: new Date(d.date),
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
    volume: d.volume,
    rsi: d.rsi,
    macd: d.macd,
    macdSignal: d.macdSignal,
    macdHistogram: d.macdHistogram,
    sma20: d.sma20,
    sma50: d.sma50,
  }));

  // 設定圖表區域高度比例
  const mainChartHeight = 360;
  const indicatorHeight = 80;
  const marginTop = 30;
  const marginRight = 50;
  const marginBottom = 25;
  const marginLeft = 50;
  
  // 使用固定尺寸
  const width = 1000;
  const height = 600;

  // 計算技術指標
  const sma20Calculator = sma()
    .options({ windowSize: 20 })
    .merge((d: any, c: any) => { d.sma20 = c; })
    .accessor((d: any) => d.sma20);

  const sma50Calculator = sma()
    .options({ windowSize: 50 })
    .merge((d: any, c: any) => { d.sma50 = c; })
    .accessor((d: any) => d.sma50);

  const rsiCalculator = rsi()
    .options({ windowSize: 14 })
    .merge((d: any, c: any) => { d.rsi = c; })
    .accessor((d: any) => d.rsi);

  const macdCalculator = macd()
    .options({
      fast: 12,
      slow: 26,
      signal: 9,
    })
    .merge((d: any, c: any) => { d.macd = c; })
    .accessor((d: any) => d.macd);

  // 設定時間軸
  const xScaleProvider = discontinuousTimeScaleProviderBuilder()
    .inputDateAccessor((d: any) => d.date);
  
  const { data: xScaleData, xScale, xAccessor, displayXAccessor } = xScaleProvider(chartData);

  // 獲取可視區域的數據範圍
  const xExtents = [
    xAccessor(xScaleData[Math.max(0, xScaleData.length - 120)]), // 初始顯示最近120個數據點
    xAccessor(xScaleData[xScaleData.length - 1])
  ];

  // 根據設定顯示指標
  const showRSI = settings.subCharts.includes('RSI');
  const showMACD = settings.subCharts.includes('MACD');
  const showVolume = settings.subCharts.includes('Volume');
  
  // 獲取主圖指標狀態
  const showSMA = settings.mainIndicator === 'sma';
  const showEMA = settings.mainIndicator === 'ema';

  // 定義成交量柱顏色
  const volumeColor = (d: any) => {
    return d.close >= d.open ? chartColors.volumeUp : chartColors.volumeDown;
  };

  // 蠟燭圖顏色
  const candlesAppearance = {
    wickStroke: (d: any) => d.close >= d.open ? chartColors.wickUpColor : chartColors.wickDownColor,
    fill: (d: any) => d.close >= d.open ? chartColors.upColor : chartColors.downColor,
    stroke: (d: any) => d.close >= d.open ? chartColors.borderUpColor : chartColors.borderDownColor,
    candleStrokeWidth: 1,
    widthRatio: 0.6,
  };

  return (
    <div className="w-full h-[600px] bg-[#0D1037] rounded-lg overflow-hidden flex justify-center">
      <ChartCanvas
        height={height}
        width={width}
        ratio={1}
        margin={{ left: marginLeft, right: marginRight, top: marginTop, bottom: marginBottom }}
        seriesName="HSI Chart"
        data={xScaleData}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
      >
        {/* 主圖 */}
        <Chart
          id={1}
          height={mainChartHeight}
          yExtents={(d: any) => [d.high, d.low]}
          padding={{ top: 10, bottom: 20 }}
        >
          <XAxis showTicks={false} showTickLabel={false} />
          <YAxis ticks={10} tickFormat={numberFormat} />
          <MouseCoordinateY rectWidth={marginRight} displayFormat={numberFormat} />

          {/* 根據設定選擇圖表類型 */}
          {settings.chartType === 'candlestick' && (
            <CandlestickSeries {...candlesAppearance} />
          )}
          {settings.chartType === 'bar' && (
            <BarSeries 
              yAccessor={(d: any) => d.close} 
              strokeStyle="#000000"
            />
          )}
          {settings.chartType === 'line' && (
            <LineSeries 
              yAccessor={(d: any) => d.close} 
              strokeStyle={chartColors.sma20} 
              strokeWidth={2} 
            />
          )}
          {settings.chartType === 'area' && (
            <AreaSeries 
              yAccessor={(d: any) => d.close} 
              fillStyle="rgba(38, 166, 154, 0.3)" 
              strokeStyle={chartColors.upColor} 
              strokeWidth={2} 
            />
          )}
          {settings.chartType === 'ohlc' && (
            <OHLCSeries 
              yAccessor={(d: any) => ({ open: d.open, high: d.high, low: d.low, close: d.close })}
            />
          )}
          {settings.chartType === 'hlc' && (
            <OHLCSeries 
              yAccessor={(d: any) => ({ open: d.open, high: d.high, low: d.low, close: d.close })}
            />
          )}

          {/* 移動平均線 */}
          {showSMA && (
            <>
              <LineSeries
                yAccessor={sma20Calculator.accessor()}
                strokeStyle={chartColors.sma20}
                strokeWidth={1}
              />
              <LineSeries
                yAccessor={sma50Calculator.accessor()}
                strokeStyle={chartColors.sma50}
                strokeWidth={1}
              />
            </>
          )}

          {/* 價格標籤 */}
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={(d: any) => d.close}
            fill={(d: any) => d.close >= d.open ? chartColors.upColor : chartColors.downColor}
            lineStroke="#fff"
            fontSize={12}
          />

          {/* 移動平均線提示 */}
          {showSMA && (
            <MovingAverageTooltip
              origin={[8, 8]}
              options={[
                {
                  yAccessor: sma20Calculator.accessor(),
                  type: "SMA",
                  stroke: chartColors.sma20,
                  windowSize: 20,
                },
                {
                  yAccessor: sma50Calculator.accessor(),
                  type: "SMA",
                  stroke: chartColors.sma50,
                  windowSize: 50,
                },
              ]}
            />
          )}
        </Chart>

        {/* RSI 指標 */}
        {showRSI && (
          <Chart
            id={2}
            height={indicatorHeight}
            origin={(w, h) => [0, mainChartHeight + marginTop]}
            yExtents={rsiCalculator.accessor()}
            padding={{ top: 8, bottom: 8 }}
          >
            <XAxis showTicks={false} showTickLabel={false} />
            <YAxis ticks={5} tickValues={[30, 50, 70]} />
            <MouseCoordinateY rectWidth={marginRight} displayFormat={numberFormat} />

            <RSISeries
              yAccessor={rsiCalculator.accessor()}
              strokeStyle={{
                line: chartColors.rsiLine,
                top: "#8A0000",
                middle: "#000000",
                bottom: "#0000A5",
                outsideThreshold: "rgba(255, 0, 0, 0.2)",
                insideThreshold: "rgba(0, 0, 255, 0.2)"
              }}
            />

            <EdgeIndicator
              itemType="last"
              orient="right"
              edgeAt="right"
              yAccessor={rsiCalculator.accessor()}
              fill={chartColors.rsiLine}
              lineStroke="#fff"
              fontSize={12}
            />
          </Chart>
        )}

        {/* MACD 指標 */}
        {showMACD && (
          <Chart
            id={3}
            height={indicatorHeight}
            origin={(w, h) => [0, mainChartHeight + (showRSI ? indicatorHeight : 0) + marginTop]}
            yExtents={macdCalculator.accessor()}
            padding={{ top: 8, bottom: 8 }}
          >
            <XAxis showTicks={false} showTickLabel={false} />
            <YAxis ticks={5} />
            <MouseCoordinateY rectWidth={marginRight} displayFormat={numberFormat} />

            <MACDSeries
              yAccessor={macdCalculator.accessor()}
              {...macdCalculator.options()}
              strokeStyle={{
                macd: chartColors.macdLine,
                signal: chartColors.macdSignalLine,
                zero: "#000000"
              }}
              fillStyle={{
                divergence: "rgba(38, 166, 154, 0.5)"
              }}
            />

            <EdgeIndicator
              itemType="last"
              orient="right"
              edgeAt="right"
              yAccessor={(d: any) => d.macd}
              fill={chartColors.macdLine}
              lineStroke="#fff"
              fontSize={12}
            />
            <EdgeIndicator
              itemType="last"
              orient="right"
              edgeAt="right"
              yAccessor={(d: any) => d.macdSignal}
              fill={chartColors.macdSignalLine}
              lineStroke="#fff"
              fontSize={12}
            />
          </Chart>
        )}

        {/* 成交量指標 */}
        {showVolume && (
          <Chart
            id={4}
            height={indicatorHeight}
            origin={(w, h) => [
              0,
              mainChartHeight +
                (showRSI ? indicatorHeight : 0) +
                (showMACD ? indicatorHeight : 0) +
                marginTop,
            ]}
            yExtents={(d: any) => d.volume}
            padding={{ top: 8, bottom: 8 }}
          >
            <XAxis tickFormat={timeFormat("%m/%d")} />
            <YAxis ticks={5} tickFormat={volumeFormat} />
            <MouseCoordinateY rectWidth={marginRight} displayFormat={volumeFormat} />

            <BarSeries
              yAccessor={(d: any) => d.volume}
              fillStyle={volumeColor}
              strokeStyle="#000000"
            />

            <EdgeIndicator
              itemType="last"
              orient="right"
              edgeAt="right"
              yAccessor={(d: any) => d.volume}
              fill={chartColors.volumeUp}
              lineStroke="#fff"
              fontSize={12}
              displayFormat={volumeFormat}
            />
          </Chart>
        )}

        {/* 十字游標 */}
        <CrossHairCursor strokeStyle="#FFFFFF" />
        <MouseCoordinateX displayFormat={dateFormat} />
      </ChartCanvas>
    </div>
  );
};

export default OverviewChart; 