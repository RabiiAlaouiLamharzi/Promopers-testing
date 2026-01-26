# Setup Instructions for JSONBin Integration

## ✅ What's Been Done

1. **Created JSONBin Bin**: 
   - Bin Name: `website-changes`
   - Bin ID: `694c8bb843b1c97be9038b77`
   - Created: December 25, 2025

2. **Updated Code**:
   - API route now uses the new bin ID
   - Translation system integrated with JSONBin
   - Admin save functionality connected to database

---

## 🚀 Quick Setup (Choose One Method)

### Method 1: Automatic (Recommended)
Run this command in your terminal:

```bash
cd /Users/rabiialaoui/Downloads/promoPers-website-fresh

cat > .env.local << 'EOF'
JSONBIN_API_KEY=$2a$10$aaq6.md4pnpW/atPDOeGMeGqplrf.DKg74ztR6ePYpTB7WxTCtwhq
JSONBIN_TRANSLATIONS_BIN_ID=694c8bb843b1c97be9038b77
EOF

echo "✅ .env.local created!"
```

### Method 2: Manual
Create a file named `.env.local` in the project root with this content:

```
JSONBIN_API_KEY=$2a$10$aaq6.md4pnpW/atPDOeGMeGqplrf.DKg74ztR6ePYpTB7WxTCtwhq
JSONBIN_TRANSLATIONS_BIN_ID=694c8bb843b1c97be9038b77
```

---

## 🔄 After Creating .env.local

**Restart your development server:**

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

---

## 📱 Testing the Integration

1. **Go to Admin Page**: `http://localhost:3004/admin/home`

2. **Edit Some Text**:
   - Click any pencil icon next to text
   - Edit the text in the popup
   - Click OK

3. **Save Changes**:
   - Click the yellow "Save Changes" button (bottom right)
   - You should see a success toast: "Changes saved successfully to database"

4. **Verify on Homepage**:
   - Go to `http://localhost:3004`
   - Your edited text should appear
   - Refresh the page - changes persist!

5. **Test Multi-Language**:
   - Switch language (top right globe icon)
   - Edit text in French/German/Italian
   - Save
   - Each language saves independently

---

## 🌐 Production (Vercel)

Add these environment variables in your Vercel project settings:

```
JSONBIN_API_KEY=$2a$10$aaq6.md4pnpW/atPDOeGMeGqplrf.DKg74ztR6ePYpTB7WxTCtwhq
JSONBIN_TRANSLATIONS_BIN_ID=694c8bb843b1c97be9038b77
```

**Steps:**
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add both variables
4. Redeploy your application

---

## 🔧 Troubleshooting

### "Failed to save translations" error

**Check:**
1. `.env.local` file exists in project root
2. Both environment variables are set correctly
3. Development server was restarted after creating `.env.local`
4. No typos in the API key or Bin ID

**Verify env vars are loaded:**
```bash
# In your project directory
cat .env.local
```

### Changes don't appear on homepage

**Check:**
1. You clicked "Save Changes" button after editing
2. Wait a few seconds for JSONBin to sync
3. Hard refresh the homepage (Cmd+Shift+R / Ctrl+Shift+R)
4. Check browser console for errors

### Bin ID issues

**Re-initialize the bin:**
```bash
JSONBIN_API_KEY='$2a$10$aaq6.md4pnpW/atPDOeGMeGqplrf.DKg74ztR6ePYpTB7WxTCtwhq' node scripts/init-jsonbin.js
```

---

## 📂 Files Modified

- ✅ `app/api/translations/route.ts` - API endpoint for saving/loading
- ✅ `contexts/text-overrides-context.tsx` - React context for overrides
- ✅ `contexts/language-context.tsx` - Loads overrides on mount
- ✅ `components/editable-text.tsx` - Saves to overrides on edit
- ✅ `components/hero-section-editable.tsx` - Added translation keys
- ✅ `app/admin/home/page.tsx` - Connected save button
- ✅ `scripts/init-jsonbin.js` - Bin initialization script

---

## 💡 How It Works

1. **Default Translations**: Stored in `lib/translations.ts`
2. **Overrides**: Stored in JSONBin (bin ID: `694c8bb843b1c97be9038b77`)
3. **Merge**: On page load, overrides are merged with defaults
4. **Precedence**: Overrides take precedence over defaults
5. **Per-Language**: Each language has separate overrides

**Example:**
- Default: `hero.titleLine1` = "ELEVATE YOUR"
- Edit to: "BOOST YOUR"
- Saved as override in JSONBin
- Homepage shows: "BOOST YOUR"

---

## 🎯 Next Steps

If you want to make ALL text editable (not just hero section):

1. Add `translationKey` props to EditableText components in other sections
2. Example:
```tsx
<EditableText
  value={title}
  onChange={setTitle}
  translationKey="about.title"  // ← Add this
  editMode={editMode}
/>
```

Let me know if you need help with this!

