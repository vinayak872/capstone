# Fault-Injection & Negative Testing Evidence

This document records the empirical results of the **5 mandatory resilience & fault-injection tests** for the CLOUD-05 GitOps pipeline.

---

## Summary Matrix

| Test ID | Test Name | Target Component | Status | Result / Outcome | Recovery Time |
|---|---|---|---|---|---|
| **NT-01** | **Cluster Overhead & Resource Starvation** | ArgoCD & Flux Control Plane | **Executed** | ✅ **PASSED** (0 pod restarts, 100% responsiveness) | **< 1s** |
| **NT-02** | **Canary Metric Failure Threshold Breach** | Argo Rollouts + Prometheus | *Planned for Sem VIII* | Scheduled for Argo Rollouts evaluation | N/A |
| **NT-03** | **Rollback Correctness & Clean State Restoral** | Argo Rollouts Controller | *Planned for Sem VIII* | Scheduled for automated rollback evaluation | N/A |
| **NT-04** | **Partial Failure & Pod Self-Healing** | Deployment ReplicaSet Controller & ArgoCD | **Executed** | ✅ **PASSED** (Replica count maintained, auto-healed in ~1s) | **~1s (create) / ~18s (ready)** |
| **NT-05** | **Idempotent Retry & Duplicate Work Handling** | GitHub Actions CI & GitOps Reconciliation | **Executed** | ✅ **PASSED** (Concurrent runs succeeded; synced to final commit `96a18ab`) | **0s (idempotent no-op)** |

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

---

### Test NT-04: Partial Failure & State Inconsistency Self-Healing
- **Objective:** Simulate mid-operation pod failure by killing a running microservice instance and verify that Kubernetes ReplicaSet reconciles desired state while ArgoCD accurately tracks health without losing synchronization with Git.
- **Execution Command:**
  ```bash
  kubectl delete pod sample-app-749b5bc57c-hcjw8 -n default --now
  ```
- **Observed Metrics:**
  - **Time to Recreate:** **< 1 second**. Replacement pod (`sample-app-749b5bc57c-4wgs5`) was spawned immediately by the ReplicaSet controller.
  - **Replica Count Maintained:** **Yes (3/3 replicas)**. Total active pod count never dropped below target.
  - **ArgoCD Sync State:** Remained **`Synced`** continuously throughout recovery (desired declarative state in Git remained unchanged).
  - **ArgoCD Health State:** Transitioned smoothly from `Healthy` → `Progressing` (during readiness probe grace period) → `Healthy` (at 18s when `/health` readiness check passed).
- **Conclusion:** **PASSED**. The Kubernetes control plane self-healed the missing pod immediately, and ArgoCD correctly distinguished transient health degradation from declarative Git drift.

---

### Test NT-05: Retry & Duplicate-Work Handling
- **Objective:** Trigger multiple CI pipeline runs in rapid succession by pushing two empty commits back-to-back (`2cb08cc` and `96a18ab`), verifying that concurrent builds do not conflict in CI/GHCR and that the GitOps engine idempotently converges on the final desired state.
- **Execution Commands:**
  ```bash
  git commit --allow-empty -m "test: retry handling 1" && git push origin main
  git commit --allow-empty -m "test: retry handling 2" && git push origin main
  ```
- **Observed Metrics:**
  - **CI Pipeline Run 1 (`33042084960`, commit `2cb08cc`):** Completed with **`success`**.
  - **CI Pipeline Run 2 (`33042086789`, commit `96a18ab`):** Completed with **`success`**.
  - **Race Condition / Build Conflicts:** None. Docker builds and Trivy scans executed safely in isolated ephemeral runners.
  - **ArgoCD Final State:** **`Synced`** and **`Healthy`**.
  - **Flux Final State:** **`Ready: True`** (Applied revision `main@sha1:96a18abe`).
  - **Live Pods Status:** 3/3 pods remained in `Running` state without disruption.
- **Conclusion:** **PASSED**. Both the CI pipeline and GitOps reconciliation loop exhibited complete idempotency under rapid, concurrent push triggers.
