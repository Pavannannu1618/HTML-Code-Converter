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
 * Split company name and address - FINAL CORRECT VERSION
 * 
 * Rule: If entities are side-by-side (only punctuation/abbreviation fragments between), use LAST
 *       Otherwise use FIRST
 * 
 * Examples:
 * "COMPANY, L. L. C :" → Only ", L. L. C :" between → Use LAST (L.L.C)
 * "C.O RP AMERICA" → "RP AMERICA" between → Use FIRST (C.O)
 * "INC. ACIC LTD" → "ACIC LTD" between → Use FIRST (INC.)
 */
const splitCompanyNameAndAddress = (combined) => {
  if (!combined) return { name: '', address: '' };
  
  const text = combined.trim();
  if (!text) return { name: '', address: '' };
  
  // Define entity patterns - FIXED to handle spaces in abbreviations
  const entityPatterns = [
    /\b(COMPANY|COMPANIES)\b/gi,
    /\b(CORPORATION)\b/gi,
    /\b(CORP\.)\b/gi,
    /\b(LIMITED)\b/gi,
    /\b(LTD\.?)\b/gi,
    /\b(INCORPORATED)\b/gi,
    /\b(INC\.?)\b/gi,
    /\b(C\.O\.?)\b/gi,
    /\b(L\.\s*P\.?|LP)\b/gi,              // Match "L.P" or "L. P" with optional space
    /\b(L\.\s*L\.\s*C\.?|LLC)\b/gi,       // Match "L.L.C" or "L. L. C" with optional spaces
    /\b(LLP)\b/gi,
    /\b(S\.A\.?)\b/gi,
    /\b(A\.G\.?)\b/gi,
    /\b(I\.\s*N\.\s*C\.?)\b/gi,           // Match "I.N.C" with optional spaces
    /\b(PLC)\b/gi
  ];
  
  // Find ALL entities
  const entities = [];
  for (let pattern of entityPatterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      entities.push({
        text: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
    }
  }
  
  // Remove duplicates and sort
  const uniqueEntities = [];
  const seen = new Set();
  for (let entity of entities) {
    const key = `${entity.start}-${entity.end}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueEntities.push(entity);
    }
  }
  uniqueEntities.sort((a, b) => a.start - b.start);
  
  // No entities found
  if (uniqueEntities.length === 0) {
    const streetMatch = text.match(/^(.+?)\s+(\d{1,5}\s+[A-Z])/);
    if (streetMatch) {
      return {
        name: streetMatch[1].trim(),
        address: text.substring(streetMatch[1].length).trim()
      };
    }
    
    const addressKeywords = /\b(Suite|Ste|Floor|Fl|Building|Bldg|Room|Rm|Unit|P\.O\.|PO Box|Float Plant|Automotive Plant|Business Center)\b/i;
    const keywordMatch = text.match(addressKeywords);
    if (keywordMatch) {
      return {
        name: text.substring(0, keywordMatch.index).trim(),
        address: text.substring(keywordMatch.index).trim()
      };
    }
    
    const quoteMatch = text.match(/^([^"]+)(")/);
    if (quoteMatch) {
      return {
        name: quoteMatch[1].trim(),
        address: text.substring(quoteMatch[1].length).trim()
      };
    }
    
    const lowerMatch = text.match(/^([A-Z\s&'.\/\-]+?)\s+([a-z]{3,})/);
    if (lowerMatch) {
      return {
        name: lowerMatch[1].trim(),
        address: text.substring(lowerMatch[1].length).trim()
      };
    }
    
    return { name: text, address: '' };
  }
  
  // One entity - split after it (plus trailing punctuation)
  if (uniqueEntities.length === 1) {
    let splitPoint = uniqueEntities[0].end;
    
    // Include trailing punctuation as part of name
    const afterEntity = text.substring(splitPoint);
    const trailingPunct = afterEntity.match(/^[\s,:;]*/);
    if (trailingPunct) {
      splitPoint += trailingPunct[0].length;
    }
    
    return {
      name: text.substring(0, splitPoint).trim(),
      address: text.substring(splitPoint).trim()
    };
  }
  
  // Multiple entities - check what's between them
  // "Side by side" means only punctuation and single-letter abbreviations (like "L. L. C")
  let useLastEntity = true;
  
  for (let i = 0; i < uniqueEntities.length - 1; i++) {
    const current = uniqueEntities[i];
    const next = uniqueEntities[i + 1];
    
    // Get text between entities
    const between = text.substring(current.end, next.start).trim();
    
    // Check for REAL WORDS (not just abbreviation fragments)
    // Real words = sequences of 3+ capital letters that look like words
    // "LOGISTICS PARTNERS" = real words
    // ", L. L. C" = just abbreviation fragments
    
    // Remove all punctuation and dots
    const cleanedBetween = between.replace(/[,.:;\s]/g, '');
    
    // If what remains is short (< 5 chars), it's probably just abbreviation fragments
    // "LLC" = 3 chars → abbreviation
    // "LOGISTICSPARTNERS" = 17 chars → real words
    if (cleanedBetween.length >= 5) {
      // Long enough to be real words, use FIRST entity
      useLastEntity = false;
      break;
    }
  }
  
  const entityToUse = useLastEntity ? 
    uniqueEntities[uniqueEntities.length - 1] : 
    uniqueEntities[0];
  
  let splitPoint = entityToUse.end;
  
  // Include trailing punctuation as part of name
  const afterEntity = text.substring(splitPoint);
  const trailingPunct = afterEntity.match(/^[\s,:;]*/);
  if (trailingPunct) {
    splitPoint += trailingPunct[0].length;
  }
  
  return {
    name: text.substring(0, splitPoint).trim(),
    address: text.substring(splitPoint).trim()
  };
};

/**
 * Extract fields from CSV line
 */
const extractFields = (line, format) => {
  if (format === 'comma') {
    // Format 1: "Name+Address",Link
    const fields = parseCSVLine(line);
    const nameAndAddress = fields[0] || '';
    const link = fields[1] || '';
    
    const { name, address } = splitCompanyNameAndAddress(nameAndAddress);
    
    return { name, address, link };
  } else {
    // Format 2: "Name+Address          Link" (space-separated)
    const cleanLine = line.replace(/^"/, '').replace(/"$/, '');
    const parts = cleanLine.split(/\s{10,}/);
    
    const nameAndAddress = parts[0] || '';
    const link = parts[1] || '';
    
    const { name, address } = splitCompanyNameAndAddress(nameAndAddress);
    
    return { name, address, link };
  }
};

// ============================================================================
// MAIN PROCESSOR
// ============================================================================

/**
 * Process AD Page Format
 * 
 * Each record has 3 lines:
 * 1. Company Name Part 1 (with spacing)
 * 2. Company Name Part 2 + Address (with spacing)
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