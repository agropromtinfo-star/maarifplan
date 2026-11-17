import "dotenv/config";
import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { extractText } from "unpdf";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import {
  parseDersBilgiFormuStructured,
  extractWeekPlanStructured,
  extractWeekMateryalSlice,
  enforceAndMergeLessonPlan,
  splitOgretmeUygulamalariIntoBullets,
  extractDateRangeFromText,
  resolveValidDateRange,
  stripFrontMatter,
  sanitizeOutcomeOrSubSentence,
  deriveUnitNameFromOutcome,
  extractWeeklyMaterialSummaryBox,
  applyBlacklistAndDensityFilter,
  WeekSpecificExtraction,
} from "./src/shared/maarifPlanEngine";
import { MaarifLessonPlan } from "./src/types/lessonPlan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_FILE_SIZE_BYTES = 40 * 1024 * 1024; // 40 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

const SYSTEM_INSTRUCTION = `Sen uzman bir meslek ve kültür dersleri öğretmenisin ve MEB Türkiye Yüzyılı Maarif Modeli öğretim programları konusunda uzmansın.
Sana her çağrıda 3 kaynak doküman açık XML-benzeri bağlam etiketleriyle sunulmaktadır:
1) <yillik_plan>: Ünitelendirilmiş Yıllık Plan tablosudur. ÖNCE <hedef_hafta_ve_ust_bilgiler> içindeki <hafta_etiketi> ve <tarih_araligi> bilgisini <yillik_plan> tablosunda bul ve teyit et. O hafta ve tarih aralığına karşılık gelen Öğrenme Birimi, Süre, İçerik Çerçevesi ve o haftada işlenecek TÜM Öğrenme Çıktıları ile alt süreç bileşenlerini (a, b, c, ç, d, e...) hiçbir harfi veya cümleyi eksik bırakmadan eksiksiz çıkar.
2) <ders_bilgi_formu>: Resmi MEB Ders Bilgi Formu verileridir. <ogrenme_ciktilari_ve_surec_bilesenleri_katalogu> içindeki tam öğrenme çıktısı ve süreç bileşeni cümleleriyle <yillik_plan> içindeki haftalık kazanımları eşleştirerek 100% tam metin olarak yaz. Ayrıca Alan Becerileri, Eğilimler, SDB, Değerler, OB, Disiplinler Arası İlişki, KB, Öğrenme Kanıtları, Temel Kabuller, Ön Değerlendirme Süreci, Köprü Kurma ve Öğretme Uygulamaları bölümlerini birebir koru.
3) <ders_materyali>: Seçilen haftanın süreç bileşenlerine ait Ders Kitabı / Ders Materyali konu anlatımı kesitidir.

GÖREVİN VE KESİN KURALLAR:
- Tarih ve Hafta Aralığı Teyidi: <yillik_plan> tablosunda seçilen hafta numarasını VE tarih aralığını dikkatle kontrol et; başka bir haftanın kazanımlarını karıştırma ve seçilen haftanın hiçbir alt süreç bileşenini (a, b, c, ç, d, e...) eksik bırakma.
- 'Ogrenme_Ciktilari_ve_Surec_Bilesenleri' alanına önce ana öğrenme çıktısı kodunu ve tam cümlesini (örn: "ST.1.1. Onarıcı tarımın ilkelerini açıklar."), alt satırlara ise o hafta ve tarih aralığında yer alan tüm harfli süreç bileşenlerini ("a) ...", "b) ..." vb.) tam cümle halinde yaz.
- <yillik_plan> içindeki seçilen haftanın Süreç Bileşenlerine ve <ders_materyali> içindeki konu anlatımına dayanarak o haftaya özel şu 3 bölümü en yüksek pedagojik kalitede üret:
  1) 'Guduleme' (4 madde):
     - İlk madde mutlaka "Bu derste ... öğreneceksiniz." ile başlamalıdır.
     - Diğer 3 madde "... kavrayacaksınız.", "... keşfedeceksiniz.", "... kazanacaksınız." gibi gelecek zaman kipiyle doğrudan öğrenciye hitap etmeli ve SADECE o haftanın süreç bileşenlerini/konusunu anlatmalıdır.
  2) 'Dikkat_Cekme' (4 madde):
     - Doğrudan o haftanın <ders_materyali> konusuna ve süreç bileşenlerine yönelik, öğrencide merak uyandıran 4 özgün soru cümlesi ('?' ile biten) olmalıdır.
  3) 'Ek_Ogretme_Uygulamalari' (6 madde):
     - O haftanın <ders_materyali> konusunun sınıfta, laboratuvarda veya atölyede nasıl işleneceğini anlatan 6 somut uygulama maddesi olmalıdır.
     - HER MADDENİN SONUNDA mutlaka <aktif_maarif_kodlari> içinden seçilmiş 2 veya 3 kod parantez içinde yazılmalıdır (Örn: "(OB1, KB2.2).", "(OB8, E1.4).").`;

const PRE_DELIVERY_VERIFICATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    Tarih_ve_Hafta_Uyumlu_Mu: { type: Type.BOOLEAN },
    Dogrulanan_Hafta_Etiketi: { type: Type.STRING },
    Dogrulanan_Tarih_Araligi: { type: Type.STRING },
    Dogrulanan_Ogrenme_Birimi: { type: Type.STRING },
    Dogrulanan_Icerik_Cercevesi: { type: Type.STRING },
    Eksiksiz_Ogrenme_Ciktilari_ve_Surec_Bilesenleri: { type: Type.STRING },
    Teyit_Ozeti: { type: Type.STRING },
  },
  required: [
    "Tarih_ve_Hafta_Uyumlu_Mu",
    "Dogrulanan_Hafta_Etiketi",
    "Dogrulanan_Tarih_Araligi",
    "Dogrulanan_Ogrenme_Birimi",
    "Dogrulanan_Icerik_Cercevesi",
    "Eksiksiz_Ogrenme_Ciktilari_ve_Surec_Bilesenleri",
    "Teyit_Ozeti",
  ],
};

const LESSON_PLAN_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    Ders_Bilgisi: {
      type: Type.OBJECT,
      properties: {
        Sinif: { type: Type.STRING },
        Ders: { type: Type.STRING },
        Ogrenme_Birimi: { type: Type.STRING },
        Sure: { type: Type.STRING },
        Alan_Becerileri: { type: Type.STRING },
        Egilimler: { type: Type.STRING },
      },
      required: [
        "Sinif",
        "Ders",
        "Ogrenme_Birimi",
        "Sure",
        "Alan_Becerileri",
        "Egilimler",
      ],
    },
    Programlar_Arasi_Bilesenler: {
      type: Type.OBJECT,
      properties: {
        Sosyal_Duygusal_Ogrenme_Becerileri: { type: Type.STRING },
        Degerler: { type: Type.STRING },
        Okuryazarlik_Becerileri: { type: Type.STRING },
        Disiplinler_Arasi_Iliski: { type: Type.STRING },
        Beceriler_Arasi_Iliski: { type: Type.STRING },
      },
      required: [
        "Sosyal_Duygusal_Ogrenme_Becerileri",
        "Degerler",
        "Okuryazarlik_Becerileri",
        "Disiplinler_Arasi_Iliski",
        "Beceriler_Arasi_Iliski",
      ],
    },
    Ogrenme_Ciktilari_ve_Surec_Bilesenleri: { type: Type.STRING },
    Icerik_Cercevesi: { type: Type.STRING },
    Ogrenme_Kanitlari: { type: Type.STRING },
    Ogrenme_Ogretme_Yasantilari: {
      type: Type.OBJECT,
      properties: {
        Temel_Kabuller: { type: Type.STRING },
        On_Degerlendirme_Sureci: { type: Type.STRING },
        Kopru_Kurma: { type: Type.STRING },
        Ogretme_Uygulamalari: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        Guduleme: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        Dikkat_Cekme: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        Ek_Ogretme_Uygulamalari: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: [
        "Temel_Kabuller",
        "On_Degerlendirme_Sureci",
        "Kopru_Kurma",
        "Ogretme_Uygulamalari",
        "Guduleme",
        "Dikkat_Cekme",
        "Ek_Ogretme_Uygulamalari",
      ],
    },
    Farklilastirma: { type: Type.STRING },
  },
  required: [
    "Ders_Bilgisi",
    "Programlar_Arasi_Bilesenler",
    "Ogrenme_Ciktilari_ve_Surec_Bilesenleri",
    "Icerik_Cercevesi",
    "Ogrenme_Kanitlari",
    "Ogrenme_Ogretme_Yasantilari",
    "Farklilastirma",
  ],
};

const WEEKS_EXTRACTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    okulAdi: { type: Type.STRING },
    dersIsmi: { type: Type.STRING },
    sinifDuzeyi: { type: Type.STRING },
    egitimOgretimYili: { type: Type.STRING },
    weeks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          haftaNo: { type: Type.INTEGER },
          haftaEtiketi: { type: Type.STRING },
          tarihAraligi: { type: Type.STRING },
          onayTarihi: { type: Type.STRING },
          ogrenmeBirimi: { type: Type.STRING },
          konuVeCiktiOzeti: { type: Type.STRING },
          sure: { type: Type.STRING },
        },
        required: [
          "haftaNo",
          "haftaEtiketi",
          "tarihAraligi",
          "onayTarihi",
          "ogrenmeBirimi",
          "konuVeCiktiOzeti",
          "sure",
        ],
      },
    },
  },
  required: ["okulAdi", "dersIsmi", "sinifDuzeyi", "egitimOgretimYili", "weeks"],
};

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
  const lower = (dateRange || "").toLocaleLowerCase("tr-TR");
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

function parseWeeksRegexFallback(text: string) {
  const lines = stripFrontMatter(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const weeks: Array<{
    id: string;
    haftaNo: number;
    haftaEtiketi: string;
    tarihAraligi: string;
    onayTarihi: string;
    ogrenmeBirimi: string;
    konuVeCiktiOzeti: string;
    sure: string;
  }> = [];

  const seenWeeks = new Set<number>();
  let activeUnitCarryover = "";
  let activeOutcomeCarryover = "";
  const outcomeRegex =
    /\b([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?\.?\s+([^|]{6,140})/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matches = line.matchAll(
      /(?:\b(\d{1,2})\s*\.\s*HAFTA\b|\bHAFTA\s*[:|-]?\s*(\d{1,2})\b)/gi
    );
    for (const m of matches) {
      const wNo = Number(m[1] || m[2]);
      if (wNo >= 1 && wNo <= 42 && !seenWeeks.has(wNo)) {
        seenWeeks.add(wNo);
        let nextWeekIdx = lines.length;
        for (let k = i + 1; k < Math.min(lines.length, i + 15); k++) {
          if (/\b\d{1,2}\s*\.\s*HAFTA\b/i.test(lines[k])) {
            nextWeekIdx = k;
            break;
          }
        }
        const prevLine = i > 0 ? lines[i - 1] : "";
        let datePart =
          extractDateRangeFromText(line) ||
          extractDateRangeFromText(prevLine);
        if (!datePart) {
          const safeEnd =
            nextWeekIdx < lines.length
              ? Math.max(i + 1, nextWeekIdx - 1)
              : Math.min(lines.length, i + 3);
          datePart = extractDateRangeFromText(lines.slice(i, safeEnd).join(" "));
        }
        datePart = resolveValidDateRange(datePart, wNo);

        const rowEnd =
          nextWeekIdx < lines.length &&
          nextWeekIdx - 1 > i &&
          extractDateRangeFromText(lines[nextWeekIdx - 1])
            ? nextWeekIdx - 1
            : Math.min(lines.length, nextWeekIdx);
        const blockLines = lines.slice(i, rowEnd);
        const contextSlice = blockLines.join(" | ");

        const sureMatch = contextSlice.match(
          /\b(\d{1,2})\s*(?:Ders\s*)?Saat[i]?\b/i
        );
        const sure = sureMatch ? `${sureMatch[1]} Ders Saati` : "";

        let weekOutcome = "";
        for (const bLine of blockLines) {
          const om = bLine.match(outcomeRegex);
          if (om && !/^(?:SDB|KB|OB|AB|E|D)$/i.test(om[1])) {
            weekOutcome = sanitizeOutcomeOrSubSentence(om[0]);
            if (weekOutcome.length >= 8) {
              activeOutcomeCarryover = weekOutcome;
              break;
            }
          }
        }
        const displayOutcome = weekOutcome || activeOutcomeCarryover;
        const derivedUnit = displayOutcome
          ? deriveUnitNameFromOutcome(displayOutcome)
          : "";
        if (derivedUnit) {
          activeUnitCarryover = derivedUnit;
        }

        weeks.push({
          id: `week-${wNo}`,
          haftaNo: wNo,
          haftaEtiketi: `${wNo}. HAFTA`,
          tarihAraligi: datePart,
          onayTarihi: inferApprovalDate(datePart),
          ogrenmeBirimi: derivedUnit || activeUnitCarryover || "",
          konuVeCiktiOzeti: (displayOutcome || contextSlice).slice(0, 200),
          sure,
        });
      }
    }
  }

  return weeks.sort((a, b) => a.haftaNo - b.haftaNo);
}

async function generateWithFallback(
  apiKey: string,
  contents: string | Array<{ text: string }>,
  systemInstruction: string,
  responseSchema: unknown
): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey,
    apiVersion: "v1beta",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
      retryOptions: { attempts: 1 },
      timeout: 22000,
    },
  });

  const candidateModels = [
    { name: "gemini-4-hydrogen", useThinkingConfig: true, maxMs: 21000 },
    { name: "gemini-3.1-flash-lite", useThinkingConfig: false, maxMs: 14000 },
    { name: "gemini-3-flash-preview", useThinkingConfig: true, maxMs: 14000 },
  ];

  let lastError: unknown = null;

  for (const candidate of candidateModels) {
    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: candidate.name,
          contents,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema,
            ...(candidate.useThinkingConfig
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
              : {}),
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error(`Model ${candidate.name} timed out`)),
            candidate.maxMs
          )
        ),
      ]);

      const rawText = (response.text ?? "").trim();
      if (rawText) {
        return rawText;
      }
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Gemini API] Model ${candidate.name} failed: ${msg}`);

      if (msg.includes("API_KEY_INVALID")) {
        throw err;
      }
    }
  }

  throw lastError ?? new Error("Yapay zeka servisine şu anda ulaşılamıyor.");
}

function extractXmlTag(xmlString: string, tagName: string): string {
  const regex = new RegExp(
    `<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`,
    "i"
  );
  const match = xmlString.match(regex);
  return match ? match[1].trim() : "";
}

async function startServer() {
  const app = express();
  const portArgIndex = process.argv.indexOf("--port");
  const cliPort =
    portArgIndex !== -1 && process.argv[portArgIndex + 1]
      ? Number(process.argv[portArgIndex + 1])
      : 0;
  const envPort =
    process.env.PORT && process.env.PORT !== process.env.NGINX_PORT
      ? Number(process.env.PORT)
      : 0;
  const PORT =
    cliPort ||
    (process.env.NODE_ENV === "production" ? envPort || 3000 : 3000);

  app.use(express.json({ limit: "50mb" }));
  app.use(
    express.text({
      type: ["text/plain", "application/xml", "text/xml"],
      limit: "50mb",
    })
  );

  // File extraction endpoint supporting PDF, DOCX, DOC, XLSX (up to 40 MB)
  app.post("/api/extract-file", (req, res) => {
    upload.single("file")(req, res, async (uploadErr) => {
      if (uploadErr) {
        if (
          uploadErr instanceof multer.MulterError &&
          uploadErr.code === "LIMIT_FILE_SIZE"
        ) {
          res.status(413).json({
            error:
              "Yüklenen dosya 40 MB sınırını aşmaktadır. Lütfen en fazla 40 MB boyutunda bir dosya seçin.",
          });
          return;
        }
        res.status(400).json({
          error: `Dosya yükleme hatası: ${uploadErr.message || "Bilinmeyen hata"}`,
        });
        return;
      }

      const file = req.file;
      if (!file) {
        res.status(400).json({
          error: "Yüklenecek dosya bulunamadı.",
        });
        return;
      }

      const originalName = file.originalname || "";
      const ext = path.extname(originalName).toLowerCase();

      try {
        let finalExtractedText = "";

        if (ext === ".pdf" || file.mimetype === "application/pdf") {
          const uint8 = new Uint8Array(file.buffer);
          const { text } = await extractText(uint8, { mergePages: true });
          finalExtractedText = (
            Array.isArray(text) ? text.join("\n\n") : text || ""
          ).trim();
        } else if (
          ext === ".docx" ||
          file.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          finalExtractedText = (result.value || "").trim();
        } else if (
          ext === ".xlsx" ||
          ext === ".xls" ||
          file.mimetype ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.mimetype === "application/vnd.ms-excel"
        ) {
          const workbook = XLSX.read(file.buffer, { type: "buffer" });
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
                    cell !== null && cell !== undefined
                      ? String(cell).trim()
                      : ""
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

          finalExtractedText = sheetTexts.join("\n\n").trim();
        } else if (
          ext === ".doc" ||
          ext === ".rtf" ||
          file.mimetype === "application/msword"
        ) {
          const rawUtf8 = file.buffer.toString("utf-8");
          if (/<html|<table|<body|<p\b|<w:/i.test(rawUtf8)) {
            finalExtractedText = rawUtf8
              .replace(/<style[\s\S]*?<\/style>/gi, " ")
              .replace(/<script[\s\S]*?<\/script>/gi, " ")
              .replace(/<\/(tr|p|div|li|h[1-6])>/gi, "\n")
              .replace(/<\/(td|th)>/gi, " | ")
              .replace(/<[^>]+>/g, " ")
              .replace(/&nbsp;/gi, " ")
              .replace(/[ \t]+/g, " ")
              .replace(/\n\s*\n+/g, "\n")
              .trim();
          } else {
            const printableChunks =
              rawUtf8.match(
                /[A-Za-z0-9ÇĞİÖŞÜçğıöşü.,;:!?()[\]\-–/\s]{6,}/g
              ) || [];
            finalExtractedText = printableChunks
              .map((c) => c.trim())
              .filter(
                (c) => c.length >= 6 && /[A-Za-zÇĞİÖŞÜçğıöşü]{3,}/.test(c)
              )
              .join("\n")
              .trim();
          }
        } else if (
          [".txt", ".md", ".csv"].includes(ext) ||
          file.mimetype.startsWith("text/")
        ) {
          finalExtractedText = file.buffer.toString("utf-8").trim();
        } else {
          res.status(400).json({
            error:
              "Desteklenmeyen dosya formatı. Lütfen .pdf, .docx, .doc veya .xlsx formatında bir dosya yükleyin.",
          });
          return;
        }

        const quickWeeks = parseWeeksRegexFallback(finalExtractedText);

        res.json({
          text:
            finalExtractedText ||
            "Dosyadan metin okunamadı (görsel tabanlı veya şifreli olabilir).",
          fileName: originalName,
          sizeBytes: file.size,
          quickWeeks,
        });
      } catch (parseErr: unknown) {
        console.error("File extraction error:", parseErr);
        const msg =
          parseErr instanceof Error
            ? parseErr.message
            : "Dosya içeriği okunurken bir hata oluştu.";
        res.status(500).json({
          error: `Dosya çözümlenemedi (${originalName}): ${msg}`,
        });
      }
    });
  });

  // Endpoint to extract structured weeks and dates from uploaded Yıllık Plan
  app.post("/api/parse-weeks", async (req, res) => {
    try {
      const rawBody = req.body;
      const yillik_plan =
        typeof rawBody === "string"
          ? extractXmlTag(rawBody, "yillik_plan") || rawBody
          : String((rawBody as Record<string, unknown>)?.yillik_plan || "");

      if (!yillik_plan.trim()) {
        res.status(400).json({
          error:
            "Hafta ve tarihlerin çıkarılması için önce Yıllık Plan yükleyin.",
        });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        const fallback = parseWeeksRegexFallback(yillik_plan);
        res.json({ weeks: fallback });
        return;
      }

      const weekPrompt = `<gorev>Aşağıdaki <yillik_plan> etiketi içindeki MEB Ünitelendirilmiş Yıllık Plan metnini incele ve planda yer alan tüm haftaları, tarih aralıklarını (örn: "14 - 18 Eylül"), her haftanın ilk gününe karşılık gelen GG/AA/YYYY onay tarihini (örn: "14/09/2026"), öğrenme birimini, o haftanın Öğrenme Çıktısı / Kazanım kodu ve cümlesi ile altındaki a), b), c) süreç bileşenlerini ve ders saati süresini sırasıyla çıkar. Ayrıca yıllık plan başlığında okul adı, ders ismi ve sınıf düzeyi varsa onları da çıkar.</gorev>\n\n<yillik_plan>\n${yillik_plan.slice(
        0,
        45000
      )}\n</yillik_plan>`;

      const rawJson = await generateWithFallback(
        apiKey,
        weekPrompt,
        "Sen MEB Ünitelendirilmiş Yıllık Plan tablolarından hafta, tarih aralığı, öğrenme birimi ve öğrenme çıktısı (kazanım ve a, b, c süreç bileşenleri) listesini birebir çıkaran bir uzmansın.",
        WEEKS_EXTRACTION_SCHEMA
      );

      const parsed = JSON.parse(rawJson);
      const regexWeeks = parseWeeksRegexFallback(yillik_plan);
      const aiWeeks: typeof regexWeeks = Array.isArray(parsed.weeks)
        ? parsed.weeks.map((w: Record<string, unknown>, idx: number) => ({
            id: `week-${w.haftaNo || idx + 1}`,
            haftaNo: Number(w.haftaNo) || idx + 1,
            haftaEtiketi: String(w.haftaEtiketi || `${idx + 1}. HAFTA`),
            tarihAraligi: String(w.tarihAraligi || ""),
            onayTarihi: String(
              w.onayTarihi || inferApprovalDate(String(w.tarihAraligi || ""))
            ),
            ogrenmeBirimi: String(w.ogrenmeBirimi || ""),
            konuVeCiktiOzeti: String(w.konuVeCiktiOzeti || ""),
            sure: String(w.sure || ""),
          }))
        : [];

      const allWeekNos = Array.from(
        new Set([
          ...regexWeeks.map((rw) => rw.haftaNo),
          ...aiWeeks.map((aw) => aw.haftaNo),
        ])
      )
        .filter((n) => n >= 1 && n <= 42)
        .sort((a, b) => a - b);

      const weeks =
        allWeekNos.length > 0
          ? allWeekNos.map(
              (wNo) =>
                aiWeeks.find((aw) => aw.haftaNo === wNo) ||
                regexWeeks.find((rw) => rw.haftaNo === wNo)!
            )
          : regexWeeks;

      res.json({
        okulAdi: parsed.okulAdi || "",
        dersIsmi: parsed.dersIsmi || "",
        sinifDuzeyi: parsed.sinifDuzeyi || "",
        egitimOgretimYili: parsed.egitimOgretimYili || "",
        weeks,
      });
    } catch (err: unknown) {
      console.warn("AI week extraction fallback to regex:", err);
      const rawBody = req.body;
      const yillik_plan =
        typeof rawBody === "string"
          ? extractXmlTag(rawBody, "yillik_plan") || rawBody
          : String((rawBody as Record<string, unknown>)?.yillik_plan || "");
      res.json({ weeks: parseWeeksRegexFallback(yillik_plan) });
    }
  });

  // Main endpoint to generate MEB Türkiye Yüzyılı Maarif Modeli Daily Lesson Plan
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const body = req.body;
      const isXmlString = typeof body === "string" && body.includes("<");

      const yillik_plan = isXmlString
        ? extractXmlTag(body, "yillik_plan")
        : String((body as Record<string, unknown>)?.yillik_plan || "");
      const ders_materyali = isXmlString
        ? extractXmlTag(body, "ders_materyali")
        : String((body as Record<string, unknown>)?.ders_materyali || "");
      const ders_bilgi_formu = isXmlString
        ? extractXmlTag(body, "ders_bilgi_formu")
        : String((body as Record<string, unknown>)?.ders_bilgi_formu || "");

      const hafta_etiketi = isXmlString
        ? extractXmlTag(body, "hafta_etiketi") ||
          extractXmlTag(body, "secilen_hafta") ||
          "1. HAFTA"
        : String((body as Record<string, unknown>)?.hafta_etiketi || "1. HAFTA");
      const tarih_araligi = isXmlString
        ? extractXmlTag(body, "tarih_araligi") ||
          extractXmlTag(body, "hafta_tarihi")
        : String((body as Record<string, unknown>)?.tarih_araligi || "");
      const ders_ismi = isXmlString
        ? extractXmlTag(body, "ders_ismi")
        : String((body as Record<string, unknown>)?.ders_ismi || "");
      const sinif_duzeyi = isXmlString
        ? extractXmlTag(body, "sinif_duzeyi")
        : String((body as Record<string, unknown>)?.sinif_duzeyi || "");

      if (!yillik_plan.trim()) {
        res.status(400).json({
          error:
            "Ünitelendirilmiş Yıllık Plan metni zorunludur. Lütfen ilgili alanı doldurun veya dosya yükleyin.",
        });
        return;
      }

      if (!ders_materyali.trim()) {
        res.status(400).json({
          error:
            "Ders Materyali metni zorunludur. Lütfen konu/modül içeriğini girin veya dosya yükleyin.",
        });
        return;
      }

      // 1. Extract full table and catalog sub-tags if XML package was sent
      const rawYillikTableFromXml = isXmlString
        ? extractXmlTag(body, "yillik_plan_tam_tablo_metni") ||
          extractXmlTag(body, "secilen_hafta_ham_kesiti") ||
          yillik_plan
        : yillik_plan;

      const rawOutcomesCatalogFromXml = isXmlString
        ? extractXmlTag(body, "ogrenme_ciktilari_ve_surec_bilesenleri_katalogu")
        : "";
      const rawDbfTextFromXml = isXmlString
        ? extractXmlTag(body, "ders_bilgi_formu_ham_metin") || ders_bilgi_formu
        : ders_bilgi_formu;

      const dbfForParsing = rawOutcomesCatalogFromXml
        ? `${rawDbfTextFromXml}\nÖĞRENME ÇIKTILARI VE SÜREÇ BİLEŞENLERİ:\n${rawOutcomesCatalogFromXml}`
        : rawDbfTextFromXml;

      const structuredDbf = parseDersBilgiFormuStructured(
        dbfForParsing,
        rawYillikTableFromXml,
        ders_materyali
      );

      if (isXmlString) {
        const preKanitlar = extractXmlTag(body, "ogrenme_kanitlari_tam_metin");
        if (
          preKanitlar &&
          preKanitlar.length > structuredDbf.ogrenmeKanitlari.length
        ) {
          structuredDbf.ogrenmeKanitlari = preKanitlar;
        }
        const preKabuller = extractXmlTag(body, "temel_kabuller_tam_metin");
        if (
          preKabuller &&
          preKabuller.length > structuredDbf.temelKabuller.length
        ) {
          structuredDbf.temelKabuller = preKabuller;
        }
        const preOnDeg = extractXmlTag(
          body,
          "on_degerlendirme_sureci_tam_metin"
        );
        if (
          preOnDeg &&
          preOnDeg.length > structuredDbf.onDegerlendirmeSureci.length
        ) {
          structuredDbf.onDegerlendirmeSureci = preOnDeg;
        }
        const preKopru = extractXmlTag(body, "kopru_kurma_tam_metin");
        if (preKopru && preKopru.length > structuredDbf.kopruKurma.length) {
          structuredDbf.kopruKurma = preKopru;
        }
        const preFark = extractXmlTag(body, "farklilastirma_tam_metin");
        if (preFark && preFark.length > structuredDbf.farklilastirma.length) {
          structuredDbf.farklilastirma = preFark;
        }
      }

      const weekData = extractWeekPlanStructured(
        rawYillikTableFromXml,
        hafta_etiketi,
        tarih_araligi,
        structuredDbf
      );

      if (isXmlString) {
        const preOutcomeBlock = extractXmlTag(
          body,
          "secilen_hafta_ogrenme_ciktilari_ve_surec_bilesenleri"
        );
        if (
          preOutcomeBlock &&
          preOutcomeBlock.length > weekData.formattedOutcomeAndProcessBlock.length
        ) {
          weekData.formattedOutcomeAndProcessBlock = preOutcomeBlock;
        }
        const preRawWeekWindow = extractXmlTag(
          body,
          "secilen_hafta_ham_kesiti"
        );
        if (
          preRawWeekWindow &&
          preRawWeekWindow.length > weekData.rawWeekWindowText.length
        ) {
          weekData.rawWeekWindowText = preRawWeekWindow;
        }
        const preUnit = extractXmlTag(body, "secilen_hafta_ogrenme_birimi");
        if (preUnit && preUnit.length >= 3 && !/VE\s*SÜRE/i.test(preUnit)) {
          weekData.ogrenmeBirimi = preUnit;
        }
        const preIcerik = extractXmlTag(body, "secilen_hafta_icerik_cercevesi");
        if (
          preIcerik &&
          preIcerik.length >= 3 &&
          !/^\d+\s*\.\s*hafta$/i.test(preIcerik)
        ) {
          weekData.icerikCercevesi = preIcerik;
        }
        const preUygulamalar = extractXmlTag(
          body,
          "ogretme_uygulamalari_secilen_birim"
        );
        if (preUygulamalar && preUygulamalar.length >= 20) {
          weekData.unitOgretmeUygulamalari = preUygulamalar
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean);
        } else if (weekData.unitOgretmeUygulamalari.length === 0) {
          const fallbackSplit = splitOgretmeUygulamalariIntoBullets(
            preUygulamalar,
            weekData.ogrenmeBirimi
          );
          if (fallbackSplit.length > 0) {
            weekData.unitOgretmeUygulamalari = fallbackSplit;
          }
        }
      }

      const materyalSlice = extractWeekMateryalSlice(
        ders_materyali,
        weekData,
        9000
      );

      const apiKey = process.env.GEMINI_API_KEY;
      let aiCandidatePlan: Record<string, unknown> | null = null;
      let verificationSummary =
        "Deterministik Maarif motoru ve doküman katalog eşleştirmesi ile doğrulandı.";

      const effectiveTarihAraligi = weekData.tarihAraligi || tarih_araligi;
      const outcomesCatalogText =
        structuredDbf.rawOutcomesCatalogText ||
        rawOutcomesCatalogFromXml ||
        weekData.formattedOutcomeAndProcessBlock;

      if (apiKey) {
        try {
          // AŞAMA 1: XML Bağlam Paketi ile Plan Üretimi (Tam Yıllık Plan Kesiti + Ders Bilgi Formu Kazanım Kataloğu Dahil)
          const xmlPromptForGemini = `<ders_plani_baglam_paketi>
<hedef_hafta_ve_ust_bilgiler>
  <sinif>${sinif_duzeyi || structuredDbf.sinif}</sinif>
  <ders>${ders_ismi || structuredDbf.ders}</ders>
  <hafta_etiketi>${weekData.haftaEtiketi}</hafta_etiketi>
  <tarih_araligi>${effectiveTarihAraligi}</tarih_araligi>
  <sure>${weekData.sure}</sure>
</hedef_hafta_ve_ust_bilgiler>

<yillik_plan baglam="Bu metin Ünitelendirilmiş Yıllık Plandır. Hedeflenen hafta (${weekData.haftaEtiketi}) ve tarih aralığı (${effectiveTarihAraligi}) satırını dikkatle incele. O hafta/tarih aralığındaki Öğrenme Birimi, İçerik Çerçevesi ve o haftaya ait TÜM Öğrenme Çıktıları ve Süreç Bileşenlerini (a, b, c, ç, d, e...) hiçbir maddeyi atlamadan çıkar.">
  <tespit_edilen_ogrenme_birimi>${weekData.ogrenmeBirimi}</tespit_edilen_ogrenme_birimi>
  <tespit_edilen_icerik_cercevesi>${weekData.icerikCercevesi}</tespit_edilen_icerik_cercevesi>
  <tespit_edilen_ogrenme_ciktilari_ve_surec_bilesenleri>
${weekData.formattedOutcomeAndProcessBlock}
  </tespit_edilen_ogrenme_ciktilari_ve_surec_bilesenleri>
  <secilen_hafta_ham_tablo_satirlari>
${weekData.rawWeekWindowText}
  </secilen_hafta_ham_tablo_satirlari>
  <yillik_plan_genel_tablo_baglami>
${rawYillikTableFromXml.slice(0, 12000)}
  </yillik_plan_genel_tablo_baglami>
</yillik_plan>

<ders_bilgi_formu baglam="Bu metin MEB Ders Bilgi Formudur. Öğrenme Çıktıları ve Süreç Bileşenlerinin tam cümleleri <ogrenme_ciktilari_ve_surec_bilesenleri_katalogu> içindedir. Öğrenme Kanıtları, Temel Kabuller, Ön Değerlendirme Süreci, Köprü Kurma ve Öğretme Uygulamaları doğrudan bu etiket içindeki resmi metinlerden birebir alınmalıdır.">
  <alan_becerileri>${structuredDbf.alanBecerileri}</alan_becerileri>
  <egilimler>${structuredDbf.egilimler}</egilimler>
  <sosyal_duygusal_ogrenme_becerileri>${structuredDbf.sosyalDuygusalBeceriler}</sosyal_duygusal_ogrenme_becerileri>
  <degerler>${structuredDbf.degerler}</degerler>
  <okuryazarlik_becerileri>${structuredDbf.okuryazarlikBecerileri}</okuryazarlik_becerileri>
  <disiplinler_arasi_iliski>${structuredDbf.disiplinlerArasiIliski}</disiplinler_arasi_iliski>
  <beceriler_arasi_iliski>${structuredDbf.becerilerArasiIliski}</beceriler_arasi_iliski>
  <ogrenme_ciktilari_ve_surec_bilesenleri_katalogu>
${outcomesCatalogText}
  </ogrenme_ciktilari_ve_surec_bilesenleri_katalogu>
  <ogrenme_kanitlari_tam_metin>
${structuredDbf.ogrenmeKanitlari}
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
  <aktif_maarif_kodlari>${
    structuredDbf.rawActivityCodes.join(", ") ||
    "OB1, OB2, KB2.2, KB3.2, E1.4, E2.2, SDB2.2, SDB3.3, D3.2, D16.3"
  }</aktif_maarif_kodlari>
</ders_bilgi_formu>

<ders_materyali baglam="Bu metin Ders Materyalidir (Ders Kitabı / Modül). Seçilen haftanın süreç bileşenlerine (${weekData.weekSubComponents.join(
            " ; "
          )}) özgü 4 maddelik Güdüleme (-acaksınız/-eceksiniz kipinde), 4 soruluk Dikkat Çekme (? ile biten) ve sonunda parantez içi Maarif kodları bulunan 6 maddelik Ek Öğretme Uygulamaları doğrudan bu metinden ve haftanın süreç bileşenlerinden üretilmelidir.">
${materyalSlice}
</ders_materyali>
</ders_plani_baglam_paketi>`;

          const rawJson = await generateWithFallback(
            apiKey,
            xmlPromptForGemini,
            SYSTEM_INSTRUCTION,
            LESSON_PLAN_RESPONSE_SCHEMA
          );
          aiCandidatePlan = JSON.parse(rawJson);

          // AŞAMA 2: Kullanıcıya Çıktıyı Vermeden Önce AI Teyit & Doğrulama Katmanı (Pre-Delivery AI Audit)
          // Tarih-hafta aralığını ve Öğrenme Çıktıları ve Süreç Bileşenlerinin eksiksizliğini kaynak dokümanlarla teyit eder.
          try {
            const candidateOutcomes = String(
              aiCandidatePlan?.Ogrenme_Ciktilari_ve_Surec_Bilesenleri ||
                weekData.formattedOutcomeAndProcessBlock ||
                ""
            );

            const verificationPrompt = `<teyit_gorevi>
Kullanıcıya günlük ders planı çıktısını vermeden önce aşağıdaki üretilen verileri kaynak dokümanlarla (<yillik_plan_tablosu> ve <ders_bilgi_formu_kazanim_katalogu>) karşılaştırarak TEYİT ET ve eksik/hatalı kısım varsa düzelt:
1. HEDEF HAFTA VE TARİH ARALIĞI KONTROLÜ: İstenen hafta "${weekData.haftaEtiketi}" ve tarih aralığı "${effectiveTarihAraligi}". Yıllık planda bu haftanın gerçek tarih aralığı nedir?
2. ÖĞRENME ÇIKTILARI VE SÜREÇ BİLEŞENLERİ EKSİKSİZLİK KONTROLÜ:
   - Yıllık planda bu hafta ve tarih aralığına karşılık gelen satırda hangi öğrenme çıktısı kodu (örn: ST.1.1, ST.1.2 vb.) ve hangi alt süreç bileşenleri (a, b, c, ç, d, e...) yer alıyor?
   - Aday çıktıdaki metin:
${candidateOutcomes}
   - Eğer yıllık planda o haftada yer alan herhangi bir alt süreç bileşeni (a, b, c, ç, d, e...) eksik alınmışsa veya cümlesi yarım kalmışsa, <ders_bilgi_formu_kazanim_katalogu> içindeki tam cümlesini alarak 'Eksiksiz_Ogrenme_Ciktilari_ve_Surec_Bilesenleri' alanına ana öğrenme çıktısı başlığı + o haftanın tüm alt süreç bileşenleri şeklinde eksiksiz yaz. Başka haftanın alt bileşenlerini ekleme!
3. ÖĞRENME BİRİMİ VE İÇERİK ÇERÇEVESİ KONTROLÜ: O hafta ve tarih aralığına ait Öğrenme Birimi ve İçerik Çerçevesi (Konu) adını doğrula.
</teyit_gorevi>

<yillik_plan_secilen_hafta_kesiti>
${weekData.rawWeekWindowText}
</yillik_plan_secilen_hafta_kesiti>

<yillik_plan_tablosu>
${rawYillikTableFromXml.slice(0, 10000)}
</yillik_plan_tablosu>

<ders_bilgi_formu_kazanim_katalogu>
${outcomesCatalogText}
</ders_bilgi_formu_kazanim_katalogu>`;

            const verifyRawJson = await generateWithFallback(
              apiKey,
              verificationPrompt,
              "Sen MEB Günlük Ders Planı Kalite Kontrol ve Teyit Denetçisisin. Çıktı kullanıcıya sunulmadan önce Hafta-Tarih aralığı eşleşmesini ve Öğrenme Çıktıları ile Süreç Bileşenlerinin (a, b, c, ç, d, e) eksiksizliğini kaynak dokümanlardan teyit edersin.",
              PRE_DELIVERY_VERIFICATION_SCHEMA
            );
            const verifiedData = JSON.parse(verifyRawJson);

            if (
              verifiedData.Eksiksiz_Ogrenme_Ciktilari_ve_Surec_Bilesenleri &&
              String(
                verifiedData.Eksiksiz_Ogrenme_Ciktilari_ve_Surec_Bilesenleri
              ).trim().length >= 15
            ) {
              const verifiedOutcomes = String(
                verifiedData.Eksiksiz_Ogrenme_Ciktilari_ve_Surec_Bilesenleri
              ).trim();
              if (aiCandidatePlan) {
                aiCandidatePlan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri =
                  verifiedOutcomes;
              }
              // Only fallback to verifiedOutcomes for weekData if weekData had no specific sub-components
              if (
                weekData.weekSubComponents.length === 0 &&
                verifiedOutcomes.length >=
                  weekData.formattedOutcomeAndProcessBlock.length
              ) {
                weekData.formattedOutcomeAndProcessBlock = verifiedOutcomes;
              }
            }

            if (
              verifiedData.Dogrulanan_Tarih_Araligi &&
              String(verifiedData.Dogrulanan_Tarih_Araligi).trim().length >= 5 &&
              !/^\d+\s*\.\s*hafta$/i.test(
                String(verifiedData.Dogrulanan_Tarih_Araligi).trim()
              )
            ) {
              weekData.tarihAraligi = String(
                verifiedData.Dogrulanan_Tarih_Araligi
              ).trim();
            }

            if (
              verifiedData.Dogrulanan_Ogrenme_Birimi &&
              String(verifiedData.Dogrulanan_Ogrenme_Birimi).trim().length >= 3 &&
              !/VE\s*SÜRE/i.test(String(verifiedData.Dogrulanan_Ogrenme_Birimi))
            ) {
              weekData.ogrenmeBirimi = String(
                verifiedData.Dogrulanan_Ogrenme_Birimi
              ).trim();
            }

            if (
              verifiedData.Dogrulanan_Icerik_Cercevesi &&
              String(verifiedData.Dogrulanan_Icerik_Cercevesi).trim().length >=
                3 &&
              !/^\d+\s*\.\s*hafta$/i.test(
                String(verifiedData.Dogrulanan_Icerik_Cercevesi).trim()
              )
            ) {
              weekData.icerikCercevesi = String(
                verifiedData.Dogrulanan_Icerik_Cercevesi
              ).trim();
            }

            if (verifiedData.Teyit_Ozeti) {
              verificationSummary = String(verifiedData.Teyit_Ozeti).trim();
            }
          } catch (verifyErr) {
            console.warn(
              "Pre-delivery AI verification pass warning (using Stage 1 + deterministic verification):",
              verifyErr
            );
          }
        } catch (aiErr: unknown) {
          const msg = aiErr instanceof Error ? aiErr.message : String(aiErr);
          console.warn(
            "Gemini generation fallback to deterministic engine:",
            msg
          );
        }
      }

      // 2. Enforce 1:1 verbatim integrity for Ders Bilgi Formu & Yıllık Plan fields + merge verified outcomes & week-specific AI synthesis
      const finalPlan = enforceAndMergeLessonPlan(
        aiCandidatePlan,
        structuredDbf,
        weekData,
        materyalSlice,
        {
          dersIsmi: ders_ismi,
          sinifDuzeyi: sinif_duzeyi,
        }
      );

      res.json({
        plan: finalPlan,
        detectedWeekMeta: {
          haftaEtiketi: weekData.haftaEtiketi,
          tarihAraligi: weekData.tarihAraligi,
          onayTarihi: inferApprovalDate(weekData.tarihAraligi),
        },
        verificationSummary,
      });
    } catch (err: unknown) {
      console.error("Error generating lesson plan:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Bilinmeyen bir sunucu hatası oluştu.";
      res.status(500).json({
        error: `Ders planı oluşturulurken hata oluştu: ${message}`,
      });
    }
  });

  // Endpoint to generate High School Student-Friendly Topic Summary & Study Note
  app.post("/api/generate-topic-summary", async (req, res) => {
    try {
      const body = req.body || {};
      const isXml = typeof body === "string" && body.includes("<");

      const ders_ismi = isXml
        ? extractXmlTag(body, "ders_ismi")
        : String((body as Record<string, unknown>)?.ders_ismi || "");
      const sinif_duzeyi = isXml
        ? extractXmlTag(body, "sinif_duzeyi")
        : String((body as Record<string, unknown>)?.sinif_duzeyi || "");
      const hafta_etiketi = isXml
        ? extractXmlTag(body, "hafta_etiketi")
        : String((body as Record<string, unknown>)?.hafta_etiketi || "1. HAFTA");
      const tarih_araligi = isXml
        ? extractXmlTag(body, "tarih_araligi")
        : String((body as Record<string, unknown>)?.tarih_araligi || "");
      const ogrenme_birimi = isXml
        ? extractXmlTag(body, "ogrenme_birimi")
        : String((body as Record<string, unknown>)?.ogrenme_birimi || "");
      const icerik_cercevesi = isXml
        ? extractXmlTag(body, "icerik_cercevesi")
        : String((body as Record<string, unknown>)?.icerik_cercevesi || "");
      const ogrenme_ciktilari = isXml
        ? extractXmlTag(body, "ogrenme_ciktilari")
        : String((body as Record<string, unknown>)?.ogrenme_ciktilari || "");
      const ders_materyali = isXml
        ? extractXmlTag(body, "ders_materyali")
        : String((body as Record<string, unknown>)?.ders_materyali || "");

      const weekNoMatch = hafta_etiketi.match(/\d+/);
      const fakeWeekData: WeekSpecificExtraction = {
        haftaNo: weekNoMatch ? Number(weekNoMatch[0]) : 1,
        haftaEtiketi: hafta_etiketi,
        tarihAraligi: tarih_araligi,
        sure: "",
        ogrenmeBirimi: ogrenme_birimi,
        icerikCercevesi: icerik_cercevesi,
        outcomeCode: "",
        outcomeHeader: "",
        weekSubComponents: [],
        formattedOutcomeAndProcessBlock: ogrenme_ciktilari,
        unitOgrenmeKanitlari: "",
        rawWeekWindowText: "",
        unitOgretmeUygulamalari: [],
        searchKeywords: [
          ogrenme_birimi,
          icerik_cercevesi,
          ...icerik_cercevesi.split(/\s+/).filter((w) => w.length >= 3),
        ],
      };

      const cleanMateryal = stripFrontMatter(ders_materyali);
      const materyalSlice = extractWeekMateryalSlice(
        cleanMateryal,
        fakeWeekData,
        14000
      );

      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build",
              },
              timeout: 12000,
            },
          });
          const prompt = `Sen Türkiye Yüzyılı Maarif Modeli kapsamında meslek lisesi öğrencilerine ders anlatan, konuları sade, anlaşılır, ilgi çekici ve somut örneklerle açıklayan uzman bir öğretmensin.
GÖREV:
Aşağıda verilen ders, hafta, konu ve ders materyali içeriğine dayanarak, LİSE ÖĞRENCİSİNİN (9-12. sınıf) kolayca okuyup anlayabileceği, sınavlara ve atölye/laboratuvar uygulamalarına hazırlanabileceği yüksek kaliteli bir "ÖĞRENCİ DERS NOTU VE KONU ÖZETİ" hazırla.

KESİN YASAKLAR:
- Ders kitabının künye bilgilerini, "Millî Eğitim Bakanlığının ... gün ve ... sayılı oluru ile", Talim ve Terbiye Kurulu kararlarını, İstiklal Marşı dizelerini ("Korkma, sönmez..."), Gençliğe Hitabe'yi, ISBN veya yayın/dizi numaralarını KESİNLİKLE özete dahil etme!
- Yalnızca bu haftanın konusu olan "${icerik_cercevesi}" (${ogrenme_birimi}) ve ilgili kazanımlarını anlat.

DERS BİLGİLERİ:
- Ders: ${ders_ismi || "Meslek Dersi"}
- Sınıf: ${sinif_duzeyi || "Lise Düzeyi"}
- Hafta & Tarih: ${hafta_etiketi} (${tarih_araligi})
- Öğrenme Birimi (Ünite): ${ogrenme_birimi}
- İçerik Çerçevesi (Konu): ${icerik_cercevesi}
- İlgili Kazanımlar / Süreç Bileşenleri:
${ogrenme_ciktilari}

DERS KİTABI / DERS MATERYALİNDEN İLGİLİ BÖLÜM:
${materyalSlice || "(Ders materyali metni doğrudan verilmediyse yukarıdaki konu ve ünite başlıklarına göre lise müfredatına tam uyumlu içerik oluştur)"}

DERS NOTUNUN YAPISI VE KURALLARI:
1. Dil: Ağır akademik veya bürokratik dilden uzak; doğrudan lise öğrencisine hitap eden ("sen" dili, motive edici, net, anlaşılır ve akıcı).
2. Yapı (Markdown formatında):
   - 📌 **1. Bu Konuda Neyi, Neden Öğreniyoruz?**: Konunun hayatımızdaki ve meslekteki somut önemi (1-2 sıcak paragraf).
   - 💡 **2. Temel Kavramlar & Bilmen Gerekenler**: En kritik 4-7 kavram ve kısa, net açıklamaları (madde madde).
   - ⚙️ **3. Adım Adım Nasıl Yapılır / Nasıl Uygulanır?**: Atölye veya pratik uygulama basamakları (madde madde).
   - ⚠️ **4. Önemli İpuçları (Sınavda & Atölyede Çıkar!)**: Püf noktaları, sık yapılan hatalar ve iş sağlığı/güvenliği hatırlatmaları.
   - 🎯 **5. Kendini Dene! (Hızlı Pekiştirme)**: Öğrencinin konuyu kavrayıp kavramadığını ölçen 3 soru ve altında kısa ipuçları.
3. Çıktı Formatı: Başlıklar, maddeler ve vurgular içeren düzenli Markdown metni olmalıdır.`;

          const response = await Promise.race([
            ai.models.generateContent({
              model: "gemini-4-hydrogen",
              contents: prompt,
              config: {
                thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              },
            }),
            new Promise<never>((_, reject) =>
              setTimeout(
                () => reject(new Error("Gemini topic summary timed out")),
                11000
              )
            ),
          ]);

          const summaryText = stripFrontMatter(response.text || "");
          if (summaryText.trim().length >= 80) {
            res.json({
              success: true,
              summaryMarkdown: summaryText.trim(),
              title: `${ders_ismi} — ${hafta_etiketi} Konu Özeti`,
              source: "gemini-4-hydrogen",
            });
            return;
          }
        } catch (aiErr) {
          console.warn(
            "Gemini topic summary generation failed, falling back to deterministic synthesis:",
            aiErr
          );
        }
      }

      res.json({
        success: true,
        summaryMarkdown: null,
        useClientFallback: true,
      });
    } catch (err: unknown) {
      console.error("Error in generate-topic-summary:", err);
      res.status(500).json({
        error: "Konu özeti oluşturulurken bir hata oluştu.",
      });
    }
  });

  // Endpoint for PlanValidator "Otomatik Tamamla": AI-powered auto-completion for missing lesson plan fields (Öğretme Uygulamaları, Öğrenme Kanıtları, vb.)
  app.post("/api/autocomplete-plan-fields", async (req, res) => {
    try {
      const body = (req.body || {}) as Record<string, unknown>;
      const currentPlan = (body.plan || {}) as Partial<MaarifLessonPlan>;
      const meta = (body.meta || {}) as Record<string, string>;
      const targetIssueId = String(body.target_issue_id || "all").trim();
      const yillik_plan = String(body.yillik_plan || "");
      const ders_bilgi_formu = String(body.ders_bilgi_formu || "");
      const ders_materyali = String(body.ders_materyali || "");

      const dersIsmi =
        String(meta.dersIsmi || currentPlan.Ders_Bilgisi?.Ders || "").trim() ||
        "Meslek Dersi";
      const sinifDuzeyi =
        String(meta.sinifDuzeyi || currentPlan.Ders_Bilgisi?.Sinif || "").trim() ||
        "9. Sınıf";
      const haftaEtiketi =
        String(meta.haftaEtiketi || "1. HAFTA").trim();
      const tarihAraligi =
        String(meta.tarihAraligi || "").trim();
      const ogrenmeBirimi =
        String(currentPlan.Ders_Bilgisi?.Ogrenme_Birimi || "").trim();
      const icerikCercevesi =
        String(currentPlan.Icerik_Cercevesi || "").trim();
      const ogrenmeCiktilari =
        String(currentPlan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri || "").trim();

      const structuredDbf = parseDersBilgiFormuStructured(
        ders_bilgi_formu
      );

      const weekData = extractWeekPlanStructured(
        yillik_plan,
        haftaEtiketi,
        tarihAraligi,
        structuredDbf
      );
      if (ogrenmeBirimi && !weekData.ogrenmeBirimi) {
        weekData.ogrenmeBirimi = ogrenmeBirimi;
      }
      if (icerikCercevesi && !weekData.icerikCercevesi) {
        weekData.icerikCercevesi = icerikCercevesi;
      }
      if (ogrenmeCiktilari && !weekData.formattedOutcomeAndProcessBlock) {
        weekData.formattedOutcomeAndProcessBlock = ogrenmeCiktilari;
      }
      const cleanMateryal = stripFrontMatter(ders_materyali);
      const materyalSlice = extractWeekMateryalSlice(
        cleanMateryal,
        weekData,
        12000
      );

      // Deterministic baseline plan
      const baselinePlan = enforceAndMergeLessonPlan(
        null,
        structuredDbf,
        weekData,
        materyalSlice,
        {
          dersIsmi,
          sinifDuzeyi,
        }
      );

      let aiGeneratedPartial: Partial<MaarifLessonPlan> | null = null;
      let usedSource: "ai" | "maarif-motoru" = "maarif-motoru";

      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const autocompleteSchema = {
            type: Type.OBJECT,
            properties: {
              Ogrenme_Birimi: { type: Type.STRING },
              Sure: { type: Type.STRING },
              Alan_Becerileri: { type: Type.STRING },
              Egilimler: { type: Type.STRING },
              Sosyal_Duygusal_Ogrenme_Becerileri: { type: Type.STRING },
              Degerler: { type: Type.STRING },
              Okuryazarlik_Becerileri: { type: Type.STRING },
              Disiplinler_Arasi_Iliski: { type: Type.STRING },
              Beceriler_Arasi_Iliski: { type: Type.STRING },
              Ogrenme_Ciktilari_ve_Surec_Bilesenleri: {
                type: Type.STRING,
                description:
                  "Maarif kodu (örn: ST.1.1.) ile başlayan öğrenme çıktısı ve alt satırlarda a), b), c) şeklinde süreç bileşenleri.",
              },
              Icerik_Cercevesi: { type: Type.STRING },
              Ogrenme_Kanitlari: {
                type: Type.STRING,
                description:
                  "Bu haftanın konusuna ve öğrenme çıktısına uygun ölçme ve değerlendirme kanıtları (Performans görevi, gözlem formu, kontrol listesi, açık uçlu sorular vb.).",
              },
              Temel_Kabuller: { type: Type.STRING },
              On_Degerlendirme_Sureci: { type: Type.STRING },
              Kopru_Kurma: { type: Type.STRING },
              Ogretme_Uygulamalari: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  "Dersin işlenişini adım adım anlatan, süreç bileşenleriyle (a, b, c) uyumlu en az 4-5 adet zengin ve pedagojik Öğretme Uygulaması maddesi.",
              },
              Guduleme: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              Dikkat_Cekme: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              Ek_Ogretme_Uygulamalari: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              Farklilastirma: {
                type: Type.STRING,
                description:
                  "Zenginleştirme: ... ve Destekleme: ... başlıklarını içeren farklılaştırma açıklaması.",
              },
            },
            required: [
              "Ogrenme_Birimi",
              "Alan_Becerileri",
              "Egilimler",
              "Ogrenme_Ciktilari_ve_Surec_Bilesenleri",
              "Icerik_Cercevesi",
              "Ogrenme_Kanitlari",
              "Temel_Kabuller",
              "On_Degerlendirme_Sureci",
              "Kopru_Kurma",
              "Ogretme_Uygulamalari",
              "Guduleme",
              "Dikkat_Cekme",
              "Ek_Ogretme_Uygulamalari",
              "Farklilastirma",
            ],
          };

          const prompt = `<gorev>
Aşağıdaki MEB Türkiye Yüzyılı Maarif Modeli günlük ders planında eksik veya geliştirilmesi gereken alanları (özellikle Öğretme Uygulamaları, Öğrenme Kanıtları, Öğrenme Çıktıları ve Süreç Bileşenleri, Hazırlık Süreçleri, Alan Becerileri, Eğilimler ve Farklılaştırma) dersin konusuna, öğrenme birimine ve varsa kaynak dokümanlara tam uyumlu olarak tamamla.

Hedef Alan: ${targetIssueId}
Ders: ${dersIsmi}
Sınıf: ${sinifDuzeyi}
Hafta: ${haftaEtiketi} (${tarihAraligi})
Mevcut Öğrenme Birimi: ${ogrenmeBirimi || baselinePlan.Ders_Bilgisi.Ogrenme_Birimi}
Mevcut İçerik Çerçevesi (Konu): ${icerikCercevesi || baselinePlan.Icerik_Cercevesi}
Mevcut Öğrenme Çıktıları:
${ogrenmeCiktilari || baselinePlan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri}

Kurallar:
1. 'Ogretme_Uygulamalari' alanında dersin konusuna ("${icerikCercevesi || baselinePlan.Icerik_Cercevesi || dersIsmi}") özel, öğretmenin ve öğrencinin derste yapacağı etkinlikleri anlatan 4-6 adet somut ve nitelikli uygulama basamağı üret.
2. 'Ogrenme_Kanitlari' alanında bu konunun nasıl ölçüleceğini (gözlem formu, dereceli puanlama anahtarı, açık uçlu soru, uygulama kontrol listesi vb.) somut olarak yaz.
3. 'Ogrenme_Ciktilari_ve_Surec_Bilesenleri' alanında mutlaka Maarif formatında kod (örn: BÜY.1.1. veya dersin baş harflerinden oluşan kod) ve alt satırlarda a), b), c) süreç bileşenleri yer alsın.
4. Kitap künyesi, MEB onay/olur sayıları veya İstiklal Marşı gibi ön sayfa metinlerini ASLA kullanma.
</gorev>

<mevcut_plan_ozeti>
${JSON.stringify(currentPlan, null, 2)}
</mevcut_plan_ozeti>

<kaynak_kesiti>
${(materyalSlice || ders_bilgi_formu.slice(0, 4000) || yillik_plan.slice(0, 4000)).slice(0, 8000)}
</kaynak_kesiti>`;

          const rawJson = await generateWithFallback(
            apiKey,
            prompt,
            "Sen MEB Türkiye Yüzyılı Maarif Modeli günlük ders planlarındaki eksik alanları (Öğretme Uygulamaları, Öğrenme Kanıtları, Süreç Bileşenleri, Farklılaştırma vb.) pedagojik ve resmi standartlara tam uygun şekilde tamamlayan uzman bir eğitim programcısısın.",
            autocompleteSchema
          );
          const parsed = JSON.parse(rawJson);
          aiGeneratedPartial = {
            Ders_Bilgisi: {
              Sinif: sinifDuzeyi,
              Ders: dersIsmi,
              Ogrenme_Birimi: String(parsed.Ogrenme_Birimi || "").trim(),
              Sure: String(parsed.Sure || "2 Ders Saati").trim(),
              Alan_Becerileri: String(parsed.Alan_Becerileri || "").trim(),
              Egilimler: String(parsed.Egilimler || "").trim(),
            },
            Programlar_Arasi_Bilesenler: {
              Sosyal_Duygusal_Ogrenme_Becerileri: String(
                parsed.Sosyal_Duygusal_Ogrenme_Becerileri || ""
              ).trim(),
              Degerler: String(parsed.Degerler || "").trim(),
              Okuryazarlik_Becerileri: String(
                parsed.Okuryazarlik_Becerileri || ""
              ).trim(),
              Disiplinler_Arasi_Iliski: String(
                parsed.Disiplinler_Arasi_Iliski || ""
              ).trim(),
              Beceriler_Arasi_Iliski: String(
                parsed.Beceriler_Arasi_Iliski || ""
              ).trim(),
            },
            Ogrenme_Ciktilari_ve_Surec_Bilesenleri: String(
              parsed.Ogrenme_Ciktilari_ve_Surec_Bilesenleri || ""
            ).trim(),
            Icerik_Cercevesi: String(parsed.Icerik_Cercevesi || "").trim(),
            Ogrenme_Kanitlari: String(parsed.Ogrenme_Kanitlari || "").trim(),
            Ogrenme_Ogretme_Yasantilari: {
              Temel_Kabuller: String(parsed.Temel_Kabuller || "").trim(),
              On_Degerlendirme_Sureci: String(
                parsed.On_Degerlendirme_Sureci || ""
              ).trim(),
              Kopru_Kurma: String(parsed.Kopru_Kurma || "").trim(),
              Ogretme_Uygulamalari: Array.isArray(parsed.Ogretme_Uygulamalari)
                ? parsed.Ogretme_Uygulamalari.map((s: unknown) =>
                    String(s || "")
                      .replace(/^\*\s*/, "")
                      .trim()
                  ).filter(Boolean)
                : [],
              Guduleme: Array.isArray(parsed.Guduleme)
                ? parsed.Guduleme.map((s: unknown) =>
                    String(s || "")
                      .replace(/^\*\s*/, "")
                      .trim()
                  ).filter(Boolean)
                : [],
              Dikkat_Cekme: Array.isArray(parsed.Dikkat_Cekme)
                ? parsed.Dikkat_Cekme.map((s: unknown) =>
                    String(s || "")
                      .replace(/^\*\s*/, "")
                      .trim()
                  ).filter(Boolean)
                : [],
              Ek_Ogretme_Uygulamalari: Array.isArray(
                parsed.Ek_Ogretme_Uygulamalari
              )
                ? parsed.Ek_Ogretme_Uygulamalari.map((s: unknown) =>
                    String(s || "")
                      .replace(/^\*\s*/, "")
                      .trim()
                  ).filter(Boolean)
                : [],
            },
            Farklilastirma: String(parsed.Farklilastirma || "").trim(),
          };
          usedSource = "ai";
        } catch (aiErr) {
          console.warn(
            "AI autocomplete fallback to Maarif deterministic engine:",
            aiErr
          );
        }
      }

      // Merge AI partial with baselinePlan so every field has a rich value ready
      const richCandidate = enforceAndMergeLessonPlan(
        aiGeneratedPartial,
        structuredDbf,
        weekData,
        materyalSlice,
        {
          dersIsmi,
          sinifDuzeyi,
        }
      );

      // Ensure Ogrenme_Ciktilari has a Maarif code and subcomponents (a, b, c) if missing
      const coursePrefix =
        dersIsmi
          .split(/\s+/)
          .filter(Boolean)
          .map((w) => w[0]?.toLocaleUpperCase("tr-TR") || "")
          .join("")
          .slice(0, 4) || "DRS";
      const candidateOutcomes =
        aiGeneratedPartial?.Ogrenme_Ciktilari_ve_Surec_Bilesenleri ||
        richCandidate.Ogrenme_Ciktilari_ve_Surec_Bilesenleri ||
        `${coursePrefix}.1.1. ${
          icerikCercevesi || ogrenmeBirimi || dersIsmi
        } konusuna ilişkin temel kavram ve uygulamaları açıklayabilme\na) Konuya ilişkin temel kavram ve ilkeleri belirler.\nb) Belirlenen ilkeler doğrultusunda işlem basamaklarını ilişkilendirir.\nc) Uygulama sürecini iş sağlığı ve güvenliği kurallarına uygun olarak değerlendirir.`;

      const completedFields: string[] = [];
      const updatedPlan: MaarifLessonPlan = {
        Ders_Bilgisi: {
          Sinif:
            currentPlan.Ders_Bilgisi?.Sinif?.trim() ||
            richCandidate.Ders_Bilgisi.Sinif,
          Ders:
            currentPlan.Ders_Bilgisi?.Ders?.trim() &&
            currentPlan.Ders_Bilgisi.Ders.trim() !== "DERS"
              ? currentPlan.Ders_Bilgisi.Ders
              : richCandidate.Ders_Bilgisi.Ders,
          Ogrenme_Birimi:
            currentPlan.Ders_Bilgisi?.Ogrenme_Birimi?.trim() &&
            !/^VE\s*SÜRE$/i.test(currentPlan.Ders_Bilgisi.Ogrenme_Birimi.trim()) &&
            targetIssueId !== "bos-birim" &&
            targetIssueId !== "supheli-birim"
              ? currentPlan.Ders_Bilgisi.Ogrenme_Birimi
              : (completedFields.push("Öğrenme Birimi"),
                aiGeneratedPartial?.Ders_Bilgisi?.Ogrenme_Birimi ||
                  richCandidate.Ders_Bilgisi.Ogrenme_Birimi),
          Sure:
            currentPlan.Ders_Bilgisi?.Sure?.trim() &&
            targetIssueId !== "bos-sure"
              ? currentPlan.Ders_Bilgisi.Sure
              : (completedFields.push("Süre"),
                richCandidate.Ders_Bilgisi.Sure || "2 Ders Saati"),
          Alan_Becerileri:
            currentPlan.Ders_Bilgisi?.Alan_Becerileri?.trim() &&
            targetIssueId !== "bos-alan-becerileri"
              ? currentPlan.Ders_Bilgisi.Alan_Becerileri
              : (completedFields.push("Alan Becerileri"),
                aiGeneratedPartial?.Ders_Bilgisi?.Alan_Becerileri ||
                  richCandidate.Ders_Bilgisi.Alan_Becerileri),
          Egilimler:
            currentPlan.Ders_Bilgisi?.Egilimler?.trim() &&
            targetIssueId !== "bos-egilimler"
              ? currentPlan.Ders_Bilgisi.Egilimler
              : (completedFields.push("Eğilimler"),
                aiGeneratedPartial?.Ders_Bilgisi?.Egilimler ||
                  richCandidate.Ders_Bilgisi.Egilimler),
        },
        Programlar_Arasi_Bilesenler: {
          Sosyal_Duygusal_Ogrenme_Becerileri:
            currentPlan.Programlar_Arasi_Bilesenler?.Sosyal_Duygusal_Ogrenme_Becerileri?.trim() &&
            targetIssueId !== "bos-programlar-arasi"
              ? currentPlan.Programlar_Arasi_Bilesenler
                  .Sosyal_Duygusal_Ogrenme_Becerileri
              : (completedFields.push("Sosyal-Duygusal Öğrenme Becerileri"),
                aiGeneratedPartial?.Programlar_Arasi_Bilesenler
                  ?.Sosyal_Duygusal_Ogrenme_Becerileri ||
                  richCandidate.Programlar_Arasi_Bilesenler
                    .Sosyal_Duygusal_Ogrenme_Becerileri),
          Degerler:
            currentPlan.Programlar_Arasi_Bilesenler?.Degerler?.trim() &&
            targetIssueId !== "bos-programlar-arasi"
              ? currentPlan.Programlar_Arasi_Bilesenler.Degerler
              : (completedFields.push("Değerler"),
                aiGeneratedPartial?.Programlar_Arasi_Bilesenler?.Degerler ||
                  richCandidate.Programlar_Arasi_Bilesenler.Degerler),
          Okuryazarlik_Becerileri:
            currentPlan.Programlar_Arasi_Bilesenler?.Okuryazarlik_Becerileri?.trim() &&
            targetIssueId !== "bos-programlar-arasi"
              ? currentPlan.Programlar_Arasi_Bilesenler.Okuryazarlik_Becerileri
              : (completedFields.push("Okuryazarlık Becerileri"),
                aiGeneratedPartial?.Programlar_Arasi_Bilesenler
                  ?.Okuryazarlik_Becerileri ||
                  richCandidate.Programlar_Arasi_Bilesenler
                    .Okuryazarlik_Becerileri),
          Disiplinler_Arasi_Iliski:
            currentPlan.Programlar_Arasi_Bilesenler?.Disiplinler_Arasi_Iliski?.trim() &&
            targetIssueId !== "bos-programlar-arasi"
              ? currentPlan.Programlar_Arasi_Bilesenler.Disiplinler_Arasi_Iliski
              : aiGeneratedPartial?.Programlar_Arasi_Bilesenler
                  ?.Disiplinler_Arasi_Iliski ||
                richCandidate.Programlar_Arasi_Bilesenler
                  .Disiplinler_Arasi_Iliski,
          Beceriler_Arasi_Iliski:
            currentPlan.Programlar_Arasi_Bilesenler?.Beceriler_Arasi_Iliski?.trim() &&
            targetIssueId !== "bos-programlar-arasi"
              ? currentPlan.Programlar_Arasi_Bilesenler.Beceriler_Arasi_Iliski
              : aiGeneratedPartial?.Programlar_Arasi_Bilesenler
                  ?.Beceriler_Arasi_Iliski ||
                richCandidate.Programlar_Arasi_Bilesenler.Beceriler_Arasi_Iliski,
        },
        Ogrenme_Ciktilari_ve_Surec_Bilesenleri:
          currentPlan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri?.trim() &&
          /\b[A-ZÇĞİÖŞÜ]{2,8}\.\d{1,2}/.test(
            currentPlan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri
          ) &&
          /\b[a-zçğıöşü]\)\s+/i.test(
            currentPlan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri
          ) &&
          targetIssueId !== "cikti-bos" &&
          targetIssueId !== "cikti-kod-eksik" &&
          targetIssueId !== "cikti-alt-madde-eksik"
            ? currentPlan.Ogrenme_Ciktilari_ve_Surec_Bilesenleri
            : (completedFields.push("Öğrenme Çıktıları ve Süreç Bileşenleri"),
              candidateOutcomes),
        Icerik_Cercevesi:
          currentPlan.Icerik_Cercevesi?.trim() &&
          targetIssueId !== "bos-icerik-cercevesi"
            ? currentPlan.Icerik_Cercevesi
            : (completedFields.push("İçerik Çerçevesi"),
              aiGeneratedPartial?.Icerik_Cercevesi ||
                richCandidate.Icerik_Cercevesi),
        Ogrenme_Kanitlari:
          currentPlan.Ogrenme_Kanitlari?.trim() &&
          targetIssueId !== "bos-ogrenme-kanitlari"
            ? currentPlan.Ogrenme_Kanitlari
            : (completedFields.push("Öğrenme Kanıtları"),
              aiGeneratedPartial?.Ogrenme_Kanitlari ||
                richCandidate.Ogrenme_Kanitlari),
        Ogrenme_Ogretme_Yasantilari: {
          Temel_Kabuller:
            currentPlan.Ogrenme_Ogretme_Yasantilari?.Temel_Kabuller?.trim() &&
            targetIssueId !== "eksik-hazirlik-surecleri"
              ? currentPlan.Ogrenme_Ogretme_Yasantilari.Temel_Kabuller
              : (completedFields.push("Temel Kabuller"),
                aiGeneratedPartial?.Ogrenme_Ogretme_Yasantilari
                  ?.Temel_Kabuller ||
                  richCandidate.Ogrenme_Ogretme_Yasantilari.Temel_Kabuller),
          On_Degerlendirme_Sureci:
            currentPlan.Ogrenme_Ogretme_Yasantilari?.On_Degerlendirme_Sureci?.trim() &&
            targetIssueId !== "eksik-hazirlik-surecleri"
              ? currentPlan.Ogrenme_Ogretme_Yasantilari.On_Degerlendirme_Sureci
              : (completedFields.push("Ön Değerlendirme Süreci"),
                aiGeneratedPartial?.Ogrenme_Ogretme_Yasantilari
                  ?.On_Degerlendirme_Sureci ||
                  richCandidate.Ogrenme_Ogretme_Yasantilari
                    .On_Degerlendirme_Sureci),
          Kopru_Kurma:
            currentPlan.Ogrenme_Ogretme_Yasantilari?.Kopru_Kurma?.trim() &&
            targetIssueId !== "eksik-hazirlik-surecleri"
              ? currentPlan.Ogrenme_Ogretme_Yasantilari.Kopru_Kurma
              : (completedFields.push("Köprü Kurma"),
                aiGeneratedPartial?.Ogrenme_Ogretme_Yasantilari?.Kopru_Kurma ||
                  richCandidate.Ogrenme_Ogretme_Yasantilari.Kopru_Kurma),
          Ogretme_Uygulamalari:
            currentPlan.Ogrenme_Ogretme_Yasantilari?.Ogretme_Uygulamalari &&
            currentPlan.Ogrenme_Ogretme_Yasantilari.Ogretme_Uygulamalari.length >
              0 &&
            targetIssueId !== "bos-ogretme-uygulamalari"
              ? currentPlan.Ogrenme_Ogretme_Yasantilari.Ogretme_Uygulamalari
              : (completedFields.push("Öğretme Uygulamaları"),
                aiGeneratedPartial?.Ogrenme_Ogretme_Yasantilari
                  ?.Ogretme_Uygulamalari &&
                aiGeneratedPartial.Ogrenme_Ogretme_Yasantilari
                  .Ogretme_Uygulamalari.length > 0
                  ? aiGeneratedPartial.Ogrenme_Ogretme_Yasantilari
                      .Ogretme_Uygulamalari
                  : richCandidate.Ogrenme_Ogretme_Yasantilari
                      .Ogretme_Uygulamalari),
          Guduleme:
            currentPlan.Ogrenme_Ogretme_Yasantilari?.Guduleme &&
            currentPlan.Ogrenme_Ogretme_Yasantilari.Guduleme.length > 0 &&
            targetIssueId !== "bos-dikkat-guduleme"
              ? currentPlan.Ogrenme_Ogretme_Yasantilari.Guduleme
              : (completedFields.push("Güdüleme"),
                aiGeneratedPartial?.Ogrenme_Ogretme_Yasantilari?.Guduleme &&
                aiGeneratedPartial.Ogrenme_Ogretme_Yasantilari.Guduleme.length >
                  0
                  ? aiGeneratedPartial.Ogrenme_Ogretme_Yasantilari.Guduleme
                  : richCandidate.Ogrenme_Ogretme_Yasantilari.Guduleme),
          Dikkat_Cekme:
            currentPlan.Ogrenme_Ogretme_Yasantilari?.Dikkat_Cekme &&
            currentPlan.Ogrenme_Ogretme_Yasantilari.Dikkat_Cekme.length > 0 &&
            targetIssueId !== "bos-dikkat-guduleme"
              ? currentPlan.Ogrenme_Ogretme_Yasantilari.Dikkat_Cekme
              : (completedFields.push("Dikkat Çekme"),
                aiGeneratedPartial?.Ogrenme_Ogretme_Yasantilari?.Dikkat_Cekme &&
                aiGeneratedPartial.Ogrenme_Ogretme_Yasantilari.Dikkat_Cekme
                  .length > 0
                  ? aiGeneratedPartial.Ogrenme_Ogretme_Yasantilari.Dikkat_Cekme
                  : richCandidate.Ogrenme_Ogretme_Yasantilari.Dikkat_Cekme),
          Ek_Ogretme_Uygulamalari:
            currentPlan.Ogrenme_Ogretme_Yasantilari?.Ek_Ogretme_Uygulamalari &&
            currentPlan.Ogrenme_Ogretme_Yasantilari.Ek_Ogretme_Uygulamalari
              .length > 0 &&
            targetIssueId !== "bos-dikkat-guduleme"
              ? currentPlan.Ogrenme_Ogretme_Yasantilari.Ek_Ogretme_Uygulamalari
              : aiGeneratedPartial?.Ogrenme_Ogretme_Yasantilari
                  ?.Ek_Ogretme_Uygulamalari &&
                aiGeneratedPartial.Ogrenme_Ogretme_Yasantilari
                  .Ek_Ogretme_Uygulamalari.length > 0
              ? aiGeneratedPartial.Ogrenme_Ogretme_Yasantilari
                  .Ek_Ogretme_Uygulamalari
              : richCandidate.Ogrenme_Ogretme_Yasantilari
                  .Ek_Ogretme_Uygulamalari,
        },
        Farklilastirma:
          currentPlan.Farklilastirma?.trim() &&
          targetIssueId !== "bos-farklilastirma"
            ? currentPlan.Farklilastirma
            : (completedFields.push("Farklılaştırma"),
              aiGeneratedPartial?.Farklilastirma ||
                richCandidate.Farklilastirma),
      };

      res.json({
        success: true,
        updatedPlan,
        completedFields: Array.from(new Set(completedFields)),
        source: usedSource,
      });
    } catch (err: unknown) {
      console.error("Error in /api/autocomplete-plan-fields:", err);
      res.status(500).json({
        error: "Plan eksik alanları otomatik tamamlanırken bir hata oluştu.",
      });
    }
  });

  app.use(
    (
      err: Error & { status?: number; type?: string },
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (req.path.startsWith("/api/")) {
        const status = err.status || 500;
        res.status(status).json({
          error:
            err.type === "entity.too.large"
              ? "Gönderilen veri boyutu çok büyük. Lütfen tekrar deneyin."
              : err.message || "Sunucu isteği işlerken bir hata oluştu.",
        });
        return;
      }
      next(err);
    }
  );

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
