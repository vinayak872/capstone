# Fault-Injection & Negative Testing Evidence

This document records the empirical results of the **5 mandatory resilience & fault-injection tests** for the CLOUD-05 GitOps pipeline.

---

## Summary Matrix

| Test ID | Test Name | Target Component | Status | Result / Outcome | Recovery Time |
|---|---|---|---|---|---|
| **NT-01** | **Cluster Overhead & Resource Starvation** | ArgoCD & Flux Control Plane | **Executed** | ✅ **PASSED** (0 pod restarts, 100% responsiveness) | **< 1s** |
| **NT-02** | **Canary Metric Failure Threshold Breach** | Argo Rollouts + Prometheus | *Planned for Sem VIII* | Scheduled for Argo Rollouts evaluation | N/A |
| **NT-03** | **Rollback Correctness & Clean State Restoral** | Argo Rollouts Controller | *Planned for Sem VIII* | Scheduled for automated rollback evaluation | N/A |
| **NT-04** | **Partial-Failure & Configuration Drift** | Kubernetes State vs. Git | **Documented** | Ready for execution | Immediate reconcile |
| **NT-05** | **Idempotent Retry & Duplicate Work Handling** | GitOps Reconciliation Loop | **Documented** | Ready for execution | Idempotent no-op |

---

## Detailed Test Logs

### Test NT-01: Cluster Overhead & CPU Starvation
- **Objective:** Verify that GitOps controllers (ArgoCD and Flux) remain healthy, responsive, and maintain synchronization capability during severe CPU/node resource contention.
- **Execution Command:**
  ```bash
  kubectl run stress-test --image=polinux/stress --restart=Never -- stress --cpu 4 --timeout 60s
  ```
- **Observed Metrics:**
  - **ArgoCD Pods:** 7/7 pods in `Running` state (`argocd-server`, `argocd-repo-server`, `argocd-application-controller-0`, `argocd-redis`, etc.)
  - **Flux Pods:** 4/4 pods in `Running` state (`source-controller`, `kustomize-controller`, `helm-controller`, `notification-controller`)
  - **Restarts:** `0` restarts across all controller pods.
  - **ArgoCD App Sync Status:** `Synced` / `Healthy`.
  - **Return to Normal:** Immediate (~0 seconds) after the 60s stress container finished with exit code 0 (`Completed`).
- **Conclusion:** **PASSED**. Both GitOps control planes demonstrated strong resource resilience without crashing or entering CrashLoopBackOff.
