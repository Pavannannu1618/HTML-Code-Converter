/**
 * ============================================================================
 * PUNCTUATION RULES - FINAL VERSION WITH ALL FIXES
 * ============================================================================
 * 
 * Features:
 * 1. Remove extra spaces before processing
 * 2. Dot after ANY punctuation = fullstop (&#39;) with DOUBLE space
 * 3. Dot after company-specific keywords = fullstop (&#39;) with DOUBLE space
 * 4. Always add spacing, even at end of line
 * 5. Smart quote handling with proper spacing
 * 6. FIX: Don't convert semicolons that are part of HTML entity codes
 * 7. FIX: Link fields detect fullstops after punctuation AND keywords
 * 
 * ============================================================================
 */

/**
 * COMPANY-SPECIFIC KEYWORDS (CASE-SENSITIVE!)
 */
const FULLSTOP_KEYWORDS = [
  'China', 'china', 'CHINA', 
  'BOX', 'Box', 'box', 
  'window', 'Window', 'WINDOW',
  'Google', 'google', 'GOOGLE', 
  'Microsoft', 'microsoft', 'MICROSOFT',
  'Amazon', 'amazon', 'AMAZON', 
  'Facebook', 'facebook', 'FACEBOOK',
  'Twitter', 'twitter', 'TWITTER', 
  'LinkedIn', 'linkedin', 'LINKEDIN',
  'Dia', 'dia', 'DIA', 
  'Villa', 'villa', 'VILLA', 
  'List', 'list', 'LIST',
  'This', 'this', 'THIS', 
  'Styles', 'styles', 'STYLES', 
  'File', 'file', 'FILE',
  'Document', 'document', 'DOCUMENT', 
  'GoogleeAccounts', 'googleaccounts', 'GOOGLEACCOUNTS',
  'Account', 'account', 'ACCOUNT', 
  'GoogleServices', 'googleservices', 'GOOGLESERVICES',
  'Services', 'services', 'SERVICES', 
  'Admin', 'admin', 'ADMIN', 
  'Console', 'console', 'CONSOLE',
  'Support', 'support', 'SUPPORT', 
  'Help', 'help', 'HELP', 
  'Center', 'center', 'CENTER', 
  'prototype', 'Prototype', 'PROTOTYPE',
  'Example', 'example', 'EXAMPLE', 
  'menu', 'Menu', 'MENU', 
  'button', 'Button', 'BUTTON',
  'click', 'Click', 'CLICK', 
  'select', 'Select', 'SELECT', 
  'option', 'Option', 'OPTION',
  'webcache', 'Webcache', 'WEBCACHE', 
  'available', 'Available', 'AVAILABLE', 
  'sit', 'Sit', 'SIT',
  'cool', 'Cool', 'COOL', 
  'tool', 'Tool', 'TOOL', 
  'page', 'Page', 'PAGE', 
  'Shenzhen', 'shenzhen', 'SHENZHEN',
  'mcafee', 'Mcafee', 'MCAFEE', 
  'lany', 'Lany', 'LANY', 
  'press', 'Press', 'PRESS',
  'release', 'Release', 'RELEASE', 
  'valley', 'Valley', 'VALLEY', 
  'rod', 'Rod', 'ROD', 
  'Cap', 'cap', 'CAP',
  'cloud', 'Cloud', 'CLOUD', 
  'Unavailable', 'unavailable', 'UNAVAILABLE', 
  'googleUsercontent', 'GoogleUsercontent', 'GOOGLEUSERCONTENT',
  'Road', 'road', 'ROAD', 
  'Slice', 'slice', 'SLICE', 
  'aparatus', 'Aparatus', 'APARATUS', 
  'apara', 'Apara', 'APARA', 
  'combined', 'Combined', 'COMBINED', 
  'comb', 'Comb', 'COMB',
  'configuration', 'Configuration', 'CONFIGURATION', 
  'thustonia', 'Thustonia', 'THUSTONIA', 
  'CORPORATION', 'Corporation', 'corporation', 
  'Incorporated', 'incorporated', 'INCORPORATED',
  'Limited', 'limited', 'LIMITED', 
  'technologies', 'Technologies', 'TECHNOLOGIES', 
  'technology', 'Technology', 'TECHNOLOGY', 
  'systems', 'Systems', 'SYSTEMS', 
  'system', 'System', 'SYSTEM',
  'solutions', 'Solutions', 'SOLUTIONS', 
  'solution', 'Solution', 'SOLUTION', 
  'international', 'International', 'INTERNATIONAL', 
  'internationally', 'Internationally', 'INTERNATIONALLY',
  'partners', 'Partners', 'PARTNERS', 
  'partner', 'Partner', 'PARTNER', 
  'associates', 'Associates', 'ASSOCIATES', 
  'associate', 'Associate', 'ASSOCIATE',
  'holdings', 'Holdings', 'HOLDINGS', 
  'holding', 'Holding', 'HOLDING', 
  'enterprises', 'Enterprises', 'ENTERPRISES', 
  'enterprise', 'Enterprise', 'ENTERPRISE',
  'ventures', 'Ventures', 'VENTURES', 
  'venture', 'Venture', 'VENTURE', 
  'global', 'Global', 'GLOBAL', 
  'globals', 'Globals', 'GLOBALS',
  'universal', 'Universal', 'UNIVERSAL', 
  'universally', 'Universally', 'UNIVERSALLY', 
  'networks', 'Networks', 'NETWORKS', 
  'network', 'Network', 'NETWORK', 
  'technologic', 'Technologic', 'TECHNOLOGIC', 
  'technologically', 'Technologically', 'TECHNOLOGICALLY',
  'Marketing', 'marketing', 'MARKETING',
  'new', 'New', 'NEW', 
  'old', 'Old', 'OLD',
  'next', 'Next', 'NEXT',
  'Promise', 'promise', 'PROMISE',
  'brothers', 'Brothers', 'BROTHERS',
  'brother', 'Brother', 'BROTHER'
  
  // Standard abbreviations commented out per user request
  // 'Inc', 'Ltd', 'Corp', 'Co', 'LLC', 'LLP', 'Pty', 'Assoc', 'Bros',
  // 'Ave', 'St', 'Rd', 'Dr', 'Blvd', 'Ln', 'Ct', 'Pl', 'Ste', 'Suite', 'Apt', 'Bldg', 'Fl', 'Floor',
  // 'Mr', 'Mrs', 'Ms', 'Miss', 'Prof', 'Sr', 'Jr', 'Esq',
  // 'Dept', 'Div', 'No', 'Vol', 'vs', 'etc', 'al', 'Fig', 'Ref', 'Est', 'Approx'
];

/**
 * Official 20 punctuation codes (semicolon handled separately)
 */
const PUNCTUATION_MAP = [
  { char: '.', code: '&#8901;', spacing: 'after' },
  { char: ',', code: '&#44;', spacing: 'after' },
  // semicolon handled separately to avoid HTML entity conflicts
  { char: ':', code: '&#58;', spacing: 'after' },
  { char: '-', code: '&#45;', spacing: 'both' },
  { char: '/', code: '&#47;', spacing: 'none' },
  { char: '\\', code: '&#92;', spacing: 'none' },
  { char: '(', code: '&#40;', spacing: 'before' },
  { char: ')', code: '&#41;', spacing: 'after' },
  { char: '!', code: '&#33;', spacing: 'after' },
  { char: '+', code: '&#43;', spacing: 'both' },
  { char: '<', code: '&#60;', spacing: 'before' },
  { char: '>', code: '&#62;', spacing: 'after' },
  { char: '_', code: '&#95;', spacing: 'none' }
];

/**
 * Escape regex special characters
 */
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Main processing function with spacing
 */
export const applyPunctuationWithSpacing = (text) => {
  if (!text) return '';
  
  let result = text.trim();
  
  // STEP 1: Clean extra spaces
  result = result.replace(/\s+([,;:!.)\]}>?])/g, '$1');
  result = result.replace(/\s{2,}/g, ' ');
  
  // STEP 2: Detect and mark fullstop conditions BEFORE any replacements
  
  // 2a. Handle double dots (..) FIRST (highest priority)
  
  // Check if keyword followed by .. → both become fullstops
  FULLSTOP_KEYWORDS.forEach(keyword => {
    const keywordDoubleDot = new RegExp(`\\b${escapeRegex(keyword)}\\.\\.`, 'g');
    result = result.replace(keywordDoubleDot, `${keyword}🔴FULLSTOP🔴🔴FULLSTOP🔴`);
  });
  
  // Check if punctuation followed by .. → both become fullstops
  const punctDoubleDot = /([,;:!)\]}>?\-\+\(\[\{<~`@#$%^&*=|\\\/])\.\./g;
  result = result.replace(punctDoubleDot, '$1🔴FULLSTOP🔴🔴FULLSTOP🔴');
  
  // Regular double dots (no entity before) → first is dot, second is fullstop
  result = result.replace(/\.\./g, '🟢DOT🟢🔴FULLSTOP🔴');
  
  // 2b. Mark dot after ANY single punctuation as fullstop
  const punctAfterDot = /([,;:!)\]}>?\-\+\(\[\{<~`@#$%^&*=|\\\/])\./g;
  result = result.replace(punctAfterDot, '$1🔴FULLSTOP🔴');
  
  // 2c. Mark dot after company keywords as fullstop (case-sensitive)
  FULLSTOP_KEYWORDS.forEach(keyword => {
    const keywordPattern = new RegExp(`\\b${escapeRegex(keyword)}\\.`, 'g');
    result = result.replace(keywordPattern, `${keyword}🔴FULLSTOP🔴`);
  });
  
  // 2d. Mark decimals (digit.digit)
  result = result.replace(/(\d)\.(\d)/g, '$1🔵DECIMAL🔵$2');
  
  // 2e. Remaining dots are regular dots
  result = result.replace(/\./g, '🟢DOT🟢');
  
  // STEP 3: Replace punctuation with codes (EXCEPT semicolon and dot)
  PUNCTUATION_MAP.forEach(item => {
    if (item.char !== '.') { // Dot already handled
      const escaped = escapeRegex(item.char);
      result = result.replace(new RegExp(escaped, 'g'), item.code);
    }
  });
  
  // Replace dot markers with codes
  result = result.replace(/🔴FULLSTOP🔴/g, '&#39;');
  result = result.replace(/🔵DECIMAL🔵/g, '&#69;');
  result = result.replace(/🟢DOT🟢/g, '&#8901;');
  
  // NOW handle semicolons AFTER all HTML entity codes are in place
  // Only convert standalone semicolons, not those in HTML entities (&#44;, &#39;, etc.)
  result = result.replace(/;/g, (match, offset, string) => {
    // Check if this semicolon is part of an HTML entity
    // Look back up to 10 characters
    const lookback = string.substring(Math.max(0, offset - 10), offset);
    
    // If we find &#digits before this semicolon, it's part of an entity
    if (/&#\d+$/.test(lookback)) {
      return ';'; // Keep it as-is
    }
    
    // If we find &word before this semicolon, it's part of a named entity
    if (/&[a-z]+$/i.test(lookback)) {
      return ';'; // Keep it as-is
    }
    
    // Otherwise, convert it
    return '&#59;';
  });
  
  // STEP 4: Add spacing
  PUNCTUATION_MAP.forEach(item => {
    const code = escapeRegex(item.code);
    
    switch (item.spacing) {
      case 'after':
        result = result.replace(new RegExp(`${code}(?! )`, 'g'), `${item.code} `);
        break;
      case 'before':
        result = result.replace(new RegExp(`(?<! )${code}`, 'g'), ` ${item.code}`);
        break;
      case 'both':
        result = result.replace(new RegExp(`(?<! )${code}(?! )`, 'g'), ` ${item.code} `);
        result = result.replace(new RegExp(`(?<! )${code} `, 'g'), ` ${item.code} `);
        result = result.replace(new RegExp(` ${code}(?! )`, 'g'), ` ${item.code} `);
        break;
    }
  });
  
  // Add spacing for dot codes
  result = result.replace(/&#8901;(?! )/g, '&#8901; ');
  
  // Add DOUBLE spacing for fullstop
  result = result.replace(/&#39;(?!  )/g, '&#39;  ');
  
  // Add spacing for semicolon code (after it's been converted)
  result = result.replace(/&#59;(?! )/g, '&#59; ');
  
  // STEP 5: Handle quotes
  let isSingleQuoteOpen = true;
  let isDoubleQuoteOpen = true;
  let output = '';
  
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    const nextChar = i < result.length - 1 ? result[i + 1] : '';
    
    if (char === "'") {
      if (isSingleQuoteOpen) {
        // Left single quote - check if we need space before
        const needsSpaceBefore = output.length > 0 && 
                                 !output.endsWith(' ') && 
                                 !output.endsWith(';');
        
        if (needsSpaceBefore && output.length > 0) {
          if (/;$/.test(output)) {
            output += ' ';
          } else if (!/ $/.test(output)) {
            output += ' ';
          }
        }
        output += '&lsquo;';
      } else {
        // Right single quote - always add space after
        output += '&rsquo;';
        if (nextChar !== ' ' && nextChar !== '') {
          output += ' ';
        }
      }
      isSingleQuoteOpen = !isSingleQuoteOpen;
    } else if (char === '"') {
      if (isDoubleQuoteOpen) {
        // Left double quote - check if we need space before
        const needsSpaceBefore = output.length > 0 && !output.endsWith(' ');
        
        if (needsSpaceBefore) {
          output += ' ';
        }
        output += '&ldquo;';
      } else {
        // Right double quote - always add space after
        output += '&rdquo;';
        if (nextChar !== ' ' && nextChar !== '') {
          output += ' ';
        }
      }
      isDoubleQuoteOpen = !isDoubleQuoteOpen;
    } else {
      output += char;
    }
  }
  
  // Clean up multiple spaces (preserve double after fullstop)
  output = output.replace(/\s{3,}/g, '  ');
  
  return output;
};

/**
 * Processing function without spacing (for link fields)
 * 
 * CRITICAL FIX: Even in no-spacing mode, we MUST detect fullstops:
 * 1. Dot after ANY punctuation (including _) = fullstop
 * 2. Dot after keywords = fullstop
 * Then remove all spaces after processing.
 */
export const applyPunctuationNoSpacing = (text) => {
  if (!text) return '';
  
  let result = text.trim();
  
  // STEP 1: Detect fullstops BEFORE removing spaces
  
  // 1a. Mark dot after ANY punctuation as fullstop (including underscore)
  const punctAfterDot = /([,;:!)\]}>?\-\+\(\[\{<~`@#$%^&*=|\\\/\_])\./g;
  result = result.replace(punctAfterDot, '$1🔴FULLSTOP🔴');
  
  // 1b. Mark dot after keywords as fullstop (case-sensitive)
  FULLSTOP_KEYWORDS.forEach(keyword => {
    const keywordPattern = new RegExp(`\\b${escapeRegex(keyword)}\\.`, 'g');
    result = result.replace(keywordPattern, `${keyword}🔴FULLSTOP🔴`);
  });
  
  // 1c. Remaining dots are regular dots
  result = result.replace(/\./g, '🟢DOT🟢');
  
  // STEP 2: NOW remove all spaces
  result = result.replace(/\s+/g, '');
  
  // STEP 3: Replace punctuation with codes
  PUNCTUATION_MAP.forEach(item => {
    if (item.char !== '.') {
      const escaped = escapeRegex(item.char);
      result = result.replace(new RegExp(escaped, 'g'), item.code);
    }
  });
  
  // STEP 4: Replace dot markers with codes (NO SPACING in link mode)
  result = result.replace(/🔴FULLSTOP🔴/g, '&#39;');
  result = result.replace(/🟢DOT🟢/g, '&#8901;');
  
  // STEP 5: Handle semicolons (protect HTML entities)
  result = result.replace(/;/g, (match, offset, string) => {
    const lookback = string.substring(Math.max(0, offset - 10), offset);
    if (/&#\d+$/.test(lookback) || /&[a-z]+$/i.test(lookback)) {
      return ';';
    }
    return '&#59;';
  });
  
  // STEP 6: Handle quotes (no spacing)
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
 * Generic wrapper (backwards compatible)
 */
export const applyPunctuation = (text, isWebLink = false, addQuotes = false) => {
  if (isWebLink) {
    return applyPunctuationNoSpacing(text);
  } else {
    return applyPunctuationWithSpacing(text);
  }
};