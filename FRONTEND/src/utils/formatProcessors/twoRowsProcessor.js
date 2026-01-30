import { applyPunctuationWithSpacing } from '../punctuationRules';
import { parseCSVLine } from '../csvParser';

/**
 * Apply punctuation WITHOUT quotes
 */
const formatField = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

/**
 * Apply punctuation WITH quotes for address field
 * 
 * Quote spacing rules:
 * 1. Space before left quote: " &ldquo;"
 * 2. Space after right quote: "&rdquo; "
 * 3. Preserve ALL punctuation spacing from punctuation rules
 *    - If punctuation before quote: "&#41; &rdquo; " ✅
 *    - If text before quote: "abc&rdquo; " ✅
 */
const formatAddress = (text, shouldAddQuotes) => {
  if (!text) return '';
  const processed = applyPunctuationWithSpacing(text);
  
  // Only add quotes if they were in original
  if (shouldAddQuotes) {
    // IMPORTANT: Don't use trim() - it removes punctuation spacing!
    // Just remove leading spaces, keep trailing spaces from punctuation
    const cleaned = processed.replace(/^\s+/, '');
    
    // Space before left quote, space after right quote
    return ` &ldquo;${cleaned}&rdquo; `;
  }
  
  return processed;
};

/**
 * Extract code from first field
 * Rule: Find LAST digit, everything after is location
 * 
 * Examples:
 * N05BA01Guayama → N05BA01 | Guayama
 * B02BCSan Ramon → B02BC | San Ramon
 */
const extractCodeAndLocation = (text) => {
  if (!text) return { code: '', location: '' };
  
  // Find the LAST digit in the string
  let lastDigitIndex = -1;
  for (let i = 0; i < text.length; i++) {
    if (/\d/.test(text[i])) {
      lastDigitIndex = i;
    }
  }
  
  // If we found digits, split after the last digit
  if (lastDigitIndex !== -1 && lastDigitIndex < text.length - 1) {
    const code = text.substring(0, lastDigitIndex + 1).trim();
    const location = text.substring(lastDigitIndex + 1).trim();
    
    return { code, location };
  }
  
  // Fallback
  const match = text.match(/^([A-Z0-9]+)([A-Z][a-z].*)$/);
  if (match) {
    return {
      code: match[1].trim(),
      location: match[2].trim()
    };
  }
  
  return { code: text.trim(), location: '' };
};

/**
 * Company entity keywords
 */
const COMPANY_ENTITIES = [
   'LIMITED', 'LTD.,','LTD,.', 'LTD,', 'LTD.',
  'PRIVATE LIMITED','PVT LTD.,', 'PVT LTD,.', 'PVT. LTD', 'PVT LTD.',
  'INCORPORATION', 'INC.,','INC,.', 'INC,', 'INC.',
  'CORPORATION', 'CORP.,','CORP,.', 'CORP,', 'CORP.',
  'LIMITED LIABILITY PARTNERSHIP', 'LLP.,','LLP,.', 'LLP.',"LLP,",'LLP',
  'LIMITED LIABILITY COMPANY', 'LLC.,','LLC,.', 'LLC,', 'LLC.',
  'LIMITED PARTNERSHIP', 'LP.,', 'LP,.',' LP,', 'LP.','LP',
  'COMPANY', 'CO.,', 'CO,.','CO.', 'CO,','CO',
  'PROGRAMMABLE LOGIC CONTROLLER', 'PLC.', 'PLC',
  'AGENCY', 'AG.,', 'AG,.', 'AG,', 'AG.','AG',
  'ORGANIZATION', 'ORG.,', 'ORG,.', 'ORG,', 'ORG.','ORG',
  'GESELLSCHAFT MIT BESCHRÄNKTER HAFTUNG', 'GMBH.,', 'GMBH,.', 'GMBH,', 'GMBH.', 'GMBH',
  'LIMITED LIABILITY', 'LL.,','LL,.',  'LL,', 'LL.', 'LL',
  'SALAZAR RESOURCES LIMITED', 'SRL.,', 'SRL,.', 'SRL,', 'SRL.', 'SRL'
];

/**
 * Find ALL entities in text and return the LAST one (rightmost)
 * 
 * CRITICAL: If multiple entities side-by-side, return the LAST one!
 * Example: "BARR-STALFORT DIV., PITTWAY CORP."
 *          Entities: DIV, CORP
 *          Return: CORP (the last one)
 */
const findLastEntity = (text) => {
  const sortedEntities = [...COMPANY_ENTITIES].sort((a, b) => b.length - a.length);
  
  const matches = [];
  
  for (const entity of sortedEntities) {
    const escapedEntity = entity.replace(/\./g, '\\.').replace(/[()]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedEntity}\\b`, 'gi');
    
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        entity: entity,
        start: match.index,
        end: match.index + match[0].length,
        text: match[0]
      });
    }
  }
  
  if (matches.length === 0) {
    return null;
  }
  
  // Sort by position (earliest to latest)
  matches.sort((a, b) => a.start - b.start);
  
  // CRITICAL: Return the LAST match (rightmost entity)
  return matches[matches.length - 1];
};

/**
 * Split company name and address
 * 
 * Priority:
 * 1. Triple/double quotes
 * 2. Quote separator
 * 3. Comma separator
 * 4. LAST entity (rightmost)
 * 5. Street number
 * 6. Fallback
 */
const splitNameAndAddress = (text) => {
  if (!text) return { name: '', address: '', hasQuotes: false };
  
  const trimmed = text.trim();
  
  // Check if original has quotes
  const hasQuotes = trimmed.includes('"');
  
  // Pattern 1: Triple quotes
  let match = trimmed.match(/^""(.+?)""(.+?)"""$/);
  if (match) {
    return {
      name: match[1].trim(),
      address: match[2].trim(),
      hasQuotes: true
    };
  }
  
  // Pattern 2: Double quotes
  match = trimmed.match(/^""(.+?)""(.+?)""$/);
  if (match) {
    return {
      name: match[1].trim(),
      address: match[2].trim(),
      hasQuotes: true
    };
  }
  
  // Pattern 3: Quote separator
  const quoteIndex = trimmed.indexOf('"');
  if (quoteIndex > 0) {
    const beforeQuote = trimmed.substring(0, quoteIndex).trim();
    const afterQuote = trimmed.substring(quoteIndex + 1).trim();
    
    return {
      name: beforeQuote,
      address: afterQuote.replace(/^"+|"+$/g, ''),
      hasQuotes: true
    };
  }
  
  // Pattern 4: Comma separator
  const commaIndex = trimmed.indexOf(',');
  if (commaIndex !== -1) {
    return {
      name: trimmed.substring(0, commaIndex).trim(),
      address: trimmed.substring(commaIndex + 1).trim(),
      hasQuotes: false
    };
  }
  
  // Pattern 5: LAST entity (rightmost) - CRITICAL FIX!
  const lastEntity = findLastEntity(trimmed);
  
  if (lastEntity) {
    let splitPoint = lastEntity.end;
    
    // Check for punctuation/space after entity
    const afterEntity = trimmed.substring(splitPoint);
    const punctMatch = afterEntity.match(/^[,.\s]+/);
    if (punctMatch) {
      splitPoint += punctMatch[0].length;
    }
    
    return {
      name: trimmed.substring(0, splitPoint).trim(),
      address: trimmed.substring(splitPoint).trim(),
      hasQuotes: false
    };
  }
  
  // Pattern 6: Street number
  const streetMatch = trimmed.match(/^(.+?)(\d{1,5}\s+[A-Z])/);
  if (streetMatch) {
    return {
      name: streetMatch[1].trim(),
      address: trimmed.substring(streetMatch[1].length).trim(),
      hasQuotes: false
    };
  }
  
  // Fallback
  return { name: trimmed, address: '', hasQuotes: false };
};

/**
 * Process 2 Rows Format
 */
export const process2RowsFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  console.log('📄 2 Rows Format: Processing...');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    
    const columns = parseCSVLine(line);
    
    if (columns.length < 2) continue;
    
    // Column 1: Code + Location
    const { code, location } = extractCodeAndLocation(columns[0] || '');
    
    // Column 2: Company Name + Address
    const { name, address, hasQuotes } = splitNameAndAddress(columns[1] || '');
    
    // Apply punctuation
    const processedCode = formatField(code);
    const processedLocation = formatField(location);
    const processedName = formatField(name);
    // Only add quotes if they were in original
    const processedAddress = formatAddress(address, hasQuotes);
    
    // Build HTML
    htmlOutput += `<doctypehtml${counter}>\n`;
    htmlOutput += `<html>\n`;
    htmlOutput += `<body>\n`;
    htmlOutput += processedCode + '\n';
    htmlOutput += processedLocation + '\n';
    htmlOutput += processedName + '\n';
    htmlOutput += processedAddress + '\n';
    htmlOutput += `</body>\n`;
    htmlOutput += `</html>\n`;
    
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'Code': processedCode,
      'Location': processedLocation,
      'Company Name': processedName,
      'Address': processedAddress
    });
    
    counter++;
  }
  
  console.log(`✅ ${counter - 1} records processed`);
  
  return { htmlOutput, dataArray };
};

/**
 * Validate 2 Rows input
 */
export const validate2RowsInput = (lines) => {
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
    message: `Ready to process ${nonEmptyLines.length} 2 Rows records`
  };
};