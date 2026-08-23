#!/bin/bash
set -e
kind create cluster --name cloud05-cluster
kubectl create namespace argocd || true
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
echo "Waiting for ArgoCD pods..."
kubectl wait --for=condition=Ready pods --all -n argocd --timeout=180s || true
echo ""
echo "Run this in a separate terminal, then leave it running:"
echo "  kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo ""
echo "Get the admin password with:"
echo "  kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=\"{.data.password}\" | base64 -d"
