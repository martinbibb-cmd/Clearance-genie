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

### 2. Configure Required Secrets

The worker requires an OpenAI API key to perform object detection. Set it as a secret:

```bash
npx wrangler secret put OPENAI_API_KEY
```

When prompted, paste your OpenAI API key (it should start with `sk-` or `sk-proj-`).

**Important Notes:**
- The worker uses the `gpt-4o-mini` model for object detection
- Without this key, the auto-detect feature will not work
- The key is stored securely in Cloudflare and never exposed in the code
- You can verify the secret was set by checking the Cloudflare dashboard under Workers > clearance-genie-worker > Settings > Variables

### 3. Deploy the Worker

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

### 4. Verify Deployment

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

## Required Environment Variables

The worker requires the following secrets to be set:

| Secret | Description | How to Set |
|--------|-------------|------------|
| `OPENAI_API_KEY` | OpenAI API key for object detection using gpt-4o-mini | `npx wrangler secret put OPENAI_API_KEY` |

## Troubleshooting

### Object Detection Not Working

If the auto-detect feature is not working:

1. Verify the OPENAI_API_KEY secret is set:
   - Check Cloudflare dashboard: Workers > clearance-genie-worker > Settings > Variables
   - Or re-run: `npx wrangler secret put OPENAI_API_KEY`

2. Check worker logs for errors:
   ```bash
   npx wrangler tail
   ```
   Look for "Missing OPENAI_API_KEY" warnings

3. Test the worker endpoint directly (requires a valid image):
   ```bash
   curl -X POST https://clearance-genie-worker.martinbibb.workers.dev \
     -H "Content-Type: application/json" \
     -d '{"image":"data:image/jpeg;base64,...","pxPerMM":1,"mode":"flue","position":{"x":100,"y":100},"imageWidth":800,"imageHeight":600}'
   ```

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
