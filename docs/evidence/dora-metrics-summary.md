# DORA Metrics Analysis & Calculation

*Generated from [`docs/evidence/dora-log.csv`](file:///Users/vinayakkumar/Desktop/capstone/docs/evidence/dora-log.csv) on 2026-08-27*

---

## 1. Raw Deployment Log Data

| Date | Event | Commit SHA | Duration (Seconds) | Outcome | Notes |
|---|---|---|---|---|---|
| **2026-08-24** | Deploy | `280289b` | 32s | ❌ Failure | GHCR token / permission failure in CI |
| **2026-08-25** | Deploy | `4f557f7` | 67s | ✅ Success | Permissions fixed; image built & pushed |
| **2026-08-25** | Deploy | `e8f3c2a` | 194s | ✅ Success | Full pipeline + Trivy scan + sync |

- **Total Logged Days:** 2 days (`2026-08-24` to `2026-08-25`)
- **Total Deployments:** 3
- **Successful Deployments:** 2
- **Failed Deployments:** 1

---

## 2. Metric Calculations & DORA Tiers

### Metric 1: Deployment Frequency (DF)
- **Formula:** $\text{Deployment Frequency} = \frac{\text{Number of Successful Deploys}}{\text{Number of Active Days}}$
- **Calculation:** $\frac{2 \text{ successful deploys}}{2 \text{ days}} = \mathbf{1.0 \text{ deploy/day}}$ *(~7 deploys/week)*
- **DORA 2024 Tier:** **Medium / High** *(Baseline development pace)*

---

### Metric 2: Lead Time for Changes (LTTC)
- **Formula:** $\text{Lead Time} = \text{Average duration from commit push to CI/CD completion}$
- **Calculation (Successful Runs):** $\frac{67\text{s} + 194\text{s}}{2} = \mathbf{130.5 \text{ seconds (2 min 10 sec)}}$
- **Calculation (All Runs):** $\frac{32\text{s} + 67\text{s} + 194\text{s}}{3} = \mathbf{97.7 \text{ seconds (1 min 38 sec)}}$
- **DORA 2024 Tier:** **Elite** *(< 1 hour)*

---

### Metric 3: Change Failure Rate (CFR)
- **Formula:** $\text{Change Failure Rate} = \frac{\text{Failed Deploys}}{\text{Total Deploys}} \times 100$
- **Calculation:** $\frac{1 \text{ failure}}{3 \text{ total deploys}} \times 100 = \mathbf{33.33\%}$
- **DORA 2024 Tier:** **Medium** *(Early pipeline establishment)*

---

### Metric 4: Mean Time to Restore (MTTR)
- **Formula:** $\text{MTTR} = \text{Elapsed duration between a failed deployment and the next successful deployment}$
- **Incident Point:** `2026-08-24` (`280289b`)
- **Resolution Point:** `2026-08-25` (`4f557f7`)
- **Calculation:** $\approx \mathbf{24 \text{ hours (1 business day)}}$ *(resolved next development session)*
- **DORA 2024 Tier:** **Medium** *(< 1 day)*

---

## 3. Summary Scorecard

| DORA Metric | Calculated Baseline Value | DORA Industry Benchmark Tier | Semester VIII Target (with Rollouts + Auto-rollback) |
|---|---|---|---|
| **Deployment Frequency** | **1.0 / day** | Medium / High | Multiple deploys per day |
| **Lead Time for Changes** | **2m 10s** | **Elite** | < 2 minutes |
| **Change Failure Rate** | **33.33%** | Medium | < 5% (Canary catches defects) |
| **Mean Time to Restore** | **~24 hours** | Medium | < 30 seconds (Automated rollback) |
