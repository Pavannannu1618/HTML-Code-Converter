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
 */
const formatAddress = (text, shouldAddQuotes) => {
  if (!text) return '';
  const processed = applyPunctuationWithSpacing(text);
  
  // Only add quotes if they were in original
  if (shouldAddQuotes) {
    // Remove only leading spaces, preserve trailing spaces from punctuation
    const cleaned = processed.replace(/^\s+/, '');
    // Space before left quote, space after right quote
    return ` &ldquo;${cleaned}&rdquo; `;
  }
  
  return processed;
};

/**
 * Company entity keywords (DIV is NOT included!)
 */
const COMPANY_ENTITIES = [
  'PRIVATE LIMITED', 'LIMITED',
  'PVT LTD.', 'PVT LTD', 'PVT. LTD',
  'LTD.', 'LTD',
  'INCORPORATION', 'INCORPORATED',
  'INC.', 'INC',
  'CORPORATION',
  'CORP.', 'CORP',
  'LIMITED LIABILITY PARTNERSHIP',
  'LLP.', 'LLP',
  'LIMITED LIABILITY COMPANY',
  'LLC.', 'LLC',
  'LIMITED PARTNERSHIP',
  'LP.', 'LP',
  'COMPANY',
  'CO.', 'CO',
  'PROGRAMMABLE LOGIC CONTROLLER',
  'PLC.', 'PLC',
  'AGENCY',
  'AG.', 'AG',
  'ORGANIZATION',
  'ORG.', 'ORG',
  'GESELLSCHAFT MIT BESCHRÄNKTER HAFTUNG',
  'GMBH.', 'GMBH',
  'LIMITED LIABILITY',
  'LL.', 'LL',
  'SALAZAR RESOURCES LIMITED',
  'SRL.', 'SRL',
  'LABORATORIES',
  'LABS.', 'LABS',
  'SA.', 'SA',
  'AB.', 'AB',
  'KGAA.', 'KGAA',
  'KG.', 'KG'
];

/**
 * Find entities and handle side-by-side cases
 * 
 * RULE: If entities are side-by-side (within 20 chars), treat as one unit
 * and return the LAST one. Otherwise return the last entity overall.
 * 
 * Example: "GMBH CO KG" → All side-by-side, return KG ✅
 * Example: "CO at start... CORP at end" → Return CORP ✅
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
  
  // Sort by position
  matches.sort((a, b) => a.start - b.start);
  
  // Simply return the last match (rightmost entity)
  return matches[matches.length - 1];
};

/**
 * Split company name and address
 * 
 * Priority:
 * 1. Triple/double quotes
 * 2. Quote separator
 * 3. Entity keywords (last/rightmost entity)
 * 4. Street number
 * 5. Capital letters pattern
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
  
  // Pattern 4: Entity keywords (last/rightmost)
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
  
  // Pattern 5: Street number
  const streetMatch = trimmed.match(/^(.+?)(\d{1,5}\s+[A-Z])/);
  if (streetMatch) {
    return {
      name: streetMatch[1].trim(),
      address: trimmed.substring(streetMatch[1].length).trim(),
      hasQuotes: false
    };
  }
  
  // Pattern 6: Capital letters pattern
  const capitalPositions = [];
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    const prevChar = i > 0 ? trimmed[i - 1] : ' ';
    
    if (/[A-Z]/.test(char) && /[\s\-,.]/.test(prevChar)) {
      capitalPositions.push(i);
    }
  }
  
  if (capitalPositions.length >= 2) {
    const splitIndex = capitalPositions[capitalPositions.length - 2];
    const afterSplit = trimmed.substring(splitIndex).trim();
    
    if (afterSplit && /^[A-Z0-9]/.test(afterSplit)) {
      return {
        name: trimmed.substring(0, splitIndex).trim(),
        address: afterSplit,
        hasQuotes: false
      };
    }
  }
  
  // Fallback
  return { name: trimmed, address: '', hasQuotes: false };
};

/**
 * Process Double Double Format
 * 
 * CSV Format: "Company1Name+Address","Company2Name+Address"
 * 
 * Output:
 * Company1 Name
 * Company1 Address
 * Company2 Name
 * Company2 Address
 */
export const processDoubleDoubleFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  console.log('📄 Double Double Format: Processing...');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    
    const columns = parseCSVLine(line);
    
    if (columns.length < 2) continue;
    
    // Column 1: First Company Name + Address
    const first = splitNameAndAddress(columns[0] || '');
    
    // Column 2: Second Company Name + Address
    const second = splitNameAndAddress(columns[1] || '');
    
    // Apply punctuation
    const firstName = formatField(first.name);
    const firstAddress = formatAddress(first.address, first.hasQuotes);
    
    const secondName = formatField(second.name);
    const secondAddress = formatAddress(second.address, second.hasQuotes);
    
    // Build HTML
    htmlOutput += `<doctypehtml${counter}>\n`;
    htmlOutput += `<html>\n`;
    htmlOutput += `<body>\n`;
    htmlOutput += firstName + '\n';
    htmlOutput += firstAddress + '\n';
    htmlOutput += secondName + '\n';
    htmlOutput += secondAddress + '\n';
    htmlOutput += `</body>\n`;
    htmlOutput += `</html>\n`;
    
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'First Company Name': firstName,
      'First Address': firstAddress,
      'Second Company Name': secondName,
      'Second Address': secondAddress
    });
    
    counter++;
  }
  
  console.log(`✅ ${counter - 1} records processed`);
  
  return { htmlOutput, dataArray };
};

/**
 * Validate Double Double input
 */
export const validateDoubleDoubleInput = (lines) => {
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
    message: `Ready to process ${nonEmptyLines.length} Double Double records`
  };
};