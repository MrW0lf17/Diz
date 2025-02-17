import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';

interface TradingChartProps {
  data: CandlestickData[];
  width?: number;
  height?: number;
  onCrosshairMove?: (price: number, time: number) => void;
}

const TradingChart: React.FC<TradingChartProps> = ({
  data,
  width = 600,
  height = 400,
  onCrosshairMove
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize chart
    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        background: { color: '#1E1E1E' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#2B2B2B' },
        horzLines: { color: '#2B2B2B' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: '#4B5563',
          style: 0,
        },
        horzLine: {
          width: 1,
          color: '#4B5563',
          style: 0,
        },
      },
      timeScale: {
        borderColor: '#2B2B2B',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#2B2B2B',
      },
    });

    // Create candlestick series
    const series = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Set the data
    series.setData(data);

    // Subscribe to crosshair moves
    if (onCrosshairMove) {
      chart.subscribeCrosshairMove((param) => {
        if (param.point) {
          const price = param.point.y;
          const time = param.time as number;
          onCrosshairMove(price, time);
        }
      });
    }

    // Store references
    chartRef.current = chart;
    seriesRef.current = series;

    // Cleanup
    return () => {
      chart.remove();
    };
  }, [data, width, height, onCrosshairMove]);

  // Update data when it changes
  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  return <div ref={chartContainerRef} />;
};

export default TradingChart; 