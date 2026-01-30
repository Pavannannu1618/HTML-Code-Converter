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
const formatAddress = (text) => {
  if (!text) return '';
  const processed = applyPunctuationWithSpacing(text);
  // Wrap in quotes with spaces
  return ` &ldquo;${processed.trim()}&rdquo; `;
};

/**
 * Extract code from first field
 * Find the LAST DIGIT, everything after is location
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
  
  // Fallback: Look for capital letter followed by lowercase (like "Tampa")
  const match = text.match(/^([A-Z0-9]+)([A-Z][a-z].*)$/);
  if (match) {
    return {
      code: match[1].trim(),
      location: match[2].trim()
    };
  }
  
  // Last fallback: treat entire text as code
  return { code: text.trim(), location: '' };
};

/**
 * Company entity keywords - these END the company name
 */
const COMPANY_ENTITIES = [
  // Limited variations
  'PRIVATE LIMITED', 'LIMITED',
  'PVT LTD.', 'PVT LTD', 'PVT. LTD',
  'LTD.', 'LTD',
  
  // Incorporation variations
  'INCORPORATION', 'INCORPORATED',
  'INC.', 'INC',
  
  // Corporation variations
  'CORPORATION',
  'CORP.', 'CORP',
  
  // Partnership variations
  'LIMITED LIABILITY PARTNERSHIP',
  'LLP.', 'LLP',
  
  // Company variations
  'LIMITED LIABILITY COMPANY',
  'LLC.', 'LLC',
  
  // Limited Partnership
  'LIMITED PARTNERSHIP',
  'LP.', 'LP',
  
  // Company
  'COMPANY',
  'CO.', 'CO',
  
  // PLC
  'PROGRAMMABLE LOGIC CONTROLLER',
  'PLC.', 'PLC',
  
  // Agency
  'AGENCY',
  'AG.', 'AG',
  
  // Organization
  'ORGANIZATION',
  'ORG.', 'ORG',
  
  // German GMBH
  'GESELLSCHAFT MIT BESCHRÄNKTER HAFTUNG',
  'GMBH.', 'GMBH',
  
  // Limited Liability
  'LIMITED LIABILITY',
  'LL.', 'LL',
  
  // SRL
  'SALAZAR RESOURCES LIMITED',
  'SRL.', 'SRL',
  
  // // Laboratories
  // 'LABORATORIES',
  // 'LABS.', 'LABS',
  
  // // SA (Sociedad Anónima)
  // 'SA.', 'SA',
  
  // // AB (Swedish)
  // 'AB.', 'AB',
  
  // // KG/KGA (German partnership)
  // 'KGAA.', 'KGAA',
  // 'KG.', 'KG'
];

/**
 * Find all entity matches in text and return the LAST one
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
  
  // Return the LAST match (rightmost entity)
  let lastMatch = matches[matches.length - 1];
  
  for (let i = matches.length - 2; i >= 0; i--) {
    const current = matches[i];
    const next = matches[i + 1];
    
    // If entities are within 10 characters of each other, they're a group
    const gap = next.start - current.end;
    if (gap <= 10) {
      continue;
    } else {
      break;
    }
  }
  
  return lastMatch;
};

/**
 * Split company name and address from combined field
 * 
 * Priority order:
 * 1. Triple/double quotes
 * 2. Quote after entity (INC."Address)
 * 3. Comma separator
 * 4. Entity keywords
 * 5. Street number
 * 6. Fallback
 */
const splitNameAndAddress = (text) => {
  if (!text) return { name: '', address: '' };
  
  const trimmed = text.trim();
  
  // Pattern 1: Triple quotes pattern (""Name""Address""")
  let match = trimmed.match(/^""(.+?)""(.+?)"""$/);
  if (match) {
    return {
      name: match[1].trim(),
      address: match[2].trim()
    };
  }
  
  // Pattern 2: Double quotes pattern (""Name""Address"")
  match = trimmed.match(/^""(.+?)""(.+?)""$/);
  if (match) {
    return {
      name: match[1].trim(),
      address: match[2].trim()
    };
  }
  
  // Pattern 3: Quote separator (ALWAYS split at quote!)
  // CSV: "CINTICHEM INC.""1 East 45th Street..." → CINTICHEM INC."1 East 45th Street...
  // CSV: "COSMA SPA""2489 Walden Ave..." → COSMA SPA"2489 Walden Ave...
  const quoteIndex = trimmed.indexOf('"');
  if (quoteIndex > 0) {
    const beforeQuote = trimmed.substring(0, quoteIndex).trim();
    const afterQuote = trimmed.substring(quoteIndex + 1).trim();
    
    return {
      name: beforeQuote,
      address: afterQuote.replace(/^"+|"+$/g, '') // Remove surrounding quotes
    };
  }
  
  // Pattern 4: Look for comma as separator (most common)
  const commaIndex = trimmed.indexOf(',');
  if (commaIndex !== -1) {
    return {
      name: trimmed.substring(0, commaIndex).trim(),
      address: trimmed.substring(commaIndex + 1).trim()
    };
  }
  
  // Pattern 5: Look for company entity keywords (multi-entity handling)
  const lastEntity = findLastEntity(trimmed);
  
  if (lastEntity) {
    // Split after this entity
    let splitPoint = lastEntity.end;
    
    // Check if there's punctuation or space after the entity
    const afterEntity = trimmed.substring(splitPoint);
    const punctMatch = afterEntity.match(/^[,.\s]+/);
    if (punctMatch) {
      splitPoint += punctMatch[0].length;
    }
    
    return {
      name: trimmed.substring(0, splitPoint).trim(),
      address: trimmed.substring(splitPoint).trim()
    };
  }
  
  // Pattern 6: Look for street number (ONLY if no entity found)
  const streetMatch = trimmed.match(/^(.+?)(\d{1,5}\s+[A-Z])/);
  if (streetMatch) {
    return {
      name: streetMatch[1].trim(),
      address: trimmed.substring(streetMatch[1].length).trim()
    };
  }
  
  // Pattern 7: Fallback - entire text is name
  return { name: trimmed, address: '' };
};

/**
 * Process 2 Rows Format
 * CSV Format: CodeLocation,"CompanyName,Address"
 */
export const process2RowsFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  console.log('📄 2 Rows Format: Processing...');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    
    // Parse CSV line
    const columns = parseCSVLine(line);
    
    if (columns.length < 2) continue;
    
    // Column 1: Code + Location (combined like "A10BA02SAN FRANCISCO")
    const { code, location } = extractCodeAndLocation(columns[0] || '');
    
    // Column 2: Company Name + Address
    const { name, address } = splitNameAndAddress(columns[1] || '');
    
    // Apply punctuation to all fields
    const processedCode = formatField(code);
    const processedLocation = formatField(location);
    const processedName = formatField(name);
    // Address gets quotes wrapped around it
    const processedAddress = formatAddress(address);
    
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