import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  Award, 
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { DoraMetricCardData, DoraComparisonSeries, DoraImprovementDriver } from '../types/dora';
import { getDoraMetrics, getDoraHistoricalComparison } from '../mocks/doraMock';
import { MetricCard } from '../components/MetricCard';

type MetricFilterKey = 'deploymentFrequency' | 'leadTime' | 'changeFailureRate' | 'mttr';

export const DoraMetricsPage: React.FC = () => {
  const [cards, setCards] = useState<DoraMetricCardData[]>([]);
  const [history, setHistory] = useState<DoraComparisonSeries[]>([]);
  const [drivers, setDrivers] = useState<DoraImprovementDriver[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<MetricFilterKey>('deploymentFrequency');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [metricData, historyData] = await Promise.all([
        getDoraMetrics(),
        getDoraHistoricalComparison(),
      ]);
      setCards(metricData.cards);
      setDrivers(metricData.drivers);
      setHistory(historyData);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-400" />
          <p className="text-sm font-mono">Calculating 30-day DORA performance metrics...</p>
        </div>
      </div>
    );
  }

  const getMetricConfig = (key: MetricFilterKey) => {
    switch (key) {
      case 'deploymentFrequency':
        return {
          title: 'Deployment Frequency (Deploys / Day)',
          baselineKey: 'dfBaseline',
          currentKey: 'dfCurrent',
          baselineLabel: 'Baseline (Manual / Ad-Hoc)',
          currentLabel: 'Current (GitOps Automated)',
          unit: 'deploys/day',
          colorCurrent: '#38bdf8',
          colorBaseline: '#64748b',
          improvementText: '+320% Increase in Release Cadence',
          target: 'Multiple deploys per day (Elite)',
        };
      case 'leadTime':
        return {
          title: 'Lead Time for Changes (Commit to Production)',
          baselineKey: 'leadTimeBaseline',
          currentKey: 'leadTimeCurrent',
          baselineLabel: 'Baseline (Manual Handoff)',
          currentLabel: 'Current (Automated CI/CD)',
          unit: 'minutes',
          colorCurrent: '#10b981',
          colorBaseline: '#f43f5e',
          improvementText: '74% Reduction in Lead Time (75m -> 18.5m)',
          target: '< 1 hour (Elite)',
        };
      case 'changeFailureRate':
        return {
          title: 'Change Failure Rate (% of Deploys with Incident)',
          baselineKey: 'cfrBaseline',
          currentKey: 'cfrCurrent',
          baselineLabel: 'Baseline Failure Rate',
          currentLabel: 'Current (Gated CI + Trivy)',
          unit: '%',
          colorCurrent: '#a855f7',
          colorBaseline: '#f43f5e',
          improvementText: '82% Reduction in Production Defect Escapes',
          target: '0 - 5% (Elite)',
        };
      case 'mttr':
        return {
          title: 'Mean Time to Restore / Recover (MTTR)',
          baselineKey: 'mttrBaseline',
          currentKey: 'mttrCurrent',
          baselineLabel: 'Baseline MTTR (Manual Triage)',
          currentLabel: 'Current (Argo Rollouts Auto-Revert)',
          unit: 'minutes',
          colorCurrent: '#06b6d4',
          colorBaseline: '#e11d48',
          improvementText: '88% Faster Incident Recovery (52m -> 6.2m)',
          target: '< 1 hour (Elite)',
        };
    }
  };

  const currentConfig = getMetricConfig(selectedMetric);

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
              <Award className="w-4 h-4 text-purple-400" />
              <span>DORA 2024 Benchmarks • Capstone Deliverable</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Software Delivery & Operational Performance
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Comparison between traditional manual deployment workflows (Baseline) and the CLOUD-05 GitOps automated progressive delivery pipeline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold font-mono">
                🏆
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-purple-300">Overall Tier</div>
                <div className="text-sm font-extrabold text-white">Elite Performer (4/4)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 DORA Metric Cards with Recharts Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <MetricCard
            key={card.id}
            metric={card}
            isSelected={selectedMetric === card.id}
            onClick={() => setSelectedMetric(card.id)}
          />
        ))}
      </div>

      {/* 30-Day Historical Comparison Chart */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white tracking-wide">
                {currentConfig.title}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              30-day historical progression: {currentConfig.improvementText}
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            {cards.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedMetric(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedMetric === c.id
                    ? 'bg-sky-500 text-white shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {c.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Large Recharts Area Chart */}
        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.colorCurrent} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={currentConfig.colorCurrent} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.colorBaseline} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={currentConfig.colorBaseline} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl font-mono text-xs space-y-1">
                        <div className="text-slate-400 font-semibold border-b border-slate-800 pb-1 mb-1">
                          {label}
                        </div>
                        <div className="flex items-center justify-between gap-4 text-sky-300">
                          <span>{currentConfig.currentLabel}:</span>
                          <span className="font-bold">{payload[0].value} {currentConfig.unit}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-slate-400">
                          <span>{currentConfig.baselineLabel}:</span>
                          <span>{payload[1]?.value} {currentConfig.unit}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => <span className="text-xs text-slate-300 font-mono">{value}</span>}
              />
              <Area
                type="monotone"
                dataKey={currentConfig.currentKey}
                name={currentConfig.currentLabel}
                stroke={currentConfig.colorCurrent}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#currentGradient)"
              />
              <Area
                type="monotone"
                dataKey={currentConfig.baselineKey}
                name={currentConfig.baselineLabel}
                stroke={currentConfig.colorBaseline}
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#baselineGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Target Indicator */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400" />
            <span>Target Benchmark: <strong className="text-slate-200">{currentConfig.target}</strong></span>
          </div>
          <span className="text-emerald-400 font-semibold">✓ Target Exceeded by CLOUD-05</span>
        </div>
      </div>

      {/* Key Improvement Drivers Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Architectural Drivers of DORA Improvements
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {drivers.map((driver, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60">
                    {driver.tag}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400 font-mono">
                    {driver.delta}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">
                  {driver.title}
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {driver.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
                Impacts: <span className="text-slate-300 font-medium">{driver.metricImpacted}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
