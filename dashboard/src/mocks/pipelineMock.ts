import { PipelineRun } from '../types/pipeline';

const MOCK_PIPELINE_RUNS: PipelineRun[] = [
  {
    id: 'run-108',
    runNumber: 108,
    commitSha: 'e8f3c2a',
    commitMessage: 'feat(api): optimize express healthcheck probe latency',
    author: {
      name: 'Vinayak Kumar',
      username: 'vinayak872',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    branch: 'main',
    event: 'push',
    status: 'success',
    startedAt: '2026-08-25T11:48:10Z',
    completedAt: '2026-08-25T11:51:24Z',
    totalDurationSeconds: 194,
    ghcrImage: 'ghcr.io/vinayak872/sample-app:e8f3c2a',
    stages: [
      { id: 'build', name: 'Build', order: 1, status: 'success', startedAt: '11:48:10', completedAt: '11:48:42', durationSeconds: 32, description: 'Set up Node.js 20 & install npm dependencies', command: 'npm ci --prefer-offline' },
      { id: 'test', name: 'Test', order: 2, status: 'success', startedAt: '11:48:43', completedAt: '11:49:05', durationSeconds: 22, description: 'Execute unit test suite via node:test', command: 'npm test -- --test-reporter=tap' },
      { id: 'trivy', name: 'Trivy Scan', order: 3, status: 'success', startedAt: '11:49:06', completedAt: '11:49:48', durationSeconds: 42, description: 'Scan container filesystem for CVEs & misconfigs', command: 'trivy image --severity HIGH,CRITICAL --exit-code 0 ghcr.io/vinayak872/sample-app:e8f3c2a' },
      { id: 'push', name: 'Push to GHCR', order: 4, status: 'success', startedAt: '11:49:49', completedAt: '11:50:35', durationSeconds: 46, description: 'Build multi-arch image and publish to GHCR', command: 'docker buildx build --push -t ghcr.io/vinayak872/sample-app:e8f3c2a .' },
      { id: 'sync', name: 'ArgoCD Sync', order: 5, status: 'success', startedAt: '11:50:36', completedAt: '11:51:24', durationSeconds: 48, description: 'Trigger GitOps reconciliation on local kind cluster', command: 'argocd app sync sample-app --prune --timeout 60' },
    ],
    logs: [
      { timestamp: '11:48:10', stageId: 'build', level: 'info', message: 'Starting job: build-test-scan on ubuntu-latest' },
      { timestamp: '11:48:12', stageId: 'build', level: 'info', message: 'git checkout e8f3c2a912b77a01 (branch: main)' },
      { timestamp: '11:48:15', stageId: 'build', level: 'info', message: 'Setting up Node.js runtime version 20.15.1' },
      { timestamp: '11:48:22', stageId: 'build', level: 'info', message: 'Running npm ci in workspace /src...' },
      { timestamp: '11:48:41', stageId: 'build', level: 'success', message: 'added 54 packages in 18.4s. 0 vulnerabilities found.' },
      { timestamp: '11:48:43', stageId: 'test', level: 'info', message: 'Executing test runner: node:test index.test.js' },
      { timestamp: '11:48:45', stageId: 'test', level: 'info', message: 'TAP version 13' },
      { timestamp: '11:48:46', stageId: 'test', level: 'success', message: 'ok 1 - health endpoint returns status ok (latency: 1.8ms)' },
      { timestamp: '11:48:48', stageId: 'test', level: 'success', message: 'ok 2 - root endpoint returns greeting v1' },
      { timestamp: '11:48:50', stageId: 'test', level: 'success', message: 'ok 3 - readiness probe answers within 50ms' },
      { timestamp: '11:48:52', stageId: 'test', level: 'info', message: '1..3 tests completed. Pass: 3, Fail: 0, Skip: 0.' },
      { timestamp: '11:49:06', stageId: 'trivy', level: 'info', message: 'Initializing Aqua Security Trivy database v2...' },
      { timestamp: '11:49:15', stageId: 'trivy', level: 'info', message: 'Scanning base image: node:20-alpine (alpine 3.20.1)' },
      { timestamp: '11:49:32', stageId: 'trivy', level: 'info', message: 'Total: 0 vulnerabilities (CRITICAL: 0, HIGH: 0, MEDIUM: 0)' },
      { timestamp: '11:49:40', stageId: 'trivy', level: 'success', message: 'Security gate PASSED. Container compliant with capstone policy.' },
      { timestamp: '11:49:49', stageId: 'push', level: 'info', message: 'Logging into GitHub Container Registry ghcr.io...' },
      { timestamp: '11:50:02', stageId: 'push', level: 'info', message: 'Exporting layer sha256:4f4fb700ef54 [4.2MB]' },
      { timestamp: '11:50:18', stageId: 'push', level: 'info', message: 'Exporting layer sha256:a3ed95caeb02 [14.1MB]' },
      { timestamp: '11:50:31', stageId: 'push', level: 'success', message: 'Pushed image: ghcr.io/vinayak872/sample-app:e8f3c2a (digest: sha256:7b1e4c)' },
      { timestamp: '11:50:36', stageId: 'sync', level: 'info', message: 'Triggering ArgoCD webhook sync for app: sample-app' },
      { timestamp: '11:50:48', stageId: 'sync', level: 'info', message: 'Cluster kind-cloud05 received manifest diff for Deployment/sample-app' },
      { timestamp: '11:51:02', stageId: 'sync', level: 'info', message: 'Pod sample-app-699d79cfc4-p8w7k created (status: ContainerCreating)' },
      { timestamp: '11:51:14', stageId: 'sync', level: 'success', message: 'Readiness probe passed: http://localhost:3000/health (200 OK)' },
      { timestamp: '11:51:24', stageId: 'sync', level: 'success', message: 'Application sample-app synced successfully to revision e8f3c2a' },
    ]
  },
  {
    id: 'run-107',
    runNumber: 107,
    commitSha: '94bc301',
    commitMessage: 'fix(k8s): adjust deployment replica count and resources',
    author: {
      name: 'Guduguntla Priya',
      username: 'priya-v',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    },
    branch: 'main',
    event: 'push',
    status: 'success',
    startedAt: '2026-08-25T09:12:00Z',
    completedAt: '2026-08-25T09:15:10Z',
    totalDurationSeconds: 190,
    ghcrImage: 'ghcr.io/vinayak872/sample-app:94bc301',
    stages: [
      { id: 'build', name: 'Build', order: 1, status: 'success', durationSeconds: 30, description: 'Node 20 environment initialization' },
      { id: 'test', name: 'Test', order: 2, status: 'success', durationSeconds: 21, description: 'Unit testing suite' },
      { id: 'trivy', name: 'Trivy Scan', order: 3, status: 'success', durationSeconds: 39, description: 'Vulnerability scan' },
      { id: 'push', name: 'Push to GHCR', order: 4, status: 'success', durationSeconds: 48, description: 'GHCR image publish' },
      { id: 'sync', name: 'ArgoCD Sync', order: 5, status: 'success', durationSeconds: 52, description: 'GitOps auto-sync' },
    ],
    logs: [
      { timestamp: '09:12:00', stageId: 'build', level: 'info', message: 'Build started for commit 94bc301' },
      { timestamp: '09:12:30', stageId: 'test', level: 'success', message: 'All tests passed cleanly.' },
      { timestamp: '09:13:30', stageId: 'trivy', level: 'success', message: '0 vulnerabilities detected.' },
      { timestamp: '09:14:18', stageId: 'push', level: 'success', message: 'Image ghcr.io/vinayak872/sample-app:94bc301 pushed.' },
      { timestamp: '09:15:10', stageId: 'sync', level: 'success', message: 'ArgoCD reconciled 2 pods to Healthy state.' },
    ]
  },
  {
    id: 'run-106',
    runNumber: 106,
    commitSha: '6c1a89f',
    commitMessage: 'test(integration): add fault injection test for canary 500 error',
    author: {
      name: 'Atukuri Sri Geetha',
      username: 'geetha-a',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    },
    branch: 'main',
    event: 'push',
    status: 'success',
    startedAt: '2026-08-24T22:30:15Z',
    completedAt: '2026-08-24T22:33:20Z',
    totalDurationSeconds: 185,
    ghcrImage: 'ghcr.io/vinayak872/sample-app:6c1a89f',
    stages: [
      { id: 'build', name: 'Build', order: 1, status: 'success', durationSeconds: 28, description: 'Node dependencies resolved' },
      { id: 'test', name: 'Test', order: 2, status: 'success', durationSeconds: 20, description: 'Test assertions pass' },
      { id: 'trivy', name: 'Trivy Scan', order: 3, status: 'success', durationSeconds: 41, description: 'No CVEs found' },
      { id: 'push', name: 'Push to GHCR', order: 4, status: 'success', durationSeconds: 46, description: 'Layers uploaded' },
      { id: 'sync', name: 'ArgoCD Sync', order: 5, status: 'success', durationSeconds: 50, description: 'Cluster synchronized' },
    ],
    logs: [
      { timestamp: '22:30:15', stageId: 'build', level: 'info', message: 'Build initialized.' },
      { timestamp: '22:33:20', stageId: 'sync', level: 'success', message: 'Sync complete.' },
    ]
  },
  {
    id: 'run-105',
    runNumber: 105,
    commitSha: '2d87e1c',
    commitMessage: 'ci: add aqua trivy security scanner to github actions workflow',
    author: {
      name: 'Chittem Komalaa',
      username: 'komalaa-s',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    branch: 'main',
    event: 'pull_request',
    status: 'success',
    startedAt: '2026-08-24T18:14:00Z',
    completedAt: '2026-08-24T18:17:35Z',
    totalDurationSeconds: 215,
    ghcrImage: 'ghcr.io/vinayak872/sample-app:2d87e1c',
    stages: [
      { id: 'build', name: 'Build', order: 1, status: 'success', durationSeconds: 31, description: 'Build package' },
      { id: 'test', name: 'Test', order: 2, status: 'success', durationSeconds: 24, description: 'Execute tests' },
      { id: 'trivy', name: 'Trivy Scan', order: 3, status: 'success', durationSeconds: 55, description: 'Trivy initial DB load' },
      { id: 'push', name: 'Push to GHCR', order: 4, status: 'success', durationSeconds: 50, description: 'Publish image' },
      { id: 'sync', name: 'ArgoCD Sync', order: 5, status: 'success', durationSeconds: 55, description: 'Reconcile' },
    ],
    logs: [
      { timestamp: '18:14:00', stageId: 'build', level: 'info', message: 'Job started' },
      { timestamp: '18:17:35', stageId: 'sync', level: 'success', message: 'Job finished' },
    ]
  },
  {
    id: 'run-104',
    runNumber: 104,
    commitSha: 'b5a093e',
    commitMessage: 'refactor: isolate express app into createApp factory for testing',
    author: {
      name: 'Vinayak Kumar',
      username: 'vinayak872',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    branch: 'main',
    event: 'push',
    status: 'success',
    startedAt: '2026-08-24T14:02:11Z',
    completedAt: '2026-08-24T14:05:08Z',
    totalDurationSeconds: 177,
    ghcrImage: 'ghcr.io/vinayak872/sample-app:b5a093e',
    stages: [
      { id: 'build', name: 'Build', order: 1, status: 'success', durationSeconds: 29, description: 'Build package' },
      { id: 'test', name: 'Test', order: 2, status: 'success', durationSeconds: 19, description: 'Execute tests' },
      { id: 'trivy', name: 'Trivy Scan', order: 3, status: 'success', durationSeconds: 40, description: 'Trivy scan' },
      { id: 'push', name: 'Push to GHCR', order: 4, status: 'success', durationSeconds: 44, description: 'Push image' },
      { id: 'sync', name: 'ArgoCD Sync', order: 5, status: 'success', durationSeconds: 45, description: 'Cluster sync' },
    ],
    logs: [
      { timestamp: '14:02:11', stageId: 'build', level: 'info', message: 'Testing app factory refactoring' },
    ]
  },
  {
    id: 'run-103',
    runNumber: 103,
    commitSha: 'f1c49b2',
    commitMessage: 'test: simulate faulty readiness probe for rollback verification',
    author: {
      name: 'Guduguntla Priya',
      username: 'priya-v',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    },
    branch: 'chaos/readiness-fail',
    event: 'push',
    status: 'failed',
    startedAt: '2026-08-24T10:20:00Z',
    completedAt: '2026-08-24T10:23:15Z',
    totalDurationSeconds: 195,
    ghcrImage: 'ghcr.io/vinayak872/sample-app:f1c49b2',
    stages: [
      { id: 'build', name: 'Build', order: 1, status: 'success', durationSeconds: 30, description: 'Build ok' },
      { id: 'test', name: 'Test', order: 2, status: 'success', durationSeconds: 22, description: 'Tests ok' },
      { id: 'trivy', name: 'Trivy Scan', order: 3, status: 'success', durationSeconds: 38, description: 'Scan ok' },
      { id: 'push', name: 'Push to GHCR', order: 4, status: 'success', durationSeconds: 45, description: 'Push ok' },
      { id: 'sync', name: 'ArgoCD Sync', order: 5, status: 'failed', durationSeconds: 60, description: 'Deployment readiness timeout' },
    ],
    logs: [
      { timestamp: '10:20:00', stageId: 'build', level: 'info', message: 'Build started on chaos branch' },
      { timestamp: '10:22:15', stageId: 'sync', level: 'error', message: 'Error: readiness probe failed: connection refused on /health' },
      { timestamp: '10:23:00', stageId: 'sync', level: 'warn', message: 'ArgoCD detected Degraded state. Auto-revert triggered.' },
      { timestamp: '10:23:15', stageId: 'sync', level: 'error', message: 'Pipeline run failed at ArgoCD Sync stage.' },
    ]
  },
  {
    id: 'run-102',
    runNumber: 102,
    commitSha: '8d2039a',
    commitMessage: 'feat(docker): optimize multi-stage build and alpine base',
    author: {
      name: 'Vinayak Kumar',
      username: 'vinayak872',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    branch: 'main',
    event: 'push',
    status: 'success',
    startedAt: '2026-08-23T20:10:00Z',
    completedAt: '2026-08-23T20:13:02Z',
    totalDurationSeconds: 182,
    ghcrImage: 'ghcr.io/vinayak872/sample-app:8d2039a',
    stages: [
      { id: 'build', name: 'Build', order: 1, status: 'success', durationSeconds: 27, description: 'Build ok' },
      { id: 'test', name: 'Test', order: 2, status: 'success', durationSeconds: 20, description: 'Test ok' },
      { id: 'trivy', name: 'Trivy Scan', order: 3, status: 'success', durationSeconds: 42, description: 'Scan ok' },
      { id: 'push', name: 'Push to GHCR', order: 4, status: 'success', durationSeconds: 43, description: 'Push ok' },
      { id: 'sync', name: 'ArgoCD Sync', order: 5, status: 'success', durationSeconds: 50, description: 'Sync ok' },
    ],
    logs: [
      { timestamp: '20:10:00', stageId: 'build', level: 'info', message: 'Alpine 3.20 base image reduction verified' },
    ]
  },
  {
    id: 'run-101',
    runNumber: 101,
    commitSha: '4e99a1f',
    commitMessage: 'docs: add architecture comparison notes for ArgoCD vs Flux',
    author: {
      name: 'Atukuri Sri Geetha',
      username: 'geetha-a',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    },
    branch: 'main',
    event: 'push',
    status: 'success',
    startedAt: '2026-08-23T16:05:00Z',
    completedAt: '2026-08-23T16:07:45Z',
    totalDurationSeconds: 165,
    ghcrImage: 'ghcr.io/vinayak872/sample-app:4e99a1f',
    stages: [
      { id: 'build', name: 'Build', order: 1, status: 'success', durationSeconds: 25, description: 'Build ok' },
      { id: 'test', name: 'Test', order: 2, status: 'success', durationSeconds: 18, description: 'Test ok' },
      { id: 'trivy', name: 'Trivy Scan', order: 3, status: 'success', durationSeconds: 38, description: 'Scan ok' },
      { id: 'push', name: 'Push to GHCR', order: 4, status: 'success', durationSeconds: 41, description: 'Push ok' },
      { id: 'sync', name: 'ArgoCD Sync', order: 5, status: 'success', durationSeconds: 43, description: 'Sync ok' },
    ],
    logs: [
      { timestamp: '16:05:00', stageId: 'build', level: 'info', message: 'Docs update' },
    ]
  },
  {
    id: 'run-100',
    runNumber: 100,
    commitSha: '1a5509d',
    commitMessage: 'chore(k8s): configure service port 80 to target port 3000',
    author: {
      name: 'Chittem Komalaa',
      username: 'komalaa-s',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    branch: 'main',
    event: 'push',
    status: 'success',
    startedAt: '2026-08-22T19:30:00Z',
    completedAt: '2026-08-22T19:33:10Z',
    totalDurationSeconds: 190,
    ghcrImage: 'ghcr.io/vinayak872/sample-app:1a5509d',
    stages: [
      { id: 'build', name: 'Build', order: 1, status: 'success', durationSeconds: 30, description: 'Build' },
      { id: 'test', name: 'Test', order: 2, status: 'success', durationSeconds: 20, description: 'Test' },
      { id: 'trivy', name: 'Trivy Scan', order: 3, status: 'success', durationSeconds: 45, description: 'Scan' },
      { id: 'push', name: 'Push to GHCR', order: 4, status: 'success', durationSeconds: 47, description: 'Push' },
      { id: 'sync', name: 'ArgoCD Sync', order: 5, status: 'success', durationSeconds: 48, description: 'Sync' },
    ],
    logs: [
      { timestamp: '19:30:00', stageId: 'build', level: 'info', message: 'Port mapping verified' },
    ]
  },
  {
    id: 'run-99',
    runNumber: 99,
    commitSha: '0fc7b3a',
    commitMessage: 'initial commit: scaffold cloud05 gitops repository structure',
    author: {
      name: 'Vinayak Kumar',
      username: 'vinayak872',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    branch: 'main',
    event: 'push',
    status: 'success',
    startedAt: '2026-08-21T12:00:00Z',
    completedAt: '2026-08-21T12:03:40Z',
    totalDurationSeconds: 220,
    ghcrImage: 'ghcr.io/vinayak872/sample-app:0fc7b3a',
    stages: [
      { id: 'build', name: 'Build', order: 1, status: 'success', durationSeconds: 35, description: 'Scaffold' },
      { id: 'test', name: 'Test', order: 2, status: 'success', durationSeconds: 25, description: 'Init test' },
      { id: 'trivy', name: 'Trivy Scan', order: 3, status: 'success', durationSeconds: 50, description: 'Init scan' },
      { id: 'push', name: 'Push to GHCR', order: 4, status: 'success', durationSeconds: 55, description: 'Init push' },
      { id: 'sync', name: 'ArgoCD Sync', order: 5, status: 'success', durationSeconds: 55, description: 'Init sync' },
    ],
    logs: [
      { timestamp: '12:00:00', stageId: 'build', level: 'info', message: 'Initial project setup' },
    ]
  }
];

export async function getPipelineRuns(): Promise<PipelineRun[]> {
  try {
    const res = await fetch('http://localhost:3001/api/pipeline/runs');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // Graceful fallback to local mock data if proxy is offline
  }
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...MOCK_PIPELINE_RUNS];
}

export async function getPipelineRunById(id: string): Promise<PipelineRun | null> {
  try {
    const res = await fetch(`http://localhost:3001/api/pipeline/runs/${id}/jobs`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const matching = MOCK_PIPELINE_RUNS.find((r) => r.id === id);
        if (matching) {
          return { ...matching, stages: json.data.stages, logs: json.data.logs };
        }
      }
    }
  } catch {
    // Fallback
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_PIPELINE_RUNS.find((r) => r.id === id) || null;
}

export async function triggerMockRun(): Promise<PipelineRun> {
  try {
    const res = await fetch('http://localhost:3001/api/pipeline/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch: 'main' }),
    });
    if (res.ok) {
      console.log('Real workflow trigger sent to GitHub Actions proxy');
    }
  } catch {
    // Simulated fallback
  }

  await new Promise((resolve) => setTimeout(resolve, 300));
  const newRun: PipelineRun = {
    id: `run-${Date.now().toString().slice(-4)}`,
    runNumber: MOCK_PIPELINE_RUNS.length + 99,
    commitSha: Math.random().toString(16).substring(2, 9),
    commitMessage: 'manual trigger: test progressive delivery reconciliation',
    author: {
      name: 'Vinayak Kumar',
      username: 'vinayak872',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    branch: 'main',
    event: 'workflow_dispatch',
    status: 'running',
    startedAt: new Date().toISOString(),
    totalDurationSeconds: 45,
    stages: [
      { id: 'build', name: 'Build', order: 1, status: 'success', durationSeconds: 28, description: 'Node runtime ok' },
      { id: 'test', name: 'Test', order: 2, status: 'running', description: 'Running test suites...' },
      { id: 'trivy', name: 'Trivy Scan', order: 3, status: 'pending', description: 'Waiting for tests' },
      { id: 'push', name: 'Push to GHCR', order: 4, status: 'pending', description: 'Waiting for scan' },
      { id: 'sync', name: 'ArgoCD Sync', order: 5, status: 'pending', description: 'Waiting for image' },
    ],
    logs: [
      { timestamp: new Date().toLocaleTimeString(), stageId: 'build', level: 'info', message: 'Manual dispatch triggered.' },
      { timestamp: new Date().toLocaleTimeString(), stageId: 'build', level: 'success', message: 'Build passed.' },
      { timestamp: new Date().toLocaleTimeString(), stageId: 'test', level: 'info', message: 'Running test runner...' },
    ]
  };
  MOCK_PIPELINE_RUNS.unshift(newRun);
  return newRun;
}
