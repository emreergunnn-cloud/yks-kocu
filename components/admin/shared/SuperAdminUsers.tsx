"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminUsers, AdminUserRow } from "../../../services/adminService";
import { RoleBadge } from "./RoleBadge";

export function SuperAdminUsers(): React.ReactElement {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getAdminUsers(100);
      setUsers(data);
    } catch (error) {
      console.error("Kullanıcılar alınamadı:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Tüm Kullanıcılar
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Superadmin olarak tüm kullanıcıları görüntüleyebilirsiniz.
            </p>
          </div>

          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {loading ? "Yükleniyor..." : "Yenile"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                Kullanıcı
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                E-posta
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
                Rol
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Kullanıcılar yükleniyor...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Kullanıcı bulunamadı.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.uid}
                  className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    {user.adSoyad || "İsimsiz Kullanıcı"}
                  </td>

                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {user.email || "-"}
                  </td>

                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
