/** Raw item shape from Medium RSS XML after parsing */
export interface MediumRSSItem {
  title: string;
  link: string;
  guid: string | { "#text": string };
  "dc:creator": string;
  pubDate: string;
  "atom:updated": string;
  "content:encoded": string;
  category?: string | string[];
}

/** Intermediate shape after RSS parsing, before DB mapping */
export interface ParsedMediumPost {
  title: string;
  mediumUrl: string;
  mediumId: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  htmlContent: string;
  categories: string[];
}
