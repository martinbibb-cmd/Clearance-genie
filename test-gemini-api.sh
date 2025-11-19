#!/bin/bash

# Test script for Gemini API Worker integration

GEMINI_WORKER_URL="https://geminiworker.martinbibb.workers.dev"
CLEARANCE_WORKER_URL="https://clearance-genie-worker.martinbibb.workers.dev"

echo "🧪 Testing Gemini API Key Integration"
echo ""

# Create a simple test image (1x1 pixel red PNG in base64)
TEST_IMAGE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="

echo "Test 1: Direct Gemini Worker Test (POST)"
echo "Testing: $GEMINI_WORKER_URL"
GEMINI_RESPONSE=$(curl -X POST "$GEMINI_WORKER_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"image\": \"$TEST_IMAGE\",
    \"imageWidth\": 800,
    \"imageHeight\": 600,
    \"prompt\": \"Analyze this wall photo and identify all objects. Return JSON with format: {\\\"objects\\\": []}\"
  }" \
  -s -w "\nHTTP_STATUS:%{http_code}" \
  -m 30)

HTTP_STATUS=$(echo "$GEMINI_RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
RESPONSE_BODY=$(echo "$GEMINI_RESPONSE" | grep -v "HTTP_STATUS:")

echo "HTTP Status: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Gemini Worker: PASSED (HTTP $HTTP_STATUS)"
  echo "Response:"
  echo "$RESPONSE_BODY" | head -n 10

  # Check if response contains error about API key
  if echo "$RESPONSE_BODY" | grep -qi "api.*key\|unauthorized\|authentication"; then
    echo "⚠️  WARNING: Response mentions API key/auth issue"
  elif echo "$RESPONSE_BODY" | grep -qi "error"; then
    echo "⚠️  WARNING: Response contains error"
  else
    echo "✅ API key appears to be working"
  fi
elif [ "$HTTP_STATUS" = "401" ] || [ "$HTTP_STATUS" = "403" ]; then
  echo "❌ Gemini Worker: AUTHENTICATION FAILED (HTTP $HTTP_STATUS)"
  echo "Response: $RESPONSE_BODY"
elif [ "$HTTP_STATUS" = "500" ]; then
  echo "⚠️  Gemini Worker: SERVER ERROR (HTTP $HTTP_STATUS)"
  echo "Response: $RESPONSE_BODY"
  # Check error message for API key issues
  if echo "$RESPONSE_BODY" | grep -qi "api.*key"; then
    echo "❌ API KEY ERROR detected in response"
  fi
else
  echo "⚠️  Gemini Worker: UNEXPECTED STATUS (HTTP $HTTP_STATUS)"
  echo "Response: $RESPONSE_BODY"
fi

echo ""
echo "Test 2: Integration Test via Clearance Worker"
echo "Testing flue detection endpoint: $CLEARANCE_WORKER_URL"

INTEGRATION_RESPONSE=$(curl -X POST "$CLEARANCE_WORKER_URL" \
  -H "Content-Type: application/json" \
  -H "Origin: https://martinbibb-cmd.github.io" \
  -d "{
    \"image\": \"$TEST_IMAGE\",
    \"pxPerMM\": 10,
    \"mode\": \"flue\",
    \"brand\": \"worcester\",
    \"position\": {\"x\": 100, \"y\": 100},
    \"imageWidth\": 800,
    \"imageHeight\": 600
  }" \
  -s -w "\nHTTP_STATUS:%{http_code}" \
  -m 30)

HTTP_STATUS=$(echo "$INTEGRATION_RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
RESPONSE_BODY=$(echo "$INTEGRATION_RESPONSE" | grep -v "HTTP_STATUS:")

echo "HTTP Status: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Integration Test: PASSED (HTTP $HTTP_STATUS)"
  echo "Response:"
  echo "$RESPONSE_BODY" | head -n 10

  if echo "$RESPONSE_BODY" | grep -q "\"success\":true"; then
    echo "✅ Full integration working correctly"
  fi
elif [ "$HTTP_STATUS" = "403" ]; then
  echo "⚠️  Integration Test: CORS/Access issue (HTTP $HTTP_STATUS)"
  echo "Note: This may be due to CORS restrictions. The API key might still be working."
else
  echo "❌ Integration Test: FAILED (HTTP $HTTP_STATUS)"
  echo "Response: $RESPONSE_BODY"
fi

echo ""
echo "🎉 Testing complete!"
echo ""
echo "Summary:"
echo "--------"
if [ "$HTTP_STATUS" = "200" ] && echo "$RESPONSE_BODY" | grep -q "\"success\":true"; then
  echo "✅ API Key is working correctly!"
elif [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ API Key appears to be working (Gemini worker responded successfully)"
elif [ "$HTTP_STATUS" = "403" ]; then
  echo "⚠️  Cannot fully verify due to access restrictions"
  echo "   Please test from the actual application at https://martinbibb-cmd.github.io"
else
  echo "❌ API Key test failed - please check the Gemini worker configuration"
fi
