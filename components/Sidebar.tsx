"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/gobernador", label: "Panel Gobernador" }
];

export function Sidebar({ role }: { role?: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-institution-dark text-white min-h-screen p-6">
      <div className="mb-8 border-b border-white/20 pb-4">
        <h1 className="text-xl font-bold">SIGDEP Caazapá</h1>
        <p className="text-xs text-slate-200">Gobernación de Caazapá</p>
      </div>
      <nav className="space-y-2">
        {links
          .filter((link) => role === "GOBERNADOR" || link.href !== "/gobernador")
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "block rounded-md px-3 py-2 text-sm transition",
                pathname === link.href ? "bg-white text-institution-dark" : "hover:bg-white/10"
              )}
            >
              {link.label}
            </Link>
          ))}
      </nav>
    </aside>
  );
}
