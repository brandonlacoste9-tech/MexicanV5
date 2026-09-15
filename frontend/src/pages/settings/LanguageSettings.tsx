/**
 * Language Settings — Español mexicano primary, English toggle.
 */
import React from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useSettingsPreferences } from "@/hooks/useSettingsPreferences";
import { toast } from "@/components/Toast";
import { useHaptics } from "@/hooks/useHaptics";
import { region } from "@/config/region";

export const LanguageSettings: React.FC = () => {
  const { preferences, setPreference } = useSettingsPreferences();
  const { tap } = useHaptics();

  const handleLanguageSelect = (lang: "es" | "en") => {
    tap();
    setPreference("language", lang);
    try {
      localStorage.setItem("ojea_language", lang === "es" ? region.locale : "en");
    } catch {
      /* ignore */
    }
    toast.success(lang === "es" ? "Idioma: Español mexicano" : "Language: English");
  };

  return (
    <div className="min-h-screen bg-black leather-overlay pb-20">
      <Header title="Idioma / Language" showBack={true} showSearch={false} />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="leather-card rounded-xl p-6 stitched border border-gold-500/30">
          <div className="text-center">
            <h2 className="text-gold-400 font-bold text-lg mb-1">
              Ojea habla español mexicano
            </h2>
            <p className="text-white text-sm">
              Pack {region.brand} · {region.locale} · {region.timezone}
            </p>
          </div>
        </div>

        <div className="leather-card rounded-xl p-4 stitched">
          <h3 className="text-white font-semibold mb-4">Idioma principal</h3>
          <button
            onClick={() => handleLanguageSelect("es")}
            className={`w-full text-left p-5 rounded-xl transition-all min-h-14 ${
              preferences.language === "es"
                ? "bg-gold-500/20 border-2 border-gold-500"
                : "bg-leather-800/50 border-2 border-transparent hover:bg-leather-700/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-lg">Español mexicano</p>
                <p className="text-leather-400 text-sm">
                  La app, el feed y Güey hablan de aquí.
                </p>
              </div>
              {preferences.language === "es" && (
                <span className="text-gold-500 text-2xl">✓</span>
              )}
            </div>
          </button>
        </div>

        <div className="leather-card rounded-xl p-4 stitched">
          <button
            onClick={() => handleLanguageSelect("en")}
            className={`w-full text-left p-5 rounded-xl transition-all min-h-14 ${
              preferences.language === "en"
                ? "bg-gold-500/20 border-2 border-gold-500"
                : "bg-leather-800/50 border-2 border-transparent hover:bg-leather-700/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-lg">English</p>
                <p className="text-leather-400 text-sm">
                  Interface in English. Clips stay in the language they were posted.
                </p>
              </div>
              {preferences.language === "en" && (
                <span className="text-gold-500 text-2xl">✓</span>
              )}
            </div>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default LanguageSettings;
