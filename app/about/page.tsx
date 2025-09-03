import Header from '@/components/shared/Header';

export const metadata = {
  title: 'About',
  description: 'Developer, problem solver, and technology enthusiast',
};

export default function About() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        {/* Terminal Header */}
        <div className="mb-12">
          <div className="font-pixel text-sm text-terminal-400 mb-2">
            caspian@localhost:~$ cat about.txt
          </div>
          <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
            ABOUT.EXE
          </h1>
          <p className="text-terminal-300 text-lg">
            Developer, problem solver, and technology enthusiast crafting digital experiences.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Bio Section */}
          <section className="border border-terminal-400 p-6">
            <div className="font-pixel text-xs text-terminal-400 mb-4">
              &gt; whoami
            </div>
            <div className="text-white space-y-4">
              <p>
                I'm a full-stack developer with a passion for building robust, scalable applications 
                and solving complex technical challenges. My journey in software development has taken 
                me through various technologies and domains, from frontend interfaces to backend 
                architectures.
              </p>
              <p>
                When I'm not coding, you'll find me exploring new technologies, contributing to 
                open-source projects, or diving deep into system design and performance optimization.
              </p>
            </div>
          </section>

          {/* Skills Matrix */}
          <section className="border border-terminal-400 p-6">
            <div className="font-pixel text-xs text-terminal-400 mb-4">
              &gt; ls -la skills/
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-pixel text-sm text-white mb-4">FRONTEND/</h3>
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-terminal-300">React.js</span>
                    <span className="text-terminal-500">██████████</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-terminal-300">TypeScript</span>
                    <span className="text-terminal-500">█████████░</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-terminal-300">Next.js</span>
                    <span className="text-terminal-500">████████░░</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-terminal-300">Tailwind</span>
                    <span className="text-terminal-500">██████████</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-pixel text-sm text-white mb-4">BACKEND/</h3>
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-terminal-300">Node.js</span>
                    <span className="text-terminal-500">████████░░</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-terminal-300">PostgreSQL</span>
                    <span className="text-terminal-500">███████░░░</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-terminal-300">Docker</span>
                    <span className="text-terminal-500">██████░░░░</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-terminal-300">AWS</span>
                    <span className="text-terminal-500">█████░░░░░</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Philosophy */}
          <section className="border border-terminal-400 p-6">
            <div className="font-pixel text-xs text-terminal-400 mb-4">
              &gt; cat philosophy.md
            </div>
            <div className="text-white space-y-4">
              <h3 className="font-pixel text-sm">DEVELOPMENT PHILOSOPHY</h3>
              <ul className="space-y-2 text-terminal-300">
                <li className="flex items-start">
                  <span className="text-terminal-500 mr-3">&gt;</span>
                  Clean, maintainable code is more valuable than clever code
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-500 mr-3">&gt;</span>
                  Performance matters, but premature optimization is the root of all evil
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-500 mr-3">&gt;</span>
                  User experience should drive technical decisions
                </li>
                <li className="flex items-start">
                  <span className="text-terminal-500 mr-3">&gt;</span>
                  Continuous learning is essential in our ever-evolving field
                </li>
              </ul>
            </div>
          </section>

          {/* Current Status */}
          <section className="border border-terminal-400 p-6">
            <div className="font-pixel text-xs text-terminal-400 mb-4">
              &gt; ps aux | grep current_status
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Status:</span>
                <span className="font-pixel text-xs px-2 py-1 border border-green-500 text-green-500">
                  AVAILABLE_FOR_OPPORTUNITIES
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Location:</span>
                <span className="text-terminal-300">Remote / Global</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Focus:</span>
                <span className="text-terminal-300">Full-stack Development</span>
              </div>
            </div>
          </section>

          {/* Connect */}
          <section className="border border-terminal-400 p-6">
            <div className="font-pixel text-xs text-terminal-400 mb-4">
              &gt; find . -name "contact*"
            </div>
            <div className="text-white">
              <p className="mb-4">Interested in collaborating or discussing opportunities?</p>
              <div className="space-y-2">
                <div className="font-mono text-sm">
                  <span className="text-terminal-400">Email:</span>
                  <span className="text-terminal-300 ml-2">caspian@example.com</span>
                </div>
                <div className="font-mono text-sm">
                  <span className="text-terminal-400">GitHub:</span>
                  <span className="text-terminal-300 ml-2">github.com/caspian</span>
                </div>
                <div className="font-mono text-sm">
                  <span className="text-terminal-400">LinkedIn:</span>
                  <span className="text-terminal-300 ml-2">linkedin.com/in/caspian</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}