import type { AdminUserRow } from "../../../services/adminService";

export interface AdminUserTableProps {
  users: AdminUserRow[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  actionLoading: string | null;
  canManageUsers: boolean;
  onRoleChange: (uid: string, role: string) => void;
  onDelete: (uid: string, name: string) => void;
}

export type SortKey = keyof AdminUserRow;
export type SortDirection = "asc" | "desc";
