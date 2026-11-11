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
} from "./src/shared/maarifPlanEngine";

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
1) <yillik_plan>: Seçilen haftanın Öğrenme Birimi, Süresi, İçerik Çerçevesi ve SADECE o haftada işlenecek Öğrenme Çıktısı ile alt süreç bileşenleri (a, b veya c, ç veya d veya e) buradadır.
2) <ders_bilgi_formu>: Resmi MEB Ders Bilgi Formu verileridir (Alan Becerileri, Eğilimler, SDB, Değerler, OB, Disiplinler Arası İlişki, KB, Öğrenme Kanıtları, Temel Kabuller, Ön Değerlendirme Süreci, Köprü Kurma, Öğretme Uygulamaları).
3) <ders_materyali>: Seçilen haftanın süreç bileşenlerine ait Ders Kitabı / Ders Materyali konu anlatımı kesitidir.

GÖREVİN VE KESİN KURALLAR:
- Sabit program alanlarını (<ders_bilgi_formu> ve <yillik_plan> içindeki Sınıf, Ders, Öğrenme Birimi, Süre, Alan Becerileri, Eğilimler, SDB, Değerler, OB, Disiplinler Arası İlişki, KB, Öğrenme Çıktıları ve Süreç Bileşenleri, İçerik Çerçevesi, Öğrenme Kanıtları, Temel Kabuller, Ön Değerlendirme Süreci, Köprü Kurma, Öğretme Uygulamaları) KESİNLİKLE kaydırma veya başka bir dersin verisiyle değiştirme.
- <yillik_plan> içindeki seçilen haftanın Süreç Bileşenlerine (örn. a, b veya c, ç veya d veya e) ve <ders_materyali> içindeki konu anlatımına dayanarak o haftaya özel şu 3 bölümü en yüksek pedagojik kalitede üret:
  1) 'Guduleme' (4 madde):
     - İlk madde mutlaka "Bu derste ... öğreneceksiniz." ile başlamalıdır.
     - Diğer 3 madde "... kavrayacaksınız.", "... keşfedeceksiniz.", "... kazanacaksınız." gibi gelecek zaman kipiyle doğrudan öğrenciye hitap etmeli ve SADECE o haftanın süreç bileşenlerini/konusunu anlatmalıdır.
  2) 'Dikkat_Cekme' (4 madde):
     - Doğrudan o haftanın <ders_materyali> konusuna ve süreç bileşenlerine yönelik, öğrencide merak uyandıran 4 özgün soru cümlesi ('?' ile biten) olmalıdır.
  3) 'Ek_Ogretme_Uygulamalari' (6 madde):
     - O haftanın <ders_materyali> konusunun sınıfta, laboratuvarda veya atölyede nasıl işleneceğini anlatan ("... şematik kesitler incelenebilir", "... karşılaştırmalı olarak analiz edebilir", "... somut saha verileriyle açıklanabilir", "... örnek senaryolar üzerinden tartışılabilir", "... akılcı çözüm önerileri geliştirmeleri sağlanabilir", "... infografiklerle gösterilebilir") 6 somut uygulama maddesi olmalıdır.
     - HER MADDENİN SONUNDA mutlaka <aktif_maarif_kodlari> içinden seçilmiş 2 veya 3 kod parantez içinde yazılmalıdır (Örn: "(OB1, KB2.2).", "(OB8, E1.4).", "(KB3.2, D3.2).", "(D16.3, SDB3.3).", "(SDB2.2, E2.2, E2.3).", "(OB2, D12.3).").`;

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

function parseWeeksRegexFallback(text: string) {
  const lines = (text || "")
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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/\b(\d{1,2})\s*\.\s*HAFTA(?:\s*\(?([^)|]+)\)?)?/i);
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
        const contextSlice = lines.slice(i, i + 6).join(" | ");
        weeks.push({
          id: `week-${wNo}`,
          haftaNo: wNo,
          haftaEtiketi: `${wNo}. HAFTA`,
          tarihAraligi: datePart || "",
          onayTarihi: inferApprovalDate(datePart),
          ogrenmeBirimi: "",
          konuVeCiktiOzeti: contextSlice.slice(0, 200),
          sure: "",
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
      retryOptions: { attempts: 1 },
      timeout: 22000,
    },
  });

  const candidateModels = [
    { name: "gemini-3-flash-preview", useThinkingConfig: true, maxMs: 21000 },
    { name: "gemini-flash-lite-latest", useThinkingConfig: false, maxMs: 14000 },
    { name: "gemini-flash-latest", useThinkingConfig: false, maxMs: 10000 },
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
  const PORT = Number(process.env.PORT) || 3000;

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
        15000
      )}\n</yillik_plan>`;

      const rawJson = await generateWithFallback(
        apiKey,
        weekPrompt,
        "Sen MEB Ünitelendirilmiş Yıllık Plan tablolarından hafta, tarih aralığı, öğrenme birimi ve öğrenme çıktısı (kazanım ve a, b, c süreç bileşenleri) listesini birebir çıkaran bir uzmansın.",
        WEEKS_EXTRACTION_SCHEMA
      );

      const parsed = JSON.parse(rawJson);
      const weeks = Array.isArray(parsed.weeks)
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
        : parseWeeksRegexFallback(yillik_plan);

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

      // 1. Run our deterministic Maarif Plan Engine on the input tags
      const structuredDbf = parseDersBilgiFormuStructured(
        ders_bilgi_formu,
        yillik_plan
      );

      // Also check if the client already pre-extracted verbatim sub-tags inside <ders_bilgi_formu> and <yillik_plan>
      if (isXmlString) {
        const preKanitlar = extractXmlTag(body, "ogrenme_kanitlari_tam_metin");
        if (preKanitlar && preKanitlar.length > structuredDbf.ogrenmeKanitlari.length) {
          structuredDbf.ogrenmeKanitlari = preKanitlar;
        }
        const preKabuller = extractXmlTag(body, "temel_kabuller_tam_metin");
        if (preKabuller && preKabuller.length > structuredDbf.temelKabuller.length) {
          structuredDbf.temelKabuller = preKabuller;
        }
        const preOnDeg = extractXmlTag(body, "on_degerlendirme_sureci_tam_metin");
        if (preOnDeg && preOnDeg.length > structuredDbf.onDegerlendirmeSureci.length) {
          structuredDbf.onDegerlendirmeSureci = preOnDeg;
        }
        const preKopru = extractXmlTag(body, "kopru_kurma_tam_metin");
        if (preKopru && preKopru.length > structuredDbf.kopruKurma.length) {
          structuredDbf.kopruKurma = preKopru;
        }
      }

      const weekData = extractWeekPlanStructured(
        yillik_plan,
        hafta_etiketi,
        tarih_araligi,
        structuredDbf
      );

      if (isXmlString) {
        const preOutcomeBlock = extractXmlTag(
          body,
          "secilen_hafta_ogrenme_ciktilari_ve_surec_bilesenleri"
        );
        if (preOutcomeBlock && preOutcomeBlock.length >= 10) {
          weekData.formattedOutcomeAndProcessBlock = preOutcomeBlock;
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
      let aiCandidatePlan = null;

      if (apiKey) {
        try {
          const xmlPromptForGemini = `<ders_plani_baglam_paketi>
<hedef_hafta_ve_ust_bilgiler>
  <sinif>${sinif_duzeyi || structuredDbf.sinif}</sinif>
  <ders>${ders_ismi || structuredDbf.ders}</ders>
  <hafta>${weekData.haftaEtiketi} (${tarih_araligi})</hafta>
  <sure>${weekData.sure}</sure>
</hedef_hafta_ve_ust_bilgiler>

<yillik_plan baglam="Bu metin Ünitelendirilmiş Yıllık Plandır. Seçilen haftanın Öğrenme Birimi, İçerik Çerçevesi ve SADECE o haftaya ait Öğrenme Çıktısı ile Süreç Bileşenleri buradadır.">
  <ogrenme_birimi>${weekData.ogrenmeBirimi}</ogrenme_birimi>
  <icerik_cercevesi>${weekData.icerikCercevesi}</icerik_cercevesi>
  <ogrenme_ciktilari_ve_surec_bilesenleri>
${weekData.formattedOutcomeAndProcessBlock}
  </ogrenme_ciktilari_ve_surec_bilesenleri>
</yillik_plan>

<ders_bilgi_formu baglam="Bu metin MEB Ders Bilgi Formudur. Alan becerileri, eğilimler, programlar arası bileşenler ve aktif Maarif kodları buradadır.">
  <alan_becerileri>${structuredDbf.alanBecerileri}</alan_becerileri>
  <egilimler>${structuredDbf.egilimler}</egilimler>
  <sosyal_duygusal_ogrenme_becerileri>${structuredDbf.sosyalDuygusalBeceriler}</sosyal_duygusal_ogrenme_becerileri>
  <degerler>${structuredDbf.degerler}</degerler>
  <okuryazarlik_becerileri>${structuredDbf.okuryazarlikBecerileri}</okuryazarlik_becerileri>
  <disiplinler_arasi_iliski>${structuredDbf.disiplinlerArasiIliski}</disiplinler_arasi_iliski>
  <beceriler_arasi_iliski>${structuredDbf.becerilerArasiIliski}</beceriler_arasi_iliski>
  <aktif_maarif_kodlari>${
    structuredDbf.rawActivityCodes.join(", ") ||
    "OB1, OB2, OB8, KB2.2, KB3.2, E1.4, E2.2, E2.3, E3.2, SDB2.2, SDB3.3, D3.2, D12.3, D16.3, D18.3"
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
        } catch (aiErr: unknown) {
          const msg = aiErr instanceof Error ? aiErr.message : String(aiErr);
          console.warn(
            "Gemini generation fallback to deterministic engine:",
            msg
          );
        }
      }

      // 2. Enforce 1:1 verbatim integrity for Ders Bilgi Formu & Yıllık Plan fields + merge week-specific AI synthesis for Ders Materyali fields
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

      res.json({ plan: finalPlan });
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
