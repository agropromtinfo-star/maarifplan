/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  MaarifLessonPlan,
  DocumentHeaderFooterMeta,
  SavedLessonPlanRecord,
  YillikPlanWeekItem,
} from "./types/lessonPlan";
import { OfficialPlanTable } from "./components/OfficialPlanTable";
import { PlanValidator } from "./components/PlanValidator";
import { ExportConfigModal } from "./components/ExportConfigModal";
import { TopicSummaryModal } from "./components/TopicSummaryModal";
import {
  downloadWordDoc,
  downloadAllWeeksWordDoc,
  exportAllWeeksPdfPrint,
  applyDocumentTitleForPdf,
  triggerPrintWithFileName,
} from "./utils/exportPlan";
import {
  extractFileContentHybrid,
  extractDocumentMetadataClient,
  safeReadJsonResponse,
  buildXmlContextPayloadWithAnalysis,
  inferApprovalDateClient,
  parseQuickWeeksClient,
  synthesizePlanClientSide,
  synthesizeAllWeeksClientSide,
} from "./utils/clientFileExtractor";
import {
  enforceAndMergeLessonPlan,
  extractWeekPlanStructured,
  formatFullWeekAndDateRange,
  parseDersBilgiFormuStructured,
  resolveValidDateRange,
  cleanOgrenmeKanitlariPrefix,
  validateCourseNameAgainstDbf,
  extractWeeklyMaterialSummaryBox,
} from "./shared/maarifPlanEngine";
import {
  Upload,
  FileText,
  Bookmark,
  Trash2,
  FolderOpen,
  FileDown,
  Check,
  AlertCircle,
  Loader2,
  Search,
  Calendar,
  RefreshCw,
  Printer,
  ChevronDown,
  Lock,
  Unlock,
  BookOpen,
} from "lucide-react";

type ActiveTab = "workspace" | "official-table" | "saved-plans";
type UploadFieldKey = "yillik_plan" | "ders_materyali" | "ders_bilgi_formu";
type LockableMetaKey =
  | "okulAdi"
  | "egitimOgretimYili"
  | "dersIsmi"
  | "sinifDuzeyi"
  | "ogretmenAdSoyad"
  | "ogretmenBransi"
  | "okulMuduruAdSoyad";

const LOCKABLE_META_KEYS: LockableMetaKey[] = [
  "okulAdi",
  "egitimOgretimYili",
  "dersIsmi",
  "sinifDuzeyi",
  "ogretmenAdSoyad",
  "ogretmenBransi",
  "okulMuduruAdSoyad",
];

const STORAGE_KEY = "maarif_atolye_saved_plans_v4";
const META_VALUES_STORAGE_KEY = "maarif_atolye_meta_values_v1";
const LOCKED_FIELDS_STORAGE_KEY = "maarif_atolye_locked_fields_v1";
const MAX_FILE_SIZE_BYTES = 40 * 1024 * 1024; // 40 MB
const ACCEPTED_FILE_EXTENSIONS = ".pdf,.docx,.doc,.xlsx,.xls,.txt,.md,.csv,.rtf";

// Standard MEB 36-Week Calendar fallback (used before Yıllık Plan is uploaded or if user wants to pick manually)
const DEFAULT_MEB_WEEKS: YillikPlanWeekItem[] = [
  { id: "meb-1", haftaNo: 1, haftaEtiketi: "1. HAFTA", tarihAraligi: "14 - 18 Eylül", onayTarihi: "14/09/2026" },
  { id: "meb-2", haftaNo: 2, haftaEtiketi: "2. HAFTA", tarihAraligi: "21 - 25 Eylül", onayTarihi: "21/09/2026" },
  { id: "meb-3", haftaNo: 3, haftaEtiketi: "3. HAFTA", tarihAraligi: "28 Eylül - 02 Ekim", onayTarihi: "28/09/2026" },
  { id: "meb-4", haftaNo: 4, haftaEtiketi: "4. HAFTA", tarihAraligi: "05 - 09 Ekim", onayTarihi: "05/10/2026" },
  { id: "meb-5", haftaNo: 5, haftaEtiketi: "5. HAFTA", tarihAraligi: "12 - 16 Ekim", onayTarihi: "12/10/2026" },
  { id: "meb-6", haftaNo: 6, haftaEtiketi: "6. HAFTA", tarihAraligi: "19 - 23 Ekim", onayTarihi: "19/10/2026" },
  { id: "meb-7", haftaNo: 7, haftaEtiketi: "7. HAFTA", tarihAraligi: "26 - 30 Ekim", onayTarihi: "26/10/2026" },
  { id: "meb-8", haftaNo: 8, haftaEtiketi: "8. HAFTA", tarihAraligi: "02 - 06 Kasım", onayTarihi: "02/11/2026" },
  { id: "meb-9", haftaNo: 9, haftaEtiketi: "9. HAFTA", tarihAraligi: "16 - 20 Kasım", onayTarihi: "16/11/2026" },
  { id: "meb-10", haftaNo: 10, haftaEtiketi: "10. HAFTA", tarihAraligi: "23 - 27 Kasım", onayTarihi: "23/11/2026" },
  { id: "meb-11", haftaNo: 11, haftaEtiketi: "11. HAFTA", tarihAraligi: "30 Kasım - 04 Aralık", onayTarihi: "30/11/2026" },
  { id: "meb-12", haftaNo: 12, haftaEtiketi: "12. HAFTA", tarihAraligi: "07 - 11 Aralık", onayTarihi: "07/12/2026" },
  { id: "meb-13", haftaNo: 13, haftaEtiketi: "13. HAFTA", tarihAraligi: "14 - 18 Aralık", onayTarihi: "14/12/2026" },
  { id: "meb-14", haftaNo: 14, haftaEtiketi: "14. HAFTA", tarihAraligi: "21 - 25 Aralık", onayTarihi: "21/12/2026" },
  { id: "meb-15", haftaNo: 15, haftaEtiketi: "15. HAFTA", tarihAraligi: "28 Aralık - 01 Ocak", onayTarihi: "28/12/2026" },
  { id: "meb-16", haftaNo: 16, haftaEtiketi: "16. HAFTA", tarihAraligi: "04 - 08 Ocak", onayTarihi: "04/01/2027" },
  { id: "meb-17", haftaNo: 17, haftaEtiketi: "17. HAFTA", tarihAraligi: "11 - 15 Ocak", onayTarihi: "11/01/2027" },
  { id: "meb-18", haftaNo: 18, haftaEtiketi: "18. HAFTA", tarihAraligi: "18 - 22 Ocak", onayTarihi: "18/01/2027" },
  { id: "meb-19", haftaNo: 19, haftaEtiketi: "19. HAFTA", tarihAraligi: "08 - 12 Şubat", onayTarihi: "08/02/2027" },
  { id: "meb-20", haftaNo: 20, haftaEtiketi: "20. HAFTA", tarihAraligi: "15 - 19 Şubat", onayTarihi: "15/02/2027" },
  { id: "meb-21", haftaNo: 21, haftaEtiketi: "21. HAFTA", tarihAraligi: "22 - 26 Şubat", onayTarihi: "22/02/2027" },
  { id: "meb-22", haftaNo: 22, haftaEtiketi: "22. HAFTA", tarihAraligi: "01 - 05 Mart", onayTarihi: "01/03/2027" },
  { id: "meb-23", haftaNo: 23, haftaEtiketi: "23. HAFTA", tarihAraligi: "08 - 12 Mart", onayTarihi: "08/03/2027" },
  { id: "meb-24", haftaNo: 24, haftaEtiketi: "24. HAFTA", tarihAraligi: "15 - 19 Mart", onayTarihi: "15/03/2027" },
  { id: "meb-25", haftaNo: 25, haftaEtiketi: "25. HAFTA", tarihAraligi: "22 - 26 Mart", onayTarihi: "22/03/2027" },
  { id: "meb-26", haftaNo: 26, haftaEtiketi: "26. HAFTA", tarihAraligi: "29 Mart - 02 Nisan", onayTarihi: "29/03/2027" },
  { id: "meb-27", haftaNo: 27, haftaEtiketi: "27. HAFTA", tarihAraligi: "12 - 16 Nisan", onayTarihi: "12/04/2027" },
  { id: "meb-28", haftaNo: 28, haftaEtiketi: "28. HAFTA", tarihAraligi: "19 - 23 Nisan", onayTarihi: "19/04/2027" },
  { id: "meb-29", haftaNo: 29, haftaEtiketi: "29. HAFTA", tarihAraligi: "26 - 30 Nisan", onayTarihi: "26/04/2027" },
  { id: "meb-30", haftaNo: 30, haftaEtiketi: "30. HAFTA", tarihAraligi: "03 - 07 Mayıs", onayTarihi: "03/05/2027" },
  { id: "meb-31", haftaNo: 31, haftaEtiketi: "31. HAFTA", tarihAraligi: "10 - 14 Mayıs", onayTarihi: "10/05/2027" },
  { id: "meb-32", haftaNo: 32, haftaEtiketi: "32. HAFTA", tarihAraligi: "17 - 21 Mayıs", onayTarihi: "17/05/2027" },
  { id: "meb-33", haftaNo: 33, haftaEtiketi: "33. HAFTA", tarihAraligi: "24 - 28 Mayıs", onayTarihi: "24/05/2027" },
  { id: "meb-34", haftaNo: 34, haftaEtiketi: "34. HAFTA", tarihAraligi: "31 Mayıs - 04 Haziran", onayTarihi: "31/05/2027" },
  { id: "meb-35", haftaNo: 35, haftaEtiketi: "35. HAFTA", tarihAraligi: "07 - 11 Haziran", onayTarihi: "07/06/2027" },
  { id: "meb-36", haftaNo: 36, haftaEtiketi: "36. HAFTA", tarihAraligi: "14 - 18 Haziran", onayTarihi: "14/06/2027" },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("workspace");
  const [isExportConfigOpen, setIsExportConfigOpen] = useState<boolean>(false);

  // Header & Footer Document Metadata Fields (persisted across sessions)
  const [meta, setMeta] = useState<DocumentHeaderFooterMeta>(() => {
    const defaults: DocumentHeaderFooterMeta = {
      okulAdi: "",
      egitimOgretimYili: "2026-2027 Eğitim ve Öğretim Yılı 1. Dönem",
      dersIsmi: "",
      sinifDuzeyi: "",
      haftaEtiketi: "1. HAFTA",
      tarihAraligi: "14 - 18 Eylül",
      onayTarihi: "14/09/2026",
      ogretmenAdSoyad: "",
      ogretmenBransi: "Ders Öğretmeni",
      okulMuduruAdSoyad: "",
    };
    try {
      const raw = localStorage.getItem(META_VALUES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          const rawSavedDers = String(parsed.dersIsmi ?? defaults.dersIsmi).trim();
          const cleanedSavedDers = rawSavedDers.replace(
            /^[A-ZÇĞİÖŞÜ\s]+\(\s*([^)]+)\s*\)$/,
            "$1"
          );
          return {
            ...defaults,
            okulAdi: String(parsed.okulAdi ?? defaults.okulAdi),
            egitimOgretimYili: String(
              parsed.egitimOgretimYili ?? defaults.egitimOgretimYili
            ),
            dersIsmi: cleanedSavedDers,
            sinifDuzeyi: String(parsed.sinifDuzeyi ?? defaults.sinifDuzeyi),
            ogretmenAdSoyad: String(
              parsed.ogretmenAdSoyad ?? defaults.ogretmenAdSoyad
            ),
            ogretmenBransi: String(
              parsed.ogretmenBransi ?? defaults.ogretmenBransi
            ),
            okulMuduruAdSoyad: String(
              parsed.okulMuduruAdSoyad ?? defaults.okulMuduruAdSoyad
            ),
          };
        }
      }
    } catch {
      // ignore storage errors
    }
    return defaults;
  });

  // Individual & Bulk Lock state for the 7 school/course/signature fields
  const [lockedFields, setLockedFields] = useState<
    Record<LockableMetaKey, boolean>
  >(() => {
    const defaultLocks: Record<LockableMetaKey, boolean> = {
      okulAdi: false,
      egitimOgretimYili: false,
      dersIsmi: false,
      sinifDuzeyi: false,
      ogretmenAdSoyad: false,
      ogretmenBransi: false,
      okulMuduruAdSoyad: false,
    };
    try {
      const raw = localStorage.getItem(LOCKED_FIELDS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return {
            okulAdi: Boolean(parsed.okulAdi),
            egitimOgretimYili: Boolean(parsed.egitimOgretimYili),
            dersIsmi: Boolean(parsed.dersIsmi),
            sinifDuzeyi: Boolean(parsed.sinifDuzeyi),
            ogretmenAdSoyad: Boolean(parsed.ogretmenAdSoyad),
            ogretmenBransi: Boolean(parsed.ogretmenBransi),
            okulMuduruAdSoyad: Boolean(parsed.okulMuduruAdSoyad),
          };
        }
      }
    } catch {
      // ignore storage errors
    }
    return defaultLocks;
  });

  const lockedFieldsRef = useRef<Record<LockableMetaKey, boolean>>(lockedFields);
  useEffect(() => {
    lockedFieldsRef.current = lockedFields;
    try {
      localStorage.setItem(
        LOCKED_FIELDS_STORAGE_KEY,
        JSON.stringify(lockedFields)
      );
    } catch {
      // ignore storage errors
    }
  }, [lockedFields]);

  useEffect(() => {
    try {
      const toPersist: Record<LockableMetaKey, string> = {
        okulAdi: meta.okulAdi,
        egitimOgretimYili: meta.egitimOgretimYili,
        dersIsmi: meta.dersIsmi,
        sinifDuzeyi: meta.sinifDuzeyi,
        ogretmenAdSoyad: meta.ogretmenAdSoyad,
        ogretmenBransi: meta.ogretmenBransi,
        okulMuduruAdSoyad: meta.okulMuduruAdSoyad,
      };
      localStorage.setItem(META_VALUES_STORAGE_KEY, JSON.stringify(toPersist));
    } catch {
      // ignore storage errors
    }
  }, [
    meta.okulAdi,
    meta.egitimOgretimYili,
    meta.dersIsmi,
    meta.sinifDuzeyi,
    meta.ogretmenAdSoyad,
    meta.ogretmenBransi,
    meta.okulMuduruAdSoyad,
  ]);

  const toggleFieldLock = (key: LockableMetaKey) => {
    setLockedFields((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const lockedCount = LOCKABLE_META_KEYS.filter((k) => lockedFields[k]).length;
  const areAllFieldsLocked = lockedCount === LOCKABLE_META_KEYS.length;

  const toggleLockAllFields = () => {
    const nextValue = !areAllFieldsLocked;
    setLockedFields({
      okulAdi: nextValue,
      egitimOgretimYili: nextValue,
      dersIsmi: nextValue,
      sinifDuzeyi: nextValue,
      ogretmenAdSoyad: nextValue,
      ogretmenBransi: nextValue,
      okulMuduruAdSoyad: nextValue,
    });
  };

  // Extracted weeks from the user's uploaded Yıllık Plan
  const [extractedWeeks, setExtractedWeeks] = useState<YillikPlanWeekItem[]>([]);
  const [isParsingWeeks, setIsParsingWeeks] = useState<boolean>(false);
  const [selectedWeekId, setSelectedWeekId] = useState<string>("meb-1");

  // Three core inputs
  const [yillikPlan, setYillikPlan] = useState<string>("");
  const [dersMateryali, setDersMateryali] = useState<string>("");
  const [dersBilgiFormu, setDersBilgiFormu] = useState<string>("");

  // File upload refs & independent states per field
  const yillikPlanInputRef = useRef<HTMLInputElement | null>(null);
  const dersMateryaliInputRef = useRef<HTMLInputElement | null>(null);
  const dersBilgiFormuInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadingFields, setUploadingFields] = useState<
    Record<UploadFieldKey, boolean>
  >({
    yillik_plan: false,
    ders_materyali: false,
    ders_bilgi_formu: false,
  });

  const [uploadedFileNames, setUploadedFileNames] = useState<
    Record<UploadFieldKey, string | null>
  >({
    yillik_plan: null,
    ders_materyali: null,
    ders_bilgi_formu: null,
  });

  const [fieldErrors, setFieldErrors] = useState<
    Record<UploadFieldKey, string | null>
  >({
    yillik_plan: null,
    ders_materyali: null,
    ders_bilgi_formu: null,
  });

  const isAnyUploading =
    uploadingFields.yillik_plan ||
    uploadingFields.ders_materyali ||
    uploadingFields.ders_bilgi_formu;

  // Active lesson plan
  const [currentPlan, setCurrentPlan] = useState<MaarifLessonPlan | null>(null);

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAllWeeksMenuOpen, setIsAllWeeksMenuOpen] = useState<boolean>(false);
  const [isExportingAllWeeks, setIsExportingAllWeeks] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isTopicSummaryOpen, setIsTopicSummaryOpen] = useState<boolean>(false);

  // Saved plans in localStorage
  const [savedPlans, setSavedPlans] = useState<SavedLessonPlanRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlans));
    } catch {
      // ignore storage quota errors
    }
  }, [savedPlans]);

  // Keep browser document.title synced to "Ders İsmi_EğitimÖğretimYılı_GünlükPlan" so PDF Save As dialogs always prefill this exact filename
  useEffect(() => {
    applyDocumentTitleForPdf(meta, currentPlan);
    const handleBeforePrint = () => {
      applyDocumentTitleForPdf(meta, currentPlan);
    };
    window.addEventListener("beforeprint", handleBeforePrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
    };
  }, [meta.dersIsmi, meta.egitimOgretimYili, currentPlan]);

  const updateMetaField = (
    key: keyof DocumentHeaderFooterMeta,
    value: string
  ) => {
    setMeta((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (key === "dersIsmi") {
      setCurrentPlan((prevPlan) =>
        prevPlan
          ? {
              ...prevPlan,
              Ders_Bilgisi: {
                ...prevPlan.Ders_Bilgisi,
                Ders: value,
              },
            }
          : prevPlan
      );
    } else if (key === "sinifDuzeyi") {
      setCurrentPlan((prevPlan) =>
        prevPlan
          ? {
              ...prevPlan,
              Ders_Bilgisi: {
                ...prevPlan.Ders_Bilgisi,
                Sinif: value,
              },
            }
          : prevPlan
      );
    }
  };

  // Request ID tracker to discard stale async week-parse responses when a new course is uploaded
  const weekParseRequestIdRef = useRef<number>(0);

  // Memoized structured Ders Bilgi Formu for dynamic unit & topic filtering of Öğrenme Kanıtları and Öğretme Uygulamaları
  const structuredDbfMemo = useMemo(() => {
    return parseDersBilgiFormuStructured(
      dersBilgiFormu,
      yillikPlan,
      dersMateryali
    );
  }, [dersBilgiFormu, yillikPlan, dersMateryali]);

  // Real-time validation comparing the user's manually entered 'Ders İsmi' with the uploaded 'Ders Bilgi Formu'
  const dersIsmiValidation = useMemo(() => {
    return validateCourseNameAgainstDbf(meta.dersIsmi, dersBilgiFormu);
  }, [meta.dersIsmi, dersBilgiFormu]);

  // Memoized deterministic week & unit list derived directly from the active course documents
  const localParsedWeeks = useMemo<YillikPlanWeekItem[]>(() => {
    if (!yillikPlan.trim()) return [];
    return parseQuickWeeksClient(yillikPlan, dersBilgiFormu, dersMateryali);
  }, [yillikPlan, dersBilgiFormu, dersMateryali]);

  // Memoized activeWeekList that always binds to the current document's weeks & units
  // and dynamically filters 'Öğrenme Kanıtları' and 'Öğretme Uygulamaları' from dersBilgiFormu per week's unit & topic
  const activeWeekList = useMemo<YillikPlanWeekItem[]>(() => {
    if (!yillikPlan.trim()) {
      return DEFAULT_MEB_WEEKS;
    }

    const baseWeeks: YillikPlanWeekItem[] =
      extractedWeeks.length > 0
        ? (() => {
            const distinctAiUnits = new Set(
              extractedWeeks
                .map((w) => (w.ogrenmeBirimi || "").trim())
                .filter(Boolean)
            );
            const distinctLocalUnits = new Set(
              localParsedWeeks
                .map((w) => (w.ogrenmeBirimi || "").trim())
                .filter(Boolean)
            );

            return extractedWeeks.map((w) => {
              const localMatch = localParsedWeeks.find(
                (lw) => lw.haftaNo === w.haftaNo
              );
              const preferLocalUnit =
                Boolean(localMatch?.ogrenmeBirimi) &&
                (!w.ogrenmeBirimi ||
                  (distinctAiUnits.size <= 1 && distinctLocalUnits.size > 1) ||
                  (distinctLocalUnits.size > 0 &&
                    !distinctLocalUnits.has((w.ogrenmeBirimi || "").trim())));

              return {
                ...w,
                tarihAraligi: resolveValidDateRange(
                  w.tarihAraligi || localMatch?.tarihAraligi || "",
                  w.haftaNo
                ),
                ogrenmeBirimi: preferLocalUnit
                  ? localMatch!.ogrenmeBirimi
                  : w.ogrenmeBirimi || localMatch?.ogrenmeBirimi || "",
                icerikCercevesi:
                  localMatch?.icerikCercevesi || w.icerikCercevesi || "",
                konuVeCiktiOzeti:
                  localMatch?.konuVeCiktiOzeti || w.konuVeCiktiOzeti || "",
                sure: w.sure || localMatch?.sure || "",
              };
            });
          })()
        : localParsedWeeks.length > 0
        ? localParsedWeeks
        : DEFAULT_MEB_WEEKS;

    // Dynamically filter 'Öğrenme Kanıtları' and 'Öğretme Uygulamaları' from dersBilgiFormu for each week's specific unit and topic
    return baseWeeks.map((weekItem) => {
      const validDate = resolveValidDateRange(
        weekItem.tarihAraligi,
        weekItem.haftaNo
      );
      const weekSpecific = extractWeekPlanStructured(
        yillikPlan,
        weekItem.haftaEtiketi,
        validDate,
        structuredDbfMemo,
        {
          ...weekItem,
          tarihAraligi: validDate,
        }
      );

      return {
        ...weekItem,
        tarihAraligi: validDate,
        ogrenmeBirimi:
          weekSpecific.ogrenmeBirimi || weekItem.ogrenmeBirimi || "",
        icerikCercevesi:
          weekSpecific.icerikCercevesi || weekItem.icerikCercevesi || "",
        ogrenmeKanitlari:
          weekSpecific.unitOgrenmeKanitlari ||
          structuredDbfMemo.ogrenmeKanitlari ||
          weekItem.ogrenmeKanitlari ||
          "",
        ogretmeUygulamalari:
          weekSpecific.unitOgretmeUygulamalari.length > 0
            ? weekSpecific.unitOgretmeUygulamalari
            : weekItem.ogretmeUygulamalari || [],
      };
    });
  }, [
    yillikPlan,
    dersBilgiFormu,
    dersMateryali,
    extractedWeeks,
    localParsedWeeks,
    structuredDbfMemo,
  ]);

  const selectedWeekObj = useMemo<YillikPlanWeekItem>(() => {
    return (
      activeWeekList.find((w) => w.id === selectedWeekId) || activeWeekList[0]
    );
  }, [activeWeekList, selectedWeekId]);

  const handleSelectWeek = (weekId: string) => {
    setSelectedWeekId(weekId);
    const found = activeWeekList.find((w) => w.id === weekId);
    if (found) {
      const validDate = resolveValidDateRange(found.tarihAraligi, found.haftaNo);
      setMeta((prev) => ({
        ...prev,
        haftaEtiketi: found.haftaEtiketi,
        tarihAraligi: validDate,
        onayTarihi:
          found.onayTarihi ||
          inferApprovalDateClient(validDate) ||
          prev.onayTarihi,
      }));

      // Immediately keep the Lesson Plan Output (including week/unit/topic-filtered Öğrenme Kanıtları and Öğretme Uygulamaları) updated for the selected week
      if (yillikPlan.trim()) {
        const detectedDocMeta = extractDocumentMetadataClient(
          `${dersBilgiFormu}\n${yillikPlan}\n${dersMateryali}`
        );
        const effectiveDersIsmi = meta.dersIsmi.trim();
        const effectiveSinifDuzeyi =
          meta.sinifDuzeyi.trim() || detectedDocMeta.sinifDuzeyi;

        const weekSyncedPlan = synthesizePlanClientSide({
          yillik_plan: yillikPlan,
          ders_materyali: dersMateryali,
          ders_bilgi_formu: dersBilgiFormu,
          hafta_etiketi: found.haftaEtiketi,
          tarih_araligi: validDate,
          ders_ismi: effectiveDersIsmi,
          sinif_duzeyi: effectiveSinifDuzeyi,
          secilen_hafta_verisi: {
            ...found,
            tarihAraligi: validDate,
          },
        });
        if (effectiveDersIsmi) {
          weekSyncedPlan.Ders_Bilgisi.Ders = effectiveDersIsmi;
        }

        if (found.ogrenmeKanitlari) {
          weekSyncedPlan.Ogrenme_Kanitlari = found.ogrenmeKanitlari;
        }
        if (found.ogretmeUygulamalari && found.ogretmeUygulamalari.length > 0) {
          weekSyncedPlan.Ogrenme_Ogretme_Yasantilari.Ogretme_Uygulamalari =
            found.ogretmeUygulamalari.map((b) => b.replace(/^\*\s*/, "").trim());
        }

        setCurrentPlan((prevPlan) => (prevPlan ? weekSyncedPlan : prevPlan));
      }
    }
  };

  // Synchronize extractedWeeks, selectedWeekId, and currentPlan whenever the active course documents change
  useEffect(() => {
    if (!yillikPlan.trim()) {
      setExtractedWeeks([]);
      setSelectedWeekId("meb-1");
      return;
    }
    if (localParsedWeeks.length > 0) {
      setExtractedWeeks(localParsedWeeks);
      const activeWeek =
        localParsedWeeks.find((w) => w.id === selectedWeekId) ||
        localParsedWeeks[0];
      if (activeWeek.id !== selectedWeekId) {
        setSelectedWeekId(activeWeek.id);
      }

      const validDate = resolveValidDateRange(
        activeWeek.tarihAraligi,
        activeWeek.haftaNo
      );
      setMeta((prev) => ({
        ...prev,
        haftaEtiketi: activeWeek.haftaEtiketi,
        tarihAraligi: validDate,
        onayTarihi:
          activeWeek.onayTarihi ||
          inferApprovalDateClient(validDate) ||
          prev.onayTarihi,
      }));

      setCurrentPlan((prevPlan) => {
        if (!prevPlan) return prevPlan;
        const detectedDocMeta = extractDocumentMetadataClient(
          `${dersBilgiFormu}\n${yillikPlan}\n${dersMateryali}`
        );
        const effectiveDersIsmi = meta.dersIsmi.trim();
        const synced = synthesizePlanClientSide({
          yillik_plan: yillikPlan,
          ders_materyali: dersMateryali,
          ders_bilgi_formu: dersBilgiFormu,
          hafta_etiketi: activeWeek.haftaEtiketi,
          tarih_araligi: validDate,
          ders_ismi: effectiveDersIsmi,
          sinif_duzeyi: meta.sinifDuzeyi.trim() || detectedDocMeta.sinifDuzeyi,
          secilen_hafta_verisi: {
            ...activeWeek,
            tarihAraligi: validDate,
          },
        });
        if (effectiveDersIsmi) {
          synced.Ders_Bilgisi.Ders = effectiveDersIsmi;
        }
        if (activeWeek.ogrenmeKanitlari) {
          synced.Ogrenme_Kanitlari = activeWeek.ogrenmeKanitlari;
        }
        if (
          activeWeek.ogretmeUygulamalari &&
          activeWeek.ogretmeUygulamalari.length > 0
        ) {
          synced.Ogrenme_Ogretme_Yasantilari.Ogretme_Uygulamalari =
            activeWeek.ogretmeUygulamalari.map((b) =>
              b.replace(/^\*\s*/, "").trim()
            );
        }
        return synced;
      });
    }
  }, [yillikPlan, dersBilgiFormu, dersMateryali, localParsedWeeks]);

  // Clears cached week/unit state from any previous course and binds the new document's weeks, units,
  // and unit/topic-filtered 'Öğrenme Kanıtları' & 'Öğretme Uygulamaları' from dersBilgiFormu
  const analyzeWeeksFromYillikPlan = async (
    planText: string,
    overrides?: { dbfText?: string; materyalText?: string }
  ) => {
    const cleanText = (planText || "").trim();
    const requestId = ++weekParseRequestIdRef.current;

    // 1. Immediately purge cached week/unit state from previous course uploads
    setExtractedWeeks([]);

    if (!cleanText) {
      setSelectedWeekId("meb-1");
      return;
    }

    const activeDbf =
      overrides?.dbfText !== undefined ? overrides.dbfText : dersBilgiFormu;
    const activeMateryal =
      overrides?.materyalText !== undefined
        ? overrides.materyalText
        : dersMateryali;

    // 2. Parse active Ders Bilgi Formu and compute fresh deterministic weeks & unit/topic-filtered DBF data
    const activeStructuredDbf = parseDersBilgiFormuStructured(
      activeDbf,
      cleanText,
      activeMateryal
    );
    const localDeterministicWeeks = parseQuickWeeksClient(
      cleanText,
      activeDbf,
      activeMateryal
    );
    const detectedDocMeta = extractDocumentMetadataClient(cleanText);

    if (localDeterministicWeeks.length > 0) {
      setExtractedWeeks(localDeterministicWeeks);
      const activeLocal =
        localDeterministicWeeks.find((w) => w.id === selectedWeekId) ||
        localDeterministicWeeks[0];
      setSelectedWeekId(activeLocal.id);
      const locks = lockedFieldsRef.current;
      setMeta((prev) => ({
        ...prev,
        okulAdi: locks.okulAdi
          ? prev.okulAdi
          : prev.okulAdi.trim() || detectedDocMeta.okulAdi?.trim() || "",
        dersIsmi: prev.dersIsmi,
        sinifDuzeyi: locks.sinifDuzeyi
          ? prev.sinifDuzeyi
          : prev.sinifDuzeyi.trim() || detectedDocMeta.sinifDuzeyi?.trim() || "",
        haftaEtiketi: activeLocal.haftaEtiketi,
        tarihAraligi: activeLocal.tarihAraligi,
        onayTarihi:
          activeLocal.onayTarihi ||
          inferApprovalDateClient(activeLocal.tarihAraligi) ||
          prev.onayTarihi,
      }));
    }

    setIsParsingWeeks(true);
    try {
      const response = await fetch("/api/parse-weeks", {
        method: "POST",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: `<yillik_plan>${cleanText.slice(0, 12000)}</yillik_plan>`,
      });
      const parsed = await safeReadJsonResponse<{
        okulAdi?: string;
        dersIsmi?: string;
        sinifDuzeyi?: string;
        weeks?: YillikPlanWeekItem[];
      }>(response);

      // Ignore stale responses if another course upload occurred in the meantime
      if (requestId !== weekParseRequestIdRef.current) {
        return;
      }

      if (
        parsed.ok &&
        parsed.data &&
        Array.isArray(parsed.data.weeks) &&
        parsed.data.weeks.length > 0
      ) {
        const data = parsed.data;
        const aiWeeks = data.weeks!;
        const distinctAiUnits = new Set(
          aiWeeks.map((w) => (w.ogrenmeBirimi || "").trim()).filter(Boolean)
        );
        const distinctLocalUnits = new Set(
          localDeterministicWeeks
            .map((w) => (w.ogrenmeBirimi || "").trim())
            .filter(Boolean)
        );

        const mergedWeeks: YillikPlanWeekItem[] = aiWeeks.map((aiW) => {
          const localMatch = localDeterministicWeeks.find(
            (lw) => lw.haftaNo === aiW.haftaNo
          );
          const preferLocalUnit =
            Boolean(localMatch?.ogrenmeBirimi) &&
            (!aiW.ogrenmeBirimi ||
              (distinctAiUnits.size <= 1 && distinctLocalUnits.size > 1) ||
              (distinctLocalUnits.size > 0 &&
                !distinctLocalUnits.has((aiW.ogrenmeBirimi || "").trim())));

          const resolvedDate = resolveValidDateRange(
            aiW.tarihAraligi || localMatch?.tarihAraligi || "",
            aiW.haftaNo
          );
          const resolvedUnit = preferLocalUnit
            ? localMatch!.ogrenmeBirimi
            : aiW.ogrenmeBirimi || localMatch?.ogrenmeBirimi || "";
          const resolvedSummary =
            localMatch?.konuVeCiktiOzeti || aiW.konuVeCiktiOzeti || "";

          const candidateWeekItem: YillikPlanWeekItem = {
            ...aiW,
            tarihAraligi: resolvedDate,
            ogrenmeBirimi: resolvedUnit,
            icerikCercevesi:
              localMatch?.icerikCercevesi || aiW.icerikCercevesi || "",
            konuVeCiktiOzeti: resolvedSummary,
            sure: aiW.sure || localMatch?.sure || "",
          };

          const weekSpecific = extractWeekPlanStructured(
            cleanText,
            candidateWeekItem.haftaEtiketi,
            resolvedDate,
            activeStructuredDbf,
            candidateWeekItem
          );

          return {
            ...candidateWeekItem,
            ogrenmeBirimi:
              weekSpecific.ogrenmeBirimi || candidateWeekItem.ogrenmeBirimi || "",
            icerikCercevesi:
              weekSpecific.icerikCercevesi ||
              candidateWeekItem.icerikCercevesi ||
              "",
            ogrenmeKanitlari:
              weekSpecific.unitOgrenmeKanitlari ||
              localMatch?.ogrenmeKanitlari ||
              activeStructuredDbf.ogrenmeKanitlari ||
              "",
            ogretmeUygulamalari:
              weekSpecific.unitOgretmeUygulamalari.length > 0
                ? weekSpecific.unitOgretmeUygulamalari
                : localMatch?.ogretmeUygulamalari || [],
          };
        });

        setExtractedWeeks(mergedWeeks);
        const targetWeek =
          mergedWeeks.find((w) => w.id === selectedWeekId) || mergedWeeks[0];
        setSelectedWeekId(targetWeek.id);
        const locks = lockedFieldsRef.current;
        setMeta((prev) => ({
          ...prev,
          okulAdi: locks.okulAdi
            ? prev.okulAdi
            : prev.okulAdi.trim() ||
              data.okulAdi?.trim() ||
              detectedDocMeta.okulAdi?.trim() ||
              "",
          dersIsmi: prev.dersIsmi,
          sinifDuzeyi: locks.sinifDuzeyi
            ? prev.sinifDuzeyi
            : prev.sinifDuzeyi.trim() ||
              data.sinifDuzeyi?.trim() ||
              detectedDocMeta.sinifDuzeyi?.trim() ||
              "",
          haftaEtiketi: targetWeek.haftaEtiketi,
          tarihAraligi: targetWeek.tarihAraligi,
          onayTarihi:
            targetWeek.onayTarihi ||
            inferApprovalDateClient(targetWeek.tarihAraligi) ||
            prev.onayTarihi,
        }));
      }
    } catch {
      // keep localDeterministicWeeks bound via activeWeekList useMemo
    } finally {
      if (requestId === weekParseRequestIdRef.current) {
        setIsParsingWeeks(false);
      }
    }
  };

  const processSelectedFile = async (
    file: File,
    fieldKey: UploadFieldKey,
    setter: (val: string) => void,
    inputElement?: HTMLInputElement | null
  ) => {
    // Clear previous field error
    setFieldErrors((prev) => ({ ...prev, [fieldKey]: null }));
    setErrorMessage(null);

    // 1. Validate 40 MB limit immediately
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const msg = `"${file.name}" dosyası (${formatFileSize(
        file.size
      )}) 40 MB sınırını aşmaktadır. Lütfen en fazla 40 MB boyutunda bir dosya seçin.`;
      setFieldErrors((prev) => ({ ...prev, [fieldKey]: msg }));
      setErrorMessage(msg);
      if (inputElement) inputElement.value = "";
      return;
    }

    // 2. Validate file extension
    const lowerName = file.name.toLowerCase();
    const isSupported =
      lowerName.endsWith(".pdf") ||
      lowerName.endsWith(".docx") ||
      lowerName.endsWith(".doc") ||
      lowerName.endsWith(".xlsx") ||
      lowerName.endsWith(".xls") ||
      lowerName.endsWith(".txt") ||
      lowerName.endsWith(".md") ||
      lowerName.endsWith(".csv") ||
      lowerName.endsWith(".rtf");

    if (!isSupported) {
      const msg = `"${file.name}" desteklenmeyen bir dosya türüdür. Lütfen .pdf, .docx, .doc veya .xlsx formatında bir dosya seçin.`;
      setFieldErrors((prev) => ({ ...prev, [fieldKey]: msg }));
      setErrorMessage(msg);
      if (inputElement) inputElement.value = "";
      return;
    }

    setUploadingFields((prev) => ({ ...prev, [fieldKey]: true }));

    try {
      const result = await extractFileContentHybrid(file);
      const extractedText = result.text || "";

      setter(extractedText);
      setUploadedFileNames((prev) => ({
        ...prev,
        [fieldKey]: `${file.name} (${formatFileSize(file.size)} · ${extractedText.length.toLocaleString("tr-TR")} karakter)`,
      }));

      // Never auto-overwrite user's manual Ders İsmi; only fill empty Okul Adı / Sınıf Düzeyi if unlocked
      if (result.detectedMeta) {
        const locks = lockedFieldsRef.current;
        setMeta((prev) => ({
          ...prev,
          okulAdi: locks.okulAdi
            ? prev.okulAdi
            : prev.okulAdi.trim() || result.detectedMeta.okulAdi?.trim() || "",
          dersIsmi: prev.dersIsmi,
          sinifDuzeyi: locks.sinifDuzeyi
            ? prev.sinifDuzeyi
            : prev.sinifDuzeyi.trim() ||
              result.detectedMeta.sinifDuzeyi?.trim() ||
              "",
        }));
      }

      // Trigger analyzeWeeksFromYillikPlan to purge stale course week cache and re-bind activeWeekList
      if (fieldKey === "yillik_plan") {
        setCurrentPlan(null);

        // Detect if the newly uploaded Yıllık Plan belongs to a different course than the existing dersBilgiFormu
        const newDetectedMeta =
          result.detectedMeta || extractDocumentMetadataClient(extractedText);
        const newCourse = (newDetectedMeta?.dersIsmi || "")
          .trim()
          .toLocaleLowerCase("tr-TR");

        let shouldPurgeOldDbf = false;
        if (dersBilgiFormu.trim() && newCourse) {
          const oldDbfCourse = (
            extractDocumentMetadataClient(dersBilgiFormu).dersIsmi || ""
          )
            .trim()
            .toLocaleLowerCase("tr-TR");
          if (
            oldDbfCourse &&
            !newCourse.includes(oldDbfCourse.slice(0, 4)) &&
            !oldDbfCourse.includes(newCourse.slice(0, 4))
          ) {
            shouldPurgeOldDbf = true;
          }
        }

        let effectiveDbf = dersBilgiFormu;
        let effectiveMateryal = dersMateryali;
        if (shouldPurgeOldDbf) {
          setDersBilgiFormu("");
          setDersMateryali("");
          setUploadedFileNames((prev) => ({
            ...prev,
            ders_bilgi_formu: null,
            ders_materyali: null,
          }));
          effectiveDbf = "";
          effectiveMateryal = "";
        }

        await analyzeWeeksFromYillikPlan(extractedText, {
          dbfText: effectiveDbf,
          materyalText: effectiveMateryal,
        });
      } else {
        if (fieldKey === "ders_bilgi_formu") {
          const updatedDbf = parseDersBilgiFormuStructured(
            extractedText,
            yillikPlan,
            dersMateryali
          );
          const refreshedWeekData = extractWeekPlanStructured(
            yillikPlan,
            meta.haftaEtiketi,
            meta.tarihAraligi,
            updatedDbf,
            selectedWeekObj
          );
          setCurrentPlan((prevPlan) => {
            if (!prevPlan) return prevPlan;
            return {
              ...prevPlan,
              Ogrenme_Kanitlari:
                updatedDbf.ogrenmeKanitlari ||
                refreshedWeekData.unitOgrenmeKanitlari ||
                prevPlan.Ogrenme_Kanitlari,
              Farklilastirma:
                updatedDbf.farklilastirma || prevPlan.Farklilastirma,
              Ogrenme_Ogretme_Yasantilari: {
                ...prevPlan.Ogrenme_Ogretme_Yasantilari,
                Temel_Kabuller:
                  updatedDbf.temelKabuller ||
                  prevPlan.Ogrenme_Ogretme_Yasantilari.Temel_Kabuller,
                On_Degerlendirme_Sureci:
                  updatedDbf.onDegerlendirmeSureci ||
                  prevPlan.Ogrenme_Ogretme_Yasantilari.On_Degerlendirme_Sureci,
                Kopru_Kurma:
                  updatedDbf.kopruKurma ||
                  prevPlan.Ogrenme_Ogretme_Yasantilari.Kopru_Kurma,
                Ogretme_Uygulamalari:
                  refreshedWeekData.unitOgretmeUygulamalari.length > 0
                    ? refreshedWeekData.unitOgretmeUygulamalari.map((b) =>
                        b.replace(/^\*\s*/, "").trim()
                      )
                    : prevPlan.Ogrenme_Ogretme_Yasantilari.Ogretme_Uygulamalari,
              },
            };
          });
        } else if (fieldKey === "ders_materyali") {
          setCurrentPlan((prevPlan) => {
            if (!prevPlan) return prevPlan;
            const updatedOzet = extractWeeklyMaterialSummaryBox(extractedText, {
              ogrenmeBirimi: prevPlan.Ders_Bilgisi.Ogrenme_Birimi,
              icerikCercevesi: prevPlan.Icerik_Cercevesi,
              konuVeCiktiOzeti: selectedWeekObj?.konuVeCiktiOzeti || "",
              ogrenmeCiktilari:
                prevPlan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri,
            });
            return {
              ...prevPlan,
              Ogrenme_Ogretme_Yasantilari: {
                ...prevPlan.Ogrenme_Ogretme_Yasantilari,
                Haftalik_Ozet:
                  updatedOzet ||
                  prevPlan.Ogrenme_Ogretme_Yasantilari.Haftalik_Ozet,
              },
            };
          });
        }
        if (yillikPlan.trim()) {
          await analyzeWeeksFromYillikPlan(yillikPlan, {
            dbfText:
              fieldKey === "ders_bilgi_formu" ? extractedText : dersBilgiFormu,
            materyalText:
              fieldKey === "ders_materyali" ? extractedText : dersMateryali,
          });
        }
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Dosya yüklenirken veya metin çıkarılırken bir hata oluştu.";
      setFieldErrors((prev) => ({ ...prev, [fieldKey]: msg }));
      setErrorMessage(msg);
    } finally {
      setUploadingFields((prev) => ({ ...prev, [fieldKey]: false }));
      if (inputElement) {
        inputElement.value = "";
      }
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: UploadFieldKey,
    setter: (val: string) => void
  ) => {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (!file) return;
    await processSelectedFile(file, fieldKey, setter, inputEl);
  };

  const handleFileDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    fieldKey: UploadFieldKey,
    setter: (val: string) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processSelectedFile(file, fieldKey, setter, null);
  };

  const handleGeneratePlan = async (overrideWeekId?: string) => {
    if (!yillikPlan.trim() || !dersMateryali.trim()) {
      setErrorMessage(
        "Lütfen 'Ünitelendirilmiş Yıllık Plan' ve 'Ders Materyali' alanlarını doldurun veya dosya (.pdf, .docx, .xlsx) yükleyin."
      );
      setActiveTab("workspace");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const targetWeekObj = overrideWeekId
        ? activeWeekList.find((w) => w.id === overrideWeekId) || selectedWeekObj
        : selectedWeekObj;

      const targetHaftaEtiketi =
        overrideWeekId && targetWeekObj
          ? targetWeekObj.haftaEtiketi
          : meta.haftaEtiketi;
      const targetTarihAraligi =
        overrideWeekId && targetWeekObj
          ? resolveValidDateRange(targetWeekObj.tarihAraligi, targetWeekObj.haftaNo)
          : meta.tarihAraligi;
      const targetOnayTarihi =
        overrideWeekId && targetWeekObj
          ? targetWeekObj.onayTarihi ||
            inferApprovalDateClient(targetTarihAraligi) ||
            meta.onayTarihi
          : meta.onayTarihi;

      const detectedDocMeta = extractDocumentMetadataClient(
        `${dersBilgiFormu}\n${yillikPlan}\n${dersMateryali}`
      );
      const effectiveDersIsmi = meta.dersIsmi.trim();
      const effectiveSinifDuzeyi =
        meta.sinifDuzeyi.trim() || detectedDocMeta.sinifDuzeyi;
      const effectiveOkulAdi =
        meta.okulAdi.trim() || detectedDocMeta.okulAdi;

      // Decompose the full, untruncated documents in memory and build the XML-tagged context package
      const { xmlPayload, structuredDbf, weekData, materyalSlice } =
        buildXmlContextPayloadWithAnalysis({
          yillik_plan: yillikPlan,
          ders_materyali: dersMateryali,
          ders_bilgi_formu: dersBilgiFormu,
          hafta_etiketi: targetHaftaEtiketi,
          tarih_araligi: targetTarihAraligi,
          onay_tarihi: targetOnayTarihi,
          okul_adi: effectiveOkulAdi,
          egitim_ogretim_yili: meta.egitimOgretimYili,
          ders_ismi: effectiveDersIsmi,
          sinif_duzeyi: effectiveSinifDuzeyi,
          secilen_hafta_verisi: targetWeekObj,
          dosya_adlari: uploadedFileNames,
        });

      let aiCandidatePlan: Partial<MaarifLessonPlan> | null = null;
      let serverDetectedWeekMeta: {
        haftaEtiketi?: string;
        tarihAraligi?: string;
        onayTarihi?: string;
      } | null = null;

      try {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 45000);

        const response = await fetch("/api/generate-plan", {
          method: "POST",
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
          signal: controller.signal,
          body: xmlPayload,
        });

        window.clearTimeout(timeoutId);

        const parsed = await safeReadJsonResponse<{
          plan?: MaarifLessonPlan;
          detectedWeekMeta?: {
            haftaEtiketi?: string;
            tarihAraligi?: string;
            onayTarihi?: string;
          };
          verificationSummary?: string;
          error?: string;
        }>(response);

        if (parsed.ok && parsed.data?.plan) {
          aiCandidatePlan = parsed.data.plan;
          if (parsed.data.detectedWeekMeta) {
            serverDetectedWeekMeta = parsed.data.detectedWeekMeta;
          }
        }
      } catch (networkOrProxyErr) {
        console.warn(
          "Proxy/Network timeout or payload limit encountered, using client-side contextual synthesis:",
          networkOrProxyErr
        );
      }

      // Sync verified date range from server/AI verification onto weekData before final merge
      if (
        serverDetectedWeekMeta?.tarihAraligi &&
        serverDetectedWeekMeta.tarihAraligi.trim().length >= 5 &&
        !/^\d+\s*\.\s*hafta$/i.test(serverDetectedWeekMeta.tarihAraligi.trim())
      ) {
        weekData.tarihAraligi = serverDetectedWeekMeta.tarihAraligi.trim();
      }

      // Enforce 1:1 verbatim integrity for Ders Bilgi Formu & Yıllık Plan fields + merge verified outcomes & week-specific AI synthesis
      const generated = enforceAndMergeLessonPlan(
        aiCandidatePlan,
        structuredDbf,
        weekData,
        materyalSlice,
        {
          dersIsmi: effectiveDersIsmi,
          sinifDuzeyi: effectiveSinifDuzeyi,
        }
      );

      // Ensure the selected week's dynamically filtered 'Öğrenme Kanıtları' and 'Öğretme Uygulamaları' from activeWeekList are bound
      if (targetWeekObj?.ogrenmeKanitlari) {
        generated.Ogrenme_Kanitlari = targetWeekObj.ogrenmeKanitlari;
      }
      if (
        targetWeekObj?.ogretmeUygulamalari &&
        targetWeekObj.ogretmeUygulamalari.length > 0
      ) {
        generated.Ogrenme_Ogretme_Yasantilari.Ogretme_Uygulamalari =
          targetWeekObj.ogretmeUygulamalari.map((b) =>
            b.replace(/^\*\s*/, "").trim()
          );
      }

      const rawCandidateDate =
        (weekData.tarihAraligi &&
        !/^\d+\s*\.\s*hafta$/i.test(weekData.tarihAraligi)
          ? weekData.tarihAraligi
          : meta.tarihAraligi) || meta.tarihAraligi;

      const finalTarihAraligi = resolveValidDateRange(
        rawCandidateDate,
        weekData.haftaNo
      );

      const finalOnayTarihi =
        serverDetectedWeekMeta?.onayTarihi ||
        inferApprovalDateClient(finalTarihAraligi) ||
        meta.onayTarihi;

      if (effectiveDersIsmi) {
        generated.Ders_Bilgisi.Ders = effectiveDersIsmi;
      }

      const updatedMeta: DocumentHeaderFooterMeta = {
        ...meta,
        okulAdi: meta.okulAdi.trim() || effectiveOkulAdi,
        dersIsmi: meta.dersIsmi,
        sinifDuzeyi: meta.sinifDuzeyi.trim() || generated.Ders_Bilgisi.Sinif,
        haftaEtiketi: weekData.haftaEtiketi || meta.haftaEtiketi,
        tarihAraligi: finalTarihAraligi,
        onayTarihi: finalOnayTarihi,
      };
      setMeta(updatedMeta);

      setCurrentPlan(generated);
      const newRecord: SavedLessonPlanRecord = {
        id: `plan-${Date.now()}`,
        createdAt:
          updatedMeta.onayTarihi || new Date().toISOString().slice(0, 10),
        title: `${updatedMeta.haftaEtiketi} (${updatedMeta.tarihAraligi}) — ${
          generated.Ders_Bilgisi?.Ders || "Ders Planı"
        }`,
        department: generated.Ders_Bilgisi?.Sinif || "",
        inputs: {
          yillik_plan: weekData.rawWeekWindowText,
          ders_materyali: materyalSlice,
          ders_bilgi_formu: dersBilgiFormu.slice(0, 12000),
        },
        meta: updatedMeta,
        plan: generated,
      };
      setSavedPlans((prev) => [newRecord, ...prev]);

      // Focus the user's attention directly on the Plan Validator before official table
      window.setTimeout(() => {
        const validatorAnchor = document.getElementById("plan-validator-anchor");
        if (validatorAnchor) {
          validatorAnchor.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Ders planı hazırlanırken beklenmeyen bir hata oluştu."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAllWeeks = (format: "word" | "pdf") => {
    if (!yillikPlan.trim()) {
      setErrorMessage(
        "Tüm haftaların günlük ders planlarını tek tuşla indirmek için lütfen önce 'Ünitelendirilmiş Yıllık Plan' dosyasını yükleyin."
      );
      return;
    }

    setIsExportingAllWeeks(true);
    setErrorMessage(null);

    window.setTimeout(() => {
      try {
        const allItems = synthesizeAllWeeksClientSide({
          weeks: activeWeekList,
          yillik_plan: yillikPlan,
          ders_materyali: dersMateryali,
          ders_bilgi_formu: dersBilgiFormu,
          baseMeta: meta,
        });

        if (format === "word") {
          downloadAllWeeksWordDoc(allItems);
        } else {
          exportAllWeeksPdfPrint(allItems);
        }
        setIsAllWeeksMenuOpen(false);
      } catch (err: unknown) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Tüm haftaların planları dışa aktarılırken bir hata oluştu."
        );
      } finally {
        setIsExportingAllWeeks(false);
      }
    }, 30);
  };

  const handleSaveCurrentPlan = () => {
    if (!currentPlan) return;
    const newRecord: SavedLessonPlanRecord = {
      id: `plan-${Date.now()}`,
      createdAt: meta.onayTarihi || new Date().toISOString().slice(0, 10),
      title: `${meta.haftaEtiketi} (${meta.tarihAraligi}) — ${
        meta.dersIsmi || currentPlan.Ders_Bilgisi.Ders
      }`,
      department: meta.sinifDuzeyi || currentPlan.Ders_Bilgisi.Sinif,
      inputs: {
        yillik_plan: yillikPlan,
        ders_materyali: dersMateryali,
        ders_bilgi_formu: dersBilgiFormu,
      },
      meta: { ...meta },
      plan: currentPlan,
    };
    setSavedPlans((prev) => [newRecord, ...prev]);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleLoadSavedPlan = (record: SavedLessonPlanRecord) => {
    setYillikPlan(record.inputs.yillik_plan);
    setDersMateryali(record.inputs.ders_materyali);
    setDersBilgiFormu(record.inputs.ders_bilgi_formu || "");
    if (record.meta) {
      const locks = lockedFieldsRef.current;
      setMeta((prev) => ({
        ...record.meta,
        okulAdi: locks.okulAdi ? prev.okulAdi : record.meta.okulAdi,
        egitimOgretimYili: locks.egitimOgretimYili
          ? prev.egitimOgretimYili
          : record.meta.egitimOgretimYili,
        dersIsmi: locks.dersIsmi ? prev.dersIsmi : record.meta.dersIsmi,
        sinifDuzeyi: locks.sinifDuzeyi
          ? prev.sinifDuzeyi
          : record.meta.sinifDuzeyi,
        ogretmenAdSoyad: locks.ogretmenAdSoyad
          ? prev.ogretmenAdSoyad
          : record.meta.ogretmenAdSoyad,
        ogretmenBransi: locks.ogretmenBransi
          ? prev.ogretmenBransi
          : record.meta.ogretmenBransi,
        okulMuduruAdSoyad: locks.okulMuduruAdSoyad
          ? prev.okulMuduruAdSoyad
          : record.meta.okulMuduruAdSoyad,
      }));
    }
    let syncedOgretmeUygulamalari =
      record.plan.Ogrenme_Ogretme_Yasantilari?.Ogretme_Uygulamalari || [];
    if (record.inputs.ders_bilgi_formu) {
      const parsedDbf = parseDersBilgiFormuStructured(
        record.inputs.ders_bilgi_formu,
        record.inputs.yillik_plan || "",
        record.inputs.ders_materyali || ""
      );
      const parsedWeek = extractWeekPlanStructured(
        record.inputs.yillik_plan || "",
        record.meta?.haftaEtiketi || "1. HAFTA",
        record.meta?.tarihAraligi || "",
        parsedDbf,
        {
          id: record.id,
          haftaNo:
            Number((record.meta?.haftaEtiketi || "").match(/(\d{1,2})/)?.[1]) ||
            1,
          haftaEtiketi: record.meta?.haftaEtiketi || "1. HAFTA",
          tarihAraligi: record.meta?.tarihAraligi || "",
          onayTarihi: record.meta?.onayTarihi || "",
          ogrenmeBirimi: record.plan.Ders_Bilgisi?.Ogrenme_Birimi || "",
          icerikCercevesi: record.plan.Icerik_Cercevesi || "",
          konuVeCiktiOzeti:
            record.plan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri || "",
        }
      );
      if (parsedWeek.unitOgretmeUygulamalari.length > 0) {
        syncedOgretmeUygulamalari = parsedWeek.unitOgretmeUygulamalari.map((b) =>
          b.replace(/^\*\s*/, "").trim()
        );
      }
    }
    setCurrentPlan({
      ...record.plan,
      Ogrenme_Kanitlari: cleanOgrenmeKanitlariPrefix(
        record.plan.Ogrenme_Kanitlari
      ),
      Ogrenme_Ogretme_Yasantilari: {
        ...record.plan.Ogrenme_Ogretme_Yasantilari,
        Ogretme_Uygulamalari: syncedOgretmeUygulamalari,
      },
    });
    setActiveTab("official-table");
  };

  const handleDeleteSavedPlan = (id: string) => {
    setSavedPlans((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredSavedPlans = savedPlans.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.department.toLowerCase().includes(q) ||
      item.plan.Ders_Bilgisi.Ogrenme_Birimi.toLowerCase().includes(q)
    );
  });

  const displayHaftaSatiri = formatFullWeekAndDateRange(
    meta.haftaEtiketi,
    meta.tarihAraligi
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/80 text-slate-900">
      {/* Top Bar Contract: Exactly 3 zones separated by gap-8 */}
      <header className="no-print sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-4 bg-slate-900 text-white border-b border-slate-800 shadow-xs">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#workspace"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("workspace");
          }}
          className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          Maarif Ders Planlayıcı
        </a>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#workspace"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("workspace");
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === "workspace"
                ? "text-amber-400 underline underline-offset-8 decoration-2 decoration-amber-400"
                : "hover:text-white"
            }`}
          >
            Veri Girişi &amp; Üretim
          </a>
          <a
            href="#official-table"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("official-table");
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === "official-table"
                ? "text-amber-400 underline underline-offset-8 decoration-2 decoration-amber-400"
                : "hover:text-white"
            }`}
          >
            Resmî Plan Tablosu
          </a>
          <a
            href="#saved-plans"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("saved-plans");
            }}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === "saved-plans"
                ? "text-amber-400 underline underline-offset-8 decoration-2 decoration-amber-400"
                : "hover:text-white"
            }`}
          >
            Kayıtlı Planlar ({savedPlans.length})
          </a>
          <button
            type="button"
            onClick={() => setIsTopicSummaryOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white border border-emerald-500/40 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            title="Seçilen haftanın konusunu ders materyalinden özetle ve lise düzeyinde öğrenci notu çıkar"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            Konu Özeti
          </button>
        </nav>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="no-print md:hidden flex items-center gap-1 p-2 bg-slate-900 border-b border-slate-800 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("workspace")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
            activeTab === "workspace"
              ? "bg-amber-400 text-slate-950 font-semibold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Veri Girişi &amp; Üretim
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("official-table")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
            activeTab === "official-table"
              ? "bg-amber-400 text-slate-950 font-semibold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Resmî Plan Tablosu
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("saved-plans")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
            activeTab === "saved-plans"
              ? "bg-amber-400 text-slate-950 font-semibold"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Kayıtlı Planlar ({savedPlans.length})
        </button>
        <button
          type="button"
          onClick={() => setIsTopicSummaryOpen(true)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 bg-emerald-500/20 text-emerald-300 hover:text-white border border-emerald-500/40 cursor-pointer"
          title="Haftalık konuyu özetle ve öğrenci notu çıkar"
        >
          <BookOpen className="w-3 h-3 text-emerald-400" />
          Konu Özeti
        </button>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Error Banner */}
        {errorMessage && (
          <div className="no-print mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-900">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-semibold">İşlem Tamamlanamadı</p>
              <p className="text-red-700 mt-0.5">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs font-medium text-red-700 hover:text-red-900 whitespace-nowrap"
            >
              Kapat
            </button>
          </div>
        )}

        {/* TAB 1: WORKSPACE */}
        {activeTab === "workspace" && (
          <div className="space-y-6">
            {/* School, Course, Week/Date & Teacher/Principal Metadata Card */}
            <div className="no-print bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
              <div className="p-6 space-y-6">
                {/* Lock All / Unlock All Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    {lockedCount > 0 ? (
                      <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span>
                      {lockedCount > 0
                        ? `${lockedCount} / ${LOCKABLE_META_KEYS.length} bilgi kilitlendi ve hafızaya alındı (yeni dosya yüklendiğinde korunur)`
                        : "Her seferinde tekrar girmemek için bilgileri tek tek veya tümüyle kilitleyebilirsiniz"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleLockAllFields}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border shadow-2xs ${
                      areAllFieldsLocked
                        ? "bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200"
                        : "bg-indigo-950 border-indigo-950 text-white hover:bg-indigo-900"
                    }`}
                  >
                    {areAllFieldsLocked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Tüm Kilitleri Aç</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                        <span>Tümünü Kilitle</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Row 1: Okul Adı, Eğitim ve Öğretim Yılı, Ders İsmi, Sınıf Düzeyi */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <label
                        htmlFor="meta-okul-adi"
                        className="block text-xs font-semibold text-indigo-950"
                      >
                        Okul Adı
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleFieldLock("okulAdi")}
                        title={
                          lockedFields.okulAdi
                            ? "Kilidi açmak için tıklayın"
                            : "Bu alanı sabitlemek/kilitlemek için tıklayın"
                        }
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors border ${
                          lockedFields.okulAdi
                            ? "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200"
                            : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {lockedFields.okulAdi ? (
                          <>
                            <Lock className="w-3 h-3 text-amber-700" />
                            <span>Kilitli</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 text-slate-500" />
                            <span>Kilitle</span>
                          </>
                        )}
                      </button>
                    </div>
                    <input
                      id="meta-okul-adi"
                      type="text"
                      readOnly={lockedFields.okulAdi}
                      value={meta.okulAdi}
                      onChange={(e) => {
                        if (!lockedFields.okulAdi) {
                          updateMetaField("okulAdi", e.target.value);
                        }
                      }}
                      placeholder="Örn: Atatürk Anadolu Lisesi Müdürlüğü"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-colors focus:outline-none ${
                        lockedFields.okulAdi
                          ? "border-amber-300 bg-amber-50/50 text-slate-900 font-medium cursor-not-allowed"
                          : "border-slate-300 bg-slate-50/70 text-slate-900 focus:bg-white focus:border-indigo-600"
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <label
                        htmlFor="meta-egitim-yili"
                        className="block text-xs font-semibold text-indigo-950"
                      >
                        Eğitim ve Öğretim Yılı:
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleFieldLock("egitimOgretimYili")}
                        title={
                          lockedFields.egitimOgretimYili
                            ? "Kilidi açmak için tıklayın"
                            : "Bu alanı sabitlemek/kilitlemek için tıklayın"
                        }
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors border ${
                          lockedFields.egitimOgretimYili
                            ? "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200"
                            : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {lockedFields.egitimOgretimYili ? (
                          <>
                            <Lock className="w-3 h-3 text-amber-700" />
                            <span>Kilitli</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 text-slate-500" />
                            <span>Kilitle</span>
                          </>
                        )}
                      </button>
                    </div>
                    <input
                      id="meta-egitim-yili"
                      type="text"
                      readOnly={lockedFields.egitimOgretimYili}
                      value={meta.egitimOgretimYili}
                      onChange={(e) => {
                        if (!lockedFields.egitimOgretimYili) {
                          updateMetaField("egitimOgretimYili", e.target.value);
                        }
                      }}
                      placeholder="Örn. 2026-2027 Eğitim ve Öğretim Yılı 1. Dönem"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-colors focus:outline-none ${
                        lockedFields.egitimOgretimYili
                          ? "border-amber-300 bg-amber-50/50 text-slate-900 font-medium cursor-not-allowed"
                          : "border-slate-300 bg-slate-50/70 text-slate-900 focus:bg-white focus:border-indigo-600"
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <label
                        htmlFor="meta-ders-ismi"
                        className="block text-xs font-semibold text-indigo-950"
                      >
                        Ders İsmi:
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleFieldLock("dersIsmi")}
                        title={
                          lockedFields.dersIsmi
                            ? "Kilidi açmak için tıklayın"
                            : "Bu alanı sabitlemek/kilitlemek için tıklayın"
                        }
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors border ${
                          lockedFields.dersIsmi
                            ? "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200"
                            : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {lockedFields.dersIsmi ? (
                          <>
                            <Lock className="w-3 h-3 text-amber-700" />
                            <span>Kilitli</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 text-slate-500" />
                            <span>Kilitle</span>
                          </>
                        )}
                      </button>
                    </div>
                    <input
                      id="meta-ders-ismi"
                      type="text"
                      readOnly={lockedFields.dersIsmi}
                      value={meta.dersIsmi}
                      onChange={(e) => {
                        if (!lockedFields.dersIsmi) {
                          updateMetaField("dersIsmi", e.target.value);
                        }
                      }}
                      placeholder="Örn: Biyoloji"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-colors focus:outline-none ${
                        lockedFields.dersIsmi
                          ? "border-amber-300 bg-amber-50/50 text-slate-900 font-medium cursor-not-allowed"
                          : dersIsmiValidation.hasComparison &&
                            !dersIsmiValidation.isValid
                          ? "border-amber-400 bg-amber-50/40 text-slate-900 focus:bg-white focus:border-amber-600"
                          : "border-slate-300 bg-slate-50/70 text-slate-900 focus:bg-white focus:border-indigo-600"
                      }`}
                    />
                    {dersIsmiValidation.hasComparison &&
                      !dersIsmiValidation.isValid && (
                        <div
                          role="status"
                          aria-live="polite"
                          className="mt-2 rounded-lg border border-amber-300 bg-amber-50/90 p-2.5 text-[11px] leading-relaxed text-amber-950 shadow-2xs"
                        >
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="space-y-1.5 flex-1">
                              <p className="font-medium text-amber-900">
                                Nazik hatırlatma: Girdiğiniz{" "}
                                <span className="font-semibold">
                                  &ldquo;{dersIsmiValidation.manualCourseName}&rdquo;
                                </span>{" "}
                                ders ismi ile yüklenen Ders Bilgi Formu&apos;ndaki{" "}
                                <span className="font-semibold">
                                  &ldquo;{dersIsmiValidation.dbfCourseName}&rdquo;
                                </span>{" "}
                                ders ismi birbirinden farklı görünüyor (%
                                {dersIsmiValidation.mismatchPercent} uyuşmazlık).
                                Lütfen ders ismini veya yüklediğiniz Ders Bilgi
                                Formu&apos;nu kontrol etmek isteyebilirsiniz.
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  updateMetaField(
                                    "dersIsmi",
                                    dersIsmiValidation.dbfCourseName
                                  )
                                }
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-200/80 hover:bg-amber-300/80 text-amber-950 font-semibold text-[10px] transition-colors cursor-pointer"
                              >
                                <Check className="w-3 h-3 text-amber-800" />
                                <span>
                                  &ldquo;{dersIsmiValidation.dbfCourseName}&rdquo;
                                  Olarak Güncelle
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    {dersIsmiValidation.hasComparison &&
                      dersIsmiValidation.isValid && (
                        <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>
                            Ders Bilgi Formu ile uyumlu (%
                            {dersIsmiValidation.similarityPercent} eşleşme)
                          </span>
                        </p>
                      )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <label
                        htmlFor="meta-sinif-duzeyi"
                        className="block text-xs font-semibold text-indigo-950"
                      >
                        Sınıf Düzeyi:
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleFieldLock("sinifDuzeyi")}
                        title={
                          lockedFields.sinifDuzeyi
                            ? "Kilidi açmak için tıklayın"
                            : "Bu alanı sabitlemek/kilitlemek için tıklayın"
                        }
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors border ${
                          lockedFields.sinifDuzeyi
                            ? "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200"
                            : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {lockedFields.sinifDuzeyi ? (
                          <>
                            <Lock className="w-3 h-3 text-amber-700" />
                            <span>Kilitli</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 text-slate-500" />
                            <span>Kilitle</span>
                          </>
                        )}
                      </button>
                    </div>
                    <input
                      id="meta-sinif-duzeyi"
                      type="text"
                      readOnly={lockedFields.sinifDuzeyi}
                      value={meta.sinifDuzeyi}
                      onChange={(e) => {
                        if (!lockedFields.sinifDuzeyi) {
                          updateMetaField("sinifDuzeyi", e.target.value);
                        }
                      }}
                      placeholder="Örn. 9. Sınıf"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-colors focus:outline-none ${
                        lockedFields.sinifDuzeyi
                          ? "border-amber-300 bg-amber-50/50 text-slate-900 font-medium cursor-not-allowed"
                          : "border-slate-300 bg-slate-50/70 text-slate-900 focus:bg-white focus:border-indigo-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Row 2: HAFTA VE TARİH SEÇİMİ (Yıllık Plandan Otomatik Beslenir) */}
                <div className="pt-4 border-t border-slate-200/80">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-700" />
                      <h2 className="text-xs font-semibold text-sky-950">
                        Hafta ve Tarih Seçimi{" "}
                        {extractedWeeks.length > 0
                          ? `(Yüklenen Yıllık Plandan ${extractedWeeks.length} Hafta Aktarıldı)`
                          : "(Yıllık Plan Yüklendiğinde Haftalar ve Tarihler Otomatik Çekilir)"}
                      </h2>
                    </div>

                    {yillikPlan.trim().length > 0 && (
                      <button
                        type="button"
                        disabled={isParsingWeeks}
                        onClick={() => analyzeWeeksFromYillikPlan(yillikPlan)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 hover:bg-sky-100 text-xs font-medium text-sky-800 transition-colors"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${
                            isParsingWeeks ? "animate-spin" : ""
                          }`}
                        />
                        <span>
                          {isParsingWeeks
                            ? "Yıllık Plandan Haftalar Çıkarılıyor..."
                            : "Yıllık Plandan Haftaları Yenile"}
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Dropdown Selector + Tüm Haftaları İndir */}
                    <div className="md:col-span-5">
                      <label
                        htmlFor="week-selector"
                        className="block text-xs font-semibold text-slate-800 mb-1.5"
                      >
                        Hafta ve Tarih Listesinden Seçin
                      </label>
                      <select
                        id="week-selector"
                        value={selectedWeekId}
                        onChange={(e) => handleSelectWeek(e.target.value)}
                        className="w-full rounded-lg border border-sky-300 bg-sky-50/40 px-3 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none"
                      >
                        {activeWeekList.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.haftaEtiketi} ({w.tarihAraligi})
                            {w.ogrenmeBirimi ? ` — ${w.ogrenmeBirimi}` : ""}
                            {w.sure ? ` [${w.sure}]` : ""}
                          </option>
                        ))}
                      </select>

                      {/* Tüm Haftaları İndir Button & Word/PDF Selector */}
                      <div className="mt-2">
                        <button
                          type="button"
                          disabled={isExportingAllWeeks}
                          onClick={() =>
                            setIsAllWeeksMenuOpen((prev) => !prev)
                          }
                          className="w-full inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold transition-colors shadow-2xs disabled:opacity-60"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {isExportingAllWeeks ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                            ) : (
                              <FileDown className="w-3.5 h-3.5 text-amber-300" />
                            )}
                            <span>
                              Tüm Haftaları İndir ({activeWeekList.length} Hafta)
                            </span>
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-300 transition-transform ${
                              isAllWeeksMenuOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isAllWeeksMenuOpen && (
                          <div className="mt-1.5 p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/80 space-y-2">
                            <p className="text-[11px] font-medium text-indigo-950">
                              Tüm {activeWeekList.length} haftanın günlük ders
                              planını tek tuşla indirmek için format seçin:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <button
                                type="button"
                                disabled={isExportingAllWeeks}
                                onClick={() => handleDownloadAllWeeks("word")}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shadow-2xs"
                              >
                                <FileDown className="w-3.5 h-3.5 shrink-0" />
                                <span>Word (.doc) İndir</span>
                              </button>
                              <button
                                type="button"
                                disabled={isExportingAllWeeks}
                                onClick={() => handleDownloadAllWeeks("pdf")}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold transition-colors shadow-2xs"
                              >
                                <Printer className="w-3.5 h-3.5 shrink-0" />
                                <span>PDF Olarak İndir</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Editable Hafta Etiketi */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="meta-hafta-etiketi"
                        className="block text-xs font-semibold text-slate-800 mb-1.5"
                      >
                        Hafta Başlığı
                      </label>
                      <input
                        id="meta-hafta-etiketi"
                        type="text"
                        value={meta.haftaEtiketi}
                        onChange={(e) =>
                          updateMetaField("haftaEtiketi", e.target.value)
                        }
                        placeholder="Örn: 1. HAFTA"
                        className="w-full rounded-lg border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none"
                      />
                    </div>

                    {/* Editable Tarih Aralığı */}
                    <div className="md:col-span-3">
                      <label
                        htmlFor="meta-tarih-araligi"
                        className="block text-xs font-semibold text-slate-800 mb-1.5"
                      >
                        Tarih Aralığı (Başlıkta Görünür)
                      </label>
                      <input
                        id="meta-tarih-araligi"
                        type="text"
                        value={meta.tarihAraligi}
                        onChange={(e) =>
                          updateMetaField("tarihAraligi", e.target.value)
                        }
                        placeholder="Örn: 14 - 18 Eylül"
                        className="w-full rounded-lg border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-sky-600 focus:outline-none"
                      />
                    </div>

                    {/* Editable Onay Tarihi */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="meta-onay-tarihi"
                        className="block text-xs font-semibold text-slate-800 mb-1.5"
                      >
                        Uygundur Tarihi
                      </label>
                      <input
                        id="meta-onay-tarihi"
                        type="text"
                        value={meta.onayTarihi}
                        onChange={(e) =>
                          updateMetaField("onayTarihi", e.target.value)
                        }
                        placeholder="Örn: 14/09/2026"
                        className="w-full rounded-lg border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 tabular-nums focus:bg-white focus:border-sky-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Öğretmen ve Okul Müdürü Bilgileri (Kağıdın En Altında Yer Alır) */}
                <div className="pt-4 border-t border-slate-200/80">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h2 className="text-xs font-semibold text-teal-900">
                      Öğretmen ve Okul Müdürü Bilgileri (Kağıdın En Altında Yer Alır)
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500">
                        Planın en altındaki imza bloğuna otomatik eklenir
                      </span>
                      <button
                        type="button"
                        onClick={toggleLockAllFields}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors border ${
                          areAllFieldsLocked
                            ? "bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200"
                            : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {areAllFieldsLocked ? (
                          <>
                            <Unlock className="w-3 h-3 text-amber-700" />
                            <span>Tüm Kilitleri Aç</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-indigo-700" />
                            <span>Tümünü Kilitle</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label
                          htmlFor="meta-ogretmen-ad"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          Öğretmen Adı Soyadı
                        </label>
                        <button
                          type="button"
                          onClick={() => toggleFieldLock("ogretmenAdSoyad")}
                          title={
                            lockedFields.ogretmenAdSoyad
                              ? "Kilidi açmak için tıklayın"
                              : "Bu alanı sabitlemek/kilitlemek için tıklayın"
                          }
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors border ${
                            lockedFields.ogretmenAdSoyad
                              ? "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200"
                              : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {lockedFields.ogretmenAdSoyad ? (
                            <>
                              <Lock className="w-3 h-3 text-amber-700" />
                              <span>Kilitli</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3 text-slate-500" />
                              <span>Kilitle</span>
                            </>
                          )}
                        </button>
                      </div>
                      <input
                        id="meta-ogretmen-ad"
                        type="text"
                        readOnly={lockedFields.ogretmenAdSoyad}
                        value={meta.ogretmenAdSoyad}
                        onChange={(e) => {
                          if (!lockedFields.ogretmenAdSoyad) {
                            updateMetaField("ogretmenAdSoyad", e.target.value);
                          }
                        }}
                        placeholder="Örn: Ayşe Demir"
                        className={`w-full rounded-lg border px-3 py-2 text-xs transition-colors focus:outline-none ${
                          lockedFields.ogretmenAdSoyad
                            ? "border-amber-300 bg-amber-50/50 text-slate-900 font-medium cursor-not-allowed"
                            : "border-slate-300 bg-slate-50/70 text-slate-900 focus:bg-white focus:border-teal-600"
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label
                          htmlFor="meta-ogretmen-brans"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          Öğretmen Branşı
                        </label>
                        <button
                          type="button"
                          onClick={() => toggleFieldLock("ogretmenBransi")}
                          title={
                            lockedFields.ogretmenBransi
                              ? "Kilidi açmak için tıklayın"
                              : "Bu alanı sabitlemek/kilitlemek için tıklayın"
                          }
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors border ${
                            lockedFields.ogretmenBransi
                              ? "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200"
                              : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {lockedFields.ogretmenBransi ? (
                            <>
                              <Lock className="w-3 h-3 text-amber-700" />
                              <span>Kilitli</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3 text-slate-500" />
                              <span>Kilitle</span>
                            </>
                          )}
                        </button>
                      </div>
                      <input
                        id="meta-ogretmen-brans"
                        type="text"
                        readOnly={lockedFields.ogretmenBransi}
                        value={meta.ogretmenBransi}
                        onChange={(e) => {
                          if (!lockedFields.ogretmenBransi) {
                            updateMetaField("ogretmenBransi", e.target.value);
                          }
                        }}
                        placeholder="Örn: Ders Öğretmeni"
                        className={`w-full rounded-lg border px-3 py-2 text-xs transition-colors focus:outline-none ${
                          lockedFields.ogretmenBransi
                            ? "border-amber-300 bg-amber-50/50 text-slate-900 font-medium cursor-not-allowed"
                            : "border-slate-300 bg-slate-50/70 text-slate-900 focus:bg-white focus:border-teal-600"
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label
                          htmlFor="meta-okul-muduru"
                          className="block text-xs font-semibold text-slate-800"
                        >
                          Okul Müdürü Adı Soyadı
                        </label>
                        <button
                          type="button"
                          onClick={() => toggleFieldLock("okulMuduruAdSoyad")}
                          title={
                            lockedFields.okulMuduruAdSoyad
                              ? "Kilidi açmak için tıklayın"
                              : "Bu alanı sabitlemek/kilitlemek için tıklayın"
                          }
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors border ${
                            lockedFields.okulMuduruAdSoyad
                              ? "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200"
                              : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {lockedFields.okulMuduruAdSoyad ? (
                            <>
                              <Lock className="w-3 h-3 text-amber-700" />
                              <span>Kilitli</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3 text-slate-500" />
                              <span>Kilitle</span>
                            </>
                          )}
                        </button>
                      </div>
                      <input
                        id="meta-okul-muduru"
                        type="text"
                        readOnly={lockedFields.okulMuduruAdSoyad}
                        value={meta.okulMuduruAdSoyad}
                        onChange={(e) => {
                          if (!lockedFields.okulMuduruAdSoyad) {
                            updateMetaField("okulMuduruAdSoyad", e.target.value);
                          }
                        }}
                        placeholder="Örn: Mehmet Yılmaz"
                        className={`w-full rounded-lg border px-3 py-2 text-xs transition-colors focus:outline-none ${
                          lockedFields.okulMuduruAdSoyad
                            ? "border-amber-300 bg-amber-50/50 text-slate-900 font-medium cursor-not-allowed"
                            : "border-slate-300 bg-slate-50/70 text-slate-900 focus:bg-white focus:border-teal-600"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Two-Column Split Workspace (Collapses to pure full-width table on print) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:block print:w-full">
              {/* Left Column: 3 Source Documents with PDF/DOCX/XLSX Upload (Max 40 MB) - NEVER PRINTED */}
              <div className="no-print lg:col-span-5 bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col justify-between shadow-xs">
                <div>
                  <div className="bg-gradient-to-r from-sky-900 to-teal-900 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] text-teal-200 block">
                        Adım 01 · 3 Kaynak Doküman
                      </span>
                      <h2 className="text-base font-semibold text-white">
                        Yıllık Plan, Ders Materyali ve Ders Bilgi Formu
                      </h2>
                    </div>
                    <span className="text-[11px] font-medium text-sky-100">
                      PDF · DOCX · XLSX (Maks. 40 MB)
                    </span>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Input 1: Ünitelendirilmiş Yıllık Plan */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) =>
                        handleFileDrop(e, "yillik_plan", setYillikPlan)
                      }
                      className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-3.5 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <label
                          htmlFor="input-yillik-plan"
                          className="text-xs font-semibold text-indigo-950"
                        >
                          1. Ünitelendirilmiş Yıllık Plan (Zorunlu)
                        </label>
                        <div>
                          <input
                            ref={yillikPlanInputRef}
                            type="file"
                            accept={ACCEPTED_FILE_EXTENSIONS}
                            className="sr-only"
                            onChange={(e) =>
                              handleFileUpload(e, "yillik_plan", setYillikPlan)
                            }
                          />
                          <button
                            type="button"
                            disabled={uploadingFields.yillik_plan}
                            onClick={() => yillikPlanInputRef.current?.click()}
                            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-xs font-semibold text-white shadow-2xs transition-colors"
                          >
                            {uploadingFields.yillik_plan ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Dosya Okunuyor...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Dosya Yükle (.pdf, .docx, .xlsx)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-indigo-800/80 mb-2">
                        <strong>AI Bağlamı (yillik_plan):</strong> Seçilen haftanın Öğrenme Birimi, Süresi, İçerik Çerçevesi ve Öğrenme Çıktıları bu dokümandan eşleştirilir.
                      </p>
                      {fieldErrors.yillik_plan && (
                        <div className="mb-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[11px] font-medium text-red-800 flex items-center justify-between gap-2">
                          <span>{fieldErrors.yillik_plan}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFieldErrors((prev) => ({
                                ...prev,
                                yillik_plan: null,
                              }))
                            }
                            className="text-red-600 hover:text-red-900 font-semibold"
                          >
                            Kapat
                          </button>
                        </div>
                      )}
                      {uploadedFileNames.yillik_plan && (
                        <div className="mb-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-[11px] font-medium text-emerald-800 flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 truncate">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">
                              Yüklendi: {uploadedFileNames.yillik_plan}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setYillikPlan("");
                              setUploadedFileNames((prev) => ({
                                ...prev,
                                yillik_plan: null,
                              }));
                            }}
                            className="text-emerald-700 hover:text-red-600 font-semibold shrink-0"
                          >
                            Temizle
                          </button>
                        </div>
                      )}
                      <textarea
                        id="input-yillik-plan"
                        rows={4}
                        value={yillikPlan}
                        onChange={(e) => setYillikPlan(e.target.value)}
                        placeholder="Dosya Yükle butonuna tıklayın, dosyayı buraya sürükleyin veya yıllık plan metnini yapıştırın..."
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 leading-relaxed focus:border-indigo-600 focus:outline-none"
                      />
                    </div>

                    {/* Input 2: Ders Materyali */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) =>
                        handleFileDrop(e, "ders_materyali", setDersMateryali)
                      }
                      className="rounded-xl border border-teal-100 bg-teal-50/20 p-3.5 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <label
                          htmlFor="input-ders-materyali"
                          className="text-xs font-semibold text-teal-950"
                        >
                          2. Ders Materyali / Ders Kitabı / Modül (Zorunlu)
                        </label>
                        <div>
                          <input
                            ref={dersMateryaliInputRef}
                            type="file"
                            accept={ACCEPTED_FILE_EXTENSIONS}
                            className="sr-only"
                            onChange={(e) =>
                              handleFileUpload(
                                e,
                                "ders_materyali",
                                setDersMateryali
                              )
                            }
                          />
                          <button
                            type="button"
                            disabled={uploadingFields.ders_materyali}
                            onClick={() =>
                              dersMateryaliInputRef.current?.click()
                            }
                            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-xs font-semibold text-white shadow-2xs transition-colors"
                          >
                            {uploadingFields.ders_materyali ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Dosya Okunuyor...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Dosya Yükle (.pdf, .docx, .xlsx)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-teal-800/80 mb-2">
                        <strong>AI Bağlamı (ders_materyali):</strong> Konuya özgü Güdüleme, Dikkat Çekme soruları ve Ek Öğretme Uygulamaları bu materyalden üretilir.
                      </p>
                      {fieldErrors.ders_materyali && (
                        <div className="mb-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[11px] font-medium text-red-800 flex items-center justify-between gap-2">
                          <span>{fieldErrors.ders_materyali}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFieldErrors((prev) => ({
                                ...prev,
                                ders_materyali: null,
                              }))
                            }
                            className="text-red-600 hover:text-red-900 font-semibold"
                          >
                            Kapat
                          </button>
                        </div>
                      )}
                      {uploadedFileNames.ders_materyali && (
                        <div className="mb-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-[11px] font-medium text-emerald-800 flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 truncate">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">
                              Yüklendi: {uploadedFileNames.ders_materyali}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setDersMateryali("");
                              setUploadedFileNames((prev) => ({
                                ...prev,
                                ders_materyali: null,
                              }));
                            }}
                            className="text-emerald-700 hover:text-red-600 font-semibold shrink-0"
                          >
                            Temizle
                          </button>
                        </div>
                      )}
                      <textarea
                        id="input-ders-materyali"
                        rows={4}
                        value={dersMateryali}
                        onChange={(e) => setDersMateryali(e.target.value)}
                        placeholder="Dosya Yükle butonuna tıklayın, dosyayı buraya sürükleyin veya ders materyali metnini yapıştırın..."
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 leading-relaxed focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* Input 3: Ders Bilgi Formu */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) =>
                        handleFileDrop(
                          e,
                          "ders_bilgi_formu",
                          setDersBilgiFormu
                        )
                      }
                      className="rounded-xl border border-sky-100 bg-sky-50/20 p-3.5 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <label
                          htmlFor="input-ders-bilgi-formu"
                          className="text-xs font-semibold text-sky-950"
                        >
                          3. Ders Bilgi Formu (Öğretim Programı)
                        </label>
                        <div>
                          <input
                            ref={dersBilgiFormuInputRef}
                            type="file"
                            accept={ACCEPTED_FILE_EXTENSIONS}
                            className="sr-only"
                            onChange={(e) =>
                              handleFileUpload(
                                e,
                                "ders_bilgi_formu",
                                setDersBilgiFormu
                              )
                            }
                          />
                          <button
                            type="button"
                            disabled={uploadingFields.ders_bilgi_formu}
                            onClick={() =>
                              dersBilgiFormuInputRef.current?.click()
                            }
                            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-xs font-semibold text-white shadow-2xs transition-colors"
                          >
                            {uploadingFields.ders_bilgi_formu ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Dosya Okunuyor...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Dosya Yükle (.pdf, .docx, .xlsx)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-sky-800/80 mb-2">
                        <strong>AI Bağlamı (ders_bilgi_formu):</strong> Öğrenme Çıktıları ve Süreç Bileşenleri (a, b, c...), Programlar Arası Bileşen Kodları, Öğrenme Kanıtları, Temel Kabuller ve Öğretme Uygulamaları bu dokümandan birebir alınır.
                      </p>
                      {fieldErrors.ders_bilgi_formu && (
                        <div className="mb-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[11px] font-medium text-red-800 flex items-center justify-between gap-2">
                          <span>{fieldErrors.ders_bilgi_formu}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFieldErrors((prev) => ({
                                ...prev,
                                ders_bilgi_formu: null,
                              }))
                            }
                            className="text-red-600 hover:text-red-900 font-semibold"
                          >
                            Kapat
                          </button>
                        </div>
                      )}
                      {uploadedFileNames.ders_bilgi_formu && (
                        <div className="mb-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-[11px] font-medium text-emerald-800 flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 truncate">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">
                              Yüklendi: {uploadedFileNames.ders_bilgi_formu}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setDersBilgiFormu("");
                              setUploadedFileNames((prev) => ({
                                ...prev,
                                ders_bilgi_formu: null,
                              }));
                            }}
                            className="text-emerald-700 hover:text-red-600 font-semibold shrink-0"
                          >
                            Temizle
                          </button>
                        </div>
                      )}
                      <textarea
                        id="input-ders-bilgi-formu"
                        rows={4}
                        value={dersBilgiFormu}
                        onChange={(e) => setDersBilgiFormu(e.target.value)}
                        placeholder="Dosya Yükle butonuna tıklayın, dosyayı buraya sürükleyin veya ders bilgi formu metnini yapıştırın..."
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 leading-relaxed focus:border-sky-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Generate CTA Button */}
                <div className="p-6 pt-4 border-t border-slate-200 bg-slate-50/60 space-y-2.5">
                  <button
                    type="button"
                    disabled={isGenerating || isAnyUploading}
                    onClick={() => handleGeneratePlan()}
                    className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-indigo-900 via-sky-800 to-teal-800 hover:from-indigo-800 hover:via-sky-700 hover:to-teal-700 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                        {displayHaftaSatiri} İçin Günlük Ders Planı Hazırlanıyor...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 text-amber-300" />
                        {displayHaftaSatiri} Günlük Ders Planını Oluştur
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500 text-center">
                    Yıllık Plan, Ders Bilgi Formu ve Ders Materyali verileri birleştirilerek
                    örnek tablo formatında üretilir.
                  </p>
                </div>
              </div>

              {/* Right Column: Direct Official Table Output Preview (Full Width on Print) */}
              <div className="lg:col-span-7 space-y-4 print:w-full print:space-y-0">
                {isGenerating ? (
                  <div className="no-print bg-white border border-slate-200 rounded-xl p-8 space-y-4 animate-pulse shadow-xs">
                    <div className="h-6 bg-indigo-100 rounded w-2/3 mx-auto" />
                    <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
                    <div className="h-10 bg-[#c2d69b]/60 rounded" />
                    <div className="h-32 bg-slate-100 rounded border border-slate-200" />
                    <div className="h-10 bg-[#c2d69b]/60 rounded" />
                    <div className="h-48 bg-slate-100 rounded border border-slate-200" />
                  </div>
                ) : !currentPlan ? (
                  <div className="no-print bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4 shadow-xs">
                    <div className="w-12 h-12 rounded-xl bg-indigo-950 text-amber-300 flex items-center justify-center mx-auto shadow-xs">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-semibold text-indigo-950">
                        Günlük Ders Planı Çıktısı Burada Görünecek
                      </h3>
                      <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                        Sol taraftan{" "}
                        <strong className="text-indigo-950">
                          Ünitelendirilmiş Yıllık Plan
                        </strong>
                        ,{" "}
                        <strong className="text-teal-950">Ders Materyali</strong> ve{" "}
                        <strong className="text-sky-950">Ders Bilgi Formu</strong>{" "}
                        dosyalarınızı yükleyip üstten{" "}
                        <strong>Hafta ve Tarih</strong> seçerek planınızı oluşturun.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 print:space-y-0">
                    <div className="no-print flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs">
                      <span className="font-medium text-slate-600">
                        Aktif Plan:{" "}
                        <strong className="text-slate-900">
                          {displayHaftaSatiri}
                        </strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveCurrentPlan}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 font-medium text-slate-800"
                        >
                          {saveSuccess ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              Kaydedildi
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5" />
                              Arşive Kaydet
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsTopicSummaryOpen(true)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-medium cursor-pointer"
                          title="Bu haftanın konusunu ders materyalinden lise öğrencisi düzeyinde özetle"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                          Konu Özeti
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("official-table")}
                          className="font-semibold text-indigo-800 hover:text-indigo-950"
                        >
                          Tam Ekran Görünümü →
                        </button>
                      </div>
                    </div>

                    {/* Trigger Plan Validator Before Official Table (Never Printed) */}
                    <div id="plan-validator-anchor" className="no-print scroll-mt-24">
                      <PlanValidator
                        plan={currentPlan}
                        meta={meta}
                        onUpdatePlan={(updated) => setCurrentPlan(updated)}
                        onUpdateMeta={(updated) => setMeta(updated)}
                        availableWeeks={activeWeekList}
                        onProceedToTable={() => {
                          document
                            .getElementById("official-table-sheet-workspace")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        onExportWord={() => setIsExportConfigOpen(true)}
                        onPrint={() => triggerPrintWithFileName(meta, currentPlan)}
                        isOpenInitially={true}
                      />
                    </div>

                    <div id="official-table-sheet-workspace">
                      <OfficialPlanTable
                        plan={currentPlan}
                        meta={meta}
                        onUpdatePlan={(updated) => setCurrentPlan(updated)}
                        onOpenTopicSummary={() => setIsTopicSummaryOpen(true)}
                        dersMateryali={dersMateryali}
                        konuVeCiktiOzeti={selectedWeekObj?.konuVeCiktiOzeti || ""}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OFFICIAL MAARIF MODELI TABLE VIEW (Editable + Print Ready) */}
        {activeTab === "official-table" && (
          currentPlan ? (
            <div className="space-y-6 print:space-y-0">
              {/* Trigger Plan Validator Before Official Table in Full Table View */}
              <div id="plan-validator-anchor-tab2" className="no-print scroll-mt-24">
                <PlanValidator
                  plan={currentPlan}
                  meta={meta}
                  onUpdatePlan={(updated) => setCurrentPlan(updated)}
                  onUpdateMeta={(updated) => setMeta(updated)}
                  availableWeeks={activeWeekList}
                  onProceedToTable={() => {
                    document
                      .getElementById("official-table-sheet-tab2")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  onExportWord={() => setIsExportConfigOpen(true)}
                  onPrint={() => triggerPrintWithFileName(meta, currentPlan)}
                  isOpenInitially={false}
                />
              </div>

              <div id="official-table-sheet-tab2">
                <OfficialPlanTable
                  plan={currentPlan}
                  meta={meta}
                  onUpdatePlan={(updated) => setCurrentPlan(updated)}
                  onOpenTopicSummary={() => setIsTopicSummaryOpen(true)}
                  dersMateryali={dersMateryali}
                  konuVeCiktiOzeti={selectedWeekObj?.konuVeCiktiOzeti || ""}
                />
              </div>
            </div>
          ) : (
            <div className="no-print bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3 shadow-xs">
              <p className="text-sm font-semibold text-indigo-950">
                Görüntülenecek aktif bir günlük ders planı bulunmuyor.
              </p>
              <p className="text-xs text-slate-500">
                Önce Veri Girişi &amp; Üretim sekmesinden Yıllık Plan, Ders
                Materyali ve Ders Bilgi Formu verilerinizi girerek plan oluşturun.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("workspace")}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 rounded-lg hover:bg-indigo-800 transition-colors"
                >
                  Veri Girişi &amp; Üretim Sekmesine Git
                </button>
              </div>
            </div>
          )
        )}

        {/* TAB 3: SAVED PLANS ARCHIVE */}
        {activeTab === "saved-plans" && (
          <div className="no-print space-y-6">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-sky-950 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
              <div>
                <div className="flex items-center gap-2 text-xs text-sky-200">
                  <span>Yerel Arşiv</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{savedPlans.length} Kayıtlı Plan</span>
                </div>
                <h2 className="text-lg font-semibold text-white mt-0.5">
                  Kayıtlı Günlük Ders Planları
                </h2>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Hafta, ders, sınıf veya öğrenme birimi ara..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {filteredSavedPlans.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3 shadow-xs">
                <p className="text-sm font-semibold text-indigo-950">
                  Henüz kaydedilmiş bir günlük ders planı bulunmuyor.
                </p>
                <p className="text-xs text-slate-500">
                  Yeni bir günlük ders planı oluşturmak için Veri Girişi &amp; Üretim
                  sekmesini kullanabilirsiniz.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("workspace");
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 rounded-lg hover:bg-indigo-800 transition-colors"
                >
                  Yeni Plan Oluştur
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-indigo-950 text-xs font-semibold text-white">
                      <th className="py-3.5 px-4">Hafta / Ders &amp; Öğrenme Birimi</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">Sınıf Düzeyi</th>
                      <th className="py-3.5 px-4 hidden sm:table-cell">Süre</th>
                      <th className="py-3.5 px-4 hidden lg:table-cell">Onay Tarihi</th>
                      <th className="py-3.5 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {filteredSavedPlans.map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-indigo-50/40 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-indigo-950">
                            {record.title}
                          </p>
                          <p className="text-slate-500 mt-0.5">
                            {record.plan.Ders_Bilgisi.Ogrenme_Birimi}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 hidden md:table-cell text-slate-700 font-medium">
                          {record.meta?.sinifDuzeyi || record.department}
                        </td>
                        <td className="py-3.5 px-4 hidden sm:table-cell text-slate-600 tabular-nums">
                          {record.plan.Ders_Bilgisi.Sure}
                        </td>
                        <td className="py-3.5 px-4 hidden lg:table-cell text-slate-500 font-mono tabular-nums">
                          {record.meta?.onayTarihi || record.createdAt}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleLoadSavedPlan(record)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 font-semibold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors whitespace-nowrap"
                            >
                              <FolderOpen className="w-3.5 h-3.5" />
                              Planı Aç
                            </button>
                            <button
                              type="button"
                              onClick={() => downloadWordDoc(record.plan, record.meta)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 font-medium text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors whitespace-nowrap"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                              Word İndir
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSavedPlan(record.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                              title="Kaydı Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Fallback Print-Only Product Sheet when user prints while on Saved Plans tab */}
        {activeTab === "saved-plans" && currentPlan && (
          <div className="hidden print:block">
            <OfficialPlanTable
              plan={currentPlan}
              meta={meta}
              onUpdatePlan={(updated) => setCurrentPlan(updated)}
            />
          </div>
        )}
      </main>

      {/* Export & Paper-Saving Configurator Modal */}
      {currentPlan && (
        <ExportConfigModal
          isOpen={isExportConfigOpen}
          onClose={() => setIsExportConfigOpen(false)}
          plan={currentPlan}
          meta={meta}
          onExecutePrint={() => triggerPrintWithFileName(meta, currentPlan)}
        />
      )}

      {/* Student Topic Summary & Study Note Modal */}
      <TopicSummaryModal
        isOpen={isTopicSummaryOpen}
        onClose={() => setIsTopicSummaryOpen(false)}
        params={{
          dersIsmi: meta.dersIsmi || currentPlan?.Ders_Bilgisi.Ders || "",
          sinifDuzeyi: meta.sinifDuzeyi || currentPlan?.Ders_Bilgisi.Sinif || "",
          okulAdi: meta.okulAdi,
          haftaEtiketi:
            meta.haftaEtiketi || selectedWeekObj?.haftaEtiketi || "1. HAFTA",
          tarihAraligi:
            meta.tarihAraligi || selectedWeekObj?.tarihAraligi || "",
          ogrenmeBirimi:
            selectedWeekObj?.ogrenmeBirimi ||
            currentPlan?.Ders_Bilgisi.Ogrenme_Birimi ||
            "",
          icerikCercevesi:
            selectedWeekObj?.icerikCercevesi ||
            selectedWeekObj?.konuVeCiktiOzeti ||
            "",
          ogrenmeCiktilari:
            currentPlan?.Ogrenme_Ciktilari_ve_Surec_Bilesenleri ||
            selectedWeekObj?.konuVeCiktiOzeti ||
            "",
          materyalText: dersMateryali,
          egitimYili: meta.egitimOgretimYili,
        }}
      />
    </div>
  );
}
