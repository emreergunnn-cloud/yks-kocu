"use client";

import {
  Shield,
  ShieldCheck,
  User,
  Users,
  Briefcase,
  BookOpen
} from "lucide-react";

interface AdminRoleBadgeProps {
  role: string;
}

export function AdminRoleBadge({
  role,
}: AdminRoleBadgeProps) {
  const normalizedRole = (role || "student").toLowerCase();

  if (normalizedRole === "superadmin" || normalizedRole === "super_admin" || normalizedRole === "baş admin") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        Baş Admin
      </span>
    );
  }

  if (normalizedRole === "admin") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
        <Shield className="h-3.5 w-3.5" />
        Admin
      </span>
    );
  }

  if (normalizedRole === "secretary") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-600 dark:text-purple-400">
        <Briefcase className="h-3.5 w-3.5" />
        Sekreter
      </span>
    );
  }


  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/30 bg-slate-500/10 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
      <User className="h-3.5 w-3.5" />
      Öğrenci
    </span>
  );
}
