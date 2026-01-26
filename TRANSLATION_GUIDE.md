# Translation Guide for References

## How Translations Work

### Current System
- **English content** is stored in `data/references.json` (editable via admin panel)
- **Translations** for other languages are stored in `lib/translations.ts`
- The system tries to use translations first, then falls back to English

### What Happens When You Modify Content

1. **If you modify a paragraph in the admin panel:**
   - ✅ The English content in `data/references.json` is updated
   - ⚠️ **Translations in `lib/translations.ts` are NOT automatically updated**
   - The translated versions will still show the old text
   - **Solution:** You need to manually update translations in `lib/translations.ts`

2. **If you add a new reference:**
   - ✅ It will work in English immediately
   - ⚠️ **It will NOT have translations** - only English will display
   - **Solution:** Add translations for all languages (FR, DE, IT) in `lib/translations.ts`

## Translation Key Structure

For each reference, translations are stored under:
```typescript
references: {
  [clientKey]: {
    tagline: "...",
    description1: "...", // First paragraph
    description2: "...", // Second paragraph (if exists)
    description3: "...", // Third paragraph (if exists)
    service1: "...",
    service2: "...",
    // etc.
  }
}
```

### Client Key Mapping
- `samsung` → `references.samsung`
- `coca-cola` → `references.cocaCola`
- `jbl` → `references.jbl`
- `arlo` → `references.arlo`
- `asus` → `references.asus`
- New references → `references.[slug]` (slug with hyphens removed)

## Adding Translations for a New Reference

Example for a new reference with slug `new-client`:

1. **In `lib/translations.ts`, add to each language section (en, fr, de, it):**

```typescript
references: {
  // ... existing references
  newclient: {  // slug with hyphens removed
    tagline: "Translation of tagline",
    description1: "Translation of first paragraph",
    description2: "Translation of second paragraph",
    service1: "Translation of first service",
    // ... add all fields that need translation
  }
}
```

## Updating Existing Translations

1. Go to `/admin/references/translations` to see translation status
2. Open `lib/translations.ts`
3. Find the reference by its client key (e.g., `cocaCola`, `samsung`)
4. Update the relevant translation keys
5. Make sure paragraph numbers match (description1, description2, etc.)

## Best Practices

1. **Before modifying content:**
   - Check how many paragraphs exist in translations
   - If adding paragraphs, add corresponding translation keys

2. **After creating a new reference:**
   - Immediately add translations in all languages
   - Or mark it as draft until translations are ready

3. **Translation Status Page:**
   - Visit `/admin/references/translations` to see which references need translations
   - This helps track translation coverage

## Important Notes

- ⚠️ **Paragraph count matters**: If you change from 2 to 3 paragraphs, you need to add `description3` in translations
- ⚠️ **Order matters**: Keep the same order as English content
- ✅ **Fallback**: If translation is missing, English content will be shown automatically
- 📝 **File location**: All translations are in `lib/translations.ts` (one file for all languages)

