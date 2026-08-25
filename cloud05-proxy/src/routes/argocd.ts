import { Router, Request, Response } from 'express';
import { argocdService } from '../services/argocd';
import { config } from '../config';

export const argocdRouter = Router();

// GET /api/gitops/argocd/status - Sync status, health, and metadata for sample-app
argocdRouter.get('/status', async (req: Request, res: Response) => {
  try {
    const appName = (req.query.app as string) || config.argocd.appName;
    const status = await argocdService.getApplicationStatus(appName);
    res.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch ArgoCD status',
    });
  }
});

// POST /api/gitops/argocd/sync - Force manual sync
argocdRouter.post('/sync', async (req: Request, res: Response) => {
  try {
    const appName = req.body.app || config.argocd.appName;
    const prune = req.body.prune !== false;
    const result = await argocdService.syncApplication(appName, prune);
    res.json({
      success: true,
      message: result.message,
      timestamp: result.timestamp,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to trigger ArgoCD sync',
    });
  }
});

// GET /api/gitops/argocd/history - Recent sync history entries
argocdRouter.get('/history', async (req: Request, res: Response) => {
  try {
    const appName = (req.query.app as string) || config.argocd.appName;
    const history = await argocdService.getHistory(appName);
    res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch ArgoCD history',
    });
  }
});
