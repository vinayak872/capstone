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

## ArgoCD vs Flux — Real Comparison (measured 2026-08-27)

| Metric | ArgoCD | Flux |
|---|---|---|
| Setup time | ~15 min (has UI) | ~10 min (CLI only) |
| Sync latency (push to running pod) | ~14s (webhook/auto-sync) / ~3 min (poll) | ~9s (direct sync) / ~1 min (poll) |
| Dashboard/UI | Yes, full web UI with live resource tree | No (CLI-only; optional Weave GitOps UI) |
| Resource Footprint | Higher (~7 controller pods + Redis) | Lower (~4 lightweight controllers) |
| Our choice | ArgoCD — UI made debugging sync issues significantly easier | — |
