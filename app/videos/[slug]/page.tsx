import { notFound } from "next/navigation";
import Header from "@/components/shared/Header";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Link from "next/link";
import { ArrowLeft } from "@/components/icons/Icons";
import { getAllVideos, getVideoBySlug } from "@/lib/cms/queries";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const videos = await getAllVideos();
    return videos.map((video) => ({ slug: video.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) return {};

  return {
    title: video.seoTitle || video.title,
    description: video.seoDescription || video.description,
  };
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) notFound();

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="mb-8">
          <Breadcrumb
            customItems={[
              { label: "HOME", href: "/" },
              { label: "VIDEOS", href: "/videos" },
              {
                label: video.title.toUpperCase(),
                href: `/videos/${video.slug}`,
              },
            ]}
          />
          <div className="mt-4">
            <Link
              href="/videos"
              className="inline-flex items-center font-pixel text-sm text-terminal-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              cd ../videos
            </Link>
          </div>
        </div>

        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            {video.category && (
              <span className="font-pixel text-xs px-2 py-1 border border-terminal-400 text-terminal-300">
                {video.category.toUpperCase()}
              </span>
            )}
            <span className="font-pixel text-xs text-terminal-500">
              {formatDate(new Date(video.publishedAt))}
            </span>
            {video.duration && (
              <span className="font-pixel text-xs text-terminal-500">
                {video.duration}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {video.title}
          </h1>
        </header>

        {/* YouTube Embed */}
        <div className="relative aspect-video mb-8 border border-terminal-400">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Description */}
        {video.description && (
          <div className="mb-8">
            <p className="text-terminal-300 leading-relaxed">
              {video.description}
            </p>
          </div>
        )}

        {/* Tags */}
        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {video.tags.map((tag) => (
              <Link
                key={tag}
                href={`/videos?tag=${encodeURIComponent(tag)}`}
                className="font-pixel text-xs px-2 py-1 border border-terminal-500 text-terminal-300 hover:border-white hover:text-white transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Related Content */}
        {(video.relatedPosts.length > 0 ||
          video.relatedProjects.length > 0) && (
          <div className="border-t border-terminal-400 pt-8 mb-8">
            <h2 className="font-pixel text-sm text-terminal-400 mb-4">
              RELATED CONTENT
            </h2>
            <div className="flex flex-wrap gap-3">
              {video.relatedPosts.map((postSlug) => (
                <Link
                  key={postSlug}
                  href={`/blog/${postSlug}`}
                  className="font-pixel text-xs px-3 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white transition-colors"
                >
                  Blog: {postSlug}
                </Link>
              ))}
              {video.relatedProjects.map((projectSlug) => (
                <Link
                  key={projectSlug}
                  href={`/projects/${projectSlug}`}
                  className="font-pixel text-xs px-3 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white transition-colors"
                >
                  Project: {projectSlug}
                </Link>
              ))}
            </div>
          </div>
        )}

        <footer className="pt-8 border-t border-terminal-400">
          <Link
            href="/videos"
            className="inline-flex items-center font-pixel text-sm text-terminal-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to videos
          </Link>
        </footer>
      </main>
    </div>
  );
}
