import { applyPunctuation } from '../punctuationRules';

/**
 * Process 40000 Page Format
 * Row 1: Details
 * Row 2: Details
 * Row 3: Link (no spaces in link)
 */
export const processPage40000Format = (lines) => {
  let htmlOutput = '';
  let dataArray = [];
  let counter = 1;

  for (let i = 0; i < lines.length; i += 3) {
    const details1 = lines[i] || '';
    const details2 = lines[i + 1] || '';
    const link = lines[i + 2] || '';
    
    // Remove spaces from link
    const cleanLink = link.replace(/\s+/g, '');
    
    const processedDetails1 = applyPunctuation(details1, false, false);
    const processedDetails2 = applyPunctuation(details2, false, false);
    const processedLink = applyPunctuation(cleanLink, true, false);
    
    htmlOutput += `<doctypehtml${counter}>\n<html>\n<body>\n`;
    htmlOutput += processedDetails1 + '\n';
    htmlOutput += processedDetails2 + '\n';
    htmlOutput += processedLink + '\n';
    htmlOutput += `</body>\n</html>\n`;
    
    dataArray.push({
      'HTML Tag': `doctypehtml${counter}`,
      'Details 1': processedDetails1,
      'Details 2': processedDetails2,
      'Link': processedLink
    });
    
    counter++;
  }
  
  return { htmlOutput, dataArray };
};