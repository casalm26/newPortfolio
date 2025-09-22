import Header from "@/components/shared/Header";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { CVTimeline } from "@/components/cv/CVTimeline";
import { PageTransition } from "@/components/shared/PageTransition";
import { ScrollAnimated } from "@/components/shared/ScrollAnimated";
import { TypewriterText } from "@/components/shared/TypewriterText";

export const metadata = {
  title: "CV",
  description: "Professional experience and career timeline",
};

export default function CVPage() {
  return (
    <div className="min-h-screen bg-black">
      <ScrollAnimated animation="fade-in">
        <Header />
      </ScrollAnimated>

      <main className="container mx-auto px-4 pt-24 pb-12">
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
              <TypewriterText text="caspian@localhost:~$ cat cv.json" speed={40} />
            </div>
            <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
              CAREER_PATH/
            </h1>
            <p className="text-terminal-300 max-w-2xl">
              Interactive timeline of my professional journey, skills development,
              and key milestones. Click on nodes to expand details.
            </p>
          </div>
        </ScrollAnimated>

        {/* Timeline Component */}
        <ScrollAnimated animation="scale-in" delay={400}>
          <CVTimeline />
        </ScrollAnimated>
      </main>
    </div>
  );
}
