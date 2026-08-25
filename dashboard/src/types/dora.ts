export type DoraRating = 'Elite' | 'High' | 'Medium' | 'Low';

export interface SparklinePoint {
  day: string;
  value: number;
}

export interface DoraMetricCardData {
  id: 'deploymentFrequency' | 'leadTime' | 'changeFailureRate' | 'mttr';
  title: string;
  shortDescription: string;
  currentValue: string;
  numericValue: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  trendPercentage: number;
  isImprovement: boolean;
  rating: DoraRating;
  benchmarkTarget: string;
  sparklineData: SparklinePoint[];
}

export interface DoraComparisonSeries {
  date: string;
  // Deployment Frequency (deploys/day)
  dfBaseline: number;
  dfCurrent: number;
  // Lead Time (minutes)
  leadTimeBaseline: number;
  leadTimeCurrent: number;
  // Change Failure Rate (%)
  cfrBaseline: number;
  cfrCurrent: number;
  // MTTR (minutes)
  mttrBaseline: number;
  mttrCurrent: number;
}

export interface DoraImprovementDriver {
  title: string;
  metricImpacted: string;
  description: string;
  delta: string;
  tag: string;
}
