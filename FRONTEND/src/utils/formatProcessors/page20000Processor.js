/**
 * ============================================================================
 * 20000 PAGE FORMAT PROCESSOR - CLEAN VERSION
 * ============================================================================
 * 
 * Structure (3 fields per record):
 * - Line 1: Details (product/code information)
 * - Line 2: Link (no spaces, HTML tags only)
 * - Line 3: Address (with normal spacing)
 * 
 * Supports BOTH CSV formats:
 * - Format 1: Details,Link,Address (comma-separated)
 * - Format 2: "Details     Link     Address" (space-separated)
 * 
 * ✅ Imports shared punctuation rules - NO code duplication!
 * 
 * ============================================================================
 */

// ============================================================================
// IMPORTS - Shared punctuation rules
// ============================================================================

import { 
  applyPunctuationWithSpacing, 
  applyPunctuationNoSpacing 
} from '../punctuationRules';

// ============================================================================
// FORMAT-SPECIFIC FUNCTIONS
// ============================================================================

/**
 * Format Details (Line 1) - Normal spacing
 */
const formatDetailsText = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

/**
 * Format Link (Line 2) - NO SPACES, HTML tags only
 */
const formatLinkText = (text) => {
  if (!text) return '';
  return applyPunctuationNoSpacing(text);
};

/**
 * Format Address (Line 3) - Normal spacing
 */
const formatAddressText = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
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
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i += 2;
        continue;
      }
      insideQuotes = !insideQuotes;
      i++;
      continue;
    }
    
    if (char === ',' && !insideQuotes) {
      fields.push(currentField);
      currentField = '';
      i++;
      continue;
    }
    
    currentField += char;
    i++;
  }
  
  if (currentField || fields.length > 0) {
    fields.push(currentField);
  }
  
  return fields;
};

/**
 * Detect CSV format
 */
const detectFormat = (line) => {
  if (!line) return 'comma';
  
  // Check for comma separator (not inside quotes)
  let insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') insideQuotes = !insideQuotes;
    if (line[i] === ',' && !insideQuotes) return 'comma';
  }
  
  // Check for 3+ consecutive spaces (space-separated format)
  const cleanLine = line.replace(/^"/, '').replace(/"$/, '');
  if (/\s{3,}/.test(cleanLine)) return 'space';
  
  return 'comma';
};

/**
 * Extract fields based on format
 */
const extractFields = (line, format) => {
  if (format === 'comma') {
    // Format 1: Details,Link,Address
    const fields = parseCSVLine(line);
    return {
      details: fields[0] || '',
      link: fields[1] || '',
      address: fields[2] || ''
    };
  } else {
    // Format 2: "Details     Link     Address" (3+ spaces)
    const cleanLine = line.replace(/^"/, '').replace(/"$/, '');
    const parts = cleanLine.split(/\s{3,}/); // 3 or more spaces
    return {
      details: parts[0] || '',
      link: parts[1] || '',
      address: parts[2] || ''
    };
  }
};

// ============================================================================
// MAIN PROCESSOR
// ============================================================================

/**
 * Process 20000 Page Format
 * 
 * Each record has 3 fields:
 * 1. Details
 * 2. Link (no spaces)
 * 3. Address
 * 
 * @param {Array<string>} lines - Lines from uploaded file
 * @returns {Object} { htmlOutput: string, dataArray: Array }
 */
export const processPage20000Format = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  // Auto-detect format
  const firstLine = lines.find(line => line.trim());
  const format = firstLine ? detectFormat(firstLine) : 'comma';
  
  console.log(`📄 20000 Page: ${format === 'comma' ? 'Comma' : 'Space'}-separated`);

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    
    // Extract 3 fields
    const { details, link, address } = extractFields(line, format);
    
    // Skip if all empty
    if (!details.trim() && !link.trim() && !address.trim()) continue;
    
    // Apply formatting rules (using shared functions!)
    const processedDetails = formatDetailsText(details);
    const processedLink = formatLinkText(link);
    const processedAddress = formatAddressText(address);
    
    // Build HTML
    htmlOutput += `<doctypehtml${counter}>\n`;
    htmlOutput += `<html>\n`;
    htmlOutput += `<body>\n`;
    htmlOutput += processedDetails + '\n';
    htmlOutput += processedLink + '\n';
    htmlOutput += processedAddress + '\n';
    htmlOutput += `</body>\n`;
    htmlOutput += `</html>\n`;
    
    // Add to data array
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'Details': processedDetails,
      'Link': processedLink,
      'Address': processedAddress
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
 * Validate 20000 Page input
 */
export const validatePage20000Input = (lines) => {
  if (!lines || lines.length === 0) {
    return { valid: false, error: 'No data to process.' };
  }
  
  const nonEmptyLines = lines.filter(line => line.trim());
  if (nonEmptyLines.length === 0) {
    return { valid: false, error: 'File contains only empty lines.' };
  }
  
  const format = detectFormat(nonEmptyLines[0]);
  
  return {
    valid: true,
    format: format,
    expectedRecords: nonEmptyLines.length,
    message: `${format === 'comma' ? 'Comma' : 'Space'}-separated CSV (3 fields)`
  };
};

// ============================================================================
// USAGE
// ============================================================================

/**
 * In your React component:
 * 
 * import { processPage20000Format, validatePage20000Input } from './formatProcessors/page20000Processor';
 * 
 * const handleConvert = () => {
 *   const lines = fileContent.split('\n');
 *   
 *   // Validate
 *   const validation = validatePage20000Input(lines);
 *   if (!validation.valid) {
 *     alert(validation.error);
 *     return;
 *   }
 *   
 *   console.log(validation.message);
 *   
 *   // Process
 *   const result = processPage20000Format(lines);
 *   setOutputHTML(result.htmlOutput);
 *   setOutputData(result.dataArray);
 * };
 */