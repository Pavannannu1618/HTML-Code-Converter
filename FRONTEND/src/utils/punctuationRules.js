/**
 * ============================================================================
 * SHARED PUNCTUATION RULES - ENHANCED VERSION
 * ============================================================================
 * 
 * Central location for all punctuation encoding logic
 * Used by ALL format processors
 * 
 * Features:
 * - Placeholder system (prevents double-encoding)
 * - Quote handling (&#ldquo; &#rdquo; and &#8216; &#8217;)
 * - Two modes: WithSpacing (for text) and NoSpacing (for links)
 * 
 * ============================================================================
 */

/**
 * Apply punctuation WITH spacing (for addresses, details, regular text)
 * 
 * @param {string} text - Input text
 * @returns {string} Processed text with HTML codes and proper spacing
 */
export const applyPunctuationWithSpacing = (text) => {
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
  result = result.replace(/\./g, '[[DOT]]');
  
  // Step 2: Replace placeholders with codes and spacing
  result = result.replace(/\[\[COLON\]\]/g, '&#58; ');      // AFTER SINGLE SPACE
  result = result.replace(/\[\[PLUS\]\]/g, ' &#43; ');      // ONE SPACE BEFORE AND AFTER
  result = result.replace(/\[\[HYPHEN\]\]/g, ' &#45; ');    // ONE SPACE BEFORE AND AFTER
  result = result.replace(/\[\[COMMA\]\]/g, '&#44; ');      // AFTER SINGLE SPACE
  result = result.replace(/\[\[SEMI\]\]/g, '&#59; ');       // AFTER SINGLE SPACE
  result = result.replace(/\[\[SLASH\]\]/g, '&#47;');       // NO SPACE
  result = result.replace(/\[\[BACK\]\]/g, '&#92;');        // NO SPACE
  result = result.replace(/\[\[LPAREN\]\]/g, ' &#40;');     // BEFORE SINGLE SPACE
  result = result.replace(/\[\[RPAREN\]\]/g, '&#41; ');     // AFTER SINGLE SPACE
  result = result.replace(/\[\[EXCLAIM\]\]/g, '&#33; ');    // AFTER SINGLE SPACE
  result = result.replace(/\[\[LESS\]\]/g, ' &#60;');       // BEFORE SINGLE SPACE
  result = result.replace(/\[\[GREATER\]\]/g, '&#62; ');    // AFTER SINGLE SPACE
  result = result.replace(/\[\[UNDER\]\]/g, '&#95;');       // NO SPACE
  result = result.replace(/\[\[DECIMAL\]\]/g, '&#69;');     // NO SPACE (Decimal)
  result = result.replace(/\[\[DOT\]\]/g, '&#8901; ');      // AFTER SINGLE SPACE (Dot)
  
  // Step 3: Clean multiple spaces
  result = result.replace(/\s+/g, ' ').trim();
  
  // Step 4: Handle quotes (convert to HTML codes with spacing)
  // Double quotes: &#ldquo; (left) &#rdquo; (right)
  // Single quotes: &#8216; (left) &#8217; (right)
  let isDoubleQuoteOpen = true;
  let isSingleQuoteOpen = true;
  let output = '';
  
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    
    if (char === '"') {
      // Double quote with spacing
      if (isDoubleQuoteOpen) {
        output += ' &#ldquo;'; // BEFORE SINGLE SPACE
      } else {
        output += '&#rdquo; '; // AFTER SINGLE SPACE
      }
      isDoubleQuoteOpen = !isDoubleQuoteOpen;
    } else if (char === "'") {
      // Single quote with spacing
      if (isSingleQuoteOpen) {
        output += ' &#8216;'; // BEFORE SINGLE SPACE
      } else {
        output += '&#8217; '; // AFTER SINGLE SPACE
      }
      isSingleQuoteOpen = !isSingleQuoteOpen;
    } else {
      output += char;
    }
  }
  
  return output.trim();
};

/**
 * Apply punctuation WITHOUT spacing (for links, websites)
 * 
 * @param {string} text - Input text
 * @returns {string} Processed text with HTML codes, NO SPACES
 */
export const applyPunctuationNoSpacing = (text) => {
  if (!text) return '';
  
  let result = text;
  
  // Remove CSV quotes if present
  result = result.replace(/^"/, '').replace(/"$/, '');
  
  // Un-escape CSV double quotes
  result = result.replace(/""/g, '"');
  
  // Remove ALL spaces (critical for links!)
  result = result.replace(/\s+/g, '');
  
  // Use placeholders to avoid double-encoding
  const replacements = [
    { char: ':', placeholder: '[[COLON]]', code: '&#58;' },
    { char: '+', placeholder: '[[PLUS]]', code: '&#43;' },
    { char: '-', placeholder: '[[HYPHEN]]', code: '&#45;' },
    { char: ',', placeholder: '[[COMMA]]', code: '&#44;' },
    { char: ';', placeholder: '[[SEMI]]', code: '&#59;' },
    { char: '/', placeholder: '[[SLASH]]', code: '&#47;' },
    { char: '\\', placeholder: '[[BACK]]', code: '&#92;' },
    { char: '(', placeholder: '[[LPAREN]]', code: '&#40;' },
    { char: ')', placeholder: '[[RPAREN]]', code: '&#41;' },
    { char: '!', placeholder: '[[EXCLAIM]]', code: '&#33;' },
    { char: '<', placeholder: '[[LESS]]', code: '&#60;' },
    { char: '>', placeholder: '[[GREATER]]', code: '&#62;' },
    { char: '_', placeholder: '[[UNDER]]', code: '&#95;' }
  ];
  
  // Step 1: Replace with placeholders
  replacements.forEach(item => {
    result = result.split(item.char).join(item.placeholder);
  });
  
  // Handle dots
  result = result.replace(/(\d)\.(\d)/g, '$1[[DECIMAL]]$2'); // Decimal
  result = result.replace(/\./g, '[[DOT]]');                 // Regular dot
  
  // Step 2: Replace placeholders with codes (NO SPACING)
  result = result.replace(/\[\[COLON\]\]/g, '&#58;');
  result = result.replace(/\[\[PLUS\]\]/g, '&#43;');
  result = result.replace(/\[\[HYPHEN\]\]/g, '&#45;');
  result = result.replace(/\[\[COMMA\]\]/g, '&#44;');
  result = result.replace(/\[\[SEMI\]\]/g, '&#59;');
  result = result.replace(/\[\[SLASH\]\]/g, '&#47;');
  result = result.replace(/\[\[BACK\]\]/g, '&#92;');
  result = result.replace(/\[\[LPAREN\]\]/g, '&#40;');
  result = result.replace(/\[\[RPAREN\]\]/g, '&#41;');
  result = result.replace(/\[\[EXCLAIM\]\]/g, '&#33;');
  result = result.replace(/\[\[LESS\]\]/g, '&#60;');
  result = result.replace(/\[\[GREATER\]\]/g, '&#62;');
  result = result.replace(/\[\[UNDER\]\]/g, '&#95;');
  result = result.replace(/\[\[DECIMAL\]\]/g, '&#69;');
  result = result.replace(/\[\[DOT\]\]/g, '&#8901;');
  
  // Step 3: Handle quotes (convert to HTML codes, NO SPACING)
  // Double quotes: &#ldquo; (left) &#rdquo; (right)
  // Single quotes: &#8216; (left) &#8217; (right)
  let isDoubleQuoteOpen = true;
  let isSingleQuoteOpen = true;
  let output = '';
  
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    
    if (char === '"') {
      // Double quote (no spacing for links)
      output += isDoubleQuoteOpen ? '&#ldquo;' : '&#rdquo;';
      isDoubleQuoteOpen = !isDoubleQuoteOpen;
    } else if (char === "'") {
      // Single quote (no spacing for links)
      output += isSingleQuoteOpen ? '&#8216;' : '&#8217;';
      isSingleQuoteOpen = !isSingleQuoteOpen;
    } else {
      output += char;
    }
  }
  
  return output;
};

/**
 * Generic function (backwards compatible with existing code)
 * 
 * @param {string} text - Input text
 * @param {boolean} isWebLink - If true, no spaces (for websites/links)
 * @param {boolean} addQuotes - If true, wrap in &ldquo; &rdquo;
 * @returns {string} Processed text with HTML codes
 */
export const applyPunctuation = (text, isWebLink = false, addQuotes = false) => {
  if (!text) return '';
  
  let result;
  
  if (isWebLink) {
    // Use no-spacing version for links
    result = applyPunctuationNoSpacing(text);
  } else {
    // Use with-spacing version for regular text
    result = applyPunctuationWithSpacing(text);
  }
  
  // Add quotes wrapper if requested (legacy feature)
  if (addQuotes) {
    result = ` &ldquo;${result}&rdquo; `;
  }
  
  return result;
};

/**
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 * 
 * // For addresses, details (WITH spacing):
 * import { applyPunctuationWithSpacing } from './punctuationRules';
 * const address = applyPunctuationWithSpacing("123 Main St, Suite 100");
 * // Result: "123 Main St&#44; Suite 100"
 * 
 * // For links, websites (NO spacing):
 * import { applyPunctuationNoSpacing } from './punctuationRules';
 * const link = applyPunctuationNoSpacing('<a href="http://example.com">');
 * // Result: "&#60;ahref=&#ldquo;http&#58;&#47;&#47;example&#8901;com&#rdquo;&#62;"
 * 
 * // Generic (backwards compatible):
 * import { applyPunctuation } from './punctuationRules';
 * const text1 = applyPunctuation("Address text", false);  // with spacing
 * const text2 = applyPunctuation("Link text", true);      // no spacing
 * 
 * ============================================================================
 */