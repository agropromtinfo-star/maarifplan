import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { extractText } from "unpdf";
import { YillikPlanWeekItem } from "../types/lessonPlan";

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

function inferApprovalDate(dateRange: string, defaultYear = 2026): string {
  const lower = dateRange.toLowerCase();
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
  const lines = text
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
        let datePart = (m[2] || "").trim();
        if (
          !datePart &&
          lines[i + 1] &&
          /\d{1,2}\s*[-–]\s*\d{1,2}/.test(lines[i + 1])
        ) {
          datePart = lines[i + 1].trim();
        }
        const contextSlice = lines.slice(i, i + 5).join(" | ");
        weeks.push({
          id: `week-${wNo}`,
          haftaNo: wNo,
          haftaEtiketi: `${wNo}. HAFTA`,
          tarihAraligi: datePart || `${wNo}. Hafta`,
          onayTarihi: inferApprovalDate(datePart),
          ogrenmeBirimi: "",
          konuVeCiktiOzeti: contextSlice.slice(0, 180),
          sure: "",
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

  // Many MEB .doc files are actually HTML or XML saved with .doc extension
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

  // Extract printable Turkish/ASCII text runs from binary .doc
  const printableChunks =
    rawUtf8.match(
      /[A-Za-z0-9ÇĞİÖŞÜçğıöşü.,;:!?()[\]\-–/\s]{6,}/g
    ) || [];
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

  // 1. Try client-side extraction first (works up to 40 MB with zero network latency)
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

  // 2. Fallback to server-side /api/extract-file (e.g., for scanned PDFs via Gemini OCR or server parsers)
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/extract-file", {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      if (response.ok && typeof data.text === "string" && data.text.trim()) {
        return {
          text: data.text.trim(),
          quickWeeks: Array.isArray(data.quickWeeks)
            ? data.quickWeeks
            : parseQuickWeeksClient(data.text),
          method: "server",
        };
      }
    }
  } catch (serverErr) {
    console.warn("Server fallback warning:", serverErr);
  }

  // 3. Ensure the user's file is still accepted even if it's a scanned image-heavy document
  const fallbackText =
    extractedText ||
    `[Yüklenen Dosya: ${file.name}]\nNot: Bu dosya görsel/taranmış ağırlıklı bir doküman olarak algılandı. Plan üretimi sırasında seçilen hafta ve ders bilgileriyle işlenecektir.`;

  return {
    text: fallbackText,
    quickWeeks: parseQuickWeeksClient(fallbackText),
    method: "client",
  };
}
