import Header from "@/components/shared/Header";
import { PixelArtName } from "@/components/PixelArtName";
import ScrollAnimation, {
  StaggerAnimation,
} from "@/components/shared/ScrollAnimation";
import Link from "next/link";
import Footer from "@/components/shared/Footer";

export default function Page() {
  const quickAccess = [
    {
      title: "PROJECTS",
      description: "Projects & case studies.",
      href: "/projects",
      prefix: "./projects",
      stat: "Case Studies",
    },
    {
      title: "BLOG",
      description: "Mostly rants and thoughts on life. ",
      href: "/blog",
      prefix: "./blog",
      stat: "Articles",
    },
    {
      title: "VIDEOS",
      description: "Hobby-philosophical vlogs.",
      href: "/videos",
      prefix: "./videos",
      stat: "Videos",
    },
    {
      title: "CV",
      description: "My career timeline.",
      href: "/cv",
      prefix: "./cv",
      stat: "Timeline",
    },
  ];

  const highlights = [
    "Full-Stack Development",
    "Marketing & Growth",
    "Technical Architecture",
    "Creative Problem Solving",
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
              I bridge technical expertise with creative problem-solving,
              building everything from scalable web applications to interactive
              pixel art games. My approach combines deep technical knowledge
              with a generalist perspective, enabling me to tackle complex
              challenges across the full development spectrum.
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
              Navigate to different sections of my work and experience. Each
              area showcases different aspects of development and creativity.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <StaggerAnimation
            staggerDelay={150}
            animation="slideUp"
            className="contents"
          >
            {quickAccess.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block p-6 border-2 border-terminal-400 hover:border-white hover:bg-terminal-900 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Top bar accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-terminal-400 group-hover:bg-white transition-colors" />

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-pixel text-xs text-terminal-500 mb-2">
                      {item.prefix}
                    </div>
                    <h3 className="font-pixel text-xl font-bold text-white group-hover:text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p className="text-terminal-300 text-sm leading-relaxed mb-6 group-hover:text-terminal-200 transition-colors">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="font-pixel text-xs text-terminal-400 border border-terminal-400 px-2 py-1 group-hover:border-white group-hover:text-white transition-colors">
                    {item.stat}
                  </span>
                  <span className="font-pixel text-xs text-terminal-500 group-hover:text-white transition-colors">
                    cd {item.prefix} →
                  </span>
                </div>
              </Link>
            ))}
          </StaggerAnimation>
        </div>
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
              Ready to collaborate on your next project? Let's discuss how we
              can build something extraordinary together.
            </p>
            <Link
              href="/contact"
              className="inline-block font-pixel text-sm px-8 py-4 border-2 border-white bg-white text-black font-bold hover:bg-black hover:text-white transition-all duration-300"
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
