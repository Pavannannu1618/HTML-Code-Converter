/**
 * ============================================================================
 * SHARED PUNCTUATION RULES
 * ============================================================================
 * 
 * Central location for all punctuation encoding logic
 * Uses placeholder system to prevent double-encoding
 * 
 * Used by ALL format processors:
 * - Book Page, 2 Rows, 4 Rows, Website, 20000 Page, MD Page, 40000 Page, AD Page
 * 
 * ============================================================================
 */

/**
 * Punctuation map - all 13 special characters
 */
const PUNCTUATION_MAP = [
  { char: ':', code: '&#58;', spacing: 'after' },
  { char: '+', code: '&#43;', spacing: 'both' },
  { char: '-', code: '&#45;', spacing: 'both' },
  { char: ',', code: '&#44;', spacing: 'after' },
  { char: ';', code: '&#59;', spacing: 'after' },
  { char: '/', code: '&#47;', spacing: 'none' },
  { char: '\\', code: '&#92;', spacing: 'none' },
  { char: '(', code: '&#40;', spacing: 'before' },
  { char: ')', code: '&#41;', spacing: 'after' },
  { char: '!', code: '&#33;', spacing: 'after' },
  { char: '<', code: '&#60;', spacing: 'before' },
  { char: '>', code: '&#62;', spacing: 'after' },
  { char: '_', code: '&#95;', spacing: 'none' }
];

/**
 * Escape special regex characters in a string
 */
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Apply punctuation with spacing (for addresses, details, etc.)
 * 
 * @param {string} text - Text to process
 * @returns {string} - Processed text with HTML codes and spacing
 */
export const applyPunctuationWithSpacing = (text) => {
  if (!text) return '';
  
  let result = text.trim();
  
  // Step 1: Replace with placeholders
  PUNCTUATION_MAP.forEach((item, index) => {
    result = result.split(item.char).join(`[[P${index}]]`);
  });
  
  // Step 2: Handle dots
  result = result.replace(/(\d)\.(\d)/g, '$1[[DECIMAL]]$2'); // Decimal
  result = result.replace(/\./g, '[[DOT]]'); // Regular dot
  
  // Step 3: Replace placeholders with codes (without adding spaces yet)
  PUNCTUATION_MAP.forEach((item, index) => {
    const placeholder = `[[P${index}]]`;
    result = result.split(placeholder).join(item.code);
  });
  
  result = result.replace(/\[\[DECIMAL\]\]/g, '&#69;');
  result = result.replace(/\[\[DOT\]\]/g, '&#8901;');
  
  // Step 3.5: Add spacing intelligently (only where spaces don't exist)
  PUNCTUATION_MAP.forEach((item) => {
    const code = item.code;
    
    switch (item.spacing) {
      case 'after':
        // Add space after code only if next char is not already a space
        result = result.replace(new RegExp(`${escapeRegex(code)}(?! )`, 'g'), `${code} `);
        break;
      case 'before':
        // Add space before code only if prev char is not already a space
        result = result.replace(new RegExp(`(?<! )${escapeRegex(code)}`, 'g'), ` ${code}`);
        break;
      case 'both':
        // Add spaces on both sides only where they don't exist
        result = result.replace(new RegExp(`(?<! )${escapeRegex(code)}(?! )`, 'g'), ` ${code} `);
        result = result.replace(new RegExp(`(?<! )${escapeRegex(code)} `, 'g'), ` ${code} `);
        result = result.replace(new RegExp(` ${escapeRegex(code)}(?! )`, 'g'), ` ${code} `);
        break;
    }
  });
  
  // Add space after dot code only if not already present
  result = result.replace(/&#8901;(?! )/g, '&#8901; ');
  
  // Step 4: Clean multiple spaces (but preserve single spaces)
  result = result.replace(/\s{2,}/g, ' ').trim();
  
  // Step 5: Convert quotes to HTML codes (with smart spacing)
  // Double quotes: &#ldquo; (left) and &#rdquo; (right)
  // Single quotes: &#8216; (left) and &#8217; (right)
  let isDoubleQuoteOpen = true;
  let isSingleQuoteOpen = true;
  let output = '';
  
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    const prevChar = i > 0 ? result[i - 1] : '';
    const nextChar = i < result.length - 1 ? result[i + 1] : '';
    
    if (char === '"') {
      // Double quote with smart spacing
      if (isDoubleQuoteOpen) {
        // Opening quote: add space before only if prev char is not a space
        output += (prevChar && prevChar !== ' ' ? ' ' : '') + '&ldquo;';
      } else {
        // Closing quote: add space after only if next char is not a space
        output += '&rdquo;' + (nextChar && nextChar !== ' ' ? ' ' : '');
      }
      isDoubleQuoteOpen = !isDoubleQuoteOpen;
    } else if (char === "'") {
      // Single quote with smart spacing
      if (isSingleQuoteOpen) {
        // Opening quote: add space before only if prev char is not a space
        output += (prevChar && prevChar !== ' ' ? ' ' : '') + '&lsquo;';
      } else {
        // Closing quote: add space after only if next char is not a space
        output += '&rsquo;' + (nextChar && nextChar !== ' ' ? ' ' : '');
      }
      isSingleQuoteOpen = !isSingleQuoteOpen;
    } else {
      output += char;
    }
  }
  
  // Final cleanup: remove any double spaces that might have been created
  output = output.replace(/\s{2,}/g, ' ').trim();
  
  return output;
};

/**
 * Apply punctuation without spacing (for links)
 * 
 * @param {string} text - Text to process
 * @returns {string} - Processed text with HTML codes, no spaces
 */
export const applyPunctuationNoSpacing = (text) => {
  if (!text) return '';
  
  let result = text.trim();
  
  // Step 1: Un-escape CSV quotes
  result = result.replace(/""/g, '"');
  
  // Step 2: Remove ALL spaces
  result = result.replace(/\s+/g, '');
  
  // Step 3: Replace with placeholders
  PUNCTUATION_MAP.forEach((item, index) => {
    result = result.split(item.char).join(`[[P${index}]]`);
  });
  
  // Step 4: Handle dots
  result = result.replace(/(\d)\.(\d)/g, '$1[[DECIMAL]]$2');
  result = result.replace(/\./g, '[[DOT]]');
  
  // Step 5: Replace placeholders with codes (NO spacing)
  PUNCTUATION_MAP.forEach((item, index) => {
    result = result.split(`[[P${index}]]`).join(item.code);
  });
  
  result = result.replace(/\[\[DECIMAL\]\]/g, '&#69;');
  result = result.replace(/\[\[DOT\]\]/g, '&#8901;');
  
  // Step 6: Convert quotes to HTML codes
  // Double quotes: &#ldquo; (left/opening) and &#rdquo; (right/closing)
  // Single quotes: &#8216; (left/opening) and &#8217; (right/closing)
  let isDoubleQuoteOpen = true; // Start with opening quote
  let isSingleQuoteOpen = true; // Start with opening quote
  let output = '';
  
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    
    if (char === '"') {
      // Double quote
      output += isDoubleQuoteOpen ? '&ldquo;' : '&rdquo;';
      isDoubleQuoteOpen = !isDoubleQuoteOpen;
    } else if (char === "'") {
      // Single quote
      output += isSingleQuoteOpen ? '&lsquo;' :'&rsquo;';
      isSingleQuoteOpen = !isSingleQuoteOpen;
    } else {
      output += char;
    }
  }
  
  return output;
};

/**
 * Generic function (backwards compatible)
 * 
 * @param {string} text - Text to process
 * @param {boolean} isWebLink - If true, removes spaces
 * @param {boolean} addQuotes - Not used (kept for compatibility)
 * @returns {string} - Processed text
 */
export const applyPunctuation = (text, isWebLink = false, addQuotes = false) => {
  if (isWebLink) {
    return applyPunctuationNoSpacing(text);
  } else {
    return applyPunctuationWithSpacing(text);
  }
};

/**
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 * 
 * // For addresses, details (with spacing):
 * import { applyPunctuationWithSpacing } from './punctuationRules';
 * const address = applyPunctuationWithSpacing("123 Main St.");
 * // Result: "123 Main St&#8901; "
 * 
 * // For links (no spacing):
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