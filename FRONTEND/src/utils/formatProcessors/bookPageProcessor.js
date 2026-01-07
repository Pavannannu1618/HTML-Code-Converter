
import { applyPunctuation } from '../punctuationRules';

const formatAddressText = (text) => applyPunctuation(text, false, false);
const formatLinkText = (text) => {
  if (!text) return '';
  let processed = text.trim().replace(/""/g, '"').replace(/\s+/g, '');
  processed = applyPunctuation(processed, true, false);
  
  // Quote conversion
  let isOpen = false;
  let output = '';
  for (let i = 0; i < processed.length; i++) {
    if (processed[i] === '"') {
      output += isOpen ? '&#rdquo;' : '&#ldquo;';
      isOpen = !isOpen;
    } else {
      output += processed[i];
    }
  }
  return output;
};
  
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
 * Detect CSV format
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
 * Extract fields based on format
 */
const extractFields = (line, format) => {
  if (format === 'comma') {
    const fields = parseCSVLine(line);
    return { address: fields[0] || '', link: fields[1] || '' };
  } else {
    const cleanLine = line.replace(/^"/, '').replace(/"$/, '');
    const parts = cleanLine.split(/\s{10,}/);
    return { address: parts[0] || '', link: parts[1] || '' };
  }
};

// ============================================================================
// MAIN PROCESSOR
// ============================================================================

/**
 * Process Book Page Format
 * 
 * @param {Array<string>} lines - Lines from uploaded file
 * @returns {Object} { htmlOutput: string, dataArray: Array }
 */
export const processBookPageFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  const firstLine = lines.find(line => line.trim());
  const format = firstLine ? detectFormat(firstLine) : 'comma';
  
  console.log(`📖 Book Page: ${format === 'comma' ? 'Comma' : 'Space'}-separated`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    
    const { address, link } = extractFields(line, format);
    if (!address.trim() && !link.trim()) continue;
    
    // Use existing punctuation rules!
    const processedAddress = formatAddressText(address);
    const processedLink = formatLinkText(link);
    
    htmlOutput += `<doctypehtml${counter}>\n<html>\n<body>\n`;
    htmlOutput += processedAddress + '\n';
    htmlOutput += processedLink + '\n';
    htmlOutput += `</body>\n</html>\n`;
    
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'Address': processedAddress,
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

export const validateBookPageInput = (lines) => {
  if (!lines || lines.length === 0) {
    return { valid: false, error: 'No data to process.' };
  }
  
  const nonEmptyLines = lines.filter(line => line.trim());
  if (nonEmptyLines.length === 0) {
    return { valid: false, error: 'File contains only empty lines.' };
  }
  
  const format = detectFormat(nonEmptyLines[0]);
  
  return {
    valid: true,
    format: format,
    expectedRecords: nonEmptyLines.length,
    message: `${format === 'comma' ? 'Comma' : 'Space'}-separated CSV`
  };
};