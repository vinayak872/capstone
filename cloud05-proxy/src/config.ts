import dotenv from 'dotenv';
import path from 'path';

// Load .env from cloud05-proxy root
dotenv.config();

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  github: {
    token?: string;
    owner: string;
    repo: string;
    workflowFile: string;
  };
  argocd: {
    server: string;
    token?: string;
    adminPassword?: string;
    insecureTls: boolean;
    appName: string;
  };
  k8s: {
    kubeconfigPath?: string;
    namespace: string;
  };
  prometheus: {
    url: string;
  };
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  github: {
    token: process.env.GITHUB_TOKEN || undefined,
    owner: process.env.GITHUB_OWNER || 'vinayak872',
    repo: process.env.GITHUB_REPO || 'capstone',
    workflowFile: process.env.GITHUB_WORKFLOW_FILE || 'ci.yml',
  },
  argocd: {
    server: process.env.ARGOCD_SERVER || 'https://localhost:8080',
    token: process.env.ARGOCD_TOKEN || undefined,
    adminPassword: process.env.ARGOCD_ADMIN_PASSWORD || undefined,
    insecureTls: process.env.ARGOCD_INSECURE_TLS !== 'false', // default true for local self-signed certs
    appName: process.env.ARGOCD_APP_NAME || 'sample-app',
  },
  k8s: {
    kubeconfigPath: process.env.KUBECONFIG_PATH || undefined,
    namespace: process.env.K8S_NAMESPACE || 'default',
  },
  prometheus: {
    url: process.env.PROMETHEUS_URL || 'http://localhost:9090',
  },
};
