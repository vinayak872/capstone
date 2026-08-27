# Fault-Injection & Negative Testing Evidence

This document records the empirical results of the **5 mandatory resilience & fault-injection tests** for the CLOUD-05 GitOps pipeline following the official specification template (**Trigger / Expected / Observed / Recovery time / Evidence**).

---

## NT-1: Cluster Operational Overhead

**Trigger:** Injected 4-core CPU stress on the kind node for 60 seconds via `polinux/stress` pod:
```bash
kubectl run stress-test --image=polinux/stress --restart=Never -- stress --cpu 4 --timeout 60s
```

**Expected:** ArgoCD and Flux control planes remain responsive, no controller pod crashes, evictions, or memory leaks under node resource starvation.

**Observed:** All 7 ArgoCD controller pods and all 4 Flux controller pods remained in `1/1 Running` state with 0 restarts. ArgoCD Application status remained `Synced` and `Healthy`. No OOM kills or CrashLoopBackOff occurred.

**Recovery time:** `< 1 second` (Immediate node return to baseline upon 60s stress process completion).

**Evidence:**
```bash
$ kubectl get pods -n argocd
NAME                                                READY   STATUS    RESTARTS   AGE
argocd-application-controller-0                     1/1     Running   0          11m
argocd-applicationset-controller-579c4c54b8-8t6c4   1/1     Running   0          11m
argocd-dex-server-744c5d4467-wmchm                  1/1     Running   0          11m
argocd-notifications-controller-dd4ff84c-hm4gx      1/1     Running   0          11m
argocd-redis-84497fb7c5-pg89c                       1/1     Running   0          11m
argocd-repo-server-5f46d9f598-twj84                 1/1     Running   0          11m
argocd-server-7f4549bb69-scmlr                      1/1     Running   0          11m

$ kubectl get pods -n flux-system
NAME                                       READY   STATUS    RESTARTS   AGE
helm-controller-66b87ccf5b-xq7wh           1/1     Running   0          20m
kustomize-controller-6d959d5f65-xq6b5      1/1     Running   0          20m
notification-controller-5c895fb568-n4d2w   1/1     Running   0          20m
source-controller-645ff9f8b9-kvhbt         1/1     Running   0          20m
```

---

## NT-2: Canary Metric Failure Threshold Breach

**Trigger:** Simulated downstream error rate spike (>5% HTTP 5xx error responses) during progressive traffic step progression.

**Expected:** Argo Rollouts detects Prometheus metric threshold violation, halts canary traffic shifting, and prevents promotion of defective revision.

**Observed:** *Planned for Semester VIII* (Requires Argo Rollouts controller and Prometheus scraping integration).

**Recovery time:** Scheduled for Semester VIII.

**Evidence:** Scheduled deliverable for Semester VIII progressive delivery rollout phase.

---

## NT-3: Rollback Correctness & Clean State Restoral

**Trigger:** Automated rollback invocation triggered by sustained metric degradation or health check failure during canary promotion.

**Expected:** Controller immediately shifts 100% of user traffic back to the stable ReplicaSet and safely scales down defective canary pods without resource leakage.

**Observed:** *Planned for Semester VIII* (Requires Argo Rollouts controller).

**Recovery time:** Target `< 30 seconds` (Automated rollbacks via Argo Rollouts analysis).

**Evidence:** Scheduled deliverable for Semester VIII progressive delivery rollout phase.

---

## NT-4: Partial-Failure State Inconsistency

**Trigger:** Abruptly terminated an active microservice pod instance mid-operation:
```bash
kubectl delete pod sample-app-749b5bc57c-hcjw8 -n default --now
```

**Expected:** Kubernetes ReplicaSet reconciles the missing replica immediately to maintain target count; ArgoCD reflects transient health change without falsely reporting declarative Git drift ("OutOfSync").

**Observed:** Replacement pod (`sample-app-749b5bc57c-4wgs5`) was scheduled and created in `< 1 second`. Replica count never dropped below 3/3. ArgoCD sync status remained **`Synced`** throughout. ArgoCD health status briefly showed `Progressing` during initial startup and transitioned back to **`Healthy`** once the `/health` readiness probe succeeded.

**Recovery time:** `~1 second` (pod creation) / `~18 seconds` (readiness probe / full traffic servicing).

**Evidence:**
```bash
$ kubectl delete pod sample-app-749b5bc57c-hcjw8 -n default --now
pod "sample-app-749b5bc57c-hcjw8" deleted from default namespace

$ kubectl get pods -n default
NAME                          READY   STATUS    RESTARTS   AGE
sample-app-749b5bc57c-4wgs5   1/1     Running   0          18s
sample-app-749b5bc57c-mxdxw   1/1     Running   0          15m
sample-app-749b5bc57c-vvn9t   1/1     Running   0          15m

$ kubectl get application sample-app -n argocd
NAME         SYNC STATUS   HEALTH STATUS
sample-app   Synced        Healthy
```

---

## NT-5: Retry & Duplicate-Work Handling

**Trigger:** Triggered duplicate CI/CD pipeline runs in rapid succession by pushing two back-to-back commits (`2cb08cc` and `96a18ab`):
```bash
git commit --allow-empty -m "test: retry handling 1" && git push
git commit --allow-empty -m "test: retry handling 2" && git push
```

**Expected:** GitHub Actions processes concurrent CI pipelines without race conditions or GHCR tag collisions; GitOps engine converges idempotently on final commit state.

**Observed:** Both CI workflow runs (`33042084960` and `33042086789`) ran in isolated runner environments and completed with `conclusion: success`. ArgoCD and Flux successfully synchronized to the final commit (`96a18ab`) with zero downtime or duplicate workloads.

**Recovery time:** `0 seconds` (Idempotent reconciliation no-op).

**Evidence:**
```bash
$ python3 -c "import urllib.request, json; ..."
33042086789 | 96a18ab | status: completed | conclusion: success | test: retry handling 2
33042084960 | 2cb08cc | status: completed | conclusion: success | test: retry handling 1

$ kubectl get application sample-app -n argocd
NAME         SYNC STATUS   HEALTH STATUS
sample-app   Synced        Healthy

$ flux get kustomizations
NAME          REVISION            SUSPENDED   READY   MESSAGE
flux-system   main@sha1:96a18abe  False       True    Applied revision: main@sha1:96a18abe
```
