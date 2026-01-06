import { applyPunctuation } from '../punctuationRules';
import { parseCSVLine } from '../csvParser';

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
    
    // Check if line has triple quotes in original
    const hasTripleQuotes = line.includes('"""');
    
    const columns = parseCSVLine(line);
    
    const code = columns[0] || '';
    const location = columns[1] || '';
    const name = columns[2] || '';
    const address = columns[3] || '';
    
    // Add quotes if original had triple quotes
    const shouldAddQuotes = hasTripleQuotes;
    
    const processedCode = applyPunctuation(code, false, false);
    const processedLocation = applyPunctuation(location, false, false);
    const processedName = applyPunctuation(name, false, false);
    const processedAddress = applyPunctuation(address, false, shouldAddQuotes);
    
    htmlOutput += `<doctypehtml${counter}>\n<html>\n<body>\n`;
    htmlOutput += processedCode + '\n';
    htmlOutput += processedLocation + '\n';
    htmlOutput += processedName + '\n';
    htmlOutput += processedAddress + '\n';
    htmlOutput += `</body>\n</html>\n`;
    
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