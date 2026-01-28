import { applyPunctuationWithSpacing, applyPunctuationNoSpacing } from '../punctuationRules';
import { parseCSVLine } from '../csvParser';

/**
 * Apply punctuation with optional quote wrapping
 * @param {string} text - Text to process
 * @param {boolean} isWebLink - Is this a website link?
 * @param {boolean} addQuotes - Should we wrap with quotes?
 * @returns {string} - Processed text
 */
const applyPunctuationWithQuotes = (text, isWebLink = false, addQuotes = false) => {
  if (!text) return '';
  
  // Process punctuation first
  let result = isWebLink 
    ? applyPunctuationNoSpacing(text)
    : applyPunctuationWithSpacing(text);
  
  // Add quotes if requested
  if (addQuotes && !isWebLink) {
    // Trim spaces before adding quotes
    result = result.trim();
    // Add opening and closing quotes with proper spacing
    result = ` &ldquo;${result}&rdquo; `;
  }
  
  return result;
};

/**
 * Process 4 Rows Format (CSV with 4 columns)
 * Column 1: Code
 * Column 2: Location
 * Column 3: Name
 * Column 4: Address
 * Triple quotes """ in CSV = add &ldquo; &rdquo; in output
 */
export const process4RowsFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line has triple quotes in FOURTH column (address)
    // This indicates the address should be wrapped in quotes
    const hasTripleQuotes = line.includes('"""');
    
    // Parse CSV line
    const columns = parseCSVLine(line);
    
    const code = columns[0] || '';
    const location = columns[1] || '';
    const name = columns[2] || '';
    let address = columns[3] || '';
    
    // If original had triple quotes, clean up the address
    // CSV parser leaves "" at start/end which are escaped quotes
    if (hasTripleQuotes) {
      // Remove leading and trailing "" (escaped quotes from CSV)
      address = address.replace(/^""/, '').replace(/""$/, '');
    }
    
    // Process each field
    const processedCode = applyPunctuationWithQuotes(code, false, false);
    const processedLocation = applyPunctuationWithQuotes(location, false, false);
    const processedName = applyPunctuationWithQuotes(name, false, false);
    const processedAddress = applyPunctuationWithQuotes(address, false, hasTripleQuotes);
    
    // Build HTML output
    htmlOutput += `<doctypehtml${counter}>\n<html>\n<body>\n`;
    htmlOutput += processedCode + '\n';
    htmlOutput += processedLocation + '\n';
    htmlOutput += processedName + '\n';
    htmlOutput += processedAddress + '\n';
    htmlOutput += `</body>\n</html>\n`;
    
    // Store in data array
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'Code': processedCode,
      'Location': processedLocation,
      'Company Name': processedName,
      'Address': processedAddress
    });
    
    counter++;
  }
  
  return { htmlOutput, dataArray };
};