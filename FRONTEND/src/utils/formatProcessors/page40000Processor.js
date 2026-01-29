/**
 * ============================================================================
 * 40000 PAGE FORMAT PROCESSOR - FINAL VERSION
 * ============================================================================
 * 
 * Structure (3 fields per record):
 * - Line 1: Details 1 - WITH SPACING
 * - Line 2: Details 2 - WITH SPACING
 * - Line 3: Link (HTML/CSS) - NO SPACING
 * 
 * ============================================================================
 */

import { applyPunctuationWithSpacing, applyPunctuationNoSpacing } from '../punctuationRules.js';

const formatDetails1Text = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

const formatDetails2Text = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

const formatLinkText = (text) => {
  if (!text) return '';
  return applyPunctuationNoSpacing(text);
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
    details1: fields[0] || '',
    details2: fields[1] || '',
    link: fields[2] || ''
  };
};

export const processPage40000Format = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  console.log(`📄 40000 Page: Processing ${lines.length} lines`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    
    const { details1, details2, link } = extractFields(line);
    
    if (!details1.trim() && !details2.trim() && !link.trim()) continue;
    
    const processedDetails1 = formatDetails1Text(details1);
    const processedDetails2 = formatDetails2Text(details2);
    const processedLink = formatLinkText(link);
    
    htmlOutput += `<doctypehtml${counter}>\n`;
    htmlOutput += `<html>\n`;
    htmlOutput += `<body>\n`;
    htmlOutput += processedDetails1 + '\n';
    htmlOutput += processedDetails2 + '\n';
    htmlOutput += processedLink + '\n';
    htmlOutput += `</body>\n`;
    htmlOutput += `</html>\n`;
    
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