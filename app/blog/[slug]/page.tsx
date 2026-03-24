import { notFound } from "next/navigation";
import Header from "@/components/shared/Header";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Link from "next/link";
import { MDXContent } from "@/components/shared/MDXContent";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/cms/queries";
import { serialize } from "next-mdx-remote/serialize";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.summary,
    keywords: post.seoKeywords,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const mdxSource = await serialize(post.content || "");

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="mb-8">
          <Breadcrumb
            customItems={[
              { label: "HOME", href: "/" },
              { label: "BLOG", href: "/blog" },
              {
                label: post.title.toUpperCase(),
                href: `/blog/${post.slug}`,
              },
            ]}
          />
          <div className="mt-4">
            <Link
              href="/blog"
              className="inline-flex items-center font-pixel text-sm text-terminal-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              cd ../blog
            </Link>
          </div>
        </div>

        <header className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            {post.category && (
              <span className="font-pixel text-xs px-2 py-1 border border-terminal-400 text-terminal-300">
                {post.category.toUpperCase()}
              </span>
            )}
            <span className="font-pixel text-xs text-terminal-500">
              {formatDate(new Date(post.publishedAt))}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-terminal-300 leading-relaxed mb-6">
            {post.summary}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="font-pixel text-xs px-2 py-1 border border-terminal-500 text-terminal-300 hover:border-white hover:text-white transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        <article className="prose prose-invert prose-lg max-w-none">
          <MDXContent source={mdxSource} />
        </article>

        <footer className="mt-16 pt-8 border-t border-terminal-400">
          <Link
            href="/blog"
            className="inline-flex items-center font-pixel text-sm text-terminal-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to blog
          </Link>
        </footer>
      </main>
    </div>
  );
}
