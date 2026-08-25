import { RolloutStatus } from '../types/rollout';

let MOCK_ROLLOUT_STATUS: RolloutStatus = {
  rolloutName: 'sample-app-rollout',
  namespace: 'default',
  strategy: 'Canary',
  phase: 'Progressing',
  stableVersion: 'v1.4.0 (sha: 94bc301)',
  canaryVersion: 'v1.5.0 (sha: e8f3c2a)',
  canaryWeight: 60,
  stableWeight: 40,
  currentStepIndex: 2,
  totalSteps: 5,
  steps: [
    { stepNumber: 1, setWeight: 20, pauseDuration: '2m', status: 'completed' },
    { stepNumber: 2, setWeight: 40, pauseDuration: '2m', status: 'completed' },
    { stepNumber: 3, setWeight: 60, pauseDuration: '5m', status: 'active' },
    { stepNumber: 4, setWeight: 80, pauseDuration: '2m', status: 'pending' },
    { stepNumber: 5, setWeight: 100, status: 'pending' },
  ],
  metricChecks: [
    {
      id: 'p99_latency',
      name: 'HTTP Request Latency (P99)',
      query: 'histogram_quantile(0.99, sum(rate(http_request_duration_ms_bucket[5m])) by (le))',
      threshold: '< 100 ms',
      currentValue: '38.4',
      unit: 'ms',
      status: 'pass',
      lastEvaluatedAt: '10s ago',
    },
    {
      id: 'error_rate',
      name: '5xx HTTP Error Rate',
      query: 'sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100',
      threshold: '< 0.50 %',
      currentValue: '0.03',
      unit: '%',
      status: 'pass',
      lastEvaluatedAt: '10s ago',
    },
    {
      id: 'success_rate',
      name: 'Service Success Availability',
      query: 'sum(rate(http_requests_total{status=~"2..|3.."}[5m])) / sum(rate(http_requests_total[5m])) * 100',
      threshold: '>= 99.50 %',
      currentValue: '99.97',
      unit: '%',
      status: 'pass',
      lastEvaluatedAt: '10s ago',
    },
    {
      id: 'cpu_usage',
      name: 'Container CPU Saturation',
      query: 'sum(rate(container_cpu_usage_seconds_total{container="sample-app"}[2m])) by (pod)',
      threshold: '< 75 %',
      currentValue: '18.2',
      unit: '%',
      status: 'pass',
      lastEvaluatedAt: '10s ago',
    },
  ],
  timeline: [
    {
      id: 'ev-1',
      timestamp: '11:51:30',
      type: 'start',
      title: 'Rollout Initiated',
      description: 'New revision e8f3c2a deployed. Analysis templates registered with Prometheus.',
      trafficWeight: 0,
    },
    {
      id: 'ev-2',
      timestamp: '11:52:00',
      type: 'promotion',
      title: 'Step 1 Promoted (20%)',
      description: 'Traffic shifted to 20% canary. Ingress routing updated.',
      trafficWeight: 20,
    },
    {
      id: 'ev-3',
      timestamp: '11:54:05',
      type: 'analysis_pass',
      title: 'Analysis Run #1 Passed',
      description: 'Prometheus metrics verified: Latency 34ms, Error rate 0.00%.',
      trafficWeight: 20,
    },
    {
      id: 'ev-4',
      timestamp: '11:54:30',
      type: 'promotion',
      title: 'Step 2 Promoted (40%)',
      description: 'Traffic scaled to 40% canary. 2 canary pods healthy.',
      trafficWeight: 40,
    },
    {
      id: 'ev-5',
      timestamp: '11:56:40',
      type: 'analysis_pass',
      title: 'Analysis Run #2 Passed',
      description: 'Prometheus metrics verified: Latency 36ms, Error rate 0.02%.',
      trafficWeight: 40,
    },
    {
      id: 'ev-6',
      timestamp: '11:57:00',
      type: 'promotion',
      title: 'Step 3 Active (60%)',
      description: 'Currently soaking for 5 minutes with active Prometheus evaluation.',
      trafficWeight: 60,
    },
  ],
  canaryPods: [
    { name: 'sample-app-canary-699d79cfc4-k8w2m', status: 'Running', ip: '10.244.0.14' },
    { name: 'sample-app-canary-699d79cfc4-p4j9x', status: 'Running', ip: '10.244.0.15' },
    { name: 'sample-app-canary-699d79cfc4-l1z5r', status: 'Running', ip: '10.244.0.16' },
  ],
  stablePods: [
    { name: 'sample-app-stable-58d7cfb68d-x99v1', status: 'Running', ip: '10.244.0.18' },
    { name: 'sample-app-stable-58d7cfb68d-b44c2', status: 'Running', ip: '10.244.0.19' },
  ],
};

export async function getRolloutStatus(): Promise<RolloutStatus> {
  try {
    const res = await fetch('http://localhost:3001/api/metrics/health');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        MOCK_ROLLOUT_STATUS.metricChecks = json.data;
      }
    }
  } catch {
    // Fallback
  }

  await new Promise((resolve) => setTimeout(resolve, 150));
  return JSON.parse(JSON.stringify(MOCK_ROLLOUT_STATUS));
}

export async function promoteRolloutStep(): Promise<{ success: boolean; newWeight: number; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  if (MOCK_ROLLOUT_STATUS.currentStepIndex < MOCK_ROLLOUT_STATUS.steps.length - 1) {
    MOCK_ROLLOUT_STATUS.steps[MOCK_ROLLOUT_STATUS.currentStepIndex].status = 'completed';
    MOCK_ROLLOUT_STATUS.currentStepIndex += 1;
    const currentStep = MOCK_ROLLOUT_STATUS.steps[MOCK_ROLLOUT_STATUS.currentStepIndex];
    currentStep.status = 'active';
    MOCK_ROLLOUT_STATUS.canaryWeight = currentStep.setWeight;
    MOCK_ROLLOUT_STATUS.stableWeight = 100 - currentStep.setWeight;
    
    if (currentStep.setWeight === 100) {
      MOCK_ROLLOUT_STATUS.phase = 'Healthy';
    }

    const time = new Date().toLocaleTimeString();
    MOCK_ROLLOUT_STATUS.timeline.push({
      id: `ev-${Date.now()}`,
      timestamp: time,
      type: 'promotion',
      title: `Step ${currentStep.stepNumber} Promoted (${currentStep.setWeight}%)`,
      description: `Traffic shifted to ${currentStep.setWeight}% canary via manual/automated promotion trigger.`,
      trafficWeight: currentStep.setWeight,
    });

    return {
      success: true,
      newWeight: currentStep.setWeight,
      message: `Rollout successfully advanced to Step ${currentStep.stepNumber} (${currentStep.setWeight}% canary traffic).`,
    };
  }

  return {
    success: false,
    newWeight: MOCK_ROLLOUT_STATUS.canaryWeight,
    message: 'Rollout is already at maximum traffic (100%).',
  };
}

export async function pauseRollout(): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const isPaused = MOCK_ROLLOUT_STATUS.phase === 'Paused';
  MOCK_ROLLOUT_STATUS.phase = isPaused ? 'Progressing' : 'Paused';
  
  const time = new Date().toLocaleTimeString();
  MOCK_ROLLOUT_STATUS.timeline.push({
    id: `ev-${Date.now()}`,
    timestamp: time,
    type: 'pause',
    title: isPaused ? 'Rollout Resumed' : 'Rollout Paused',
    description: isPaused ? 'Progressive timer and analysis checks resumed.' : 'Step timer frozen. Traffic locked at current weight.',
    trafficWeight: MOCK_ROLLOUT_STATUS.canaryWeight,
  });

  return {
    success: true,
    message: isPaused ? 'Rollout resumed.' : 'Rollout progression paused safely.',
  };
}

export async function rollbackRollout(): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  MOCK_ROLLOUT_STATUS.phase = 'Rollback';
  MOCK_ROLLOUT_STATUS.canaryWeight = 0;
  MOCK_ROLLOUT_STATUS.stableWeight = 100;
  
  MOCK_ROLLOUT_STATUS.steps.forEach((s) => {
    if (s.status === 'active') s.status = 'aborted';
    else if (s.status === 'pending') s.status = 'pending';
  });

  const time = new Date().toLocaleTimeString();
  MOCK_ROLLOUT_STATUS.timeline.push({
    id: `ev-${Date.now()}`,
    timestamp: time,
    type: 'rollback',
    title: 'Emergency Rollback Triggered',
    description: 'All 100% ingress traffic instantaneously reverted to Stable version v1.4.0 (94bc301). Canary pods terminated.',
    trafficWeight: 0,
  });

  return {
    success: true,
    message: 'Rollback executed! Traffic immediately reverted 100% to Stable release in 1.2s.',
  };
}
