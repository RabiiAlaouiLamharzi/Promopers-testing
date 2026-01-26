# Environment Setup for JSONBin Integration

## Local Development

Create a `.env.local` file in the project root with the following content:

```
JSONBIN_API_KEY=$2a$10$aaq6.md4pnpW/atPDOeGMeGqplrf.DKg74ztR6ePYpTB7WxTCtwhq
JSONBIN_TRANSLATIONS_BIN_ID=694c8bb843b1c97be9038b77
```

## JSONBin Bin Created

✅ **Bin Name**: website-changes
✅ **Bin ID**: 694c8bb843b1c97be9038b77
✅ **Created**: 2025-12-25

## How It Works

The application uses JSONBin.io to persist changes made in the admin panel:

1. **Translations System**: When you edit text in `/admin/home`, the changes are stored in JSONBin as translation overrides
2. **Persistence**: Changes are saved when you click the "Save Changes" button
3. **Homepage Reflection**: The regular homepage automatically loads these overrides and displays the edited content
4. **Multi-language Support**: Overrides are saved per language, so edits in French only affect the French version

## Admin Workflow

1. Go to `http://localhost:3004/admin/home`
2. Edit any text by clicking the pencil icon next to it
3. Switch languages if needed to edit different language versions
4. Click the yellow "Save Changes" button (bottom right)
5. Changes are now saved to JSONBin and will appear on the homepage

## Verification

To verify it's working:
1. Edit some text in the admin panel and save
2. Go to the regular homepage
3. The edited text should appear
4. Refresh the page - the changes should persist

## Production

The environment variable is already configured in Vercel. Make sure to also add:
```
JSONBIN_TRANSLATIONS_BIN_ID=694c8bb843b1c97be9038b77
```

## Re-initializing the Bin

If you need to recreate the bin or check existing bins, run:
```bash
JSONBIN_API_KEY='$2a$10$aaq6.md4pnpW/atPDOeGMeGqplrf.DKg74ztR6ePYpTB7WxTCtwhq' node scripts/init-jsonbin.js
```
