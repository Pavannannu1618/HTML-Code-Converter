/**
 * ============================================================================
 * AD PAGE FORMAT PROCESSOR
 * ============================================================================
 * 
 * Structure (3 fields per record):
 * - Line 1: Company Name - WITH SPACING
 * - Line 2: Company Address - WITH SPACING
 * - Line 3: Link (HTML/CSS code) - NO SPACING
 * 
 * CSV Format: "Name+Address",Link
 * - First field contains Name""Address (double quotes separate them)
 * - Second field is the link/HTML code
 * 
 * Similar to 2 Rows format but outputs 3 lines instead of 4
 * 
 * ============================================================================
 */

// ============================================================================
// IMPORTS - Use shared punctuation rules
// ============================================================================

import { 
  applyPunctuationWithSpacing, 
  applyPunctuationNoSpacing 
} from '../punctuationRules.js';

// ============================================================================
// FORMAT-SPECIFIC FUNCTIONS
// ============================================================================

/**
 * Format Company Name (Line 1) - WITH spacing
 */
const formatNameText = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

/**
 * Format Company Address (Line 2) - WITH spacing
 */
const formatAddressText = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

/**
 * Format Link (Line 3) - NO SPACING
 */
const formatLinkText = (text) => {
  if (!text) return '';
  return applyPunctuationNoSpacing(text);
};

// ============================================================================
// CSV PARSING
// ============================================================================

/**
 * Parse CSV line with proper quote handling
 */
const parseCSVLine = (line) => {
  const fields = [];
  let currentField = '';
  let insideQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      // Handle escaped quotes ("")
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i += 2;
        continue;
      }
      // Toggle quote state
      insideQuotes = !insideQuotes;
      i++;
      continue;
    }
    
    // Split on comma only when outside quotes
    if (char === ',' && !insideQuotes) {
      fields.push(currentField);
      currentField = '';
      i++;
      continue;
    }
    
    currentField += char;
    i++;
  }
  
  // Add last field
  if (currentField || fields.length > 0) {
    fields.push(currentField);
  }
  
  return fields;
};

/**
 * Detect CSV format (comma vs space-separated)
 */
const detectFormat = (line) => {
  if (!line) return 'comma';
  
  // Check for comma separator (not inside quotes)
  let insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') insideQuotes = !insideQuotes;
    if (line[i] === ',' && !insideQuotes) return 'comma';
  }
  
  // Check for large spaces (space-separated format)
  const cleanLine = line.replace(/^"/, '').replace(/"$/, '');
  if (/\s{10,}/.test(cleanLine)) return 'space';
  
  return 'comma';
};

/**
 * Split company name and address
 * Based on 2 Rows format logic
 */
const splitNameAndAddress = (combined) => {
  if (!combined) return { name: '', address: '' };
  
  let name = '';
  let address = '';
  
  // Pattern 1: Try to match Name""Address"""
  let match = combined.match(/^(.+?)""(.+?)"""$/);
  if (match) {
    name = match[1].trim();
    address = match[2].trim();
    return { name, address };
  }
  
  // Pattern 2: Try to match Name""Address""
  match = combined.match(/^(.+?)""(.+?)""$/);
  if (match) {
    name = match[1].trim();
    address = match[2].trim();
    return { name, address };
  }
  
  // Pattern 3: Try to match Name""Address (single double-quote)
  match = combined.match(/^(.+?)""(.+)$/);
  if (match) {
    name = match[1].trim();
    address = match[2].trim();
    return { name, address };
  }
  
  // Pattern 4: Look for address-starting patterns
  // Common patterns: street numbers, building names, suite/floor numbers
  const addressPatterns = [
    /\s+(Suite|Ste|Floor|Fl|Building|Bldg|Room|Rm|Unit|P\.O\.|PO Box)\s+/i,
    /\s+\d+\s+[A-Z][a-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Boulevard|Blvd)/i,
    /\s+\d{3,}\s+[A-Z]/,  // Address starting with number
    /\s+(Float Plant|Automotive Plant|Business Center)/i
  ];
  
  for (let pattern of addressPatterns) {
    const addressMatch = combined.match(pattern);
    if (addressMatch) {
      const pos = addressMatch.index;
      name = combined.substring(0, pos).trim();
      address = combined.substring(pos).trim();
      return { name, address };
    }
  }
  
  // Pattern 5: Entity detection LAST (as fallback)
  // Look for complete entity phrases with word boundaries
  const entityPatterns = [
    /\s+(COMPANY|CO\.|CO|CORPORATION|CORP\.|CORP)\s+/i,
    /\s+(LIMITED|LTD\.|LTD)\s+/i,
    /\s+(INCORPORATED|INC\.|INC)\s+/i,
    /\s+(L\.P\.|LP|L\.L\.C\.|LLC|LLP)\s+/i
  ];
  
  let latestEntityEnd = -1;
  
  for (let pattern of entityPatterns) {
    const matches = [...combined.matchAll(new RegExp(pattern, 'gi'))];
    if (matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      const endPos = lastMatch.index + lastMatch[0].length;
      if (endPos > latestEntityEnd) {
        latestEntityEnd = endPos;
      }
    }
  }
  
  if (latestEntityEnd > 0) {
    name = combined.substring(0, latestEntityEnd).trim();
    address = combined.substring(latestEntityEnd).trim();
    return { name, address };
  }
  
  // Default: everything is name
  return { name: combined.trim(), address: '' };
};

/**
 * Extract fields from CSV line
 */
const extractFields = (line, format) => {
  if (format === 'comma') {
    // Format 1: "Name+Address",Link
    const fields = parseCSVLine(line);
    const nameAddress = fields[0] || '';
    const link = fields[1] || '';
    
    const { name, address } = splitNameAndAddress(nameAddress);
    
    return { name, address, link };
  } else {
    // Format 2: "Name+Address          Link" (space-separated)
    const cleanLine = line.replace(/^"/, '').replace(/"$/, '');
    const parts = cleanLine.split(/\s{10,}/);
    
    const nameAddress = parts[0] || '';
    const link = parts[1] || '';
    
    const { name, address } = splitNameAndAddress(nameAddress);
    
    return { name, address, link };
  }
};

// ============================================================================
// MAIN PROCESSOR
// ============================================================================

/**
 * Process AD Page Format
 * 
 * Each record has 3 fields:
 * 1. Company Name (with spacing)
 * 2. Company Address (with spacing)
 * 3. Link (no spacing)
 * 
 * @param {Array<string>} lines - Lines from uploaded file
 * @returns {Object} { htmlOutput: string, dataArray: Array }
 */
export const processADPageFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  // Auto-detect format
  const firstLine = lines.find(line => line.trim());
  const format = firstLine ? detectFormat(firstLine) : 'comma';
  
  console.log(`📄 AD Page: ${format === 'comma' ? 'Comma' : 'Space'}-separated`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    
    // Extract 3 fields
    const { name, address, link } = extractFields(line, format);
    
    // Skip if all empty
    if (!name.trim() && !address.trim() && !link.trim()) continue;
    
    // Apply formatting rules
    const processedName = formatNameText(name);
    const processedAddress = formatAddressText(address);
    const processedLink = formatLinkText(link);
    
    // Build HTML
    htmlOutput += `<doctypehtml${counter}>\n`;
    htmlOutput += `<html>\n`;
    htmlOutput += `<body>\n`;
    htmlOutput += processedName + '\n';
    htmlOutput += processedAddress + '\n';
    htmlOutput += processedLink + '\n';
    htmlOutput += `</body>\n`;
    htmlOutput += `</html>\n`;
    
    // Add to data array
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'Company Name': processedName,
      'Company Address': processedAddress,
      'Link': processedLink
    });
    
    counter++;
  }
  
  console.log(`✅ ${counter - 1} records`);
  
  return { htmlOutput, dataArray };
};

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate AD Page input
 */
export const validateADPageInput = (lines) => {
  if (!lines || lines.length === 0) {
    return { valid: false, error: 'No data to process.' };
  }
  
  const nonEmptyLines = lines.filter(line => line.trim());
  if (nonEmptyLines.length === 0) {
    return { valid: false, error: 'File contains only empty lines.' };
  }
  
  return {
    valid: true,
    expectedRecords: nonEmptyLines.length,
    message: `Ready to process ${nonEmptyLines.length} AD Page records`
  };
};

/**
 * ============================================================================
 * USAGE IN APP.JSX
 * ============================================================================
 * 
 * import { processADPageFormat, validateADPageInput } from './utils/formatProcessors/adPageProcessor.js';
 * 
 * const handleConvert = () => {
 *   const lines = fileContent.split('\n');
 *   
 *   // Validate
 *   const validation = validateADPageInput(lines);
 *   if (!validation.valid) {
 *     alert(validation.error);
 *     return;
 *   }
 *   
 *   console.log(validation.message);
 *   
 *   // Process
 *   const result = processADPageFormat(lines);
 *   setOutputHTML(result.htmlOutput);
 *   setOutputData(result.dataArray);
 * };
 */