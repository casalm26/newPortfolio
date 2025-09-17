export const searchLinks: Array<{
  id: string;
  name: string;
  keywords: string;
  shortcut?: string[];
  section: string;
  href: string;
}> = [
  // Navigation
  {
    id: "home",
    name: "Home",
    keywords: "landing page pixel art animation typewriter",
    shortcut: ["h"],
    section: "Navigation",
    href: "/",
  },
  {
    id: "about",
    name: "About",
    keywords: "generalist developer profile skills experience background",
    shortcut: ["a"],
    section: "Navigation",
    href: "/about",
  },
  {
    id: "projects",
    name: "Projects",
    keywords: "portfolio work development technical creative business case studies",
    shortcut: ["p"],
    section: "Navigation",
    href: "/projects",
  },
  {
    id: "games",
    name: "Games",
    keywords: "games interactive pixel art snake tetris pong coding creative",
    shortcut: ["g"],
    section: "Navigation",
    href: "/games",
  },
  {
    id: "cv",
    name: "CV Timeline",
    keywords: "career path resume experience timeline roadmap skills work history",
    shortcut: ["c"],
    section: "Navigation",
    href: "/cv",
  },
  {
    id: "contact",
    name: "Contact",
    keywords: "get in touch email social links collaboration opportunities",
    shortcut: ["k"],
    section: "Navigation",
    href: "/contact",
  },
  {
    id: "blog",
    name: "All Articles",
    keywords: "blog posts articles writing technology insights thoughts",
    shortcut: ["b"],
    section: "Navigation",
    href: "/all-articles",
  },

  // Project Categories
  {
    id: "technical-projects",
    name: "Technical Projects",
    keywords: "code development programming software engineering full-stack",
    section: "Projects",
    href: "/projects?filter=Technical",
  },
  {
    id: "creative-projects",
    name: "Creative Projects",
    keywords: "design art creative visual branding identity",
    section: "Projects",
    href: "/projects?filter=Creative",
  },
  {
    id: "business-projects",
    name: "Business Projects",
    keywords: "strategy consulting optimization business analysis",
    section: "Projects",
    href: "/projects?filter=Business",
  },

  // Skills & Technologies
  {
    id: "react-projects",
    name: "React Projects",
    keywords: "react javascript frontend components hooks",
    section: "Skills",
    href: "/projects?tech=React",
  },
  {
    id: "typescript-projects",
    name: "TypeScript Projects",
    keywords: "typescript type safety javascript development",
    section: "Skills",
    href: "/projects?tech=TypeScript",
  },
  {
    id: "nextjs-projects",
    name: "Next.js Projects",
    keywords: "nextjs next react ssr framework",
    section: "Skills",
    href: "/projects?tech=Next.js",
  },
  {
    id: "nodejs-projects",
    name: "Node.js Projects",
    keywords: "nodejs backend server api development",
    section: "Skills",
    href: "/projects?tech=Node.js",
  },
];
