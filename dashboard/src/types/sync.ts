export type SyncStatus = 'Synced' | 'OutOfSync' | 'Unknown';
export type HealthStatus = 'Healthy' | 'Degraded' | 'Progressing' | 'Suspended' | 'Missing';

export interface PodInfo {
  name: string;
  ready: string; // e.g. "1/1"
  status: 'Running' | 'Pending' | 'CrashLoopBackOff' | 'ContainerCreating' | 'Terminating';
  restarts: number;
  age: string; // e.g. "18m", "2h"
  cpu: string;
  memory: string;
  ip: string;
}

export interface GitOpsToolState {
  toolName: 'ArgoCD' | 'Flux';
  version: string;
  applicationName: string;
  repoUrl: string;
  targetRevision: string;
  lastSyncTime: string;
  syncStatus: SyncStatus;
  healthStatus: HealthStatus;
  reconciliationIntervalSeconds: number;
  autoSync: boolean;
  pruneEnabled: boolean;
  pods: PodInfo[];
  syncLatencyMs: number;
  manualInterventionsCount: number;
  memoryUsageMb: number;
  crdCount: number;
  namespace: string;
}

export interface SyncComparisonSummary {
  argoLatency: number;
  fluxLatency: number;
  argoInterventions: number;
  fluxInterventions: number;
  argoResourceMb: number;
  fluxResourceMb: number;
  reconciliationSpeedDelta: string;
  recommendedChoice: 'ArgoCD' | 'Flux';
  recommendationReason: string;
}
