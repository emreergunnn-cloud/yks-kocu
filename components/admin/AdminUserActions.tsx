"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import {
  deleteAdminUser,
  updateAdminUserRole,
} from "../../services/adminService";

interface AdminUserActionsProps {
  uid: string;
  role: string;
  loading: string | null;
  canManage: boolean;
  userName: string;
  onRoleChange: (uid: string, role: string) => void;
  onDelete: (uid: string, name: string) => void;
}

export function AdminUserActions({
  uid,
  role,
  loading,
  canManage,
  userName,
  onRoleChange,
  onDelete,
}: AdminUserActionsProps) {
  const isLoading =
    loading === `role-${uid}` ||
    loading === `delete-${uid}`;

  const normalizedRole = role.trim().toLowerCase();

  const isSuperAdmin =
    normalizedRole === "baş admin" ||
    normalizedRole === "superadmin" ||
    normalizedRole === "super admin";

  const handleRoleChange = async (newRole: string) => {
    if (!canManage || isLoading || isSuperAdmin || newRole === normalizedRole) {
      return;
    }

    const confirmed = window.confirm(
      `"${userName}" kullanıcısının rolünü "${newRole}" olarak değiştirmek istediğinize emin misiniz?`
    );

    if (!confirmed) {
      // Revert the select visually if user cancels
      return;
    }

    try {
      // TypeScript requires strict type for role
      await updateAdminUserRole(uid, newRole as "student" | "parent" | "coach" | "secretary" | "admin");
      onRoleChange(uid, newRole);
    } catch (error) {
      console.error("Rol değiştirme hatası:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Kullanıcı rolü değiştirilemedi."
      );
    }
  };

  const handleDelete = async () => {
    if (!canManage || isLoading || isSuperAdmin) {
      return;
    }

    const confirmed = window.confirm(
      `"${userName}" kullanıcısını tamamen silmek istediğinize emin misiniz?\n\n` +
        "Bu işlem Firebase Authentication hesabını ve " +
        "Firestore kullanıcı profilini kalıcı olarak silecektir.\n\n" +
        "Bu işlem geri alınamaz."
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminUser(uid);
      onDelete(uid, userName);
    } catch (error) {
      console.error("Kullanıcı silme hatası:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Kullanıcı silinemedi."
      );
    }
  };

  if (isSuperAdmin || !canManage) {
    return (
      <span className="text-xs text-slate-400">
        —
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={normalizedRole}
        onChange={(e) => handleRoleChange(e.target.value)}
        disabled={isLoading}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-blue-400 dark:focus:ring-blue-400"
      >
        <option value="student">Öğrenci</option>
        <option value="parent">Veli</option>
        <option value="coach">Koç</option>
        <option value="secretary">Sekreter</option>
        <option value="admin">Admin</option>
      </select>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {isLoading ? "Siliniyor..." : "Sil"}
      </button>
    </div>
  );
}
