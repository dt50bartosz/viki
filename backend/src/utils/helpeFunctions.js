

function standardizeNameWithUnderscore(name) {
    if (typeof name !== 'string') return ''; // Ensure the input is a string
  
    return name
      .trim() // Remove leading/trailing spaces
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '_'); // Replace multiple spaces with a single underscore
}


function normalizeTitle(value) {
  return value
    .toLowerCase()                          // Make everything lowercase first
    .trim()                                 // Remove leading/trailing spaces
    .replace(/\s+/g, ' ')                   // Replace multiple spaces with a single space
    .split(' ')                             // Split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' ');                             // Join back into a single string
}

function normalizeTitleUrl(title) {
  return title
    .replace(/[_]+/g, ' ') // Convert underscores to space
    .replace(/\s?\b(Bedroom|Bedrooms)\b/i, '-$1') // Remove space before 'Bedroom' or 'Bedrooms' and add dash
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim();
}




module.exports = {standardizeNameWithUnderscore,normalizeTitle,normalizeTitleUrl };