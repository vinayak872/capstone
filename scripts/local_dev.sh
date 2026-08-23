#!/bin/bash
set -e
cd src
npm install
npm test
cd ..
docker build -t sample-app:v1 .
echo "Built. Run: docker run -p 3000:3000 sample-app:v1"
