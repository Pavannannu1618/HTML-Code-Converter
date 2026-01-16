/**
 * ============================================================================
 * SHARED PUNCTUATION RULES - OFFICIAL 20 CODES
 * ============================================================================
 * 
 * These are the ONLY 20 codes to use. No additional codes!
 * 
 * ============================================================================
 */

/**
 * Official 20 punctuation codes with spacing rules
 */
const PUNCTUATION_MAP = [
  // Code 1: Dot • (&#8901;) - AFTER SINGLE SPACE
  { char: '.', code: '&#8901;', spacing: 'after', isDecimal: false },
  
  // Code 2: Decimal • (&#69;) - NO SPACE (handled separately)
  // This is for dots between numbers like 3.14
  
  // Code 3: Fullstop • (&#39;) - AFTER DOUBLE SPACE
  // NOTE: Not used in conversion - user will manually change if needed
  
  // Code 4: Comma (&#44;) - AFTER SINGLE SPACE
  { char: ',', code: '&#44;', spacing: 'after' },
  
  // Code 5: Semicolon (&#59;) - AFTER SINGLE SPACE
  { char: ';', code: '&#59;', spacing: 'after' },
  
  // Code 6: Colon (&#58;) - AFTER SINGLE SPACE
  { char: ':', code: '&#58;', spacing: 'after' },
  
  // Code 7: Hyphen (&#45;) - ONE SPACE BEFORE AND AFTER
  { char: '-', code: '&#45;', spacing: 'both' },
  
  // Code 8: Forward Slash (&#47;) - NO SPACE
  { char: '/', code: '&#47;', spacing: 'none' },
  
  // Code 9: Back Slash (&#92;) - NO SPACE
  { char: '\\', code: '&#92;', spacing: 'none' },
  
  // Code 10: Left Parenthesis (&#40;) - BEFORE SINGLE SPACE
  { char: '(', code: '&#40;', spacing: 'before' },
  
  // Code 11: Right Parenthesis (&#41;) - AFTER SINGLE SPACE
  { char: ')', code: '&#41;', spacing: 'after' },
  
  // Code 12: Left Single Quote (&#8216;) - BEFORE SINGLE SPACE
  // Handled separately with alternating logic
  
  // Code 13: Right Single Quote (&#8217;) - AFTER SINGLE SPACE
  // Handled separately with alternating logic
  
  // Code 14: Left Double Quote (&ldquo;) - BEFORE SINGLE SPACE
  // Handled separately with alternating logic
  
  // Code 15: Right Double Quote (&rdquo;) - AFTER SINGLE SPACE
  // Handled separately with alternating logic
  
  // Code 16: Exclamation (&#33;) - AFTER SINGLE SPACE
  { char: '!', code: '&#33;', spacing: 'after' },
  
  // Code 17: Plus sign (&#43;) - ONE SPACE BEFORE AND AFTER
  { char: '+', code: '&#43;', spacing: 'both' },
  
  // Code 18: Less than sign (&#60;) - BEFORE SINGLE SPACE
  { char: '<', code: '&#60;', spacing: 'before' },
  
  // Code 19: Greater than sign (&#62;) - AFTER SINGLE SPACE
  { char: '>', code: '&#62;', spacing: 'after' },
  
  // Code 20: Underscore (&#95;) - NO SPACE
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
  
  // Step 1: Replace with placeholders to avoid conflicts
  PUNCTUATION_MAP.forEach((item, index) => {
    result = result.split(item.char).join(`[[P${index}]]`);
  });
  
  // Step 2: Handle dots - decimal vs regular
  // Decimal: digit.digit → &#69; (NO SPACE)
  result = result.replace(/(\d)\[\[P0\]\](\d)/g, '$1[[DECIMAL]]$2');
  // Regular dot: → &#8901; (AFTER SINGLE SPACE)
  result = result.replace(/\[\[P0\]\]/g, '[[DOT]]');
  
  // Step 3: Replace placeholders with codes (without adding spaces yet)
  PUNCTUATION_MAP.forEach((item, index) => {
    const placeholder = `[[P${index}]]`;
    result = result.split(placeholder).join(item.code);
  });
  
  result = result.replace(/\[\[DECIMAL\]\]/g, '&#69;');
  result = result.replace(/\[\[DOT\]\]/g, '&#8901;');
  
  // Step 4: Add spacing intelligently (only where spaces don't exist)
  PUNCTUATION_MAP.forEach((item) => {
    const code = escapeRegex(item.code);
    
    switch (item.spacing) {
      case 'after':
        // Add space after code only if next char is not already a space
        result = result.replace(new RegExp(`${code}(?! )`, 'g'), `${item.code} `);
        break;
      case 'before':
        // Add space before code only if prev char is not already a space
        result = result.replace(new RegExp(`(?<! )${code}`, 'g'), ` ${item.code}`);
        break;
      case 'both':
        // Add spaces on both sides only where they don't exist
        result = result.replace(new RegExp(`(?<! )${code}(?! )`, 'g'), ` ${item.code} `);
        result = result.replace(new RegExp(`(?<! )${code} `, 'g'), ` ${item.code} `);
        result = result.replace(new RegExp(` ${code}(?! )`, 'g'), ` ${item.code} `);
        break;
    }
  });
  
  // Add space after dot code only if not already present
  result = result.replace(/&#8901;(?! )/g, '&#8901; ');
  
  // Step 5: Clean multiple spaces (but preserve single spaces)
  result = result.replace(/\s{2,}/g, ' ').trim();
  
  // Step 6: Handle quotes with alternating left/right and smart spacing
  // Single quotes: &lsquo; (left) and &rsquo; (right)
  // Double quotes: &ldquo; (left) and &rdquo; (right)
  let isSingleQuoteOpen = true;
  let isDoubleQuoteOpen = true;
  let output = '';
  
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    const prevChar = i > 0 ? result[i - 1] : '';
    const nextChar = i < result.length - 1 ? result[i + 1] : '';
    
    if (char === "'") {
      // Single quote - alternating left/right
      if (isSingleQuoteOpen) {
        // Left single quote - BEFORE SINGLE SPACE
        output += (prevChar && prevChar !== ' ' ? ' ' : '') + '&lsquo;';
      } else {
        // Right single quote - AFTER SINGLE SPACE
        output += '&rsquo;' + (nextChar && nextChar !== ' ' ? ' ' : '');
      }
      isSingleQuoteOpen = !isSingleQuoteOpen;
    } else if (char === '"') {
      // Double quote - alternating left/right
      if (isDoubleQuoteOpen) {
        // Left double quote - BEFORE SINGLE SPACE
        output += (prevChar && prevChar !== ' ' ? ' ' : '') + '&ldquo;';
      } else {
        // Right double quote - AFTER SINGLE SPACE
        output += '&rdquo;' + (nextChar && nextChar !== ' ' ? ' ' : '');
      }
      isDoubleQuoteOpen = !isDoubleQuoteOpen;
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
  
  // Remove ALL spaces
  result = result.replace(/\s+/g, '');
  
  // Step 1: Replace with placeholders
  PUNCTUATION_MAP.forEach((item, index) => {
    result = result.split(item.char).join(`[[P${index}]]`);
  });
  
  // Step 2: Handle dots
  result = result.replace(/(\d)\[\[P0\]\](\d)/g, '$1[[DECIMAL]]$2');
  result = result.replace(/\[\[P0\]\]/g, '[[DOT]]');
  
  // Step 3: Replace placeholders with codes (NO spacing)
  PUNCTUATION_MAP.forEach((item, index) => {
    result = result.split(`[[P${index}]]`).join(item.code);
  });
  
  result = result.replace(/\[\[DECIMAL\]\]/g, '&#69;');
  result = result.replace(/\[\[DOT\]\]/g, '&#8901;');
  
  // Step 4: Handle quotes (no spacing)
  let isSingleQuoteOpen = true;
  let isDoubleQuoteOpen = true;
  let output = '';
  
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    
    if (char === "'") {
      output += isSingleQuoteOpen ? '&lsquo;' : '&rsquo;';
      isSingleQuoteOpen = !isSingleQuoteOpen;
    } else if (char === '"') {
      output += isDoubleQuoteOpen ? '&ldquo;' : '&rdquo;';
      isDoubleQuoteOpen = !isDoubleQuoteOpen;
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
 * OFFICIAL 20 PUNCTUATION CODES SUMMARY
 * ============================================================================
 * 
 * 1.  Dot: . → &#8901; (after single space)
 * 2.  Decimal: . → &#69; (no space) - between numbers only
 * 3.  Fullstop: . → &#39; (after double space) - NOT AUTO-CONVERTED
 * 4.  Comma: , → &#44; (after single space)
 * 5.  Semicolon: ; → &#59; (after single space)
 * 6.  Colon: : → &#58; (after single space)
 * 7.  Hyphen: - → &#45; (one space before and after)
 * 8.  Forward Slash: / → &#47; (no space)
 * 9.  Back Slash: \ → &#92; (no space)
 * 10. Left Parenthesis: ( → &#40; (before single space)
 * 11. Right Parenthesis: ) → &#41; (after single space)
 * 12. Left Single Quote: ' → &lsquo; (before single space)
 * 13. Right Single Quote: ' → &rsquo; (after single space)
 * 14. Left Double Quote: " → &ldquo; (before single space)
 * 15. Right Double Quote: " → &rdquo; (after single space)
 * 16. Exclamation: ! → &#33; (after single space)
 * 17. Plus sign: + → &#43; (one space before and after)
 * 18. Less than sign: < → &#60; (before single space)
 * 19. Greater than sign: > → &#62; (after single space)
 * 20. Underscore: _ → &#95; (no space)
 * 
 * ============================================================================
 */