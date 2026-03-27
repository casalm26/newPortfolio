import { describe, expect, it } from "vitest";
import { mapToBlogPost } from "../map-to-blogpost";
import type { ParsedMediumPost } from "../types";

function makeParsedPost(
  overrides?: Partial<ParsedMediumPost>,
): ParsedMediumPost {
  return {
    title: "Don't ask the sun for mercy",
    mediumUrl: "https://medium.com/@caspianalmerud/dont-ask-the-sun-abc123",
    mediumId: "abc123",
    author: "Caspian Almerud",
    publishedAt: new Date("2022-02-16T19:46:56.000Z"),
    updatedAt: new Date("2022-02-17T10:00:00.000Z"),
    htmlContent:
      "<p>First paragraph of the article.</p><p>Second paragraph.</p>",
    categories: [],
    ...overrides,
  };
}

describe("mapToBlogPost", () => {
  it("maps all fields correctly", () => {
    const post = makeParsedPost();
    const mapped = mapToBlogPost(post);

    expect(mapped.title).toBe("Don't ask the sun for mercy");
    expect(mapped.slug).toBe("don-t-ask-the-sun-for-mercy");
    expect(mapped.content).toContain("First paragraph");
    expect(mapped.summary).toContain("First paragraph");
    expect(mapped.author).toBe("Caspian Almerud");
    expect(mapped.draft).toBe(false);
    expect(mapped.publishedAt).toEqual(new Date("2022-02-16T19:46:56.000Z"));
  });

  it("generates slug from title", () => {
    const post = makeParsedPost({ title: "Hello World: A Test!" });
    const mapped = mapToBlogPost(post);
    expect(mapped.slug).toBe("hello-world-a-test");
  });

  it("sets SEO defaults from title and summary", () => {
    const post = makeParsedPost();
    const mapped = mapToBlogPost(post);
    expect(mapped.seoTitle).toBe(post.title);
    expect(mapped.seoDescription).toBe(mapped.summary);
    expect(mapped.seoKeywords).toEqual([]);
  });

  it("sets draft to false for published posts", () => {
    const mapped = mapToBlogPost(makeParsedPost());
    expect(mapped.draft).toBe(false);
  });

  it("maps categories to tags", () => {
    const post = makeParsedPost({
      categories: ["Technology", "Programming"],
    });
    const mapped = mapToBlogPost(post);
    expect(mapped.tags).toEqual(["Technology", "Programming"]);
  });

  it("handles empty categories", () => {
    const mapped = mapToBlogPost(makeParsedPost({ categories: [] }));
    expect(mapped.tags).toEqual([]);
  });

  it("extracts cover image from HTML", () => {
    const post = makeParsedPost({
      htmlContent:
        '<figure><img src="https://cdn.example.com/hero.jpg" alt="cover"></figure><p>Text</p>',
    });
    const mapped = mapToBlogPost(post);
    expect(mapped.coverImage).toBe("https://cdn.example.com/hero.jpg");
  });

  it("omits coverImage when no real images exist", () => {
    const post = makeParsedPost({
      htmlContent: "<p>No images here</p>",
    });
    const mapped = mapToBlogPost(post);
    expect(mapped.coverImage).toBeUndefined();
  });

  it("converts HTML content to markdown", () => {
    const post = makeParsedPost({
      htmlContent:
        "<h3>Heading</h3><p>Paragraph</p><blockquote>Quote</blockquote>",
    });
    const mapped = mapToBlogPost(post);
    expect(mapped.content).toContain("### Heading");
    expect(mapped.content).toContain("Paragraph");
    expect(mapped.content).toContain("> Quote");
  });

  it("uses author from parsed post", () => {
    const post = makeParsedPost({ author: "Custom Author" });
    const mapped = mapToBlogPost(post);
    expect(mapped.author).toBe("Custom Author");
  });
});
