import { ENTITIES } from '../constants/entities';

/**
 * Separate company name from address using entity detection
 * @param {string} line - Combined name and address line
 * @returns {object} {name, address}
 */
export const separateNameAndAddress = (line) => {
  const trimmedLine = line.trim();
  if (!trimmedLine) return { name: '', address: '' };

  const upperText = trimmedLine.toUpperCase();
  let firstEntityPos = -1;
  let firstEntityLen = 0;

  // Find first entity
  ENTITIES.forEach(entity => {
    const pos = upperText.indexOf(entity);
    if (pos !== -1 && (firstEntityPos === -1 || pos < firstEntityPos)) {
      firstEntityPos = pos;
      firstEntityLen = entity.length;
    }
  });

  if (firstEntityPos !== -1) {
    const endPos = firstEntityPos + firstEntityLen;
    const name = trimmedLine.substring(0, endPos).trim();
    const address = trimmedLine.substring(endPos).trim();
    return { name, address };
  }

  // No entity - find last capital letter sequence
  let lastCapitalPos = 0;
  for (let i = 0; i < trimmedLine.length; i++) {
    if (trimmedLine[i] === trimmedLine[i].toUpperCase() && /[A-Z]/.test(trimmedLine[i])) {
      lastCapitalPos = i;
    } else if (/[a-z]/.test(trimmedLine[i])) {
      break;
    }
  }
  
  const name = trimmedLine.substring(0, lastCapitalPos + 1).trim();
  const address = trimmedLine.substring(lastCapitalPos + 1).trim();
  return { name, address };
};