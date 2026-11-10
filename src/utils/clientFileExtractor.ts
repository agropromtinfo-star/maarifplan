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

export function inferApprovalDateClient(dateRange: string, defaultYear = 2026): string {
  const lower = (dateRange || "").toLowerCase();
  const dayMatch = lower.match(/(\d{1,2})/);
  const day = dayMatch ? dayMatch[1].padStart(2, "0") : "14";
  for (const [mName, mNum] of Object.entries(TURKISH_MONTHS)) {
    if (lower.includes(mName)) {
      const year = Number(mNum) >= 9 ? defaultYear : defaultYear + 1;
      return `${day}/${mNum}/${year}`;
    }
  }
  return `14/09/${defaultYear}`;
}

export function parseQuickWeeksClient(text: string): YillikPlanWeekItem[] {
  const lines = (text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const weeks: YillikPlanWeekItem[] = [];
  const seenWeeks = new Set<number>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/(\d{1,2})\s*\.\s*HAFTA(?:\s*\(?([^)|]+)\)?)?/i);
    if (m) {
      const wNo = Number(m[1]);
      if (wNo >= 1 && wNo <= 42 && !seenWeeks.has(wNo)) {
        seenWeeks.add(wNo);
        let datePart = (m[2] || "").trim().replace(/^\(|\)$/g, "").trim();
        if (
          !datePart &&
          lines[i + 1] &&
          /\d{1,2}\s*[-–]\s*\d{1,2}/.test(lines[i + 1])
        ) {
          datePart = lines[i + 1].trim();
        }

        // Look ahead up to 10 lines until the next week header to extract unit, hours, and outcomes
        const blockLines: string[] = [];
        for (let j = i; j < Math.min(lines.length, i + 12); j++) {
          if (j > i && /\b\d{1,2}\s*\.\s*HAFTA\b/i.test(lines[j])) break;
          blockLines.push(lines[j]);
        }
        const blockText = blockLines.join(" | ");

        const sureMatch = blockText.match(/\b(\d{1,2})\s*(?:Ders\s*)?Saat[i]?\b/i);
        const sure = sureMatch ? `${sureMatch[1]} Ders Saati` : "";

        let ogrenmeBirimi = "";
        const unitMatch = blockText.match(
          /(?:Öğrenme\s*Birimi|Ünite|Tema|Modül)\s*[:|-]\s*([^|]+)/i
        );
        if (unitMatch) {
          ogrenmeBirimi = unitMatch[1].trim().slice(0, 90);
        }

        const contextSlice = blockLines
          .slice(0, 6)
          .join(" | ")
          .replace(/\s+/g, " ")
          .trim();

        weeks.push({
          id: `week-${wNo}`,
          haftaNo: wNo,
          haftaEtiketi: `${wNo}. HAFTA`,
          tarihAraligi: datePart || `${wNo}. Hafta`,
          onayTarihi: inferApprovalDateClient(datePart),
          ogrenmeBirimi,
          konuVeCiktiOzeti: contextSlice.slice(0, 220),
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
    console.warn("Client-side extraction warning, trying server fallback:", clientErr);
  }

  if (extractedText.length >= 25) {
    return {
      text: extractedText,
      quickWeeks: parseQuickWeeksClient(extractedText),
      method: "client",
    };
  }

  // Fallback to server-side /api/extract-file only if file is <= 10 MB so proxy doesn't reject it
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
          return {
            text: data.text.trim(),
            quickWeeks: Array.isArray(data.quickWeeks)
              ? data.quickWeeks
              : parseQuickWeeksClient(data.text),
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
    `[Yüklenen Dosya: ${file.name}]\nNot: Bu dosya görsel/taranmış ağırlıklı bir doküman olarak algılandı. Plan üretimi sırasında seçilen hafta ve ders bilgileriyle işlenecektir.`;

  return {
    text: fallbackText,
    quickWeeks: parseQuickWeeksClient(fallbackText),
    method: "client",
  };
}

/**
 * Compacts a potentially huge document text (e.g. a 300-page PDF textbook) into a focused,
 * proxy-safe payload (< 6,500 chars per doc, < 20 KB total request) that preserves:
 * 1) All sections matching the selected week, date range, learning unit, or outcome keywords
 * 2) The document header/intro and relevant curriculum sections
 * Keeping the total POST body under ~22 KB guarantees the reverse proxy never returns 413 "The page could not be...".
 */
export function compactDocumentForSelectedWeek(
  fullText: string,
  searchKeywords: string[],
  maxChars = 6500
): string {
  const trimmed = (fullText || "").trim();
  if (trimmed.length <= maxChars) {
    return trimmed;
  }

  const validTerms = searchKeywords
    .map((k) => k.trim())
    .filter((k) => k.length >= 3);

  const lines = trimmed.split(/\r?\n/);
  const matchedBlocks: string[] = [];

  for (const term of validTerms) {
    const lowerTerm = term.toLowerCase();
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(lowerTerm)) {
        const start = Math.max(0, i - 4);
        const end = Math.min(lines.length, i + 36);
        const block = lines.slice(start, end).join("\n").trim();
        if (block && !matchedBlocks.includes(block)) {
          matchedBlocks.push(block);
        }
        i += 24;
        if (matchedBlocks.join("\n\n").length > maxChars * 0.65) break;
      }
    }
    if (matchedBlocks.join("\n\n").length > maxChars * 0.65) break;
  }

  const focusedSection = matchedBlocks.join("\n\n---\n\n").slice(0, Math.floor(maxChars * 0.7));
  const remainingBudget = Math.max(1200, maxChars - focusedSection.length - 200);
  const headSlice = trimmed.slice(0, Math.floor(remainingBudget * 0.75));
  const tailSlice = trimmed.slice(-Math.floor(remainingBudget * 0.25));

  if (focusedSection) {
    return `[SEÇİLEN HAFTA VE KONU ODAK KESİTİ]\n${focusedSection}\n\n[DOKÜMAN BAŞLANGIÇ KESİTİ]\n${headSlice}\n\n[DOKÜMAN SON KESİTİ]\n${tailSlice}`;
  }

  return `${trimmed.slice(0, maxChars)}`;
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

function extractValueByLabelClient(
  corpus: string,
  labelRegex: RegExp,
  maxLength = 350
): string {
  const lines = (corpus || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(labelRegex);
    if (match) {
      const afterColon = line
        .slice((match.index || 0) + match[0].length)
        .replace(/^[:|\-–\s]+/, "")
        .trim();
      if (afterColon.length >= 2) {
        return afterColon.slice(0, maxLength);
      }
      if (lines[i + 1] && lines[i + 1].length >= 2) {
        return lines[i + 1].slice(0, maxLength);
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
    /\b(?:[A-ZÇĞİÖŞÜ]{2,10}\.)+(?:\d+\.)*\d+\b|\b\d{1,2}\.\d{1,2}(?:\.\d{1,2})+\b/;
  const subProcessRegex = /^(?:[a-zçğıöşü]\)|[a-zçğıöşü]\.|[-•*])\s+/i;

  const outcomeBlocks: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      outcomeCodeRegex.test(line) ||
      /öğrenme\s*çıktı|süreç\s*bileşen|kazanım/i.test(line)
    ) {
      const block: string[] = [line];
      for (let j = i + 1; j < Math.min(lines.length, i + 12); j++) {
        const nextLine = lines[j];
        if (
          subProcessRegex.test(nextLine) ||
          /^[a-zçğıöşü]\)\s/i.test(nextLine) ||
          /açıklanır|sıralanır|uygulanır|incelenir|belirlenir|yapılır|sınıflandırılır|karşılaştırılır|değerlendirilir|analiz\s*edilir|yorumlanır/i.test(
            nextLine
          )
        ) {
          block.push(nextLine);
        } else if (outcomeCodeRegex.test(nextLine)) {
          break;
        }
      }
      const joined = block.join("\n").trim();
      if (joined.length > 12 && !outcomeBlocks.includes(joined)) {
        outcomeBlocks.push(joined);
      }
      if (outcomeBlocks.length >= 15) break;
    }
  }

  const codeMatches =
    (text || "").match(
      /\b(?:SDB|KB|OB|AB|E|D)\d+(?:\.\d+)*\b/g
    ) || [];
  const maarifCodes = Array.from(new Set(codeMatches)).slice(0, 35);

  return { outcomeBlocks, maarifCodes };
}

function extractWeekWindowClient(
  yillikPlanText: string,
  haftaEtiketi: string,
  tarihAraligi: string
): string {
  const lines = (yillikPlanText || "").split(/\r?\n/);
  if (lines.length === 0) return "";

  const weekNumMatch = (haftaEtiketi || "").match(/(\d{1,2})/);
  const weekNum = weekNumMatch ? weekNumMatch[1] : "";
  const cleanDate = (tarihAraligi || "").trim();

  const matchIndices: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const hasExactWeek =
      weekNum &&
      new RegExp(`\\b${weekNum}\\s*\\.\\s*HAFTA\\b`, "i").test(line);
    const hasDate =
      cleanDate.length >= 4 &&
      line.toLowerCase().includes(cleanDate.toLowerCase());

    if (hasExactWeek || hasDate) {
      matchIndices.push(i);
    }
  }

  if (matchIndices.length === 0) {
    return lines.slice(0, 90).join("\n");
  }

  const windows: string[] = [];
  for (const idx of matchIndices.slice(0, 3)) {
    const start = Math.max(0, idx - 4);
    const end = Math.min(lines.length, idx + 45);
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
 * Full client-side contextual synthesizer:
 * Parses the full in-memory 'yillik_plan', 'ders_bilgi_formu', and 'ders_materyali' documents
 * directly in the browser if the network/reverse proxy ever times out or rejects a request.
 */
export function synthesizePlanClientSide(
  inputs: ClientSynthesisInput
): MaarifLessonPlan {
  const secilenHaftaEtiketi = (inputs.hafta_etiketi || "1. HAFTA").trim();
  const secilenTarihAraligi = (inputs.tarih_araligi || "").trim();

  const weekWindow = extractWeekWindowClient(
    inputs.yillik_plan,
    secilenHaftaEtiketi,
    secilenTarihAraligi
  );

  const dbfText = (inputs.ders_bilgi_formu || "").trim();
  const materyalText = (inputs.ders_materyali || "").trim();
  const combinedCurriculum = `${weekWindow}\n\n${dbfText}\n\n${inputs.yillik_plan}`;

  const weekIntel = extractOutcomesAndCodesClient(weekWindow);
  const dbfIntel = extractOutcomesAndCodesClient(dbfText);
  const fullIntel = extractOutcomesAndCodesClient(combinedCurriculum);

  const sinif =
    (inputs.sinif_duzeyi || "").trim() ||
    extractValueByLabelClient(combinedCurriculum, /\bsınıf(?:\s*düzeyi)?\b/i, 40) ||
    "9. SINIF";

  const ders =
    (inputs.ders_ismi || "").trim() ||
    extractValueByLabelClient(
      combinedCurriculum,
      /\bders(?:in)?\s*adı\b|\bders\b/i,
      90
    ) ||
    "MESLEK VE ATÖLYE DERSİ";

  const ogrenmeBirimi =
    inputs.secilen_hafta_verisi?.ogrenmeBirimi?.trim() ||
    extractValueByLabelClient(
      combinedCurriculum,
      /\böğrenme\s*birimi\b|\bünite(?:\/tema)?\b|\bmodül\b/i,
      120
    ) ||
    extractValueByLabelClient(materyalText, /\bünite\b|\bbölüm\b|\bkonu\b/i, 120) ||
    "Genel Öğrenme Birimi";

  const sureMatch =
    inputs.secilen_hafta_verisi?.sure?.trim() ||
    weekWindow.match(/\b(\d{1,2}\s*(?:Ders\s*)?Saat[i]?)\b/i)?.[1] ||
    extractValueByLabelClient(combinedCurriculum, /\bsüre\b|\bders\s*saati\b/i, 40) ||
    "3 Ders Saati";
  const sure = /saat/i.test(sureMatch) ? sureMatch : `${sureMatch} Ders Saati`;

  const abMatches =
    combinedCurriculum.match(
      /\bAB\d+(?:\.\d+)*\.?\s*[A-ZÇĞİÖŞÜa-zçğıöşü\s,()-]{3,80}/g
    ) || [];
  const alanBecerileri =
    extractValueByLabelClient(combinedCurriculum, /\balan\s*becerileri\b/i, 200) ||
    (abMatches.length > 0 ? abMatches.slice(0, 3).join(", ") : "") ||
    `${ogrenmeBirimi} alanında uygulama yapma`;

  const eMatches =
    combinedCurriculum.match(
      /\bE\d+\.\d+\.?\s*[A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,45}/g
    ) || [];
  const egilimler =
    extractValueByLabelClient(combinedCurriculum, /\beğilimler\b/i, 200) ||
    (eMatches.length > 0
      ? Array.from(new Set(eMatches.map((s) => s.trim()))).slice(0, 4).join(", ")
      : "E2.2. Sorumluluk, E3.2. Odaklanma");

  const sdbMatches =
    combinedCurriculum.match(
      /\bSDB\d+\.\d+\.?\s*[A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,55}/g
    ) || [];
  const sdb =
    extractValueByLabelClient(
      combinedCurriculum,
      /\bsosyal[-\s]*duygusal\s*öğr(?:enme|\.)?\s*bec(?:erileri|\.)?/i,
      220
    ) ||
    (sdbMatches.length > 0
      ? Array.from(new Set(sdbMatches.map((s) => s.trim()))).slice(0, 4).join(", ")
      : "SDB2.2. İş Birliği Becerisi, SDB3.3. Sorumlu Karar Verme Becerisi");

  const dMatches =
    combinedCurriculum.match(
      /\bD\d+(?:\.\d+)?\.?\s*[A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,35}/g
    ) || [];
  const degerler =
    extractValueByLabelClient(combinedCurriculum, /\bdeğerler\b/i, 200) ||
    (dMatches.length > 0
      ? Array.from(new Set(dMatches.map((s) => s.trim()))).slice(0, 5).join(", ")
      : "D12. Sabır, D16. Sorumluluk, D18. Temizlik");

  const obMatches =
    combinedCurriculum.match(
      /\bOB\d+(?:\.\d+)?\.?\s*[A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,45}/g
    ) || [];
  const okuryazarlik =
    extractValueByLabelClient(
      combinedCurriculum,
      /\bokuryazarlık\s*becerileri\b/i,
      200
    ) ||
    (obMatches.length > 0
      ? Array.from(new Set(obMatches.map((s) => s.trim()))).slice(0, 3).join(", ")
      : "OB1. Bilgi okuryazarlığı");

  const disiplinlerArasi =
    extractValueByLabelClient(
      combinedCurriculum,
      /\bdisiplinler\s*arası\s*ilişki(?:ler)?\b/i,
      160
    ) || "Fen Bilimleri";

  const kbMatches =
    combinedCurriculum.match(
      /\bKB\d+\.\d+\.?\s*[A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,60}/g
    ) || [];
  const becerilerArasi =
    extractValueByLabelClient(
      combinedCurriculum,
      /\bbeceriler\s*arası\s*ilişki(?:ler)?\b|\bkavramsal\s*beceriler\b/i,
      220
    ) ||
    (kbMatches.length > 0
      ? Array.from(new Set(kbMatches.map((s) => s.trim()))).slice(0, 4).join(", ")
      : "KB2.11. Gözleme Dayalı Tahmin Etme Becerisi, KB3.2. Problem Çözme Becerisi");

  const bestOutcomeBlock =
    weekIntel.outcomeBlocks[0] ||
    dbfIntel.outcomeBlocks[0] ||
    fullIntel.outcomeBlocks[0] ||
    inputs.secilen_hafta_verisi?.konuVeCiktiOzeti ||
    extractValueByLabelClient(
      combinedCurriculum,
      /\böğrenme\s*çıktıları(?:\s*ve\s*süreç\s*bileşenleri)?\b|\bkazanım(?:lar)?\b/i,
      400
    ) ||
    `${ogrenmeBirimi} ile ilgili temel kavram ve uygulama basamaklarını açıklar.\na) ${ogrenmeBirimi} kavramı açıklanır.\nb) Uygulama basamakları ve süreç bileşenleri sıralanır.`;

  const icerikCercevesi =
    extractValueByLabelClient(
      combinedCurriculum,
      /\biçerik\s*çerçevesi\b|\bkonu(?:\s*başlığı)?\b/i,
      180
    ) ||
    inputs.secilen_hafta_verisi?.konuVeCiktiOzeti?.split("|")[0]?.trim() ||
    ogrenmeBirimi;

  const extractedKanit = extractValueByLabelClient(
    combinedCurriculum,
    /\böğrenme\s*kanıtları\b|\bölçme\s*ve\s*değerlendirme\b/i,
    1200
  );
  const ogrenmeKanitlari =
    extractedKanit.length > 80
      ? extractedKanit
      : `Öğrenci performansını belirlemeye yönelik çalışmalar değerlendirilirken gözlem formu, akran değerlendirme, öz değerlendirme, derecelendirme ölçeği ve dereceli puanlama anahtarı (rubrik) gibi ölçme araçlarından uygun olanlar seçilerek kullanılabilir. "${icerikCercevesi}" konusu kapsamındaki uygulamalarda işlem basamakları gözlem formları ile takip edilebilir. Öz değerlendirme ve akran değerlendirme formları kullanılarak öğrencilerin öğretim sürecine aktif katılımları ve ekip çalışması becerileri değerlendirilebilir. Atölye, laboratuvar veya sınıf ortamında yapılacak uygulamalarda ölçme süreci, öğrencilerin iş sağlığı ve güvenliği kurallarına uygun davranmaları ve materyal kullanımlarına göre detaylandırılabilir. Bu ölçme yöntemleri, sürecin her aşamasında geri bildirim sağlamak ve öğrencilerin gelişimlerini sistematik bir şekilde izlemek için kullanılabilir.`;

  const temelKabuller =
    extractValueByLabelClient(combinedCurriculum, /\btemel\s*kabuller\b/i, 450) ||
    `Öğrencilerin "${ogrenmeBirimi}" ve "${icerikCercevesi}" konusuyla ilgili günlük yaşamdan temel kavramlara ve ön gözlemlere sahip oldukları kabul edilmektedir.`;

  const onDegerlendirme =
    extractValueByLabelClient(
      combinedCurriculum,
      /\bön\s*değerlendirme(?:\s*süreci)?\b/i,
      450
    ) ||
    `Öğrencilerin "${icerikCercevesi}" konusuyla ilgili temel kavramları tanımaları, önceki gözlemlerini paylaşmaları ve işlevleri hakkında bilgi vermeleri istenebilir.`;

  const kopruKurma =
    extractValueByLabelClient(combinedCurriculum, /\bköprü\s*kurma\b/i, 450) ||
    `Günlük yaşamda ve mesleki uygulamalarda karşılaşılan örnekler üzerinden "${ogrenmeBirimi}" ile "${icerikCercevesi}" arasındaki ilişki kurularak yeni öğrenilecek konuya geçiş yapılır.`;

  const materyalSentences = materyalText
    .split(/(?<=[.!?])\s+|\r?\n/)
    .map((s) => s.replace(/^[*•\-–\d.)\s]+/, "").trim())
    .filter((s) => s.length >= 35 && s.length <= 320);

  const codeSuffix =
    fullIntel.maarifCodes.length > 0
      ? `(${fullIntel.maarifCodes.slice(0, 8).join(", ")})`
      : "(KB2.11, E2.2, E3.2, D12, D16, D18, SDB2.2, SDB3.3, OB1)";

  const ogretmeUygulamalari: string[] = [
    `${ogrenmeBirimi} — ${icerikCercevesi}:`,
    ...materyalSentences.slice(0, 5),
    `Bu öğrenme birimi işlenirken öğrencilere farklı kaynaklardan "${icerikCercevesi}" konusu ve uygulama yöntemleri hakkında araştırma ve inceleme görevi verilir.`,
    `Gruplara ayrılan öğrencilerin uygulama işlemlerini iş birliği içinde yürütmeleri ve yaptıkları tüm gözlem ve işlemleri sistematik şekilde kayıt altına almaları sağlanır ${codeSuffix}.`,
    `Bu süreçte öz değerlendirme, akran değerlendirme formları ve dereceli puanlama anahtarı (rubrik) kullanılarak öğrencilerin araştırma, planlama, uygulama, iş birliği ve kayıt tutma becerileri değerlendirilebilir ${codeSuffix}.`,
  ].slice(0, 10);

  const guduleme: string[] = [
    `Bu derste "${ogrenmeBirimi}" öğrenme birimi kapsamında "${icerikCercevesi}" konusunun temel kavramlarını ve uygulama basamaklarını ayrıntılarıyla öğreneceksiniz.`,
    `Edineceğiniz bilgi ve beceriler sayesinde mesleki uygulamalarda doğru yöntem ve teknikleri seçerek verimli çalışmalar gerçekleştirebileceksiniz.`,
    `Ders materyalindeki örnek ve uygulamaları inceleyerek alanı bilinçli ve analitik bir gözle değerlendirme yetkinliği kazanacaksınız.`,
    `Burada kazanacağınız uygulama disiplini, mesleki süreçlerde karşılaştığınız problemleri güvenli ve etkili biçimde çözmenize katkı sağlayacaktır.`,
  ];

  const dikkatCekme: string[] = [
    `Günlük yaşamda veya mesleki uygulamalarda "${icerikCercevesi}" konusunun neden kritik bir öneme sahip olduğunu hiç düşündünüz mü?`,
    `"${ogrenmeBirimi}" süreçlerinde doğru yöntem ve materyal seçimi yapılmadığında hangi sorunlarla karşılaşılabilir?`,
    `Çevrenizde gözlemlediğiniz örneklerde "${icerikCercevesi}" ile ilgili hangi temel özellikler dikkatinizi çekmektedir?`,
    `Bir uygulamanın başarılı ve verimli sonuç vermesi için öncelikle hangi aşamaların eksiksiz yerine getirilmesi gerekir?`,
  ];

  const ekOgretmeUygulamalari: string[] = [
    `Sınıf, laboratuvar veya atölye ortamına getirilen "${icerikCercevesi}" ile ilgili örnek materyal ve görseller incelenerek temel kısımları öğrencilere tanıtılabilir (E3.2, OB1).`,
    `Öğrencilerin "${icerikCercevesi}" kapsamındaki kavram ve özellikleri karşılaştırmaları için hazırlanan eşleştirme kartları veya şemalar üzerinde çalışma yapılabilir (KB2.11).`,
    `Ders materyalinde yer alan temel kavramlar ve işlem basamakları şematik çizimler ve etkileşimli sunumlar üzerinden açıklanabilir (OB1).`,
    `Öğrenciler küçük çalışma gruplarına ayrılarak "${icerikCercevesi}" konusuyla ilgili topladıkları örnekleri sınıflandırıp arkadaşlarına sunabilirler (SDB2.2, E2.2).`,
    `Atölye veya laboratuvar ortamında iş sağlığı, güvenliği ve temiz çalışma kurallarına özen gösterilerek uygulamalı inceleme çalışması yaptırılabilir (D16, D18).`,
  ];

  const farklilastirma =
    extractValueByLabelClient(
      combinedCurriculum,
      /\bfarklılaştırma\b|\bzenginleştirme\b|\bdestekleme\b/i,
      500
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
