# Imgur Image Storage Setup

## Why Imgur?
- ✅ **FREE**: Unlimited image uploads
- ✅ **SIMPLE**: Just one optional environment variable (client ID)
- ✅ **NO CONFIGURATION**: Works out of the box with a default client ID
- ✅ **PERMANENT STORAGE**: Images are stored permanently
- ✅ **CDN**: Fast global CDN for image delivery

## Setup Steps (Takes 1 minute!)

### Option 1: Use Default Client ID (No Setup Required)
The app works immediately with a default client ID. You don't need to do anything! ✅

### Option 2: Get Your Own Client ID (Recommended for Higher Rate Limits)

1. **Create Imgur Account** (if you don't have one)
   - Go to: https://imgur.com/register
   - Sign up for free

2. **Create Application**
   - Go to: https://api.imgur.com/oauth2/addclient
   - Fill in:
     - **Application name**: `PromoPers Website`
     - **Authorization type**: Select `Anonymous usage without user authorization`
     - **Authorization callback URL**: `https://your-domain.com` (can be any URL)
     - **Application website**: `https://your-domain.com` (can be any URL)
     - **Email**: Your email
     - **Description**: Optional
   - Click **Submit**

3. **Copy Client ID**
   - After creating, you'll see your **Client ID**
   - Copy it (looks like: `abc123def456789`)

4. **Add to Vercel Environment Variables**
   - Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
   - Add:
     ```
     IMGUR_CLIENT_ID=your_client_id_here
     ```
   - Click **Save**
   - **Redeploy** your application

## That's It! 🎉

Your images will now be uploaded to Imgur automatically in production!

## How It Works

- **Development**: Images are saved to the local `public/new-images` folder
- **Production**: Images are automatically uploaded to Imgur and URLs are stored in JSONBin

## Troubleshooting

**Error: "Imgur upload failed"**
- The default client ID might be rate-limited
- Get your own Client ID (see Option 2 above)
- Add `IMGUR_CLIENT_ID` to Vercel environment variables
- Redeploy

**Images not appearing**
- Check Vercel logs for errors
- Verify the image URL is saved correctly in JSONBin
- Make sure you've redeployed after adding the environment variable

## Rate Limits

- **Default Client ID**: ~1,250 uploads per day (shared across all users)
- **Your Own Client ID**: ~1,250 uploads per day (your own limit)
- For higher limits, you can upgrade to Imgur Pro

## Free Tier Limits

- ✅ Unlimited uploads
- ✅ Images stored permanently
- ✅ Free CDN
- ✅ No file size limit (reasonable images are fine)

