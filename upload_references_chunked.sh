#!/bin/bash

# Upload references one at a time to avoid size limits
# JSONBin.io free tier has 1MB limit per bin

echo "📦 Uploading references one by one..."

# Read all references
REFERENCES=$(cat data/references.json)
COUNT=$(echo "$REFERENCES" | jq 'length')

echo "   Found $COUNT references"
echo "   Uploading individually to avoid size limits..."

# Upload each reference individually
for i in $(seq 0 $((COUNT - 1))); do
  REF=$(echo "$REFERENCES" | jq ".[$i]")
  SLUG=$(echo "$REF" | jq -r '.slug')
  
  echo "   [$((i+1))/$COUNT] Uploading: $SLUG"
  
  curl -s -X POST https://promo-pers-website.vercel.app/api/references \
    -H "Content-Type: application/json" \
    -d "$REF" > /dev/null
  
  if [ $? -eq 0 ]; then
    echo "      ✅ Success"
  else
    echo "      ❌ Failed"
  fi
done

echo "✅ All references uploaded!"

