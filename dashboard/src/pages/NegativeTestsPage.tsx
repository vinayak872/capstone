import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  RefreshCw, 
  Play, 
  Search,
  Activity
} from 'lucide-react';
import { NegativeTestCase, NegativeTestSummary } from '../types/negativeTests';
import { getNegativeTests, getNegativeTestSummary, retestScenario } from '../mocks/negativeTestsMock';
import { StatusBadge } from '../components/StatusBadge';

interface NegativeTestsPageProps {
  onNotify?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const NegativeTestsPage: React.FC<NegativeTestsPageProps> = ({ onNotify }) => {
  const [tests, setTests] = useState<NegativeTestCase[]>([]);
  const [summary, setSummary] = useState<NegativeTestSummary | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>('chaos-01');
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [testData, summaryData] = await Promise.all([
        getNegativeTests(),
        getNegativeTestSummary(),
      ]);
      setTests(testData);
      setSummary(summaryData);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleRetest = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTestingId(id);
    try {
      const res = await retestScenario(id);
      setTests((prev) => prev.map((t) => (t.id === id ? res.result : t)));
      if (onNotify) {
        onNotify('success', 'Chaos Scenario Retested', `Test #${res.result.testNumber} (${res.result.title}) passed all assertions in ${res.result.recoveryTimeSeconds}s.`);
      }
    } catch {
      if (onNotify) onNotify('error', 'Test Failed', 'Chaos execution threw unexpected exception');
    } finally {
      setTestingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-400" />
          <p className="text-sm font-mono">Loading chaos engineering & resilience test suite results...</p>
        </div>
      </div>
    );
  }

  const filteredTests = tests.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.faultDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Top Banner with Pass Rate Summary Chip */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Fault-Injection & Chaos Resilience Suite</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              5 Mandatory Negative Test Scenarios
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Validates cluster survivability, instant automated rollbacks, network partition tolerance, duplicate-event idempotency, and graceful connection draining.
            </p>
          </div>

          {/* Summary Chips */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 shadow-glow-emerald flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-emerald-300 font-bold block">
                  Suite Pass Rate
                </span>
                <span className="text-lg font-extrabold text-white font-mono">
                  {summary.passed} / {summary.total} Passing (100%)
                </span>
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-right font-mono">
              <span className="text-[10px] text-slate-500 uppercase block">Avg Recovery Time</span>
              <span className="text-sm font-bold text-sky-400">{summary.averageRecoveryTimeSeconds} seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tests Table with Expandable Evidence */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Resilience Test Specifications & Evidence Records
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any scenario to expand full injected chaos parameters, recovery timing vs threshold, and terminal log evidence.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search test name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-full sm:w-64 font-mono transition-all"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredTests.map((test) => {
            const isExpanded = expandedId === test.id;
            const isRetesting = testingId === test.id;

            return (
              <div
                key={test.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-900/90 border-sky-500/40 shadow-glow-cyan'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(test.id)}
                  className="p-5 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-sm text-sky-400 shrink-0">
                      0{test.testNumber}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-white tracking-wide">
                          {test.title}
                        </h4>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {test.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">
                        {test.faultDescription}
                      </p>
                    </div>
                  </div>

                  {/* Metadata and Result */}
                  <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                    <div className="text-right hidden sm:block">
                      <div className="text-slate-400 text-[11px]">Last Run:</div>
                      <div className="text-slate-200 text-xs font-semibold">{test.lastRunDate}</div>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                      <div className="text-[10px] text-slate-500 uppercase">Recovery</div>
                      <div className="font-bold text-emerald-400">{test.recoveryTimeSeconds}s</div>
                    </div>

                    <StatusBadge status={test.result} size="md" />

                    <button
                      onClick={(e) => handleRetest(test.id, e)}
                      disabled={isRetesting}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-50"
                      title="Retest scenario"
                    >
                      <Play className={`w-3.5 h-3.5 text-emerald-400 fill-emerald-400 ${isRetesting ? 'animate-spin' : ''}`} />
                    </button>

                    <div className="text-slate-500">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expandable Evidence Drawer */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-800 bg-[#060a14] space-y-6 animate-fadeIn">
                    {/* Execution Parameters & Outcomes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <div className="text-[11px] font-bold uppercase text-sky-400">
                          Injected Fault Command & Mechanism
                        </div>
                        <div className="p-2.5 rounded bg-black/60 border border-slate-800 text-slate-300 break-all text-[11px]">
                          <code>{test.evidence.commandExecuted}</code>
                        </div>
                        <div className="text-slate-400 text-[11px] pt-1">
                          <span className="text-slate-500">Timing:</span> Injected at {test.evidence.injectedAt} &rarr; Recovered at {test.evidence.recoveredAt}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <div className="text-[11px] font-bold uppercase text-emerald-400">
                          Outcome Verification
                        </div>
                        <div className="text-slate-300 leading-relaxed font-sans text-xs">
                          <strong className="text-slate-200">Expected:</strong> {test.evidence.expectedOutcome}
                        </div>
                        <div className="text-emerald-300 leading-relaxed font-sans text-xs pt-1">
                          <strong>Observed:</strong> {test.evidence.actualOutcome}
                        </div>
                      </div>
                    </div>

                    {/* Metrics Comparison Table */}
                    <div>
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-sky-400" />
                        <span>Observed Subsystem State Dynamics</span>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                            <tr>
                              <th className="py-2.5 px-4">Metric Observed</th>
                              <th className="py-2.5 px-4">Pre-Fault Normal</th>
                              <th className="py-2.5 px-4">During Fault Injection</th>
                              <th className="py-2.5 px-4">Post-Recovery Stabilized</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {test.evidence.metricsObserved.map((m, idx) => (
                              <tr key={idx}>
                                <td className="py-2.5 px-4 font-bold text-slate-200">{m.name}</td>
                                <td className="py-2.5 px-4 text-slate-400">{m.preFault}</td>
                                <td className="py-2.5 px-4 text-amber-300 font-semibold">{m.duringFault}</td>
                                <td className="py-2.5 px-4 text-emerald-400 font-bold">{m.postRecovery}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Formatted Terminal Evidence Log */}
                    <div>
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-sky-400" />
                        <span>Evidence Log Output</span>
                      </div>

                      <div className="p-4 rounded-xl bg-[#04060c] border border-slate-800/80 font-mono text-xs text-slate-300 space-y-1">
                        {test.evidence.logSnippet.map((line, idx) => {
                          const isPass = line.includes('[PASS]') || line.includes('[SUCCESS]');
                          const isWarn = line.includes('[WARN]');
                          const isChaos = line.includes('[CHAOS]');

                          return (
                            <div
                              key={idx}
                              className={`leading-relaxed ${
                                isPass
                                  ? 'text-emerald-400 font-bold'
                                  : isWarn
                                  ? 'text-amber-300'
                                  : isChaos
                                  ? 'text-rose-400 font-semibold'
                                  : 'text-slate-300'
                              }`}
                            >
                              {line}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Document Artifact Reference */}
                    <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-500 border-t border-slate-800/80">
                      <span>Artifact: <code className="text-sky-400">{test.docReference}</code></span>
                      <span className="text-slate-400">Threshold: {test.evidence.thresholdSeconds}s Max</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
