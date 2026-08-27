# Project Status & Evidence Log

## Completed (Semester VII Deliverables)
- [x] Sample Node.js / Express microservice built and containerized (`Dockerfile`)
- [x] Automated CI pipeline running in GitHub Actions (build, unit test, Trivy vulnerability scan, push to GHCR)
- [x] Local Kubernetes development cluster running (`kind`)
- [x] ArgoCD installed, configured, and auto-syncing application manifests (`k8s/`)
- [x] Flux v2 bootstrapped and benchmarked against ArgoCD (`clusters/flux-demo/`)
- [x] Baseline DORA metrics captured and calculated from real deployment/CI history

---

## Real Measured DORA Metrics (Baseline vs. Industry Tiers)

*Measured on 2026-08-27 from 12 real GitHub Actions workflow runs and deployment logs.*  
*Detailed calculations documented in [`docs/evidence/dora-metrics-summary.md`](file:///Users/vinayakkumar/Desktop/capstone/docs/evidence/dora-metrics-summary.md).*

| DORA Metric | Real Measured Baseline | DORA 2024 Benchmark Tier | Notes / Evidence Source |
|---|---|---|---|
| **Deployment Frequency** | **1.0 deploy/day** *(~7/week across active dev days)* | **Medium / High** | Real rate over active development days; 12 total pipeline runs. ([`dora-log.csv`](file:///Users/vinayakkumar/Desktop/capstone/docs/evidence/dora-log.csv)) |
| **Lead Time for Changes** | **45.4s (avg. CI)** / **~2m 10s (push-to-pod)** | **Elite** *(< 1 hour)* | Measured across all successful runs in GitHub Actions. ([`github-actions-runs.csv`](file:///Users/vinayakkumar/Desktop/capstone/docs/evidence/github-actions-runs.csv)) |
| **Change Failure Rate** | **8.3%** *(1 failure in 12 CI runs)* | **Medium / Elite** | Initial CI failure due to GHCR permissions; fixed in commit `4f557f7`. |
| **Mean Time to Restore (MTTR)** | **~24 hours** *(next development session)* | **Medium** *(< 1 day)* | Resolved during next session. Will drop to <30s with Sem VIII automated rollbacks. |

> [!NOTE]
> These values replace earlier preliminary dashboard mockup figures (`4.8/day`) with empirical data captured from actual repository commits and GitHub Actions execution logs.

---

## Up Next (Semester VIII Scope)
- [ ] Argo Rollouts controller installation & CRD configuration
- [ ] Prometheus server and node/app metrics scraping integration
- [ ] Canary progressive rollout strategy with automated metric analysis
- [ ] Automated rollback verification under simulated failure conditions
- [ ] Integration of backend API proxy to feed live metrics directly to the GitOps Console
