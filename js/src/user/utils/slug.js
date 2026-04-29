/**
 * Generate a URL-friendly slug from a title + id.
 * e.g. "When the code finally works", 42 → "when-the-code-finally-works-42"
 */
export const toSlug = (title = '', id = '') => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // strip special chars
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .slice(0, 60);                   // max length
  return `${base}-${id}`;
};

/**
 * Extract the numeric id from the end of a slug.
 * "when-the-code-finally-works-42" → "42"
 */
export const idFromSlug = (slug = '') => {
  const parts = slug.split('-');
  return parts[parts.length - 1];
};
