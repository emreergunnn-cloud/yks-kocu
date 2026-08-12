"use client";

import React, { useState } from "react";
import {
  Search,
  Users,
  Copy,
  Check,
} from "lucide-react";

import { AdminUserRow } from "../../services/adminService";
import { AdminRoleBadge } from "./AdminRoleBadge";
import { AdminUserActions } from "./AdminUserActions";

interface AdminUserTableProps {
  users: AdminUserRow[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  actionLoading: string | null;
  canManageUsers: boolean;
  onRoleChange: (uid: string, role: string) => void;
  onDelete: (uid: string, name: string) => void;
}

type SortKey = keyof AdminUserRow;
type SortDirection = "asc" | "desc";

export const AdminUserTable: React.FC<AdminUserTableProps> = ({
  users,
  loading,
  search,
  onSearchChange,
  actionLoading,
  canManageUsers,
  onRoleChange,
  onDelete,
}) => {
  const [sortKey, setSortKey] =
    useState<SortKey>("createdAt");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("desc");

  const [copiedUid, setCopiedUid] =
    useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  const copyUid = async (uid: string) => {
    try {
      await navigator.clipboard.writeText(uid);

      setCopiedUid(uid);

      setTimeout(() => {
        setCopiedUid(null);
      }, 1500);
    } catch {
      // Clipboard erişimi başarısız olursa sessizce geçiyoruz.
    }
  };

  const query = search.toLowerCase().trim();

  const filteredUsers = users
    .filter((user) => {
      if (!query) return true;

      return (
        user.uid.toLowerCase().includes(query) ||
        user.adSoyad.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.alan.toLowerCase().includes(query) ||
        user.sinif.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const first = String(a[sortKey] ?? "").toLowerCase();
      const second = String(b[sortKey] ?? "").toLowerCase();

      if (first < second) {
        return sortDirection === "asc" ? -1 : 1;
      }

      if (first > second) {
        return sortDirection === "asc" ? 1 : -1;
      }

      return 0;
    });

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (column !== sortKey) return null;

    return (
      <span className="ml-1 text-blue-500">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const Header = ({
    label,
    column,
  }: {
    label: string;
    column: SortKey;
  }) => (
    <th
      onClick={() => handleSort(column)}
      className="cursor-pointer whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
    >
      {label}
      <SortIcon column={column} />
    </th>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Kullanıcılar
          </h2>

          {!loading && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {filteredUsers.length} / {users.length} kullanıcı
              gösteriliyor
            </p>
          )}
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="UID, ad, e-posta, alan veya rol ara..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {search
                ? "Arama sonucu bulunamadı."
                : "Henüz kayıtlı kullanıcı yok."}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <Header label="Kullanıcı" column="adSoyad" />
                <Header label="E-posta" column="email" />
                <Header label="Alan" column="alan" />
                <Header label="Sınıf" column="sinif" />
                <Header label="Rol" column="role" />
                <Header
                  label="Kayıt Tarihi"
                  column="createdAt"
                />

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  İşlemler
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <tr
                  key={user.uid}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="min-w-[220px] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">
                        {user.adSoyad !== "-"
                          ? user.adSoyad
                              .charAt(0)
                              .toUpperCase()
                          : "?"}
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate font-medium text-slate-800 dark:text-slate-200">
                          {user.adSoyad}
                        </p>

                        <div className="mt-1 flex items-center gap-1">
                          <span
                            title={user.uid}
                            className="max-w-[145px] truncate font-mono text-[10px] text-slate-400"
                          >
                            {user.uid}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              copyUid(user.uid)
                            }
                            className="rounded p-0.5 text-slate-400 hover:text-blue-500"
                            title="UID kopyala"
                          >
                            {copiedUid === user.uid ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="max-w-[220px] px-4 py-3 text-slate-600 dark:text-slate-400">
                    <span className="block truncate">
                      {user.email}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                    {user.alan}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                    {user.sinif}
                  </td>

                  <td className="px-4 py-3">
                    <AdminRoleBadge role={user.role} />
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>

                  <td className="px-4 py-3">
                    <AdminUserActions
                      uid={user.uid}
                      role={user.role}
                      loading={actionLoading}
                      canManage={canManageUsers}
                      userName={user.adSoyad}
                      onRoleChange={onRoleChange}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};