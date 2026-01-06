import { applyPunctuation } from '../punctuationRules';
import { parseCSVLine } from '../csvParser';

/**
 * Process 2 Rows Format
 * CSV Format: Code+Location,"Name""Address"""
 * One line per record with comma separation
 * Inside quoted field: Name""Address (double quotes separate name from address)
 */
export const process2RowsFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Parse CSV line
    const columns = parseCSVLine(line);
    
    if (columns.length < 2) continue;
    
    // Column 1: Code + Location (combined)
    const firstColumn = columns[0] || '';
    
    // Split code and location
    let code = '';
    let location = '';
    const codeMatch = firstColumn.match(/^(\d+)/);
    if (codeMatch) {
      code = codeMatch[1];
      location = firstColumn.substring(code.length).trim();
    } else {
      code = firstColumn;
    }
    
    // Column 2: Name + Address
    // After CSV parsing, quotes are removed, leaving: Name""Address"""
    const secondColumn = columns[1] || '';
    
    let name = '';
    let address = '';
    
    // Pattern 1: Try to match Name""Address"""
    let match = secondColumn.match(/^(.+?)""(.+?)"""$/);
    if (match) {
      name = match[1].trim();
      address = match[2].trim();
    } else {
      // Pattern 2: Try to match Name""Address""
      match = secondColumn.match(/^(.+?)""(.+?)""$/);
      if (match) {
        name = match[1].trim();
        address = match[2].trim();
      } else {
        // Pattern 3: No quotes found, use entity detection
        // Look for entities like LTD, INC, CO, etc.
        const upperText = secondColumn.toUpperCase();
        const entities = ['LIMITED', 'LTD', 'INC', 'CORP', 'CO', 'LLC', 'LLP'];
        
        let firstEntityPos = -1;
        let firstEntityLen = 0;
        
        entities.forEach(entity => {
          const pos = upperText.indexOf(entity);
          if (pos !== -1 && (firstEntityPos === -1 || pos < firstEntityPos)) {
            firstEntityPos = pos;
            firstEntityLen = entity.length;
          }
        });
        
        if (firstEntityPos !== -1) {
          const endPos = firstEntityPos + firstEntityLen;
          name = secondColumn.substring(0, endPos).trim();
          address = secondColumn.substring(endPos).trim();
        } else {
          // No entity found - split at first quote or capital letters
          const quotePos = secondColumn.indexOf('"');
          if (quotePos !== -1) {
            name = secondColumn.substring(0, quotePos).trim();
            address = secondColumn.substring(quotePos + 1).trim();
          } else {
            name = secondColumn;
            address = '';
          }
        }
      }
    }
    
    // Apply punctuation rules
    const processedCode = applyPunctuation(code, false, false);
    const processedLocation = applyPunctuation(location, false, false);
    const processedName = applyPunctuation(name, false, false);
    // Address always gets quotes in 2 Rows format
    const processedAddress = applyPunctuation(address, false, true);
    
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