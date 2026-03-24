import { getAllVideos, serialize } from "@/lib/cms/queries";
import { VideosPageClient } from "./VideosPageClient";

export const metadata = {
  title: "Videos",
  description: "Video content on development, tutorials, and tech topics.",
};

export default async function VideosPage() {
  const videos = await getAllVideos();
  return <VideosPageClient videos={serialize(videos)} />;
}
