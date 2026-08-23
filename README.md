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
