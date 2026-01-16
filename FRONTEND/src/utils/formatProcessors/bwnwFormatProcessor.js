/**
 * ============================================================================
 * BW AND NW FORMAT PROCESSOR
 * ============================================================================
 * 
 * Structure (3 fields per record):
 * - Line 1: Company Name - WITH SPACING
 * - Line 2: Address - WITH SPACING
 * - Line 3: Details - WITH SPACING
 * 
 * CSV Format: CompanyName,Address,Details (3 fields on one line)
 * OR
 * Text Format: 3 separate lines per record
 * 
 * All fields use spacing around punctuation
 * 
 * Note: BW and NW formats have the same structure - 3 fields
 * 
 * ============================================================================
 */

// ============================================================================
// IMPORTS - Use shared punctuation rules
// ============================================================================

import { 
  applyPunctuationWithSpacing 
} from '../punctuationRules.js';

// ============================================================================
// FORMAT-SPECIFIC FUNCTIONS
// ============================================================================

/**
 * Format Company Name (Line 1) - WITH spacing
 */
const formatCompanyName = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

/**
 * Format Address (Line 2) - WITH spacing
 */
const formatAddress = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

/**
 * Format Details (Line 3) - WITH spacing
 */
const formatDetails = (text) => {
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

// ============================================================================
// MAIN PROCESSOR
// ============================================================================

/**
 * Process BW and NW Format
 * 
 * Each record has 3 lines:
 * 1. Company Name (with spacing)
 * 2. Address (with spacing)
 * 3. Details (with spacing)
 * 
 * @param {Array<string>} lines - Lines from uploaded file
 * @returns {Object} { htmlOutput: string, dataArray: Array }
 */
export const processBWNWFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  // Check if first line contains commas (CSV format) or not (text format)
  const isCsvFormat = lines[0] && lines[0].includes(',');

  if (isCsvFormat) {
    // CSV FORMAT: One line per record with 3 columns
    console.log('📄 BW/NW Format: CSV format detected');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const columns = parseCSVLine(line);
      
      if (columns.length < 3) continue;
      
      const companyName = columns[0] || '';
      const address = columns[1] || '';
      const details = columns[2] || '';
      
      // Apply formatting
      const processedCompanyName = formatCompanyName(companyName);
      const processedAddress = formatAddress(address);
      const processedDetails = formatDetails(details);
      
      // Build HTML
      htmlOutput += `<doctypehtml${counter}>\n`;
      htmlOutput += `<html>\n`;
      htmlOutput += `<body>\n`;
      htmlOutput += processedCompanyName + '\n';
      htmlOutput += processedAddress + '\n';
      htmlOutput += processedDetails + '\n';
      htmlOutput += `</body>\n`;
      htmlOutput += `</html>\n`;
      
      // Add to data array
      dataArray.push({
        'HTML Tag': `doctypehtml${counter}`,
        'Company Name': processedCompanyName,
        'Address': processedAddress,
        'Details': processedDetails
      });
      
      counter++;
    }
  } else {
    // TEXT FORMAT: 3 lines per record
    console.log('📄 BW/NW Format: Text format detected');
    
    for (let i = 0; i < lines.length; i += 3) {
      const companyName = lines[i] || '';
      const address = lines[i + 1] || '';
      const details = lines[i + 2] || '';
      
      // Apply formatting
      const processedCompanyName = formatCompanyName(companyName);
      const processedAddress = formatAddress(address);
      const processedDetails = formatDetails(details);
      
      // Build HTML
      htmlOutput += `<doctypehtml${counter}>\n`;
      htmlOutput += `<html>\n`;
      htmlOutput += `<body>\n`;
      htmlOutput += processedCompanyName + '\n';
      htmlOutput += processedAddress + '\n';
      htmlOutput += processedDetails + '\n';
      htmlOutput += `</body>\n`;
      htmlOutput += `</html>\n`;
      
      // Add to data array
      dataArray.push({
        'HTML Tag': `doctypehtml${counter}`,
        'Company Name': processedCompanyName,
        'Address': processedAddress,
        'Details': processedDetails
      });
      
      counter++;
    }
  }
  
  console.log(`✅ BW/NW Format: ${counter - 1} records processed`);
  
  return { htmlOutput, dataArray };
};

/**
 * Validate BW and NW Format input
 */
export const validateBWNWFormatInput = (lines) => {
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
    message: `Ready to process ${nonEmptyLines.length} BW/NW Format records`
  };
};