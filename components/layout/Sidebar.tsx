"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart2,
  BookOpen,
  ClipboardList,
  Timer,
  Trophy,
  CalendarDays,
  Settings,
  User,
  Brain,
  Calculator,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const navGroups: NavGroup[] = [
  {
    label: "Ana Sayfa",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
      { name: "Analizler", href: "/analytics", icon: <BarChart2 className="w-4 h-4" /> },
    ],
  },
  {
    label: "Çalışma",
    items: [
      { name: "Konular", href: "/subjects", icon: <BookOpen className="w-4 h-4" /> },
      { name: "Denemeler", href: "/deneme", icon: <ClipboardList className="w-4 h-4" /> },
      { name: "Çalışma Planı", href: "/program", icon: <Brain className="w-4 h-4" /> },
      { name: "Çalışma Zamanlayıcı", href: "/study", icon: <Timer className="w-4 h-4" /> },
      { name:  "Sıralama Hesaplayıcı",  href: "/calculator",icon: <Calculator className="w-4 h-4" />,},
      { name: "Takvim", href: "/calendar", icon: <CalendarDays className="w-4 h-4" /> },
    ],
  },
  {
    label: "Kişisel",
    items: [
      { name: "Başarılar", href: "/achievements", icon: <Trophy className="w-4 h-4" /> },
      { name: "Profil", href: "/profile", icon: <User className="w-4 h-4" /> },
      { name: "Ayarlar", href: "/settings", icon: <Settings className="w-4 h-4" /> },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href ||
    (href === "/dashboard" && pathname === "/") ||
    (pathname.startsWith(href) && href !== "/dashboard");

  const sidebarContent = (
    <div className="flex flex-col h-full py-5 px-3 overflow-y-auto">
      {navGroups.map((group) => (
        <div key={group.label} className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 px-3 mb-1.5">
            {group.label}
          </p>
          <nav className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-all group ${
                    active
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <span className={active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}

      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 text-center">
        YKS Koçu v0.5.0
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-60 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl shrink-0">
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
        className={`fixed top-0 left-0 bottom-0 w-60 bg-white dark:bg-slate-950 z-50 lg:hidden transform transition-transform duration-200 ease-in-out border-r border-slate-200 dark:border-slate-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
