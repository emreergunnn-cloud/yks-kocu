import Link from "next/link";
import { Crown, LockKeyhole } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function PremiumAnalyticsLocked() {
  return (
    <Card className="border-amber-200 p-5 dark:border-amber-900/70">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-amber-100 p-2 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          <LockKeyhole className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white">Gelişmiş Analizler</h3>
            <Crown className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Son dönem değişimleri, güçlü dersler ve öncelik analizleri Premium hesaplara özeldir.
          </p>
          <Link
            href="/premium"
            className="mt-3 inline-flex rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white hover:bg-amber-600"
          >
            Premium'u incele
          </Link>
        </div>
      </div>
    </Card>
  );
}
