import { applyPunctuationWithSpacing } from '../punctuationRules';
import { parseCSVLine } from '../csvParser';

/**
 * Apply punctuation WITHOUT automatic quotes
 */
const formatField = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

/**
 * Apply punctuation WITH quotes for address field
 */
const formatAddress = (text, shouldAddQuotes) => {
  if (!text) return '';
  const processed = applyPunctuationWithSpacing(text);
  
  // Only add quotes if they were in the original data
  if (shouldAddQuotes) {
    return ` &ldquo;${processed.trim()}&rdquo; `;
  }
  
  return processed;
};

/**
 * Extract code from first field
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
 * Find last entity
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
  
  matches.sort((a, b) => a.start - b.start);
  return matches[matches.length - 1];
};

/**
 * Split company name and address
 * Returns: { name, address, hasQuotes }
 */
const splitNameAndAddress = (text) => {
  if (!text) return { name: '', address: '', hasQuotes: false };
  
  const trimmed = text.trim();
  
  // Check if original text has quote marks (indicates formatted with quotes)
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
  
  // Pattern 3: Quote separator (split at quote)
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
  
  // Pattern 5: Entity keywords
  const lastEntity = findLastEntity(trimmed);
  
  if (lastEntity) {
    let splitPoint = lastEntity.end;
    
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
  
  // Pattern 6: Street number (ONLY if no entity found)
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
    // Only add quotes if they were in the original data
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