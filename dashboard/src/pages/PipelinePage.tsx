import React, { useState, useEffect } from 'react';
import { 
  GitCommit, 
  GitBranch, 
  Clock, 
  Box, 
  RefreshCw, 
  Play, 
  Terminal as TerminalIcon,
  Search
} from 'lucide-react';
import { PipelineRun } from '../types/pipeline';
import { getPipelineRuns, triggerMockRun } from '../mocks/pipelineMock';
import { StatusBadge } from '../components/StatusBadge';
import { TerminalViewer } from '../components/TerminalViewer';

interface PipelinePageProps {
  onNotify?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const PipelinePage: React.FC<PipelinePageProps> = ({ onNotify }) => {
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string>('run-108');
  const [loading, setLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getPipelineRuns();
      setRuns(data);
      if (data.length > 0) {
        setSelectedRunId(data[0].id);
      }
      setLoading(false);
    }
    loadData();

    // Auto-poll runs from backend proxy every 10s
    const pollTimer = setInterval(async () => {
      const latest = await getPipelineRuns();
      setRuns((prev) => {
        // Keep in-memory progressive runs if active
        const hasRunning = prev.some((r) => r.status === 'running');
        if (hasRunning) return prev;
        return latest;
      });
    }, 10000);

    return () => clearInterval(pollTimer);
  }, []);

  // Progressive live simulation for active running pipelines
  useEffect(() => {
    const runningRun = runs.find((r) => r.status === 'running');
    if (!runningRun) return;

    const timer = setInterval(() => {
      setRuns((prevRuns) =>
        prevRuns.map((run) => {
          if (run.status !== 'running') return run;

          const stages = [...run.stages];
          const logs = [...run.logs];
          const activeStageIdx = stages.findIndex((s) => s.status === 'running');

          if (activeStageIdx === -1) {
            // Start first pending stage
            const firstPendingIdx = stages.findIndex((s) => s.status === 'pending');
            if (firstPendingIdx !== -1) {
              stages[firstPendingIdx].status = 'running';
            }
            return { ...run, stages };
          }

          // Complete current stage
          stages[activeStageIdx].status = 'success';
          stages[activeStageIdx].durationSeconds = (stages[activeStageIdx].durationSeconds || 15) + Math.floor(Math.random() * 5);

          const time = new Date().toLocaleTimeString();

          // Move to next stage or finish run
          if (activeStageIdx < stages.length - 1) {
            const nextIdx = activeStageIdx + 1;
            stages[nextIdx].status = 'running';

            if (stages[nextIdx].id === 'trivy') {
              logs.push({ timestamp: time, stageId: 'trivy', level: 'info', message: 'Initializing Aqua Security Trivy image scanner...' });
              logs.push({ timestamp: time, stageId: 'trivy', level: 'success', message: 'Trivy Scan PASSED: 0 critical vulnerabilities found in image layers.' });
            } else if (stages[nextIdx].id === 'push') {
              logs.push({ timestamp: time, stageId: 'push', level: 'info', message: 'Publishing container image to ghcr.io/vinayak872/sample-app...' });
              logs.push({ timestamp: time, stageId: 'push', level: 'success', message: `Image pushed: ghcr.io/vinayak872/sample-app:${run.commitSha} (digest: sha256:8f1e)` });
            } else if (stages[nextIdx].id === 'sync') {
              logs.push({ timestamp: time, stageId: 'sync', level: 'info', message: 'Webhook sent to ArgoCD Application Controller on kind-cloud05...' });
              logs.push({ timestamp: time, stageId: 'sync', level: 'info', message: 'Reconciling Deployment/sample-app manifests in namespace default...' });
            }

            return { ...run, stages, logs };
          } else {
            // All 5 stages completed!
            logs.push({ timestamp: time, stageId: 'sync', level: 'success', message: `ArgoCD successfully reconciled application to revision ${run.commitSha}` });
            logs.push({ timestamp: time, stageId: 'sync', level: 'success', message: '🎉 Pipeline run completed successfully across all 5 stages!' });

            if (onNotify) {
              onNotify('success', 'Pipeline Succeeded', `Run #${run.runNumber} (${run.commitSha}) fully built, scanned & synced to cluster!`);
            }

            return {
              ...run,
              status: 'success',
              completedAt: new Date().toISOString(),
              stages,
              logs,
            };
          }
        })
      );
    }, 3200);

    return () => clearInterval(timer);
  }, [runs, onNotify]);

  const handleTriggerRun = async () => {
    setIsTriggering(true);
    try {
      const newRun = await triggerMockRun();
      setRuns((prev) => [newRun, ...prev]);
      setSelectedRunId(newRun.id);
      if (onNotify) {
        onNotify('success', 'Pipeline Dispatched', `Run #${newRun.runNumber} triggered on branch main (SHA: ${newRun.commitSha})`);
      }
    } catch {
      if (onNotify) onNotify('error', 'Trigger Failed', 'Failed to dispatch workflow run');
    } finally {
      setIsTriggering(false);
    }
  };

  const activeRun = runs.find((r) => r.id === selectedRunId) || runs[0];

  const filteredRuns = runs.filter((r) => 
    r.commitMessage.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.commitSha.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.author.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const stageDisplayNames: Record<string, string> = {
    build: 'Build',
    test: 'Test',
    trivy: 'Trivy Scan',
    push: 'Push to GHCR',
    sync: 'ArgoCD Sync',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-400" />
          <p className="text-sm font-mono">Loading CI/CD pipeline runs from GitHub Actions & ArgoCD...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Top Banner with Active Run Summary & Trigger */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
                Active Execution Inspection
              </span>
              <span className="text-xs text-slate-500 font-mono">Run #{activeRun?.runNumber}</span>
              <StatusBadge status={activeRun?.status || 'success'} size="sm" />
            </div>
            
            <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-3">
              <span>{activeRun?.commitMessage}</span>
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3 font-mono">
              <div className="flex items-center gap-1.5">
                <img
                  src={activeRun?.author.avatarUrl}
                  alt={activeRun?.author.name}
                  className="w-4 h-4 rounded-full"
                />
                <span className="text-slate-200">{activeRun?.author.name}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <GitBranch className="w-3.5 h-3.5 text-sky-400" />
                <span>{activeRun?.branch}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <GitCommit className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-sky-300 font-semibold">{activeRun?.commitSha}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Duration: {activeRun?.totalDurationSeconds}s</span>
              </div>
              {activeRun?.ghcrImage && (
                <div className="flex items-center gap-1 text-slate-400 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded">
                  <Box className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-purple-300">{activeRun?.ghcrImage}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleTriggerRun}
            disabled={isTriggering}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 text-xs font-bold text-white shadow-glow-cyan transition-all shrink-0"
          >
            <Play className={`w-4 h-4 fill-white ${isTriggering ? 'animate-spin' : ''}`} />
            <span>{isTriggering ? 'Dispatching...' : 'Trigger New Pipeline Run'}</span>
          </button>
        </div>

        {/* 5-Stage Horizontal Stepper */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>CI/CD Pipeline Stages (5 Steps)</span>
            <span className="text-[11px] font-mono text-slate-500">Node.js 20 &rarr; Mocha &rarr; Trivy &rarr; GHCR &rarr; ArgoCD</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {activeRun?.stages.map((stage, idx) => {
              const isLast = idx === activeRun.stages.length - 1;
              const isSuccess = stage.status === 'success';
              const isRunning = stage.status === 'running';
              const isFailed = stage.status === 'failed';

              return (
                <div
                  key={stage.id}
                  className={`relative p-4 rounded-xl border transition-all ${
                    isRunning
                      ? 'bg-sky-950/40 border-sky-500/50 shadow-glow-cyan ring-1 ring-sky-400/30'
                      : isFailed
                      ? 'bg-rose-950/40 border-rose-500/50'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold font-mono text-slate-500 uppercase">
                      Stage {idx + 1}
                    </span>
                    <StatusBadge status={stage.status} size="sm" />
                  </div>

                  <div className="font-bold text-sm text-white tracking-wide">
                    {stage.name}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {stage.description}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Duration:</span>
                    <span className="text-slate-200 font-semibold">
                      {stage.durationSeconds ? `${stage.durationSeconds}s` : 'In Progress'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Execution Logs Terminal for Active Run */}
      {activeRun && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Step-by-Step Monospace Terminal Logs (Run #{activeRun.runNumber})
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              SHA: {activeRun.commitSha} • Branch: {activeRun.branch}
            </span>
          </div>

          <TerminalViewer
            logs={activeRun.logs}
            title={`GitHub Actions + ArgoCD Reconciliation Log (${activeRun.id})`}
            stageNames={stageDisplayNames}
            defaultHeight="h-72"
          />
        </div>
      )}

      {/* Last 10 Pipeline Runs Table */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Pipeline Run History (Last 10 Runs)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any run row to inspect its 5-stage stepper and step-by-step terminal execution logs.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by commit, author, or message..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-full sm:w-72 font-mono transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#080d19]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Run #</th>
                <th className="py-3 px-4">Commit / Message</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Stages</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRuns.map((run) => {
                const isSelected = run.id === selectedRunId;

                return (
                  <tr
                    key={run.id}
                    onClick={() => setSelectedRunId(run.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-sky-950/40 text-white font-medium border-l-4 border-l-sky-400'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      #{run.runNumber}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-sky-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-[11px]">
                          {run.commitSha}
                        </span>
                        <span className="text-slate-200 truncate font-sans text-xs">
                          {run.commitMessage}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 font-sans">
                        <img
                          src={run.author.avatarUrl}
                          alt={run.author.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-slate-300 text-xs">{run.author.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="inline-flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                        <GitBranch className="w-3 h-3 text-sky-400" />
                        {run.branch}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={run.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {run.totalDurationSeconds}s
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {run.stages.map((st) => (
                          <div
                            key={st.id}
                            title={`${st.name}: ${st.status}`}
                            className={`w-2.5 h-2.5 rounded-full ${
                              st.status === 'success'
                                ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                                : st.status === 'running'
                                ? 'bg-sky-400 animate-pulse'
                                : st.status === 'failed'
                                ? 'bg-rose-400'
                                : 'bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                          isSelected
                            ? 'bg-sky-500 text-white border-sky-400'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? 'Inspecting' : 'View Logs'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
