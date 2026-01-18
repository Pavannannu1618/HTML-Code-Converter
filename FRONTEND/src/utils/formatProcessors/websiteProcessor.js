import { applyPunctuation } from '../punctuationRules';
import { parseCSVLine } from '../csvParser';

/**
 * Process Website Format
 * CSV Format: Address,Name1,Name2,Website (4 fields per line)
 * 
 * IMPORTANT: CSV quotes (for fields with commas) should be removed, NOT converted!
 * Only convert quotes that are actually INSIDE the data.
 */
export const processWebsiteFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  // Check if first line contains commas (CSV format) or not (text format)
  const isCsvFormat = lines[0] && lines[0].includes(',');

  if (isCsvFormat) {
    // CSV FORMAT: One line per record with 4 columns
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // CRITICAL: Detect which fields have TRIPLE quotes (intentional quotes)
      // vs single quotes (CSV formatting)
      const hasTripleQuotes = detectTripleQuotes(line);
      
      // Parse the CSV line - this automatically removes quotes
      const columns = parseCSVLine(line);
      
      if (columns.length < 4) continue;
      
      // Get parsed fields and trim
      let address = (columns[0] || '').trim();
      let name1 = (columns[1] || '').trim();
      let name2 = (columns[2] || '').trim();
      let website = (columns[3] || '').trim();
      
      // Add back quotes ONLY for fields that had TRIPLE quotes (intentional)
      if (hasTripleQuotes[0]) address = '"' + address + '"';
      if (hasTripleQuotes[1]) name1 = '"' + name1 + '"';
      if (hasTripleQuotes[2]) name2 = '"' + name2 + '"';
      if (hasTripleQuotes[3]) website = '"' + website + '"';
      
      // Clean up any escaped quotes inside the data: "" → "
      address = address.replace(/""/g, '"');
      name1 = name1.replace(/""/g, '"');
      name2 = name2.replace(/""/g, '"');
      website = website.replace(/""/g, '"');
      
      // Remove spaces from website
      const cleanWebsite = website.replace(/\s+/g, '');
      
      // Apply punctuation rules
      // Now if there are quotes INSIDE the data (like Company "Best" Products),
      // they will be converted. But CSV formatting quotes are gone.
      const processedAddress = applyPunctuation(address, false, false);
      const processedName1 = applyPunctuation(name1, false, false);
      const processedName2 = applyPunctuation(name2, false, false);
      const processedWebsite = applyPunctuation(cleanWebsite, true, false);
      
      // Build HTML - Address first!
      htmlOutput += `<doctypehtml${counter}>\n<html>\n<body>\n`;
      htmlOutput += processedAddress + '\n';
      htmlOutput += processedName1 + '\n';
      htmlOutput += processedName2 + '\n';
      htmlOutput += processedWebsite + '\n';
      htmlOutput += `</body>\n</html>\n`;
      
      dataArray.push({
        'HTML Tag': `doctypehtml${counter}`,
        'Address': processedAddress,
        'Name 1': processedName1,
        'Name 2': processedName2,
        'Website': processedWebsite
      });
      
      counter++;
    }
  } else {
    // TEXT FORMAT: 4 lines per record
    for (let i = 0; i < lines.length; i += 4) {
      let address = (lines[i] || '').trim();
      let name1 = (lines[i + 1] || '').trim();
      let name2 = (lines[i + 2] || '').trim();
      let website = (lines[i + 3] || '').trim();
      
      // Clean escaped quotes: "" → "
      address = address.replace(/""/g, '"');
      name1 = name1.replace(/""/g, '"');
      name2 = name2.replace(/""/g, '"');
      website = website.replace(/""/g, '"');
      
      // Remove spaces from website
      const cleanWebsite = website.replace(/\s+/g, '');
      
      // Apply punctuation rules
      const processedAddress = applyPunctuation(address, false, false);
      const processedName1 = applyPunctuation(name1, false, false);
      const processedName2 = applyPunctuation(name2, false, false);
      const processedWebsite = applyPunctuation(cleanWebsite, true, false);
      
      // Build HTML - Address first!
      htmlOutput += `<doctypehtml${counter}>\n<html>\n<body>\n`;
      htmlOutput += processedAddress + '\n';
      htmlOutput += processedName1 + '\n';
      htmlOutput += processedName2 + '\n';
      htmlOutput += processedWebsite + '\n';
      htmlOutput += `</body>\n</html>\n`;
      
      dataArray.push({
        'HTML Tag': `doctypehtml${counter}`,
        'Address': processedAddress,
        'Name 1': processedName1,
        'Name 2': processedName2,
        'Website': processedWebsite
      });
      
      counter++;
    }
  }
  
  return { htmlOutput, dataArray };
};

/**
 * Detect which fields have TRIPLE quotes (intentional quotes to convert)
 * vs single quotes (CSV formatting to remove)
 * Returns array of booleans: [field0HasTripleQuotes, field1HasTripleQuotes, ...]
 */
function detectTripleQuotes(line) {
  const hasTripleQuotes = [];
  let inQuotes = false;
  let fieldStart = 0;
  let fieldCount = 0;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    const nextNextChar = line[i + 2];
    
    // Track quote state
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote ""
        i++; // Skip next quote
        continue;
      }
      inQuotes = !inQuotes;
    }
    
    // Found comma outside quotes = field separator
    if (char === ',' && !inQuotes) {
      // Check if this field started with TRIPLE quotes
      const fieldText = line.substring(fieldStart, i).trim();
      hasTripleQuotes[fieldCount] = fieldText.startsWith('"""');
      fieldCount++;
      fieldStart = i + 1;
    }
  }
  
  // Last field
  const fieldText = line.substring(fieldStart).trim();
  hasTripleQuotes[fieldCount] = fieldText.startsWith('"""');
  
  return hasTripleQuotes;
}