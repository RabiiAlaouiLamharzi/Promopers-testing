# Hero Section Admin Panel Guide

## Overview

The Hero Section Admin Panel allows you to fully customize the homepage hero section without touching any code. You can modify:
- Video background
- Title text (3 lines)
- Description text
- Button text and link
- Overlay opacity
- Logo carousel
- All translations (French, German, Italian)

## Accessing the Admin Panel

1. Navigate to: `http://localhost:3004/admin` (or your domain `/admin`)
2. Enter the admin password: `promopers00001111`
3. Click on **"Hero Section"**

## Features

### 1. Video Background
- **Video URL**: Path to your video file (e.g., `/video/promopers.mp4`)
- **Overlay Opacity**: Control the dark overlay (0-100%) for text readability
- Upload videos to the `/public/video/` folder

### 2. Content (English - Base Language)
- **Title Line 1, 2, 3**: Three separate lines for the main hero title
- **Description**: Subtitle/description text below the title
- **Button Text**: Text displayed on the CTA button
- **Button Link**: Where the button links to (e.g., `#features`, `/contact`)

### 3. Translations
Click to expand the translations section to add content in:
- 🇫🇷 **French (FR)**
- 🇩🇪 **German (DE)**
- 🇮🇹 **Italian (IT)**

Each language has fields for:
- Title Line 1, 2, 3
- Description
- Button Text

**Note**: If a translation is not provided, the English version will be used as fallback.

### 4. Logo Carousel
- Add logos by entering the image path (e.g., `/new-images/logo-n2.png`)
- Click **"Add Logo"** to add it to the carousel
- Remove logos by clicking the ❌ button
- Upload logo images to `/public/new-images/` folder

## How It Works

### Data Storage
- Content is stored in JSONBin.io (cloud storage)
- Local fallback file: `/data/hero.json`
- API endpoint: `/api/hero`

### Frontend Integration
The hero section (`components/hero-section.tsx`) automatically:
1. Fetches content from the API on page load
2. Detects the current language
3. Displays the appropriate translation
4. Falls back to English if translation is missing

### Workflow
1. Edit content in the admin panel
2. Click **"Save Changes"**
3. Changes are saved to JSONBin.io
4. Refresh the homepage to see updates

## Tips

### Video Recommendations
- Use MP4 format for best compatibility
- Keep file size under 20MB for fast loading
- Recommended resolution: 1920x1080 or higher
- The video will loop automatically with no sound

### Text Guidelines
- **Title**: Keep it short and impactful (uppercase looks best)
- **Description**: 1-2 sentences maximum
- **Button Text**: 1-3 words (e.g., "Get Started", "Learn More")

### Logo Guidelines
- Use PNG format with transparent background
- Logos will be displayed in white (brightness-inverted)
- Recommended size: 200x80px
- Logos scroll automatically in a carousel

## Troubleshooting

### Changes Not Appearing
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for errors

### Video Not Playing
1. Verify the video file exists in `/public/video/`
2. Check the video URL path is correct
3. Ensure the video is in MP4 format

### Translations Not Working
1. Make sure you filled in all translation fields
2. Test by switching language in the website navigation
3. Check that the language switcher is working

## Environment Setup

### For Vercel Deployment
Add this environment variable in Vercel:
```
JSONBIN_HERO_BIN_ID=your-bin-id-here
```

### For Local Development
The system will use the local file `/data/hero.json` as fallback if JSONBin is not configured.

## Next Steps

This admin system can be extended to other sections:
- About section
- Features section
- Contact page content
- Footer content
- And more...

The same pattern can be applied to any section of the website.

