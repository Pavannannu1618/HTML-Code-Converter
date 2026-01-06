import { applyPunctuation } from '../punctuationRules';

/**
 * Process Website Format
 * Row 1: Name
 * Row 2: Address (always add quotes)
 * Row 3: Name
 * Row 4: Website (no spaces in links)
 */
export const processWebsiteFormat = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  for (let i = 0; i < lines.length; i += 4) {
    const name1 = lines[i] || '';
    const address = lines[i + 1] || '';
    const name2 = lines[i + 2] || '';
    const website = lines[i + 3] || '';
    
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
  
  return { htmlOutput, dataArray };
};