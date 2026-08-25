import { NegativeTestCase, NegativeTestSummary } from '../types/negativeTests';

const MOCK_NEGATIVE_TESTS: NegativeTestCase[] = [
  {
    id: 'chaos-01',
    testNumber: 1,
    title: 'Cluster Overhead & Node Resource Pressure',
    category: 'Resource-Limits',
    description: 'Validates controller CPU throttling and memory exhaustion resilience on kind control-plane under 90% artificial load.',
    faultDescription: 'Injected 4 core stress-ng worker on kind node + filled 85% cgroup memory limit for 60 seconds.',
    lastRunDate: '2026-08-25 10:15 UTC',
    duration: '2m 14s',
    result: 'Pass',
    recoveryTimeSeconds: 14.2,
    docReference: 'docs/evidence/chaos-01-resource-pressure.json',
    evidence: {
      faultType: 'Stress-ng CPU/Memory Pressure',
      injectedAt: '10:15:00',
      recoveredAt: '10:15:14',
      recoveryTimeSeconds: 14.2,
      thresholdSeconds: 30.0,
      commandExecuted: 'kubectl apply -f test/chaos/cpu-memory-hog.yaml && kubectl top nodes',
      expectedOutcome: 'ArgoCD controller queues reconciliation batches without OOMKilled; pod readiness unaffected.',
      actualOutcome: 'Reconciliation deferred by 12s; zero pod restarts; cluster auto-stabilized in 14.2s.',
      metricsObserved: [
        { name: 'Node CPU Usage', preFault: '14%', duringFault: '93%', postRecovery: '16%' },
        { name: 'ArgoCD Memory', preFault: '142MB', duringFault: '189MB', postRecovery: '145MB' },
        { name: 'Pod HTTP 200 Availability', preFault: '100%', duringFault: '99.9%', postRecovery: '100%' },
      ],
      logSnippet: [
        '[10:15:00] [CHAOS] Injecting synthetic CPU & Memory stress via stress-ng...',
        '[10:15:04] [WARN] Node kind-control-plane memory usage exceeded 85% watermark.',
        '[10:15:08] [INFO] ArgoCD controller throttled background drift check rate (queue delay: +800ms).',
        '[10:15:14] [CHAOS] Fault removed. CPU pressure subsided to baseline (16%).',
        '[10:15:14] [PASS] Cluster overhead test PASSED. Recovery verified in 14.2s (limit: 30s).',
      ],
    },
  },
  {
    id: 'chaos-02',
    testNumber: 2,
    title: 'Canary Metric Failure (Artificial Latency / 500 Injection)',
    category: 'Rollback',
    description: 'Ensures Prometheus analysis template immediately flags error spikes during Canary phase and triggers abort before user traffic impacts.',
    faultDescription: 'Injected 5% HTTP 500 status rate and 250ms synthetic latency into /health endpoint during Step 2 (40% weight).',
    lastRunDate: '2026-08-25 08:30 UTC',
    duration: '1m 45s',
    result: 'Pass',
    recoveryTimeSeconds: 8.6,
    docReference: 'docs/evidence/chaos-02-canary-metric-failure.json',
    evidence: {
      faultType: 'HTTP 500 Error & High Latency Injection',
      injectedAt: '08:30:10',
      recoveredAt: '08:30:18',
      recoveryTimeSeconds: 8.6,
      thresholdSeconds: 15.0,
      commandExecuted: 'curl -X POST http://localhost:3000/test/inject-fault?errorRate=0.05&latencyMs=250',
      expectedOutcome: 'Prometheus query flags threshold violation (>0.5% errors); Argo Rollouts executes automatic abort.',
      actualOutcome: 'Metric violation caught in 4.2s; Rollout reverted 100% traffic to stable pods within 8.6s total.',
      metricsObserved: [
        { name: '5xx Error Rate', preFault: '0.00%', duringFault: '5.20%', postRecovery: '0.00%' },
        { name: 'P99 Latency', preFault: '36ms', duringFault: '278ms', postRecovery: '38ms' },
        { name: 'Canary Traffic Weight', preFault: '40%', duringFault: '40%', postRecovery: '0% (Aborted)' },
      ],
      logSnippet: [
        '[08:30:10] [CHAOS] Injected errorRate=0.05 and latencyMs=250 on canary subset.',
        '[08:30:14] [PROMETHEUS] MetricCheck "5xx HTTP Error Rate" FAILED: 5.20% > threshold 0.50%.',
        '[08:30:15] [ROLLOUT] AnalysisRun sample-app-analysis-2 marked as Failed.',
        '[08:30:16] [ROLLOUT] Executing automatic rollback. Shifting ingress weight to 0%.',
        '[08:30:18] [SUCCESS] 100% traffic restored to Stable release v1.4.0. Rollback verified in 8.6s.',
      ],
    },
  },
  {
    id: 'chaos-03',
    testNumber: 3,
    title: 'Rollback Correctness & Traffic Draining Speed',
    category: 'Reliability',
    description: 'Measures time taken to drain inflight HTTP connections when rolling back a broken deployment without dropped TCP packets.',
    faultDescription: 'Forced termination of 2 replica pods while streaming 200 concurrent HTTP requests per second.',
    lastRunDate: '2026-08-24 21:10 UTC',
    duration: '3m 02s',
    result: 'Pass',
    recoveryTimeSeconds: 5.4,
    docReference: 'docs/evidence/chaos-03-rollback-traffic-drain.json',
    evidence: {
      faultType: 'Graceful Termination & Connection Draining',
      injectedAt: '21:10:00',
      recoveredAt: '21:10:05',
      recoveryTimeSeconds: 5.4,
      thresholdSeconds: 10.0,
      commandExecuted: 'kubectl delete pod -l app=sample-app,role=canary --now & hey -n 2000 -c 50 http://localhost:3000/',
      expectedOutcome: 'Zero 502 Bad Gateway responses; preStop hook allows existing sockets to finish gracefully.',
      actualOutcome: '2000 requests returned 200 OK; 0 connection resets; drain time completed in 5.4s.',
      metricsObserved: [
        { name: 'Dropped Requests', preFault: '0', duringFault: '0', postRecovery: '0' },
        { name: 'TCP Reset Count', preFault: '0', duringFault: '0', postRecovery: '0' },
        { name: 'Connection Drain Time', preFault: '-', duringFault: '5.4s', postRecovery: 'Normal' },
      ],
      logSnippet: [
        '[21:10:00] [HEY] Starting load generation: 2000 requests across 50 concurrency workers.',
        '[21:10:01] [K8S] SIGTERM sent to pod sample-app-canary-699d79cfc4-p4j9x.',
        '[21:10:03] [K8S] preStop hook active: finishing 48 pending requests in flight.',
        '[21:10:05] [K8S] Container stopped cleanly. All sockets closed without RST packets.',
        '[21:10:05] [PASS] Zero 502/504 errors detected during rapid pod eviction. Test PASS.',
      ],
    },
  },
  {
    id: 'chaos-04',
    testNumber: 4,
    title: 'Partial-Failure State Inconsistency (Split-Brain Sync)',
    category: 'Fault-Tolerance',
    description: 'Simulates network partition between ArgoCD controller and GitHub remote repository to test reconciliation locking.',
    faultDescription: 'Blocked outbound HTTPS traffic (port 443) from argocd-application-controller pod to github.com for 90s.',
    lastRunDate: '2026-08-24 16:45 UTC',
    duration: '2m 30s',
    result: 'Pass',
    recoveryTimeSeconds: 11.8,
    docReference: 'docs/evidence/chaos-04-split-brain-sync.json',
    evidence: {
      faultType: 'Network Egress Partition to Git Remote',
      injectedAt: '16:45:00',
      recoveredAt: '16:45:11',
      recoveryTimeSeconds: 11.8,
      thresholdSeconds: 25.0,
      commandExecuted: 'kubectl exec -n argocd deploy/argocd-repo-server -- iptables -A OUTPUT -p tcp --dport 443 -j DROP',
      expectedOutcome: 'ArgoCD holds last known good state; does not delete live resources; recovers on reconnect.',
      actualOutcome: 'Controller marked state as "ComparisonError (Cached)"; zero resource flaps; auto-reconciled in 11.8s upon unblock.',
      metricsObserved: [
        { name: 'App Sync State', preFault: 'Synced', duringFault: 'ComparisonError (Cached)', postRecovery: 'Synced' },
        { name: 'Unintended Resource Deletions', preFault: '0', duringFault: '0', postRecovery: '0' },
        { name: 'Reconnection Convergence', preFault: '-', duringFault: '90s partition', postRecovery: '11.8s' },
      ],
      logSnippet: [
        '[16:45:00] [CHAOS] Dropping egress TCP/443 on argocd-repo-server.',
        '[16:45:06] [WARN] Failed to fetch remote Git revision: connection timeout to github.com.',
        '[16:45:08] [INFO] Preserving existing cluster state. Pruning disabled while repository unreachable.',
        '[16:45:30] [CHAOS] Network filter removed.',
        '[16:45:41] [SUCCESS] Remote repo refreshed. Manifest cache rebuilt in 11.8s. Test PASSED.',
      ],
    },
  },
  {
    id: 'chaos-05',
    testNumber: 5,
    title: 'Retry & Duplicate-Work Idempotency Handling',
    category: 'Idempotency',
    description: 'Verifies that duplicate webhook triggers and concurrent sync commands do not cause manifest mutation storms or pod thrashing.',
    faultDescription: 'Broadcasted 25 identical sync webhook payloads simultaneously within 500ms window.',
    lastRunDate: '2026-08-24 11:20 UTC',
    duration: '1m 10s',
    result: 'Pass',
    recoveryTimeSeconds: 3.2,
    docReference: 'docs/evidence/chaos-05-idempotency-webhooks.json',
    evidence: {
      faultType: 'Concurrent Duplicate Webhook Storm',
      injectedAt: '11:20:00',
      recoveredAt: '11:20:03',
      recoveryTimeSeconds: 3.2,
      thresholdSeconds: 10.0,
      commandExecuted: 'for i in {1..25}; do curl -s -X POST http://localhost:8080/api/v1/applications/sample-app/sync & done',
      expectedOutcome: 'ArgoCD coalesces sync requests into a single atomic reconciliation lock.',
      actualOutcome: '24 redundant syncs de-duplicated in work queue; 1 single reconciliation ran; 0 duplicate pod creations.',
      metricsObserved: [
        { name: 'Sync Requests Sent', preFault: '1', duringFault: '25', postRecovery: '1' },
        { name: 'Actual K8s Apply Ops', preFault: '1', duringFault: '1 (Coalesced)', postRecovery: '1' },
        { name: 'Pod Replacement Count', preFault: '0', duringFault: '0', postRecovery: '0' },
      ],
      logSnippet: [
        '[11:20:00] [CHAOS] Firing 25 concurrent POST /api/v1/applications/sample-app/sync requests...',
        '[11:20:01] [INFO] Application sample-app is already syncing. Request coalesced into active transaction.',
        '[11:20:02] [INFO] 24 redundant sync requests discarded by idempotency de-duplication layer.',
        '[11:20:03] [PASS] Single atomic apply completed in 3.2s without pod disruption. Test PASSED.',
      ],
    },
  },
];

export async function getNegativeTests(): Promise<NegativeTestCase[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return JSON.parse(JSON.stringify(MOCK_NEGATIVE_TESTS));
}

export async function getNegativeTestSummary(): Promise<NegativeTestSummary> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const passed = MOCK_NEGATIVE_TESTS.filter((t) => t.result === 'Pass').length;
  const total = MOCK_NEGATIVE_TESTS.length;
  const avgRecovery = Number(
    (MOCK_NEGATIVE_TESTS.reduce((acc, t) => acc + t.recoveryTimeSeconds, 0) / total).toFixed(1)
  );

  return {
    total,
    passed,
    failed: total - passed,
    averageRecoveryTimeSeconds: avgRecovery,
    lastSuiteRun: '2026-08-25 10:15 UTC',
  };
}

export async function retestScenario(id: string): Promise<{ success: boolean; result: NegativeTestCase }> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const test = MOCK_NEGATIVE_TESTS.find((t) => t.id === id);
  if (!test) throw new Error('Test not found');
  
  test.lastRunDate = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  test.result = 'Pass';
  return {
    success: true,
    result: { ...test },
  };
}
