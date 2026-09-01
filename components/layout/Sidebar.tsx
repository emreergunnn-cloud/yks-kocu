"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { SidebarNav } from "./sidebar/SidebarNav";

interface SidebarProps { isOpen?: boolean; onClose?: () => void; }

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { userProfile } = useAuth();
  const role = String((userProfile as { role?: string } | null)?.role ?? "").toLowerCase();
  const isAdmin = role === "admin" || role === "superadmin";
  const isActive = (href: string) => pathname === href || (href === "/dashboard" && pathname === "/") || (pathname.startsWith(href) && href !== "/dashboard");
  const content = <SidebarNav isAdmin={isAdmin} isActive={isActive} onClose={onClose} />;

  return (
    <>
      <aside className="hidden w-60 shrink-0 border-r border-slate-200/80 bg-white/60 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/60 lg:block">{content}</aside>
      {isOpen && <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={`fixed bottom-0 left-0 top-0 z-50 w-60 transform border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-950 lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>{content}</aside>
    </>
  );
}
