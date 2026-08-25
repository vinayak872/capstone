import { Router, Request, Response } from 'express';
import { githubService } from '../services/github';

export const githubRouter = Router();

// GET /api/pipeline/runs - List last 10 workflow runs
githubRouter.get('/runs', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const runs = await githubService.getWorkflowRuns(limit);
    res.json({
      success: true,
      count: runs.length,
      data: runs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch pipeline runs from GitHub Actions',
    });
  }
});

// GET /api/pipeline/runs/:runId/jobs - Get step jobs summary & logs for a run
githubRouter.get('/runs/:runId/jobs', async (req: Request, res: Response) => {
  try {
    const { runId } = req.params;
    const details = await githubService.getWorkflowRunJobs(runId);
    res.json({
      success: true,
      data: details,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch jobs summary for workflow run',
    });
  }
});

// POST /api/pipeline/trigger - Trigger workflow dispatch
githubRouter.post('/trigger', async (req: Request, res: Response) => {
  try {
    const { branch, ref } = req.body;
    const targetRef = branch || ref || 'main';
    const result = await githubService.triggerWorkflow(targetRef);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to trigger workflow dispatch',
    });
  }
});
