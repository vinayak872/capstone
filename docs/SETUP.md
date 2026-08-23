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
