import Header from "@/components/shared/Header";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { CVTimeline } from "@/components/cv/CVTimeline";
import type {
  TimelineItem,
  TimelineCategory,
} from "@/components/cv/CVTimeline";
import { PageTransition } from "@/components/shared/PageTransition";
import { ScrollAnimated } from "@/components/shared/ScrollAnimated";
import { TypewriterText } from "@/components/shared/TypewriterText";
import { getTimelineEntries, serialize } from "@/lib/cms/queries";

// Category metadata (labels + colors for the filter UI)
const CATEGORIES: Record<string, TimelineCategory> = {
  work: { label: "Work Experience", color: "#00ff00" },
  education: { label: "Education", color: "#8000ff" },
  skill: { label: "Skills", color: "#ff0080" },
  personal: { label: "Personal", color: "#00ff80" },
  certification: { label: "Certifications", color: "#ffff00" },
  project: { label: "Projects", color: "#0080ff" },
  volunteer: { label: "Volunteering", color: "#ffbf00" },
};

export const metadata = {
  title: "CV",
  description: "Professional experience and career timeline",
};

export default async function CVPage() {
  const entries = await getTimelineEntries();
  const items: TimelineItem[] = serialize(entries).map(
    (e) => ({
      id: e.entryId as string,
      type: e.type as TimelineItem["type"],
      title: e.title as string,
      company: (e.company as string) || undefined,
      institution: (e.institution as string) || undefined,
      category: (e.category as string) || undefined,
      location: (e.location as string) || undefined,
      startDate: e.startDate as string,
      endDate: e.endDate as string | null | undefined,
      current: e.current as boolean | undefined,
      description: e.description as string,
      responsibilities: (e.responsibilities as string[]) || [],
      details: (e.details as string[]) || [],
      achievements: (e.achievements as string[]) || [],
      skills: (e.skills as string[]) || [],
      level: (e.level as string) || undefined,
      yearsOfExperience: (e.yearsOfExperience as number) || undefined,
      impact: (e.impact as string) || undefined,
      issuer: (e.issuer as string) || undefined,
      credentialId: (e.credentialId as string) || undefined,
      links:
        e.links && Object.keys(e.links as object).length > 0
          ? (e.links as Record<string, string>)
          : undefined,
    }),
  );

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
              <TypewriterText
                text="caspian@localhost:~$ cat cv.json"
                speed={40}
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
              CAREER_PATH/
            </h1>
            <p className="text-terminal-300 max-w-2xl">
              Interactive timeline of my professional journey, skills
              development, and key milestones. Click on nodes to expand details.
            </p>
          </div>
        </ScrollAnimated>

        {/* Timeline Component */}
        <ScrollAnimated animation="scale-in" delay={400}>
          <CVTimeline items={items} categories={CATEGORIES} />
        </ScrollAnimated>
      </main>
    </div>
  );
}
