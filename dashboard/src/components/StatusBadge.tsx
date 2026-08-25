import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  ShieldCheck, 
  Activity, 
  RefreshCw 
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let Icon = Clock;
  let animate = false;

  switch (normalized) {
    case 'success':
    case 'synced':
    case 'healthy':
    case 'pass':
    case 'completed':
      colorClasses = 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950';
      Icon = CheckCircle2;
      break;

    case 'running':
    case 'progressing':
    case 'active':
    case 'evaluating':
      colorClasses = 'bg-sky-950/70 text-sky-300 border-sky-500/40 shadow-sm shadow-sky-950';
      Icon = Loader2;
      animate = true;
      break;

    case 'failed':
    case 'fail':
    case 'degraded':
    case 'outofsync':
    case 'crashloopbackoff':
    case 'aborted':
      colorClasses = 'bg-rose-950/70 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-950';
      Icon = XCircle;
      break;

    case 'pending':
    case 'suspended':
    case 'paused':
      colorClasses = 'bg-amber-950/70 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-950';
      Icon = AlertTriangle;
      break;

    case 'elite':
      colorClasses = 'bg-purple-950/70 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-950';
      Icon = ShieldCheck;
      break;

    case 'high':
      colorClasses = 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-950';
      Icon = Activity;
      break;

    case 'rollback':
      colorClasses = 'bg-red-950/80 text-red-200 border-red-500/50 shadow-sm shadow-red-950';
      Icon = RefreshCw;
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all ${sizeClasses} ${colorClasses} ${className}`}
    >
      {showIcon && (
        <Icon className={`w-3.5 h-3.5 ${animate ? 'animate-spin' : ''}`} />
      )}
      <span>{status}</span>
    </span>
  );
};
