#!/bin/bash

# Upload data to JSONBin.io using temporary file
# This avoids "Argument list too long" errors

echo "📦 Preparing data upload..."

# Create temporary JSON file
TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT

# Combine all data into one JSON object
echo "{
  \"references\": $(cat data/references.json),
  \"blogs\": $(cat data/blogs.json),
  \"testimonials\": $(cat data/testimonials.json)
}" > "$TEMP_FILE"

echo "📤 Uploading to JSONBin.io..."
echo "   File size: $(du -h "$TEMP_FILE" | cut -f1)"

# Upload using file
curl -X POST https://promo-pers-website.vercel.app/api/migrate/upload \
  -H "Content-Type: application/json" \
  --data-binary "@$TEMP_FILE" \
  -w "\n\nStatus: %{http_code}\n"

echo "✅ Upload complete!"
