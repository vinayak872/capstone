import React, { useState } from 'react';
import { 
  GitCommit, 
  GitBranch, 
  Copy, 
  Check, 
  RefreshCw, 
  Play, 
  Radio
} from 'lucide-react';
import { NavTabId } from './Sidebar';

interface TopbarProps {
  activeTab: NavTabId;
  commitSha?: string;
  branch?: string;
  onTriggerSync?: () => void;
  onTriggerRun?: () => void;
  isSyncing?: boolean;
}

const TAB_TITLES: Record<NavTabId, { title: string; subtitle: string }> = {
  pipeline: {
    title: 'CI/CD Pipeline Flow',
    subtitle: 'GitHub Actions build, Mocha tests, Trivy vulnerability scan & GHCR deployment',
  },
  sync: {
    title: 'GitOps Reconciliation & Comparative Analysis',
    subtitle: 'ArgoCD vs Flux side-by-side sync status, health metrics, and pod topology',
  },
  dora: {
    title: 'DORA DevOps Performance Metrics',
    subtitle: '30-day baseline vs current metrics for deployment frequency, lead time, CFR & MTTR',
  },
  rollouts: {
    title: 'Progressive Delivery & Argo Rollouts',
    subtitle: 'Semester VIII Canary release traffic progression & real-time Prometheus analysis checks',
  },
  'negative-tests': {
    title: 'Resilience & Negative Fault-Injection Suite',
    subtitle: '5 mandatory chaos engineering scenarios, automated recovery benchmarks & evidence logs',
  },
};

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  commitSha = 'e8f3c2a',
  branch = 'main',
  onTriggerSync,
  onTriggerRun,
  isSyncing = false,
}) => {
  const [copied, setCopied] = useState(false);
  const info = TAB_TITLES[activeTab] || { title: 'Dashboard', subtitle: '' };

  const handleCopySha = () => {
    navigator.clipboard.writeText(commitSha);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-20 border-b border-slate-800/80 bg-[#090e1a]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Title & Page context */}
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {info.title}
          </h2>
          <span className="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            <span>LIVE SYNC</span>
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          {info.subtitle}
        </p>
      </div>

      {/* Right controls: Git metadata and action buttons */}
      <div className="flex items-center gap-3">
        {/* Git Branch Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-mono">
          <GitBranch className="w-3.5 h-3.5 text-sky-400" />
          <span>{branch}</span>
        </div>

        {/* Git SHA Copy Pill */}
        <button
          onClick={handleCopySha}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-mono transition-all group"
          title="Click to copy commit SHA"
        >
          <GitCommit className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300" />
          <span className="text-sky-300 font-semibold">{commitSha}</span>
          {copied ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
          )}
        </button>

        {/* Trigger Sync / Run buttons */}
        {onTriggerSync && (
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 text-xs font-semibold text-white shadow-glow-cyan transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync GitOps'}</span>
          </button>
        )}

        {onTriggerRun && (
          <button
            onClick={onTriggerRun}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/30" />
            <span>Mock Run</span>
          </button>
        )}
      </div>
    </header>
  );
};
