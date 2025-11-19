# Cloudflare Worker Deployment Guide

## Prerequisites

1. Cloudflare account
2. Cloudflare API Token with Workers permissions
3. Node.js and npm installed

## Deployment Steps

### 1. Authenticate with Cloudflare

Set your Cloudflare API token as an environment variable:

```bash
export CLOUDFLARE_API_TOKEN=your_token_here
```

Or login interactively:

```bash
npx wrangler login
```

### 2. Deploy the Worker

Deploy to production:

```bash
npx wrangler deploy
```

Or deploy to a specific environment:

```bash
# Deploy to production (main environment)
npx wrangler deploy --env=""

# Deploy to preview environment
npx wrangler deploy --env=preview
```

### 3. Verify Deployment

Test the CORS preflight:

```bash
curl -X OPTIONS https://clearance-genie-worker.martinbibb.workers.dev -v
```

Test the bug report endpoint:

```bash
curl -X POST https://clearance-genie-worker.martinbibb.workers.dev/bug-report \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test bug report",
    "timestamp": "2025-11-19",
    "userAgent": "curl",
    "platform": "linux",
    "screenResolution": "1920x1080",
    "windowSize": "1920x1080",
    "url": "https://test.com",
    "state": {
      "hasPhoto": false,
      "isCalibrated": false,
      "scale": 1,
      "position": {},
      "detectedObjects": 0,
      "obstacles": 0,
      "zones": {}
    },
    "localStorage": {
      "hasOpenAIKey": false,
      "hasCloudflareUrl": false
    },
    "consoleInfo": "Test"
  }'
```

## Worker Configuration

The worker is configured via `wrangler.toml`:

- **Name**: clearance-genie-worker
- **Main file**: worker/index.js
- **Production URL**: https://clearance-genie-worker.martinbibb.workers.dev
- **Allowed origins**: https://martinbibb-cmd.github.io
- **Preview allowed origins**: * (all origins)

## Troubleshooting

### 403 Forbidden Error

If you get a 403 error, the worker may not be deployed yet. Run:

```bash
npx wrangler deploy --env=""
```

### Authentication Error

If you get an authentication error, ensure your API token is set:

```bash
export CLOUDFLARE_API_TOKEN=your_token_here
```

Or login interactively:

```bash
npx wrangler login
```
