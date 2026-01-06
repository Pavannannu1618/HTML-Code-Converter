/**
 * Apply HTML punctuation codes to text
 * @param {string} text - Input text
 * @param {boolean} isWebLink - If true, don't add spaces in links
 * @param {boolean} addQuotes - If true, wrap in &ldquo; &rdquo;
 * @returns {string} Processed text with HTML codes
 */
export const applyPunctuation = (text, isWebLink = false, addQuotes = false) => {
  if (!text) return '';
  
  let result = text;
  
  // Clean spaces
  result = result.replace(/\s+/g, ' ').trim();
  
  // Remove CSV quotes if present
  result = result.replace(/^"/, '').replace(/"$/, '');
  
  // Use placeholders to avoid double-encoding
  // NOTE: & (ampersand) is NOT replaced - left as is per user requirement
  const replacements = [
    { char: ':', placeholder: '[[COLON]]', code: '&#58;', spacing: 'after' },
    { char: '+', placeholder: '[[PLUS]]', code: '&#43;', spacing: 'both' },
    { char: '-', placeholder: '[[HYPHEN]]', code: '&#45;', spacing: 'both' },
    { char: ',', placeholder: '[[COMMA]]', code: '&#44;', spacing: 'after' },
    { char: ';', placeholder: '[[SEMI]]', code: '&#59;', spacing: 'after' },
    { char: '/', placeholder: '[[SLASH]]', code: '&#47;', spacing: 'none' },
    { char: '\\', placeholder: '[[BACK]]', code: '&#92;', spacing: 'none' },
    { char: '(', placeholder: '[[LPAREN]]', code: '&#40;', spacing: 'before' },
    { char: ')', placeholder: '[[RPAREN]]', code: '&#41;', spacing: 'after' },
    { char: '!', placeholder: '[[EXCLAIM]]', code: '&#33;', spacing: 'after' },
    { char: '<', placeholder: '[[LESS]]', code: '&#60;', spacing: 'before' },
    { char: '>', placeholder: '[[GREATER]]', code: '&#62;', spacing: 'after' },
    { char: '_', placeholder: '[[UNDER]]', code: '&#95;', spacing: 'none' }
  ];
  
  // Step 1: Replace with placeholders
  replacements.forEach(item => {
    result = result.split(item.char).join(item.placeholder);
  });
  
  // Handle dots (decimal vs dot)
  // Decimal: between numbers
  result = result.replace(/(\d)\.(\d)/g, '$1[[DECIMAL]]$2');
  
  // All other dots = &#8901; (dot code)
  // User will manually change to &#39; (fullstop) if needed
  if (isWebLink) {
    result = result.replace(/\./g, '[[DOT]]');
  } else {
    result = result.replace(/\./g, '[[DOT]]');
  }
  
  // Step 2: Replace placeholders with codes and spacing
  result = result.replace(/\[\[COLON\]\]/g, '&#58; ');
  result = result.replace(/\[\[PLUS\]\]/g, ' &#43; ');
  result = result.replace(/\[\[HYPHEN\]\]/g, ' &#45; ');
  result = result.replace(/\[\[COMMA\]\]/g, '&#44; ');
  result = result.replace(/\[\[SEMI\]\]/g, '&#59; ');
  result = result.replace(/\[\[SLASH\]\]/g, '&#47;');
  result = result.replace(/\[\[BACK\]\]/g, '&#92;');
  result = result.replace(/\[\[LPAREN\]\]/g, ' &#40;');
  result = result.replace(/\[\[RPAREN\]\]/g, '&#41; ');
  result = result.replace(/\[\[EXCLAIM\]\]/g, '&#33; ');
  result = result.replace(/\[\[LESS\]\]/g, ' &#60;');
  result = result.replace(/\[\[GREATER\]\]/g, '&#62; ');
  result = result.replace(/\[\[UNDER\]\]/g, '&#95;');
  result = result.replace(/\[\[DECIMAL\]\]/g, '&#69;');
  result = result.replace(/\[\[DOT\]\]/g, '&#8901; ');
  
  // Clean multiple spaces
  result = result.replace(/\s+/g, ' ').trim();
  
  // Add quotes if needed
  if (addQuotes) {
    result = ` &ldquo;${result}&rdquo; `;
  }
  
  return result;
};