import { describe, expect, it } from "vitest";
import { parseRSSXml } from "../parse-feed";

const MINIMAL_FEED = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     version="2.0">
  <channel>
    <title>Test Feed</title>
    <item>
      <title><![CDATA[First Post]]></title>
      <link>https://medium.com/@user/first-post-abc123</link>
      <guid isPermaLink="false">https://medium.com/p/abc123</guid>
      <dc:creator><![CDATA[Test Author]]></dc:creator>
      <pubDate>Wed, 16 Feb 2022 19:46:56 GMT</pubDate>
      <atom:updated>2022-02-17T10:00:00.000Z</atom:updated>
      <content:encoded><![CDATA[<p>Hello world</p>]]></content:encoded>
    </item>
    <item>
      <title><![CDATA[Second Post]]></title>
      <link>https://medium.com/@user/second-post-def456</link>
      <guid isPermaLink="false">https://medium.com/p/def456</guid>
      <dc:creator><![CDATA[Test Author]]></dc:creator>
      <pubDate>Thu, 17 Feb 2022 12:00:00 GMT</pubDate>
      <atom:updated>2022-02-18T08:00:00.000Z</atom:updated>
      <content:encoded><![CDATA[<p>Second article</p>]]></content:encoded>
      <category><![CDATA[Technology]]></category>
      <category><![CDATA[Programming]]></category>
    </item>
  </channel>
</rss>`;

describe("parseRSSXml", () => {
  it("parses a feed with multiple items", () => {
    const posts = parseRSSXml(MINIMAL_FEED);
    expect(posts).toHaveLength(2);
    expect(posts[0].title).toBe("First Post");
    expect(posts[1].title).toBe("Second Post");
  });

  it("extracts Medium ID from guid", () => {
    const posts = parseRSSXml(MINIMAL_FEED);
    expect(posts[0].mediumId).toBe("abc123");
    expect(posts[1].mediumId).toBe("def456");
  });

  it("extracts author from dc:creator", () => {
    const posts = parseRSSXml(MINIMAL_FEED);
    expect(posts[0].author).toBe("Test Author");
  });

  it("parses pubDate to Date object", () => {
    const posts = parseRSSXml(MINIMAL_FEED);
    expect(posts[0].publishedAt).toEqual(
      new Date("Wed, 16 Feb 2022 19:46:56 GMT"),
    );
  });

  it("parses atom:updated to Date object", () => {
    const posts = parseRSSXml(MINIMAL_FEED);
    expect(posts[0].updatedAt).toEqual(new Date("2022-02-17T10:00:00.000Z"));
  });

  it("extracts HTML content from content:encoded", () => {
    const posts = parseRSSXml(MINIMAL_FEED);
    expect(posts[0].htmlContent).toBe("<p>Hello world</p>");
  });

  it("extracts Medium URL from link", () => {
    const posts = parseRSSXml(MINIMAL_FEED);
    expect(posts[0].mediumUrl).toBe(
      "https://medium.com/@user/first-post-abc123",
    );
  });

  it("handles items with categories", () => {
    const posts = parseRSSXml(MINIMAL_FEED);
    expect(posts[1].categories).toEqual(["Technology", "Programming"]);
  });

  it("handles items without categories", () => {
    const posts = parseRSSXml(MINIMAL_FEED);
    expect(posts[0].categories).toEqual([]);
  });

  it("handles a single category (not array)", () => {
    const feed = `<?xml version="1.0"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel><item>
    <title>Post</title>
    <link>https://medium.com/@u/p</link>
    <guid>https://medium.com/p/x1</guid>
    <dc:creator>Author</dc:creator>
    <pubDate>Wed, 16 Feb 2022 19:46:56 GMT</pubDate>
    <content:encoded><![CDATA[<p>text</p>]]></content:encoded>
    <category><![CDATA[SingleTag]]></category>
  </item></channel>
</rss>`;
    const posts = parseRSSXml(feed);
    expect(posts[0].categories).toEqual(["SingleTag"]);
  });

  it("returns empty array for feed with no items", () => {
    const feed = `<?xml version="1.0"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel><title>Empty</title></channel>
</rss>`;
    const posts = parseRSSXml(feed);
    expect(posts).toEqual([]);
  });

  it("throws on invalid XML", () => {
    expect(() => parseRSSXml("not xml at all <>")).toThrow();
  });

  it("throws on missing rss.channel", () => {
    const feed = `<?xml version="1.0"?><notRss><something/></notRss>`;
    expect(() => parseRSSXml(feed)).toThrow("Invalid RSS feed");
  });

  it("handles a single item (not wrapped in array)", () => {
    const feed = `<?xml version="1.0"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel><item>
    <title>Only Post</title>
    <link>https://medium.com/@u/only</link>
    <guid>https://medium.com/p/only1</guid>
    <dc:creator>Author</dc:creator>
    <pubDate>Wed, 16 Feb 2022 19:46:56 GMT</pubDate>
    <content:encoded><![CDATA[<p>only content</p>]]></content:encoded>
  </item></channel>
</rss>`;
    const posts = parseRSSXml(feed);
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe("Only Post");
  });
});
