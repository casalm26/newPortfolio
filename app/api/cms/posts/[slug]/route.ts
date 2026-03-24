import { BlogPost } from "@/lib/models";
import { createSlugRouteHandlers } from "@/lib/cms/crud-helpers";

export const { GET, PUT, DELETE } = createSlugRouteHandlers(
  BlogPost as never,
  "Post",
);
