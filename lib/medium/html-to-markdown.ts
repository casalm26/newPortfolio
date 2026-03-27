import TurndownService from "turndown";

function createTurndownService(): TurndownService {
  const turndown = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  });

  // Strip Medium tracking pixels (1x1 images and stat URLs)
  turndown.addRule("strip-tracking-pixels", {
    filter: (node) => {
      if (node.nodeName !== "IMG") return false;
      const src = (node as HTMLImageElement).getAttribute("src") ?? "";
      const width = (node as HTMLImageElement).getAttribute("width");
      const height = (node as HTMLImageElement).getAttribute("height");
      return (
        src.includes("medium.com/_/stat") || (width === "1" && height === "1")
      );
    },
    replacement: () => "",
  });

  // Strip empty Medium figure captions
  turndown.addRule("strip-empty-figcaption", {
    filter: (node) =>
      node.nodeName === "FIGCAPTION" && !node.textContent?.trim(),
    replacement: () => "",
  });

  return turndown;
}

const turndownInstance = createTurndownService();

/**
 * Convert Medium HTML content to clean markdown.
 */
export function htmlToMarkdown(html: string): string {
  if (!html || !html.trim()) return "";
  return turndownInstance.turndown(html).trim();
}

/**
 * Extract a plain-text summary from HTML content.
 * Takes the first paragraph's text, truncated to maxLength characters.
 */
export function extractSummary(html: string, maxLength = 200): string {
  if (!html || !html.trim()) return "";

  // Strip HTML tags to get plain text
  const plainText = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) return plainText;

  // Truncate at word boundary
  const truncated = plainText.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

/**
 * Extract the first real image URL from HTML content (not tracking pixels).
 */
export function extractCoverImage(html: string): string | undefined {
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    const fullTag = match[0];
    // Skip tracking pixels
    if (src.includes("medium.com/_/stat")) continue;
    if (fullTag.includes('width="1"') && fullTag.includes('height="1"'))
      continue;
    return src;
  }
  return undefined;
}
