import { Video } from "@/lib/models";
import { createSlugRouteHandlers } from "@/lib/cms/crud-helpers";

export const { GET, PUT, DELETE } = createSlugRouteHandlers(
  Video as never,
  "Video",
);
