import { TimelineEntry } from "@/lib/models";
import { createIdRouteHandlers } from "@/lib/cms/crud-helpers";

export const { GET, PUT, DELETE } = createIdRouteHandlers(
  TimelineEntry as never,
  "Timeline entry",
);
