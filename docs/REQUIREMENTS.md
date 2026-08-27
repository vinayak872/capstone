# CLOUD-05 Requirements & Specification

This document tracks the Functional Requirements (FR-1 through FR-7) and Non-Functional Requirements (NFR-1 through NFR-6) for the CLOUD-05 GitOps CI/CD with Progressive Delivery project, along with their implementation status across Semester VII and Semester VIII.

---

## Functional Requirements

### FR-1: Application Containerization & Packaging
Containerize the Node.js/Express microservice using Docker with standardized base images (`node:20-alpine`) and automated container build scripts.
- **Status:** Done

### FR-2: Automated Continuous Integration (CI) Pipeline
Automate the CI workflow using GitHub Actions to run unit tests, execute security and vulnerability scans with Trivy, build container images, and publish tagged artifacts to GitHub Container Registry (GHCR).
- **Status:** Done

### FR-3: Declarative Kubernetes Manifests Management
Manage all Kubernetes deployment and service manifests declaratively in version control (`k8s/`), establishing Git as the single source of truth for desired cluster state.
- **Status:** Done

### FR-4: Automated GitOps Continuous Deployment & Drift Reconciliation
Implement automated GitOps continuous delivery using ArgoCD to continuously watch the Git repository, auto-sync application manifests to the Kubernetes cluster, and self-heal against cluster drift.
- **Status:** Done

### FR-5: Comparative GitOps Tooling Evaluation
Implement and benchmark an alternative GitOps engine (Flux v2) against ArgoCD to evaluate setup complexity, UI vs. CLI developer experience, resource footprint, and sync latency.
- **Status:** Done

### FR-6: Progressive Delivery & Canary Deployments (Argo Rollouts)
Implement progressive delivery strategies (Canary releases and Blue-Green deployments) using Argo Rollouts with automated traffic routing and gradual traffic shifting.
- **Status:** Planned for Sem VIII

### FR-7: Automated Metric-Based Rollback & Health Analysis
Integrate Prometheus analysis queries into deployment pipelines to measure real-time error rates/latency during rollouts and trigger automated rollbacks when health thresholds are breached.
- **Status:** Planned for Sem VIII

---

## Non-Functional Requirements

### NFR-1: Security & Vulnerability Management
Enforce automated vulnerability scanning (Trivy) in CI with zero high/critical unmitigated vulnerabilities allowed in container images prior to deployment, alongside secure token/secret management.
- **Status:** Done

### NFR-2: Sync Latency & Performance
Ensure GitOps reconciliation latency remains below 60 seconds from Git commit push to active cluster synchronization.
- **Status:** Done

### NFR-3: Reliability & Self-Healing
Guarantee zero-downtime rolling updates and automatic reconciliation against cluster configuration drift or manual state tampering.
- **Status:** Done

### NFR-4: Observability, Auditability & DORA Metrics Tracking
Maintain a complete, immutable audit trail of all deployments in Git history and capture core DORA metrics (Deployment Frequency, Lead Time for Changes, Change Failure Rate, MTTR).
- **Status:** In Progress

### NFR-5: Resource Footprint & Scalability
Maintain minimal control-plane resource overhead on local development clusters (`kind`) while supporting scalable multi-pod/multi-replica workload deployments.
- **Status:** Done

### NFR-6: Modularity & Extensibility
Decouple CI pipeline from CD execution layers to allow pluggable GitOps controllers (ArgoCD, Flux) and progressive delivery providers (Argo Rollouts) without modifying underlying application code.
- **Status:** Done
