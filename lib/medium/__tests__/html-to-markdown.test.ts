import { describe, expect, it } from "vitest";
import {
  htmlToMarkdown,
  extractSummary,
  extractCoverImage,
} from "../html-to-markdown";

describe("htmlToMarkdown", () => {
  it("converts paragraphs", () => {
    const md = htmlToMarkdown("<p>Hello</p><p>World</p>");
    expect(md).toContain("Hello");
    expect(md).toContain("World");
  });

  it("converts blockquotes", () => {
    const md = htmlToMarkdown("<blockquote>quote text</blockquote>");
    expect(md).toContain("> quote text");
  });

  it("converts headings", () => {
    const md = htmlToMarkdown("<h3>My Heading</h3>");
    expect(md).toContain("### My Heading");
  });

  it("converts links", () => {
    const md = htmlToMarkdown('<a href="https://example.com">click here</a>');
    expect(md).toContain("[click here](https://example.com)");
  });

  it("converts emphasis", () => {
    const md = htmlToMarkdown("<em>italic text</em>");
    expect(md).toContain("_italic text_");
  });

  it("converts unordered lists", () => {
    const md = htmlToMarkdown("<ul><li>one</li><li>two</li></ul>");
    expect(md).toMatch(/-\s+one/);
    expect(md).toMatch(/-\s+two/);
  });

  it("strips Medium tracking pixels", () => {
    const html = `<p>Content</p><img src="https://medium.com/_/stat?event=post.clientViewed" width="1" height="1">`;
    const md = htmlToMarkdown(html);
    expect(md).not.toContain("medium.com/_/stat");
    expect(md).toContain("Content");
  });

  it("strips 1x1 tracking images", () => {
    const html = `<p>Text</p><img src="https://tracker.example.com/pixel" width="1" height="1">`;
    const md = htmlToMarkdown(html);
    expect(md).not.toContain("tracker.example.com");
  });

  it("preserves real images", () => {
    const html = `<img src="https://example.com/photo.jpg" alt="photo">`;
    const md = htmlToMarkdown(html);
    expect(md).toContain("![photo](https://example.com/photo.jpg)");
  });

  it("returns empty string for empty input", () => {
    expect(htmlToMarkdown("")).toBe("");
    expect(htmlToMarkdown("   ")).toBe("");
  });
});

describe("extractSummary", () => {
  it("extracts plain text from HTML", () => {
    const summary = extractSummary("<p>Hello <em>world</em></p>");
    expect(summary).toBe("Hello world");
  });

  it("truncates long text with ellipsis at word boundary", () => {
    const longText = "<p>" + "word ".repeat(100) + "</p>";
    const summary = extractSummary(longText, 50);
    expect(summary.length).toBeLessThanOrEqual(54); // 50 + "..."
    expect(summary).toMatch(/\.\.\.$/);
  });

  it("does not truncate short text", () => {
    const summary = extractSummary("<p>Short text</p>");
    expect(summary).toBe("Short text");
    expect(summary).not.toContain("...");
  });

  it("strips all HTML tags", () => {
    const summary = extractSummary(
      '<h3>Title</h3><p>Body <a href="#">link</a></p>',
    );
    expect(summary).not.toContain("<");
    expect(summary).not.toContain(">");
  });

  it("decodes HTML entities", () => {
    const summary = extractSummary("<p>A &amp; B &lt; C</p>");
    expect(summary).toContain("A & B < C");
  });

  it("returns empty string for empty input", () => {
    expect(extractSummary("")).toBe("");
    expect(extractSummary("   ")).toBe("");
  });
});

describe("extractCoverImage", () => {
  it("extracts the first real image URL", () => {
    const html = `<figure><img src="https://cdn.example.com/hero.jpg" alt="cover"></figure>`;
    expect(extractCoverImage(html)).toBe("https://cdn.example.com/hero.jpg");
  });

  it("skips Medium tracking pixels", () => {
    const html = `<img src="https://medium.com/_/stat?event=post.clientViewed" width="1" height="1"><img src="https://cdn.example.com/real.jpg">`;
    expect(extractCoverImage(html)).toBe("https://cdn.example.com/real.jpg");
  });

  it("skips 1x1 tracking images", () => {
    const html = `<img src="https://tracker.com/px" width="1" height="1"><img src="https://cdn.com/img.png">`;
    expect(extractCoverImage(html)).toBe("https://cdn.com/img.png");
  });

  it("returns undefined when no real images exist", () => {
    const html = `<p>No images here</p><img src="https://medium.com/_/stat?x=1" width="1" height="1">`;
    expect(extractCoverImage(html)).toBeUndefined();
  });

  it("returns undefined for empty input", () => {
    expect(extractCoverImage("")).toBeUndefined();
  });
});
