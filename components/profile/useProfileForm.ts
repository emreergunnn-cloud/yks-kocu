"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveUserProfile } from "@/services/userService";
import type { AlanOption, SinifOption } from "@/types/user";

export function useProfileForm() {
  const auth = useAuth();
  const { user, userProfile } = auth;
  const [adSoyad, setAdSoyad] = useState(userProfile?.adSoyad || user?.displayName || "");
  const [sinif, setSinif] = useState<SinifOption | "">(userProfile?.sinif || "");
  const [alan, setAlan] = useState<AlanOption | "">(userProfile?.alan || "");
  const [hedefUniversite, setHedefUniversite] = useState(userProfile?.hedefUniversite || "");
  const [hedefBolum, setHedefBolum] = useState(userProfile?.hedefBolum || "");
  const [hedefSiralama, setHedefSiralama] = useState(userProfile?.hedefSiralama || "");
  const [mezuniyetYili, setMezuniyetYili] = useState(userProfile?.mezuniyetYili || new Date().getFullYear());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!userProfile) return;
    setAdSoyad(userProfile.adSoyad || user?.displayName || "");
    setSinif(userProfile.sinif || ""); setAlan(userProfile.alan || "");
    setHedefUniversite(userProfile.hedefUniversite || ""); setHedefBolum(userProfile.hedefBolum || "");
    setHedefSiralama(userProfile.hedefSiralama || ""); setMezuniyetYili(userProfile.mezuniyetYili || new Date().getFullYear());
  }, [userProfile, user]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault(); if (!user) return; setSaving(true); setMsg(null);
    try {
      await saveUserProfile({ uid: user.uid, adSoyad, email: user.email, photoURL: user.photoURL, sinif, alan, hedefUniversite, hedefBolum, hedefSiralama: Number(hedefSiralama) || 0, mezuniyetYili: Number(mezuniyetYili) || new Date().getFullYear() });
      await auth.refreshUserProfile();
      setMsg({ type: "success", text: "Profil ve hedef bilgileriniz başarıyla güncellendi." });
    } catch (error) {
      console.error("Profile update error:", error);
      setMsg({ type: "error", text: "Profil güncellenirken bir hata oluştu." });
    } finally { setSaving(false); }
  };

  return { ...auth, adSoyad, setAdSoyad, sinif, setSinif, alan, setAlan, hedefUniversite, setHedefUniversite, hedefBolum, setHedefBolum, hedefSiralama, setHedefSiralama, mezuniyetYili, setMezuniyetYili, saving, msg, handleSave };
}
