/**
 * ============================================================================
 * MD PAGE FORMAT PROCESSOR - FINAL VERSION
 * ============================================================================
 * 
 * Structure (3 fields per record):
 * - Line 1: Details - WITH SPACING
 * - Line 2: Company Address 1 - WITH SPACING
 * - Line 3: Company Address 2 - WITH SPACING
 * 
 * All fields use spacing around punctuation (keywords work)
 * 
 * ============================================================================
 */

import { applyPunctuationWithSpacing } from '../punctuationRules';

const formatDetailsText = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

const formatAddress1Text = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

const formatAddress2Text = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
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

const extractFields = (line) => {
  const fields = parseCSVLine(line);
  
  return {
    details: fields[0] || '',
    address1: fields[1] || '',
    address2: fields[2] || ''
  };
};

export const processMDPageFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  console.log(`📄 MD Page: Processing ${lines.length} lines`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    
    const { details, address1, address2 } = extractFields(line);
    
    if (!details.trim() && !address1.trim() && !address2.trim()) continue;
    
    const processedDetails = formatDetailsText(details);
    const processedAddress1 = formatAddress1Text(address1);
    const processedAddress2 = formatAddress2Text(address2);
    
    htmlOutput += `<doctypehtml${counter}>\n`;
    htmlOutput += `<html>\n`;
    htmlOutput += `<body>\n`;
    htmlOutput += processedDetails + '\n';
    htmlOutput += processedAddress1 + '\n';
    htmlOutput += processedAddress2 + '\n';
    htmlOutput += `</body>\n`;
    htmlOutput += `</html>\n`;
    
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'Details': processedDetails,
      'Company Address 1': processedAddress1,
      'Company Address 2': processedAddress2
    });
    
    counter++;
  }
  
  console.log(`✅ ${counter - 1} records`);
  
  return { htmlOutput, dataArray };
};

export const validateMDPageInput = (lines) => {
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
    message: `Ready to process ${nonEmptyLines.length} MD Page records`
  };
};