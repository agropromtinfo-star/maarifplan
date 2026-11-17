import React, { useState } from "react";
import {
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  CheckCircle2,
  Sparkles,
  FileDown,
  SlidersHorizontal,
  FileText,
} from "lucide-react";
import {
  MaarifLessonPlan,
  YillikPlanWeekItem,
  DocumentHeaderFooterMeta,
} from "../types/lessonPlan";

interface WeekDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  weeks: YillikPlanWeekItem[];
  selectedWeek: YillikPlanWeekItem;
  onSelectWeek: (weekId: string) => void;
  meta: DocumentHeaderFooterMeta;
  onUpdateMetaField: (
    key: keyof DocumentHeaderFooterMeta,
    value: string
  ) => void;
  onUpdateWeekItem: (
    weekId: string,
    patch: Partial<YillikPlanWeekItem>
  ) => void;
  activePlan: MaarifLessonPlan;
  hasGeneratedPlan: boolean;
  onUpdatePlan: (updated: MaarifLessonPlan) => void;
  onGenerateOrApplyWeekPlan: () => void;
  onDownloadWord: () => void;
}

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
}) => {
  const [activeSection, setActiveSection] = useState<
    "all" | "hafta" | "ders" | "cikti" | "yasantilar" | "farklilastirma"
  >("all");
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const currentIdx = weeks.findIndex((w) => w.id === selectedWeek.id);
  const prevWeek = currentIdx > 0 ? weeks[currentIdx - 1] : null;
  const nextWeek =
    currentIdx >= 0 && currentIdx < weeks.length - 1
      ? weeks[currentIdx + 1]
      : null;

  const triggerSavedIndicator = () => {
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 1400);
  };

  const handleArrayTextChange = (
    field:
      | "Ogretme_Uygulamalari"
      | "Guduleme"
      | "Dikkat_Cekme"
      | "Ek_Ogretme_Uygulamalari",
    rawVal: string
  ) => {
    const lines = rawVal
      .split(/\r?\n/)
      .map((l) => l.replace(/^\*\s*/, "").trim())
      .filter(Boolean);

    const updated: MaarifLessonPlan = {
      ...activePlan,
      Ogrenme_Ogretme_Yasantilari: {
        ...activePlan.Ogrenme_Ogretme_Yasantilari,
        [field]: lines,
      },
    };
    onUpdatePlan(updated);
    if (field === "Ogretme_Uygulamalari") {
      onUpdateWeekItem(selectedWeek.id, { ogretmeUygulamalari: lines });
    }
    triggerSavedIndicator();
  };

  const showSection = (
    sec: "hafta" | "ders" | "cikti" | "yasantilar" | "farklilastirma"
  ) => activeSection === "all" || activeSection === sec;

  return (
    <div className="no-print fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/35 backdrop-blur-[1px] pointer-events-auto transition-opacity"
      />

      {/* Right Slide-Over Scrollable Panel */}
      <aside
        aria-label="Hafta Detay Paneli"
        className="relative z-10 w-full max-w-xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col pointer-events-auto"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-sky-950 text-white px-5 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-400/15 border border-amber-300/30 flex items-center justify-center text-amber-300 shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-tight text-white">
                    Hafta Detay Paneli
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-sky-500/20 text-sky-200 border border-sky-400/30 tabular-nums">
                    {currentIdx >= 0 ? `${currentIdx + 1} / ${weeks.length}` : `${weeks.length} Hafta`}
                  </span>
                  {savedToast && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Güncellendi
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Seçilen haftanın plan içeriğini hızlıca inceleyin ve doğrudan düzenleyin
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Paneli Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Week Switcher Bar */}
          <div className="mt-3.5 flex items-center gap-2">
            <button
              type="button"
              disabled={!prevWeek}
              onClick={() => prevWeek && onSelectWeek(prevWeek.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:pointer-events-none text-xs font-medium text-white transition-colors shrink-0"
              title="Önceki Hafta"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Önceki</span>
            </button>

            <select
              aria-label="Hafta Seçimi"
              value={selectedWeek.id}
              onChange={(e) => onSelectWeek(e.target.value)}
              className="flex-1 min-w-0 rounded-lg bg-slate-900/90 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-amber-200 focus:outline-none focus:border-amber-400"
            >
              {weeks.map((w) => (
                <option key={w.id} value={w.id} className="text-slate-900 bg-white">
                  {w.haftaEtiketi} ({w.tarihAraligi})
                  {w.ogrenmeBirimi ? ` — ${w.ogrenmeBirimi}` : ""}
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={!nextWeek}
              onClick={() => nextWeek && onSelectWeek(nextWeek.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:pointer-events-none text-xs font-medium text-white transition-colors shrink-0"
              title="Sonraki Hafta"
            >
              <span>Sonraki</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Section Filter Tabs */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px]">
            {[
              { id: "all", label: "Tüm Bölümler" },
              { id: "hafta", label: "Hafta & Ünite" },
              { id: "ders", label: "Ders & Bileşenler" },
              { id: "cikti", label: "Çıktı & Kanıtlar" },
              { id: "yasantilar", label: "Öğrenme Yaşantıları" },
              { id: "farklilastirma", label: "Farklılaştırma" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveSection(
                    tab.id as
                      | "all"
                      | "hafta"
                      | "ders"
                      | "cikti"
                      | "yasantilar"
                      | "farklilastirma"
                  )
                }
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  activeSection === tab.id
                    ? "bg-amber-400 text-slate-950 font-semibold"
                    : "bg-white/10 text-slate-200 hover:bg-white/15"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/60">
          {/* SECTION 1: Hafta, Tarih ve Ünite Bilgileri */}
          {showSection("hafta") && (
            <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    1. Hafta, Tarih ve Ünite Bilgileri
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-sky-700">
                  {meta.haftaEtiketi}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Hafta Başlığı
                  </label>
                  <input
                    type="text"
                    value={meta.haftaEtiketi}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateMetaField("haftaEtiketi", val);
                      onUpdateWeekItem(selectedWeek.id, { haftaEtiketi: val });
                      triggerSavedIndicator();
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Tarih Aralığı
                  </label>
                  <input
                    type="text"
                    value={meta.tarihAraligi}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateMetaField("tarihAraligi", val);
                      onUpdateWeekItem(selectedWeek.id, { tarihAraligi: val });
                      triggerSavedIndicator();
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Uygundur Tarihi
                  </label>
                  <input
                    type="text"
                    value={meta.onayTarihi}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateMetaField("onayTarihi", val);
                      onUpdateWeekItem(selectedWeek.id, { onayTarihi: val });
                      triggerSavedIndicator();
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 tabular-nums focus:border-sky-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Öğrenme Birimi (Ünite / Modül)
                  </label>
                  <input
                    type="text"
                    value={
                      activePlan.Ders_Bilgisi.Ogrenme_Birimi ||
                      selectedWeek.ogrenmeBirimi ||
                      ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateWeekItem(selectedWeek.id, { ogrenmeBirimi: val });
                      onUpdatePlan({
                        ...activePlan,
                        Ders_Bilgisi: {
                          ...activePlan.Ders_Bilgisi,
                          Ogrenme_Birimi: val,
                        },
                      });
                      triggerSavedIndicator();
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:border-sky-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Ders Süresi
                  </label>
                  <input
                    type="text"
                    value={
                      activePlan.Ders_Bilgisi.Sure || selectedWeek.sure || ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateWeekItem(selectedWeek.id, { sure: val });
                      onUpdatePlan({
                        ...activePlan,
                        Ders_Bilgisi: {
                          ...activePlan.Ders_Bilgisi,
                          Sure: val,
                        },
                      });
                      triggerSavedIndicator();
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  İçerik Çerçevesi (Haftalık Konu Başlığı)
                </label>
                <input
                  type="text"
                  value={
                    activePlan.Icerik_Cercevesi ||
                    selectedWeek.icerikCercevesi ||
                    ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateWeekItem(selectedWeek.id, { icerikCercevesi: val });
                    onUpdatePlan({
                      ...activePlan,
                      Icerik_Cercevesi: val,
                    });
                    triggerSavedIndicator();
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:border-sky-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Yıllık Plan Konu ve Çıktı Özeti
                </label>
                <textarea
                  rows={2}
                  value={selectedWeek.konuVeCiktiOzeti || ""}
                  onChange={(e) => {
                    onUpdateWeekItem(selectedWeek.id, {
                      konuVeCiktiOzeti: e.target.value,
                    });
                    triggerSavedIndicator();
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-sky-600 focus:outline-none"
                />
              </div>
            </section>
          )}

          {/* SECTION 2: Ders Bilgisi & Programlar Arası Bileşenler */}
          {showSection("ders") && (
            <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  2. Ders Bilgisi &amp; Programlar Arası Bileşenler
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Ders İsmi
                  </label>
                  <input
                    type="text"
                    value={meta.dersIsmi || activePlan.Ders_Bilgisi.Ders || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateMetaField("dersIsmi", val);
                      onUpdatePlan({
                        ...activePlan,
                        Ders_Bilgisi: {
                          ...activePlan.Ders_Bilgisi,
                          Ders: val,
                        },
                      });
                      triggerSavedIndicator();
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Sınıf Düzeyi
                  </label>
                  <input
                    type="text"
                    value={
                      meta.sinifDuzeyi || activePlan.Ders_Bilgisi.Sinif || ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateMetaField("sinifDuzeyi", val);
                      onUpdatePlan({
                        ...activePlan,
                        Ders_Bilgisi: {
                          ...activePlan.Ders_Bilgisi,
                          Sinif: val,
                        },
                      });
                      triggerSavedIndicator();
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Alan Becerileri
                </label>
                <textarea
                  rows={2}
                  value={activePlan.Ders_Bilgisi.Alan_Becerileri || ""}
                  onChange={(e) => {
                    onUpdatePlan({
                      ...activePlan,
                      Ders_Bilgisi: {
                        ...activePlan.Ders_Bilgisi,
                        Alan_Becerileri: e.target.value,
                      },
                    });
                    triggerSavedIndicator();
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Eğilimler
                </label>
                <textarea
                  rows={2}
                  value={activePlan.Ders_Bilgisi.Egilimler || ""}
                  onChange={(e) => {
                    onUpdatePlan({
                      ...activePlan,
                      Ders_Bilgisi: {
                        ...activePlan.Ders_Bilgisi,
                        Egilimler: e.target.value,
                      },
                    });
                    triggerSavedIndicator();
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Sosyal-Duygusal Öğrenme Becerileri
                  </label>
                  <textarea
                    rows={2}
                    value={
                      activePlan.Programlar_Arasi_Bilesenler
                        .Sosyal_Duygusal_Ogrenme_Becerileri || ""
                    }
                    onChange={(e) => {
                      onUpdatePlan({
                        ...activePlan,
                        Programlar_Arasi_Bilesenler: {
                          ...activePlan.Programlar_Arasi_Bilesenler,
                          Sosyal_Duygusal_Ogrenme_Becerileri: e.target.value,
                        },
                      });
                      triggerSavedIndicator();
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Değerler
                  </label>
                  <textarea
                    rows={2}
                    value={
                      activePlan.Programlar_Arasi_Bilesenler.Degerler || ""
                    }
                    onChange={(e) => {
                      onUpdatePlan({
                        ...activePlan,
                        Programlar_Arasi_Bilesenler: {
                          ...activePlan.Programlar_Arasi_Bilesenler,
                          Degerler: e.target.value,
                        },
                      });
                      triggerSavedIndicator();
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Okuryazarlık Becerileri
                  </label>
                  <textarea
                    rows={2}
                    value={
                      activePlan.Programlar_Arasi_Bilesenler
                        .Okuryazarlik_Becerileri || ""
                    }
                    onChange={(e) => {
                      onUpdatePlan({
                        ...activePlan,
                        Programlar_Arasi_Bilesenler: {
                          ...activePlan.Programlar_Arasi_Bilesenler,
                          Okuryazarlik_Becerileri: e.target.value,
                        },
                      });
                      triggerSavedIndicator();
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Disiplinler Arası İlişki
                    </label>
                    <textarea
                      rows={2}
                      value={
                        activePlan.Programlar_Arasi_Bilesenler
                          .Disiplinler_Arasi_Iliski || ""
                      }
                      onChange={(e) => {
                        onUpdatePlan({
                          ...activePlan,
                          Programlar_Arasi_Bilesenler: {
                            ...activePlan.Programlar_Arasi_Bilesenler,
                            Disiplinler_Arasi_Iliski: e.target.value,
                          },
                        });
                        triggerSavedIndicator();
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Beceriler Arası İlişki
                    </label>
                    <textarea
                      rows={2}
                      value={
                        activePlan.Programlar_Arasi_Bilesenler
                          .Beceriler_Arasi_Iliski || ""
                      }
                      onChange={(e) => {
                        onUpdatePlan({
                          ...activePlan,
                          Programlar_Arasi_Bilesenler: {
                            ...activePlan.Programlar_Arasi_Bilesenler,
                            Beceriler_Arasi_Iliski: e.target.value,
                          },
                        });
                        triggerSavedIndicator();
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3: Öğrenme Çıktıları & Öğrenme Kanıtları */}
          {showSection("cikti") && (
            <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <FileText className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  3. Öğrenme Çıktıları ve Öğrenme Kanıtları
                </h3>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Öğrenme Çıktıları ve Süreç Bileşenleri (Kazanım ve a, b, c...)
                </label>
                <textarea
                  rows={4}
                  value={
                    activePlan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri || ""
                  }
                  onChange={(e) => {
                    onUpdatePlan({
                      ...activePlan,
                      Ogrenme_Ciktilari_ve_Surec_Bilesenleri: e.target.value,
                    });
                    triggerSavedIndicator();
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Öğrenme Kanıtları (Ölçme ve Değerlendirme)
                </label>
                <textarea
                  rows={3}
                  value={
                    activePlan.Ogrenme_Kanitlari ||
                    selectedWeek.ogrenmeKanitlari ||
                    ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateWeekItem(selectedWeek.id, {
                      ogrenmeKanitlari: val,
                    });
                    onUpdatePlan({
                      ...activePlan,
                      Ogrenme_Kanitlari: val,
                    });
                    triggerSavedIndicator();
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-teal-600 focus:outline-none"
                />
              </div>
            </section>
          )}

          {/* SECTION 4: Öğrenme-Öğretme Yaşantıları */}
          {showSection("yasantilar") && (
            <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  4. Öğrenme-Öğretme Yaşantıları
                </h3>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Temel Kabuller
                </label>
                <textarea
                  rows={2}
                  value={
                    activePlan.Ogrenme_Ogretme_Yasantilari.Temel_Kabuller || ""
                  }
                  onChange={(e) => {
                    onUpdatePlan({
                      ...activePlan,
                      Ogrenme_Ogretme_Yasantilari: {
                        ...activePlan.Ogrenme_Ogretme_Yasantilari,
                        Temel_Kabuller: e.target.value,
                      },
                    });
                    triggerSavedIndicator();
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Ön Değerlendirme Süreci
                </label>
                <textarea
                  rows={2}
                  value={
                    activePlan.Ogrenme_Ogretme_Yasantilari
                      .On_Degerlendirme_Sureci || ""
                  }
                  onChange={(e) => {
                    onUpdatePlan({
                      ...activePlan,
                      Ogrenme_Ogretme_Yasantilari: {
                        ...activePlan.Ogrenme_Ogretme_Yasantilari,
                        On_Degerlendirme_Sureci: e.target.value,
                      },
                    });
                    triggerSavedIndicator();
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Köprü Kurma
                </label>
                <textarea
                  rows={2}
                  value={
                    activePlan.Ogrenme_Ogretme_Yasantilari.Kopru_Kurma || ""
                  }
                  onChange={(e) => {
                    onUpdatePlan({
                      ...activePlan,
                      Ogrenme_Ogretme_Yasantilari: {
                        ...activePlan.Ogrenme_Ogretme_Yasantilari,
                        Kopru_Kurma: e.target.value,
                      },
                    });
                    triggerSavedIndicator();
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Haftalık Özet (Ders Materyali Eşleşmesi)
                </label>
                <textarea
                  rows={3}
                  value={
                    activePlan.Ogrenme_Ogretme_Yasantilari.Haftalik_Ozet || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateWeekItem(selectedWeek.id, { haftalikOzet: val });
                    onUpdatePlan({
                      ...activePlan,
                      Ogrenme_Ogretme_Yasantilari: {
                        ...activePlan.Ogrenme_Ogretme_Yasantilari,
                        Haftalik_Ozet: val,
                      },
                    });
                    triggerSavedIndicator();
                  }}
                  placeholder="Ders materyalinden bu haftanın konusuyla eşleşen özet metin..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Öğretme-Öğrenme Uygulamaları (Her satır bir madde)
                </label>
                <textarea
                  rows={5}
                  value={(
                    activePlan.Ogrenme_Ogretme_Yasantilari
                      .Ogretme_Uygulamalari || []
                  ).join("\n")}
                  onChange={(e) =>
                    handleArrayTextChange(
                      "Ogretme_Uygulamalari",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Güdüleme (Her satır bir madde)
                </label>
                <textarea
                  rows={2}
                  value={(
                    activePlan.Ogrenme_Ogretme_Yasantilari.Guduleme || []
                  ).join("\n")}
                  onChange={(e) =>
                    handleArrayTextChange("Guduleme", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Dikkat Çekme (Her satır bir madde)
                </label>
                <textarea
                  rows={2}
                  value={(
                    activePlan.Ogrenme_Ogretme_Yasantilari.Dikkat_Cekme || []
                  ).join("\n")}
                  onChange={(e) =>
                    handleArrayTextChange("Dikkat_Cekme", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Ek Öğretme Uygulamaları (Her satır bir madde)
                </label>
                <textarea
                  rows={3}
                  value={(
                    activePlan.Ogrenme_Ogretme_Yasantilari
                      .Ek_Ogretme_Uygulamalari || []
                  ).join("\n")}
                  onChange={(e) =>
                    handleArrayTextChange(
                      "Ek_Ogretme_Uygulamalari",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </section>
          )}

          {/* SECTION 5: Farklılaştırma */}
          {showSection("farklilastirma") && (
            <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  5. Farklılaştırma (Zenginleştirme &amp; Destekleme)
                </h3>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Farklılaştırma Uygulamaları
                </label>
                <textarea
                  rows={4}
                  value={activePlan.Farklilastirma || ""}
                  onChange={(e) => {
                    onUpdatePlan({
                      ...activePlan,
                      Farklilastirma: e.target.value,
                    });
                    triggerSavedIndicator();
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 leading-relaxed focus:border-amber-600 focus:outline-none"
                />
              </div>
            </section>
          )}
        </div>

        {/* Sticky Footer Actions */}
        <div className="border-t border-slate-200 bg-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onGenerateOrApplyWeekPlan}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold transition-colors shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {hasGeneratedPlan
                ? "Değişiklikleri Tabloya Uygula"
                : "Bu Haftanın Planını Tabloda Aç"}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDownloadWord}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Haftayı Word İndir</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
