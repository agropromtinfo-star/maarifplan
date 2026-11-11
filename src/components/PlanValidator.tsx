import React, { useState, useMemo } from "react";
import {
  MaarifLessonPlan,
  DocumentHeaderFooterMeta,
  YillikPlanWeekItem,
} from "../types/lessonPlan";
import { inferApprovalDateClient } from "../utils/clientFileExtractor";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wand2,
  CalendarClock,
  FileCheck,
  FileDown,
  Printer,
  ChevronDown,
  ChevronUp,
  Info,
  Edit2,
  Check,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export type ValidationSeverity = "error" | "warning" | "success";
export type ValidationCategory =
  | "ogrenme_ciktilari"
  | "tarih_ve_hafta"
  | "bos_alanlar"
  | "resmi_bilgiler"
  | "yasantilar";

export interface ValidationIssue {
  id: string;
  category: ValidationCategory;
  severity: "error" | "warning";
  title: string;
  description: string;
  fieldLabel: string;
  currentValue?: string;
  suggestedValue?: string;
  canAutoFix?: boolean;
  autoFixLabel?: string;
  autoFixAction?: () => void;
  editableKey?: string;
  editableType?: "meta" | "plan_db" | "plan_root";
}

export interface PassedCheck {
  id: string;
  category: ValidationCategory;
  title: string;
  description: string;
}

export interface PlanValidatorProps {
  plan: MaarifLessonPlan;
  meta: DocumentHeaderFooterMeta;
  onUpdatePlan: (updated: MaarifLessonPlan) => void;
  onUpdateMeta: (updated: DocumentHeaderFooterMeta) => void;
  onProceedToTable?: () => void;
  onExportWord?: () => void;
  onPrint?: () => void;
  availableWeeks?: YillikPlanWeekItem[];
  isOpenInitially?: boolean;
}

const TURKISH_MONTH_INDEX: Record<string, number> = {
  ocak: 1,
  şubat: 2,
  subat: 2,
  mart: 3,
  nisan: 4,
  mayıs: 5,
  mayis: 5,
  haziran: 6,
  temmuz: 7,
  ağustos: 8,
  agustos: 8,
  eylül: 9,
  eylul: 9,
  ekim: 10,
  kasım: 11,
  kasim: 11,
  aralık: 12,
  aralik: 12,
};

export const PlanValidator: React.FC<PlanValidatorProps> = ({
  plan,
  meta,
  onUpdatePlan,
  onUpdateMeta,
  onProceedToTable,
  onExportWord,
  onPrint,
  availableWeeks = [],
  isOpenInitially = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(isOpenInitially);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "errors" | "warnings" | "success"
  >("all");
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingTextValue, setEditingTextValue] = useState<string>("");
  const [exportWarningModalOpen, setExportWarningModalOpen] =
    useState<boolean>(false);
  const [pendingExportAction, setPendingExportAction] = useState<
    "word" | "print" | null
  >(null);

  // Run comprehensive validation scan over plan & meta
  const { issues, passedChecks, scorePercent, errorCount, warningCount } =
    useMemo(() => {
      const issuesList: ValidationIssue[] = [];
      const passedList: PassedCheck[] = [];

      // ------------------------------------------------------------------
      // 1. KONTROL GRUBU: ÖĞRENME ÇIKTILARI VE SÜREÇ BİLEŞENLERİ (Kritik)
      // ------------------------------------------------------------------
      const ciktilar = (plan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri || "").trim();
      if (!ciktilar) {
        issuesList.push({
          id: "cikti-bos",
          category: "ogrenme_ciktilari",
          severity: "error",
          title: "Öğrenme Çıktıları ve Süreç Bileşenleri Boş",
          description:
            "MEB Maarif Modeli formatında günlük ders planının omurgası olan Öğrenme Çıktısı (örn: ST.1.2...) ve süreç bileşenleri girilmemiş.",
          fieldLabel: "Öğrenme Çıktıları ve Süreç Bileşenleri",
          currentValue: "Boş",
        });
      } else {
        // Kod kontrolü (örn: ST.1.2 veya MAT.9.1.2)
        const hasCode = /\b[A-ZÇĞİÖŞÜ]{2,8}\.\d{1,2}(?:\.\d{1,2})*\b/.test(
          ciktilar
        );
        if (!hasCode) {
          issuesList.push({
            id: "cikti-kod-eksik",
            category: "ogrenme_ciktilari",
            severity: "error",
            title: "Öğrenme Çıktısı Kodu Bulunamadı",
            description:
              "Çıktı metninde maarif kodu (örn: 'ST.1.2.', 'TDE.9.2.1.') tespit edilemedi. Kodsuz metin resmî teftiş standartlarına uymayabilir.",
            fieldLabel: "Öğrenme Çıktıları",
            currentValue: ciktilar.slice(0, 80) + (ciktilar.length > 80 ? "..." : ""),
          });
        }

        // Alt süreç bileşenleri kontrolü (a), b), c), ç)...)
        const subComponentMatches = ciktilar.match(/\b[a-zçğıöşü]\)\s+/gi) || [];
        if (subComponentMatches.length === 0 && ciktilar.length < 80) {
          issuesList.push({
            id: "cikti-alt-madde-eksik",
            category: "ogrenme_ciktilari",
            severity: "warning",
            title: "Alt Süreç Bileşenleri (a, b, c...) Eksik Görünüyor",
            description:
              "Öğrenme çıktısı tek satırda kalmış; derste işlenecek basamakları belirten a), b), c) alt süreç bileşenleri yer almıyor.",
            fieldLabel: "Süreç Bileşenleri",
            currentValue: ciktilar.slice(0, 100),
          });
        } else {
          passedList.push({
            id: "cikti-tamam",
            category: "ogrenme_ciktilari",
            title: "Öğrenme Çıktıları ve Süreç Bileşenleri Uyumlu",
            description: `Kapsamlı çıktı tanımı ve ${
              subComponentMatches.length > 0
                ? `${subComponentMatches.length} adet süreç bileşeni (a, b, c...)`
                : "detaylı kazanım içeriği"
            } mevcut.`,
          });
        }
      }

      // ------------------------------------------------------------------
      // 2. KONTROL GRUBU: TARİH VE HAFTA UYUŞMAZLIKLARI
      // ------------------------------------------------------------------
      const haftaEtiketi = (meta.haftaEtiketi || "").trim();
      const tarihAraligi = (meta.tarihAraligi || "").trim();
      const onayTarihi = (meta.onayTarihi || "").trim();

      const weekNumberMatch = haftaEtiketi.match(/\b(\d{1,2})\b/);
      const weekNo = weekNumberMatch ? Number(weekNumberMatch[1]) : null;

      // 2.1 Tarih Aralığı Kontrolü
      if (!tarihAraligi || /^\d+\s*\.\s*hafta$/i.test(tarihAraligi)) {
        issuesList.push({
          id: "tarih-araligi-bos",
          category: "tarih_ve_hafta",
          severity: "warning",
          title: "Tarih Aralığı Eksik veya Yinelenmiş",
          description:
            "Plan başlığında gün-ay aralığı (örn: '19 - 23 Ekim') yerine sadece hafta adı yazıyor.",
          fieldLabel: "Tarih Aralığı",
          currentValue: tarihAraligi || "(Boş)",
          canAutoFix: weekNo !== null && availableWeeks.length > 0,
          autoFixLabel: "Yıllık Plandan Eşitle",
          autoFixAction: () => {
            const found = availableWeeks.find((w) => w.haftaNo === weekNo);
            if (found && found.tarihAraligi) {
              const newApproval =
                found.onayTarihi || inferApprovalDateClient(found.tarihAraligi);
              onUpdateMeta({
                ...meta,
                tarihAraligi: found.tarihAraligi,
                onayTarihi: newApproval || meta.onayTarihi,
              });
            }
          },
        });
      }

      // 2.2 Onay Tarihi Kontrolü
      if (!onayTarihi || onayTarihi.includes("202...")) {
        const suggestedDate = inferApprovalDateClient(tarihAraligi) || "14/09/2026";
        issuesList.push({
          id: "onay-tarihi-bos",
          category: "tarih_ve_hafta",
          severity: "warning",
          title: "Onay Tarihi Doldurulmamış",
          description:
            "Okul müdürü imza bloğundaki onay tarihi taslak ('..../..../202...') olarak kalmış.",
          fieldLabel: "Onay Tarihi",
          currentValue: onayTarihi || "(Boş)",
          suggestedValue: suggestedDate,
          canAutoFix: true,
          autoFixLabel: `Pazartesi Tarihini Ata (${suggestedDate})`,
          autoFixAction: () => {
            onUpdateMeta({
              ...meta,
              onayTarihi: suggestedDate,
            });
          },
        });
      }

      // 2.3 TARİH UYUŞMAZLIĞI (DATE MISMATCH) KONTROLÜ
      // Örnek: Hafta 16 (Ocak ayı) veya Tarih Aralığı "19 - 23 Ekim" iken Onay Tarihi "14/09/2026" (Eylül) kalmışsa!
      if (tarihAraligi && onayTarihi && !onayTarihi.includes("202...")) {
        const lowerRange = tarihAraligi.toLocaleLowerCase("tr-TR");
        let rangeMonthNum: number | null = null;
        for (const [mName, mNum] of Object.entries(TURKISH_MONTH_INDEX)) {
          if (lowerRange.includes(mName)) {
            rangeMonthNum = mNum;
            break;
          }
        }

        const approvalMonthMatch = onayTarihi.match(
          /\b\d{1,2}[./](\d{1,2})[./]\d{2,4}\b/
        );
        const approvalMonthNum = approvalMonthMatch
          ? Number(approvalMonthMatch[1])
          : null;

        if (
          rangeMonthNum !== null &&
          approvalMonthNum !== null &&
          rangeMonthNum !== approvalMonthNum
        ) {
          const autoSuggestedDate =
            inferApprovalDateClient(tarihAraligi) || onayTarihi;
          issuesList.push({
            id: "tarih-uyusmazligi-kritik",
            category: "tarih_ve_hafta",
            severity: "error",
            title: "Tarih ve Onay Tarihi Uyuşmazlığı Tespit Edildi!",
            description: `Ders haftası '${tarihAraligi}' (${rangeMonthNum}. ay) olarak seçilmiş, ancak onay tarihi '${onayTarihi}' (${approvalMonthNum}. ay) olarak ayarlanmış. Bu durum resmî evraklarda tarih tutarsızlığına yol açar.`,
            fieldLabel: "Tarih / Onay Uyumsuzluğu",
            currentValue: `${tarihAraligi} ↔ Onay: ${onayTarihi}`,
            suggestedValue: autoSuggestedDate,
            canAutoFix: true,
            autoFixLabel: `Otomatik Düzelt: ${autoSuggestedDate} Olarak Güncelle`,
            autoFixAction: () => {
              onUpdateMeta({
                ...meta,
                onayTarihi: autoSuggestedDate,
              });
            },
          });
        } else if (rangeMonthNum !== null && approvalMonthNum !== null) {
          passedList.push({
            id: "tarih-uyumu-tamam",
            category: "tarih_ve_hafta",
            title: "Hafta Tarih Aralığı ve Onay Tarihi Tam Uyumlu",
            description: `${tarihAraligi} dönemi ile onay tarihi (${onayTarihi}) birbirini doğruluyor.`,
          });
        }
      }

      // ------------------------------------------------------------------
      // 3. KONTROL GRUBU: BOŞ ALANLAR VE ŞÜPHELİ VERİLER (Ders Bilgisi)
      // ------------------------------------------------------------------
      const db = plan.Ders_Bilgisi;

      // 3.1 Ders Adı
      if (!db.Ders || db.Ders.trim() === "DERS") {
        issuesList.push({
          id: "bos-ders",
          category: "bos_alanlar",
          severity: "error",
          title: "Ders İsmi Belirtilmemiş",
          description: "Ders bilgisi bölümünde ders adı boş bırakılmış.",
          fieldLabel: "Ders",
          currentValue: db.Ders || "(Boş)",
          editableKey: "Ders",
          editableType: "plan_db",
        });
      } else {
        passedList.push({
          id: "ders-dolu",
          category: "bos_alanlar",
          title: "Ders Bilgisi Doğrulandı",
          description: `${db.Ders} (${db.Sinif || meta.sinifDuzeyi || "Sınıf Belirtilmiş"})`,
        });
      }

      // 3.2 Öğrenme Birimi (Suspicious "VE SÜRE" vs Real Unit)
      if (!db.Ogrenme_Birimi || db.Ogrenme_Birimi.trim() === "") {
        issuesList.push({
          id: "bos-birim",
          category: "bos_alanlar",
          severity: "error",
          title: "Öğrenme Birimi (Ünite / Tema) Boş",
          description: "Ders planının ait olduğu ünite veya öğrenme birimi yazılmamış.",
          fieldLabel: "Öğrenme Birimi",
          editableKey: "Ogrenme_Birimi",
          editableType: "plan_db",
        });
      } else if (/^VE\s*SÜRE$/i.test(db.Ogrenme_Birimi.trim())) {
        issuesList.push({
          id: "supheli-birim",
          category: "bos_alanlar",
          severity: "warning",
          title: "Öğrenme Birimi 'VE SÜRE' Olarak Görünüyor",
          description:
            "Tablo başlığındaki sütun ismi ('ÖĞRENME BİRİMİ VE SÜRE') içerik olarak algılanmış olabilir. Gerçek ünite adını girmeniz önerilir.",
          fieldLabel: "Öğrenme Birimi",
          currentValue: db.Ogrenme_Birimi,
          editableKey: "Ogrenme_Birimi",
          editableType: "plan_db",
        });
      }

      // 3.3 Süre
      if (!db.Sure || db.Sure.trim() === "") {
        issuesList.push({
          id: "bos-sure",
          category: "bos_alanlar",
          severity: "warning",
          title: "Haftalık Ders Saati (Süre) Boş",
          description: "Örn: '2 Ders Saati' şeklinde ders süresi girilmelidir.",
          fieldLabel: "Süre",
          currentValue: "(Boş)",
          canAutoFix: true,
          autoFixLabel: "'2 Ders Saati' Yap",
          autoFixAction: () => {
            onUpdatePlan({
              ...plan,
              Ders_Bilgisi: { ...plan.Ders_Bilgisi, Sure: "2 Ders Saati" },
            });
          },
        });
      }

      // 3.4 Alan Becerileri ve Eğilimler
      if (!db.Alan_Becerileri || db.Alan_Becerileri.trim() === "") {
        issuesList.push({
          id: "bos-alan-becerileri",
          category: "bos_alanlar",
          severity: "warning",
          title: "Alan Becerileri Alanı Boş",
          description:
            "Maarif Modelinde her meslek veya kültür dersinin alan becerisi tanımlanmalıdır.",
          fieldLabel: "Alan Becerileri",
          editableKey: "Alan_Becerileri",
          editableType: "plan_db",
        });
      }

      if (!db.Egilimler || db.Egilimler.trim() === "") {
        issuesList.push({
          id: "bos-egilimler",
          category: "bos_alanlar",
          severity: "warning",
          title: "Eğilimler (E1.1, E2.2...) Alanı Boş",
          description: "Öğrencinin sergileyeceği zihinsel ve sosyal eğilimler belirtilmemiş.",
          fieldLabel: "Eğilimler",
          editableKey: "Egilimler",
          editableType: "plan_db",
        });
      }

      // ------------------------------------------------------------------
      // 4. KONTROL GRUBU: ÖĞRENME-ÖĞRETME YAŞANTILARI & UYGULAMA MADDELERİ
      // ------------------------------------------------------------------
      const yasantilar = plan.Ogrenme_Ogretme_Yasantilari;
      const uygCount = yasantilar.Ogretme_Uygulamalari?.length || 0;
      if (uygCount === 0) {
        issuesList.push({
          id: "bos-ogretme-uygulamalari",
          category: "yasantilar",
          severity: "error",
          title: "Öğretme Uygulamaları Maddeleri Boş",
          description:
            "Dersin işleniş sürecini adım adım anlatan uygulama basamakları (* ile başlayan maddeler) bulunmuyor.",
          fieldLabel: "Öğretme Uygulamaları",
        });
      } else {
        passedList.push({
          id: "ogretme-uygulamalari-tamam",
          category: "yasantilar",
          title: "Öğretme Uygulamaları Zengin ve Detaylı",
          description: `${uygCount} adımda yapılandırılmış mesleki / pedagojik uygulama basamağı tanımlı.`,
        });
      }

      if (
        !yasantilar.Temel_Kabuller?.trim() ||
        !yasantilar.On_Degerlendirme_Sureci?.trim() ||
        !yasantilar.Kopru_Kurma?.trim()
      ) {
        issuesList.push({
          id: "eksik-hazirlik-surecleri",
          category: "yasantilar",
          severity: "warning",
          title: "Hazırlık Süreçleri Eksik (Temel Kabuller / Ön Değerlendirme / Köprü Kurma)",
          description:
            "Öğrencilerin ön bilgileri veya günlük hayatla ilişki kurma bölümlerinden biri boş bırakılmış.",
          fieldLabel: "Öğrenme-Öğretme Yaşantıları Giriş Bölümü",
        });
      }

      // ------------------------------------------------------------------
      // 5. KONTROL GRUBU: RESMÎ BİLGİLER VE İMZA ALANLARI
      // ------------------------------------------------------------------
      if (!meta.okulAdi?.trim()) {
        issuesList.push({
          id: "bos-okul-adi",
          category: "resmi_bilgiler",
          severity: "warning",
          title: "Okul Adı Eksik",
          description:
            "Resmî evrak başlığı için okul adı girilmemiş (Örn: SEYDİŞEHİR ILICA MESLEKİ VE TEKNİK ANADOLU LİSESİ).",
          fieldLabel: "Okul Adı",
          currentValue: "(Boş)",
          editableKey: "okulAdi",
          editableType: "meta",
        });
      } else {
        passedList.push({
          id: "okul-adi-tamam",
          category: "resmi_bilgiler",
          title: "Okul Adı Üstbilgisi Hazır",
          description: meta.okulAdi.trim().toLocaleUpperCase("tr-TR"),
        });
      }

      if (!meta.ogretmenAdSoyad?.trim()) {
        issuesList.push({
          id: "bos-ogretmen",
          category: "resmi_bilgiler",
          severity: "warning",
          title: "Ders Öğretmeni Ad-Soyad Boş",
          description: "İmza bloğunda nokta yerine öğretmen adı görüntülenmesi önerilir.",
          fieldLabel: "Ders Öğretmeni",
          editableKey: "ogretmenAdSoyad",
          editableType: "meta",
        });
      }

      if (!meta.okulMuduruAdSoyad?.trim()) {
        issuesList.push({
          id: "bos-mudur",
          category: "resmi_bilgiler",
          severity: "warning",
          title: "Okul Müdürü Ad-Soyad Boş",
          description: "UYGUNDUR onay bloğu altına okul müdürünün adı girilmelidir.",
          fieldLabel: "Okul Müdürü",
          editableKey: "okulMuduruAdSoyad",
          editableType: "meta",
        });
      }

      const totalChecks = issuesList.length + passedList.length;
      const passedCount = passedList.length;
      const errors = issuesList.filter((i) => i.severity === "error").length;
      const warnings = issuesList.filter((i) => i.severity === "warning").length;

      // Penalize errors heavily, warnings moderately
      const penalty = errors * 18 + warnings * 6;
      const score = Math.max(15, Math.min(100, Math.round(100 - penalty)));

      return {
        issues: issuesList,
        passedChecks: passedList,
        scorePercent: score,
        errorCount: errors,
        warningCount: warnings,
      };
    }, [plan, meta, availableWeeks, onUpdateMeta, onUpdatePlan]);

  // Filtered issues to display
  const displayedIssues = useMemo(() => {
    if (selectedFilter === "errors") {
      return issues.filter((i) => i.severity === "error");
    }
    if (selectedFilter === "warnings") {
      return issues.filter((i) => i.severity === "warning");
    }
    return issues;
  }, [issues, selectedFilter]);

  // Handlers for inline quick editing
  const handleStartEdit = (issue: ValidationIssue) => {
    setEditingFieldId(issue.id);
    if (issue.editableType === "meta" && issue.editableKey) {
      setEditingTextValue(
        (meta[issue.editableKey as keyof DocumentHeaderFooterMeta] as string) || ""
      );
    } else if (issue.editableType === "plan_db" && issue.editableKey) {
      setEditingTextValue(
        (plan.Ders_Bilgisi[
          issue.editableKey as keyof MaarifLessonPlan["Ders_Bilgisi"]
        ] as string) || ""
      );
    } else {
      setEditingTextValue(issue.currentValue || "");
    }
  };

  const handleSaveEdit = (issue: ValidationIssue) => {
    if (issue.editableType === "meta" && issue.editableKey) {
      onUpdateMeta({
        ...meta,
        [issue.editableKey]: editingTextValue.trim(),
      });
    } else if (issue.editableType === "plan_db" && issue.editableKey) {
      onUpdatePlan({
        ...plan,
        Ders_Bilgisi: {
          ...plan.Ders_Bilgisi,
          [issue.editableKey]: editingTextValue.trim(),
        },
      });
    }
    setEditingFieldId(null);
  };

  // Safe Export Interception
  const triggerSafeExport = (action: "word" | "print") => {
    if (errorCount > 0) {
      setPendingExportAction(action);
      setExportWarningModalOpen(true);
    } else {
      if (action === "word" && onExportWord) onExportWord();
      if (action === "print" && onPrint) onPrint();
    }
  };

  const confirmPendingExport = () => {
    setExportWarningModalOpen(false);
    if (pendingExportAction === "word" && onExportWord) onExportWord();
    if (pendingExportAction === "print" && onPrint) onPrint();
    setPendingExportAction(null);
  };

  return (
    <div className="no-print w-full bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mb-6 transition-all">
      {/* Top Header Bar */}
      <div
        className={`px-5 py-4 border-b flex flex-wrap items-center justify-between gap-4 transition-colors ${
          errorCount > 0
            ? "bg-rose-50/70 border-rose-200"
            : warningCount > 0
            ? "bg-amber-50/70 border-amber-200"
            : "bg-emerald-50/70 border-emerald-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              errorCount > 0
                ? "bg-rose-600 text-white"
                : warningCount > 0
                ? "bg-amber-500 text-white"
                : "bg-emerald-600 text-white"
            }`}
          >
            {errorCount > 0 ? (
              <ShieldAlert className="w-5 h-5" />
            ) : warningCount > 0 ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Plan Doğrulama Motoru (MEB Maarif Standartları)
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  scorePercent >= 90
                    ? "bg-emerald-100 text-emerald-800"
                    : scorePercent >= 70
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                %{scorePercent} Uyumlu
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {errorCount > 0
                ? `${errorCount} Kritik Alan Düzeltme Gerektiriyor`
                : warningCount > 0
                ? `${warningCount} Alanda İyileştirme Önerisi Mevcut`
                : "Plan Resmî Tablo Standartlarına Tamamen Uygun"}
            </h3>
          </div>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5">
          {onExportWord && (
            <button
              type="button"
              onClick={() => triggerSafeExport("word")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
              title="Dışa aktarma öncesi doğrulamayı çalıştırır"
            >
              <FileDown className="w-3.5 h-3.5 text-sky-600" />
              Word (.doc) İndir
            </button>
          )}

          {onPrint && (
            <button
              type="button"
              onClick={() => triggerSafeExport("print")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
            >
              <Printer className="w-3.5 h-3.5 text-amber-600" />
              Yazdır / PDF
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors shrink-0"
          >
            {isExpanded ? (
              <>
                Gizle <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                İncele &amp; Düzelt ({issues.length}){" "}
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Validator Details Body */}
      {isExpanded && (
        <div className="p-5 space-y-5 bg-white">
          {/* Quick Overview Badges & Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <button
                type="button"
                onClick={() => setSelectedFilter("all")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedFilter === "all"
                    ? "bg-slate-900 text-white font-semibold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Tüm Maddeler ({issues.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("errors")}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                  selectedFilter === "errors"
                    ? "bg-rose-600 text-white font-semibold"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                Kritikler ({errorCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("warnings")}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                  selectedFilter === "warnings"
                    ? "bg-amber-500 text-white font-semibold"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Öneriler ({warningCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("success")}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                  selectedFilter === "success"
                    ? "bg-emerald-600 text-white font-semibold"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Onaylananlar ({passedChecks.length})
              </button>
            </div>

            {/* Quick Auto-Fix All Action */}
            {issues.some((i) => i.canAutoFix) && (
              <button
                type="button"
                onClick={() => {
                  issues.forEach((issue) => {
                    if (issue.canAutoFix && issue.autoFixAction) {
                      issue.autoFixAction();
                    }
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Uyuşmazlıkları Otomatik Düzelt
              </button>
            )}
          </div>

          {/* Section: Issues List */}
          {selectedFilter !== "success" && displayedIssues.length > 0 && (
            <div className="space-y-3">
              {displayedIssues.map((issue) => {
                const isEditing = editingFieldId === issue.id;

                return (
                  <div
                    key={issue.id}
                    className={`p-4 rounded-xl border transition-all ${
                      issue.severity === "error"
                        ? "bg-rose-50/40 border-rose-200"
                        : "bg-amber-50/40 border-amber-200"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              issue.severity === "error"
                                ? "bg-rose-200 text-rose-900"
                                : "bg-amber-200 text-amber-900"
                            }`}
                          >
                            {issue.severity === "error" ? (
                              <>
                                <XCircle className="w-3 h-3" />
                                Kritik Hata
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3 h-3" />
                                Dikkat
                              </>
                            )}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            [{issue.fieldLabel}]
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900">
                          {issue.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {issue.description}
                        </p>

                        {/* Current Value Preview */}
                        {issue.currentValue && (
                          <div className="text-[11px] font-mono text-slate-600 bg-white/80 border border-slate-200 rounded px-2 py-1 inline-block max-w-full truncate">
                            Mevcut Değer:{" "}
                            <span className="font-semibold text-slate-800">
                              {issue.currentValue}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Zone: Auto-Fix or Quick Inline Edit */}
                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        {issue.canAutoFix && issue.autoFixAction && (
                          <button
                            type="button"
                            onClick={issue.autoFixAction}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors"
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                            {issue.autoFixLabel || "Düzelt"}
                          </button>
                        )}

                        {issue.editableKey && !isEditing && (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(issue)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                          >
                            <Edit2 className="w-3 h-3 text-slate-500" />
                            Hemen Yaz
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline Text Editor for Quick Fix */}
                    {isEditing && (
                      <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingTextValue}
                          onChange={(e) => setEditingTextValue(e.target.value)}
                          placeholder={`${issue.fieldLabel} girin...`}
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-indigo-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(issue);
                            if (e.key === "Escape") setEditingFieldId(null);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(issue)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Kaydet
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingFieldId(null)}
                          className="px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                        >
                          İptal
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* If No issues in active filter */}
          {selectedFilter !== "success" && displayedIssues.length === 0 && (
            <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">
                Bu kategoride herhangi bir eksik veya uyuşmazlık bulunamadı.
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Planda bulunan tüm temel kontroller başarılı bir şekilde tamamlandı.
              </p>
            </div>
          )}

          {/* Section: Passed Checks (When selected or on demand) */}
          {selectedFilter === "success" && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Doğrulanan Maarif Modeli Bileşenleri ({passedChecks.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {passedChecks.map((check) => (
                  <div
                    key={check.id}
                    className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-0.5">
                      <div className="font-semibold text-slate-900">
                        {check.title}
                      </div>
                      <div className="text-slate-600">{check.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Guidance Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>
                Resmî Maarif tablosu aşağıda sunulmaktadır. Çıktı almadan önce
                yukarıdaki uyarıları incelemeniz evrak geçerliliği için önerilir.
              </span>
            </div>

            {onProceedToTable && (
              <button
                type="button"
                onClick={onProceedToTable}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              >
                Resmî Tabloya Geç <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pre-Export Guard Warning Modal */}
      {exportWarningModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Dışa Aktarma Öncesi Dikkat!
                </h4>
                <p className="text-xs text-slate-500">
                  Planda {errorCount} kritik eksik / uyuşmazlık tespit edildi.
                </p>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 space-y-2">
              <p className="font-semibold">
                Tespit edilen kritik alanlar resmî evrak formatını etkileyebilir:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-800">
                {issues
                  .filter((i) => i.severity === "error")
                  .map((err) => (
                    <li key={err.id}>
                      <strong>{err.title}</strong>
                    </li>
                  ))}
              </ul>
            </div>

            <p className="text-xs text-slate-600">
              Bu alanları &quot;Hemen Düzelt&quot; butonları ile tamamlayabilir veya
              mevcut haliyle dışa aktarmaya devam edebilirsiniz.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setExportWarningModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-indigo-950 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Geri Dön ve Düzelt
              </button>
              <button
                type="button"
                onClick={confirmPendingExport}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
              >
                Yine de Dışa Aktar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
