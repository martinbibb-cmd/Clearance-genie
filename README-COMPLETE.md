# Clearance Genie - Complete User Guide

## 📖 Table of Contents

1. [What is Clearance Genie?](#what-is-clearance-genie)
2. [Quick Start](#quick-start)
3. [Deployment Options](#deployment-options)
4. [How to Use On-Site](#how-to-use-on-site)
5. [Equipment-Specific Guides](#equipment-specific-guides)
6. [Troubleshooting](#troubleshooting)
7. [Customization](#customization)
8. [Best Practices](#best-practices)
9. [Technical Specifications](#technical-specifications)

---

## What is Clearance Genie?

Clearance Genie is a mobile-first web application that helps Gas Safe engineers quickly verify clearance requirements for:

- **Flue Terminals** (Worcester Bosch, Vaillant, Ideal)
- **Boilers** (Service access clearances)
- **Radiators** (Air circulation and safety)
- **Cylinders** (Discharge pipework and maintenance access)

### Key Features

✅ **Works Offline** - No internet connection required after loading
✅ **Manual Marking** - 100% reliable, engineer-controlled
✅ **Visual Zones** - Color-coded clearance visualization
✅ **Photo Documentation** - Download annotated photos
✅ **Mobile Optimized** - Works on phones and tablets
✅ **Zero Cost** - No API keys, no subscriptions

---

## Quick Start

### Option 1: Test Locally (2 Minutes)

1. Download `clearance-genie-complete.html`
2. Open in your mobile browser (Safari/Chrome)
3. Allow camera access when prompted
4. Take a photo with an 85mm reference card
5. Follow the on-screen instructions

### Option 2: Deploy to Web (5 Minutes)

**Using GitHub Pages (Free):**

```bash
# Create a new repository
# Upload clearance-genie-complete.html
# Rename to index.html
# Settings → Pages → Enable from main branch
# Access at: https://username.github.io/repo-name
```

**Using Your Own Website:**

```bash
# Simply upload clearance-genie-complete.html to your server
# Link to it: https://yoursite.com/clearance-genie-complete.html
```

---

## Deployment Options

### GitHub Pages (Recommended)

**Pros:**
- Free hosting
- HTTPS by default
- Easy to update
- Professional URL

**Steps:**
1. Create GitHub account (if needed)
2. New repository: `clearance-genie`
3. Upload file, rename to `index.html`
4. Settings → Pages → Enable
5. Done!

**Access:** `https://username.github.io/clearance-genie`

### Cloudflare Pages

**Pros:**
- Free hosting
- Global CDN (fast worldwide)
- Automatic deployments

**Steps:**
1. Sign up at cloudflare.com
2. Pages → Create Project
3. Upload `clearance-genie-complete.html` as `index.html`
4. Deploy

**Access:** `https://project-name.pages.dev`

### Your Own Domain

**Pros:**
- Professional branding
- Full control
- Can integrate with existing site

**Steps:**
1. Upload to your web hosting
2. Link from your main site
3. Optionally set up custom domain

**Access:** `https://yourdomain.com/clearance-genie`

### Offline/Local Use

**Pros:**
- No deployment needed
- Works completely offline
- Instant access

**Steps:**
1. Save `clearance-genie-complete.html` to phone
2. Open in browser
3. Bookmark for easy access

**Best for:** Engineers working in areas with poor connectivity

---

## How to Use On-Site

### Complete Workflow (2 Minutes per Check)

**1. Preparation (At Office/Van)**
- Print 85mm reference cards (credit card size)
- Bookmark the app on phone
- Test with sample photo

**2. On-Site (During Survey)**

#### Step 1: Select Equipment (5 seconds)
- Tap equipment type: Flue, Boiler, Radiator, or Cylinder
- Select manufacturer (if applicable)

#### Step 2: Take Photo (10 seconds)
- Position 85mm reference card near equipment
- Card should be in same plane as equipment
- Ensure good lighting
- Include all relevant obstacles
- Take photo

#### Step 3: Upload & Calibrate (15 seconds)
- Upload photo to app
- Tap two points on reference card edges
- App calculates scale automatically

#### Step 4: Mark Equipment (5 seconds)
- Tap center of flue/boiler/radiator/cylinder
- Green marker appears

#### Step 5: Mark Obstacles (30-60 seconds)
- Select obstacle type (window, door, etc.)
- Draw rectangle around it
- Repeat for all obstacles
- Tap "Calculate Clearances"

#### Step 6: Review Results (10 seconds)
- View color-coded zones
- Check PASS/FAIL status
- Download annotated photo
- Save to job file

**3. Documentation**
- Annotated photo shows exact clearances
- Professional presentation to customer
- Evidence for Building Control
- Attach to job documentation

---

## Equipment-Specific Guides

### Flue Terminals

**Applicable Standards:**
- Building Regulations Part J
- Manufacturer instructions (Worcester Bosch/Vaillant/Ideal)

**Reference Card Placement:**
- On wall near flue terminal
- Same depth as flue face

**Obstacles to Mark:**
- **Opening Windows** (300mm prohibited zone)
- **Non-Opening Windows** (150mm required clearance)
- **Doors** (300mm prohibited)
- **Vents** (300mm prohibited)
- **Building Corners** (300mm required)
- **Ground Level** (300mm below required)

**Common Issues:**
- Windows directly above/beside flue
- Insufficient height above ground
- Too close to building corners

**Tips:**
- Mark all opening windows first
- Check both horizontal and vertical clearances
- Don't forget ground clearance

### Boilers

**Applicable Standards:**
- Building Regulations Part G3
- Manufacturer service requirements

**Reference Card Placement:**
- On front face of boiler
- Level with central controls

**Obstacles to Mark:**
- **Walls/Enclosures** (50mm sides minimum)
- **Ceiling** (300mm above for access)
- **Floor** (300mm below for access)
- **Cupboard Doors** (300mm clearance when open)

**Common Issues:**
- Tight cupboard installations
- Insufficient top access for controls
- Side clearance for case removal

**Tips:**
- Consider case removal clearance
- Account for cupboard door swing
- Verify access to all controls

### Radiators

**Applicable Standards:**
- Best practice guidelines
- Safety recommendations

**Reference Card Placement:**
- On wall behind radiator
- Or on radiator face

**Obstacles to Mark:**
- **Walls** (50mm for air circulation)
- **Floor** (150mm below)
- **Curtains** (100mm - fire safety)
- **Furniture** (150mm for efficiency)
- **Electrical Sockets** (150mm clearance)

**Common Issues:**
- Curtains hanging over radiators
- Furniture blocking airflow
- Too close to sockets

**Tips:**
- Consider furniture placement with customer
- Explain fire risk of curtain contact
- Mark optimal position for efficiency

### Cylinders

**Applicable Standards:**
- Building Regulations Part G3
- Unvented cylinder regulations

**Reference Card Placement:**
- On front of cylinder
- At mid-height

**Obstacles to Mark:**
- **Ceiling** (450mm above for discharge pipe)
- **Walls** (150mm sides for service access)
- **Floor** (100mm below recommended)

**Common Issues:**
- Insufficient ceiling clearance
- Cannot access temperature/pressure relief valve
- Tight airing cupboard installations

**Tips:**
- Measure vertical space for discharge pipe
- Ensure valve access for annual service
- Consider expansion vessel location

---

## Troubleshooting

### Common Issues and Solutions

#### "Canvas not showing after upload"

**Cause:** Photo file too large
**Solution:** Resize photo to < 5MB before upload
**Prevention:** Use medium quality camera setting

#### "Touch/tap not registering"

**Cause:** Browser compatibility
**Solution:** Use Chrome or Safari
**Check:** Update browser to latest version

#### "Measurements seem inaccurate"

**Cause:** Reference card not properly marked
**Solution:**
- Ensure card is 85mm (standard credit card)
- Mark exact edges of card
- Card must be in same plane as equipment
- Reset and re-mark scale points

#### "Can't see all obstacles in photo"

**Cause:** Photo framing
**Solution:** Retake photo with wider angle
**Prevention:** Take photo from further back

#### "App won't load"

**Cause:** Browser issues
**Solution:**
- Clear browser cache
- Use incognito/private mode
- Try different browser
- Check file wasn't corrupted during download

#### "Downloaded photo is poor quality"

**Cause:** Canvas resolution
**Solution:** Take higher resolution original photo
**Technical:** Canvas matches original photo resolution

### Browser Compatibility

**Fully Supported:**
- Chrome (Android/iOS/Desktop)
- Safari (iOS/macOS)
- Edge (Desktop/Mobile)

**Limited Support:**
- Firefox (may have touch issues on mobile)
- Opera (not tested extensively)

**Not Supported:**
- Internet Explorer (deprecated)
- Very old browsers

### Performance Tips

**For Best Performance:**
- Use photos < 5MB
- Close other browser tabs
- Use on device with 2GB+ RAM
- Clear browser cache regularly

**If App is Slow:**
- Reduce photo resolution
- Use MVP version (flues only)
- Restart browser
- Close background apps

---

## Customization

### Adding New Manufacturers

**Location in Code:** Find `CLEARANCE_RULES` object (around line 200)

**Example - Adding Baxi:**

```javascript
baxi: {
    name: 'Baxi',
    rules: [
        {
            obstacle_type: 'opening_window',
            clearances: { above: 300, below: 300, sides: 300 },
            zone_type: 'prohibited',
            color: 'rgba(255, 0, 0, 0.3)',
            label: 'Opening Window'
        },
        // Add more rules...
    ]
}
```

**Then update manufacturer dropdown:**

```html
<option value="baxi">Baxi</option>
```

### Changing Clearance Values

**Example - Changing opening window clearance:**

```javascript
// Original:
clearances: { above: 300, below: 300, sides: 300 }

// Changed to 350mm:
clearances: { above: 350, below: 350, sides: 350 }
```

**Note:** All measurements in millimeters

### Changing Colors

**Clearance Zone Colors:**

```javascript
// Red = Prohibited (300mm zones)
color: 'rgba(255, 0, 0, 0.3)'

// Orange = Required (150mm zones)
color: 'rgba(255, 165, 0, 0.3)'

// Green = Recommended (best practice)
color: 'rgba(0, 255, 0, 0.3)'
```

**Format:** `rgba(red, green, blue, opacity)`
**Opacity:** 0.3 = 30% transparent (recommended)

### Adding New Equipment Types

**More complex - requires:**
1. Add to `CLEARANCE_RULES` object
2. Add equipment button in HTML
3. Define specific obstacles
4. Set clearance requirements

**See:** CLEARANCE_GENIE_REBUILD_PLAN.md for technical details

---

## Best Practices

### Reference Card Tips

**What Works:**
- Standard credit card (85mm x 54mm)
- Laminated card printed with "85mm" marked
- Any object with known 85mm dimension

**Best Practices:**
- Keep cards clean and visible
- Position in same plane as equipment
- Mark edges clearly in photo
- Keep multiple cards in van

**Common Mistakes:**
- Card at different depth/angle
- Card partially obscured
- Measuring wrong dimension (use width, not height)

### Photography Tips

**Lighting:**
- Natural light best
- Avoid direct shadows
- Use phone flash if dark
- Ensure all obstacles visible

**Framing:**
- Equipment in center
- Reference card clearly visible
- All obstacles in frame
- Straight-on angle (not extreme perspective)

**Quality:**
- Use phone's main camera
- Medium to high quality setting
- Hold steady (use timer if shaky)
- Clean camera lens first

### Workflow Integration

**Survey Workflow:**
1. Initial survey walkthrough
2. Take clearance photos (with reference cards)
3. Complete survey documentation
4. Process photos in van/office
5. Attach to job file
6. Include in customer report

**Team Standardization:**
- All engineers use same app
- Consistent reference cards
- Standard photo naming: `job-123-flue-clearance.png`
- Central storage of annotated photos

### Documentation

**What to Save:**
- Original photo
- Annotated photo with zones
- Screenshot of pass/fail result

**Where to Save:**
- Job management system
- Customer documentation
- Building Control submission
- Compliance records

**Retention:**
- Keep for warranty period (5-10 years)
- Required for Gas Safe audits
- Evidence in case of disputes

---

## Technical Specifications

### System Requirements

**Minimum:**
- Modern smartphone (2018+)
- 2GB RAM
- Modern browser (Chrome/Safari)
- Camera access

**Recommended:**
- Smartphone or tablet (2020+)
- 4GB+ RAM
- Latest Chrome or Safari
- Good camera (8MP+)

### File Specifications

**clearance-genie-complete.html:**
- Size: ~45KB
- Format: Single HTML file
- Dependencies: None
- API Keys: None required
- Internet: Only for initial load

**clearance-genie-mvp.html:**
- Size: ~25KB
- Format: Single HTML file
- Scope: Flues only
- Simpler interface

### Measurement Accuracy

**Scale Calibration:**
- Reference: 85mm (credit card width)
- Accuracy: ±2mm (typical)
- Depends on photo quality and marking precision

**Clearance Measurements:**
- Resolution: 1mm
- Accuracy: ±5mm (typical)
- Limited by photo resolution and marking

**Best Accuracy Achieved With:**
- High resolution photo (12MP+)
- Reference card close to equipment
- Careful scale marking
- Straight-on photo angle

### Browser Storage

**What's Stored:**
- None! Completely stateless
- Photos processed in-memory only
- Downloaded photos saved to device
- No cookies, no tracking

**Privacy:**
- Photos never leave device
- No data sent to servers
- Works completely offline
- No user account needed

---

## Support and Updates

### Getting Help

**Common Questions:**
- Read this README
- Check Troubleshooting section
- Review START-HERE.md
- Check COMPARISON.md for old vs new

**Technical Details:**
- See CLEARANCE_GENIE_REBUILD_PLAN.md
- Read code comments in HTML files
- Check CLEARANCE-STANDARDS-REFERENCE.md

### Updating the App

**To Update Deployed Version:**
1. Download new version of HTML file
2. Replace old file on server/GitHub
3. Clear browser cache on devices
4. Reload app

**No Breaking Changes:**
- Updates maintain compatibility
- Bookmarks continue to work
- No user action required

### Contributing

**Want to Add Features?**
- The code is simple and commented
- Edit the HTML file directly
- Test thoroughly before deploying
- Share improvements with team

**Suggested Enhancements:**
- Additional manufacturers
- New equipment types
- Custom clearance rules
- Improved UI/UX

---

## Quick Reference

### Standard Clearances (UK Building Regs)

**Flue Terminals:**
- Opening windows: 300mm
- Non-opening windows: 150mm
- Doors: 300mm
- Ground level: 300mm below

**Boilers:**
- Side clearance: 50mm
- Top access: 300mm
- Bottom access: 300mm

**Radiators:**
- Wall clearance: 50mm
- Floor clearance: 150mm
- Curtain clearance: 100mm

**Cylinders:**
- Ceiling (discharge): 450mm
- Service access: 150mm

**Note:** Always check manufacturer's specific requirements

---

## Appendix

### File Structure

```
clearance-genie-complete.html  - Main application
clearance-genie-mvp.html       - Simplified (flues only)
START-HERE.md                  - Quick start guide
README-COMPLETE.md             - This file
CLEARANCE_GENIE_REBUILD_PLAN.md - Technical strategy
CLEARANCE-STANDARDS-REFERENCE.md - UK regulations
COMPARISON.md                  - Old vs New analysis
```

### Related Applications

**By Same Developer:**
- Depot Voice Notes - Survey transcription
- System Recommendation - Heating system selector
- Notes Elite - Safety documentation
- Flue Genie - Original version (deprecated)

**Integration:**
- Use Clearance Genie during surveys
- Link with Voice Notes for documentation
- Connect to System Recommendation workflow
- Replace Flue Genie completely

---

## License and Usage

**License:** Free to use for Gas Safe engineers
**Modification:** Allowed and encouraged
**Distribution:** Share with colleagues
**Commercial Use:** Permitted
**Attribution:** Appreciated but not required

---

## Final Notes

This tool is designed to **assist** Gas Safe engineers, not replace professional judgment. Always:

- Follow manufacturer instructions
- Comply with Building Regulations
- Verify critical measurements with tape measure
- Document everything
- Prioritize safety

**The app provides visual verification and professional documentation. You are responsible for final approval.**

Good luck with your surveys! 🔥
