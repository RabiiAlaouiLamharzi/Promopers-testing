# Team Management Setup for Vercel

## Problem
Adding team members works locally but fails on Vercel because:
1. Vercel's filesystem is **read-only** - cannot write to local files
2. The code was trying to write to local files first, which fails on Vercel
3. Missing environment variables for JSONBin.io storage

## Solution

### Required Environment Variables in Vercel

You **MUST** add these environment variables in your Vercel project:

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Add these variables**:

```
JSONBIN_API_KEY=your_jsonbin_api_key_here
```

**Optional** (if you want to use a specific bin ID):
```
JSONBIN_TEAMS_BIN_ID=your-teams-bin-id
```

3. **Click Save** and **Redeploy** your application

### How to Get JSONBin API Key

1. Go to https://jsonbin.io/
2. Sign up or log in
3. Go to https://jsonbin.io/api-keys
4. Create a new API key
5. Copy the API key and add it to Vercel

### What Was Fixed

The code has been updated to:
- ✅ Only write to local files in development (not on Vercel)
- ✅ Always use JSONBin.io for storage in production/Vercel
- ✅ Provide clear error messages if JSONBin is not configured
- ✅ Handle Vercel's read-only filesystem gracefully
- ✅ **Fixed data structure validation** - ensures JSONBin always stores proper TeamData object (not arrays)
- ✅ **Added validation for update/delete operations** - prevents errors when data structure is invalid
- ✅ **Better error logging** - helps debug issues in production

### Testing

After adding the environment variables and redeploying:

1. Go to your deployed admin panel: `https://your-domain.vercel.app/admin/team`
2. Try adding a new team member
3. It should now work! ✅

### Troubleshooting

**Error: "JSONBIN_API_KEY is required for saving teams in production"**
- Make sure `JSONBIN_API_KEY` is set in Vercel environment variables
- Redeploy after adding the variable

**Error: "Failed to save teams to JSONBin"**
- Check that your JSONBin API key is valid
- Verify you haven't exceeded the free tier limit (10,000 requests/month)
- Check Vercel logs for detailed error messages

**Team members not appearing**
- Make sure you redeployed after adding the environment variable
- Check Vercel function logs for errors
- Verify the JSONBin API key has write permissions

**Can create but can't update/delete team members**
- This was a data structure issue - the fix ensures proper validation
- If you still have issues, check Vercel logs for "Invalid data structure" errors
- You may need to manually fix the JSONBin data structure:
  1. Go to https://jsonbin.io/
  2. Find your teams bin
  3. Ensure it has this structure:
     ```json
     {
       "officeTeam": [],
       "experienceConsultants": [],
       "updatedAt": "2025-01-XX..."
     }
     ```
  4. If it's an empty array `[]`, replace it with the structure above

## Summary

**Required for Vercel:**
- `JSONBIN_API_KEY` ✅ (REQUIRED)

**Optional:**
- `JSONBIN_TEAMS_BIN_ID` (will auto-create if not provided)

That's it! Once you add `JSONBIN_API_KEY` to Vercel and redeploy, team management will work perfectly. 🎉

