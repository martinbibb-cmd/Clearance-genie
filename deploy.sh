#!/bin/bash

# Deployment script for Clearance Genie Worker

set -e

echo "🚀 Deploying Clearance Genie Worker..."

# Check if CLOUDFLARE_API_TOKEN is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ Error: CLOUDFLARE_API_TOKEN environment variable is not set"
  echo ""
  echo "Please set your Cloudflare API token:"
  echo "  export CLOUDFLARE_API_TOKEN=your_token_here"
  echo ""
  echo "Or login interactively:"
  echo "  npx wrangler login"
  echo ""
  exit 1
fi

# Deploy to production
echo "📦 Deploying to production..."
npx wrangler deploy --env=""

echo "✅ Deployment complete!"
echo ""
echo "🌐 Worker URL: https://clearance-genie-worker.martinbibb.workers.dev"
echo ""
echo "Testing endpoints..."

# Test CORS preflight
echo "Testing CORS preflight..."
curl -X OPTIONS https://clearance-genie-worker.martinbibb.workers.dev -s -o /dev/null -w "HTTP Status: %{http_code}\n"

echo ""
echo "✨ All done! Your worker is live."
