# Vercel Blob Storage Setup Guide

## Problem
When deploying to Vercel, image uploads fail with the error:
```
Error: Blob storage not configured. Please set BLOB_READ_WRITE_TOKEN in Vercel environment variables.
```

This happens because Vercel Blob Storage requires a token to be configured in your Vercel project's environment variables.

## Solution: Configure BLOB_READ_WRITE_TOKEN

### Step 1: Get Your Blob Storage Token

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** in the left sidebar
3. Click on **Create Database** or **Blob** (if you haven't created one yet)
4. Create a new Blob store for your project
5. Once created, you'll see your **BLOB_READ_WRITE_TOKEN** in the storage settings

Alternatively, you can get it via the Vercel CLI:
```bash
vercel blob store ls
```

### Step 2: Add Environment Variable in Vercel

1. Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add the following:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Your blob storage token (from Step 1)
   - **Environment**: Select all environments (Production, Preview, Development)
6. Click **Save**

### Step 3: Redeploy Your Application

After adding the environment variable, you need to redeploy:

1. Go to the **Deployments** tab in your Vercel project
2. Click the **⋯** menu on your latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a new deployment

### Step 4: Verify It Works

1. Go to your deployed admin section
2. Try uploading an image
3. It should now work without errors!

## Local Development Setup

For local development, create a `.env.local` file in your project root:

```env
BLOB_READ_WRITE_TOKEN=your_token_here
```

**Important**: Never commit `.env.local` to git! It's already in `.gitignore`.

## Alternative: Using Vercel CLI

You can also set the environment variable using the Vercel CLI:

```bash
vercel env add BLOB_READ_WRITE_TOKEN
```

Then enter your token when prompted.

## Troubleshooting

### Still getting errors after setup?

1. **Verify the token is set**: 
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Make sure `BLOB_READ_WRITE_TOKEN` is listed and has a value

2. **Check environment scope**:
   - Make sure the variable is enabled for the environment you're using (Production/Preview/Development)

3. **Redeploy**:
   - Environment variables only take effect after a new deployment
   - Make sure you've redeployed after adding the variable

4. **Check token validity**:
   - Make sure you copied the entire token (they can be quite long)
   - Verify the token hasn't expired or been revoked

### Need Help?

- [Vercel Blob Storage Documentation](https://vercel.com/docs/storage/vercel-blob/quickstart)
- [Vercel Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

## Why This Is Needed

Vercel's serverless functions run in a read-only filesystem. This means you cannot save uploaded files directly to the `public` folder at runtime. Vercel Blob Storage provides a cloud-based solution for storing files that works seamlessly with Vercel deployments.

The admin section uses Vercel Blob Storage to:
- Upload blog images
- Upload testimonial images  
- Upload reference images

All uploads are stored securely in Vercel's blob storage and are publicly accessible via CDN URLs.

