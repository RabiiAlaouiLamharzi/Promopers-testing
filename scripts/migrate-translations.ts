/**
 * Migration script to copy translations from lib/translations.ts to data/references.json
 * Run this once to migrate existing translations to the new system
 */

import fs from 'fs'
import path from 'path'
import { translations } from '../lib/translations'

const DATA_FILE = path.join(process.cwd(), 'data', 'references.json')

const slugToKey: Record<string, string> = {
  'samsung': 'samsung',
  'coca-cola': 'cocaCola',
  'jbl': 'jbl',
  'arlo': 'arlo',
  'asus': 'asus'
}

function migrateTranslations() {
  try {
    const fileContents = fs.readFileSync(DATA_FILE, 'utf8')
    const references = JSON.parse(fileContents)

    const updatedReferences = references.map((ref: any) => {
      const clientKey = slugToKey[ref.slug] || ref.slug.replace(/-/g, '')
      const translationsObj: any = {
        fr: {},
        de: {},
        it: {}
      }

      // Migrate from each language
      ;['fr', 'de', 'it'].forEach((lang: string) => {
        const langTranslations = (translations as any)[lang]?.references?.[clientKey]
        if (!langTranslations) return

        if (langTranslations.tagline) translationsObj[lang].tagline = langTranslations.tagline
        
        // Migrate descriptions
        if (ref.description && Array.isArray(ref.description)) {
          translationsObj[lang].description = ref.description.map((_: string, index: number) => {
            const key = `description${index + 1}` as keyof typeof langTranslations
            return (langTranslations[key] as string) || ''
          }).filter(Boolean)
        }

        // Migrate services
        if (ref.services && Array.isArray(ref.services)) {
          translationsObj[lang].services = ref.services.map((_: string, index: number) => {
            const key = `service${index + 1}` as keyof typeof langTranslations
            return (langTranslations[key] as string) || ''
          }).filter(Boolean)
        }

        if (langTranslations.sectionTitle) translationsObj[lang].sectionTitle = langTranslations.sectionTitle
        if (langTranslations.subheading) translationsObj[lang].subheading = langTranslations.subheading

        // Migrate additional descriptions
        if (ref.additionalDescription && Array.isArray(ref.additionalDescription)) {
          translationsObj[lang].additionalDescription = ref.additionalDescription.map((_: string, index: number) => {
            const key = `additionalDescription${index + 1}` as keyof typeof langTranslations
            return (langTranslations[key] as string) || ''
          }).filter(Boolean)
        }

        // Migrate responsibilities
        if (ref.responsibilities && Array.isArray(ref.responsibilities)) {
          translationsObj[lang].responsibilities = ref.responsibilities.map((_: string, index: number) => {
            const key = `responsibility${index + 1}` as keyof typeof langTranslations
            return (langTranslations[key] as string) || ''
          }).filter(Boolean)
          if (langTranslations.responsibilitiesHeading) {
            translationsObj[lang].responsibilitiesHeading = langTranslations.responsibilitiesHeading
          }
        }

        // Migrate additional text
        if (ref.additionalText) {
          if (Array.isArray(ref.additionalText)) {
            translationsObj[lang].additionalText = ref.additionalText.map((_: string, index: number) => {
              const key = `additionalText${index + 1}` as keyof typeof langTranslations
              return (langTranslations[key] as string) || ''
            }).filter(Boolean)
          } else {
            translationsObj[lang].additionalText = (langTranslations.additionalText as string) || ''
          }
        }
      })

      // Only add translations object if there's actual content
      const hasTranslations = Object.values(translationsObj).some((lang: any) => 
        Object.keys(lang).length > 0
      )

      return {
        ...ref,
        ...(hasTranslations && { translations: translationsObj })
      }
    })

    // Backup original file
    const backupFile = DATA_FILE + '.backup'
    fs.writeFileSync(backupFile, fileContents, 'utf8')
    console.log(`Backup created at: ${backupFile}`)

    // Write updated references
    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedReferences, null, 2), 'utf8')
    console.log('Translations migrated successfully!')
    console.log(`Updated ${updatedReferences.length} references`)

  } catch (error) {
    console.error('Error migrating translations:', error)
    process.exit(1)
  }
}

// Run migration
migrateTranslations()

