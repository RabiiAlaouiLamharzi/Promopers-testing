#!/bin/bash

# Clear all references and add just one test reference

echo "🗑️  Clearing all references from JSONBin.io..."

# Create a single test reference
SINGLE_REFERENCE='[{
  "id": "test-reference",
  "slug": "test-reference",
  "name": "Test Reference",
  "tagline": "This is a test reference",
  "heroImage": "https://via.placeholder.com/800x400",
  "logo": "",
  "description": ["This is a test reference description."],
  "responsibilities": [],
  "additionalText": "<p>This is test content for a single reference.</p>",
  "services": [],
  "sectionTitle": "",
  "subheading": "",
  "additionalDescription": [],
  "responsibilitiesHeading": "",
  "client": "Test Client",
  "location": "Test Location",
  "date": "01 Jan 2025",
  "tags": ["test"],
  "published": true,
  "createdAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
  "updatedAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
  "translations": {}
}]'

# Upload single reference
echo "📤 Uploading single test reference..."
curl -X POST https://promo-pers-website.vercel.app/api/migrate/upload \
  -H "Content-Type: application/json" \
  -d "{\"references\": $SINGLE_REFERENCE}" \
  -w "\n\nStatus: %{http_code}\n"

echo "✅ Done! Check your admin panel to see the single reference."

