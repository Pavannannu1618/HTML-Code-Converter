import { applyPunctuation } from '../punctuationRules';

/**
 * Process MD Page Format
 * Row 1: Details
 * Row 2: Company Address
 * Row 3: Company Address
 */
export const processMDPageFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  for (let i = 0; i < lines.length; i += 3) {
    const details = lines[i] || '';
    const address1 = lines[i + 1] || '';
    const address2 = lines[i + 2] || '';
    
    const processedDetails = applyPunctuation(details, false, false);
    const processedAddress1 = applyPunctuation(address1, false, false);
    const processedAddress2 = applyPunctuation(address2, false, false);
    
    htmlOutput += `<doctypehtml${counter}>\n<html>\n<body>\n`;
    htmlOutput += processedDetails + '\n';
    htmlOutput += processedAddress1 + '\n';
    htmlOutput += processedAddress2 + '\n';
    htmlOutput += `</body>\n</html>\n`;
    
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'Details': processedDetails,
      'Address 1': processedAddress1,
      'Address 2': processedAddress2
    });
    
    counter++;
  }
  
  return { htmlOutput, dataArray };
};