/**
 * ============================================================================
 * 40000 PAGE FORMAT PROCESSOR
 * ============================================================================
 * 
 * Structure (3 fields per record):
 * - Line 1: Details 1 (product/code information) - WITH SPACING
 * - Line 2: Details 2 (product/code information) - WITH SPACING
 * - Line 3: Link (HTML/CSS code) - NO SPACING (remove ALL spaces)
 * 
 * CSV Format: Comma-separated (Details1,Details2,Link)
 * 
 * Key Difference: Lines 1 & 2 = WITH spacing, Line 3 = NO spacing
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
 * Format Details 1 (Line 1) - WITH spacing
 */
const formatDetails1Text = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

/**
 * Format Details 2 (Line 2) - WITH spacing
 */
const formatDetails2Text = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

/**
 * Format Link (Line 3) - NO SPACING (HTML/CSS code)
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
 * Extract fields from CSV line
 */
const extractFields = (line) => {
  const fields = parseCSVLine(line);
  
  return {
    details1: fields[0] || '',
    details2: fields[1] || '',
    link: fields[2] || ''
  };
};

// ============================================================================
// MAIN PROCESSOR
// ============================================================================

/**
 * Process 40000 Page Format
 * 
 * Each record has 3 fields:
 * 1. Details 1 (with spacing)
 * 2. Details 2 (with spacing)
 * 3. Link (no spacing)
 * 
 * @param {Array<string>} lines - Lines from uploaded file
 * @returns {Object} { htmlOutput: string, dataArray: Array }
 */
export const processPage40000Format = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  console.log(`📄 40000 Page: Processing ${lines.length} lines`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    
    // Extract 3 fields
    const { details1, details2, link } = extractFields(line);
    
    // Skip if all empty
    if (!details1.trim() && !details2.trim() && !link.trim()) continue;
    
    // Apply formatting rules
    const processedDetails1 = formatDetails1Text(details1);
    const processedDetails2 = formatDetails2Text(details2);
    const processedLink = formatLinkText(link);
    
    // Build HTML
    htmlOutput += `<doctypehtml${counter}>\n`;
    htmlOutput += `<html>\n`;
    htmlOutput += `<body>\n`;
    htmlOutput += processedDetails1 + '\n';
    htmlOutput += processedDetails2 + '\n';
    htmlOutput += processedLink + '\n';
    htmlOutput += `</body>\n`;
    htmlOutput += `</html>\n`;
    
    // Add to data array
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'Details 1': processedDetails1,
      'Details 2': processedDetails2,
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
 * Validate 40000 Page input
 */
export const validatePage40000Input = (lines) => {
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
    message: `Ready to process ${nonEmptyLines.length} 40000 Page records`
  };
};

/**
 * ============================================================================
 * USAGE IN APP.JSX
 * ============================================================================
 * 
 * import { processPage40000Format, validatePage40000Input } from './utils/formatProcessors/page40000Processor.js';
 * 
 * const handleConvert = () => {
 *   const lines = fileContent.split('\n');
 *   
 *   // Validate
 *   const validation = validatePage40000Input(lines);
 *   if (!validation.valid) {
 *     alert(validation.error);
 *     return;
 *   }
 *   
 *   console.log(validation.message);
 *   
 *   // Process
 *   const result = processPage40000Format(lines);
 *   setOutputHTML(result.htmlOutput);
 *   setOutputData(result.dataArray);
 * };
 */