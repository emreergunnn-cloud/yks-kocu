import type { ReactNode } from "react";
import { BarChart2, BookOpen, Brain, Calculator, CalendarDays, ClipboardList, LayoutDashboard, Settings, ShieldCheck, Timer, Trophy, User } from "lucide-react";

export interface NavItem { name: string; href: string; icon: ReactNode; badge?: string; }
export interface NavGroup { label: string; items: NavItem[]; }

export const navGroups: NavGroup[] = [
  { label: "Ana Sayfa", items: [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Analizler", href: "/analytics", icon: <BarChart2 className="h-4 w-4" /> },
  ]},
  { label: "Çalışma", items: [
    { name: "Konular", href: "/subjects", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Denemeler", href: "/deneme", icon: <ClipboardList className="h-4 w-4" /> },
    { name: "Çalışma Planı", href: "/program", icon: <Brain className="h-4 w-4" /> },
    { name: "Çalışma Zamanlayıcı", href: "/study", icon: <Timer className="h-4 w-4" /> },
    { name: "Sıralama Hesaplayıcı", href: "/calculator", icon: <Calculator className="h-4 w-4" /> },
    { name: "Takvim", href: "/calendar", icon: <CalendarDays className="h-4 w-4" /> },
  ]},
  { label: "Kişisel", items: [
    { name: "Başarılar", href: "/achievements", icon: <Trophy className="h-4 w-4" /> },
    { name: "Profil", href: "/profile", icon: <User className="h-4 w-4" /> },
    { name: "Hesap ve Güvenlik", href: "/account", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Ayarlar", href: "/settings", icon: <Settings className="h-4 w-4" /> },
  ]},
];
