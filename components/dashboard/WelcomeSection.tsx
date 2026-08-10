"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

interface Props {
  user: any;
  userProfile: any;
}

export function WelcomeSection({
  user,
  userProfile,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Hoş Geldin,{" "}
          {userProfile?.adSoyad ||
            user?.displayName ||
            "Öğrenci"}
        </h1>

        <div className="flex flex-wrap gap-2 mt-3">
          {userProfile?.alan && (
            <Badge>
              {userProfile.alan}
            </Badge>
          )}

          {userProfile?.sinif && (
            <Badge>
              {userProfile.sinif}. Sınıf
            </Badge>
          )}
        </div>

        <p className="mt-4 text-slate-500 dark:text-slate-400">
          Hedef:{" "}
          {userProfile?.hedefUniversite || "Üniversite"}{" "}
          {userProfile?.hedefBolum || "Bölüm"}

          {userProfile?.hedefSiralama && (
            <>
              {" "}
              • Hedef Derece #{userProfile.hedefSiralama}
            </>
          )}
        </p>
      </div>

      <Link
        href="/deneme/ekle"
        className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 transition px-6 py-3 text-white font-semibold shadow"
      >
        + Deneme Ekle
      </Link>
    </div>
  );
}