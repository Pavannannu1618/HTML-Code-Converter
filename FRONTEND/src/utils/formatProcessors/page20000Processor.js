import { applyPunctuation } from '../punctuationRules';

/**
 * Process 20000 Page Format
 * Row 1: Details
 * Row 2: Link (no spaces in link)
 * Row 3: Address
 */
export const processPage20000Format = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  for (let i = 0; i < lines.length; i += 3) {
    const details = lines[i] || '';
    const link = lines[i + 1] || '';
    const address = lines[i + 2] || '';
    
    // Remove spaces from link
    const cleanLink = link.replace(/\s+/g, '');
    
    const processedDetails = applyPunctuation(details, false, false);
    const processedLink = applyPunctuation(cleanLink, true, false);
    const processedAddress = applyPunctuation(address, false, false);
    
    htmlOutput += `<doctypehtml${counter}>\n<html>\n<body>\n`;
    htmlOutput += processedDetails + '\n';
    htmlOutput += processedLink + '\n';
    htmlOutput += processedAddress + '\n';
    htmlOutput += `</body>\n</html>\n`;
    
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'Details': processedDetails,
      'Link': processedLink,
      'Address': processedAddress
    });
    
    counter++;
  }
  
  return { htmlOutput, dataArray };
};
