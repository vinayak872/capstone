import { Router, Request, Response } from 'express';
import { doraService } from '../services/dora';

export const doraRouter = Router();

// GET /api/dora/summary - Compute 4 DORA metrics & 30-day historical points
doraRouter.get('/summary', async (_req: Request, res: Response) => {
  try {
    const summary = await doraService.calculateDoraMetrics();
    res.json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to compute DORA metrics',
    });
  }
});
