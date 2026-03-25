import { getAllProjects, serialize } from "@/lib/cms/queries";
import type { ProjectData } from "@/lib/cms/types";
import { ProjectsPageClient } from "./ProjectsPageClient";

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return <ProjectsPageClient projects={serialize<typeof projects, ProjectData[]>(projects)} />;
}
