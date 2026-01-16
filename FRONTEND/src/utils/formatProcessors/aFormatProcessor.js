/**
 * ============================================================================
 * A FORMAT PROCESSOR
 * ============================================================================
 * 
 * Structure (4 fields per record):
 * - Line 1: Company Name - WITH SPACING
 * - Line 2: Address - WITH SPACING
 * - Line 3: Company Name - WITH SPACING
 * - Line 4: Details - WITH SPACING
 * 
 * CSV Format: CompanyName1,Address,CompanyName2,Details (4 fields on one line)
 * OR
 * Text Format: 4 separate lines per record
 * 
 * All fields use spacing around punctuation
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
 * Format Company Name fields (Lines 1 & 3) - WITH spacing
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
 * Format Details (Line 4) - WITH spacing
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
 * Process A Format
 * 
 * Each record has 4 lines:
 * 1. Company Name (with spacing)
 * 2. Address (with spacing)
 * 3. Company Name (with spacing)
 * 4. Details (with spacing)
 * 
 * @param {Array<string>} lines - Lines from uploaded file
 * @returns {Object} { htmlOutput: string, dataArray: Array }
 */
export const processAFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  // Check if first line contains commas (CSV format) or not (text format)
  const isCsvFormat = lines[0] && lines[0].includes(',');

  if (isCsvFormat) {
    // CSV FORMAT: One line per record with 4 columns
    console.log('📄 A Format: CSV format detected');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const columns = parseCSVLine(line);
      
      if (columns.length < 4) continue;
      
      const companyName1 = columns[0] || '';
      const address = columns[1] || '';
      const companyName2 = columns[2] || '';
      const details = columns[3] || '';
      
      // Apply formatting
      const processedCompanyName1 = formatCompanyName(companyName1);
      const processedAddress = formatAddress(address);
      const processedCompanyName2 = formatCompanyName(companyName2);
      const processedDetails = formatDetails(details);
      
      // Build HTML
      htmlOutput += `<doctypehtml${counter}>\n`;
      htmlOutput += `<html>\n`;
      htmlOutput += `<body>\n`;
      htmlOutput += processedCompanyName1 + '\n';
      htmlOutput += processedAddress + '\n';
      htmlOutput += processedCompanyName2 + '\n';
      htmlOutput += processedDetails + '\n';
      htmlOutput += `</body>\n`;
      htmlOutput += `</html>\n`;
      
      // Add to data array
      dataArray.push({
        'HTML Tag': `doctypehtml${counter}`,
        'Company Name 1': processedCompanyName1,
        'Address': processedAddress,
        'Company Name 2': processedCompanyName2,
        'Details': processedDetails
      });
      
      counter++;
    }
  } else {
    // TEXT FORMAT: 4 lines per record
    console.log('📄 A Format: Text format detected');
    
    for (let i = 0; i < lines.length; i += 4) {
      const companyName1 = lines[i] || '';
      const address = lines[i + 1] || '';
      const companyName2 = lines[i + 2] || '';
      const details = lines[i + 3] || '';
      
      // Apply formatting
      const processedCompanyName1 = formatCompanyName(companyName1);
      const processedAddress = formatAddress(address);
      const processedCompanyName2 = formatCompanyName(companyName2);
      const processedDetails = formatDetails(details);
      
      // Build HTML
      htmlOutput += `<doctypehtml${counter}>\n`;
      htmlOutput += `<html>\n`;
      htmlOutput += `<body>\n`;
      htmlOutput += processedCompanyName1 + '\n';
      htmlOutput += processedAddress + '\n';
      htmlOutput += processedCompanyName2 + '\n';
      htmlOutput += processedDetails + '\n';
      htmlOutput += `</body>\n`;
      htmlOutput += `</html>\n`;
      
      // Add to data array
      dataArray.push({
        'HTML Tag': `doctypehtml${counter}`,
        'Company Name 1': processedCompanyName1,
        'Address': processedAddress,
        'Company Name 2': processedCompanyName2,
        'Details': processedDetails
      });
      
      counter++;
    }
  }
  
  console.log(`✅ A Format: ${counter - 1} records processed`);
  
  return { htmlOutput, dataArray };
};

/**
 * Validate A Format input
 */
export const validateAFormatInput = (lines) => {
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
    message: `Ready to process ${nonEmptyLines.length} A Format records`
  };
};