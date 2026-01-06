import { applyPunctuation } from '../punctuationRules';

/**
 * Process AD Page Format
 * Row 1: Company Name
 * Row 2: Company Address
 * Row 3: Link (no spaces in link)
 */
export const processADPageFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  for (let i = 0; i < lines.length; i += 3) {
    const name = lines[i] || '';
    const address = lines[i + 1] || '';
    const link = lines[i + 2] || '';
    
    // Remove spaces from link
    const cleanLink = link.replace(/\s+/g, '');
    
    const processedName = applyPunctuation(name, false, false);
    const processedAddress = applyPunctuation(address, false, false);
    const processedLink = applyPunctuation(cleanLink, true, false);
    
    htmlOutput += `<doctypehtml${counter}>\n<html>\n<body>\n`;
    htmlOutput += processedName + '\n';
    htmlOutput += processedAddress + '\n';
    htmlOutput += processedLink + '\n';
    htmlOutput += `</body>\n</html>\n`;
    
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'Company Name': processedName,
      'Address': processedAddress,
      'Link': processedLink
    });
    
    counter++;
  }
  
  return { htmlOutput, dataArray };
};
