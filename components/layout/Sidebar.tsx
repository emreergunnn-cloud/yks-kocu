"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    name: "Analizler & Trendler",
    href: "/analytics",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    name: "Deneme Sonuçları",
    href: "/deneme",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: "Profil & Hedefler",
    href: "/profile",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-3">
        Ana Menü
      </div>
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              {item.icon(isActive)}
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
        YKS Koçu v0.3.0 (Phase 3)
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-slate-950 z-50 lg:hidden transform transition-transform duration-200 ease-in-out border-r border-slate-200 dark:border-slate-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
