import React, { useState } from 'react';
import { Terminal, Copy, Check, Search, Filter } from 'lucide-react';
import { PipelineLogEntry } from '../types/pipeline';

interface TerminalViewerProps {
  logs: PipelineLogEntry[];
  title?: string;
  stageNames?: { [stageId: string]: string };
  defaultHeight?: string;
}

export const TerminalViewer: React.FC<TerminalViewerProps> = ({
  logs,
  title = 'Step Execution Console Output',
  stageNames = {},
  defaultHeight = 'h-80',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const stages = Array.from(new Set(logs.map((l) => l.stageId)));

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || log.stageId === selectedStage;
    return matchesSearch && matchesStage;
  });

  const handleCopy = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.stageId.toUpperCase()}] [${l.level.toUpperCase()}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-emerald-400 font-medium';
      case 'error':
        return 'text-rose-400 font-semibold bg-rose-950/30 px-1 rounded';
      case 'warn':
        return 'text-amber-300';
      case 'debug':
        return 'text-slate-500';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0a0f1d] overflow-hidden shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <Terminal className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold tracking-wide text-slate-300 font-mono">
            {title}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            ({filteredLogs.length} lines)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Stage Filter */}
          {stages.length > 1 && (
            <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/60 rounded-lg px-2 py-1">
              <Filter className="w-3 h-3 text-slate-400" />
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Stages</option>
                {stages.map((s) => (
                  <option key={s} value={s} className="bg-slate-900">
                    {stageNames[s] || s.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800/80 border border-slate-700/60 rounded-lg pl-7 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-36 sm:w-48 transition-all"
            />
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Copy logs to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Log lines viewport */}
      <div
        className={`${defaultHeight} overflow-y-auto p-4 font-mono text-xs leading-relaxed space-y-1 bg-[#050811] text-slate-300 selection:bg-sky-900/60`}
      >
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-8">
            <Terminal className="w-8 h-8 mb-2 opacity-40" />
            <p>No matching log entries found.</p>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={index}
              className="flex items-start gap-3 hover:bg-slate-900/60 py-0.5 px-1.5 rounded transition-colors group"
            >
              <span className="text-slate-600 select-none text-[11px] w-8 text-right shrink-0">
                {index + 1}
              </span>
              <span className="text-slate-500 select-none text-[11px] shrink-0">
                [{log.timestamp}]
              </span>
              <span className="text-sky-400/80 uppercase font-semibold text-[10px] px-1.5 py-0.2 bg-sky-950/40 rounded border border-sky-800/30 shrink-0">
                {stageNames[log.stageId] || log.stageId}
              </span>
              <span className={`break-all flex-1 ${getLevelColor(log.level)}`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
