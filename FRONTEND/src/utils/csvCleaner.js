export const cleanExcelMetadata = (text) => {
if (!text) return text;
  
  // Pattern 1: Remove Excel cell reference patterns
  // Matches: A157A1A101, A157A1A101:A169A101, etc.
  text = text.replace(/[A-Z]\d+A\d+A\d+(?::\d+)?/g, '');
  
  // Pattern 2: Remove cell range patterns with colons
  // Matches: A157A1A101:A169A101:A178A1A101
  text = text.replace(/(?:[A-Z]\d+A\d+:\d+)+/g, '');
  
  // Pattern 3: Remove standalone cell references
  // Matches: A191, A101, etc. (but be careful not to remove valid text)
  // Only remove if followed by another similar pattern
  text = text.replace(/([A-Z]\d{2,}){2,}/g, '');
  
  return text.trim();
};

/**
 * Normalize spaces in text
 * Removes multiple consecutive spaces
 */
export const normalizeSpaces = (text) => {
  if (!text) return text;
  return text.replace(/\s+/g, ' ').trim();
};

/**
 * Clean a single CSV line
 */
export const cleanCSVLine = (line, options = {}) => {
  const {
    removeExcelMetadata = true,
    normalizeSpacing = true,
    removeEmptyLines = true
  } = options;
  
  if (!line) return '';
  
  let cleaned = line;
  
  // Step 1: Remove Excel metadata
  if (removeExcelMetadata) {
    cleaned = cleanExcelMetadata(cleaned);
  }
  
  // Step 2: Normalize spacing (for non-link fields)
  if (normalizeSpacing) {
    cleaned = normalizeSpaces(cleaned);
  }
  
  // Step 3: Remove if empty
  if (removeEmptyLines && !cleaned.trim()) {
    return '';
  }
  
  return cleaned;
};

/**
 * Clean entire CSV content
 * Processes all lines and returns cleaned version
 */
export const cleanCSVContent = (content, options = {}) => {
  if (!content) return '';
  
  // Split into lines
  const lines = content.split(/\r?\n/);
  
  // Clean each line
  const cleanedLines = lines
    .map(line => cleanCSVLine(line, options))
    .filter(line => line); // Remove empty lines
  
  return cleanedLines.join('\n');
};

/**
 * Detect if CSV contains Excel metadata
 */
export const hasExcelMetadata = (text) => {
  if (!text) return false;
  
  // Check for Excel cell reference patterns
  return /[A-Z]\d+A\d+A\d+/.test(text);
};

/**
 * Clean CSV for specific format
 * Different formats may need different cleaning strategies
 */
export const cleanCSVForFormat = (content, format) => {
  let options = {
    removeExcelMetadata: true,
    normalizeSpacing: false, // Don't normalize yet - let format processor handle it
    removeEmptyLines: true
  };
  
  // Format-specific adjustments
  switch (format) {
    case '20000 Page':
    case '40000 Page':
    case 'AD Page':
      // These formats have link fields - be careful with spacing
      options.normalizeSpacing = false;
      break;
    
    case 'MD Page':
    case '2 Rows':
    case '4 Rows':
      // These formats don't have links - can normalize spacing
      options.normalizeSpacing = true;
      break;
    
    default:
      // Default behavior
      break;
  }
  
  return cleanCSVContent(content, options);
};

