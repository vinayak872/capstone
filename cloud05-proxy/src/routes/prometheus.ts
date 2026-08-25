import { Router, Request, Response } from 'express';
import { prometheusService } from '../services/prometheus';

export const prometheusRouter = Router();

// GET /api/metrics/health - Run PromQL queries for canary/service SLA health
prometheusRouter.get('/health', async (_req: Request, res: Response) => {
  try {
    const checks = await prometheusService.getHealthMetrics();
    res.json({
      success: true,
      count: checks.length,
      data: checks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to query Prometheus metrics',
    });
  }
});
