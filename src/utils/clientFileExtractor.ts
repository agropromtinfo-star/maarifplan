import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { extractText } from "unpdf";
import { MaarifLessonPlan, YillikPlanWeekItem } from "../types/lessonPlan";

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
  const lower = (dateRange || "").toLowerCase();
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

/**
 * Strips textbook/PDF front-matter boilerplate (copyright, imprint, ISBN, TOC dotted lines)
 * so that lines like "MİLLÎ EĞİTİM BAKANLIĞI YAYINLARI ... 10956" or "Her hakkı saklıdır"
 * never pollute lesson plan activities.
 */
export function stripDocumentFrontMatter(rawText: string): string {
  const lines = (rawText || "").split(/\r?\n/);
  const cleanedLines = lines.filter((line) => {
    const t = line.trim();
    if (!t) return false;
    // Skip TOC dotted leaders like ".........: 10956" or "...... 14"
    if (/\.{4,}\s*:?\s*\d+/.test(t)) return false;
    if (
      /MİLL[İI]\s*EĞİTİM\s*BAKANLIĞI\s*YAYINLARI|YARDIMCI\s*VE\s*KAYNAK\s*KİTAPLAR|Her\s*hakkı\s*saklıdır|hiçbir\s*surette\s*alınıp\s*yayımlanamaz|ISBN\s*[:\d-]|Baskı\s*Yılı|Matbaası|İSTİKL[ÂA]L\s*MARŞI|GENÇLİĞE\s*HİTABE|EDİTÖR|GÖRSEL\s*TASARIM|PROGRAM\s*GELİŞTİRME\s*UZMANI|ÖLÇME\s*VE\s*DEĞERLENDİRME\s*UZMANI|REHBERLİK\s*UZMANI/i.test(
        t
      )
    ) {
      return false;
    }
    return true;
  });
  return cleanedLines.join("\n");
}

/**
 * Extracts clean course name, grade level, and school name from Yıllık Plan or Ders Bilgi Formu text
 */
export function extractDocumentMetadataClient(text: string): {
  okulAdi: string;
  dersIsmi: string;
  sinifDuzeyi: string;
} {
  const lines = (text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 80);

  let okulAdi = "";
  let dersIsmi = "";
  let sinifDuzeyi = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. School Name (LİSESİ / OKULU / MÜDÜRLÜĞÜ)
    if (
      !okulAdi &&
      /(?:ANADOLU|MESLEKİ|TEKNİK|FEN|İMAM\s*HATİP|ÇOK\s*PROGRAMLI|ORTAOKULU|İLKOKULU)\s+.*LİSESİ|LİSESİ\s*MÜDÜRLÜĞÜ/i.test(
        line
      ) &&
      !/BAKANLIĞI|GENEL\s*MÜDÜRLÜĞÜ/i.test(line)
    ) {
      okulAdi = line.replace(/\|/g, " ").replace(/\s+/g, " ").trim();
    }

    // 2. Grade Level (9. SINIF, 10. SINIF, SINIF DÜZEYİ: 9, vb.)
    if (!sinifDuzeyi) {
      const explicitGrade = line.match(/\b(9|10|11|12|5|6|7|8)\s*\.\s*SINIF\b/i);
      if (explicitGrade) {
        sinifDuzeyi = `${explicitGrade[1]}. SINIF`;
      } else if (/SINIF\s*DÜZEYİ/i.test(line)) {
        const numInLine = line.match(/\b(9|10|11|12|5|6|7|8)\b/);
        const numInNext = lines[i + 1]?.match(/\b(9|10|11|12|5|6|7|8)\b/);
        const g = numInLine?.[1] || numInNext?.[1];
        if (g) sinifDuzeyi = `${g}. SINIF`;
      }
    }

    // 3. Course Name (DERSİN ADI, ... DERSİ, etc.)
    if (!dersIsmi) {
      const dersAdiLabel = line.match(
        /DERS(?:İN)?\s*ADI\s*[:|\-–]?\s*([A-ZÇĞİÖŞÜa-zçğıöşü0-9\s()-]{3,80})/i
      );
      if (dersAdiLabel) {
        const candidate = dersAdiLabel[1]
          .replace(/SINIF.*|DERSİN\s*SÜRESİ.*|HAFTALIK.*/i, "")
          .trim();
        if (
          candidate.length >= 3 &&
          !/^(BİLGİ\s*FORMU|MATERYALİ|PLANI|SAATİ|SÜRESİ)$/i.test(candidate)
        ) {
          dersIsmi = candidate.replace(/\s+\d{1,2}$/, "").trim();
        } else if (lines[i + 1]) {
          const nextCand = lines[i + 1]
            .replace(/\|/g, " ")
            .replace(/SINIF.*|DERSİN\s*SÜRESİ.*|HAFTALIK.*/i, "")
            .trim();
          if (
            nextCand.length >= 3 &&
            !/^(BİLGİ\s*FORMU|MATERYALİ|PLANI|SAATİ|SÜRESİ|\d+)$/i.test(
              nextCand
            )
          ) {
            dersIsmi = nextCand.replace(/\s+\d{1,2}$/, "").trim();
          }
        }
      } else {
        // Check header lines like "SÜRDÜRÜLEBİLİR TARIM 9 DERS BİLGİ FORMU" or "9. SINIF SÜRDÜRÜLEBİLİR TARIM DERSİ"
        const headerCourseMatch = line.match(
          /(?:\b\d{1,2}\.\s*SINIF\s+)?([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s()-]{3,60}?)\s+(?:\d{1,2}\s+)?(?:DERSİ|DERS\s*BİLGİ\s*FORMU|DERS\s*MATERYALİ|ÜNİTELENDİRİLMİŞ\s*YILLIK)/i
        );
        if (headerCourseMatch) {
          const candidate = headerCourseMatch[1]
            .replace(/^TARIM\s*ALANI\s*/i, "")
            .replace(/\b\d{1,2}\.\s*SINIF\b/i, "")
            .trim();
          if (
            candidate.length >= 3 &&
            !/^(BİLGİ\s*FORMU|MATERYALİ|YILLIK\s*PLAN|GÜNLÜK\s*PLAN|HAFTALIK)$/i.test(
              candidate
            )
          ) {
            dersIsmi = candidate;
          }
        }
      }
    }
  }

  return { okulAdi, dersIsmi, sinifDuzeyi };
}

export function parseQuickWeeksClient(text: string): YillikPlanWeekItem[] {
  const lines = (text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const weeks: YillikPlanWeekItem[] = [];
  const seenWeeks = new Set<number>();

  const monthPattern =
    /(?:Ocak|Şubat|Subat|Mart|Nisan|Mayıs|Mayis|Haziran|Temmuz|Ağustos|Agustos|Eylül|Eylul|Ekim|Kasım|Kasim|Aralık|Aralik)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/\b(\d{1,2})\s*\.\s*HAFTA(?:\s*\(?([^)|]+)\)?)?/i);
    if (m) {
      const wNo = Number(m[1]);
      if (wNo >= 1 && wNo <= 42 && !seenWeeks.has(wNo)) {
        seenWeeks.add(wNo);
        let datePart = (m[2] || "").trim().replace(/^\(|\)$/g, "").trim();

        // Collect all lines belonging to this week until the next week header
        const blockLines: string[] = [];
        for (let j = Math.max(0, i - 1); j < Math.min(lines.length, i + 16); j++) {
          if (
            j > i &&
            new RegExp(`\\b${wNo + 1}\\s*\\.\\s*HAFTA\\b`, "i").test(lines[j])
          ) {
            break;
          }
          blockLines.push(lines[j]);
        }

        // Try to find a real calendar date range (e.g. "28 Aralık - 01 Ocak" or "14-18 Eylül")
        if (!datePart || /^\d+\s*\.\s*hafta$/i.test(datePart)) {
          for (const bLine of blockLines) {
            const dateRangeMatch = bLine.match(
              new RegExp(
                `(\\d{1,2}\\s*(?:${monthPattern.source})?\\s*[-–/]\\s*\\d{1,2}\\s*${monthPattern.source}|${monthPattern.source}\\s*[-–/]?\\s*\\d{1,2}\\s*[-–]\\s*\\d{1,2})`,
                "i"
              )
            );
            if (dateRangeMatch) {
              datePart = dateRangeMatch[1].trim();
              break;
            }
          }
        }

        const blockText = blockLines.join(" | ");

        const sureMatch = blockText.match(
          /\b(\d{1,2})\s*(?:Ders\s*)?Saat[i]?\b/i
        );
        const sure = sureMatch ? `${sureMatch[1]} Ders Saati` : "";

        // Extract learning outcome code if present in this week's block (e.g. ST.2.1. İyi tarımı açıklayabilme)
        const outcomeMatch = blockText.match(
          /\b([A-ZÇĞİÖŞÜ]{2,8}\.\d+(?:\.\d+)*\.?\s+[^|]{6,140})/
        );

        let ogrenmeBirimi = "";
        const unitMatch = blockText.match(
          /(?:Öğrenme\s*Birimi|Ünite|Tema|Modül)\s*(?!VE\s*SÜRE)[:|-]\s*([^|]+)/i
        );
        if (unitMatch && !/^VE\s*SÜRE$/i.test(unitMatch[1].trim())) {
          ogrenmeBirimi = unitMatch[1].trim().slice(0, 90);
        }

        const meaningfulSummary = outcomeMatch
          ? outcomeMatch[1].trim()
          : blockLines
              .filter(
                (l) =>
                  !/^\d{1,2}\s*\.\s*HAFTA$/i.test(l) &&
                  !/^\d{1,2}\s*(?:Ders\s*)?Saat[i]?$/i.test(l)
              )
              .slice(0, 4)
              .join(" | ")
              .replace(/\s+/g, " ")
              .trim();

        weeks.push({
          id: `week-${wNo}`,
          haftaNo: wNo,
          haftaEtiketi: `${wNo}. HAFTA`,
          tarihAraligi: datePart || "",
          onayTarihi: inferApprovalDateClient(datePart),
          ogrenmeBirimi,
          konuVeCiktiOzeti: meaningfulSummary.slice(0, 240),
          sure,
        });
      }
    }
  }

  return weeks.sort((a, b) => a.haftaNo - b.haftaNo);
}

/**
 * Extracts readable text from legacy .doc (HTML/RTF/Word binary) buffers
 */
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
}

/**
 * High-speed hybrid file extractor:
 * 1. First extracts directly in the browser (instant, supports up to 40 MB without hitting network/proxy limits).
 * 2. Falls back to /api/extract-file on the server if client extraction yields very little text (e.g. scanned PDF).
 */
export async function extractFileContentHybrid(
  file: File
): Promise<ClientExtractionResult> {
  const lowerName = file.name.toLowerCase();
  const arrayBuffer = await file.arrayBuffer();
  let extractedText = "";

  try {
    if (lowerName.endsWith(".pdf") || file.type === "application/pdf") {
      const uint8 = new Uint8Array(arrayBuffer);
      const { text } = await extractText(uint8, { mergePages: true });
      extractedText = (
        Array.isArray(text) ? text.join("\n\n") : text || ""
      ).trim();
    } else if (
      lowerName.endsWith(".docx") ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = (result.value || "").trim();
    } else if (
      lowerName.endsWith(".xlsx") ||
      lowerName.endsWith(".xls") ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
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
    return {
      text: extractedText,
      quickWeeks: parseQuickWeeksClient(extractedText),
      detectedMeta: extractDocumentMetadataClient(extractedText),
      method: "client",
    };
  }

  if (file.size <= 10 * 1024 * 1024) {
    try {
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
            quickWeeks: Array.isArray(data.quickWeeks)
              ? data.quickWeeks
              : parseQuickWeeksClient(clean),
            detectedMeta: extractDocumentMetadataClient(clean),
            method: "server",
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
    quickWeeks: parseQuickWeeksClient(fallbackText),
    detectedMeta: extractDocumentMetadataClient(fallbackText),
    method: "client",
  };
}

/**
 * Extracts topic keywords, learning unit names, and outcome codes (e.g. ST.2.1, BÜY.1.1)
 * from the selected week's window in Yıllık Plan so we can accurately locate the matching
 * sections inside Ders Bilgi Formu and Ders Materyali (which do NOT contain "16. HAFTA").
 */
export function extractSearchKeywordsFromYillikPlanWeek(
  yillikPlanText: string,
  haftaEtiketi: string,
  tarihAraligi: string,
  selectedWeekObj?: YillikPlanWeekItem | null
): string[] {
  const weekWindow = extractWeekWindowClient(
    yillikPlanText,
    haftaEtiketi,
    tarihAraligi
  );

  const keywords = new Set<string>();

  if (haftaEtiketi) keywords.add(haftaEtiketi);
  if (
    tarihAraligi &&
    tarihAraligi.toLowerCase() !== haftaEtiketi.toLowerCase()
  ) {
    keywords.add(tarihAraligi);
  }
  if (selectedWeekObj?.ogrenmeBirimi && selectedWeekObj.ogrenmeBirimi.length >= 3) {
    keywords.add(selectedWeekObj.ogrenmeBirimi);
  }

  // 1. Extract outcome codes from the week window (e.g. "ST.2.1", "BÜY.1.1", "9.1.2")
  const codeMatches =
    weekWindow.match(
      /\b(?:[A-ZÇĞİÖŞÜ]{2,8}\.)+\d+(?:\.\d+)*\b|\b\d{1,2}\.\d{1,2}\.\d{1,2}\b/g
    ) || [];
  for (const code of codeMatches) {
    keywords.add(code.replace(/\.$/, ""));
  }

  // 2. Extract outcome lines or topic phrases from the week window
  const windowLines = weekWindow
    .split(/\r?\n|\|/)
    .map((l) => l.trim())
    .filter((l) => l.length >= 5);

  const stopPhrases =
    /^(?:\d{1,2}\s*\.\s*HAFTA|\d{1,2}\s*Ders\s*Saati|HAFTA|SAAT|SÜRE|ÖĞRENME\s*BİRİMİ|İÇERİK\s*ÇERÇEVESİ|BELİRLİ\s*GÜNLER|OKUL\s*DIŞI)/i;

  for (const line of windowLines) {
    if (stopPhrases.test(line)) continue;
    // Extract 2-4 word topic phrases
    const cleanPhrase = line
      .replace(/\b(?:SDB|KB|OB|AB|E|D)\d+(?:\.\d+)*\.?\b/g, "")
      .replace(/^[a-zçğıöşü]\)\s*/i, "")
      .trim();
    if (cleanPhrase.length >= 6 && cleanPhrase.length <= 75) {
      keywords.add(cleanPhrase);
    }
    // Also add distinctive words (>= 5 chars)
    const words =
      cleanPhrase.match(/[A-ZÇĞİÖŞÜa-zçğıöşü]{5,}/g) || [];
    for (const w of words.slice(0, 8)) {
      if (
        !/^(hafta|saati|dersi|öğrenme|birimi|süreç|bileşenleri|açıklar|sıralar|açıklanır|sıralanır|kavramı|uygulama|değerlendirme|becerisi|okuryazarlığı)$/i.test(
          w
        )
      ) {
        keywords.add(w);
      }
    }
  }

  return Array.from(keywords).slice(0, 20);
}

/**
 * Compacts a document by extracting all sections matching the selected week's outcome codes
 * and topic keywords, while stripping copyright/TOC front-matter.
 */
export function compactDocumentForSelectedWeek(
  fullText: string,
  searchKeywords: string[],
  maxChars = 11000
): string {
  const cleanedText = stripDocumentFrontMatter(fullText || "").trim();
  if (cleanedText.length <= maxChars) {
    return cleanedText;
  }

  const validTerms = searchKeywords
    .map((k) => k.trim())
    .filter((k) => k.length >= 3);

  const lines = cleanedText.split(/\r?\n/);
  const matchedBlocks: string[] = [];

  for (const term of validTerms) {
    const lowerTerm = term.toLocaleLowerCase("tr-TR");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLocaleLowerCase("tr-TR").includes(lowerTerm)) {
        const start = Math.max(0, i - 5);
        const end = Math.min(lines.length, i + 45);
        const block = lines.slice(start, end).join("\n").trim();
        if (block && !matchedBlocks.includes(block)) {
          matchedBlocks.push(block);
        }
        i += 30;
        if (matchedBlocks.join("\n\n").length > maxChars * 0.78) break;
      }
    }
    if (matchedBlocks.join("\n\n").length > maxChars * 0.78) break;
  }

  const focusedSection = matchedBlocks
    .join("\n\n---\n\n")
    .slice(0, Math.floor(maxChars * 0.8));
  const remainingBudget = Math.max(
    1500,
    maxChars - focusedSection.length - 150
  );
  const headSlice = cleanedText.slice(0, remainingBudget);

  if (focusedSection) {
    return `${headSlice}\n\n[SEÇİLEN HAFTA / KAZANIM / KONU ODAK BÖLÜMLERİ]\n${focusedSection}`;
  }

  return cleanedText.slice(0, maxChars);
}

/**
 * Safely parses a fetch Response as JSON without throwing "Unexpected token 'T', 'The page c'..."
 */
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
 * Formats all lesson plan inputs and the 3 source documents into an explicit XML-like tag hierarchy
 * (<hedef_hafta_ve_ust_bilgiler>, <yillik_plan>, <ders_bilgi_formu>, <ders_materyali>)
 * instead of JSON so both the transport layer and the Gemini LLM parse each document's context unambiguously.
 */
export function buildXmlContextPayload(input: XmlContextPayloadInput): string {
  const secilenHaftaXml = input.secilen_hafta_verisi
    ? `  <secilen_hafta_verisi>
    <hafta_no>${input.secilen_hafta_verisi.haftaNo || ""}</hafta_no>
    <hafta_etiketi>${input.secilen_hafta_verisi.haftaEtiketi || ""}</hafta_etiketi>
    <tarih_araligi>${input.secilen_hafta_verisi.tarihAraligi || ""}</tarih_araligi>
    <ogrenme_birimi>${input.secilen_hafta_verisi.ogrenmeBirimi || ""}</ogrenme_birimi>
    <konu_ve_cikti_ozeti>${input.secilen_hafta_verisi.konuVeCiktiOzeti || ""}</konu_ve_cikti_ozeti>
    <sure>${input.secilen_hafta_verisi.sure || ""}</sure>
  </secilen_hafta_verisi>`
    : "";

  return `<ders_plani_baglam_paketi>
<hedef_hafta_ve_ust_bilgiler>
  <okul_adi>${input.okul_adi || ""}</okul_adi>
  <egitim_ogretim_yili>${input.egitim_ogretim_yili || ""}</egitim_ogretim_yili>
  <ders_ismi>${input.ders_ismi || ""}</ders_ismi>
  <sinif_duzeyi>${input.sinif_duzeyi || ""}</sinif_duzeyi>
  <hafta_etiketi>${input.hafta_etiketi || ""}</hafta_etiketi>
  <tarih_araligi>${input.tarih_araligi || ""}</tarih_araligi>
  <onay_tarihi>${input.onay_tarihi || ""}</onay_tarihi>
  <dosya_adlari>
    <yillik_plan_dosya_adi>${input.dosya_adlari?.yillik_plan || ""}</yillik_plan_dosya_adi>
    <ders_bilgi_formu_dosya_adi>${input.dosya_adlari?.ders_bilgi_formu || ""}</ders_bilgi_formu_dosya_adi>
    <ders_materyali_dosya_adi>${input.dosya_adlari?.ders_materyali || ""}</ders_materyali_dosya_adi>
  </dosya_adlari>
${secilenHaftaXml}
</hedef_hafta_ve_ust_bilgiler>

<yillik_plan baglam="Bu metin kullanıcının yüklediği Ünitelendirilmiş Yıllık Plandır. Seçilen haftanın Öğrenme Birimi, Süresi (Ders Saati), İçerik Çerçevesi ve Öğrenme Çıktıları / Süreç Bileşenleri (a, b, c...) doğrudan bu etiket içinden alınmalıdır.">
${input.yillik_plan}
</yillik_plan>

<ders_bilgi_formu baglam="Bu metin MEB Türkiye Yüzyılı Maarif Modeli Ders Bilgi Formudur (Öğretim Programıdır). Öğrenme Çıktıları ve Süreç Bileşenleri (a, b, c...), Alan Becerileri, Eğilimler (E...), Programlar Arası Bileşenler (SDB..., D..., OB..., Disiplinler Arası İlişki, KB...), Öğrenme Kanıtları ve Öğrenme-Öğretme Yaşantıları (Temel Kabuller, Ön Değerlendirme Süreci, Köprü Kurma, Öğretme Uygulamaları, Farklılaştırma) doğrudan bu etiket içinden alınmalıdır.">
${input.ders_bilgi_formu || ""}
</ders_bilgi_formu>

<ders_materyali baglam="Bu metin Ders Materyalidir (Ders Kitabı / Modül / Konu Anlatımı). Güdüleme (4 madde), Dikkat Çekme (4 düşündürücü soru), Ek Öğretme Uygulamaları (parantez içi Maarif kodlarıyla 5 somut sınıf/atölye uygulaması) ve konu içi teknik detaylar bu etiket içindeki bilgilerden sentezlenmelidir.">
${input.ders_materyali}
</ders_materyali>
</ders_plani_baglam_paketi>`;
}

/**
 * Extracts multi-line section blocks between a heading and the next known curriculum heading
 */
function extractSectionBlockClient(
  corpus: string,
  headingRegex: RegExp,
  stopHeadingRegex: RegExp,
  maxChars = 900
): string {
  const lines = (corpus || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(headingRegex);
    if (m) {
      const collected: string[] = [];
      const remainder = line
        .slice((m.index || 0) + m[0].length)
        .replace(/^[:|\-–\s]+/, "")
        .trim();
      if (remainder && !stopHeadingRegex.test(remainder)) {
        collected.push(remainder);
      }
      for (let j = i + 1; j < Math.min(lines.length, i + 25); j++) {
        if (stopHeadingRegex.test(lines[j])) break;
        collected.push(lines[j]);
        if (collected.join(" ").length >= maxChars) break;
      }
      const joined = collected.join(" ").replace(/\s+/g, " ").trim();
      if (joined.length >= 15) {
        return joined.slice(0, maxChars);
      }
    }
  }
  return "";
}

function extractOutcomesAndCodesClient(text: string): {
  outcomeBlocks: string[];
  maarifCodes: string[];
} {
  const lines = (text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const outcomeCodeRegex =
    /\b(?:[A-ZÇĞİÖŞÜ]{2,8}\.)+\d+(?:\.\d+)*\b/;
  const subProcessRegex = /^(?:[a-zçğıöşü]\)|[a-zçğıöşü]\.|[-•*])\s+/i;

  const outcomeBlocks: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (outcomeCodeRegex.test(line)) {
      // Clean any preceding fragments before the code on the same line (e.g., "genel kuralları ST.2.1. İyi tarımı...")
      const codeMatch = line.match(
        /(\b(?:[A-ZÇĞİÖŞÜ]{2,8}\.)+\d+(?:\.\d+)*\.?\s+.*)/
      );
      const cleanStartLine = codeMatch ? codeMatch[1].trim() : line;
      const block: string[] = [cleanStartLine];

      for (let j = i + 1; j < Math.min(lines.length, i + 14); j++) {
        const nextLine = lines[j];
        if (outcomeCodeRegex.test(nextLine)) break;
        if (
          /^(?:İÇERİK\s*ÇERÇEVESİ|ÖĞRENME\s*KANITLARI|ÖĞRENME-ÖĞRETME|PROGRAMLAR\s*ARASI|\d{1,2}\s*\.\s*HAFTA)/i.test(
            nextLine
          )
        ) {
          break;
        }
        if (
          subProcessRegex.test(nextLine) ||
          /^[a-zçğıöşü]\)\s/i.test(nextLine) ||
          /açıklanır|sıralanır|uygulanır|incelenir|belirlenir|yapılır|sınıflandırılır|karşılaştırılır|değerlendirilir|açıklar|sıralar|uygular/i.test(
            nextLine
          )
        ) {
          block.push(nextLine);
        }
      }
      const joined = block.join("\n").trim();
      if (joined.length > 10 && !outcomeBlocks.includes(joined)) {
        outcomeBlocks.push(joined);
      }
      if (outcomeBlocks.length >= 15) break;
    }
  }

  const codeMatches =
    (text || "").match(/\b(?:SDB|KB|OB|AB|E|D)\d+(?:\.\d+)*\b/g) || [];
  const maarifCodes = Array.from(new Set(codeMatches)).slice(0, 35);

  return { outcomeBlocks, maarifCodes };
}

export function extractWeekWindowClient(
  yillikPlanText: string,
  haftaEtiketi: string,
  tarihAraligi: string
): string {
  const lines = (yillikPlanText || "").split(/\r?\n/);
  if (lines.length === 0) return "";

  const weekNumMatch = (haftaEtiketi || "").match(/(\d{1,2})/);
  const weekNum = weekNumMatch ? Number(weekNumMatch[1]) : null;
  const cleanDate = (tarihAraligi || "").trim();

  const matchIndices: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const hasExactWeek =
      weekNum !== null &&
      new RegExp(`\\b${weekNum}\\s*\\.\\s*HAFTA\\b`, "i").test(line);
    const hasDate =
      cleanDate.length >= 5 &&
      !/^\d+\s*\.\s*hafta$/i.test(cleanDate) &&
      line.toLocaleLowerCase("tr-TR").includes(cleanDate.toLocaleLowerCase("tr-TR"));

    if (hasExactWeek || hasDate) {
      matchIndices.push(i);
    }
  }

  if (matchIndices.length === 0) {
    return lines.slice(0, 80).join("\n");
  }

  const windows: string[] = [];
  for (const idx of matchIndices.slice(0, 2)) {
    const start = Math.max(0, idx - 3);
    let end = Math.min(lines.length, idx + 40);
    if (weekNum !== null) {
      for (let k = idx + 1; k < end; k++) {
        if (
          new RegExp(`\\b${weekNum + 1}\\s*\\.\\s*HAFTA\\b`, "i").test(
            lines[k]
          )
        ) {
          end = k;
          break;
        }
      }
    }
    windows.push(lines.slice(start, end).join("\n"));
  }

  return windows.join("\n\n---\n\n");
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

/**
 * Clean single-line code + label extractor (never crosses newlines or swallows headings)
 */
function extractCleanComponentCodes(
  corpus: string,
  prefix: "E" | "SDB" | "D" | "OB" | "KB" | "AB",
  fallback: string
): string {
  const regex = new RegExp(
    `\\b(${prefix}\\d+(?:\\.\\d+)*)\\.?[ \\t]*([A-ZÇĞİÖŞÜa-zçğıöşü][A-ZÇĞİÖŞÜa-zçğıöşü \\t-]{2,42})`,
    "g"
  );
  const found = new Map<string, string>();
  let m: RegExpExecArray | null;
  while ((m = regex.exec(corpus)) !== null) {
    const code = m[1];
    const label = m[2]
      .replace(
        /\b(?:PROGRAMLAR|SOSYAL|DEĞERLER|OKURYAZARLIK|DİSİPLİNLER|BECERİLER|ÖĞRENME|EĞİLİMLER|ALAN)\b.*/i,
        ""
      )
      .trim();
    if (label.length >= 3 && !found.has(code)) {
      found.set(code, `${code}. ${label}`);
    }
  }
  if (found.size > 0) {
    return Array.from(found.values()).slice(0, 5).join(", ");
  }
  return fallback;
}

export function synthesizePlanClientSide(
  inputs: ClientSynthesisInput
): MaarifLessonPlan {
  const secilenHaftaEtiketi = (inputs.hafta_etiketi || "1. HAFTA").trim();
  const secilenTarihAraligi = (inputs.tarih_araligi || "").trim();

  const cleanYillik = stripDocumentFrontMatter(inputs.yillik_plan);
  const cleanDbf = stripDocumentFrontMatter(inputs.ders_bilgi_formu || "");
  const cleanMateryal = stripDocumentFrontMatter(inputs.ders_materyali);

  const weekWindow = extractWeekWindowClient(
    cleanYillik,
    secilenHaftaEtiketi,
    secilenTarihAraligi
  );

  const combinedCurriculum = `${weekWindow}\n\n${cleanDbf}\n\n${cleanYillik}`;
  const docMeta = extractDocumentMetadataClient(
    `${cleanYillik}\n${cleanDbf}\n${cleanMateryal}`
  );

  const weekIntel = extractOutcomesAndCodesClient(weekWindow);
  const dbfIntel = extractOutcomesAndCodesClient(cleanDbf);
  const fullIntel = extractOutcomesAndCodesClient(combinedCurriculum);

  // 1. Sınıf & Ders (strictly sanitized)
  const sinif =
    (inputs.sinif_duzeyi || "").trim() ||
    docMeta.sinifDuzeyi ||
    "9. SINIF";

  const ders =
    (inputs.ders_ismi || "").trim() ||
    docMeta.dersIsmi ||
    "MESLEK DERSİ";

  // 2. Öğrenme Çıktıları ve Süreç Bileşenleri
  const bestOutcomeBlock =
    weekIntel.outcomeBlocks[0] ||
    dbfIntel.outcomeBlocks[0] ||
    fullIntel.outcomeBlocks[0] ||
    inputs.secilen_hafta_verisi?.konuVeCiktiOzeti ||
    `${ders} dersi ${secilenHaftaEtiketi} öğrenme çıktısı ve süreç bileşenleri.`;

  // Derive topic from outcome block if needed
  const firstOutcomeTitle = bestOutcomeBlock
    .split("\n")[0]
    .replace(/^[A-ZÇĞİÖŞÜ]{2,8}\.\d+(?:\.\d+)*\.?\s*/, "")
    .trim();

  // 3. Öğrenme Birimi (never allow "VE SÜRE" or table column headers)
  let rawUnit =
    inputs.secilen_hafta_verisi?.ogrenmeBirimi?.trim() || "";
  if (!rawUnit || /^VE\s*SÜRE$/i.test(rawUnit)) {
    const unitMatch = combinedCurriculum.match(
      /(?:Öğrenme\s*Birimi|Ünite\s*Adı)\s*[:|-]\s*([A-ZÇĞİÖŞÜa-zçğıöşü0-9\s,()-]{4,80})/i
    );
    if (unitMatch && !/VE\s*SÜRE|SÜRE|SAAT/i.test(unitMatch[1])) {
      rawUnit = unitMatch[1].trim();
    }
  }
  const ogrenmeBirimi = rawUnit || firstOutcomeTitle || ders;

  // 4. İçerik Çerçevesi (never allow "16. Hafta")
  let icerikCercevesi = "";
  const icerikMatch = weekWindow.match(
    /İçerik\s*Çerçevesi\s*[:|-]?\s*([A-ZÇĞİÖŞÜa-zçğıöşü0-9\s,()-]{5,120})/i
  );
  if (icerikMatch && !/^\d+\s*\.\s*hafta$/i.test(icerikMatch[1].trim())) {
    icerikCercevesi = icerikMatch[1].trim();
  } else {
    icerikCercevesi = firstOutcomeTitle || ogrenmeBirimi;
  }

  // 5. Süre
  const sureMatch =
    inputs.secilen_hafta_verisi?.sure?.trim() ||
    weekWindow.match(/\b(\d{1,2})\s*(?:Ders\s*)?Saat[i]?\b/i)?.[1] ||
    combinedCurriculum.match(/HAFTALIK\s*(\d{1,2})\s*DERS\s*SAATİ/i)?.[1] ||
    "2 Ders Saati";
  const sure = /saat/i.test(sureMatch) ? sureMatch : `${sureMatch} Ders Saati`;

  // 6. Alan Becerileri, Eğilimler ve Programlar Arası Bileşenler
  const alanBecerileri = extractCleanComponentCodes(
    combinedCurriculum,
    "AB",
    `${ders} alanı temel mesleki uygulama becerileri`
  );
  const egilimler = extractCleanComponentCodes(
    combinedCurriculum,
    "E",
    "E2.2. Sorumluluk, E3.2. Odaklanma"
  );
  const sdb = extractCleanComponentCodes(
    combinedCurriculum,
    "SDB",
    "SDB2.2. İş Birliği Becerisi, SDB3.3. Sorumlu Karar Verme Becerisi"
  );
  const degerler = extractCleanComponentCodes(
    combinedCurriculum,
    "D",
    "D3. Çalışkanlık, D16. Sorumluluk"
  );
  const okuryazarlik = extractCleanComponentCodes(
    combinedCurriculum,
    "OB",
    "OB1. Bilgi Okuryazarlığı"
  );
  const becerilerArasi = extractCleanComponentCodes(
    combinedCurriculum,
    "KB",
    "KB2.2. Gözlemleme, KB3.2. Problem Çözme"
  );

  const disiplinlerArasi =
    extractSectionBlockClient(
      combinedCurriculum,
      /\bDisiplinler\s*Arası\s*İlişki(?:ler)?\b/i,
      /\b(?:Beceriler\s*Arası|Öğrenme\s*Çıktıları|İçerik\s*Çerçevesi|Öğrenme\s*Kanıtları)\b/i,
      150
    ) || "Fen Bilimleri, Biyoloji, Çevre Bilimi";

  // 7. Öğrenme Kanıtları
  const ogrenmeKanitlari =
    extractSectionBlockClient(
      combinedCurriculum,
      /\bÖğrenme\s*Kanıtları(?:\s*\(Ölçme\s*ve\s*Değerlendirme\))?\b/i,
      /\b(?:ÖĞRENME-ÖĞRETME\s*YAŞANTILARI|Temel\s*Kabuller|Farklılaştırma)\b/i,
      1100
    ) ||
    `Öğrenci performansını belirlemeye yönelik çalışmalar değerlendirilirken gözlem formu, kontrol listesi, akran değerlendirme, öz değerlendirme ve dereceli puanlama anahtarı (rubrik) gibi ölçme araçlarından uygun olanlar seçilerek kullanılabilir. "${icerikCercevesi}" konusu kapsamındaki uygulamalarda süreç adımları gözlem formları ile takip edilebilir ve öğrencilerin öğrenme sürecine aktif katılımları değerlendirilebilir.`;

  // 8. Temel Kabuller, Ön Değerlendirme Süreci, Köprü Kurma (full multi-line extraction)
  const temelKabuller =
    extractSectionBlockClient(
      combinedCurriculum,
      /\bTemel\s*Kabuller\b/i,
      /\b(?:Ön\s*Değerlendirme|Köprü\s*Kurma|Öğretme-Öğrenme\s*Uygulamaları|Öğretme\s*Uygulamaları)\b/i,
      600
    ) ||
    `Öğrencilerin "${ogrenmeBirimi}" ve "${icerikCercevesi}" konusuyla ilgili günlük yaşamdan temel ön bilgilere ve gözlemlere sahip oldukları kabul edilmektedir.`;

  const onDegerlendirme =
    extractSectionBlockClient(
      combinedCurriculum,
      /\bÖn\s*Değerlendirme(?:\s*Süreci)?\b/i,
      /\b(?:Köprü\s*Kurma|Öğretme-Öğrenme\s*Uygulamaları|Öğretme\s*Uygulamaları|Farklılaştırma)\b/i,
      600
    ) ||
    `Öğrencilere "${icerikCercevesi}" konusuna ilişkin açık uçlu sorular yöneltilerek ön bilgileri, kavram yanılgıları ve hazırbulunuşluk düzeyleri belirlenir.`;

  const kopruKurma =
    extractSectionBlockClient(
      combinedCurriculum,
      /\bKöprü\s*Kurma\b/i,
      /\b(?:Öğretme-Öğrenme\s*Uygulamaları|Öğretme\s*Uygulamaları|Farklılaştırma|Zenginleştirme)\b/i,
      600
    ) ||
    `Günlük hayatta karşılaşılan örnekler ve önceki derslerde edinilen deneyimler üzerinden "${ogrenmeBirimi}" ile "${icerikCercevesi}" konusu arasında ilişki kurularak yeni konuya geçiş yapılır.`;

  // 9. Öğretme Uygulamaları (from topic-matched sections of Ders Bilgi Formu & Ders Materyali)
  const keywords = extractSearchKeywordsFromYillikPlanWeek(
    cleanYillik,
    secilenHaftaEtiketi,
    secilenTarihAraligi,
    inputs.secilen_hafta_verisi
  );
  const focusedMateryal = compactDocumentForSelectedWeek(
    cleanMateryal,
    keywords,
    4000
  );
  const materyalSentences = focusedMateryal
    .split(/(?<=[.!?])\s+|\r?\n/)
    .map((s) => s.replace(/^[*•\-–\d.)\s]+/, "").trim())
    .filter(
      (s) =>
        s.length >= 45 &&
        s.length <= 300 &&
        !/SEÇİLEN HAFTA|BAŞLANGIÇ KESİTİ|DERS MATERYALİ|BİLGİ FORMU/i.test(s)
    );

  const codeSuffix =
    fullIntel.maarifCodes.length > 0
      ? `(${fullIntel.maarifCodes.slice(0, 6).join(", ")})`
      : "(KB2.2, E2.2, E3.2, D3, SDB2.2, OB1)";

  const ogretmeUygulamalari: string[] = [
    `${ogrenmeBirimi} — ${icerikCercevesi}:`,
    ...materyalSentences.slice(0, 4),
    `Öğrencilere "${icerikCercevesi}" konusu ve uygulama kuralları hakkında ders materyali ve güvenilir kaynaklar üzerinden inceleme ve araştırma görevi verilir.`,
    `Gruplara ayrılan öğrencilerin "${icerikCercevesi}" kapsamındaki uygulama basamaklarını iş birliği içinde yürütmeleri ve gözlemlerini kayıt altına almaları sağlanır ${codeSuffix}.`,
    `Süreç sonunda kontrol listesi, öz değerlendirme ve dereceli puanlama anahtarı (rubrik) kullanılarak öğrencilerin kavrama ve uygulama becerileri değerlendirilir ${codeSuffix}.`,
  ];

  const guduleme: string[] = [
    `Bu derste "${ogrenmeBirimi}" öğrenme birimi kapsamında "${icerikCercevesi}" konusunun temel ilkelerini ve uygulama adımlarını öğreneceksiniz.`,
    `Edineceğiniz bilgiler sayesinde "${ders}" alanında standartlara uygun, sürdürülebilir ve verimli uygulamalar gerçekleştirebileceksiniz.`,
    `Ders materyalindeki vaka ve uygulama örneklerini inceleyerek mesleki süreçleri analitik bir bakış açısıyla değerlendirme becerisi kazanacaksınız.`,
    `Bu konudaki kazanımlarınız, mesleki uygulamalarda doğru karar verme ve sorumluluk alma yetkinliğinizi güçlendirecektir.`,
  ];

  const dikkatCekme: string[] = [
    `Günlük yaşamda ve mesleki uygulamalarda "${icerikCercevesi}" kavramının neden giderek daha fazla önem kazandığını hiç düşündünüz mü?`,
    `"${ogrenmeBirimi}" süreçlerinde temel kurallara ve standartlara uyulmadığında hangi sorunlarla karşılaşılabilir?`,
    `Çevrenizdeki uygulamalarda "${icerikCercevesi}" açısından hangi doğru veya yanlış örnekler dikkatinizi çekmektedir?`,
    `Başarılı ve sürdürülebilir bir uygulama için öncelikle hangi kriterlerin yerine getirilmesi gerekir?`,
  ];

  const ekOgretmeUygulamalari: string[] = [
    `Ders materyalinde yer alan "${icerikCercevesi}" ile ilgili görsel, tablo ve örnek vakalar sınıf ortamında incelenerek temel kavramlar tartışılır (E3.2, OB1).`,
    `Öğrencilerin "${icerikCercevesi}" kapsamındaki temel ilkeleri ve uygulama adımlarını karşılaştırmaları için kavram haritası veya eşleştirme çalışması yapılır (KB2.2).`,
    `Konuyla ilgili örnek olaylar üzerinden doğru uygulama basamakları şematik olarak tahtada veya etkileşimli ekranda analiz edilir (OB1).`,
    `Öğrenciler çalışma gruplarına ayrılarak "${icerikCercevesi}" konusundaki uygulama kurallarını maddeler halinde özetleyip arkadaşlarına sunarlar (SDB2.2, E2.2).`,
    `Uygulama ortamında iş sağlığı, güvenliği ve çevre koruma kurallarına dikkat edilerek değerlendirme çalışması gerçekleştirilir (D3, SDB3.3).`,
  ];

  const farklilastirma =
    extractSectionBlockClient(
      combinedCurriculum,
      /\b(?:Farklılaştırma|Zenginleştirme)\b/i,
      /\b(?:ÖĞRETMEN|OKUL\s*MÜDÜRÜ|UYGUNDUR|\d{1,2}\s*\.\s*HAFTA)\b/i,
      600
    ) || "";

  return {
    Ders_Bilgisi: {
      Sinif: sinif,
      Ders: ders,
      Ogrenme_Birimi: ogrenmeBirimi,
      Sure: sure,
      Alan_Becerileri: alanBecerileri,
      Egilimler: egilimler,
    },
    Programlar_Arasi_Bilesenler: {
      Sosyal_Duygusal_Ogrenme_Becerileri: sdb,
      Degerler: degerler,
      Okuryazarlik_Becerileri: okuryazarlik,
      Disiplinler_Arasi_Iliski: disiplinlerArasi,
      Beceriler_Arasi_Iliski: becerilerArasi,
    },
    Ogrenme_Ciktilari_ve_Surec_Bilesenleri: bestOutcomeBlock,
    Icerik_Cercevesi: icerikCercevesi,
    Ogrenme_Kanitlari: ogrenmeKanitlari,
    Ogrenme_Ogretme_Yasantilari: {
      Temel_Kabuller: temelKabuller,
      On_Degerlendirme_Sureci: onDegerlendirme,
      Kopru_Kurma: kopruKurma,
      Ogretme_Uygulamalari: ogretmeUygulamalari,
      Guduleme: guduleme,
      Dikkat_Cekme: dikkatCekme,
      Ek_Ogretme_Uygulamalari: ekOgretmeUygulamalari,
    },
    Farklilastirma: farklilastirma,
  };
}
