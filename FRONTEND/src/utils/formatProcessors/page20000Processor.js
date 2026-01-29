/**
 * ============================================================================
 * 20000 PAGE FORMAT PROCESSOR - FINAL VERSION
 * ============================================================================
 * 
 * Structure (3 fields per record):
 * - Line 1: Details - WITH SPACING
 * - Line 2: Link (HTML/CSS) - NO SPACING
 * - Line 3: Address - WITH SPACING
 * 
 * ============================================================================
 */

import { applyPunctuationWithSpacing, applyPunctuationNoSpacing } from '../punctuationRules';

const formatDetailsText = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

const formatLinkText = (text) => {
  if (!text) return '';
  return applyPunctuationNoSpacing(text);
};

const formatAddressText = (text) => {
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

const detectFormat = (line) => {
  if (!line) return 'comma';
  
  let insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') insideQuotes = !insideQuotes;
    if (line[i] === ',' && !insideQuotes) return 'comma';
  }
  
  const cleanLine = line.replace(/^"/, '').replace(/"$/, '');
  if (/\s{3,}/.test(cleanLine)) return 'space';
  
  return 'comma';
};

const extractFields = (line, format) => {
  if (format === 'comma') {
    const fields = parseCSVLine(line);
    return {
      details: fields[0] || '',
      link: fields[1] || '',
      address: fields[2] || ''
    };
  } else {
    const cleanLine = line.replace(/^"/, '').replace(/"$/, '');
    const parts = cleanLine.split(/\s{3,}/);
    return {
      details: parts[0] || '',
      link: parts[1] || '',
      address: parts[2] || ''
    };
  }
};

export const processPage20000Format = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  const firstLine = lines.find(line => line.trim());
  const format = firstLine ? detectFormat(firstLine) : 'comma';
  
  console.log(`📄 20000 Page: ${format === 'comma' ? 'Comma' : 'Space'}-separated`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    
    const { details, link, address } = extractFields(line, format);
    
    if (!details.trim() && !link.trim() && !address.trim()) continue;
    
    const processedDetails = formatDetailsText(details);
    const processedLink = formatLinkText(link);
    const processedAddress = formatAddressText(address);
    
    htmlOutput += `<doctypehtml${counter}>\n`;
    htmlOutput += `<html>\n`;
    htmlOutput += `<body>\n`;
    htmlOutput += processedDetails + '\n';
    htmlOutput += processedLink + '\n';
    htmlOutput += processedAddress + '\n';
    htmlOutput += `</body>\n`;
    htmlOutput += `</html>\n`;
    
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'Details': processedDetails,
      'Link': processedLink,
      'Address': processedAddress
    });
    
    counter++;
  }
  
  console.log(`✅ ${counter - 1} records`);
  
  return { htmlOutput, dataArray };
};

export const validatePage20000Input = (lines) => {
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
    message: `${format === 'comma' ? 'Comma' : 'Space'}-separated CSV (3 fields)`
  };
};