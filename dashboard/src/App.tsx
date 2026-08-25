import React, { useState } from 'react';
import { Sidebar, NavTabId } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ToastContainer, ToastMessage } from './components/Toast';
import { PipelinePage } from './pages/PipelinePage';
import { GitOpsSyncPage } from './pages/GitOpsSyncPage';
import { DoraMetricsPage } from './pages/DoraMetricsPage';
import { RolloutsPage } from './pages/RolloutsPage';
import { NegativeTestsPage } from './pages/NegativeTestsPage';
import { triggerGitOpsSync } from './mocks/syncMock';
import { triggerMockRun } from './mocks/pipelineMock';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTabId>('pipeline');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isGlobalSyncing, setIsGlobalSyncing] = useState(false);
  const [commitSha, setCommitSha] = useState('e8f3c2a');

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleGlobalSync = async () => {
    setIsGlobalSyncing(true);
    try {
      const res = await triggerGitOpsSync('argo');
      addToast('success', 'GitOps Sync Completed', res.message);
    } catch {
      addToast('error', 'Sync Failed', 'Failed to communicate with ArgoCD API server');
    } finally {
      setIsGlobalSyncing(false);
    }
  };

  const handleGlobalRun = async () => {
    try {
      const newRun = await triggerMockRun();
      setCommitSha(newRun.commitSha);
      addToast('success', 'Pipeline Run Dispatched', `Run #${newRun.runNumber} triggered on branch main (${newRun.commitSha})`);
    } catch {
      addToast('error', 'Trigger Failed', 'Failed to trigger workflow');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070b14] text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Topbar
          activeTab={activeTab}
          commitSha={commitSha}
          branch="main"
          onTriggerSync={handleGlobalSync}
          onTriggerRun={handleGlobalRun}
          isSyncing={isGlobalSyncing}
        />

        <main className="flex-1 pb-16">
          {activeTab === 'pipeline' && <PipelinePage onNotify={addToast} />}
          {activeTab === 'sync' && <GitOpsSyncPage onNotify={addToast} />}
          {activeTab === 'dora' && <DoraMetricsPage />}
          {activeTab === 'rollouts' && <RolloutsPage onNotify={addToast} />}
          {activeTab === 'negative-tests' && <NegativeTestsPage onNotify={addToast} />}
        </main>
      </div>

      {/* Floating Notification System */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
