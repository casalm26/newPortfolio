import { Source_Sans_3, Oswald } from "next/font/google";
import { siteConfig } from "@/data/config/site.settings";
import { ThemeProviders } from "./theme-providers";
import { Metadata } from "next";

import { colors } from "@/data/config/colors.js";

import "@/css/globals.css";
import { SearchProvider } from "@/components/shared/SearchProvider";
import { AnalyticsWrapper } from "@/components/shared/Analytics";
import { AnimationProvider } from "@/components/shared/AnimationProvider";

const displayFont = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-display",
});

const baseFont = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-default",
  weight: ["400", "600"],
});

const globalColors = colors;
const style: string[] = [];

Object.keys(globalColors).map((variant) => {
  return Object.keys(globalColors[variant]).map((color) => {
    const value = globalColors[variant][color];
    style.push(`--${variant}-${color}: ${value}`);
  });
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "./",
    siteName: siteConfig.title,
    images: [siteConfig.socialBanner],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": `${siteConfig.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: siteConfig.title,
    card: "summary_large_image",
    images: [siteConfig.socialBanner],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={siteConfig.language}
      className={`${baseFont.variable} ${displayFont.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <style>
          {`
          :root, :before, :after {
            ${style.join(";")}
          }
        `}
        </style>

        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/static/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/static/favicons/manifest.webmanifest" />
        <link
          rel="mask-icon"
          href="/static/favicons/safari-pinned-tab.svg"
          color="#5bbad5"
        />

        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#000"
        />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Caspian Almerud",
              jobTitle: "Generalist Developer",
              description:
                "Generalist developer bridging technical expertise with creative problem-solving. Full-stack development, blockchain, AI/ML, interactive art, and business strategy.",
              url: "https://caspian.dev",
              email: "hello@caspian.dev",
              image: "https://caspian.dev/static/images/avatar.png",
              sameAs: [
                "https://github.com/caspianalmerud",
                "https://linkedin.com/in/caspian-almerud",
                "https://twitter.com/caspianalmerud",
              ],
              knowsAbout: [
                "Full-Stack Development",
                "React",
                "Next.js",
                "TypeScript",
                "Blockchain Development",
                "Artificial Intelligence",
                "Machine Learning",
                "Interactive Art",
                "Business Strategy",
                "Product Management",
              ],
              worksFor: {
                "@type": "Organization",
                name: "Independent",
              },
            }),
          }}
        />
      </head>

      <body className="flex flex-col bg-black text-white antialiased min-h-screen">
        <ThemeProviders>
          <AnimationProvider>
            <AnalyticsWrapper />

            {/* Skip links for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black px-4 py-2 z-50 font-pixel text-sm border-2 border-black"
            >
              SKIP TO MAIN CONTENT
            </a>

            <div className="w-full flex flex-col justify-between items-center font-sans">
              <SearchProvider>
                <main
                  id="main-content"
                  className="w-full flex flex-col items-center mb-auto"
                >
                  {children}
                </main>
              </SearchProvider>
            </div>
          </AnimationProvider>
        </ThemeProviders>
      </body>
    </html>
  );
}
