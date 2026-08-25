import React from 'react';
import { 
  GitMerge, 
  RefreshCw, 
  BarChart3, 
  Layers, 
  ShieldAlert, 
  Server, 
  ExternalLink,
  Cpu
} from 'lucide-react';

export type NavTabId = 'pipeline' | 'sync' | 'dora' | 'rollouts' | 'negative-tests';

interface NavItem {
  id: NavTabId;
  label: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ElementType;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: GitMerge,
    description: 'GitHub Actions CI & Trivy Scan',
    badge: '10 Runs',
    badgeColor: 'bg-sky-950 text-sky-400 border-sky-800',
  },
  {
    id: 'sync',
    label: 'GitOps Sync',
    icon: RefreshCw,
    description: 'ArgoCD vs Flux Reconciliation',
    badge: 'Synced',
    badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800',
  },
  {
    id: 'dora',
    label: 'DORA Metrics',
    icon: BarChart3,
    description: 'Lead Time, CFR, MTTR & Deploys',
    badge: 'Elite',
    badgeColor: 'bg-purple-950 text-purple-400 border-purple-800',
  },
  {
    id: 'rollouts',
    label: 'Rollouts',
    icon: Layers,
    description: 'Canary & Prometheus Analysis',
    badge: '60% Canary',
    badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
  },
  {
    id: 'negative-tests',
    label: 'Negative Tests',
    icon: ShieldAlert,
    description: '5 Chaos & Resilience Scenarios',
    badge: '5/5 Pass',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  },
];

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <aside className="w-64 shrink-0 bg-[#090e1a]/95 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 backdrop-blur-xl z-20">
      {/* Brand / Logo */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-glow-cyan text-white font-bold text-lg font-mono">
            C5
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm text-white tracking-wide">
                CLOUD-05
              </h1>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 bg-sky-950 text-sky-400 border border-sky-800 rounded">
                Console
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              GitOps CI/CD Platform
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Control Center
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-sky-950/60 border border-sky-500/40 text-white shadow-lg shadow-sky-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-sm shadow-sky-400/50'
                        : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="text-xs font-semibold tracking-wide truncate">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate group-hover:text-slate-400">
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Cluster Environment Footer */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="rounded-xl p-3 bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] mb-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Cluster</span>
            </div>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <div className="space-y-1 font-mono text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>Cluster:</span>
              <span className="text-slate-200 font-semibold">kind-cloud05</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Namespace:</span>
              <span className="text-slate-200">default / argocd</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>ArgoCD UI:</span>
              <a 
                href="http://localhost:8080" 
                target="_blank" 
                rel="noreferrer" 
                className="text-sky-400 hover:underline flex items-center gap-0.5"
              >
                :8080 <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
          <Cpu className="w-3 h-3 text-slate-600" />
          <span>Capstone Project CLOUD-05</span>
        </div>
      </div>
    </aside>
  );
};
