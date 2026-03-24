export interface ProjectData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  projectType: string;
  category: string;
  skills: string[];
  tools: string[];
  links: Record<string, string>;
  duration?: string;
  role?: string;
  coverImage?: string;
  draft: boolean;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
}

export interface BlogPostData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  tags: string[];
  category: string;
  coverImage?: string;
  author: string;
  draft: boolean;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

export interface VideoData {
  _id: string;
  title: string;
  slug: string;
  youtubeId: string;
  description: string;
  tags: string[];
  category: string;
  publishedAt: string;
  duration?: string;
  thumbnail?: string;
  relatedPosts: string[];
  relatedProjects: string[];
  draft: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface TimelineEntryData {
  _id: string;
  entryId: string;
  type: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  skills: string[];
  order: number;
}
