import Header from "@/components/shared/Header";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Image from "next/image";
import { PageTransition } from "@/components/shared/PageTransition";
import { ScrollAnimated } from "@/components/shared/ScrollAnimated";
import { TypewriterText } from "@/components/shared/TypewriterText";

export const metadata = {
  title: "About",
  description:
    "Generalist developer bridging technical expertise with creative problem-solving",
};

export default function About() {
  return (
    <div className="min-h-screen bg-black">
      <ScrollAnimated animation="fade-in">
        <Header />
      </ScrollAnimated>

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        {/* Breadcrumb */}
        <ScrollAnimated animation="slide-in-left">
          <div className="mb-8">
            <Breadcrumb />
          </div>
        </ScrollAnimated>

        {/* Terminal Header */}
        <ScrollAnimated animation="fade-in" delay={200}>
          <div className="mb-12">
            <div className="font-pixel text-sm text-terminal-400 mb-2">
              <TypewriterText
                text="caspian@localhost:~$ cat about.json | jq '.'"
                speed={30}
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
              GENERALIST.DEV
            </h1>
            <p className="text-terminal-300 text-lg">
              Bridging technical expertise, creative problem-solving, and
              business strategy.
            </p>
          </div>
        </ScrollAnimated>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Profile Photo Section */}
          <ScrollAnimated animation="scale-in" delay={300}>
            <section className="border border-terminal-400 p-6 hover:border-white hover:shadow-lg hover:shadow-white/5 transition-all duration-150">
              <div className="font-pixel text-xs text-terminal-400 mb-4">
                &gt; display avatar.png --format=ascii --filter=pixel
              </div>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-48 h-48 border-2 border-terminal-400 bg-terminal-900 p-4 pixel-perfect hover:border-white hover:shadow-lg hover:shadow-white/10 transition-all duration-150">
                    <Image
                      src="/static/images/caspian.webp"
                      alt="Caspian Almerud - Generalist Developer"
                      width={192}
                      height={192}
                      className="w-full h-full object-cover pixel-art"
                      style={{ imageRendering: "pixelated" }}
                      priority
                    />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <div className="font-pixel text-xs text-terminal-400 mb-2">
                    $ whoami
                  </div>
                  <h2 className="font-pixel text-2xl text-white mb-2">
                    CASPIAN_ALMERUD
                  </h2>
                  <div className="space-y-1 text-terminal-300 text-sm">
                    <div>
                      Role:{" "}
                      <span className="text-blue-400">
                        GENERALIST_DEVELOPER
                      </span>
                    </div>
                    <div>
                      Location:{" "}
                      <span className="text-purple-400">STOCKHOLM/REMOTE</span>
                    </div>
                    <div>
                      Mode:{" "}
                      <span className="text-orange-400">
                        CONTINUOUS_LEARNING
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </ScrollAnimated>

          {/* Bio Section */}
          <ScrollAnimated animation="slide-in-right">
            <section className="border border-terminal-400 p-6 hover:border-white hover:shadow-lg hover:shadow-white/5 transition-all duration-150">
              <div className="font-pixel text-xs text-terminal-400 mb-4">
                &gt; whoami --verbose
              </div>
              <div className="text-white space-y-4">
                <p>
                  I'm a generalist developer who thrives at the intersection of
                  technology, creativity, and business strategy. Unlike
                  specialists who dive deep into single domains, I bridge
                  multiple disciplines to solve complex multi-faceted
                  challenges.
                </p>
                <p>
                  From full-stack web applications and startup launches to paid
                  marketing campaigns and data structures -I approach each
                  project with fresh perspective and cross-domain insights.
                </p>
                <p>
                  This breadth allows me to see connections others miss,
                  translate between different stakeholder languages, and
                  architect solutions that work across technical, creative, and
                  business dimensions.
                </p>
              </div>
            </section>
          </ScrollAnimated>

          {/* Generalist Manifesto */}
          <ScrollAnimated animation="slide-in-left">
            <section className="border border-terminal-400 p-6 hover:border-white hover:shadow-lg hover:shadow-white/5 transition-all duration-150">
              <div className="font-pixel text-xs text-terminal-400 mb-4">
                &gt; cat manifesto.md
              </div>
              <div className="text-white space-y-6">
                <h3 className="font-pixel text-lg text-white mb-4">
                  WHY_GENERALIST.APPROACH
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-pixel text-sm text-terminal-300 mb-3">
                      CROSS_POLLINATION
                    </h4>
                    <p className="text-terminal-400 text-sm">
                      Most developers build in isolation. Most marketers don't
                      understand code. Most founders can't ship. I break these
                      silos — and ensure the best solutions emerge.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-pixel text-sm text-terminal-300 mb-3">
                      RAPID_ADAPTATION
                    </h4>
                    <p className="text-terminal-400 text-sm">
                      Everything evolves rapidly today. As a generalist, I excel
                      at learning, operating from first principles and applying
                      the things I learn to new domains.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-pixel text-sm text-terminal-300 mb-3">
                      SYSTEM_THINKING
                    </h4>
                    <p className="text-terminal-400 text-sm">
                      Real problems exist in complex systems. Understanding
                      technology, user psychology and business constraints leads
                      to solutions that actually work.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-pixel text-sm text-terminal-300 mb-3">
                      INNOVATION_ENGINE
                    </h4>
                    <p className="text-terminal-400 text-sm">
                      Innovation happens at the intersection of disciplines. As
                      a generalist, I naturally operate in these liminal spaces
                      where new ideas form.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </ScrollAnimated>

          {/* Multi-Domain Expertise */}
          <ScrollAnimated animation="scale-in">
            <section className="border border-terminal-400 p-6 hover:border-white hover:shadow-lg hover:shadow-white/5 transition-all duration-150">
              <div className="font-pixel text-xs text-terminal-400 mb-4">
                &gt; tree expertise/ --depth=2
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-pixel text-sm text-blue-400 mb-4">
                    TECHNICAL/
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-terminal-300">
                      ├── Frontend (React, Next.js, TypeScript)
                    </div>
                    <div className="text-terminal-300">
                      ├── Backend (Node.js, Python, PostgreSQL)
                    </div>
                    <div className="text-terminal-300">
                      ├── DevOps (Docker, CI/CD)
                    </div>
                    <div className="text-terminal-300">
                      ├── AI-tools (Codex, Lovable, Factory, Cursor)
                    </div>
                    <div className="text-terminal-300">
                      └── No-Code (Airtable, Zapier, Notion, Supabase)
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-pixel text-sm text-pink-400 mb-4">
                    MARKETING/
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-terminal-300">
                      ├── Paid Marketing (Google Ads, Facebook Ads, LinkedIn
                      Ads)
                    </div>
                    <div className="text-terminal-300">
                      ├── SEO (Google Search Console, Google Analytics,
                      Programmatic SEO)
                    </div>
                    <div className="text-terminal-300">
                      ├── Social Media (Facebook, Instagram, LinkedIn)
                    </div>
                    <div className="text-terminal-300">
                      ├── Email Marketing (Mailchimp, SendGrid, Brevo)
                    </div>
                    <div className="text-terminal-300">
                      └── Content Marketing (Blog, Podcast, YouTube)
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-pixel text-sm text-orange-400 mb-4">
                    BUSINESS/
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-terminal-300">
                      ├── Product Strategy (Roadmaps, Features)
                    </div>
                    <div className="text-terminal-300">
                      ├── Growth Hacking (Analytics, A/B Testing)
                    </div>
                    <div className="text-terminal-300">
                      ├── Startup Operations (MVP, PMF, Fundraising)
                    </div>
                    <div className="text-terminal-300">
                      ├── Team Leadership (Hiring, Culture, OKRs)
                    </div>
                    <div className="text-terminal-300">
                      └── Market Research (Customer Discovery, Competitor
                      Analysis)
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </ScrollAnimated>

          {/* Current Focus */}
          <ScrollAnimated animation="slide-in-left">
            <section className="border border-terminal-400 p-6 hover:border-white hover:shadow-lg hover:shadow-white/5 transition-all duration-150">
              <div className="font-pixel text-xs text-terminal-400 mb-4">
                &gt; systemctl status caspian.service
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Status:</span>
                    <span className="font-pixel text-xs px-3 py-1 border border-green-500 text-green-500">
                      ACTIVE_LEARNING
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Current Focus:</span>
                    <span className="text-terminal-300">
                      AI × Creative Technology × Web3
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Next Learning:</span>
                    <span className="text-terminal-300">
                      Rust, WebAssembly, Edge Computing
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Availability:</span>
                    <span className="text-terminal-300">
                      Open to interesting projects
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-terminal-600">
                  <h4 className="font-pixel text-xs text-terminal-300 mb-3">
                    IDEAL_COLLABORATIONS:
                  </h4>
                  <div className="space-y-2 text-sm text-terminal-400">
                    <div>
                      • Cross-disciplinary projects that challenge conventional
                      approaches
                    </div>
                    <div>
                      • Early-stage startups needing technical + strategic
                      leadership
                    </div>
                    <div>
                      • Creative technology installations or interactive
                      experiences
                    </div>
                    <div>
                      • Research projects exploring emerging technologies
                    </div>
                    <div>
                      • Teams that value curiosity, experimentation, and
                      learning
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </ScrollAnimated>

          {/* Connect */}
          <ScrollAnimated animation="scale-in">
            <section className="border border-terminal-400 p-6 hover:border-white hover:shadow-lg hover:shadow-white/5 transition-all duration-150">
              <div className="font-pixel text-xs text-terminal-400 mb-4">
                &gt; curl -X GET /api/contact/methods
              </div>
              <div className="text-white space-y-4">
                <p className="mb-6">
                  Interested in exploring what's possible when technical depth
                  meets creative breadth? Let's discuss your most interesting
                  challenges.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-pixel text-xs text-terminal-300 mb-3">
                      QUICK_CONNECT:
                    </h4>
                    <div className="space-y-2">
                      <div className="font-mono text-sm">
                        <span className="text-terminal-400">Email:</span>
                        <span className="text-terminal-300 ml-2">
                          hello@caspian.dev
                        </span>
                      </div>
                      <div className="font-mono text-sm">
                        <span className="text-terminal-400">LinkedIn:</span>
                        <span className="text-terminal-300 ml-2">
                          /in/caspian-almerud
                        </span>
                      </div>
                      <div className="font-mono text-sm">
                        <span className="text-terminal-400">GitHub:</span>
                        <span className="text-terminal-300 ml-2">
                          /caspianalmerud
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-pixel text-xs text-terminal-300 mb-3">
                      BEST_FOR:
                    </h4>
                    <div className="space-y-2 text-sm text-terminal-400">
                      <div>📧 Complex projects needing detailed discussion</div>
                      <div>💼 Professional opportunities and partnerships</div>
                      <div>⚡ Quick questions about generalist development</div>
                      <div>
                        🎯 Brainstorming sessions on challenging problems
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </ScrollAnimated>
        </div>
      </main>
    </div>
  );
}
