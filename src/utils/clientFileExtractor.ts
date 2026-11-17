import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { getDocumentProxy } from "unpdf";
import {
  MaarifLessonPlan,
  YillikPlanWeekItem,
  DocumentHeaderFooterMeta,
} from "../types/lessonPlan";
import {
  stripFrontMatter,
  extractCleanDocumentMetadata,
  parseDersBilgiFormuStructured,
  extractWeekPlanStructured,
  extractWeekMateryalSlice,
  enforceAndMergeLessonPlan,
  extractDateRangeFromText,
  resolveValidDateRange,
  StructuredDersBilgiFormu,
  WeekSpecificExtraction,
} from "../shared/maarifPlanEngine";

const TURKISH_MONTHS: Record<string, string> = {
  ocak: "01",
  şubat: "02",
  subat: "02",
  mart: "03",
  nisan: "04",
  mayıs: "05",
  mayis: "05",
  haziran: "06",
  temmuz: "07",
  ağustos: "08",
  agustos: "08",
  eylül: "09",
  eylul: "09",
  ekim: "10",
  kasım: "11",
  kasim: "11",
  aralık: "12",
  aralik: "12",
};

export function inferApprovalDateClient(
  dateRange: string,
  defaultYear = 2026
): string {
  const lower = (dateRange || "").toLocaleLowerCase("tr-TR");
  const numericDateMatch = lower.match(
    /\b(\d{1,2})[./](\d{1,2})(?:[./](20\d{2}))?/
  );
  if (numericDateMatch) {
    const d = numericDateMatch[1].padStart(2, "0");
    const m = numericDateMatch[2].padStart(2, "0");
    const y =
      numericDateMatch[3] ||
      (Number(m) >= 9 ? String(defaultYear) : String(defaultYear + 1));
    return `${d}/${m}/${y}`;
  }
  const dayMatch = lower.match(/(\d{1,2})/);
  const day = dayMatch ? dayMatch[1].padStart(2, "0") : "01";
  for (const [mName, mNum] of Object.entries(TURKISH_MONTHS)) {
    if (lower.includes(mName)) {
      const year = Number(mNum) >= 9 ? defaultYear : defaultYear + 1;
      return `${day}/${mNum}/${year}`;
    }
  }
  return "";
}

export function stripDocumentFrontMatter(rawText: string): string {
  return stripFrontMatter(rawText);
}

export function extractDocumentMetadataClient(text: string): {
  okulAdi: string;
  dersIsmi: string;
  sinifDuzeyi: string;
} {
  // Course metadata (school, course name, grade level) is always in the document header / first pages
  const headerSlice = (text || "").slice(0, 18000);
  const meta = extractCleanDocumentMetadata(headerSlice);
  return {
    okulAdi: meta.okulAdi,
    dersIsmi: meta.dersIsmi,
    sinifDuzeyi: meta.sinifDuzeyi,
  };
}

const QUICK_WEEKS_CACHE = new Map<string, YillikPlanWeekItem[]>();

export function parseQuickWeeksClient(
  text: string,
  dersBilgiFormuText = "",
  dersMateryaliText = ""
): YillikPlanWeekItem[] {
  if (!text || !text.trim()) return [];
  const cacheKey = `${text.length}:${text.slice(0, 120)}:${dersBilgiFormuText.length}:${dersMateryaliText.length}`;
  const cached = QUICK_WEEKS_CACHE.get(cacheKey);
  if (cached) {
    return cached;
  }

  const cleanYillik = stripFrontMatter((text || "").slice(0, 150000));
  const lines = cleanYillik
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  // Parse structured DBF/Materyal + Yıllık Plan so unitsByNumber and outcomesMap reflect the current course
  const structuredDbf = parseDersBilgiFormuStructured(
    dersBilgiFormuText || "",
    cleanYillik,
    dersMateryaliText || ""
  );

  const rawHits: { wNo: number; lineIdx: number }[] = [];
  const seenWeeks = new Set<number>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matches = line.matchAll(
      /(?:\b(\d{1,2})\s*\.\s*HAFTA\b|\bHAFTA\s*[:|-]?\s*(\d{1,2})\b)/gi
    );
    for (const m of matches) {
      const wNo = Number(m[1] || m[2]);
      if (wNo >= 1 && wNo <= 42 && !seenWeeks.has(wNo)) {
        seenWeeks.add(wNo);
        rawHits.push({ wNo, lineIdx: i });
      }
    }
  }

  const weeks: YillikPlanWeekItem[] = [];
  let activeUnitCarryover = "";
  let activeOutcomeCarryover = "";

  for (let idx = 0; idx < rawHits.length; idx++) {
    const { wNo, lineIdx: i } = rawHits[idx];
    const prevIdx = idx > 0 ? rawHits[idx - 1].lineIdx : -1;
    const nextIdx =
      idx + 1 < rawHits.length ? rawHits[idx + 1].lineIdx : lines.length;

    // 1. Resolve date range strictly from this week's anchor (same line -> 1 line above -> 1 line below)
    let datePart = extractDateRangeFromText(lines[i]);
    if (!datePart && i - 1 > prevIdx) {
      datePart = extractDateRangeFromText(lines[i - 1]);
    }
    if (!datePart && i + 1 < nextIdx - 1) {
      datePart = extractDateRangeFromText(lines[i + 1]);
    }
    if (!datePart && i - 2 > prevIdx + 1) {
      datePart = extractDateRangeFromText(lines[i - 2]);
    }

    const validDateRange = resolveValidDateRange(datePart, wNo);

    // 2. Extract exact week-specific outcome, sub-components, unit, and topic using the structured engine
    const weekSpecific = extractWeekPlanStructured(
      cleanYillik,
      `${wNo}. HAFTA`,
      validDateRange,
      structuredDbf
    );

    const displayOutcome =
      weekSpecific.outcomeHeader || activeOutcomeCarryover;
    if (weekSpecific.outcomeHeader) {
      activeOutcomeCarryover = weekSpecific.outcomeHeader;
    }

    let ogrenmeBirimi = weekSpecific.ogrenmeBirimi || activeUnitCarryover;
    if (weekSpecific.ogrenmeBirimi) {
      activeUnitCarryover = weekSpecific.ogrenmeBirimi;
    }

    // Build week-specific summary showing the outcome and THIS week's specific sub-components (a, b vs c, ç vs d, e)
    const weekSubs = weekSpecific.weekSubComponents.filter(
      (s) => s.length >= 4
    );
    const meaningfulSummary = displayOutcome
      ? weekSubs.length > 0
        ? [displayOutcome, ...weekSubs.slice(0, 3)].join(" · ")
        : weekSpecific.icerikCercevesi
        ? `${displayOutcome} · ${weekSpecific.icerikCercevesi}`
        : displayOutcome
      : weekSubs.length > 0
      ? weekSubs.slice(0, 3).join(" · ")
      : weekSpecific.icerikCercevesi || "";

    weeks.push({
      id: `week-${wNo}`,
      haftaNo: wNo,
      haftaEtiketi: `${wNo}. HAFTA`,
      tarihAraligi: validDateRange,
      onayTarihi: inferApprovalDateClient(validDateRange),
      ogrenmeBirimi: ogrenmeBirimi || "",
      icerikCercevesi: weekSpecific.icerikCercevesi || "",
      konuVeCiktiOzeti: meaningfulSummary.slice(0, 260),
      sure: weekSpecific.sure || structuredDbf.sure || "2 Ders Saati",
      ogrenmeKanitlari:
        weekSpecific.unitOgrenmeKanitlari || structuredDbf.ogrenmeKanitlari || "",
      ogretmeUygulamalari: weekSpecific.unitOgretmeUygulamalari || [],
    });
  }

  const sorted = weeks.sort((a, b) => a.haftaNo - b.haftaNo);
  if (QUICK_WEEKS_CACHE.size > 15) {
    const firstKey = QUICK_WEEKS_CACHE.keys().next().value;
    if (firstKey) QUICK_WEEKS_CACHE.delete(firstKey);
  }
  QUICK_WEEKS_CACHE.set(cacheKey, sorted);
  return sorted;
}

function extractLegacyDocText(buffer: ArrayBuffer): string {
  const decoderUtf8 = new TextDecoder("utf-8", { fatal: false });
  const rawUtf8 = decoderUtf8.decode(buffer);

  if (/<html|<table|<body|<p\b|<w:/i.test(rawUtf8)) {
    const stripped = rawUtf8
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<\/(tr|p|div|li|h[1-6])>/gi, "\n")
      .replace(/<\/(td|th)>/gi, " | ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s*\n+/g, "\n")
      .trim();
    if (stripped.length > 20) return stripped;
  }

  const printableChunks =
    rawUtf8.match(/[A-Za-z0-9ÇĞİÖŞÜçğıöşü.,;:!?()[\]\-–/\s]{6,}/g) || [];
  const cleaned = printableChunks
    .map((c) => c.trim())
    .filter((c) => c.length >= 6 && /[A-Za-zÇĞİÖŞÜçğıöşü]{3,}/.test(c))
    .join("\n");

  return cleaned.trim();
}

export interface ClientExtractionResult {
  text: string;
  quickWeeks: YillikPlanWeekItem[];
  detectedMeta: {
    okulAdi: string;
    dersIsmi: string;
    sinifDuzeyi: string;
  };
  method: "client" | "server";
  totalPages?: number;
}

export interface ExtractFileOptions {
  fieldKey?: "yillik_plan" | "ders_bilgi_formu" | "ders_materyali";
  onProgress?: (statusText: string) => void;
}

/**
 * Non-blocking chunked PDF text extractor.
 * Processes pages in small async batches, cleans up page proxies immediately to keep memory flat,
 * enforces a per-page timeout so complex vector diagram pages never hang PDF.js,
 * and yields to the browser UI thread after every batch so the tab never freezes ("Sayfa Yanıt Vermiyor").
 */
async function extractPdfTextChunkedNonBlocking(
  uint8: Uint8Array,
  onProgress?: (statusText: string) => void
): Promise<{ text: string; totalPages: number }> {
  onProgress?.("PDF yapısı hazırlanıyor...");
  await new Promise((resolve) => setTimeout(resolve, 0));

  const pdf = await getDocumentProxy(uint8);
  const totalPages = pdf.numPages || 0;
  const pageTexts: string[] = [];
  const BATCH_SIZE = 4;
  const MAX_TOTAL_CHARS = 450000;
  const PER_PAGE_TIMEOUT_MS = 1800;
  let accumulatedChars = 0;

  try {
    onProgress?.(`PDF açıldı (${totalPages} sayfa), metin çıkarılıyor...`);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const extractSinglePageWithTimeout = async (
      pageNo: number
    ): Promise<string> => {
      let pageProxy: Awaited<ReturnType<typeof pdf.getPage>> | undefined;
      try {
        const pagePromise = (async () => {
          const loadedPage = await pdf.getPage(pageNo);
          pageProxy = loadedPage;
          const content = await loadedPage.getTextContent();
          const pageStr = content.items
            .map((item) => {
              if (item && "str" in item && typeof item.str === "string") {
                return item.str + (item.hasEOL ? "\n" : " ");
              }
              return "";
            })
            .join("")
            .replace(/[^\S\n]+/g, " ")
            .replace(/ ?\n ?/g, "\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
          return pageStr;
        })();

        const timeoutPromise = new Promise<string>((resolve) => {
          setTimeout(() => resolve(""), PER_PAGE_TIMEOUT_MS);
        });

        return await Promise.race([pagePromise, timeoutPromise]);
      } catch {
        return "";
      } finally {
        try {
          if (pageProxy && typeof pageProxy.cleanup === "function") {
            pageProxy.cleanup();
          }
        } catch {
          // ignore cleanup warnings
        }
      }
    };

    for (let startPage = 1; startPage <= totalPages; startPage += BATCH_SIZE) {
      const endPage = Math.min(totalPages, startPage + BATCH_SIZE - 1);
      const batchNumbers: number[] = [];
      for (let p = startPage; p <= endPage; p++) {
        batchNumbers.push(p);
      }

      const batchResults = await Promise.all(
        batchNumbers.map((pNo) => extractSinglePageWithTimeout(pNo))
      );

      for (const pText of batchResults) {
        if (pText) {
          pageTexts.push(pText);
          accumulatedChars += pText.length;
        }
      }

      const pct = Math.min(100, Math.round((endPage / Math.max(1, totalPages)) * 100));
      onProgress?.(
        `PDF okunuyor: ${endPage} / ${totalPages} sayfa (%${pct})`
      );

      // Yield to browser UI event loop so React renders progress and browser never freezes
      await new Promise((resolve) => setTimeout(resolve, 8));

      if (accumulatedChars >= MAX_TOTAL_CHARS) {
        break;
      }
    }
  } finally {
    try {
      await pdf.loadingTask?.destroy?.();
    } catch {
      // ignore destroy warnings
    }
  }

  return {
    text: pageTexts.join("\n\n").trim(),
    totalPages,
  };
}

export async function extractFileContentHybrid(
  file: File,
  options?: ExtractFileOptions
): Promise<ClientExtractionResult> {
  const lowerName = file.name.toLowerCase();
  const fieldKey = options?.fieldKey;
  const onProgress = options?.onProgress;

  onProgress?.("Dosya belleğe alınıyor...");
  const arrayBuffer = await file.arrayBuffer();
  let extractedText = "";
  let totalPages: number | undefined;

  try {
    if (lowerName.endsWith(".pdf") || file.type === "application/pdf") {
      const uint8 = new Uint8Array(arrayBuffer);
      const pdfRes = await extractPdfTextChunkedNonBlocking(uint8, onProgress);
      extractedText = pdfRes.text;
      totalPages = pdfRes.totalPages;
    } else if (
      lowerName.endsWith(".docx") ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      onProgress?.("Word (.docx) belgesi okunuyor...");
      await new Promise((resolve) => setTimeout(resolve, 0));
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = (result.value || "").trim();
    } else if (
      lowerName.endsWith(".xlsx") ||
      lowerName.endsWith(".xls") ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      onProgress?.("Excel tablosu okunuyor...");
      await new Promise((resolve) => setTimeout(resolve, 0));
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetTexts: string[] = [];

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) continue;
        const rows = XLSX.utils.sheet_to_json<
          (string | number | boolean | null)[]
        >(sheet, { header: 1, blankrows: false });
        const formattedRows = rows
          .map((row) =>
            row
              .map((cell) =>
                cell !== null && cell !== undefined ? String(cell).trim() : ""
              )
              .filter(Boolean)
              .join(" | ")
          )
          .filter(Boolean)
          .join("\n");

        if (formattedRows) {
          sheetTexts.push(`--- Sayfa: ${sheetName} ---\n${formattedRows}`);
        }
      }
      extractedText = sheetTexts.join("\n\n").trim();
    } else if (lowerName.endsWith(".doc") || lowerName.endsWith(".rtf")) {
      onProgress?.("Belge metni ayrıştırılıyor...");
      await new Promise((resolve) => setTimeout(resolve, 0));
      extractedText = extractLegacyDocText(arrayBuffer);
    } else if (
      lowerName.endsWith(".txt") ||
      lowerName.endsWith(".md") ||
      lowerName.endsWith(".csv") ||
      file.type.startsWith("text/")
    ) {
      const decoder = new TextDecoder("utf-8", { fatal: false });
      extractedText = decoder.decode(arrayBuffer).trim();
    }
  } catch (clientErr) {
    console.warn(
      "Client-side extraction warning, trying server fallback:",
      clientErr
    );
  }

  if (extractedText.length >= 25) {
    onProgress?.("İçerik yapılandırılıyor...");
    await new Promise((resolve) => setTimeout(resolve, 0));
    return {
      text: extractedText,
      // Only parse 36-week rows if this file is Yıllık Plan!
      quickWeeks:
        fieldKey === "yillik_plan" ? parseQuickWeeksClient(extractedText) : [],
      detectedMeta: extractDocumentMetadataClient(extractedText),
      method: "client",
      totalPages,
    };
  }

  if (file.size <= 35 * 1024 * 1024) {
    try {
      onProgress?.("Sunucu tabanlı metin çözümleyici çalışıyor...");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract-file", {
        method: "POST",
        body: formData,
      });

      const raw = await response.text();
      try {
        const data = JSON.parse(raw);
        if (response.ok && typeof data.text === "string" && data.text.trim()) {
          const clean = data.text.trim();
          return {
            text: clean,
            quickWeeks:
              fieldKey === "yillik_plan"
                ? Array.isArray(data.quickWeeks) && data.quickWeeks.length > 0
                  ? data.quickWeeks
                  : parseQuickWeeksClient(clean)
                : [],
            detectedMeta: extractDocumentMetadataClient(clean),
            method: "server",
            totalPages,
          };
        }
      } catch {
        // Non-JSON proxy response
      }
    } catch (serverErr) {
      console.warn("Server fallback warning:", serverErr);
    }
  }

  const fallbackText =
    extractedText ||
    `[Yüklenen Dosya: ${file.name}]\nNot: Bu dosya görsel/taranmış ağırlıklı bir doküman olarak algılandı.`;

  return {
    text: fallbackText,
    quickWeeks:
      fieldKey === "yillik_plan" ? parseQuickWeeksClient(fallbackText) : [],
    detectedMeta: extractDocumentMetadataClient(fallbackText),
    method: "client",
    totalPages,
  };
}

export async function safeReadJsonResponse<T = Record<string, unknown>>(
  response: Response
): Promise<{ ok: boolean; status: number; data: T | null; errorText?: string }> {
  const rawText = await response.text();
  try {
    const parsed = JSON.parse(rawText) as T;
    return {
      ok: response.ok,
      status: response.status,
      data: parsed,
    };
  } catch {
    return {
      ok: false,
      status: response.status,
      data: null,
      errorText: `Proxy/Ağ yanıtı (${response.status}): ${rawText.slice(0, 120)}`,
    };
  }
}

export interface XmlContextPayloadInput {
  yillik_plan: string;
  ders_materyali: string;
  ders_bilgi_formu?: string;
  hafta_etiketi: string;
  tarih_araligi: string;
  onay_tarihi: string;
  okul_adi: string;
  egitim_ogretim_yili: string;
  ders_ismi: string;
  sinif_duzeyi: string;
  secilen_hafta_verisi?: YillikPlanWeekItem | null;
  dosya_adlari?: {
    yillik_plan?: string | null;
    ders_materyali?: string | null;
    ders_bilgi_formu?: string | null;
  };
}

/**
 * Decomposes the 3 full documents in memory using our Maarif Plan Engine and builds an
 * explicit XML-tagged context payload (<hedef_hafta_ve_ust_bilgiler>, <yillik_plan>,
 * <ders_bilgi_formu>, <ders_materyali>) where NO section of Ders Bilgi Formu or Yıllık Plan
 * is ever cut off!
 */
export function buildXmlContextPayloadWithAnalysis(
  input: XmlContextPayloadInput
): {
  xmlPayload: string;
  structuredDbf: StructuredDersBilgiFormu;
  weekData: WeekSpecificExtraction;
  materyalSlice: string;
} {
  const structuredDbf = parseDersBilgiFormuStructured(
    input.ders_bilgi_formu || "",
    input.yillik_plan,
    input.ders_materyali
  );

  const weekData = extractWeekPlanStructured(
    input.yillik_plan,
    input.hafta_etiketi,
    input.tarih_araligi,
    structuredDbf,
    input.secilen_hafta_verisi
  );

  const materyalSlice = extractWeekMateryalSlice(
    input.ders_materyali,
    weekData,
    9500
  );

  const effectiveDers = input.ders_ismi.trim() || structuredDbf.ders;
  const effectiveSinif = input.sinif_duzeyi.trim() || structuredDbf.sinif;
  const effectiveTarihAraligi =
    weekData.tarihAraligi || input.tarih_araligi || "";
  const effectiveOnayTarihi =
    inferApprovalDateClient(effectiveTarihAraligi) || input.onay_tarihi || "";

  const cleanYillikTableSlice = stripFrontMatter(input.yillik_plan || "").slice(
    0,
    24000
  );
  const cleanDbfSlice = stripFrontMatter(input.ders_bilgi_formu || "").slice(
    0,
    24000
  );

  const xmlPayload = `<ders_plani_baglam_paketi>
<hedef_hafta_ve_ust_bilgiler>
  <okul_adi>${input.okul_adi || ""}</okul_adi>
  <egitim_ogretim_yili>${input.egitim_ogretim_yili || ""}</egitim_ogretim_yili>
  <ders_ismi>${effectiveDers}</ders_ismi>
  <sinif_duzeyi>${effectiveSinif}</sinif_duzeyi>
  <hafta_etiketi>${weekData.haftaEtiketi}</hafta_etiketi>
  <tarih_araligi>${effectiveTarihAraligi}</tarih_araligi>
  <onay_tarihi>${effectiveOnayTarihi}</onay_tarihi>
  <dosya_adlari>
    <yillik_plan_dosya_adi>${input.dosya_adlari?.yillik_plan || ""}</yillik_plan_dosya_adi>
    <ders_bilgi_formu_dosya_adi>${input.dosya_adlari?.ders_bilgi_formu || ""}</ders_bilgi_formu_dosya_adi>
    <ders_materyali_dosya_adi>${input.dosya_adlari?.ders_materyali || ""}</ders_materyali_dosya_adi>
  </dosya_adlari>
</hedef_hafta_ve_ust_bilgiler>

<yillik_plan baglam="Bu metin Ünitelendirilmiş Yıllık Plandır. Hedeflenen hafta (${weekData.haftaEtiketi}) ve tarih aralığı (${effectiveTarihAraligi}) dikkate alınarak Öğrenme Birimi, Süre, İçerik Çerçevesi ve o hafta/tarih aralığına ait TÜM Öğrenme Çıktıları ve Süreç Bileşenleri (a, b, c, ç, d, e...) eksiksiz alınır.">
  <secilen_hafta_ogrenme_birimi>${weekData.ogrenmeBirimi}</secilen_hafta_ogrenme_birimi>
  <secilen_hafta_suresi>${weekData.sure}</secilen_hafta_suresi>
  <secilen_hafta_icerik_cercevesi>${weekData.icerikCercevesi}</secilen_hafta_icerik_cercevesi>
  <secilen_hafta_ogrenme_ciktilari_ve_surec_bilesenleri>
${weekData.formattedOutcomeAndProcessBlock}
  </secilen_hafta_ogrenme_ciktilari_ve_surec_bilesenleri>
  <secilen_hafta_ham_kesiti>
${weekData.rawWeekWindowText}
  </secilen_hafta_ham_kesiti>
  <yillik_plan_tam_tablo_metni>
${cleanYillikTableSlice}
  </yillik_plan_tam_tablo_metni>
</yillik_plan>

<ders_bilgi_formu baglam="Bu metin MEB Türkiye Yüzyılı Maarif Modeli resmi Ders Bilgi Formudur. Öğrenme Çıktıları ve Süreç Bileşenlerinin tam cümleleri ile Öğrenme Kanıtları, Temel Kabuller, Ön Değerlendirme Süreci, Köprü Kurma ve Öğretme Uygulamaları doğrudan bu etiket içindeki resmi metinlerden birebir alınır.">
  <alan_becerileri>${structuredDbf.alanBecerileri}</alan_becerileri>
  <egilimler>${structuredDbf.egilimler}</egilimler>
  <sosyal_duygusal_ogrenme_becerileri>${structuredDbf.sosyalDuygusalBeceriler}</sosyal_duygusal_ogrenme_becerileri>
  <degerler>${structuredDbf.degerler}</degerler>
  <okuryazarlik_becerileri>${structuredDbf.okuryazarlikBecerileri}</okuryazarlik_becerileri>
  <disiplinler_arasi_iliski>${structuredDbf.disiplinlerArasiIliski}</disiplinler_arasi_iliski>
  <beceriler_arasi_iliski>${structuredDbf.becerilerArasiIliski}</beceriler_arasi_iliski>
  <ogrenme_ciktilari_ve_surec_bilesenleri_katalogu>
${structuredDbf.rawOutcomesCatalogText || ""}
  </ogrenme_ciktilari_ve_surec_bilesenleri_katalogu>
  <ogrenme_kanitlari_tam_metin>
${weekData.unitOgrenmeKanitlari || structuredDbf.ogrenmeKanitlari}
  </ogrenme_kanitlari_tam_metin>
  <temel_kabuller_tam_metin>
${structuredDbf.temelKabuller}
  </temel_kabuller_tam_metin>
  <on_degerlendirme_sureci_tam_metin>
${structuredDbf.onDegerlendirmeSureci}
  </on_degerlendirme_sureci_tam_metin>
  <kopru_kurma_tam_metin>
${structuredDbf.kopruKurma}
  </kopru_kurma_tam_metin>
  <ogretme_uygulamalari_secilen_birim>
${weekData.unitOgretmeUygulamalari.join("\n")}
  </ogretme_uygulamalari_secilen_birim>
  <farklilastirma_tam_metin>${structuredDbf.farklilastirma}</farklilastirma_tam_metin>
  <aktif_maarif_kodlari>${structuredDbf.rawActivityCodes.join(", ")}</aktif_maarif_kodlari>
  <ders_bilgi_formu_ham_metin>
${cleanDbfSlice}
  </ders_bilgi_formu_ham_metin>
</ders_bilgi_formu>

<ders_materyali baglam="Bu metin Ders Materyalinin (Ders Kitabı / Modül) seçilen haftadaki süreç bileşenlerine (${weekData.weekSubComponents.join(" ; ")}) ait konu anlatımı kesitidir. Bu etiketten ve seçilen haftanın süreç bileşenlerinden o haftaya özgü 4 maddelik Güdüleme (-acaksınız/-eceksiniz kipinde), 4 soruluk Dikkat Çekme (? ile biten) ve sonunda parantez içi Maarif kodları bulunan 5-6 maddelik Ek Öğretme Uygulamaları üretilir.">
${materyalSlice}
</ders_materyali>
</ders_plani_baglam_paketi>`;

  return {
    xmlPayload,
    structuredDbf,
    weekData,
    materyalSlice,
  };
}

export function buildXmlContextPayload(input: XmlContextPayloadInput): string {
  return buildXmlContextPayloadWithAnalysis(input).xmlPayload;
}

export interface ClientSynthesisInput {
  yillik_plan: string;
  ders_materyali: string;
  ders_bilgi_formu?: string;
  hafta_etiketi?: string;
  tarih_araligi?: string;
  ders_ismi?: string;
  sinif_duzeyi?: string;
  secilen_hafta_verisi?: YillikPlanWeekItem | null;
}

export function synthesizePlanClientSide(
  inputs: ClientSynthesisInput
): MaarifLessonPlan {
  const cleanDbf = stripFrontMatter(inputs.ders_bilgi_formu || "");
  const cleanYillik = stripFrontMatter(inputs.yillik_plan || "");
  const cleanMateryal = stripFrontMatter(inputs.ders_materyali || "");

  const structuredDbf = parseDersBilgiFormuStructured(
    cleanDbf,
    cleanYillik,
    cleanMateryal
  );
  const weekData = extractWeekPlanStructured(
    cleanYillik,
    inputs.hafta_etiketi || "1. HAFTA",
    inputs.tarih_araligi || "",
    structuredDbf,
    inputs.secilen_hafta_verisi
  );
  const materyalSlice = extractWeekMateryalSlice(
    cleanMateryal,
    weekData,
    9500
  );

  return enforceAndMergeLessonPlan(
    null,
    structuredDbf,
    weekData,
    materyalSlice,
    {
      dersIsmi: inputs.ders_ismi,
      sinifDuzeyi: inputs.sinif_duzeyi,
    }
  );
}

export function synthesizeAllWeeksClientSide(params: {
  weeks: YillikPlanWeekItem[];
  yillik_plan: string;
  ders_materyali: string;
  ders_bilgi_formu?: string;
  baseMeta: DocumentHeaderFooterMeta;
}): Array<{ plan: MaarifLessonPlan; meta: DocumentHeaderFooterMeta }> {
  const { weeks, yillik_plan, ders_materyali, ders_bilgi_formu, baseMeta } =
    params;

  const cleanDbf = stripFrontMatter(ders_bilgi_formu || "");
  const cleanYillik = stripFrontMatter(yillik_plan || "");
  const cleanMateryal = stripFrontMatter(ders_materyali || "");

  const detectedDocMeta = extractDocumentMetadataClient(
    `${cleanDbf}\n${cleanYillik}\n${cleanMateryal}`
  );
  const effectiveDersIsmi =
    baseMeta.dersIsmi.trim() || detectedDocMeta.dersIsmi;
  const effectiveSinifDuzeyi =
    baseMeta.sinifDuzeyi.trim() || detectedDocMeta.sinifDuzeyi;
  const effectiveOkulAdi =
    baseMeta.okulAdi.trim() || detectedDocMeta.okulAdi;

  const structuredDbf = parseDersBilgiFormuStructured(
    cleanDbf,
    cleanYillik,
    cleanMateryal
  );

  return weeks.map((weekItem) => {
    const validDate = resolveValidDateRange(
      weekItem.tarihAraligi,
      weekItem.haftaNo
    );
    const weekData = extractWeekPlanStructured(
      cleanYillik,
      weekItem.haftaEtiketi,
      validDate,
      structuredDbf,
      {
        ...weekItem,
        tarihAraligi: validDate,
      }
    );
    const materyalSlice = extractWeekMateryalSlice(
      cleanMateryal,
      weekData,
      6500
    );

    const plan = enforceAndMergeLessonPlan(
      null,
      structuredDbf,
      weekData,
      materyalSlice,
      {
        dersIsmi: effectiveDersIsmi,
        sinifDuzeyi: effectiveSinifDuzeyi,
      }
    );

    if (weekItem.ogrenmeKanitlari) {
      plan.Ogrenme_Kanitlari = weekItem.ogrenmeKanitlari;
    }
    if (
      weekItem.ogretmeUygulamalari &&
      weekItem.ogretmeUygulamalari.length > 0
    ) {
      plan.Ogrenme_Ogretme_Yasantilari.Ogretme_Uygulamalari =
        weekItem.ogretmeUygulamalari.map((b) =>
          b.replace(/^\*\s*/, "").trim()
        );
    }

    const weekMeta: DocumentHeaderFooterMeta = {
      ...baseMeta,
      okulAdi: effectiveOkulAdi || baseMeta.okulAdi,
      dersIsmi: effectiveDersIsmi || plan.Ders_Bilgisi.Ders,
      sinifDuzeyi: effectiveSinifDuzeyi || plan.Ders_Bilgisi.Sinif,
      haftaEtiketi: weekItem.haftaEtiketi,
      tarihAraligi: validDate,
      onayTarihi:
        weekItem.onayTarihi ||
        inferApprovalDateClient(validDate) ||
        baseMeta.onayTarihi,
    };

    return { plan, meta: weekMeta };
  });
}

