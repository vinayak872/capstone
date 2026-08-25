export type StepStatus = 'success' | 'running' | 'failed' | 'pending';

export interface PipelineStageDTO {
  id: string;
  name: string;
  order: number;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
  description: string;
  command?: string;
}

export interface PipelineLogEntryDTO {
  timestamp: string;
  stageId: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'debug';
  message: string;
}

export interface PipelineRunDTO {
  id: string;
  runNumber: number;
  commitSha: string;
  commitMessage: string;
  author: {
    name: string;
    avatarUrl: string;
    username: string;
  };
  branch: string;
  event: 'push' | 'pull_request' | 'workflow_dispatch';
  status: StepStatus;
  startedAt: string;
  completedAt?: string;
  totalDurationSeconds: number;
  stages: PipelineStageDTO[];
  logs: PipelineLogEntryDTO[];
  artifactUrl?: string;
  ghcrImage?: string;
}

export interface PodInfoDTO {
  name: string;
  ready: string;
  status: 'Running' | 'Pending' | 'CrashLoopBackOff' | 'ContainerCreating' | 'Terminating';
  restarts: number;
  age: string;
  cpu: string;
  memory: string;
  ip: string;
}

export interface DeploymentInfoDTO {
  name: string;
  namespace: string;
  desiredReplicas: number;
  readyReplicas: number;
  availableReplicas: number;
  updatedReplicas: number;
  image: string;
  age: string;
}

export interface ArgoStatusDTO {
  applicationName: string;
  syncStatus: 'Synced' | 'OutOfSync' | 'Unknown';
  healthStatus: 'Healthy' | 'Degraded' | 'Progressing' | 'Suspended' | 'Missing';
  targetRevision: string;
  lastSyncTime: string;
  repoUrl: string;
  isLive: boolean;
  history?: Array<{
    id: number;
    revision: string;
    deployedAt: string;
  }>;
}

export interface PrometheusMetricCheckDTO {
  id: string;
  name: string;
  query: string;
  threshold: string;
  currentValue: string;
  unit: string;
  status: 'pass' | 'fail' | 'evaluating';
  lastEvaluatedAt: string;
}

export interface DoraSummaryDTO {
  deploymentFrequency: {
    value: string;
    numericValue: number;
    unit: string;
    rating: 'Elite' | 'High' | 'Medium' | 'Low';
    trend: 'up' | 'down' | 'neutral';
    trendPercentage: number;
  };
  leadTime: {
    value: string;
    numericValue: number;
    unit: string;
    rating: 'Elite' | 'High' | 'Medium' | 'Low';
    trend: 'up' | 'down' | 'neutral';
    trendPercentage: number;
  };
  changeFailureRate: {
    value: string;
    numericValue: number;
    unit: string;
    rating: 'Elite' | 'High' | 'Medium' | 'Low';
    trend: 'up' | 'down' | 'neutral';
    trendPercentage: number;
  };
  mttr: {
    value: string;
    numericValue: number;
    unit: string;
    rating: 'Elite' | 'High' | 'Medium' | 'Low';
    trend: 'up' | 'down' | 'neutral';
    trendPercentage: number;
  };
  history30Days: Array<{
    date: string;
    dfBaseline: number;
    dfCurrent: number;
    leadTimeBaseline: number;
    leadTimeCurrent: number;
    cfrBaseline: number;
    cfrCurrent: number;
    mttrBaseline: number;
    mttrCurrent: number;
  }>;
}
