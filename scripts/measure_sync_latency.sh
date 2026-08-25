#!/bin/bash
# Usage: ./scripts/measure_sync_latency.sh <argocd|flux>
set -e

TOOL=${1:-argocd}
FILE="k8s/deployment.yaml"
[ "$TOOL" == "flux" ] && FILE="k8s-flux/deployment.yaml"

if [ ! -f "$FILE" ]; then
  echo "Error: Manifest file '$FILE' does not exist."
  exit 1
fi

# Ensure output directory exists
mkdir -p docs/evidence

# Helper function to get current timestamp in milliseconds (cross-platform macOS/Linux)
get_time_ms() {
  if command -v gdate >/dev/null 2>&1; then
    echo $(( $(gdate +%s%N) / 1000000 ))
  elif date +%s%N 2>/dev/null | grep -v N >/dev/null 2>&1; then
    echo $(( $(date +%s%N) / 1000000 ))
  else
    node -e 'console.log(Date.now())'
  fi
}

# Bump a harmless annotation or replica count to trigger a real reconcile
TIMESTAMP=$(date +%s)
sed -i.bak "s/replicas: .*/replicas: 3/" "$FILE"
rm -f "${FILE}.bak"

git add "$FILE"
git commit -m "test: trigger $TOOL sync at $TIMESTAMP" || true

PUSH_START_MS=$(get_time_ms)
echo "Pushing commit to remote..."
git push

PUSH_TIME_MS=$(get_time_ms)
echo "Pushed at $(date), polling for $TOOL to reconcile..."

if [ "$TOOL" == "argocd" ]; then
  while true; do
    STATUS=$(argocd app get sample-app -o json 2>/dev/null | jq -r '.status.sync.status' 2>/dev/null || echo "Progressing")
    [ "$STATUS" == "Synced" ] && break
    sleep 0.5
  done
else
  while true; do
    STATUS=$(flux get kustomization sample-app-flux -o json 2>/dev/null | jq -r '.[0].status' 2>/dev/null || echo "False")
    [ "$STATUS" == "True" ] && break
    sleep 0.5
  done
fi

DONE_TIME_MS=$(get_time_ms)
LATENCY_MS=$(( DONE_TIME_MS - PUSH_TIME_MS ))
echo "================================================="
echo "✅ $TOOL sync latency: ${LATENCY_MS}ms"
echo "================================================="

# Append benchmark record to docs/evidence
mkdir -p docs/evidence
echo "{\"tool\": \"$TOOL\", \"latency_ms\": $LATENCY_MS, \"timestamp\": $TIMESTAMP, \"date\": \"$(date -u +'%Y-%m-%dT%H:%M:%SZ')\"}" >> docs/evidence/sync-latency.jsonl
echo "Appended benchmark result to docs/evidence/sync-latency.jsonl"
