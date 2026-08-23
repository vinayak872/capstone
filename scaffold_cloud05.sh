#!/bin/bash
# ============================================================
# CLOUD-05 — GitOps CI/CD with Progressive Delivery
# FULL PROJECT SCAFFOLD SCRIPT
#
# Run this once from VS Code's integrated terminal
# (Terminal > New Terminal), inside an empty folder.
#
# This creates a well-structured repo with many file types —
# README, docs, code, tests, Dockerfile, CI config, K8s YAML,
# and VS Code settings — so Gemini Code Assist has full
# context across your whole project, not just one file.
# ============================================================

set -e

echo "=== Checking prerequisites ==="
command -v docker >/dev/null 2>&1 || { echo "Docker not found. Install Docker Desktop first."; exit 1; }
command -v git >/dev/null 2>&1 || { echo "Git not found. Install it first."; exit 1; }
echo "OK — Docker and Git found."

# ============================================================
# ROOT-LEVEL DOCS (Markdown) — Gemini reads these for project context
# ============================================================
echo "=== Creating documentation files ==="

cat > README.md << 'EOF'
# CLOUD-05 — GitOps CI/CD with Progressive Delivery

**Team:** Guduguntla Priya Varshitha, Vinayak Kumar, Atukuri Sri Geetha, Chittem Komalaa Srikanthe
**Course:** Software Modelling & DevOps — Capstone Project

## What this project does
This project automates software releases using GitOps. Git is the single
source of truth for what should be deployed. A tool (ArgoCD) watches the
Git repository and automatically keeps a Kubernetes cluster in sync with it.
Updates are released gradually (progressive delivery) instead of all at once,
and roll back automatically if something goes wrong.

## Project structure
```
.
├── README.md              <- you are here
├── ARCHITECTURE.md         <- design decisions and system diagram
├── src/                    <- the sample application code
│   ├── index.js
│   ├── index.test.js
│   └── package.json
├── Dockerfile              <- how the app is packaged into a container
├── .github/workflows/      <- CI pipeline (build, test, scan)
├── k8s/                    <- Kubernetes manifests (deployment reference)
│   ├── deployment.yaml
│   └── service.yaml
├── docs/
│   ├── adr/                <- Architecture Decision Records
│   └── evidence/           <- screenshots, logs, metrics for capstone evidence
└── scripts/                <- helper shell scripts
```

## How to run this locally
See `docs/SETUP.md` for full step-by-step instructions.

## Current status
See `docs/STATUS.md` for what is done and what is next.
EOF

cat > ARCHITECTURE.md << 'EOF'
# Architecture

## Flow
1. A developer commits code and pushes to GitHub.
2. GitHub Actions automatically builds, tests, and scans the app,
   then pushes a container image to GitHub Container Registry (GHCR).
3. ArgoCD watches the `k8s/` folder in this repository.
4. When it detects a change, ArgoCD automatically updates the
   Kubernetes cluster to match.
5. (Semester VIII) Argo Rollouts will replace the plain Deployment
   with a canary release strategy, using Prometheus metrics to decide
   whether to keep rolling out or roll back automatically.

## Why these tools
- **Docker** — packages the app consistently across environments.
- **GitHub Actions** — free, integrated CI directly in GitHub.
- **ArgoCD** — implements GitOps: Git is the source of truth, and
  the cluster state is continuously reconciled to match it.
- **Kubernetes (kind for local dev)** — industry-standard container
  orchestration, free to run locally via `kind`.

## Comparative note: ArgoCD vs Flux
(Fill this in once you've tried both — required deliverable for O2.)
- Ease of setup:
- Dashboard/UI:
- Sync speed:
- Our choice and why:
EOF

mkdir -p docs/adr docs/evidence

cat > docs/SETUP.md << 'EOF'
# Setup Instructions

## Prerequisites
- Docker Desktop
- Git
- kind (`brew install kind` on Mac)
- kubectl
- A GitHub account with a personal access token (write:packages scope)

## Steps
1. Clone this repo
2. Run `bash scripts/local_dev.sh` to build and test the app locally
3. Run `bash scripts/cluster_setup.sh` to create a local Kubernetes
   cluster and install ArgoCD
4. Follow the printed instructions to connect ArgoCD to this repo
EOF

cat > docs/STATUS.md << 'EOF'
# Project Status

## Completed
- [ ] Sample app built and containerized
- [ ] CI pipeline running (build, test, scan)
- [ ] Local Kubernetes cluster running
- [ ] ArgoCD installed and syncing from this repo
- [ ] Flux tried and compared against ArgoCD

## Up next
- [ ] Baseline DORA metrics captured
- [ ] Argo Rollouts installed (Semester VIII)
- [ ] Prometheus installed (Semester VIII)
- [ ] Canary rollout strategy implemented (Semester VIII)
EOF

cat > docs/adr/0001-choose-gitops-tool.md << 'EOF'
# ADR 0001: Choice of GitOps Tool

## Status
Proposed

## Context
We need a tool to automatically sync our Kubernetes cluster with
what's declared in Git. The two main options are ArgoCD and Flux.

## Decision
(Fill in once you've tested both — this is a required deliverable.)

## Consequences
(What this choice means for the rest of the project.)
EOF

echo "Docs created."

# ============================================================
# APPLICATION CODE (JavaScript) — includes a real test file
# ============================================================
echo "=== Creating application code ==="
mkdir -p src

cat > src/package.json << 'EOF'
{
  "name": "sample-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "node --test index.test.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  }
}
EOF

cat > src/index.js << 'EOF'
const express = require('express');

function createApp() {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello from CLOUD-05! Version 1');
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  createApp().listen(PORT, () => console.log(`Running on port ${PORT}`));
}

module.exports = { createApp };
EOF

cat > src/index.test.js << 'EOF'
const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { createApp } = require('./index');

test('health endpoint returns status ok', async () => {
  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address();

  const data = await new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}/health`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });

  assert.strictEqual(data.status, 'ok');
  server.close();
});
EOF

echo "Application code + tests created."

# ============================================================
# DOCKER
# ============================================================
echo "=== Creating Dockerfile ==="

cat > Dockerfile << 'EOF'
FROM node:20-alpine
WORKDIR /app
COPY src/package*.json ./
RUN npm install --production
COPY src/ .
EXPOSE 3000
CMD ["node", "index.js"]
EOF

cat > .dockerignore << 'EOF'
node_modules
npm-debug.log
docs
EOF

# ============================================================
# CI PIPELINE (GitHub Actions — YAML)
# ============================================================
echo "=== Creating CI pipeline ==="
mkdir -p .github/workflows

cat > .github/workflows/ci.yml << 'EOF'
name: CI Pipeline

on:
  push:
    branches: [main]

jobs:
  build-test-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        working-directory: src
        run: npm install

      - name: Run tests
        working-directory: src
        run: npm test

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository_owner }}/sample-app:latest

      - name: Scan image for vulnerabilities
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ghcr.io/${{ github.repository_owner }}/sample-app:latest
          format: table
          exit-code: '0'
EOF

# ============================================================
# KUBERNETES MANIFESTS (YAML) — split into separate files, cleaner for Gemini to reason about
# ============================================================
echo "=== Creating Kubernetes manifests ==="
mkdir -p k8s

cat > k8s/deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-app
  labels:
    app: sample-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sample-app
  template:
    metadata:
      labels:
        app: sample-app
    spec:
      containers:
        - name: sample-app
          image: ghcr.io/REPLACE_WITH_YOUR_GITHUB_USERNAME/sample-app:latest
          ports:
            - containerPort: 3000
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 3
EOF

cat > k8s/service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: sample-app-service
spec:
  selector:
    app: sample-app
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
EOF

# ============================================================
# HELPER SCRIPTS
# ============================================================
echo "=== Creating helper scripts ==="
mkdir -p scripts

cat > scripts/local_dev.sh << 'EOF'
#!/bin/bash
set -e
cd src
npm install
npm test
cd ..
docker build -t sample-app:v1 .
echo "Built. Run: docker run -p 3000:3000 sample-app:v1"
EOF

cat > scripts/cluster_setup.sh << 'EOF'
#!/bin/bash
set -e
kind create cluster --name cloud05-cluster
kubectl create namespace argocd || true
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
echo "Waiting for ArgoCD pods..."
kubectl wait --for=condition=Ready pods --all -n argocd --timeout=180s || true
echo ""
echo "Run this in a separate terminal, then leave it running:"
echo "  kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo ""
echo "Get the admin password with:"
echo "  kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=\"{.data.password}\" | base64 -d"
EOF

chmod +x scripts/*.sh

# ============================================================
# VS CODE CONFIG — recommends the Gemini Code Assist extension
# ============================================================
echo "=== Creating VS Code config ==="
mkdir -p .vscode

cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "google.geminicodeassist",
    "ms-azuretools.vscode-docker",
    "redhat.vscode-kubernetes-tools",
    "redhat.vscode-yaml"
  ]
}
EOF

cat > .vscode/settings.json << 'EOF'
{
  "files.associations": {
    "*.yaml": "yaml",
    "Dockerfile": "dockerfile"
  },
  "editor.formatOnSave": true
}
EOF

# ============================================================
# GITIGNORE
# ============================================================
cat > .gitignore << 'EOF'
node_modules/
.DS_Store
*.log
EOF

echo ""
echo "============================================================"
echo "SCAFFOLD COMPLETE."
echo ""
echo "Files created across these types:"
echo "  - Markdown docs:   README.md, ARCHITECTURE.md, docs/*.md"
echo "  - JavaScript code: src/index.js, src/index.test.js"
echo "  - Docker:          Dockerfile, .dockerignore"
echo "  - CI config (YAML): .github/workflows/ci.yml"
echo "  - K8s manifests:   k8s/deployment.yaml, k8s/service.yaml"
echo "  - Shell scripts:   scripts/local_dev.sh, scripts/cluster_setup.sh"
echo "  - VS Code config:  .vscode/settings.json, .vscode/extensions.json"
echo ""
echo "NEXT STEPS:"
echo "1. Open this folder in VS Code: code ."
echo "2. Install the recommended extensions when VS Code prompts you"
echo "3. Sign in to Gemini Code Assist (see chat instructions)"
echo "4. Edit k8s/deployment.yaml — replace REPLACE_WITH_YOUR_GITHUB_USERNAME"
echo "5. Run: bash scripts/local_dev.sh"
echo "6. git init && git add . && git commit -m 'Initial project scaffold'"
echo "7. Push to GitHub, then run: bash scripts/cluster_setup.sh"
echo "============================================================"
