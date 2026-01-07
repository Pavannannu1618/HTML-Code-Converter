import { applyPunctuation } from '../punctuationRules';
import { parseCSVLine } from '../csvParser';

/**
 * Process Website Format
 * CSV Format: Name1,"""Address""",Name2,Website (all on one line)
 * OR
 * Text Format: 4 separate lines per record
 */
export const processWebsiteFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  // Check if first line contains commas (CSV format) or not (text format)
  const isCsvFormat = lines[0] && lines[0].includes(',');

  if (isCsvFormat) {
    // CSV FORMAT: One line per record with 4 columns
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const columns = parseCSVLine(line);
      
      if (columns.length < 4) continue;
      
      const name1 = columns[0] || '';
      let address = columns[1] || '';
      const name2 = columns[2] || '';
      const website = columns[3] || '';
      
      // Remove triple quotes from address if present
      address = address.replace(/^"""/, '').replace(/"""$/, '');
      
      // Remove spaces from website
      const cleanWebsite = website.replace(/\s+/g, '');
      
      const processedName1 = applyPunctuation(name1, false, false);
      const processedAddress = applyPunctuation(address, false, true);
      const processedName2 = applyPunctuation(name2, false, false);
      const processedWebsite = applyPunctuation(cleanWebsite, true, false);
      
      htmlOutput += `<doctypehtml${counter}>\n<html>\n<body>\n`;
      htmlOutput += processedName1 + '\n';
      htmlOutput += processedAddress + '\n';
      htmlOutput += processedName2 + '\n';
      htmlOutput += processedWebsite + '\n';
      htmlOutput += `</body>\n</html>\n`;
      
      dataArray.push({
        'HTML Tag': `doctypehtml${counter}`,
        'Name 1': processedName1,
        'Address': processedAddress,
        'Name 2': processedName2,
        'Website': processedWebsite
      });
      
      counter++;
    }
  } else {
    // TEXT FORMAT: 4 lines per record
    for (let i = 0; i < lines.length; i += 4) {
      const name1 = lines[i] || '';
      let address = lines[i + 1] || '';
      const name2 = lines[i + 2] || '';
      const website = lines[i + 3] || '';
      
      // Remove triple quotes from address if present
      address = address.replace(/^"""/, '').replace(/"""$/, '');
      
      // Remove spaces from website
      const cleanWebsite = website.replace(/\s+/g, '');
      
      const processedName1 = applyPunctuation(name1, false, false);
      const processedAddress = applyPunctuation(address, false, true);
      const processedName2 = applyPunctuation(name2, false, false);
      const processedWebsite = applyPunctuation(cleanWebsite, true, false);
      
      htmlOutput += `<doctypehtml${counter}>\n<html>\n<body>\n`;
      htmlOutput += processedName1 + '\n';
      htmlOutput += processedAddress + '\n';
      htmlOutput += processedName2 + '\n';
      htmlOutput += processedWebsite + '\n';
      htmlOutput += `</body>\n</html>\n`;
      
      dataArray.push({
        'HTML Tag': `doctypehtml${counter}`,
        'Name 1': processedName1,
        'Address': processedAddress,
        'Name 2': processedName2,
        'Website': processedWebsite
      });
      
      counter++;
    }
  }
  
  return { htmlOutput, dataArray };
};