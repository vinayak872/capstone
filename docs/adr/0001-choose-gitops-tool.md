# ADR 0001: Choice of GitOps Tool

## Status
Accepted

## Context
We need a tool to automatically sync our Kubernetes cluster with
what's declared in Git. The two main options are ArgoCD and Flux.

## Decision
We selected ArgoCD as our primary GitOps tool after comparing it with Flux (see Step 2
below for full comparison). ArgoCD was chosen for its web UI, which made debugging sync
issues significantly faster during development, and its simpler initial setup.

## Consequences
- Team needs to learn ArgoCD's Application CRD structure
- Flux remains documented as a viable alternative with lower resource footprint
- Future Argo Rollouts integration (Sem VIII) is native to ArgoCD's ecosystem
