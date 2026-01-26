# Automatic Translation System for References

## Overview

The references system now supports **automatic translations** stored directly with each reference in the JSON file. When you modify content or add new references, translations are managed automatically through the admin panel.

## How It Works

### Translation Storage
- **English content**: Stored in the main fields (name, description, services, etc.)
- **Translations**: Stored in the `translations` object with language keys (fr, de, it)
- **Location**: All stored in `data/references.json` - no separate translation files needed!

### Translation Priority
When displaying a reference, the system uses this priority:
1. **Reference's stored translations** (if available) - from `data/references.json`
2. **Static translations.ts** (for backwards compatibility)
3. **English fallback** - if no translation exists

## Using the Admin Panel

### Adding/Editing Translations

1. Go to `/admin/references`
2. Click "Edit" on any reference, or "New Reference" to create one
3. Scroll down and click **"Show Translations"**
4. Fill in translations for:
   - **Français (French)**
   - **Deutsch (German)**  
   - **Italiano (Italian)**

### Translation Fields

For each language, you can translate:
- Tagline
- Description paragraphs (matches English paragraph count)
- Services
- Section Title
- Subheading
- Additional Description paragraphs
- Client name
- Location

**Important**: Leave a field empty to use the English version automatically.

### When You Modify Content

1. **Modify English content**: Edit any field in English
2. **Translations stay**: Your translations remain unless you modify them
3. **Paragraph changes**: If you add/remove description paragraphs, the translation fields will automatically adjust
4. **Auto-save**: When you save, both English and translations are saved together

## Migration Status

✅ **Existing translations migrated**: All translations from `lib/translations.ts` have been automatically copied to `data/references.json`

## Example Translation Structure

```json
{
  "id": "coca-cola",
  "slug": "coca-cola",
  "name": "Coca-Cola",
  "description": ["English paragraph 1", "English paragraph 2"],
  "translations": {
    "fr": {
      "description": ["Paragraphe français 1", "Paragraphe français 2"],
      "tagline": "Développement, planification et mise en œuvre dans toute la Suisse."
    },
    "de": {
      "description": ["Deutscher Absatz 1", "Deutscher Absatz 2"]
    },
    "it": {
      "description": ["Paragrafo italiano 1", "Paragrafo italiano 2"]
    }
  }
}
```

## Benefits

✅ **Automatic**: No need to manually edit `lib/translations.ts`
✅ **Per-reference**: Each reference manages its own translations
✅ **Version control**: Translations are stored with content, making it easier to track changes
✅ **Backwards compatible**: Still works with old `translations.ts` for any missing translations
✅ **Easy management**: Edit translations directly in the admin panel

## Adding Translations for New References

When you create a new reference:

1. Fill in the English content first
2. Click "Show Translations"
3. Add translations for each language
4. Save - translations are stored automatically!

If you don't add translations immediately:
- Reference will display in English only
- You can add translations later by editing the reference
- Users can still view it (in English) while you work on translations

## Updating Existing Translations

1. Edit the reference in admin panel
2. Click "Show Translations"
3. Modify any translation field
4. Save - changes apply immediately!

## Technical Details

- **Translation helper**: `lib/reference-translations.ts` - handles translation logic
- **API support**: All API endpoints support the `translations` field
- **Type safety**: TypeScript interfaces ensure correct structure

