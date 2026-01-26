# Admin Home Page Editor Guide

## Overview

The Home Page Admin Panel (`/admin/home`) allows you to edit **the entire homepage** with a visual inline editor. You see exactly what visitors see, and you can click to edit any text, upload images/videos, and manage translations - all in real-time.

## Accessing the Admin

1. Navigate to: **http://localhost:3004/admin**
2. Enter password: `promopers00001111`
3. Click **"Home Page"**

## Features

### ✨ Visual Inline Editing
- **Click any text** to edit it directly on the page
- See changes immediately as you type
- Edit icon (✏️) appears when you hover over editable content

### 🌍 Language Switcher
- Switch between **EN | FR | DE | IT** at the top
- Edit translations for each language separately
- See exactly how content looks in each language

### 📤 File Uploads
- **Video**: Hover over video background → Click camera icon
- **Logos**: Hover over any logo → Click upload icon
- Files are automatically uploaded to the correct folders

### 💾 Auto-Save
- Click **"Save Changes"** button at top to save
- Changes saved to both local file and JSONBin (if configured)
- Refresh homepage to see live changes

## Sections You Can Edit

### 1. **Hero Section**
- ✅ Video background (upload .mp4 or .webm)
- ✅ Title (3 lines)
- ✅ Description
- ✅ Button text
- ✅ Logo carousel (upload/replace logos)
- ✅ All translations (FR, DE, IT)

### 2. **Features Section**
- ✅ Section title
- ✅ Title highlight
- ✅ Description
- ✅ All translations

### 3. **Contact CTA Section**
- ✅ CTA title
- ✅ Description
- ✅ Button text
- ✅ All translations

### Coming Soon
- About section editing
- Stats section editing  
- Works/Blog section editing
- Testimonials editing (already has separate admin)

## How to Use

### Edit Text
1. Click on any text you want to edit
2. Input field appears with yellow border
3. Type your changes
4. Click outside the field or press Enter to save

### Upload Video
1. Scroll to hero section
2. Hover over the video
3. Click the camera icon that appears (top-right)
4. Select your video file
5. Video uploads automatically

### Upload Logo
1. Scroll to logo carousel (bottom of hero)
2. Hover over any logo
3. Click the upload icon that appears
4. Select your image file
5. Logo replaces automatically

### Switch Languages
1. Click language buttons at top: **EN | FR | DE | IT**
2. Page shows content in selected language
3. Edit text in that language
4. Changes only affect that language

### Save Changes
1. Make your edits
2. Click **"Save Changes"** button (top-right)
3. Wait for success message
4. Refresh homepage to see live changes

## Tips

### Best Practices
- **Save frequently** - Click save after each major edit
- **Test translations** - Switch languages to verify all text
- **Preview changes** - Refresh homepage in another tab to see live
- **Use consistent tone** - Keep language style similar across translations

### Video Guidelines
- Format: MP4 or WebM
- Size: Under 20MB recommended
- Resolution: 1920x1080 or higher
- Will loop automatically with no sound

### Image Guidelines (Logos)
- Format: PNG with transparent background
- Logos display in white (inverted)
- Recommended size: 200x80px
- Keep aspect ratio consistent

## Troubleshooting

### Changes Not Saving
1. Check browser console for errors
2. Verify you clicked "Save Changes"
3. Check file permissions on server

### Video Not Playing
1. Verify video is MP4 format
2. Check file size (under 20MB)
3. Ensure video uploaded successfully

### Translations Missing
1. Switch to language (FR/DE/IT)
2. Edit text fields that appear
3. Save changes
4. Fallback: English text shows if translation empty

## Data Storage

### Where Data is Saved
- **Primary**: JSONBin.io (cloud storage)
- **Backup**: Local file `/data/home.json`
- **Images/Videos**: `/public/video/` and `/public/new-images/`

### Environment Variables
For Vercel deployment, add:
```
JSONBIN_HOME_BIN_ID=your-bin-id
JSONBIN_API_KEY=your-api-key
```

## Next Steps

This system will be expanded to include:
- ✅ About section
- ✅ Stats section with counters
- ✅ Works/Blog previews
- ✅ Full page sections management
- ✅ Image galleries
- ✅ More...

Each section will have the same inline editing experience!

