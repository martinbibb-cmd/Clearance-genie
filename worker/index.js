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
    },
    radiator: {
      wall_side: 50,
      wall_front: 300,
      ceiling: 0,
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
    },
    radiator: {
      wall_side: 50,
      wall_front: 300,
      ceiling: 0,
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
    },
    radiator: {
      wall_side: 50,
      wall_front: 300,
      ceiling: 0,
      floor: 500
    }
  }
};

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Only accept POST
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    try {
      const data = await request.json();
      const {
        image, // base64 image
        pxPerMM, // calibration from card
        mode, // flue or boiler
        brand = "worcester",
        position, // {x, y} where user tapped
        imageWidth,
        imageHeight
      } = data;

      // Validate inputs
      if (!image) {
        return jsonResponse({ error: "Missing image" }, 400, corsHeaders);
      }

      if (!pxPerMM || pxPerMM <= 0) {
        return jsonResponse({ error: "Invalid calibration (pxPerMM)" }, 400, corsHeaders);
      }

      if (!mode || !["flue", "boiler", "radiator"].includes(mode)) {
        return jsonResponse(
          { error: "Invalid mode (must be flue, boiler, or radiator)" },
          400,
          corsHeaders
        );
      }

      // Get clearance rules for this brand and mode
      const rules = CLEARANCE_RULES[brand]?.[mode] || CLEARANCE_RULES.worcester[mode];

      // For flue mode, use Gemini API for object detection
      let detections = [];
      if (mode === 'flue') {
        detections = await detectObjectsWithGemini(image, imageWidth, imageHeight);
      } else {
        // For boiler/radiator mode, no detection needed (user manually marks obstacles)
        detections = [];
      }

      // Gemini API returns coordinates in original image dimensions, no scaling needed

      // Calculate clearance zones
      const zones = calculateClearanceZones(detections, rules, pxPerMM, position, imageWidth, imageHeight);

      return jsonResponse(
        {
          success: true,
          detections,
          zones,
          calibration: {
            pxPerMM,
            brand,
            mode
          }
        },
        200,
        corsHeaders
      );
    } catch (error) {
      console.error("Worker error:", error);
      return jsonResponse(
        {
          error: "Internal server error",
          message: error.message
        },
        500,
        corsHeaders
      );
    }
  }
};

async function detectObjectsWithGemini(imageBase64, imageWidth, imageHeight) {
  // Prepare image for Gemini (ensure proper format)
  const imageUrl = imageBase64.startsWith("data:")
    ? imageBase64
    : `data:image/jpeg;base64,${imageBase64}`;

  try {
    // Call Gemini worker endpoint
    const response = await fetch("https://geminiworker.martinbibb.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: imageUrl,
        imageWidth: imageWidth,
        imageHeight: imageHeight,
        prompt: "Analyze this wall photo and identify all objects. For each object detected, provide: type (window/door/corner/soffit/vent/downpipe/boundary/other), bounding box coordinates {x, y, width, height} in pixels, and a descriptive label. Return ONLY valid JSON with format: {\"objects\": [{\"type\": \"window\", \"label\": \"Front window\", \"x\": 100, \"y\": 200, \"width\": 150, \"height\": 200}]}"
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API error:", error);
      return [];
    }

    const result = await response.json();

    // Gemini worker should return objects in format: {objects: [...]}
    if (result.objects && Array.isArray(result.objects)) {
      return result.objects;
    }

    // If response format is different, try to extract objects
    if (result.detections && Array.isArray(result.detections)) {
      return result.detections;
    }

    console.error("Unexpected Gemini response format:", result);
    return [];
  } catch (error) {
    console.error("Failed to call Gemini API:", error);
    return [];
  }
}

function calculateClearanceZones(detections, rules, pxPerMM, position, imageWidth, imageHeight) {
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

    if (clearanceMM === null) return;

    const clearancePx = clearanceMM * pxPerMM;

    // Calculate the center of the object
    const objCenterX = obj.x + obj.width / 2;
    const objCenterY = obj.y + obj.height / 2;

    // Calculate direction vector from flue to object center
    const dx = objCenterX - position.x;
    const dy = objCenterY - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Determine which sides of the object face the flue
    // This creates a more accurate directional clearance zone
    let zoneX, zoneY, zoneMaxX, zoneMaxY;

    if (obj.type === 'corner') {
      // For corners, create a circular zone (handled by frontend)
      // But we still need to provide a bounding box
      zoneX = obj.x - clearancePx;
      zoneY = obj.y - clearancePx;
      zoneMaxX = obj.x + obj.width + clearancePx;
      zoneMaxY = obj.y + obj.height + clearancePx;
    } else {
      // For other objects, create a directional zone
      // Extend clearance more on the side facing the flue

      // Determine if flue is to the left/right of object
      const flueLeft = position.x < obj.x;
      const flueRight = position.x > obj.x + obj.width;
      const flueAbove = position.y < obj.y;
      const flueBelow = position.y > obj.y + obj.height;

      // Extend clearance in the direction of the flue
      zoneX = flueLeft ? obj.x - clearancePx : obj.x - clearancePx * 0.3;
      zoneY = flueAbove ? obj.y - clearancePx : obj.y - clearancePx * 0.3;
      zoneMaxX = flueRight ? obj.x + obj.width + clearancePx : obj.x + obj.width + clearancePx * 0.3;
      zoneMaxY = flueBelow ? obj.y + obj.height + clearancePx : obj.y + obj.height + clearancePx * 0.3;
    }

    // Clamp to image boundaries
    const clampedX = Math.max(0, zoneX);
    const clampedY = Math.max(0, zoneY);
    const clampedMaxX = imageWidth ? Math.min(imageWidth, zoneMaxX) : zoneMaxX;
    const clampedMaxY = imageHeight ? Math.min(imageHeight, zoneMaxY) : zoneMaxY;

    // Calculate final width and height after clamping
    const finalWidth = clampedMaxX - clampedX;
    const finalHeight = clampedMaxY - clampedY;

    // Only add zone if it has positive dimensions
    if (finalWidth > 0 && finalHeight > 0) {
      const zone = {
        x: clampedX,
        y: clampedY,
        width: finalWidth,
        height: finalHeight,
        reason: `${clearanceMM}mm clearance from ${obj.type}`,
        objectType: obj.type,
        confidence: obj.confidence
      };

      zones.prohibited.push(zone);
    }
  });

  return zones;
}

function getClearanceForObject(objectType, rules) {
  // Map object types to rule keys
  const mapping = {
    window: "window",
    door: "door",
    corner: "corner",
    soffit: "soffit",
    eaves: "soffit",
    vent: "vent",
    downpipe: "downpipe",
    boundary: "boundary",
    wall_left: "wall_side",
    wall_right: "wall_side",
    wall_back: "wall_front",
    ceiling: "ceiling",
    floor: "floor"
  };

  const ruleKey = mapping[objectType];
  return ruleKey ? rules[ruleKey] ?? null : null;
}

function jsonResponse(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}
