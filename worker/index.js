// Clearance Genie AI Worker
// Detects objects and calculates clearance zones for flue/boiler installations

// Brand-specific clearance rules (in mm from obstruction edge to flue/boiler center)
const CLEARANCE_RULES = {
worcester: {
flue: {
window: 300,
door: 300,
corner: 300,
soffit: 300,
vent: 300,
boundary: 600,
ground: 2000,
downpipe: 75
},
boiler: {
wall_side: 50,
wall_front: 300,
ceiling: 50,
floor: 500
}
},
vaillant: {
flue: {
window: 300,
door: 300,
corner: 300,
soffit: 300,
vent: 300,
boundary: 600,
ground: 2000,
downpipe: 75
},
boiler: {
wall_side: 50,
wall_front: 300,
ceiling: 50,
floor: 500
}
},
ideal: {
flue: {
window: 300,
door: 300,
corner: 300,
soffit: 300,
vent: 300,
boundary: 600,
ground: 2000,
downpipe: 75
},
boiler: {
wall_side: 50,
wall_front: 300,
ceiling: 50,
floor: 500
}
}
};

export default {
async fetch(request, env, ctx) {
// CORS headers
const corsHeaders = {
“Access-Control-Allow-Origin”: “*”,
“Access-Control-Allow-Methods”: “POST, OPTIONS”,
“Access-Control-Allow-Headers”: “Content-Type”,
};

```
// Handle CORS preflight
if (request.method === "OPTIONS") {
  return new Response(null, { headers: corsHeaders });
}

// Only accept POST
if (request.method !== "POST") {
  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

try {
  const data = await request.json();
  const {
    image,           // base64 image
    pxPerMM,         // calibration from card
    mode,            // flue or boiler
    brand = "worcester",
    position         // {x, y} where user tapped
  } = data;

  // Validate inputs
  if (!image) {
    return jsonResponse({ error: "Missing image" }, 400, corsHeaders);
  }

  if (!pxPerMM || pxPerMM <= 0) {
    return jsonResponse({ error: "Invalid calibration (pxPerMM)" }, 400, corsHeaders);
  }

  if (!mode || !["flue", "boiler"].includes(mode)) {
    return jsonResponse({ error: "Invalid mode (must be flue or boiler)" }, 400, corsHeaders);
  }

  if (!env.OPENAI_API_KEY) {
    return jsonResponse({ error: "OpenAI API key not configured" }, 500, corsHeaders);
  }

  // Get clearance rules for this brand and mode
  const rules = CLEARANCE_RULES[brand]?.[mode] || CLEARANCE_RULES.worcester[mode];

  // Build prompt for OpenAI Vision
  const prompt = buildDetectionPrompt(mode);

  // Call OpenAI Vision API
  const detections = await detectObjects(image, prompt, env.OPENAI_API_KEY);

  // Calculate clearance zones
  const zones = calculateClearanceZones(detections, rules, pxPerMM, position);

  return jsonResponse({
    success: true,
    detections,
    zones,
    calibration: {
      pxPerMM,
      brand,
      mode
    }
  }, 200, corsHeaders);

} catch (error) {
  console.error("Worker error:", error);
  return jsonResponse({
    error: "Internal server error",
    message: error.message
  }, 500, corsHeaders);
}
```

}
};

function buildDetectionPrompt(mode) {
if (mode === “flue”) {
return `Analyze this exterior wall photo and identify all objects relevant for flue terminal placement.

Detect and return coordinates for:

- Windows (opening areas, not frames)
- Doors
- Corners (where walls meet)
- Soffits/eaves
- Air vents/grilles
- Downpipes
- Property boundaries (edges of photo that represent adjacent properties)

For each object, provide:

1. Type (window/door/corner/soffit/vent/downpipe/boundary)
1. Bounding box coordinates in pixels: {x, y, width, height}
1. Confidence score (0-1)

Return ONLY valid JSON in this exact format:
{
“objects”: [
{“type”: “window”, “x”: 100, “y”: 200, “width”: 150, “height”: 200, “confidence”: 0.95},
{“type”: “corner”, “x”: 50, “y”: 0, “width”: 10, “height”: 500, “confidence”: 0.88}
]
}`; } else { // boiler mode return `Analyze this interior photo and identify all objects relevant for boiler placement.

Detect and return coordinates for:

- Walls (left, right, back)
- Ceiling
- Floor
- Existing pipes/services
- Cupboards/obstacles
- Windows
- Doors

For each object, provide:

1. Type (wall_left/wall_right/wall_back/ceiling/floor/pipe/obstacle/window/door)
1. Bounding box coordinates in pixels: {x, y, width, height}
1. Confidence score (0-1)

Return ONLY valid JSON in this exact format:
{
“objects”: [
{“type”: “wall_left”, “x”: 0, “y”: 0, “width”: 50, “height”: 800, “confidence”: 0.92},
{“type”: “ceiling”, “x”: 0, “y”: 0, “width”: 1200, “height”: 50, “confidence”: 0.95}
]
}`;
}
}

async function detectObjects(imageBase64, prompt, apiKey) {
// Prepare image for OpenAI (ensure proper format)
const imageUrl = imageBase64.startsWith(“data:”)
? imageBase64
: `data:image/jpeg;base64,${imageBase64}`;

const response = await fetch(“https://api.openai.com/v1/chat/completions”, {
method: “POST”,
headers: {
“Content-Type”: “application/json”,
“Authorization”: `Bearer ${apiKey}`
},
body: JSON.stringify({
model: “gpt-4o-mini”,
messages: [
{
role: “user”,
content: [
{
type: “text”,
text: prompt
},
{
type: “image_url”,
image_url: {
url: imageUrl
}
}
]
}
],
max_tokens: 1000,
temperature: 0.1
})
});

if (!response.ok) {
const error = await response.text();
throw new Error(`OpenAI API error: ${error}`);
}

const result = await response.json();
const content = result.choices?.[0]?.message?.content;

if (!content) {
throw new Error(“No response from OpenAI”);
}

// Parse JSON response (strip markdown if present)
let jsonText = content.trim();
if (jsonText.startsWith(”`json")) { jsonText = jsonText.replace(/`json\n?/, “”).replace(/\n?`$/, ""); } else if (jsonText.startsWith("`”)) {
jsonText = jsonText.replace(/`\n?/, "").replace(/\n?`$/, “”);
}

try {
const parsed = JSON.parse(jsonText);
return parsed.objects || [];
} catch (e) {
console.error(“Failed to parse OpenAI response:”, jsonText);
return [];
}
}

function calculateClearanceZones(detections, rules, pxPerMM, position) {
const zones = {
prohibited: [],
restricted: [],
safe: []
};

// If no position specified, cannot calculate zones
if (!position) {
return zones;
}

// For each detected object, create a prohibited zone based on clearance rules
detections.forEach(obj => {
const clearanceMM = getClearanceForObject(obj.type, rules);

```
if (clearanceMM === null) return;

const clearancePx = clearanceMM * pxPerMM;

// Create rectangular prohibited zone around the object
const zone = {
  x: obj.x - clearancePx,
  y: obj.y - clearancePx,
  width: obj.width + (clearancePx * 2),
  height: obj.height + (clearancePx * 2),
  reason: `${clearanceMM}mm clearance from ${obj.type}`,
  objectType: obj.type,
  confidence: obj.confidence
};

zones.prohibited.push(zone);
```

});

return zones;
}

function getClearanceForObject(objectType, rules) {
// Map object types to rule keys
const mapping = {
“window”: “window”,
“door”: “door”,
“corner”: “corner”,
“soffit”: “soffit”,
“eaves”: “soffit”,
“vent”: “vent”,
“downpipe”: “downpipe”,
“boundary”: “boundary”,
“wall_left”: “wall_side”,
“wall_right”: “wall_side”,
“wall_back”: “wall_front”,
“ceiling”: “ceiling”,
“floor”: “floor”
};

const ruleKey = mapping[objectType];
return ruleKey ? (rules[ruleKey] || null) : null;
}

function jsonResponse(data, status, corsHeaders) {
return new Response(JSON.stringify(data), {
status,
headers: {
…corsHeaders,
“Content-Type”: “application/json”
}
});
}