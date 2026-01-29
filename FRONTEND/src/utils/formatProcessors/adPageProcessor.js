/**
 * ============================================================================
 * AD PAGE FORMAT PROCESSOR - FINAL VERSION
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
 * Detect CSV format (comma vs space-separated)
 */
const detectFormat = (line) => {
  if (!line) return 'comma';
  
  let insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') insideQuotes = !insideQuotes;
    if (line[i] === ',' && !insideQuotes) return 'comma';
  }
  
  const cleanLine = line.replace(/^"/, '').replace(/"$/, '');
  if (/\s{10,}/.test(cleanLine)) return 'space';
  
  return 'comma';
};

/**
 * Split company name and address - FINAL CORRECT VERSION
 */
const splitCompanyNameAndAddress = (combined) => {
  if (!combined) return { name: '', address: '' };
  
  const text = combined.trim();
  if (!text) return { name: '', address: '' };
  
  // Define entity patterns
  const entityPatterns = [
    /\b(COMPANY|COMPANIES)\b/gi,
    /\b(CORPORATION)\b/gi,
    /\b(CORP\.)\b/gi,
    /\b(LIMITED)\b/gi,
    /\b(LTD\.?)\b/gi,
    /\b(INCORPORATED)\b/gi,
    /\b(INC\.?)\b/gi,
    /\b(C\.O\.?)\b/gi,
    /\b(L\.\s*P\.?|LP)\b/gi,
    /\b(L\.\s*L\.\s*C\.?|LLC)\b/gi,
    /\b(LLP)\b/gi,
    /\b(S\.A\.?)\b/gi,
    /\b(A\.G\.?)\b/gi,
    /\b(I\.\s*N\.\s*C\.?)\b/gi,
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
  
  // One entity - split after it
  if (uniqueEntities.length === 1) {
    let splitPoint = uniqueEntities[0].end;
    
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
  let useLastEntity = true;
  
  for (let i = 0; i < uniqueEntities.length - 1; i++) {
    const current = uniqueEntities[i];
    const next = uniqueEntities[i + 1];
    
    const between = text.substring(current.end, next.start).trim();
    const cleanedBetween = between.replace(/[,.:;\s]/g, '');
    
    if (cleanedBetween.length >= 5) {
      useLastEntity = false;
      break;
    }
  }
  
  const entityToUse = useLastEntity ? 
    uniqueEntities[uniqueEntities.length - 1] : 
    uniqueEntities[0];
  
  let splitPoint = entityToUse.end;
  
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
    const fields = parseCSVLine(line);
    const nameAndAddress = fields[0] || '';
    const link = fields[1] || '';
    
    const { name, address } = splitCompanyNameAndAddress(nameAndAddress);
    
    return { name, address, link };
  } else {
    const cleanLine = line.replace(/^"/, '').replace(/"$/, '');
    const parts = cleanLine.split(/\s{10,}/);
    
    const nameAndAddress = parts[0] || '';
    const link = parts[1] || '';
    
    const { name, address } = splitCompanyNameAndAddress(nameAndAddress);
    
    return { name, address, link };
  }
};

/**
 * Process AD Page Format
 */
export const processADPageFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  const firstLine = lines.find(line => line.trim());
  const format = firstLine ? detectFormat(firstLine) : 'comma';
  
  console.log(`📄 AD Page: ${format === 'comma' ? 'Comma' : 'Space'}-separated`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    
    const { name, address, link } = extractFields(line, format);
    
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