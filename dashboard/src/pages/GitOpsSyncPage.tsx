import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Server, 
  Clock, 
  Zap, 
  ShieldCheck, 
  ExternalLink,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { GitOpsToolState, SyncComparisonSummary } from '../types/sync';
import { getGitOpsSyncStatus, triggerGitOpsSync } from '../mocks/syncMock';
import { StatusBadge } from '../components/StatusBadge';

interface GitOpsSyncPageProps {
  onNotify?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const GitOpsSyncPage: React.FC<GitOpsSyncPageProps> = ({ onNotify }) => {
  const [argo, setArgo] = useState<GitOpsToolState | null>(null);
  const [flux, setFlux] = useState<GitOpsToolState | null>(null);
  const [comparison, setComparison] = useState<SyncComparisonSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncingTool, setSyncingTool] = useState<'argo' | 'flux' | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getGitOpsSyncStatus();
      setArgo(data.argo);
      setFlux(data.flux);
      setComparison(data.comparison);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSync = async (tool: 'argo' | 'flux') => {
    setSyncingTool(tool);
    try {
      const res = await triggerGitOpsSync(tool);
      if (tool === 'argo' && argo) {
        setArgo({ ...argo, lastSyncTime: 'Just now', syncStatus: 'Synced' });
      } else if (tool === 'flux' && flux) {
        setFlux({ ...flux, lastSyncTime: 'Just now', syncStatus: 'Synced' });
      }
      if (onNotify) {
        onNotify('success', `${tool === 'argo' ? 'ArgoCD' : 'Flux'} Sync Successful`, res.message);
      }
    } catch {
      if (onNotify) {
        onNotify('error', 'Sync Failed', `Failed to reconcile ${tool}`);
      }
    } finally {
      setSyncingTool(null);
    }
  };

  if (loading || !argo || !flux || !comparison) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-400" />
          <p className="text-sm font-mono">Fetching GitOps controller reconciliations from cluster...</p>
        </div>
      </div>
    );
  }

  const renderToolColumn = (tool: GitOpsToolState, isArgo: boolean) => {
    const isSyncing = syncingTool === (isArgo ? 'argo' : 'flux');
    const badgeColor = isArgo 
      ? 'from-amber-500/20 to-orange-600/10 border-orange-500/30' 
      : 'from-blue-500/20 to-indigo-600/10 border-blue-500/30';
    const accentColor = isArgo ? 'text-amber-400' : 'text-blue-400';

    return (
      <div className={`glass-card rounded-2xl p-6 border transition-all flex flex-col justify-between ${
        isArgo ? 'ring-1 ring-amber-500/30 shadow-glow-amber' : ''
      }`}>
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl font-mono ${
                isArgo 
                  ? 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-glow-amber' 
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
              }`}>
                {isArgo ? 'A' : 'F'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{tool.toolName}</h3>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {tool.version}
                  </span>
                  {isArgo && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      Primary (Adopted)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  App: {tool.applicationName}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSync(isArgo ? 'argo' : 'flux')}
              disabled={isSyncing}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all ${
                isArgo
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white border-orange-400/50 shadow-glow-amber'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              } disabled:opacity-50`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          {/* Sync & Health Status Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Sync Status
              </span>
              <div className="mt-1.5">
                <StatusBadge status={tool.syncStatus} size="sm" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Health Status
              </span>
              <div className="mt-1.5">
                <StatusBadge status={tool.healthStatus} size="sm" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Last Sync
              </span>
              <div className="mt-1 text-xs font-bold text-slate-200 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {tool.lastSyncTime}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Target Revision
              </span>
              <div className="mt-1 text-xs font-bold text-sky-400 font-mono truncate">
                {tool.targetRevision}
              </div>
            </div>
          </div>

          {/* Controller Specs */}
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs font-mono grid grid-cols-2 gap-2 text-slate-400 mb-5">
            <div>Namespace: <span className="text-slate-200 font-semibold">{tool.namespace}</span></div>
            <div>Sync Latency: <span className="text-emerald-400 font-semibold">{tool.syncLatencyMs} ms</span></div>
            <div>Memory Footprint: <span className="text-slate-200 font-semibold">{tool.memoryUsageMb} MB</span></div>
            <div>CRDs Deployed: <span className="text-slate-200 font-semibold">{tool.crdCount}</span></div>
          </div>

          {/* Live Pod Table */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                <Server className="w-3.5 h-3.5 text-sky-400" />
                <span>Live Pod Topology (3 Replicas)</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Kubernetes 1.30</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#080d19]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Pod Name</th>
                    <th className="py-2.5 px-3">Ready</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Restarts</th>
                    <th className="py-2.5 px-3">Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {tool.pods.map((pod) => (
                    <tr key={pod.name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-200 truncate max-w-[160px]">
                        {pod.name}
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">
                        {pod.ready}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          {pod.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {pod.restarts}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {pod.age}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer info link */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Auto-Sync: {tool.autoSync ? 'Enabled' : 'Disabled'} • Prune: {tool.pruneEnabled ? 'Active' : 'Off'}</span>
          {isArgo ? (
            <a
              href="http://localhost:8080"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Open ArgoCD UI <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-slate-500">CLI Only (Flux v2)</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Overview Banner */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Capstone Objective 2: GitOps Engine Benchmark</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Side-by-Side Tool Comparison: ArgoCD vs. Flux
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Evaluating continuous reconciliation performance, dashboard observability, resource footprint, and Semester VIII progressive delivery integration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">ArgoCD Speed</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">1.84s Latency</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Flux Speed</span>
              <span className="text-sm font-bold text-blue-400 font-mono">4.18s Latency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Side-by-Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderToolColumn(argo, true)}
        {renderToolColumn(flux, false)}
      </div>

      {/* Comparison Summary Card */}
      <div className="glass-card rounded-2xl p-6 border border-sky-500/30 shadow-glow-cyan">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Comparative Benchmark & Architecture Decision
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs text-slate-400 font-mono block mb-1">
              Sync Latency Benchmark
            </span>
            <div className="text-lg font-bold text-white font-mono flex items-center justify-between">
              <span className="text-amber-400">ArgoCD: 1.84s</span>
              <span className="text-slate-500">vs</span>
              <span className="text-blue-400">Flux: 4.18s</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-2 font-mono flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> ArgoCD reconciles 2.3x faster
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs text-slate-400 font-mono block mb-1">
              Manual Interventions
            </span>
            <div className="text-lg font-bold text-white font-mono flex items-center justify-between">
              <span className="text-emerald-400">ArgoCD: 0</span>
              <span className="text-slate-500">vs</span>
              <span className="text-rose-400">Flux: 2</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              Flux required manual Kustomization CRD reconcile
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs text-slate-400 font-mono block mb-1">
              Memory Overhead (kind node)
            </span>
            <div className="text-lg font-bold text-white font-mono flex items-center justify-between">
              <span className="text-emerald-400">142 MB</span>
              <span className="text-slate-500">vs</span>
              <span className="text-slate-300">215 MB</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              ArgoCD uses 34% less memory on local kind
            </p>
          </div>
        </div>

        {/* Deliverable Decision Box */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-sky-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ADR-0001 Recommendation: ArgoCD</span>
          </div>
          <p className="text-slate-300">
            {comparison.recommendationReason}
          </p>
          <div className="pt-2 flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>Reference Document: <code className="text-sky-400">docs/adr/0001-choose-gitops-tool.md</code></span>
          </div>
        </div>
      </div>
    </div>
  );
};
