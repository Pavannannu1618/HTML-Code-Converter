/**
 * Parse CSV line handling triple quotes correctly
 * Triple quotes """ in CSV will be detected for adding &ldquo; &rdquo;
 * @param {string} line - CSV line to parse
 * @returns {array} Array of column values
 */
export const parseCSVLine = (line) => {
  const columns = [];
  let current = '';
  let inQuotes = false;
  let quoteCount = 0;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    const nextNextChar = line[i + 2];
    
    if (char === '"') {
      // Check for triple quotes """
      if (!inQuotes && nextChar === '"' && nextNextChar === '"') {
        // Start of triple-quoted field
        inQuotes = true;
        quoteCount = 3;
        i += 2; // Skip next two quotes
        continue;
      } else if (inQuotes && quoteCount === 3 && nextChar === '"' && nextNextChar === '"') {
        // End of triple-quoted field
        inQuotes = false;
        quoteCount = 0;
        i += 2; // Skip next two quotes
        continue;
      } else if (char === '"' && nextChar === '"' && inQuotes) {
        // Escaped quote inside field
        current += '"';
        i++;
      } else {
        // Regular quote toggle
        inQuotes = !inQuotes;
        if (inQuotes) quoteCount = 1;
        else quoteCount = 0;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      columns.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  columns.push(current.trim());
  return columns;
};