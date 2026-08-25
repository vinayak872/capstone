export type TestResult = 'Pass' | 'Fail' | 'Running' | 'Skipped';
export type TestCategory = 'Reliability' | 'Rollback' | 'Fault-Tolerance' | 'Idempotency' | 'Resource-Limits';

export interface TestEvidence {
  faultType: string;
  injectedAt: string;
  recoveredAt: string;
  recoveryTimeSeconds: number;
  thresholdSeconds: number;
  logSnippet: string[];
  commandExecuted: string;
  expectedOutcome: string;
  actualOutcome: string;
  metricsObserved: {
    name: string;
    preFault: string;
    duringFault: string;
    postRecovery: string;
  }[];
}

export interface NegativeTestCase {
  id: string;
  testNumber: number;
  title: string;
  category: TestCategory;
  description: string;
  faultDescription: string;
  lastRunDate: string;
  duration: string;
  result: TestResult;
  recoveryTimeSeconds: number;
  evidence: TestEvidence;
  docReference: string;
}

export interface NegativeTestSummary {
  total: number;
  passed: number;
  failed: number;
  averageRecoveryTimeSeconds: number;
  lastSuiteRun: string;
}
