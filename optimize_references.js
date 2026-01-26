const fs = require('fs');
const path = require('path');

// Read references file
const filePath = path.join(__dirname, 'data', 'references.json');
const references = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`Original file size: ${fs.statSync(filePath).size} bytes`);
console.log(`Original references count: ${references.length}`);

// Optimize each reference
let totalSaved = 0;
const optimized = references.map(ref => {
  const original = JSON.stringify(ref).length;
  
  // Remove base64 images from additionalText
  if (ref.additionalText && typeof ref.additionalText === 'string') {
    // Remove data:image URLs (base64 encoded images)
    ref.additionalText = ref.additionalText.replace(/data:image\/[^;]+;base64,[^"'\s]+/gi, '');
    
    // Remove large image src attributes, keep only the URL part
    ref.additionalText = ref.additionalText.replace(/<img([^>]*?)src="([^"]*)"([^>]*?)>/gi, (match, before, src, after) => {
      // If it's a data URL, remove the entire img tag
      if (src.startsWith('data:')) {
        return '';
      }
      // Otherwise keep it but remove any large attributes
      return `<img${before}src="${src}"${after}>`;
    });
    
    // Remove iframe embeds that might be large
    ref.additionalText = ref.additionalText.replace(/<iframe[^>]*>.*?<\/iframe>/gis, '');
    
    // Clean up extra whitespace
    ref.additionalText = ref.additionalText.replace(/\s+/g, ' ').trim();
  }
  
  // Optimize translations
  if (ref.translations) {
    Object.keys(ref.translations).forEach(lang => {
      const trans = ref.translations[lang];
      if (trans && trans.additionalText && typeof trans.additionalText === 'string') {
        // Same optimizations for translations
        trans.additionalText = trans.additionalText.replace(/data:image\/[^;]+;base64,[^"'\s]+/gi, '');
        trans.additionalText = trans.additionalText.replace(/<img([^>]*?)src="([^"]*)"([^>]*?)>/gi, (match, before, src, after) => {
          if (src.startsWith('data:')) {
            return '';
          }
          return `<img${before}src="${src}"${after}>`;
        });
        trans.additionalText = trans.additionalText.replace(/<iframe[^>]*>.*?<\/iframe>/gis, '');
        trans.additionalText = trans.additionalText.replace(/\s+/g, ' ').trim();
      }
    });
  }
  
  const optimized = JSON.stringify(ref).length;
  const saved = original - optimized;
  totalSaved += saved;
  
  return ref;
});

// Write optimized file
const outputPath = path.join(__dirname, 'data', 'references.json');
fs.writeFileSync(outputPath, JSON.stringify(optimized, null, 2), 'utf8');

const newSize = fs.statSync(outputPath).size;
const sizeReduction = fs.statSync(filePath).size - newSize;

console.log(`\n✅ Optimization complete!`);
console.log(`New file size: ${newSize} bytes`);
console.log(`Size reduction: ${sizeReduction} bytes (${(sizeReduction / fs.statSync(filePath).size * 100).toFixed(1)}%)`);
console.log(`\nOptimized file saved to: ${outputPath}`);

