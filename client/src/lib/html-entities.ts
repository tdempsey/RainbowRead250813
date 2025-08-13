/**
 * Utility functions for handling HTML entities in text content
 */

export function decodeHtmlEntities(text: string): string {
  if (typeof document !== 'undefined') {
    // Browser environment - use DOM parser
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  } else {
    // Fallback manual decoding for server-side or when DOM is not available
    return text
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"')
      .replace(/&lsquo;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/&hellip;/g, '…')
      // Decode numeric HTML entities like &#8220;, &#8221;, etc.
      .replace(/&#(\d+);/g, (match, dec) => {
        return String.fromCharCode(parseInt(dec, 10));
      })
      // Decode hexadecimal HTML entities like &#x201C;, &#x201D;, etc.
      .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      });
  }
}