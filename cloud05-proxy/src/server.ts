import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import { githubRouter } from './routes/github';
import { argocdRouter } from './routes/argocd';
import { kubernetesRouter } from './routes/kubernetes';
import { prometheusRouter } from './routes/prometheus';
import { doraRouter } from './routes/dora';

const app = express();

// Middleware
app.use(cors({
  origin: [config.corsOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());

// Request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'cloud05-proxy',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    integrations: {
      github: {
        configured: Boolean(config.github.token),
        target: `${config.github.owner}/${config.github.repo}`,
      },
      argocd: {
        server: config.argocd.server,
        appName: config.argocd.appName,
      },
      kubernetes: {
        namespace: config.k8s.namespace,
      },
      prometheus: {
        url: config.prometheus.url,
      },
    },
  });
});

// Mount domain routes
app.use('/api/pipeline', githubRouter);
app.use('/api/gitops/argocd', argocdRouter);
app.use('/api/k8s', kubernetesRouter);
app.use('/api/metrics', prometheusRouter);
app.use('/api/dora', doraRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.method} ${req.originalUrl}' not found on cloud05-proxy`,
    availableRoutes: [
      'GET  /health',
      'GET  /api/pipeline/runs',
      'GET  /api/pipeline/runs/:runId/jobs',
      'POST /api/pipeline/trigger',
      'GET  /api/gitops/argocd/status',
      'POST /api/gitops/argocd/sync',
      'GET  /api/gitops/argocd/history',
      'GET  /api/k8s/pods',
      'GET  /api/k8s/deployments',
      'GET  /api/metrics/health',
      'GET  /api/dora/summary',
    ],
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ServerError]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error in cloud05-proxy',
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log('====================================================');
    console.log(`🚀 CLOUD-05 Backend Proxy running on port ${config.port}`);
    console.log(`   Health Check: http://localhost:${config.port}/health`);
    console.log(`   CORS Origin:  ${config.corsOrigin}`);
    console.log(`   Target Repo:  ${config.github.owner}/${config.github.repo}`);
    console.log(`   ArgoCD URL:   ${config.argocd.server}`);
    console.log('====================================================');
  });
}

// Export Express application
export default app;

