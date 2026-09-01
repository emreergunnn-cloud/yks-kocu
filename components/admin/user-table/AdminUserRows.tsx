import { Check, Copy } from "lucide-react";
import type { AdminUserRow } from "../../../services/adminService";
import { AdminRoleBadge } from "../AdminRoleBadge";
import { AdminUserActions } from "../AdminUserActions";

interface Props {
  users: AdminUserRow[];
  copiedUid: string | null;
  actionLoading: string | null;
  canManageUsers: boolean;
  onCopyUid: (uid: string) => void;
  onRoleChange: (uid: string, role: string) => void;
  onDelete: (uid: string, name: string) => void;
}

function UserIdentity({ user, copied, onCopy }: { user: AdminUserRow; copied: boolean; onCopy: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">{user.adSoyad !== "-" ? user.adSoyad.charAt(0).toUpperCase() : "?"}</div>
      <div className="min-w-0">
        <p className="max-w-[180px] truncate font-medium text-slate-800 dark:text-slate-200">{user.adSoyad}</p>
        <div className="mt-1 flex items-center gap-1">
          <span title={user.uid} className="max-w-[145px] truncate font-mono text-[10px] text-slate-400">{user.uid}</span>
          <button type="button" onClick={onCopy} className="rounded p-0.5 text-slate-400 hover:text-blue-500" title="UID kopyala">
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminUserRows({ users, copiedUid, actionLoading, canManageUsers, onCopyUid, onRoleChange, onDelete }: Props) {
  return (
    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
      {users.map((user) => (
        <tr key={user.uid} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
          <td className="min-w-[220px] px-4 py-3"><UserIdentity user={user} copied={copiedUid === user.uid} onCopy={() => onCopyUid(user.uid)} /></td>
          <td className="max-w-[220px] px-4 py-3 text-slate-600 dark:text-slate-400"><span className="block truncate">{user.email}</span></td>
          <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">{user.alan}</td>
          <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">{user.sinif}</td>
          <td className="px-4 py-3"><AdminRoleBadge role={user.role} /></td>
          <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</td>
          <td className="px-4 py-3"><AdminUserActions uid={user.uid} role={user.role} loading={actionLoading} canManage={canManageUsers} userName={user.adSoyad} onRoleChange={onRoleChange} onDelete={onDelete} /></td>
        </tr>
      ))}
    </tbody>
  );
}
