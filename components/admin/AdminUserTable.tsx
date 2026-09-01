"use client";

import { Users } from "lucide-react";
import { AdminUserRows } from "./user-table/AdminUserRows";
import { AdminUserTableToolbar } from "./user-table/AdminUserTableToolbar";
import type { AdminUserTableProps, SortKey } from "./user-table/types";
import { useAdminUserTable } from "./user-table/useAdminUserTable";

export function AdminUserTable(props: AdminUserTableProps) {
  const table = useAdminUserTable(props.users, props.search);
  const Header = ({ label, column }: { label: string; column: SortKey }) => (
    <th onClick={() => table.handleSort(column)} className="cursor-pointer whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
      {label}{column === table.sortKey && <span className="ml-1 text-blue-500">{table.sortDirection === "asc" ? "↑" : "↓"}</span>}
    </th>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <AdminUserTableToolbar loading={props.loading} search={props.search} shownCount={table.filteredUsers.length} totalCount={props.users.length} onSearchChange={props.onSearchChange} />
      <div className="overflow-x-auto">
        {props.loading ? <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
          : table.filteredUsers.length === 0 ? <div className="p-12 text-center"><Users className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" /><p className="text-sm text-slate-500 dark:text-slate-400">{props.search ? "Arama sonucu bulunamadı." : "Henüz kayıtlı kullanıcı yok."}</p></div>
          : <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50"><tr>
                <Header label="Kullanıcı" column="adSoyad" /><Header label="E-posta" column="email" /><Header label="Alan" column="alan" /><Header label="Sınıf" column="sinif" /><Header label="Rol" column="role" /><Header label="Kayıt Tarihi" column="createdAt" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">İşlemler</th>
              </tr></thead>
              <AdminUserRows users={table.filteredUsers} copiedUid={table.copiedUid} actionLoading={props.actionLoading} canManageUsers={props.canManageUsers} onCopyUid={table.copyUid} onRoleChange={props.onRoleChange} onDelete={props.onDelete} />
            </table>}
      </div>
    </div>
  );
}
