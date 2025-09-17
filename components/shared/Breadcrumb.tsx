"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  className?: string;
  customItems?: BreadcrumbItem[];
}

export function Breadcrumb({ className, customItems }: BreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname if no custom items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;
    if (!pathname) return [];

    const segments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: "HOME", href: "/" }];

    let currentPath = "";
    segments.forEach((segment) => {
      currentPath += `/${segment}`;

      // Convert slug to readable label
      let label = segment.toUpperCase().replace(/-/g, " ");

      // Special cases for better labels
      if (segment === "cv") label = "CV";
      if (segment.match(/^\d{4}-\d{2}-\d{2}/)) {
        // For blog post dates, show just the title part
        label = segment
          .replace(/^\d{4}-\d{2}-\d{2}-/, "")
          .replace(/-/g, " ")
          .toUpperCase();
      }

      items.push({
        label,
        href: currentPath,
      });
    });

    return items;
  };

  const breadcrumbItems = generateBreadcrumbs();

  // Don't show breadcrumbs on home page or if no pathname
  if (!pathname || pathname === "" || pathname === "/") return null;

  return (
    <nav
      className={cn("flex items-center space-x-1 text-sm", className)}
      aria-label="Breadcrumb"
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <div key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight
                size={12}
                className="mx-2 text-terminal-500"
                aria-hidden="true"
              />
            )}

            {index === 0 && (
              <Home
                size={12}
                className="mr-1 text-terminal-400"
                aria-hidden="true"
              />
            )}

            {isLast ? (
              <span
                className="font-pixel text-xs text-white"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="font-pixel text-xs text-terminal-400 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
