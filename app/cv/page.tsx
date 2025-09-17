import Header from "@/components/shared/Header";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { CVTimeline } from "@/components/cv/CVTimeline";

export const metadata = {
  title: "CV",
  description: "Professional experience and career timeline",
};

export default function CVPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb />
        </div>

        {/* Terminal Header */}
        <div className="mb-12">
          <div className="font-pixel text-sm text-terminal-400 mb-2">
            caspian@localhost:~$ cat cv.json
          </div>
          <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
            CAREER_PATH/
          </h1>
          <p className="text-terminal-300 max-w-2xl">
            Interactive timeline of my professional journey, skills development,
            and key milestones. Click on nodes to expand details.
          </p>
        </div>

        {/* Timeline Component */}
        <CVTimeline />
      </main>
    </div>
  );
}
