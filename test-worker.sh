#!/bin/bash

# Test script for Clearance Genie Worker

WORKER_URL="https://clearance-genie-worker.martinbibb.workers.dev"

echo "🧪 Testing Clearance Genie Worker at $WORKER_URL"
echo ""

# Test 1: CORS Preflight
echo "Test 1: CORS Preflight (OPTIONS)"
CORS_STATUS=$(curl -X OPTIONS "$WORKER_URL" -s -o /dev/null -w "%{http_code}")
if [ "$CORS_STATUS" = "200" ]; then
  echo "✅ CORS Preflight: PASSED (HTTP $CORS_STATUS)"
else
  echo "❌ CORS Preflight: FAILED (HTTP $CORS_STATUS)"
fi
echo ""

# Test 2: Bug Report Endpoint
echo "Test 2: Bug Report Endpoint (POST /bug-report)"
BUG_RESPONSE=$(curl -X POST "$WORKER_URL/bug-report" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test bug report",
    "timestamp": "2025-11-19T19:00:00Z",
    "userAgent": "test-script",
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
    "consoleInfo": "Test console info"
  }' \
  -s -w "\nHTTP Status: %{http_code}")

echo "$BUG_RESPONSE"
echo ""

# Test 3: Main Detection Endpoint
echo "Test 3: Main Detection Endpoint (POST /)"
DETECT_RESPONSE=$(curl -X POST "$WORKER_URL/" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,test",
    "pxPerMM": 10,
    "mode": "flue",
    "brand": "worcester",
    "position": {"x": 100, "y": 100},
    "imageWidth": 800,
    "imageHeight": 600
  }' \
  -s)

if echo "$DETECT_RESPONSE" | grep -q "error"; then
  echo "⚠️  Detection Endpoint: Response received (may need valid image)"
  echo "$DETECT_RESPONSE" | head -n 5
else
  echo "✅ Detection Endpoint: Response received"
  echo "$DETECT_RESPONSE" | head -n 5
fi
echo ""

echo "🎉 Testing complete!"
