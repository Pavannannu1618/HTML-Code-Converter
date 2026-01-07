/**
 * ============================================================================
 * MD PAGE FORMAT PROCESSOR
 * ============================================================================
 * 
 * Structure (3 fields per record):
 * - Line 1: Details (product/code information) - WITH SPACING
 * - Line 2: Company Address 1 - WITH SPACING
 * - Line 3: Company Address 2 - WITH SPACING
 * 
 * CSV Format: Comma-separated (Details,Address1,Address2)
 * 
 * NO LINKS - All fields use WITH spacing rules
 * 
 * ============================================================================
 */

// ============================================================================
// IMPORTS - Use shared punctuation rules
// ============================================================================

import { applyPunctuationWithSpacing } from '../punctuationRules';

// ============================================================================
// FORMAT-SPECIFIC FUNCTIONS
// ============================================================================

/**
 * Format Details (Line 1) - WITH spacing
 */
const formatDetailsText = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

/**
 * Format Company Address 1 (Line 2) - WITH spacing
 */
const formatAddress1Text = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

/**
 * Format Company Address 2 (Line 3) - WITH spacing
 */
const formatAddress2Text = (text) => {
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
 * Extract fields from CSV line
 */
const extractFields = (line) => {
  const fields = parseCSVLine(line);
  
  return {
    details: fields[0] || '',
    address1: fields[1] || '',
    address2: fields[2] || ''
  };
};

// ============================================================================
// MAIN PROCESSOR
// ============================================================================

/**
 * Process MD Page Format
 * 
 * Each record has 3 fields:
 * 1. Details
 * 2. Company Address 1
 * 3. Company Address 2
 * 
 * @param {Array<string>} lines - Lines from uploaded file
 * @returns {Object} { htmlOutput: string, dataArray: Array }
 */
export const processMDPageFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  console.log(`📄 MD Page: Processing ${lines.length} lines`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    
    // Extract 3 fields
    const { details, address1, address2 } = extractFields(line);
    
    // Skip if all empty
    if (!details.trim() && !address1.trim() && !address2.trim()) continue;
    
    // Apply formatting rules (ALL with spacing - no links!)
    const processedDetails = formatDetailsText(details);
    const processedAddress1 = formatAddress1Text(address1);
    const processedAddress2 = formatAddress2Text(address2);
    
    // Build HTML
    htmlOutput += `<doctypehtml${counter}>\n`;
    htmlOutput += `<html>\n`;
    htmlOutput += `<body>\n`;
    htmlOutput += processedDetails + '\n';
    htmlOutput += processedAddress1 + '\n';
    htmlOutput += processedAddress2 + '\n';
    htmlOutput += `</body>\n`;
    htmlOutput += `</html>\n`;
    
    // Add to data array
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'Details': processedDetails,
      'Company Address 1': processedAddress1,
      'Company Address 2': processedAddress2
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
 * Validate MD Page input
 */
export const validateMDPageInput = (lines) => {
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
    message: `Ready to process ${nonEmptyLines.length} MD Page records`
  };
};

/**
 * ============================================================================
 * USAGE IN APP.JSX
 * ============================================================================
 * 
 * import { processMDPageFormat, validateMDPageInput } from './formatProcessors/mdPageProcessor';
 * 
 * const handleConvert = () => {
 *   const lines = fileContent.split('\n');
 *   
 *   // Validate
 *   const validation = validateMDPageInput(lines);
 *   if (!validation.valid) {
 *     alert(validation.error);
 *     return;
 *   }
 *   
 *   console.log(validation.message);
 *   
 *   // Process
 *   const result = processMDPageFormat(lines);
 *   setOutputHTML(result.htmlOutput);
 *   setOutputData(result.dataArray);
 * };
 */