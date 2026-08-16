"use client";

import {
  ExternalLink,
} from "lucide-react";

import {
  openExternalUrl,
} from "@/lib/native/openExternalUrl";

import type {
  MebResource,
} from "@/types/remediation";

interface Props {
  resource: MebResource;
}

export function MebResourceButton({
  resource,
}: Props) {
  return (
    <button
      type="button"
      onClick={() =>
        void openExternalUrl(
          resource.url
        )
      }
      className="flex items-center justify-between gap-2 rounded-lg border border-amber-200 bg-white px-2.5 py-2 text-left text-[10px] font-semibold dark:border-amber-900 dark:bg-slate-900"
    >
      {resource.label}

      <ExternalLink className="w-3 h-3 shrink-0" />
    </button>
  );
}