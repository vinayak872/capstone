import { DoraMetricCardData, DoraComparisonSeries, DoraImprovementDriver } from '../types/dora';

const MOCK_DORA_METRICS: DoraMetricCardData[] = [
  {
    id: 'deploymentFrequency',
    title: 'Deployment Frequency',
    shortDescription: 'How often code is successfully deployed to production/cluster',
    currentValue: '4.8 / day',
    numericValue: 4.8,
    unit: 'deploys/day',
    trend: 'up',
    trendPercentage: 320,
    isImprovement: true,
    rating: 'Elite',
    benchmarkTarget: 'Multiple deploys per day (Elite)',
    sparklineData: [
      { day: 'Day 1', value: 1 },
      { day: 'Day 2', value: 1.5 },
      { day: 'Day 3', value: 2 },
      { day: 'Day 4', value: 2 },
      { day: 'Day 5', value: 3 },
      { day: 'Day 6', value: 3.2 },
      { day: 'Day 7', value: 2.8 },
      { day: 'Day 8', value: 3.5 },
      { day: 'Day 9', value: 4.0 },
      { day: 'Day 10', value: 4.2 },
      { day: 'Day 11', value: 4.1 },
      { day: 'Day 12', value: 4.6 },
      { day: 'Day 13', value: 4.7 },
      { day: 'Day 14', value: 4.8 },
    ],
  },
  {
    id: 'leadTime',
    title: 'Lead Time for Changes',
    shortDescription: 'Time from commit push to running in Kubernetes cluster',
    currentValue: '18.5 min',
    numericValue: 18.5,
    unit: 'minutes',
    trend: 'down',
    trendPercentage: 74,
    isImprovement: true,
    rating: 'Elite',
    benchmarkTarget: '< 1 hour (Elite)',
    sparklineData: [
      { day: 'Day 1', value: 72 },
      { day: 'Day 2', value: 65 },
      { day: 'Day 3', value: 58 },
      { day: 'Day 4', value: 52 },
      { day: 'Day 5', value: 44 },
      { day: 'Day 6', value: 38 },
      { day: 'Day 7', value: 32 },
      { day: 'Day 8', value: 28 },
      { day: 'Day 9', value: 24 },
      { day: 'Day 10', value: 22 },
      { day: 'Day 11', value: 20 },
      { day: 'Day 12', value: 19.5 },
      { day: 'Day 13', value: 19 },
      { day: 'Day 14', value: 18.5 },
    ],
  },
  {
    id: 'changeFailureRate',
    title: 'Change Failure Rate',
    shortDescription: 'Percentage of deployments causing degraded service or failure',
    currentValue: '1.8%',
    numericValue: 1.8,
    unit: '%',
    trend: 'down',
    trendPercentage: 82,
    isImprovement: true,
    rating: 'Elite',
    benchmarkTarget: '0 - 5% (Elite)',
    sparklineData: [
      { day: 'Day 1', value: 12.0 },
      { day: 'Day 2', value: 10.5 },
      { day: 'Day 3', value: 9.2 },
      { day: 'Day 4', value: 8.0 },
      { day: 'Day 5', value: 6.5 },
      { day: 'Day 6', value: 5.1 },
      { day: 'Day 7', value: 4.2 },
      { day: 'Day 8', value: 3.8 },
      { day: 'Day 9', value: 3.0 },
      { day: 'Day 10', value: 2.5 },
      { day: 'Day 11', value: 2.2 },
      { day: 'Day 12', value: 2.0 },
      { day: 'Day 13', value: 1.9 },
      { day: 'Day 14', value: 1.8 },
    ],
  },
  {
    id: 'mttr',
    title: 'Mean Time to Restore (MTTR)',
    shortDescription: 'Average time to recover from an incident or deployment defect',
    currentValue: '6.2 min',
    numericValue: 6.2,
    unit: 'minutes',
    trend: 'down',
    trendPercentage: 88,
    isImprovement: true,
    rating: 'Elite',
    benchmarkTarget: '< 1 hour (Elite)',
    sparklineData: [
      { day: 'Day 1', value: 55 },
      { day: 'Day 2', value: 48 },
      { day: 'Day 3', value: 42 },
      { day: 'Day 4', value: 35 },
      { day: 'Day 5', value: 26 },
      { day: 'Day 6', value: 20 },
      { day: 'Day 7', value: 16 },
      { day: 'Day 8', value: 12 },
      { day: 'Day 9', value: 9.5 },
      { day: 'Day 10', value: 8.2 },
      { day: 'Day 11', value: 7.4 },
      { day: 'Day 12', value: 6.8 },
      { day: 'Day 13', value: 6.5 },
      { day: 'Day 14', value: 6.2 },
    ],
  },
];

const MOCK_30_DAYS_COMPARISON: DoraComparisonSeries[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const dateStr = `Aug ${day.toString().padStart(2, '0')}`;
  
  // Baseline curves (traditional manual flow)
  const dfBase = 0.8 + Math.sin(i / 3) * 0.2;
  const leadTimeBase = 75 - (i * 0.4) + Math.sin(i / 2) * 6;
  const cfrBase = 11.5 + Math.cos(i / 4) * 2;
  const mttrBase = 52 + Math.sin(i / 3) * 5;

  // Current curves (GitOps + ArgoCD + Progressive Canary)
  const progressFactor = Math.min(1, (i + 5) / 25);
  const dfCurr = 1.2 + (progressFactor * 3.6) + (Math.sin(i) * 0.3);
  const leadTimeCurr = 70 - (progressFactor * 52) + (Math.cos(i) * 2.5);
  const cfrCurr = 10.0 - (progressFactor * 8.2) + (Math.sin(i / 2) * 0.4);
  const mttrCurr = 50.0 - (progressFactor * 44.0) + (Math.cos(i / 2) * 1.2);

  return {
    date: dateStr,
    dfBaseline: Number(dfBase.toFixed(2)),
    dfCurrent: Number(dfCurr.toFixed(2)),
    leadTimeBaseline: Number(leadTimeBase.toFixed(1)),
    leadTimeCurrent: Number(Math.max(15, leadTimeCurr).toFixed(1)),
    cfrBaseline: Number(cfrBase.toFixed(1)),
    cfrCurrent: Number(Math.max(1.5, cfrCurr).toFixed(1)),
    mttrBaseline: Number(mttrBase.toFixed(1)),
    mttrCurrent: Number(Math.max(5.5, mttrCurr).toFixed(1)),
  };
});

const MOCK_IMPROVEMENT_DRIVERS: DoraImprovementDriver[] = [
  {
    title: 'Automated Trivy & Unit Testing Gates',
    metricImpacted: 'Change Failure Rate',
    description: 'Pre-deployment vulnerability scanning and strict test gates eliminated faulty package regressions before GHCR publish.',
    delta: '-82% failures',
    tag: 'CI Automation',
  },
  {
    title: 'ArgoCD Automated Reconciliation',
    metricImpacted: 'Lead Time for Changes',
    description: 'Direct git-driven deployment eliminated manual kubectl applying, reducing human handoff lag from 75m to under 19m.',
    delta: '3.9x faster',
    tag: 'GitOps Engine',
  },
  {
    title: 'Argo Rollouts Automated Canary Rollback',
    metricImpacted: 'Mean Time to Restore (MTTR)',
    description: 'Instant health analysis and automated traffic reversion dropped incident mitigation time from 52 mins to 6.2 mins.',
    delta: '-88% recovery time',
    tag: 'Progressive Delivery',
  },
  {
    title: 'Multi-Arch Container Caching in GHCR',
    metricImpacted: 'Deployment Frequency',
    description: 'Docker layer reuse and fast runner spin-up empowered confident micro-releases throughout the day.',
    delta: '+320% frequency',
    tag: 'Docker & GHCR',
  },
];

export async function getDoraMetrics(): Promise<{
  cards: DoraMetricCardData[];
  drivers: DoraImprovementDriver[];
}> {
  try {
    const res = await fetch('http://localhost:3001/api/dora/summary');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        MOCK_DORA_METRICS[0].currentValue = d.deploymentFrequency.value;
        MOCK_DORA_METRICS[0].numericValue = d.deploymentFrequency.numericValue;

        MOCK_DORA_METRICS[1].currentValue = d.leadTime.value;
        MOCK_DORA_METRICS[1].numericValue = d.leadTime.numericValue;

        MOCK_DORA_METRICS[2].currentValue = d.changeFailureRate.value;
        MOCK_DORA_METRICS[2].numericValue = d.changeFailureRate.numericValue;

        MOCK_DORA_METRICS[3].currentValue = d.mttr.value;
        MOCK_DORA_METRICS[3].numericValue = d.mttr.numericValue;
      }
    }
  } catch {
    // Graceful fallback
  }

  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    cards: [...MOCK_DORA_METRICS],
    drivers: [...MOCK_IMPROVEMENT_DRIVERS],
  };
}

export async function getDoraHistoricalComparison(): Promise<DoraComparisonSeries[]> {
  try {
    const res = await fetch('http://localhost:3001/api/dora/summary');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.history30Days) {
        return json.data.history30Days;
      }
    }
  } catch {
    // Fallback
  }

  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...MOCK_30_DAYS_COMPARISON];
}
