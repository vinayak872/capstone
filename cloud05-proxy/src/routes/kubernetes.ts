import { Router, Request, Response } from 'express';
import { kubernetesService } from '../services/kubernetes';
import { config } from '../config';

export const kubernetesRouter = Router();

// GET /api/k8s/pods - List pods with readiness, status, restart count, age
kubernetesRouter.get('/pods', async (req: Request, res: Response) => {
  try {
    const namespace = (req.query.namespace as string) || config.k8s.namespace;
    const pods = await kubernetesService.getPods(namespace);
    res.json({
      success: true,
      count: pods.length,
      namespace,
      data: pods,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to list Kubernetes pods',
    });
  }
});

// GET /api/k8s/deployments - List deployments (desired vs available replicas)
kubernetesRouter.get('/deployments', async (req: Request, res: Response) => {
  try {
    const namespace = (req.query.namespace as string) || config.k8s.namespace;
    const deployments = await kubernetesService.getDeployments(namespace);
    res.json({
      success: true,
      count: deployments.length,
      namespace,
      data: deployments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to list Kubernetes deployments',
    });
  }
});
