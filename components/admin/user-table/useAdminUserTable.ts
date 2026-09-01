"use client";

import { useMemo, useState } from "react";
import type { AdminUserRow } from "../../../services/adminService";
import type { SortDirection, SortKey } from "./types";

export function useAdminUserTable(users: AdminUserRow[], search: string) {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  const copyUid = async (uid: string) => {
    try {
      await navigator.clipboard.writeText(uid);
      setCopiedUid(uid);
      setTimeout(() => setCopiedUid(null), 1500);
    } catch { /* Clipboard erişimi başarısız olursa sessizce geç. */ }
  };

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();
    return users.filter((user) => !query || [user.uid, user.adSoyad, user.email, user.alan, user.sinif, user.role]
      .some((value) => value.toLowerCase().includes(query)))
      .sort((a, b) => {
        const first = String(a[sortKey] ?? "").toLowerCase();
        const second = String(b[sortKey] ?? "").toLowerCase();
        if (first === second) return 0;
        const direction = first < second ? -1 : 1;
        return sortDirection === "asc" ? direction : -direction;
      });
  }, [users, search, sortKey, sortDirection]);

  return { sortKey, sortDirection, copiedUid, filteredUsers, handleSort, copyUid };
}
