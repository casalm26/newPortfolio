export interface Project {
  slug: string;
  title: string;
  date?: string;
  projectType?: string;
  summary?: string;
}

export const allProjects: Project[] = [];
