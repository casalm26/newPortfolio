export interface Blog {
  slug: string;
  title: string;
  date?: string;
  tags?: string[];
  summary?: string;
}

export interface Project {
  slug: string;
  title: string;
  date?: string;
  projectType?: string;
  summary?: string;
}

export interface Authors {
  slug: string;
  name: string;
}

export const allBlogs: Blog[] = [];
export const allProjects: Project[] = [];
export const allAuthors: Authors[] = [];
