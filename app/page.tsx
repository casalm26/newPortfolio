import Header from "@/components/shared/Header";
import { PixelArtName } from "@/components/landing";
import ScrollAnimation, { ParallaxScroll, StaggerAnimation } from "@/components/shared/ScrollAnimation";
import Link from "next/link";
import Footer from "@/components/shared/Footer";

export default function Page() {
  const quickAccess = [
    {
      title: "PROJECTS",
      description: "Technical work & case studies",
      href: "/projects",
      prefix: "./projects"
    },
    {
      title: "GAMES",
      description: "Interactive pixel art experiences",
      href: "/games",
      prefix: "./games"
    },
    {
      title: "ARTICLES",
      description: "Technical insights & thoughts",
      href: "/all-articles",
      prefix: "./articles"
    },
    {
      title: "CV",
      description: "Career timeline & experience",
      href: "/cv",
      prefix: "./cv"
    }
  ];

  const highlights = [
    "Full-Stack Development",
    "Interactive Game Design",
    "Technical Architecture",
    "Creative Problem Solving"
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <Header />

      {/* Hero Section - Pixel Art Name */}
      <section className="min-h-screen flex items-center justify-center bg-black px-4 pt-20">
        <ScrollAnimation animation="fadeIn" duration={1000}>
          <h1 className="sr-only">Caspian Almerud - Generalist Developer</h1>
          <PixelArtName className="w-full" aria-hidden="true" />
        </ScrollAnimation>
      </section>

      {/* Introduction Section */}
      <section className="container mx-auto px-4 py-24">
        <ScrollAnimation animation="slideUp" delay={200}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="font-pixel text-sm text-terminal-400 mb-4">
              caspian@localhost:~$ whoami
            </div>
            <h2 className="text-2xl md:text-4xl font-pixel font-bold text-white mb-6">
              GENERALIST DEVELOPER
            </h2>
            <p className="text-terminal-300 text-lg leading-relaxed mb-8">
              I bridge technical expertise with creative problem-solving, building everything
              from scalable web applications to interactive pixel art games. My approach combines
              deep technical knowledge with a generalist perspective, enabling me to tackle
              complex challenges across the full development spectrum.
            </p>
          </div>
        </ScrollAnimation>

        {/* Highlights */}
        <ScrollAnimation animation="slideUp" delay={400}>
          <div className="max-w-2xl mx-auto">
            <StaggerAnimation
              staggerDelay={150}
              animation="slideUp"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
            >
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="p-4 border border-terminal-400 text-center hover:border-white transition-colors group"
                >
                  <span className="font-pixel text-xs text-terminal-300 group-hover:text-white">
                    {highlight}
                  </span>
                </div>
              ))}
            </StaggerAnimation>
          </div>
        </ScrollAnimation>
      </section>

      {/* Quick Access Section */}
      <section className="container mx-auto px-4 py-24">
        <ScrollAnimation animation="slideUp">
          <div className="text-center mb-16">
            <div className="font-pixel text-sm text-terminal-400 mb-4">
              caspian@localhost:~$ ls -la
            </div>
            <h2 className="text-2xl md:text-4xl font-pixel font-bold text-white mb-4">
              QUICK ACCESS/
            </h2>
            <p className="text-terminal-300 max-w-2xl mx-auto">
              Navigate to different sections of my work and experience.
              Each area showcases different aspects of development and creativity.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <StaggerAnimation
            staggerDelay={200}
            animation="slideUp"
            className="contents"
          >
            {quickAccess.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block p-6 border border-terminal-400 hover:border-white hover:bg-terminal-900 transition-all duration-300 group"
              >
                <div className="mb-4">
                  <div className="font-pixel text-xs text-terminal-400 mb-2">
                    {item.prefix}
                  </div>
                  <h3 className="font-pixel text-lg font-bold text-white group-hover:text-terminal-200">
                    {item.title}
                  </h3>
                </div>
                <p className="text-terminal-300 text-sm group-hover:text-white transition-colors">
                  {item.description}
                </p>
                <div className="mt-4 font-pixel text-xs text-terminal-500 group-hover:text-terminal-300 transition-colors">
                  cd {item.prefix} →
                </div>
              </Link>
            ))}
          </StaggerAnimation>
        </div>
      </section>

      {/* Parallax Terminal Section */}
      <section className="py-24 overflow-hidden">
        <ParallaxScroll speed={0.3} className="relative">
          <div className="container mx-auto px-4">
            <ScrollAnimation animation="fadeIn" delay={300}>
              <div className="max-w-4xl mx-auto">
                <div className="bg-terminal-900 border border-terminal-400 p-8 font-mono text-sm">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="ml-4 font-pixel text-xs text-terminal-400">
                      terminal.app
                    </div>
                  </div>
                  <div className="space-y-2 text-terminal-300">
                    <div>
                      <span className="text-green-400">caspian@localhost</span>
                      <span className="text-white">:</span>
                      <span className="text-blue-400">~</span>
                      <span className="text-white">$ cat philosophy.txt</span>
                    </div>
                    <div className="pl-4">
                      "Code is poetry. Every function tells a story,<br />
                      every architecture solves a puzzle,<br />
                      every interface bridges human and machine."
                    </div>
                    <div className="mt-4">
                      <span className="text-green-400">caspian@localhost</span>
                      <span className="text-white">:</span>
                      <span className="text-blue-400">~</span>
                      <span className="text-white">$ echo "Let's build something amazing together"</span>
                    </div>
                    <div className="pl-4 text-white">
                      Let's build something amazing together
                    </div>
                    <div className="flex items-center mt-4">
                      <span className="text-green-400">caspian@localhost</span>
                      <span className="text-white">:</span>
                      <span className="text-blue-400">~</span>
                      <span className="text-white">$ </span>
                      <div className="w-2 h-4 bg-white ml-1 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </ParallaxScroll>
      </section>

      {/* Contact CTA */}
      <section className="container mx-auto px-4 py-24">
        <ScrollAnimation animation="scaleIn" delay={200}>
          <div className="max-w-2xl mx-auto text-center">
            <div className="font-pixel text-sm text-terminal-400 mb-4">
              caspian@localhost:~$ ./contact.sh
            </div>
            <h2 className="text-2xl md:text-4xl font-pixel font-bold text-white mb-6">
              GET IN TOUCH
            </h2>
            <p className="text-terminal-300 mb-8">
              Ready to collaborate on your next project? Let's discuss how we can
              build something extraordinary together.
            </p>
            <Link
              href="/contact"
              className="inline-block font-pixel text-sm px-8 py-4 border-2 border-white bg-white text-black hover:bg-black hover:text-white transition-all duration-300"
            >
              SEND MESSAGE
            </Link>
          </div>
        </ScrollAnimation>
      </section>

      <Footer />
    </div>
  );
}
