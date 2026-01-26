# JSONBin.io Setup Guide

## Why JSONBin.io?
- ✅ **SUPER SIMPLE**: Just one API key!
- ✅ **FREE tier**: 10,000 requests/month
- ✅ **No complex setup**: No buckets, no regions, no tokens
- ✅ **Perfect for JSON**: Designed specifically for JSON storage
- ✅ **Reliable**: No suspension issues

## Setup Steps (Takes 2 minutes!)

### 1. Create JSONBin.io Account
Go to: https://jsonbin.io/
Click **Sign Up** (free)

### 2. Get Your API Key
1. After signing up, go to: https://jsonbin.io/api-keys
2. Click **Create API Key**
3. Name it: `PromoPers Website`
4. Click **Create**
5. **Copy the API Key** (you'll need this!)

### 3. Add to Vercel Environment Variables
1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add this variable:

```
JSONBIN_API_KEY=your_api_key_here
```

3. Click **Save**
4. **Redeploy** your application

### 4. Run Migration
After deployment, run:
```bash
curl -X POST https://your-domain.vercel.app/api/migrate
```

This will copy all your local data (references, blogs, testimonials) to JSONBin.io.

## That's It! 🎉

Your app now uses JSONBin.io. It's that simple!

## Optional: Custom Bin IDs

If you want to use specific bin IDs (instead of auto-generated ones), you can add:

```
JSONBIN_REFERENCES_BIN_ID=your-custom-id
JSONBIN_BLOGS_BIN_ID=your-custom-id
JSONBIN_TESTIMONIALS_BIN_ID=your-custom-id
```

But this is optional - the app will create bins automatically.

## Troubleshooting

**Error: "JSONBin.io API key not configured"**
- Make sure `JSONBIN_API_KEY` is set in Vercel environment variables
- Redeploy after adding the variable

**Error: "Rate limit exceeded"**
- Free tier: 10,000 requests/month
- If you exceed this, you can upgrade or wait for reset

**Data not appearing**
- Run the migration endpoint: `POST /api/migrate`
- Check Vercel logs for errors

## That's All!

Much simpler than R2 or Vercel Blob. Just one API key and you're done! 🚀

