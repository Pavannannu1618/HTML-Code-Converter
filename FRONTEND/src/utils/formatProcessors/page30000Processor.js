/**
 * ============================================================================
 * 30000 PAGE FORMAT PROCESSOR - FINAL VERSION
 * ============================================================================
 * 
 * Structure (3 fields per record):
 * - Line 1: Details - WITH SPACING
 * - Line 2: Details - WITH SPACING
 * - Line 3: Company Name - WITH SPACING
 * 
 * All fields use spacing around punctuation (keywords work)
 * 
 * ============================================================================
 */

import { applyPunctuationWithSpacing } from '../punctuationRules.js';

const formatDetails = (text) => {
  if (!text) return '';
  return applyPunctuationWithSpacing(text);
};

const formatCompanyName = (text) => {
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

export const processPage30000Format = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  const isCsvFormat = lines[0] && lines[0].includes(',');

  if (isCsvFormat) {
    console.log('📄 30000 Page: CSV format detected');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const columns = parseCSVLine(line);
      
      if (columns.length < 3) continue;
      
      const details1 = columns[0] || '';
      const details2 = columns[1] || '';
      const companyName = columns[2] || '';
      
      const processedDetails1 = formatDetails(details1);
      const processedDetails2 = formatDetails(details2);
      const processedCompanyName = formatCompanyName(companyName);
      
      htmlOutput += `<doctypehtml${counter}>\n`;
      htmlOutput += `<html>\n`;
      htmlOutput += `<body>\n`;
      htmlOutput += processedDetails1 + '\n';
      htmlOutput += processedDetails2 + '\n';
      htmlOutput += processedCompanyName + '\n';
      htmlOutput += `</body>\n`;
      htmlOutput += `</html>\n`;
      
      dataArray.push({
        'HTML Tag': `doctypehtml${counter}`,
        'Details 1': processedDetails1,
        'Details 2': processedDetails2,
        'Company Name': processedCompanyName
      });
      
      counter++;
    }
  } else {
    console.log('📄 30000 Page: Text format detected');
    
    for (let i = 0; i < lines.length; i += 3) {
      const details1 = lines[i] || '';
      const details2 = lines[i + 1] || '';
      const companyName = lines[i + 2] || '';
      
      const processedDetails1 = formatDetails(details1);
      const processedDetails2 = formatDetails(details2);
      const processedCompanyName = formatCompanyName(companyName);
      
      htmlOutput += `<doctypehtml${counter}>\n`;
      htmlOutput += `<html>\n`;
      htmlOutput += `<body>\n`;
      htmlOutput += processedDetails1 + '\n';
      htmlOutput += processedDetails2 + '\n';
      htmlOutput += processedCompanyName + '\n';
      htmlOutput += `</body>\n`;
      htmlOutput += `</html>\n`;
      
      dataArray.push({
        'HTML Tag': `doctypehtml${counter}`,
        'Details 1': processedDetails1,
        'Details 2': processedDetails2,
        'Company Name': processedCompanyName
      });
      
      counter++;
    }
  }
  
  console.log(`✅ 30000 Page: ${counter - 1} records processed`);
  
  return { htmlOutput, dataArray };
};

export const validatePage30000Input = (lines) => {
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
    message: `Ready to process ${nonEmptyLines.length} 30000 Page records`
  };
};