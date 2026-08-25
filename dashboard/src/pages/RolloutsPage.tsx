import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  RotateCcw, 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  Server, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { RolloutStatus } from '../types/rollout';
import { 
  getRolloutStatus, 
  promoteRolloutStep, 
  pauseRollout, 
  rollbackRollout 
} from '../mocks/rolloutMock';
import { StatusBadge } from '../components/StatusBadge';

interface RolloutsPageProps {
  onNotify?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const RolloutsPage: React.FC<RolloutsPageProps> = ({ onNotify }) => {
  const [status, setStatus] = useState<RolloutStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getRolloutStatus();
      setStatus(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handlePromote = async () => {
    setActionInProgress('promote');
    try {
      const res = await promoteRolloutStep();
      const updated = await getRolloutStatus();
      setStatus(updated);
      if (onNotify) {
        onNotify(res.success ? 'success' : 'info', 'Rollout Promoted', res.message);
      }
    } finally {
      setActionInProgress(null);
    }
  };

  const handlePause = async () => {
    setActionInProgress('pause');
    try {
      const res = await pauseRollout();
      const updated = await getRolloutStatus();
      setStatus(updated);
      if (onNotify) {
        onNotify('info', 'Rollout State Updated', res.message);
      }
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRollback = async () => {
    setActionInProgress('rollback');
    try {
      const res = await rollbackRollout();
      const updated = await getRolloutStatus();
      setStatus(updated);
      if (onNotify) {
        onNotify('error', 'Emergency Rollback Executed', res.message);
      }
    } finally {
      setActionInProgress(null);
    }
  };

  if (loading || !status) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-400" />
          <p className="text-sm font-mono">Connecting to Argo Rollouts controller & Prometheus metrics...</p>
        </div>
      </div>
    );
  }

  const isPaused = status.phase === 'Paused';
  const isRollback = status.phase === 'Rollback';

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Top Banner with Semester VIII context */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Semester VIII Preview: Progressive Canary Delivery</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Argo Rollouts & Prometheus Metric Analysis
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Automated canary traffic progression with real-time Prometheus SLA checks, automatic anomaly detection, and sub-second instant rollback.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={status.phase} size="md" />
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
              Strategy: {status.strategy}
            </span>
          </div>
        </div>
      </div>

      {/* Canary Traffic Shifting Progress Bar */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase font-mono text-sky-400 block">
              Active Traffic Splitting
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-extrabold text-white font-mono">
                {status.canaryWeight}% <span className="text-sm font-normal text-sky-400 font-sans">Canary</span>
              </span>
              <span className="text-slate-500 font-mono">/</span>
              <span className="text-2xl font-bold text-slate-400 font-mono">
                {status.stableWeight}% <span className="text-sm font-normal text-slate-400 font-sans">Stable</span>
              </span>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handlePromote}
              disabled={actionInProgress !== null || status.canaryWeight >= 100 || isRollback}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-40 text-xs font-bold text-white shadow-glow-cyan transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Promote Next Step</span>
            </button>

            <button
              onClick={handlePause}
              disabled={actionInProgress !== null || isRollback}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPaused ? 'Resume Progression' : 'Pause Soak'}</span>
            </button>

            <button
              onClick={handleRollback}
              disabled={actionInProgress !== null || isRollback}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 disabled:opacity-40 text-xs font-bold text-rose-200 border border-rose-600/50 shadow-sm shadow-rose-950 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Emergency Rollback</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar with Step Markers */}
        <div className="relative pt-6 pb-2">
          {/* Background Bar */}
          <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex">
            <div
              style={{ width: `${status.canaryWeight}%` }}
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 transition-all duration-700 shadow-glow-cyan"
            />
            <div
              style={{ width: `${status.stableWeight}%` }}
              className="h-full bg-slate-800 transition-all duration-700"
            />
          </div>

          {/* Step Markers */}
          <div className="flex justify-between items-center mt-4">
            {status.steps.map((step) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';
              const isAborted = step.status === 'aborted';

              return (
                <div key={step.stepNumber} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/50'
                        : isActive
                        ? 'bg-sky-500 text-white shadow-glow-cyan ring-4 ring-sky-500/20 animate-pulse'
                        : isAborted
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                  </div>
                  <span className="text-xs font-bold font-mono text-white mt-1.5">
                    {step.setWeight}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {step.pauseDuration ? `pause: ${step.pauseDuration}` : 'final'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Version Comparison Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Canary Target:</span>
            <span className="text-sky-300 font-bold bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800">
              {status.canaryVersion}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Stable Baseline:</span>
            <span className="text-slate-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {status.stableVersion}
            </span>
          </div>
        </div>
      </div>

      {/* Prometheus Metric Checks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Step Analysis: Real-Time Prometheus Metric Checks
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Prometheus API /api/v1/query • Continuous Evaluation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {status.metricChecks.map((check) => (
            <div
              key={check.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-300 leading-tight">
                    {check.name}
                  </span>
                  <StatusBadge status={check.status === 'pass' ? 'Pass' : 'Fail'} size="sm" />
                </div>

                <div className="my-3">
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {check.currentValue} <span className="text-xs text-slate-400 font-sans">{check.unit}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Threshold: <strong className="text-slate-200">{check.threshold}</strong>
                  </div>
                </div>

                <div className="p-2 rounded bg-black/40 border border-slate-800 text-[10px] font-mono text-slate-400 truncate" title={check.query}>
                  <code>{check.query}</code>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>Evaluated: {check.lastEvaluatedAt}</span>
                <span className="text-emerald-400 font-semibold">PASS</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pod Topology & Timeline 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pod Distribution */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Pod Replicas Traffic Distribution
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">5 Total Pods</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="text-slate-400 text-[11px] uppercase font-bold text-sky-400">
              Canary Replicas (60% Traffic)
            </div>
            {status.canaryPods.map((pod) => (
              <div
                key={pod.name}
                className="flex items-center justify-between p-3 rounded-xl bg-sky-950/30 border border-sky-800/40 text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="font-semibold truncate max-w-[200px]">{pod.name}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span>IP: {pod.ip}</span>
                  <span className="text-emerald-400 font-bold">{pod.status}</span>
                </div>
              </div>
            ))}

            <div className="text-slate-400 text-[11px] uppercase font-bold text-slate-400 pt-3">
              Stable Replicas (40% Traffic)
            </div>
            {status.stablePods.map((pod) => (
              <div
                key={pod.name}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span className="truncate max-w-[200px]">{pod.name}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span>IP: {pod.ip}</span>
                  <span className="text-slate-300">{pod.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rollout Event Timeline */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Rollout Decision Timeline
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Live Decisions</span>
          </div>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {status.timeline.map((event, i) => (
              <div key={event.id} className="flex items-start gap-3 text-xs relative">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-purple-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{event.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{event.timestamp}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
