import { applyPunctuation } from '../punctuationRules';

/**
 * Process Book Page Format
 * Row 1: Company Address
 * Row 2: Link (no spaces in link)
 */
export const processBookPageFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  for (let i = 0; i < lines.length; i += 2) {
    const address = lines[i] || '';
    const link = lines[i + 1] || '';
    
    // Remove spaces from link
    const cleanLink = link.replace(/\s+/g, '');
    
    const processedAddress = applyPunctuation(address, false, false);
    const processedLink = applyPunctuation(cleanLink, true, false);
    
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
  
  return { htmlOutput, dataArray };
};