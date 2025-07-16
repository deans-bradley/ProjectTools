/**
 * Generate a unique ID
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Format name string to a valid value
 * @param {string} name - Name string to be cleaned.
 * @returns {string} Name converted to lowercase and whitespace removed 
 */
export function cleanName(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
}