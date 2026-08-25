export type RolloutPhase = 'Progressing' | 'Paused' | 'Healthy' | 'Degraded' | 'Rollback';

export interface CanaryStep {
  stepNumber: number;
  setWeight: number; // e.g. 20, 40, 60, 80, 100
  pauseDuration?: string;
  status: 'completed' | 'active' | 'pending' | 'aborted';
}

export interface PrometheusMetricCheck {
  id: string;
  name: string;
  query: string;
  threshold: string;
  currentValue: string;
  unit: string;
  status: 'pass' | 'fail' | 'evaluating';
  lastEvaluatedAt: string;
}

export interface RolloutTimelineEvent {
  id: string;
  timestamp: string;
  type: 'promotion' | 'pause' | 'analysis_pass' | 'analysis_fail' | 'rollback' | 'start';
  title: string;
  description: string;
  trafficWeight: number;
}

export interface RolloutStatus {
  rolloutName: string;
  namespace: string;
  strategy: 'Canary' | 'BlueGreen';
  phase: RolloutPhase;
  stableVersion: string;
  canaryVersion: string;
  canaryWeight: number; // 0 - 100%
  stableWeight: number; // 0 - 100%
  currentStepIndex: number;
  totalSteps: number;
  steps: CanaryStep[];
  metricChecks: PrometheusMetricCheck[];
  timeline: RolloutTimelineEvent[];
  canaryPods: { name: string; status: string; ip: string }[];
  stablePods: { name: string; status: string; ip: string }[];
}
