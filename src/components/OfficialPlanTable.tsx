import React, { useState } from "react";
import { MaarifLessonPlan, DocumentHeaderFooterMeta } from "../types/lessonPlan";
import {
  Printer,
  FileDown,
  Edit3,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  Settings2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { downloadWordDoc, triggerPrintWithFileName } from "../utils/exportPlan";
import { formatFullWeekAndDateRange, cleanOgrenmeKanitlariPrefix } from "../shared/maarifPlanEngine";
import { ExportConfigModal } from "./ExportConfigModal";
import { PlanExportOptions } from "../types/exportOptions";

interface OfficialPlanTableProps {
  plan: MaarifLessonPlan;
  meta: DocumentHeaderFooterMeta;
  onUpdatePlan: (updated: MaarifLessonPlan) => void;
  onOpenTopicSummary?: () => void;
}

// Helper to render codes like "E2.2. ", "SDB2.2. ", "D12. ", "OB1. ", "KB2.2. " in bold when followed by space
function renderTextWithBoldCodes(text: string): React.ReactNode {
  if (!text) return null;
  const parts = text.split(/(\b[A-ZÇĞİÖŞÜ]{1,5}\d+(?:\.\d+)*\.(?=\s|$))/g);
  return parts.map((part, idx) => {
    if (/^[A-ZÇĞİÖŞÜ]{1,5}\d+(?:\.\d+)*\.$/.test(part)) {
      return (
        <strong key={idx} className="font-bold text-black">
          {part}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function renderOgrenmeCiktilari(text: string): React.ReactNode {
  const lines = (text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;

  return (
    <div className="space-y-0.5">
      {lines.map((line, idx) => {
        const cleaned = line.replace(/^[•*-]\s*/, "");
        if (idx === 0 || /^[A-ZÇĞİÖŞÜ]{2,6}\.\d+/.test(cleaned)) {
          return (
            <div key={idx} className="font-bold text-black">
              {cleaned}
            </div>
          );
        }
        const subMatch = cleaned.match(/^([a-zçğıöşü]\))\s*(.*)$/i);
        if (subMatch) {
          return (
            <div key={idx}>
              <strong className="font-bold text-black">{subMatch[1]}</strong>{" "}
              <span>{subMatch[2]}</span>
            </div>
          );
        }
        return <div key={idx}>{cleaned}</div>;
      })}
    </div>
  );
}

export const OfficialPlanTable: React.FC<OfficialPlanTableProps> = ({
  plan,
  meta,
  onUpdatePlan,
  onOpenTopicSummary,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isCompactView, setIsCompactView] = useState(true); // Kağıt tasarrufu için varsayılan olarak sıkıştırılmış

  const displayOkulAdi = meta.okulAdi.trim()
    ? meta.okulAdi.trim().toLocaleUpperCase("tr-TR")
    : "";
  const displayDers = (
    meta.dersIsmi.trim() ||
    plan.Ders_Bilgisi.Ders ||
    "DERS"
  ).toLocaleUpperCase("tr-TR");
  const displaySinif = (
    meta.sinifDuzeyi.trim() ||
    plan.Ders_Bilgisi.Sinif ||
    "9. SINIF"
  ).toLocaleUpperCase("tr-TR");

  // Output ALWAYS displays the week together with its real date range
  const displayHaftaSatiri = formatFullWeekAndDateRange(
    meta.haftaEtiketi,
    meta.tarihAraligi
  );

  const displayOnayTarihi = meta.onayTarihi?.trim() || "..../..../202...";
  const displayOgretmenAd = meta.ogretmenAdSoyad.trim() || "........................";
  const displayOgretmenBrans = meta.ogretmenBransi.trim() || "Ders Öğretmeni";
  const displayOkulMuduru = meta.okulMuduruAdSoyad.trim() || "........................";

  const secondTitleLine = `${displaySinif} ${displayDers}${
    displayDers.endsWith("DERSİ") ? "" : " DERSİ"
  } GÜNLÜK DERS PLANI`;

  const updateDersBilgisi = (
    key: keyof MaarifLessonPlan["Ders_Bilgisi"],
    val: string
  ) => {
    onUpdatePlan({
      ...plan,
      Ders_Bilgisi: {
        ...plan.Ders_Bilgisi,
        [key]: val,
      },
    });
  };

  const updateProgramlarArasi = (
    key: keyof MaarifLessonPlan["Programlar_Arasi_Bilesenler"],
    val: string
  ) => {
    onUpdatePlan({
      ...plan,
      Programlar_Arasi_Bilesenler: {
        ...plan.Programlar_Arasi_Bilesenler,
        [key]: val,
      },
    });
  };

  const updateYasantilarString = (
    key: "Temel_Kabuller" | "On_Degerlendirme_Sureci" | "Kopru_Kurma",
    val: string
  ) => {
    onUpdatePlan({
      ...plan,
      Ogrenme_Ogretme_Yasantilari: {
        ...plan.Ogrenme_Ogretme_Yasantilari,
        [key]: val,
      },
    });
  };

  const updateYasantilarArrayItem = (
    key:
      | "Dikkat_Cekme"
      | "Guduleme"
      | "Ogretme_Uygulamalari"
      | "Ek_Ogretme_Uygulamalari",
    index: number,
    val: string
  ) => {
    const nextArr = [...plan.Ogrenme_Ogretme_Yasantilari[key]];
    nextArr[index] = val;
    onUpdatePlan({
      ...plan,
      Ogrenme_Ogretme_Yasantilari: {
        ...plan.Ogrenme_Ogretme_Yasantilari,
        [key]: nextArr,
      },
    });
  };

  const addYasantilarArrayItem = (
    key:
      | "Dikkat_Cekme"
      | "Guduleme"
      | "Ogretme_Uygulamalari"
      | "Ek_Ogretme_Uygulamalari"
  ) => {
    onUpdatePlan({
      ...plan,
      Ogrenme_Ogretme_Yasantilari: {
        ...plan.Ogrenme_Ogretme_Yasantilari,
        [key]: [
          ...plan.Ogrenme_Ogretme_Yasantilari[key],
          "Yeni uygulama maddesi...",
        ],
      },
    });
  };

  const removeYasantilarArrayItem = (
    key:
      | "Dikkat_Cekme"
      | "Guduleme"
      | "Ogretme_Uygulamalari"
      | "Ek_Ogretme_Uygulamalari",
    index: number
  ) => {
    const nextArr = plan.Ogrenme_Ogretme_Yasantilari[key].filter(
      (_, i) => i !== index
    );
    onUpdatePlan({
      ...plan,
      Ogrenme_Ogretme_Yasantilari: {
        ...plan.Ogrenme_Ogretme_Yasantilari,
        [key]: nextArr,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (hidden when printing) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-sky-950 text-white rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-200/90">
            <span>{displayOkulAdi}</span>
            <span aria-hidden="true">·</span>
            <span>{displayHaftaSatiri}</span>
          </div>
          <h2 className="text-lg font-semibold text-white mt-1">
            {displayDers} ({displaySinif}) — {plan.Ders_Bilgisi.Ogrenme_Birimi}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const el =
                document.getElementById("plan-validator-anchor") ||
                document.getElementById("plan-validator-anchor-tab2");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-600/50 rounded-lg hover:bg-emerald-900/80 transition-colors whitespace-nowrap shrink-0"
            title="Öğrenme çıktıları, boş alanlar ve tarih uyuşmazlığı kontrol raporunu aç"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Doğrulama &amp; Kontrol Raporu
          </button>

          <button
            type="button"
            onClick={() => setIsCompactView((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              isCompactView
                ? "bg-teal-500/20 text-teal-300 border-teal-500/50 hover:bg-teal-500/30"
                : "bg-white/10 text-white border-white/20 hover:bg-white/20"
            }`}
            title="Kağıttan tasarruf etmek ve tek sayfaya sığdırmak için kenar ve satırları sıkıştırır"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            {isCompactView ? "Kağıt Tasarrufu: Açık" : "Kağıt Tasarrufu: Kapalı"}
          </button>

          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-sky-200 bg-sky-950/70 border border-sky-600/50 rounded-lg hover:bg-sky-900/80 transition-colors whitespace-nowrap shrink-0"
            title="İmza bloğu, tablo genişletme, boş satırları koruma ve kağıt tasarruf ayarları"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Dışa Aktarma &amp; Kağıt Ayarları
          </button>

          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              isEditing
                ? "bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-600"
                : "bg-white/10 text-white border-white/20 hover:bg-white/20"
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Düzenlemeyi Tamamla
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                Tabloyu Düzenle
              </>
            )}
          </button>

          {onOpenTopicSummary && (
            <button
              type="button"
              onClick={onOpenTopicSummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-200 bg-emerald-950/70 border border-emerald-600/50 rounded-lg hover:bg-emerald-900/80 transition-colors whitespace-nowrap shrink-0"
              title="Bu haftanın konusunu lise öğrencisi düzeyinde özetle ve ders notu çıkar"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              Konu Özeti
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-sky-600 border border-sky-500 rounded-lg hover:bg-sky-500 transition-colors whitespace-nowrap shrink-0"
            title="Dışa aktarma yapılandırıcısını açar"
          >
            <FileDown className="w-3.5 h-3.5" />
            Word (.doc) İndir
          </button>

          <button
            type="button"
            onClick={() => triggerPrintWithFileName(meta, plan)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            Yazdır / PDF Kaydet
          </button>
        </div>
      </div>

      {/* Export & Paper-Saving Configurator Modal */}
      <ExportConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        plan={plan}
        meta={meta}
        onExecutePrint={() => window.print()}
      />

      {/* Official Document Sheet (Matches User's Attached Sample Plan Format 1:1) */}
      <div
        className={`print-container bg-white border border-slate-200 rounded-xl text-black shadow-xs ${
          isCompactView ? "p-3.5 md:p-5" : "p-6 md:p-8"
        }`}
      >
        {/* 3-Line Centered Title Header */}
        <div
          className={`text-center font-bold leading-snug text-black space-y-0.5 ${
            isCompactView
              ? "text-xs md:text-[13px] mb-2.5"
              : "text-sm md:text-base mb-4"
          }`}
        >
          <div>{displayOkulAdi}</div>
          <div>{secondTitleLine}</div>
          <div>{displayHaftaSatiri}</div>
        </div>

        {/* Unified Maarif Modeli Table */}
        <div className="overflow-x-auto">
          <table
            className={`maarif-official-table w-full border-collapse border border-[#4bacc6] text-black ${
              isCompactView
                ? "text-[11.5px] leading-[1.28]"
                : "text-xs md:text-[12.5px] leading-snug"
            }`}
          >
            <tbody>
              {/* SECTION 1: DERS BİLGİSİ */}
              <tr>
                <td
                  colSpan={4}
                  valign="top"
                  className="section-banner-cell bg-[#c2d69b] border border-[#4bacc6] px-2.5 py-1 font-bold text-black uppercase tracking-normal align-top"
                >
                  DERS BİLGİSİ
                </td>
              </tr>

              {/* Row: Sınıf | ... | Ders | ... */}
              <tr>
                <td
                  valign="top"
                  className="border border-[#4bacc6] px-2.5 py-1 font-bold w-[22%] align-top"
                >
                  Sınıf
                </td>
                <td
                  valign="top"
                  className="border border-[#4bacc6] px-2.5 py-1 w-[28%] align-top"
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={plan.Ders_Bilgisi.Sinif}
                      onChange={(e) => updateDersBilgisi("Sinif", e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-0.5 text-xs"
                    />
                  ) : (
                    displaySinif
                  )}
                </td>
                <td
                  valign="top"
                  className="border border-[#4bacc6] px-2.5 py-1 font-bold w-[14%] align-top"
                >
                  Ders
                </td>
                <td
                  valign="top"
                  className="border border-[#4bacc6] px-2.5 py-1 w-[36%] align-top"
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={plan.Ders_Bilgisi.Ders}
                      onChange={(e) => updateDersBilgisi("Ders", e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-0.5 text-xs"
                    />
                  ) : (
                    displayDers
                  )}
                </td>
              </tr>

              {/* Row: Öğrenme Birimi | ... | Süre | ... */}
              <tr>
                <td
                  valign="top"
                  className="border border-[#4bacc6] px-2.5 py-1 font-bold align-top"
                >
                  Öğrenme Birimi
                </td>
                <td
                  valign="top"
                  className="border border-[#4bacc6] px-2.5 py-1 font-bold align-top"
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={plan.Ders_Bilgisi.Ogrenme_Birimi}
                      onChange={(e) =>
                        updateDersBilgisi("Ogrenme_Birimi", e.target.value)
                      }
                      className="w-full border border-slate-300 rounded px-2 py-0.5 text-xs font-normal"
                    />
                  ) : (
                    plan.Ders_Bilgisi.Ogrenme_Birimi
                  )}
                </td>
                <td
                  valign="top"
                  className="border border-[#4bacc6] px-2.5 py-1 font-bold align-top"
                >
                  Süre
                </td>
                <td
                  valign="top"
                  className="border border-[#4bacc6] px-2.5 py-1 font-bold align-top"
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={plan.Ders_Bilgisi.Sure}
                      onChange={(e) => updateDersBilgisi("Sure", e.target.value)}
                      className="w-full border border-slate-300 rounded px-2 py-0.5 text-xs font-normal"
                    />
                  ) : (
                    plan.Ders_Bilgisi.Sure
                  )}
                </td>
              </tr>

              {/* Row: Alan Becerileri */}
              <EditableSingleRow
                label="Alan Becerileri"
                value={plan.Ders_Bilgisi.Alan_Becerileri}
                isEditing={isEditing}
                onChange={(v) => updateDersBilgisi("Alan_Becerileri", v)}
              />

              {/* Row: Eğilimler */}
              <EditableSingleRow
                label="Eğilimler"
                value={plan.Ders_Bilgisi.Egilimler}
                isEditing={isEditing}
                onChange={(v) => updateDersBilgisi("Egilimler", v)}
              />

              {/* SECTION 2: PROGRAMLAR ARASI BİLEŞENLER */}
              <tr>
                <td
                  colSpan={4}
                  valign="top"
                  className="section-banner-cell bg-[#c2d69b] border border-[#4bacc6] px-2.5 py-1 font-bold text-black uppercase align-top"
                >
                  PROGRAMLAR ARASI BİLEŞENLER
                </td>
              </tr>

              <EditableSingleRow
                label="Sosyal-Duygusal Öğr. Bec."
                value={
                  plan.Programlar_Arasi_Bilesenler
                    .Sosyal_Duygusal_Ogrenme_Becerileri
                }
                isEditing={isEditing}
                onChange={(v) =>
                  updateProgramlarArasi("Sosyal_Duygusal_Ogrenme_Becerileri", v)
                }
              />

              <EditableSingleRow
                label="Değerler"
                value={plan.Programlar_Arasi_Bilesenler.Degerler}
                isEditing={isEditing}
                onChange={(v) => updateProgramlarArasi("Degerler", v)}
              />

              <EditableSingleRow
                label="Okuryazarlık Becerileri"
                value={plan.Programlar_Arasi_Bilesenler.Okuryazarlik_Becerileri}
                isEditing={isEditing}
                onChange={(v) =>
                  updateProgramlarArasi("Okuryazarlik_Becerileri", v)
                }
              />

              <EditableSingleRow
                label="Disiplinler Arası İlişki"
                value={plan.Programlar_Arasi_Bilesenler.Disiplinler_Arasi_Iliski}
                isEditing={isEditing}
                onChange={(v) =>
                  updateProgramlarArasi("Disiplinler_Arasi_Iliski", v)
                }
              />

              <EditableSingleRow
                label="Beceriler Arası İlişki"
                value={plan.Programlar_Arasi_Bilesenler.Beceriler_Arasi_Iliski}
                isEditing={isEditing}
                onChange={(v) =>
                  updateProgramlarArasi("Beceriler_Arasi_Iliski", v)
                }
              />

              {/* Öğrenme Çıktıları ve Süreç Bileşenleri */}
              <tr>
                <td
                  valign="top"
                  className="border border-[#4bacc6] px-2.5 py-1 font-bold align-top"
                >
                  Öğrenme Çıktıları ve Süreç Bileşenleri
                </td>
                <td
                  colSpan={3}
                  valign="top"
                  className="border border-[#4bacc6] px-2.5 py-1 align-top"
                >
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={plan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri}
                      onChange={(e) =>
                        onUpdatePlan({
                          ...plan,
                          Ogrenme_Ciktilari_ve_Surec_Bilesenleri: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  ) : (
                    renderOgrenmeCiktilari(
                      plan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri
                    )
                  )}
                </td>
              </tr>

              {/* İçerik Çerçevesi */}
              <tr>
                <td
                  valign="top"
                  className="border border-[#4bacc6] px-2.5 py-1 font-bold align-top"
                >
                  İçerik Çerçevesi
                </td>
                <td
                  colSpan={3}
                  valign="top"
                  className="border border-[#4bacc6] px-2.5 py-1 font-bold align-top"
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={plan.Icerik_Cercevesi}
                      onChange={(e) =>
                        onUpdatePlan({
                          ...plan,
                          Icerik_Cercevesi: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-normal"
                    />
                  ) : (
                    plan.Icerik_Cercevesi
                  )}
                </td>
              </tr>

              {/* Öğrenme Kanıtları */}
              <EditableSingleRow
                label="Öğrenme Kanıtları"
                value={cleanOgrenmeKanitlariPrefix(plan.Ogrenme_Kanitlari)}
                isEditing={isEditing}
                multiline
                onChange={(v) =>
                  onUpdatePlan({
                    ...plan,
                    Ogrenme_Kanitlari: cleanOgrenmeKanitlariPrefix(v),
                  })
                }
              />

              {/* SECTION 3: ÖĞRENME-ÖĞRETME YAŞANTILARI */}
              <tr>
                <td
                  colSpan={4}
                  valign="top"
                  className="section-banner-cell bg-[#c2d69b] border border-[#4bacc6] px-2.5 py-1 font-bold text-black uppercase align-top"
                >
                  ÖĞRENME-ÖĞRETME YAŞANTILARI
                </td>
              </tr>

              <EditableSingleRow
                label="Temel Kabuller"
                value={plan.Ogrenme_Ogretme_Yasantilari.Temel_Kabuller}
                isEditing={isEditing}
                multiline
                onChange={(v) => updateYasantilarString("Temel_Kabuller", v)}
              />

              <EditableSingleRow
                label="Ön Değerlendirme Süreci"
                value={plan.Ogrenme_Ogretme_Yasantilari.On_Degerlendirme_Sureci}
                isEditing={isEditing}
                multiline
                onChange={(v) =>
                  updateYasantilarString("On_Degerlendirme_Sureci", v)
                }
              />

              <EditableSingleRow
                label="Köprü Kurma"
                value={plan.Ogrenme_Ogretme_Yasantilari.Kopru_Kurma}
                isEditing={isEditing}
                multiline
                onChange={(v) => updateYasantilarString("Kopru_Kurma", v)}
              />

              {/*Exact order from sample images: Öğretme Uygulamaları -> Güdüleme -> Dikkat Çekme -> Ek Öğretme Uygulamaları */}
              <EditableAsteriskArrayRow
                label="Öğretme Uygulamaları"
                items={plan.Ogrenme_Ogretme_Yasantilari.Ogretme_Uygulamalari}
                isEditing={isEditing}
                onUpdateItem={(idx, val) =>
                  updateYasantilarArrayItem("Ogretme_Uygulamalari", idx, val)
                }
                onAddItem={() => addYasantilarArrayItem("Ogretme_Uygulamalari")}
                onRemoveItem={(idx) =>
                  removeYasantilarArrayItem("Ogretme_Uygulamalari", idx)
                }
              />

              <EditableAsteriskArrayRow
                label="Güdüleme"
                items={plan.Ogrenme_Ogretme_Yasantilari.Guduleme}
                isEditing={isEditing}
                onUpdateItem={(idx, val) =>
                  updateYasantilarArrayItem("Guduleme", idx, val)
                }
                onAddItem={() => addYasantilarArrayItem("Guduleme")}
                onRemoveItem={(idx) => removeYasantilarArrayItem("Guduleme", idx)}
              />

              <EditableAsteriskArrayRow
                label="Dikkat Çekme"
                items={plan.Ogrenme_Ogretme_Yasantilari.Dikkat_Cekme}
                isEditing={isEditing}
                onUpdateItem={(idx, val) =>
                  updateYasantilarArrayItem("Dikkat_Cekme", idx, val)
                }
                onAddItem={() => addYasantilarArrayItem("Dikkat_Cekme")}
                onRemoveItem={(idx) =>
                  removeYasantilarArrayItem("Dikkat_Cekme", idx)
                }
              />

              <EditableAsteriskArrayRow
                label="Ek Öğretme Uygulamaları"
                items={plan.Ogrenme_Ogretme_Yasantilari.Ek_Ogretme_Uygulamalari}
                isEditing={isEditing}
                onUpdateItem={(idx, val) =>
                  updateYasantilarArrayItem("Ek_Ogretme_Uygulamalari", idx, val)
                }
                onAddItem={() =>
                  addYasantilarArrayItem("Ek_Ogretme_Uygulamalari")
                }
                onRemoveItem={(idx) =>
                  removeYasantilarArrayItem("Ek_Ogretme_Uygulamalari", idx)
                }
              />

              {/* SECTION 4: FARKLILAŞTIRMA */}
              <tr>
                <td
                  colSpan={4}
                  valign="top"
                  className="section-banner-cell bg-[#c2d69b] border border-[#4bacc6] px-2.5 py-1 font-bold text-black uppercase align-top"
                >
                  FARKLILAŞTIRMA
                </td>
              </tr>

              {(isEditing ||
                (plan.Farklilastirma && plan.Farklilastirma.trim().length > 0)) && (
                <EditableSingleRow
                  label="Farklılaştırma Uygulamaları"
                  value={plan.Farklilastirma}
                  isEditing={isEditing}
                  multiline
                  onChange={(v) =>
                    onUpdatePlan({
                      ...plan,
                      Farklilastirma: v,
                    })
                  }
                />
              )}
            </tbody>
          </table>
        </div>

        {/* Official Signature Footer (Matches Sample Screenshot 4) */}
        <div className="print-sig-block grid grid-cols-2 gap-8 pt-4 text-xs md:text-sm text-black">
          <div className="text-center flex flex-col justify-end space-y-1 pt-6">
            <div>{displayOgretmenAd}</div>
            <div className="font-bold">{displayOgretmenBrans}</div>
          </div>
          <div className="text-center flex flex-col justify-end space-y-1">
            <div>UYGUNDUR</div>
            <div className="tabular-nums">{displayOnayTarihi}</div>
            <div>{displayOkulMuduru}</div>
            <div className="font-bold">Okul Müdürü</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface EditableSingleRowProps {
  label: string;
  value: string;
  isEditing: boolean;
  multiline?: boolean;
  onChange: (val: string) => void;
}

const EditableSingleRow: React.FC<EditableSingleRowProps> = ({
  label,
  value,
  isEditing,
  multiline,
  onChange,
}) => {
  return (
    <tr>
      <td
        valign="top"
        className="border border-[#4bacc6] px-2.5 py-1 font-bold align-top w-[22%]"
      >
        {label}
      </td>
      <td
        colSpan={3}
        valign="top"
        className="border border-[#4bacc6] px-2.5 py-1 align-top whitespace-pre-line"
      >
        {isEditing ? (
          multiline ? (
            <textarea
              rows={4}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
            />
          )
        ) : (
          renderTextWithBoldCodes(value)
        )}
      </td>
    </tr>
  );
};

interface EditableAsteriskArrayRowProps {
  label: string;
  items: string[];
  isEditing: boolean;
  onUpdateItem: (index: number, val: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const EditableAsteriskArrayRow: React.FC<EditableAsteriskArrayRowProps> = ({
  label,
  items,
  isEditing,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
}) => {
  return (
    <tr>
      <td
        valign="top"
        className="border border-[#4bacc6] px-2.5 py-1 font-bold align-top w-[22%]"
      >
        <div>{label}</div>
        {isEditing && (
          <button
            type="button"
            onClick={onAddItem}
            className="no-print mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900"
          >
            <Plus className="w-3.5 h-3.5" />
            Madde Ekle
          </button>
        )}
      </td>
      <td
        colSpan={3}
        valign="top"
        className="border border-[#4bacc6] px-2.5 py-1 align-top"
      >
        {isEditing ? (
          <div className="space-y-1.5">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-xs font-bold pt-1.5">*</span>
                <textarea
                  rows={2}
                  value={item}
                  onChange={(e) => onUpdateItem(idx, e.target.value)}
                  className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs"
                />
                <button
                  type="button"
                  onClick={() => onRemoveItem(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-600"
                  title="Maddeyi sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-0.5">
            {items.map((item, idx) => {
              const cleaned = (item || "").trim().replace(/^\*\s*/, "");
              return <div key={idx}>* {cleaned}</div>;
            })}
          </div>
        )}
      </td>
    </tr>
  );
};
