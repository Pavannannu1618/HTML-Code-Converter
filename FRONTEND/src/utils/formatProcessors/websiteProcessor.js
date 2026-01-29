import { applyPunctuationWithSpacing, applyPunctuationNoSpacing } from '../punctuationRules';
import { parseCSVLine } from '../csvParser';

/**
 * Process Website Format
 * CSV Format: Address,Name1,Name2,Website (4 fields per line)
 * 
 * CRITICAL RULES:
 * 1. Fields 1-3 (Address, Name1, Name2): Use applyPunctuationWithSpacing() - Keywords work
 * 2. Field 4 (Website): Use applyPunctuationNoSpacing() - ALL dots are &#8901;
 * 3. Triple quotes """ in CSV = add &ldquo; &rdquo; in output
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
      const hasTripleQuotes = detectTripleQuotes(line);
      
      // Parse the CSV line
      const columns = parseCSVLine(line);
      
      if (columns.length < 4) continue;
      
      // Get parsed fields and trim
      let address = (columns[0] || '').trim();
      let name1 = (columns[1] || '').trim();
      let name2 = (columns[2] || '').trim();
      let website = (columns[3] || '').trim();
      
      // Clean up escaped quotes from CSV: "" → "
      address = address.replace(/""/g, '"');
      name1 = name1.replace(/""/g, '"');
      name2 = name2.replace(/""/g, '"');
      website = website.replace(/""/g, '"');
      
      // Remove the CSV wrapper quotes if they exist (field had triple quotes)
      if (hasTripleQuotes[0] && address.startsWith('"') && address.endsWith('"')) {
        address = address.slice(1, -1);
      }
      if (hasTripleQuotes[1] && name1.startsWith('"') && name1.endsWith('"')) {
        name1 = name1.slice(1, -1);
      }
      if (hasTripleQuotes[2] && name2.startsWith('"') && name2.endsWith('"')) {
        name2 = name2.slice(1, -1);
      }
      if (hasTripleQuotes[3] && website.startsWith('"') && website.endsWith('"')) {
        website = website.slice(1, -1);
      }
      
      // Apply punctuation rules
      // Fields 1-3: Smart detection (keywords work)
      const processedAddress = applyPunctuationWithQuotes(address, false, hasTripleQuotes[0]);
      const processedName1 = applyPunctuationWithQuotes(name1, false, hasTripleQuotes[1]);
      const processedName2 = applyPunctuationWithQuotes(name2, false, hasTripleQuotes[2]);
      
      // Field 4 (Website): NO keyword detection, ALL dots are &#8901;
      const cleanWebsite = website.replace(/\s+/g, ''); // Remove spaces
      const processedWebsite = applyPunctuationNoSpacing(cleanWebsite);
      
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
      
      // Check for quotes in text format
      const hasQuotesAddress = address.startsWith('"') && address.endsWith('"');
      const hasQuotesName1 = name1.startsWith('"') && name1.endsWith('"');
      const hasQuotesName2 = name2.startsWith('"') && name2.endsWith('"');
      const hasQuotesWebsite = website.startsWith('"') && website.endsWith('"');
      
      // Remove wrapper quotes if present
      if (hasQuotesAddress) address = address.slice(1, -1);
      if (hasQuotesName1) name1 = name1.slice(1, -1);
      if (hasQuotesName2) name2 = name2.slice(1, -1);
      if (hasQuotesWebsite) website = website.slice(1, -1);
      
      // Clean escaped quotes: "" → "
      address = address.replace(/""/g, '"');
      name1 = name1.replace(/""/g, '"');
      name2 = name2.replace(/""/g, '"');
      website = website.replace(/""/g, '"');
      
      // Apply punctuation rules
      const processedAddress = applyPunctuationWithQuotes(address, false, hasQuotesAddress);
      const processedName1 = applyPunctuationWithQuotes(name1, false, hasQuotesName1);
      const processedName2 = applyPunctuationWithQuotes(name2, false, hasQuotesName2);
      
      // Website field: NO keyword detection
      const cleanWebsite = website.replace(/\s+/g, '');
      const processedWebsite = applyPunctuationNoSpacing(cleanWebsite);
      
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
 * Apply punctuation with optional quote wrapping
 */
const applyPunctuationWithQuotes = (text, isWebLink = false, addQuotes = false) => {
  if (!text) return '';
  
  // Process punctuation
  let result = isWebLink 
    ? applyPunctuationNoSpacing(text)
    : applyPunctuationWithSpacing(text);
  
  // Add quotes if requested
  if (addQuotes && !isWebLink) {
    result = result.trim();
    result = ` &ldquo;${result}&rdquo; `;
  }
  
  return result;
};

/**
 * Detect which fields have TRIPLE quotes (intentional quotes to convert)
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