/**
 * Script to initialize JSONBin for website changes
 * Run with: node scripts/init-jsonbin.js
 */

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3'
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY || '$2a$10$aaq6.md4pnpW/atPDOeGMeGqplrf.DKg74ztR6ePYpTB7WxTCtwhq'

async function createBin(binName, initialData = {}) {
  try {
    console.log(`Creating bin: ${binName}...`)
    
    const response = await fetch(`${JSONBIN_API_URL}/b`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY,
        'X-Bin-Name': binName,
      },
      body: JSON.stringify(initialData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to create bin: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()
    console.log(`✅ Bin created successfully!`)
    console.log(`   Bin ID: ${result.metadata.id}`)
    console.log(`   Bin Name: ${binName}`)
    console.log(`   Created: ${result.metadata.createdAt}`)
    console.log(`\nAdd this to your .env.local file:`)
    console.log(`JSONBIN_TRANSLATIONS_BIN_ID=${result.metadata.id}`)
    
    return result.metadata.id
  } catch (error) {
    console.error(`❌ Error creating bin:`, error.message)
    throw error
  }
}

async function listBins() {
  try {
    console.log('\nListing existing bins...')
    
    const response = await fetch(`${JSONBIN_API_URL}/b`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to list bins: ${response.status}`)
    }

    const data = await response.json()
    const bins = Array.isArray(data.record) ? data.record : []
    
    console.log(`\nFound ${bins.length} bins:`)
    bins.forEach(bin => {
      console.log(`  - ${bin.name || 'unnamed'} (ID: ${bin.id})`)
    })
    
    return bins
  } catch (error) {
    console.error('Error listing bins:', error.message)
    return []
  }
}

async function main() {
  console.log('🚀 Initializing JSONBin for promoPers website\n')
  
  // List existing bins first
  const existingBins = await listBins()
  
  // Check if "website changes" bin already exists
  const existingBin = existingBins.find(b => 
    (b.name || '').toLowerCase().includes('website') ||
    (b.name || '').toLowerCase().includes('changes') ||
    (b.name || '').toLowerCase() === 'website changes'
  )
  
  if (existingBin) {
    console.log(`\n✅ Found existing bin: "${existingBin.name}" (ID: ${existingBin.id})`)
    console.log(`\nAdd this to your .env.local file:`)
    console.log(`JSONBIN_TRANSLATIONS_BIN_ID=${existingBin.id}`)
    return
  }
  
  // Create new bin
  console.log('\n📦 Creating new "website changes" bin...\n')
  
  const initialData = {
    en: {},
    fr: {},
    de: {},
    it: {},
    updatedAt: new Date().toISOString(),
    description: 'Translation overrides for promoPers website',
  }
  
  await createBin('website-changes', initialData)
}

// Run the script
main().catch(console.error)

