"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";

const NAV_ITEMS = [
  { href: "/admin", label: "~/dashboard", exact: true },
  { href: "/admin/posts", label: "~/posts" },
  { href: "/admin/projects", label: "~/projects" },
  { href: "/admin/videos", label: "~/videos" },
  { href: "/admin/timeline", label: "~/timeline" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-56 flex-col border-r border-terminal-400 bg-black">
      <div className="border-b border-terminal-400 px-4 py-4">
        <Link href="/admin" className="font-pixel text-sm text-white">
          ADMIN CMS
        </Link>
        <div className="mt-1 font-pixel text-xs text-terminal-500">
          caspianalmerud.se
        </div>
      </div>

      <nav className="flex-1 px-2 py-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`mb-1 block px-3 py-2 font-pixel text-xs transition-colors ${
              isActive(item.href, item.exact)
                ? "border border-white bg-white text-black"
                : "border border-transparent text-terminal-400 hover:border-terminal-400 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-terminal-400 px-2 py-4">
        <button
          onClick={logout}
          className="w-full px-3 py-2 text-left font-pixel text-xs text-terminal-500 transition-colors hover:text-white"
        >
          logout
        </button>
      </div>
    </aside>
  );
}
