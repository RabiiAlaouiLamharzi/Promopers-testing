# Cloudflare R2 Setup Guide

## Why R2?
- ✅ **FREE tier**: 10GB storage, 1M operations/month
- ✅ **Easy setup**: Just need 3 environment variables
- ✅ **Reliable**: No suspension issues like Vercel Blob
- ✅ **Fast**: Global CDN
- ✅ **S3-compatible**: Works with AWS SDK

## Setup Steps

### 1. Create Cloudflare Account (if needed)
Go to: https://dash.cloudflare.com/sign-up

### 2. Create R2 Bucket
1. Go to: https://dash.cloudflare.com
2. Click **R2** in sidebar
3. Click **Create bucket**
4. Name it: `promopers-data` (or any name you want)
5. Click **Create bucket**

### 3. Get Your Credentials
1. In R2 dashboard, click **Manage R2 API Tokens**
2. Click **Create API token**
3. Set permissions:
   - **Object Read & Write**
   - **Admin Read**
4. Click **Continue to summary**
5. Click **Create API Token**
6. **Copy these values** (you'll need them):
   - **Account ID** (shown at top of R2 page)
   - **Access Key ID**
   - **Secret Access Key**

### 4. Set Up Public Access (Optional)
If you want to access files via public URLs:
1. Go to your bucket → **Settings** → **Public Access**
2. Click **Allow Access**
3. Note the public URL format: `https://pub-<account-id>.r2.dev`

### 5. Add Environment Variables to Vercel
1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add these variables:

```
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=promopers-data
R2_PUBLIC_URL=https://pub-<your_account_id>.r2.dev
```

3. Click **Save**
4. **Redeploy** your application

### 6. Run Migration
After deployment, run:
```bash
curl -X POST https://your-domain.vercel.app/api/migrate
```

This will copy all your local data (references, blogs, testimonials) to R2.

## That's It! 🎉

Your app now uses Cloudflare R2 instead of Vercel Blob. All data will be stored reliably in R2.

## Troubleshooting

**Error: "R2 storage not configured"**
- Make sure all 3 environment variables are set in Vercel
- Redeploy after adding environment variables

**Error: "Access Denied"**
- Check your R2 API token has "Object Read & Write" permissions
- Make sure bucket name matches `R2_BUCKET_NAME` environment variable

**Data not appearing**
- Run the migration endpoint: `POST /api/migrate`
- Check Vercel logs for errors

