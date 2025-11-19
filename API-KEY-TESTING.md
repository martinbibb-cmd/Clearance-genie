# API Key Testing Guide

## Overview

This guide helps you test if the **OpenAI API key** is properly configured and working in the Clearance Genie application.

**Note:** The app uses two different AI services:
- **OpenAI GPT-4** - For generating installation guidance (AI Guidance feature) - **User provides this key**
- **Gemini API** - For auto-detecting objects in photos (Auto-Detect feature) - **Backend only**

This guide focuses on testing the **OpenAI API key** that users provide.

## OpenAI API vs Gemini API

The application uses two different AI services:

### OpenAI GPT-4 (What you're testing)
- **Purpose:** Generate written installation guidance
- **How it works:** Called directly from the browser
- **Key storage:** User's browser (localStorage)
- **Testing:** Can be tested directly with browser-based tools
- **Feature:** "Generate AI Guidance" button in the app

### Gemini API (Backend only)
- **Purpose:** Auto-detect objects in photos (windows, doors, etc.)
- **How it works:** Via Cloudflare Worker backend
- **Key storage:** Cloudflare Worker secrets (not user-provided)
- **Testing:** Command-line tests will fail due to CORS/security
- **Feature:** "Auto-Detect" button in the app

This guide focuses on **OpenAI API** testing.

## How to Test the OpenAI API Key

### Method 1: Browser-Based Test Page (Recommended) ⭐

1. **Open the test page** in your browser:
   - If deployed: `https://martinbibb-cmd.github.io/Clearance-genie/test-openai-key.html`
   - Or open `test-openai-key.html` locally in your browser

2. **Enter your OpenAI API key** (starts with `sk-` or `sk-proj-`)

3. **Run the tests** in order:
   - **Test 1:** Validate API Key - Checks if the key is valid
   - **Test 2:** GPT-4 Access Test - Verifies GPT-4 access (required!)
   - **Test 3:** Full Guidance Simulation - Tests the actual app functionality

4. **Check the results**:
   - ✅ **Green "SUCCESS"** = API key is working perfectly
   - ❌ **Red "FAIL"** = API key has issues
   - ⚠️ **Yellow "WARNING"** = Key works but may have limitations

### Method 2: Test in the Main Application

1. **Open the main application**: https://martinbibb-cmd.github.io/Clearance-genie/

2. **Take a photo** or upload an image and calibrate

3. **Mark some obstacles** (or use Auto-Detect to detect them)

4. **Click "Generate AI Guidance"**:
   - You'll be prompted to enter your OpenAI API key
   - The app will generate installation guidance using GPT-4

5. **Check for errors**:
   - If guidance is generated → **API key is working** ✅
   - If you see "Invalid API key" error → **API key needs attention** ❌
   - If you see "Model not found" → **No GPT-4 access** ⚠️

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

### ✅ If API Key is Working:

**Test 1 (Validation):**
- HTTP Status: 200
- Message: "API Key is VALID!"
- Shows model and key format

**Test 2 (GPT-4 Access):**
- HTTP Status: 200
- Message: "GPT-4 ACCESS CONFIRMED!"
- Shows AI response and token usage

**Test 3 (Full Guidance):**
- HTTP Status: 200
- Generates detailed installation guidance
- Shows token usage and estimated cost

### ❌ If API Key is NOT Working:

**Invalid API Key:**
- HTTP Status: 401
- Error: "Incorrect API key provided"
- Fix: Check the key is copied correctly

**No GPT-4 Access:**
- HTTP Status: 404 or error code "model_not_found"
- Error: "The model 'gpt-4' does not exist"
- Fix: Upgrade OpenAI account or add payment method

**Rate Limited:**
- HTTP Status: 429
- Error: "Rate limit exceeded"
- Fix: Wait a moment, or upgrade account limits

## Troubleshooting

### "Incorrect API key provided" (401 Error)

**Problem:** API key is invalid

**Solutions:**
- Verify key is copied correctly from https://platform.openai.com/api-keys
- Make sure there are no extra spaces
- Check if key starts with `sk-` or `sk-proj-`
- Verify key hasn't been revoked

### "The model 'gpt-4' does not exist" (404 Error)

**Problem:** Account doesn't have GPT-4 access

**Solutions:**
- Add a payment method: https://platform.openai.com/account/billing
- Make a small prepaid credit purchase ($5+)
- Wait a few minutes after adding payment (access isn't instant)
- Try using `gpt-4o` or `gpt-4-turbo` instead (edit the test page)

### "Rate limit exceeded" (429 Error)

**Problem:** Too many requests or quota exhausted

**Solutions:**
- Wait 1-2 minutes and try again
- Check your usage: https://platform.openai.com/usage
- Check rate limits: https://platform.openai.com/account/limits
- Upgrade to a higher tier if needed

### CORS or Network Errors

**Problem:** Browser blocking OpenAI requests

**Solutions:**
- OpenAI API should work from any browser
- Check if a browser extension is blocking requests
- Try in incognito/private mode
- Check network firewall/proxy settings

## API Endpoints

### OpenAI API (User-provided key)
- **Endpoint**: https://api.openai.com/v1/chat/completions
- **Model**: gpt-4
- **Authentication**: Bearer token (user's API key)
- **Used for**: Installation guidance generation

### Cloudflare Workers (Backend)
- **Main Worker**: https://clearance-genie-worker.martinbibb.workers.dev
- **Gemini Worker**: https://geminiworker.martinbibb.workers.dev
- **Used for**: Object detection (Auto-Detect feature)
- **Note**: Gemini worker uses a backend API key, not user-provided

## Where to Get an OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to API Keys: https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-` or `sk-proj-`)
6. **Important:** Add a payment method to access GPT-4

## Cost Information

**GPT-4 Pricing** (as of 2024):
- Input: ~$0.03 per 1K tokens
- Output: ~$0.06 per 1K tokens
- Typical guidance generation: 500-800 tokens (~$0.03-0.05 per generation)

## Need Help?

If tests are failing:
1. Visit OpenAI Platform Status: https://status.openai.com/
2. Check your account: https://platform.openai.com/account
3. Review usage and limits: https://platform.openai.com/usage
4. Check browser console (F12) for detailed errors
5. Try the test page at: `test-openai-key.html`
