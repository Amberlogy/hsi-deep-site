'use client'

import React, { useEffect, useRef } from 'react'
import { 
  createChart,
  ColorType,
  LineStyle,
  SeriesType
} from 'lightweight-charts'
import { getFakeChartData } from '@/data/fakeChartData'

// 定義資料項目的介面
interface ChartDataItem {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  sma20: number;
  sma50: number;
  volume?: number;
}

export default function OverviewChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // 建立圖表實例
    const chart = createChart(chartContainerRef.current, {
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
      timeScale: { borderColor: '#71649C' },
      rightPriceScale: { borderColor: '#71649C' },
      crosshair: {
        mode: 1,
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
    })

    // 取得圖表數據
    const chartData = getFakeChartData()

    // 陰陽燭圖資料
    // @ts-ignore - 我們知道這個方法在 API 中確實存在
    const candleSeries = chart.addSeries('candlestick', {
      upColor: '#00ff00',
      downColor: '#ff0000',
      borderVisible: false,
      wickUpColor: '#00ff00',
      wickDownColor: '#ff0000',
    })

    const candleData = chartData.map((item: ChartDataItem) => ({
      time: item.date as string,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }))

    candleSeries.setData(candleData)

    // SMA20
    // @ts-ignore - 我們知道這個方法在 API 中確實存在
    const sma20Series = chart.addSeries('line', {
      color: '#FFA500',
      lineWidth: 1,
    })

    sma20Series.setData(
      chartData.map((d: ChartDataItem) => ({
        time: d.date as string,
        value: d.sma20,
      }))
    )

    // SMA50
    // @ts-ignore - 我們知道這個方法在 API 中確實存在
    const sma50Series = chart.addSeries('line', {
      color: '#00BFFF',
      lineWidth: 1,
    })

    sma50Series.setData(
      chartData.map((d: ChartDataItem) => ({
        time: d.date as string,
        value: d.sma50,
      }))
    )

    // 處理視窗大小變更
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth
        })
      }
    }

    window.addEventListener('resize', handleResize)

    // 清理資源
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [])

  return <div ref={chartContainerRef} className="w-full" style={{ height: '400px' }} />
} 