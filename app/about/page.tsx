import Header from "@/components/shared/Header";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Image from "next/image";

export const metadata = {
  title: "About",
  description:
    "Generalist developer bridging technical expertise with creative problem-solving",
};

export default function About() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb />
        </div>

        {/* Terminal Header */}
        <div className="mb-12">
          <div className="font-pixel text-sm text-terminal-400 mb-2">
            caspian@localhost:~$ cat about.json | jq '.'
          </div>
          <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
            GENERALIST.DEV
          </h1>
          <p className="text-terminal-300 text-lg">
            Bridging technical expertise, creative problem-solving, and business
            strategy.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Profile Photo Section */}
          <section className="border border-terminal-400 p-6">
            <div className="font-pixel text-xs text-terminal-400 mb-4">
              &gt; display avatar.png --format=ascii --filter=pixel
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-48 h-48 border-2 border-terminal-400 bg-terminal-900 p-4 pixel-perfect">
                  <Image
                    src="/static/images/avatar.png"
                    alt="Caspian Almerud - Generalist Developer"
                    width={192}
                    height={192}
                    className="w-full h-full object-cover pixel-art"
                    style={{ imageRendering: "pixelated" }}
                    priority
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-4 h-4 border-2 border-black"></div>
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
                    Status: <span className="text-green-400">ONLINE</span>
                  </div>
                  <div>
                    Role:{" "}
                    <span className="text-blue-400">GENERALIST_DEVELOPER</span>
                  </div>
                  <div>
                    Location:{" "}
                    <span className="text-purple-400">GLOBAL_REMOTE</span>
                  </div>
                  <div>
                    Mode:{" "}
                    <span className="text-orange-400">CONTINUOUS_LEARNING</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bio Section */}
          <section className="border border-terminal-400 p-6">
            <div className="font-pixel text-xs text-terminal-400 mb-4">
              &gt; whoami --verbose
            </div>
            <div className="text-white space-y-4">
              <p>
                I'm a{" "}
                <span className="text-terminal-300 font-semibold">
                  generalist developer
                </span>{" "}
                who thrives at the intersection of technology, creativity, and
                business strategy. Unlike specialists who dive deep into single
                domains, I bridge multiple disciplines to solve complex,
                multi-faceted challenges.
              </p>
              <p>
                From{" "}
                <span className="text-blue-400">
                  full-stack web applications
                </span>{" "}
                to <span className="text-purple-400">blockchain systems</span>,
                from <span className="text-green-400">AI/ML platforms</span> to{" "}
                <span className="text-pink-400">
                  interactive art installations
                </span>
                , and from{" "}
                <span className="text-orange-400">startup launches</span> to{" "}
                <span className="text-cyan-400">brand identity systems</span> -
                I approach each project with fresh perspective and cross-domain
                insights.
              </p>
              <p className="text-terminal-300">
                This breadth allows me to see connections others miss, translate
                between different stakeholder languages, and architect solutions
                that work across technical, creative, and business dimensions.
              </p>
            </div>
          </section>

          {/* Generalist Manifesto */}
          <section className="border border-terminal-400 p-6">
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
                    Design principles from art inform better UX. Blockchain
                    concepts enhance data architecture. Startup methodologies
                    accelerate development cycles. Each domain enriches the
                    others.
                  </p>
                </div>
                <div>
                  <h4 className="font-pixel text-sm text-terminal-300 mb-3">
                    RAPID_ADAPTATION
                  </h4>
                  <p className="text-terminal-400 text-sm">
                    Technology evolves rapidly. Generalists excel at learning
                    new frameworks, languages, and paradigms because we
                    understand the underlying patterns and principles.
                  </p>
                </div>
                <div>
                  <h4 className="font-pixel text-sm text-terminal-300 mb-3">
                    SYSTEM_THINKING
                  </h4>
                  <p className="text-terminal-400 text-sm">
                    Real problems exist in complex systems. Understanding
                    technology, user psychology, business constraints, and
                    market forces leads to solutions that actually work.
                  </p>
                </div>
                <div>
                  <h4 className="font-pixel text-sm text-terminal-300 mb-3">
                    INNOVATION_ENGINE
                  </h4>
                  <p className="text-terminal-400 text-sm">
                    Innovation happens at the intersection of disciplines.
                    Generalists naturally operate in these liminal spaces where
                    breakthrough solutions emerge.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Multi-Domain Expertise */}
          <section className="border border-terminal-400 p-6">
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
                    ├── Mobile (React Native, Expo)
                  </div>
                  <div className="text-terminal-300">
                    ├── Blockchain (Solidity, Web3, DeFi)
                  </div>
                  <div className="text-terminal-300">
                    ├── AI/ML (TensorFlow, OpenAI, NLP)
                  </div>
                  <div className="text-terminal-300">
                    └── DevOps (Docker, AWS, CI/CD)
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-pixel text-sm text-pink-400 mb-4">
                  CREATIVE/
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="text-terminal-300">
                    ├── Visual Design (Figma, Adobe Suite)
                  </div>
                  <div className="text-terminal-300">
                    ├── Brand Identity (Strategy, Guidelines)
                  </div>
                  <div className="text-terminal-300">
                    ├── Interactive Art (Processing, Arduino)
                  </div>
                  <div className="text-terminal-300">
                    ├── Data Visualization (D3.js, Charts)
                  </div>
                  <div className="text-terminal-300">
                    ├── UX/UI (User Research, Prototyping)
                  </div>
                  <div className="text-terminal-300">
                    └── Motion Design (Animations, Micro-interactions)
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
                    ├── Market Research (Customer Discovery)
                  </div>
                  <div className="text-terminal-300">
                    └── Financial Modeling (Revenue, Metrics)
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Working Philosophy */}
          <section className="border border-terminal-400 p-6">
            <div className="font-pixel text-xs text-terminal-400 mb-4">
              &gt; cat working_principles.yaml
            </div>
            <div className="text-white space-y-6">
              <h3 className="font-pixel text-sm text-white">
                GENERALIST_PRINCIPLES:
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="font-pixel text-xs text-terminal-300 mb-2">
                    curiosity_driven_development:
                  </div>
                  <p className="text-terminal-400 text-sm pl-4">
                    "What if we approached this problem from a completely
                    different discipline? What would an artist do? A founder? A
                    scientist?"
                  </p>
                </div>

                <div>
                  <div className="font-pixel text-xs text-terminal-300 mb-2">
                    first_principles_thinking:
                  </div>
                  <p className="text-terminal-400 text-sm pl-4">
                    "Strip away assumptions and conventions. What's the core
                    problem we're really solving? What constraints are real vs.
                    imagined?"
                  </p>
                </div>

                <div>
                  <div className="font-pixel text-xs text-terminal-300 mb-2">
                    context_aware_solutions:
                  </div>
                  <p className="text-terminal-400 text-sm pl-4">
                    "Perfect technical solution ≠ Right solution. Consider
                    users, business goals, team capabilities, and market timing
                    simultaneously."
                  </p>
                </div>

                <div>
                  <div className="font-pixel text-xs text-terminal-300 mb-2">
                    rapid_experimentation:
                  </div>
                  <p className="text-terminal-400 text-sm pl-4">
                    "Build fast, measure quickly, learn continuously. Prototype
                    in hours, not weeks. Fail fast, but fail forward."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Impact Examples */}
          <section className="border border-terminal-400 p-6">
            <div className="font-pixel text-xs text-terminal-400 mb-4">
              &gt; grep -i "generalist_advantage" case_studies.log
            </div>
            <div className="text-white space-y-6">
              <h3 className="font-pixel text-sm text-white mb-4">
                CROSS_DOMAIN_IMPACT
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-terminal-900 border border-terminal-600">
                  <h4 className="font-pixel text-xs text-blue-400 mb-2">
                    BLOCKCHAIN + UX
                  </h4>
                  <p className="text-terminal-400 text-sm">
                    Applied design thinking to complex crypto UX problems,
                    creating the first voting platform that non-technical users
                    actually wanted to use.
                  </p>
                </div>

                <div className="p-4 bg-terminal-900 border border-terminal-600">
                  <h4 className="font-pixel text-xs text-green-400 mb-2">
                    AI + BUSINESS
                  </h4>
                  <p className="text-terminal-400 text-sm">
                    Combined ML expertise with startup experience to build AI
                    chatbot that reduced support costs 60% while improving
                    customer satisfaction.
                  </p>
                </div>

                <div className="p-4 bg-terminal-900 border border-terminal-600">
                  <h4 className="font-pixel text-xs text-pink-400 mb-2">
                    ART + TECHNOLOGY
                  </h4>
                  <p className="text-terminal-400 text-sm">
                    Merged creative coding with computer vision to create
                    installations that made complex technology emotionally
                    resonant for museum visitors.
                  </p>
                </div>

                <div className="p-4 bg-terminal-900 border border-terminal-600">
                  <h4 className="font-pixel text-xs text-orange-400 mb-2">
                    DATA + STORYTELLING
                  </h4>
                  <p className="text-terminal-400 text-sm">
                    Used narrative design principles to make climate data
                    accessible, influencing policy decisions through compelling
                    visualization.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Current Focus */}
          <section className="border border-terminal-400 p-6">
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
                  <div>• Research projects exploring emerging technologies</div>
                  <div>
                    • Teams that value curiosity, experimentation, and learning
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Connect */}
          <section className="border border-terminal-400 p-6">
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
                    <div>🎯 Brainstorming sessions on challenging problems</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
