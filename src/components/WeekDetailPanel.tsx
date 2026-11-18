import React, { useState } from "react";
import {
  MaarifLessonPlan,
  DocumentHeaderFooterMeta,
  YillikPlanWeekItem,
} from "../types/lessonPlan";
import {
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Calendar,
  BookOpen,
  FileText,
  CheckCircle2,
  FileDown,
  Layers,
  Sparkles,
  RotateCcw,
  Loader2,
  Check,
} from "lucide-react";

export type WeekDetailFieldOrSectionKey =
  | "section_hafta"
  | "section_ders"
  | "section_ciktilar"
  | "section_yasantilar"
  | "section_farklilastirma"
  | "Ogrenme_Birimi"
  | "Icerik_Cercevesi"
  | "Sure"
  | "Alan_Becerileri"
  | "Egilimler"
  | "Programlar_Arasi_Bilesenler"
  | "Ogrenme_Ciktilari_ve_Surec_Bilesenleri"
  | "Ogrenme_Kanitlari"
  | "Temel_Kabuller"
  | "On_Degerlendirme_Sureci"
  | "Kopru_Kurma"
  | "Ogretme_Uygulamalari"
  | "Guduleme"
  | "Dikkat_Cekme"
  | "Ek_Ogretme_Uygulamalari"
  | "Farklilastirma";

interface WeekDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  weeks: YillikPlanWeekItem[];
  selectedWeek: YillikPlanWeekItem;
  onSelectWeek: (weekId: string) => void;
  meta: DocumentHeaderFooterMeta;
  onUpdateMetaField: (key: keyof DocumentHeaderFooterMeta, value: string) => void;
  onUpdateWeekItem: (weekId: string, patch: Partial<YillikPlanWeekItem>) => void;
  activePlan: MaarifLessonPlan;
  hasGeneratedPlan: boolean;
  onUpdatePlan: (updated: MaarifLessonPlan) => void;
  onGenerateOrApplyWeekPlan: () => void;
  onDownloadWord: () => void;
  onReExtractFieldFromSource?: (targetKey: WeekDetailFieldOrSectionKey) => void;
  onAiFixField?: (targetKey: WeekDetailFieldOrSectionKey) => Promise<void>;
}

type SectionFilter =
  | "all"
  | "hafta"
  | "ders"
  | "ciktilar"
  | "yasantilar"
  | "farklilastirma";

export const WeekDetailPanel: React.FC<WeekDetailPanelProps> = ({
  isOpen,
  onClose,
  weeks,
  selectedWeek,
  onSelectWeek,
  meta,
  onUpdateMetaField,
  onUpdateWeekItem,
  activePlan,
  hasGeneratedPlan,
  onUpdatePlan,
  onGenerateOrApplyWeekPlan,
  onDownloadWord,
  onReExtractFieldFromSource,
  onAiFixField,
}) => {
  const [activeSection, setActiveSection] = useState<SectionFilter>("all");
  const [loadingFieldKey, setLoadingFieldKey] = useState<string | null>(null);
  const [feedbackByKey, setFeedbackByKey] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const currentIdx = weeks.findIndex((w) => w.id === selectedWeek?.id);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx >= 0 && currentIdx < weeks.length - 1;

  const showTimedFeedback = (key: string, msg: string) => {
    setFeedbackByKey((prev) => ({ ...prev, [key]: msg }));
    window.setTimeout(() => {
      setFeedbackByKey((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }, 2600);
  };

  const handleTriggerReExtract = (key: WeekDetailFieldOrSectionKey) => {
    if (!onReExtractFieldFromSource) return;
    onReExtractFieldFromSource(key);
    showTimedFeedback(key, "Kaynaktan çekildi");
  };

  const handleTriggerAiFix = async (key: WeekDetailFieldOrSectionKey) => {
    if (!onAiFixField || loadingFieldKey) return;
    setLoadingFieldKey(key);
    try {
      await onAiFixField(key);
      showTimedFeedback(key, "AI ile düzeltildi");
    } finally {
      setLoadingFieldKey(null);
    }
  };

  const renderActionButtons = (
    targetKey: WeekDetailFieldOrSectionKey,
    compact = false
  ) => {
    const isAiLoading = loadingFieldKey === targetKey;
    const feedback = feedbackByKey[targetKey];

    return (
      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
        {feedback && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" />
            {feedback}
          </span>
        )}
        <button
          type="button"
          onClick={() => void handleTriggerAiFix(targetKey)}
          disabled={Boolean(loadingFieldKey)}
          title="Seçilen haftanın öğrenme çıktısına ve Ders Bilgi Formuna göre AI ile analiz et, yabancı başlık/tablo kalıntılarını temizle ve düzelt"
          className={`inline-flex items-center gap-1 rounded-md font-semibold transition-all cursor-pointer border shadow-2xs disabled:opacity-50 ${
            compact
              ? "px-2 py-1 text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200"
              : "px-2.5 py-1 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-700"
          }`}
        >
          {isAiLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3 text-amber-300" />
          )}
          <span>AI ile Düzelt</span>
        </button>

        <button
          type="button"
          onClick={() => handleTriggerReExtract(targetKey)}
          disabled={Boolean(loadingFieldKey)}
          title="Yüklenen Ders Bilgi Formu ve Yıllık Plan kaynağından bu haftanın kazanımına ait orijinal veriyi tekrar çek"
          className={`inline-flex items-center gap-1 rounded-md font-semibold transition-all cursor-pointer border shadow-2xs disabled:opacity-50 ${
            compact
              ? "px-2 py-1 text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200"
              : "px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
          }`}
        >
          <RotateCcw className="w-3 h-3 text-slate-600" />
          <span>Veriyi Kaynaktan Tekrar Çek</span>
        </button>
      </div>
    );
  };

  const handlePrevWeek = () => {
    if (hasPrev) {
      onSelectWeek(weeks[currentIdx - 1].id);
    }
  };

  const handleNextWeek = () => {
    if (hasNext) {
      onSelectWeek(weeks[currentIdx + 1].id);
    }
  };

  const updateDersBilgisi = (
    key: keyof MaarifLessonPlan["Ders_Bilgisi"],
    value: string
  ) => {
    onUpdatePlan({
      ...activePlan,
      Ders_Bilgisi: {
        ...activePlan.Ders_Bilgisi,
        [key]: value,
      },
    });
    if (key === "Ogrenme_Birimi" && selectedWeek) {
      onUpdateWeekItem(selectedWeek.id, { ogrenmeBirimi: value });
    } else if (key === "Sure" && selectedWeek) {
      onUpdateWeekItem(selectedWeek.id, { sure: value });
    }
  };

  const updateProgramlarArasi = (
    key: keyof MaarifLessonPlan["Programlar_Arasi_Bilesenler"],
    value: string
  ) => {
    onUpdatePlan({
      ...activePlan,
      Programlar_Arasi_Bilesenler: {
        ...activePlan.Programlar_Arasi_Bilesenler,
        [key]: value,
      },
    });
  };

  const updateYasantilarString = (
    key: "Temel_Kabuller" | "On_Degerlendirme_Sureci" | "Kopru_Kurma",
    value: string
  ) => {
    onUpdatePlan({
      ...activePlan,
      Ogrenme_Ogretme_Yasantilari: {
        ...activePlan.Ogrenme_Ogretme_Yasantilari,
        [key]: value,
      },
    });
  };

  const updateYasantilarList = (
    key:
      | "Ogretme_Uygulamalari"
      | "Guduleme"
      | "Dikkat_Cekme"
      | "Ek_Ogretme_Uygulamalari",
    rawText: string
  ) => {
    const items = rawText
      .split(/\r?\n/)
      .map((line) => line.replace(/^\s*[*•-]\s*/, "").trim())
      .filter((line) => line.length > 0);

    onUpdatePlan({
      ...activePlan,
      Ogrenme_Ogretme_Yasantilari: {
        ...activePlan.Ogrenme_Ogretme_Yasantilari,
        [key]: items,
      },
    });

    if (key === "Ogretme_Uygulamalari" && selectedWeek) {
      onUpdateWeekItem(selectedWeek.id, { ogretmeUygulamalari: items });
    }
  };

  const showHafta = activeSection === "all" || activeSection === "hafta";
  const showDers = activeSection === "all" || activeSection === "ders";
  const showCiktilar = activeSection === "all" || activeSection === "ciktilar";
  const showYasantilar =
    activeSection === "all" || activeSection === "yasantilar";
  const showFarklilastirma =
    activeSection === "all" || activeSection === "farklilastirma";

  return (
    <div className="no-print fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Subtle backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-[1px] pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* Right-Side Slide-Over Drawer */}
      <aside
        aria-label="Hafta Detay Paneli"
        className="relative z-10 w-full max-w-2xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col pointer-events-auto animate-in slide-in-from-right duration-200"
      >
        {/* Top Sticky Header */}
        <div className="px-5 py-4 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-base font-bold tracking-tight text-white truncate">
                    Hafta Detay Paneli
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                    {selectedWeek?.haftaNo || 1} / {weeks.length}
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate">
                  Seçilen haftanın plan içeriğini inceleyin, AI ile düzeltin veya kaynaktan tekrar çekin
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Paneli Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Week Switcher Bar */}
          <div className="mt-3.5 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevWeek}
              disabled={!hasPrev}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shrink-0"
              title="Önceki Hafta"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Önceki
            </button>

            <div className="relative flex-1 min-w-0">
              <select
                value={selectedWeek?.id || ""}
                onChange={(e) => onSelectWeek(e.target.value)}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-400 truncate cursor-pointer"
              >
                {weeks.map((w) => {
                  const unitPart = w.ogrenmeBirimi
                    ? ` [${w.ogrenmeBirimi.slice(0, 26)}]`
                    : "";
                  const topicPart =
                    w.icerikCercevesi || w.konuVeCiktiOzeti
                      ? ` — ${(w.icerikCercevesi || w.konuVeCiktiOzeti || "").slice(0, 42)}`
                      : "";
                  return (
                    <option key={w.id} value={w.id}>
                      {w.haftaEtiketi} ({w.tarihAraligi}){unitPart}
                      {topicPart}
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextWeek}
              disabled={!hasNext}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shrink-0"
              title="Sonraki Hafta"
            >
              Sonraki
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section Filter Tabs */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {(
              [
                { id: "all", label: "Tüm Bölümler" },
                { id: "hafta", label: "Hafta & Ünite" },
                { id: "ders", label: "Ders & Bileşenler" },
                { id: "ciktilar", label: "Çıktı & Kanıtlar" },
                { id: "yasantilar", label: "Öğrenme Yaşantıları" },
                { id: "farklilastirma", label: "Farklılaştırma" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeSection === tab.id
                    ? "bg-amber-400 text-slate-950"
                    : "bg-slate-800/90 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/70">
          {/* 1. HAFTA, TARİH VE ÜNİTE BİLGİLERİ */}
          {showHafta && (
            <section className="rounded-xl bg-white border border-slate-200/90 p-4 shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    1. Hafta, Tarih ve Ünite Bilgisi
                  </h3>
                </div>
                {renderActionButtons("section_hafta")}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Hafta Etiketi
                  </label>
                  <input
                    type="text"
                    value={meta.haftaEtiketi}
                    onChange={(e) => {
                      onUpdateMetaField("haftaEtiketi", e.target.value);
                      if (selectedWeek) {
                        onUpdateWeekItem(selectedWeek.id, {
                          haftaEtiketi: e.target.value,
                        });
                      }
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tarih Aralığı
                  </label>
                  <input
                    type="text"
                    value={meta.tarihAraligi}
                    onChange={(e) => {
                      onUpdateMetaField("tarihAraligi", e.target.value);
                      if (selectedWeek) {
                        onUpdateWeekItem(selectedWeek.id, {
                          tarihAraligi: e.target.value,
                        });
                      }
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Süre (Ders Saati)
                  </label>
                  <input
                    type="text"
                    value={activePlan.Ders_Bilgisi.Sure}
                    onChange={(e) => updateDersBilgisi("Sure", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Öğrenme Birimi (Ünite / Tema / Modül)
                    </label>
                    {renderActionButtons("Ogrenme_Birimi", true)}
                  </div>
                  <input
                    type="text"
                    value={activePlan.Ders_Bilgisi.Ogrenme_Birimi}
                    onChange={(e) =>
                      updateDersBilgisi("Ogrenme_Birimi", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      İçerik Çerçevesi (Haftanın Konusu)
                    </label>
                    {renderActionButtons("Icerik_Cercevesi", true)}
                  </div>
                  <input
                    type="text"
                    value={activePlan.Icerik_Cercevesi}
                    onChange={(e) => {
                      onUpdatePlan({
                        ...activePlan,
                        Icerik_Cercevesi: e.target.value,
                      });
                      if (selectedWeek) {
                        onUpdateWeekItem(selectedWeek.id, {
                          icerikCercevesi: e.target.value,
                        });
                      }
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </section>
          )}

          {/* 2. DERS BİLGİSİ VE PROGRAMLAR ARASI BİLEŞENLER */}
          {showDers && (
            <section className="rounded-xl bg-white border border-slate-200/90 p-4 shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    2. Ders Bilgisi ve Programlar Arası Bileşenler
                  </h3>
                </div>
                {renderActionButtons("section_ders")}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Ders İsmi
                  </label>
                  <input
                    type="text"
                    value={activePlan.Ders_Bilgisi.Ders}
                    onChange={(e) => {
                      updateDersBilgisi("Ders", e.target.value);
                      onUpdateMetaField("dersIsmi", e.target.value);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Sınıf Düzeyi
                  </label>
                  <input
                    type="text"
                    value={activePlan.Ders_Bilgisi.Sinif}
                    onChange={(e) => {
                      updateDersBilgisi("Sinif", e.target.value);
                      onUpdateMetaField("sinifDuzeyi", e.target.value);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Alan Becerileri
                    </label>
                    {renderActionButtons("Alan_Becerileri", true)}
                  </div>
                  <textarea
                    rows={2}
                    value={activePlan.Ders_Bilgisi.Alan_Becerileri}
                    onChange={(e) =>
                      updateDersBilgisi("Alan_Becerileri", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Eğilimler
                    </label>
                    {renderActionButtons("Egilimler", true)}
                  </div>
                  <textarea
                    rows={2}
                    value={activePlan.Ders_Bilgisi.Egilimler}
                    onChange={(e) =>
                      updateDersBilgisi("Egilimler", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Sosyal-Duygusal Öğrenme Becerileri (SDB)
                  </label>
                  <textarea
                    rows={2}
                    value={
                      activePlan.Programlar_Arasi_Bilesenler
                        .Sosyal_Duygusal_Ogrenme_Becerileri
                    }
                    onChange={(e) =>
                      updateProgramlarArasi(
                        "Sosyal_Duygusal_Ogrenme_Becerileri",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Değerler
                  </label>
                  <textarea
                    rows={2}
                    value={activePlan.Programlar_Arasi_Bilesenler.Degerler}
                    onChange={(e) =>
                      updateProgramlarArasi("Degerler", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Okuryazarlık Becerileri (OB)
                  </label>
                  <textarea
                    rows={2}
                    value={
                      activePlan.Programlar_Arasi_Bilesenler
                        .Okuryazarlik_Becerileri
                    }
                    onChange={(e) =>
                      updateProgramlarArasi(
                        "Okuryazarlik_Becerileri",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Disiplinler Arası İlişki
                  </label>
                  <textarea
                    rows={2}
                    value={
                      activePlan.Programlar_Arasi_Bilesenler
                        .Disiplinler_Arasi_Iliski
                    }
                    onChange={(e) =>
                      updateProgramlarArasi(
                        "Disiplinler_Arasi_Iliski",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Beceriler Arası İlişki (KB)
                  </label>
                  <textarea
                    rows={2}
                    value={
                      activePlan.Programlar_Arasi_Bilesenler
                        .Beceriler_Arasi_Iliski
                    }
                    onChange={(e) =>
                      updateProgramlarArasi(
                        "Beceriler_Arasi_Iliski",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </section>
          )}

          {/* 3. ÖĞRENME ÇIKTILARI VE ÖĞRENME KANITLARI */}
          {showCiktilar && (
            <section className="rounded-xl bg-white border border-slate-200/90 p-4 shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    3. Öğrenme Çıktıları ve Öğrenme Kanıtları
                  </h3>
                </div>
                {renderActionButtons("section_ciktilar")}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Öğrenme Çıktıları ve Süreç Bileşenleri (Kazanım ve a, b, c...)
                  </label>
                  {renderActionButtons(
                    "Ogrenme_Ciktilari_ve_Surec_Bilesenleri",
                    true
                  )}
                </div>
                <textarea
                  rows={4}
                  value={activePlan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri}
                  onChange={(e) => {
                    onUpdatePlan({
                      ...activePlan,
                      Ogrenme_Ciktilari_ve_Surec_Bilesenleri: e.target.value,
                    });
                    if (selectedWeek) {
                      onUpdateWeekItem(selectedWeek.id, {
                        konuVeCiktiOzeti: e.target.value,
                      });
                    }
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Öğrenme Kanıtları (Ölçme ve Değerlendirme)
                  </label>
                  {renderActionButtons("Ogrenme_Kanitlari", true)}
                </div>
                <textarea
                  rows={4}
                  value={activePlan.Ogrenme_Kanitlari}
                  onChange={(e) => {
                    onUpdatePlan({
                      ...activePlan,
                      Ogrenme_Kanitlari: e.target.value,
                    });
                    if (selectedWeek) {
                      onUpdateWeekItem(selectedWeek.id, {
                        ogrenmeKanitlari: e.target.value,
                      });
                    }
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </section>
          )}

          {/* 4. ÖĞRENME-ÖĞRETME YAŞANTILARI */}
          {showYasantilar && (
            <section className="rounded-xl bg-white border border-slate-200/90 p-4 shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    4. Öğrenme-Öğretme Yaşantıları
                  </h3>
                </div>
                {renderActionButtons("section_yasantilar")}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Temel Kabuller
                  </label>
                  {renderActionButtons("Temel_Kabuller", true)}
                </div>
                <textarea
                  rows={2}
                  value={activePlan.Ogrenme_Ogretme_Yasantilari.Temel_Kabuller}
                  onChange={(e) =>
                    updateYasantilarString("Temel_Kabuller", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Ön Değerlendirme Süreci
                  </label>
                  {renderActionButtons("On_Degerlendirme_Sureci", true)}
                </div>
                <textarea
                  rows={2}
                  value={
                    activePlan.Ogrenme_Ogretme_Yasantilari
                      .On_Degerlendirme_Sureci
                  }
                  onChange={(e) =>
                    updateYasantilarString(
                      "On_Degerlendirme_Sureci",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Köprü Kurma
                  </label>
                  {renderActionButtons("Kopru_Kurma", true)}
                </div>
                <textarea
                  rows={2}
                  value={activePlan.Ogrenme_Ogretme_Yasantilari.Kopru_Kurma}
                  onChange={(e) =>
                    updateYasantilarString("Kopru_Kurma", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Öğretme Uygulamaları (Her satır bir madde)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-slate-400">
                      {
                        activePlan.Ogrenme_Ogretme_Yasantilari
                          .Ogretme_Uygulamalari.length
                      }{" "}
                      madde
                    </span>
                    {renderActionButtons("Ogretme_Uygulamalari", true)}
                  </div>
                </div>
                <textarea
                  rows={6}
                  value={activePlan.Ogrenme_Ogretme_Yasantilari.Ogretme_Uygulamalari.join(
                    "\n"
                  )}
                  onChange={(e) =>
                    updateYasantilarList("Ogretme_Uygulamalari", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Güdüleme (Her satır bir madde)
                    </label>
                    {renderActionButtons("Guduleme", true)}
                  </div>
                  <textarea
                    rows={4}
                    value={activePlan.Ogrenme_Ogretme_Yasantilari.Guduleme.join(
                      "\n"
                    )}
                    onChange={(e) =>
                      updateYasantilarList("Guduleme", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Dikkat Çekme (Her satır bir soru)
                    </label>
                    {renderActionButtons("Dikkat_Cekme", true)}
                  </div>
                  <textarea
                    rows={4}
                    value={activePlan.Ogrenme_Ogretme_Yasantilari.Dikkat_Cekme.join(
                      "\n"
                    )}
                    onChange={(e) =>
                      updateYasantilarList("Dikkat_Cekme", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Ek Öğretme Uygulamaları (Her satır bir madde)
                  </label>
                  {renderActionButtons("Ek_Ogretme_Uygulamalari", true)}
                </div>
                <textarea
                  rows={5}
                  value={activePlan.Ogrenme_Ogretme_Yasantilari.Ek_Ogretme_Uygulamalari.join(
                    "\n"
                  )}
                  onChange={(e) =>
                    updateYasantilarList(
                      "Ek_Ogretme_Uygulamalari",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </section>
          )}

          {/* 5. FARKLILAŞTIRMA */}
          {showFarklilastirma && (
            <section className="rounded-xl bg-white border border-slate-200/90 p-4 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    5. Farklılaştırma (Zenginleştirme / Destekleme)
                  </h3>
                </div>
                {renderActionButtons("Farklilastirma")}
              </div>

              <textarea
                rows={4}
                value={activePlan.Farklilastirma}
                onChange={(e) =>
                  onUpdatePlan({
                    ...activePlan,
                    Farklilastirma: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </section>
          )}
        </div>

        {/* Sticky Footer Actions */}
        <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGenerateOrApplyWeekPlan}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-950 hover:bg-indigo-900 text-white shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
              {hasGeneratedPlan
                ? "Değişiklikleri Tabloya Uygula"
                : "Bu Haftayı Ana Tabloya Aktar"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDownloadWord}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              Haftayı Word İndir
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
