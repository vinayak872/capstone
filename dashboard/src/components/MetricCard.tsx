import React from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DoraMetricCardData } from '../types/dora';
import { StatusBadge } from './StatusBadge';

interface MetricCardProps {
  metric: DoraMetricCardData;
  isSelected?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  isSelected = false,
  onClick,
}) => {
  const isPositive = metric.isImprovement;
  const strokeColor = isPositive ? '#10b981' : '#f43f5e';

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'border-sky-400/80 shadow-glow-cyan bg-slate-900/90 ring-1 ring-sky-400/40'
          : 'hover:border-slate-700/80 hover:bg-slate-900/70 hover:translate-y-[-2px]'
      }`}
    >
      {/* Top row: Title and Rating Badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {metric.title}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
            {metric.shortDescription}
          </p>
        </div>
        <StatusBadge status={metric.rating} size="sm" />
      </div>

      {/* Main Metric Value & Trend */}
      <div className="flex items-baseline justify-between gap-4 mt-2">
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {metric.currentValue}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                isPositive
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-950/70 text-rose-400 border border-rose-500/30'
              }`}
            >
              {metric.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : metric.trend === 'down' ? (
                <TrendingDown className="w-3 h-3 mr-1" />
              ) : (
                <Minus className="w-3 h-3 mr-1" />
              )}
              {metric.trendPercentage > 0 ? `${metric.trendPercentage}%` : 'Stable'}
            </span>
            <span className="text-[11px] text-slate-500">vs last cycle</span>
          </div>
        </div>

        {/* Recharts Sparkline */}
        <div className="w-28 h-12 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metric.sparklineData}>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 border border-slate-700 text-white text-[10px] px-2 py-1 rounded shadow-lg font-mono">
                        {payload[0].value} {metric.unit}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-[10px] text-slate-500 text-right mt-0.5">14d trend</div>
        </div>
      </div>

      {/* Target benchmark footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">Industry Target:</span>
        <span className="font-medium text-slate-300 font-mono">
          {metric.benchmarkTarget}
        </span>
      </div>
    </div>
  );
};
