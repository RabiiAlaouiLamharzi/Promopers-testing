#!/bin/bash

# Upload just the FIRST reference from local file (clears all others)

echo "📦 Getting first reference from local file..."

# Get first reference
FIRST_REF=$(cat data/references.json | jq '.[0]')

# Wrap in array
SINGLE_REF="[$FIRST_REF]"

# Create temp file
TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT

echo "{
  \"references\": $SINGLE_REF
}" > "$TEMP_FILE"

echo "📤 Uploading single reference to JSONBin.io..."
echo "   Reference: $(echo $FIRST_REF | jq -r '.name')"

# Upload
curl -X POST https://promo-pers-website.vercel.app/api/migrate/upload \
  -H "Content-Type: application/json" \
  --data-binary "@$TEMP_FILE" \
  -w "\n\nStatus: %{http_code}\n"

echo "✅ Done! Only one reference is now in storage."

