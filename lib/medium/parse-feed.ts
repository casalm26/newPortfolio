import { XMLParser } from "fast-xml-parser";
import type { MediumRSSItem, ParsedMediumPost } from "./types";

const MEDIUM_FEED_URL = "https://medium.com/feed/@caspianalmerud";

/**
 * Parse raw RSS XML string into an array of ParsedMediumPost objects.
 * Pure function — no network calls, fully testable.
 */
export function parseRSSXml(xml: string): ParsedMediumPost[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    processEntities: true,
    trimValues: true,
  });

  const parsed = parser.parse(xml);

  const channel = parsed?.rss?.channel;
  if (!channel) {
    throw new Error("Invalid RSS feed: missing rss.channel");
  }

  const items: MediumRSSItem[] = channel.item
    ? Array.isArray(channel.item)
      ? channel.item
      : [channel.item]
    : [];

  return items.map(mapRSSItem);
}

function mapRSSItem(item: MediumRSSItem): ParsedMediumPost {
  const guidStr =
    typeof item.guid === "object" ? item.guid["#text"] : item.guid;
  const mediumId = guidStr?.split("/p/").pop() ?? guidStr;

  const categories = item.category
    ? Array.isArray(item.category)
      ? item.category
      : [item.category]
    : [];

  return {
    title: String(item.title ?? "").trim(),
    mediumUrl: String(item.link ?? ""),
    mediumId: String(mediumId ?? ""),
    author: String(item["dc:creator"] ?? "Caspian Almerud"),
    publishedAt: new Date(item.pubDate),
    updatedAt: new Date(item["atom:updated"] || item.pubDate),
    htmlContent: String(item["content:encoded"] ?? ""),
    categories,
  };
}

/**
 * Fetch the Medium RSS feed and return parsed posts.
 */
export async function fetchMediumFeed(
  feedUrl: string = MEDIUM_FEED_URL,
): Promise<ParsedMediumPost[]> {
  const response = await fetch(feedUrl, {
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch feed: ${response.status} ${response.statusText}`,
    );
  }

  const xml = await response.text();
  return parseRSSXml(xml);
}
