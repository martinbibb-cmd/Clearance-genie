# API Key Testing Guide

## Overview

This guide helps you test if the Gemini API key is properly configured and working in the Clearance Genie application.

## Why Command-Line Tests Don't Work

The Cloudflare Workers (`clearance-genie-worker` and `geminiworker`) have security restrictions that prevent direct testing via curl or command-line tools. These restrictions include:

- CORS policies that only allow requests from specific origins
- Cloudflare Access or WAF rules
- IP-based restrictions
- Origin header validation

This is **normal and expected** security behavior.

## How to Test the API Key

### Method 1: Browser-Based Test Page (Recommended)

1. **Open the test page** in your browser:
   - If deployed: `https://martinbibb-cmd.github.io/Clearance-genie/test-api-key.html`
   - Or open `test-api-key.html` locally in your browser

2. **Run the tests** in order:
   - Click "Test Worker Connection" to verify the worker is online
   - Click "Test Gemini API with Sample Image" to verify the API key
   - (Optional) Upload a test image and run full object detection

3. **Check the results**:
   - ✅ **Green "API KEY IS WORKING CORRECTLY"** = API key is properly configured
   - ❌ **Red "API KEY ISSUE DETECTED"** = API key needs attention
   - ⚠️ **Yellow warnings** = Partial functionality or unexpected response

### Method 2: Test in the Main Application

1. **Open the main application**: https://martinbibb-cmd.github.io/Clearance-genie/

2. **Take a photo** or upload an image of a wall with visible objects (windows, doors, etc.)

3. **Enable Auto-Detect mode**:
   - Click the "Auto-Detect" button
   - The app will use the Gemini API to detect objects

4. **Check for errors**:
   - If objects are detected and highlighted → **API key is working** ✅
   - If you see an error message about API key or authentication → **API key needs attention** ❌
   - Open browser console (F12) to see detailed error messages

### Method 3: Check Browser Console

1. Open the main app at https://martinbibb-cmd.github.io/Clearance-genie/
2. Open browser developer tools (F12)
3. Go to the Console tab
4. Try using Auto-Detect feature
5. Look for error messages:
   - **"Gemini API error"** or **"API key"** in the errors = API key issue
   - **"Failed to call Gemini API"** = Connection or configuration issue
   - No errors and objects detected = API key working correctly

## Expected Test Results

### If API Key is Working:

```json
{
  "success": true,
  "detections": [...],
  "zones": {...},
  "calibration": {...}
}
```

- HTTP Status: 200
- Response includes detected objects (may be empty array for simple images)
- No authentication or API key errors

### If API Key is NOT Working:

Common error patterns:
- `"error": "API key not found"` or `"error": "Invalid API key"`
- `"error": "Authentication failed"`
- `"error": "PERMISSION_DENIED"`
- HTTP Status: 401 or 403 with authentication error
- Messages containing "API_KEY" or "authentication"

## Troubleshooting

### Test Page Shows "Failed to connect to worker"

**Possible causes:**
- Worker is not deployed
- Network/firewall blocking requests
- Wrong worker URL

**Solutions:**
- Verify worker is deployed: `npx wrangler deployments list`
- Check worker URL in `test-api-key.html` matches your deployment
- Try from a different network

### Test Shows "Unexpected response from worker"

**Possible causes:**
- Worker is deployed but Gemini worker has issues
- API key is set but invalid
- Rate limiting or quota issues

**Solutions:**
- Check Cloudflare Workers logs: `npx wrangler tail`
- Verify API key is correctly set in the Gemini worker
- Check Google Cloud Console for API quota/errors

### Command-Line Tests Return 403

**This is normal!** The workers have security restrictions. Use the browser-based test page instead.

## Worker URLs

- **Main Clearance Worker**: https://clearance-genie-worker.martinbibb.workers.dev
- **Alternate URL** (used by app): https://clearancegenie.martinbibb.workers.dev
- **Gemini Worker**: https://geminiworker.martinbibb.workers.dev

## Where is the API Key Configured?

The Gemini API key is configured in the **separate `geminiworker`** Cloudflare Worker, not in this repository.

To update the API key:
1. Go to the Gemini worker repository/configuration
2. Set the API key as a secret: `npx wrangler secret put GEMINI_API_KEY`
3. Redeploy the worker

## Need Help?

If tests are failing:
1. Check Cloudflare Workers logs for detailed errors
2. Verify the Gemini worker is deployed and has the API key configured
3. Check Google Cloud Console for API issues
4. Review the browser console for client-side errors
