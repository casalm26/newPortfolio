import { getAllProjects, serialize } from "@/lib/cms/queries";
import { ProjectsPageClient } from "./ProjectsPageClient";

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return <ProjectsPageClient projects={serialize(projects)} />;
}
