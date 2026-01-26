#!/bin/bash

# Upload references separately using temp file

echo "📦 Uploading references separately..."

# Create temporary JSON file
TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT

# Create JSON with just references
echo "{
  \"references\": $(cat data/references.json)
}" > "$TEMP_FILE"

echo "📤 Uploading references to JSONBin.io..."
echo "   File size: $(du -h "$TEMP_FILE" | cut -f1)"

# Upload using file
curl -X POST https://promo-pers-website.vercel.app/api/migrate/upload \
  -H "Content-Type: application/json" \
  --data-binary "@$TEMP_FILE" \
  -w "\n\nStatus: %{http_code}\n"

echo "✅ References upload complete!"

