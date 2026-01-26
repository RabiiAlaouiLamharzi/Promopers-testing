# References Admin System

## Overview
A simple admin system for managing reference articles on the PromoPers website. This system allows admins to create, edit, delete, and publish reference articles.

## Accessing the Admin Panel

Navigate to: `/admin/references`

## Features

### 1. Create New Reference
- Click "New Reference" button
- Fill in the form fields:
  - **Name** (required): The client/company name
  - **Slug** (required): URL-friendly identifier (auto-generated from name)
  - **Client Name**: Full client company name
  - **Location**: Geographic location
  - **Date**: Publication date
  - **Tagline**: Short description
  - **Hero Image**: Main featured image (can upload or use URL)
  - **Logo**: Client logo (can upload or use URL)
  - **Description**: Multiple paragraphs describing the reference
  - **Services**: List of services provided
  - **Tags**: Comma-separated tags
  - **Section Title**: Optional section heading
  - **Subheading**: Optional subheading
  - **Additional Text**: Extended content
  - **Published**: Checkbox to publish/unpublish

### 2. Edit Existing Reference
- Click "Edit" button on any reference card
- Modify any fields
- Click "Update Reference" to save

### 3. Delete Reference
- Click "Delete" button on any reference card
- Confirm deletion

### 4. Image Upload
- Click "Upload" button next to Hero Image or Logo fields
- Select an image file
- Image will be uploaded to Vercel Blob Storage
- URL will be automatically filled in
- **Note**: Requires `BLOB_READ_WRITE_TOKEN` to be configured in Vercel environment variables (see `VERCEL_BLOB_SETUP.md`)

## API Endpoints

### GET /api/references
- Returns all published references
- Add `?admin=true` to get all references (including unpublished)

### GET /api/references?slug=example-slug
- Returns a specific reference by slug

### POST /api/references
- Creates a new reference
- Requires JSON body with reference data

### PUT /api/references/[slug]
- Updates an existing reference
- Requires JSON body with updated fields

### DELETE /api/references/[slug]
- Deletes a reference

### POST /api/references/upload
- Uploads an image file to Vercel Blob Storage
- Returns URL of uploaded image
- Requires `BLOB_READ_WRITE_TOKEN` environment variable

## Data Storage

References are stored in: `data/references.json`

The JSON file structure matches the Reference interface with fields:
- id, slug, name, tagline
- heroImage, logo
- description (array of strings)
- services, tags (arrays)
- responsibilities, additionalDescription (arrays)
- client, location, date
- published (boolean)
- createdAt, updatedAt (ISO timestamps)

## Usage Example

1. **Create a new reference:**
   - Go to `/admin/references`
   - Click "New Reference"
   - Fill in all fields
   - Upload images if needed
   - Check "Published" to make it visible
   - Click "Create Reference"

2. **Edit a reference:**
   - Find the reference in the list
   - Click "Edit"
   - Make changes
   - Click "Update Reference"

3. **Delete a reference:**
   - Find the reference in the list
   - Click "Delete"
   - Confirm deletion

## Notes

- Only published references appear on the public `/references` page
- Unpublished references are marked as "Draft" in the admin panel
- Image uploads are stored in Vercel Blob Storage (not in `public/uploads/`)
- The slug is used in the URL (e.g., `/references/coca-cola`)
- Descriptions can have multiple paragraphs
- Tags should be comma-separated

## Setup for Production (Vercel)

**Important**: Image uploads require Vercel Blob Storage to be configured. See `VERCEL_BLOB_SETUP.md` for detailed setup instructions.

Quick setup:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `BLOB_READ_WRITE_TOKEN` with your blob storage token
3. Redeploy your application

