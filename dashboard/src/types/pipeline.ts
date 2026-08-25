export type StepStatus = 'success' | 'running' | 'failed' | 'pending';

export interface PipelineStage {
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

export interface PipelineLogEntry {
  timestamp: string;
  stageId: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'debug';
  message: string;
}

export interface PipelineRun {
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
  stages: PipelineStage[];
  logs: PipelineLogEntry[];
  artifactUrl?: string;
  ghcrImage?: string;
}
