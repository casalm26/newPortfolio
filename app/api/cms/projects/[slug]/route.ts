import { Project } from "@/lib/models";
import { createSlugRouteHandlers } from "@/lib/cms/crud-helpers";

export const { GET, PUT, DELETE } = createSlugRouteHandlers(
  Project as never,
  "Project",
);
