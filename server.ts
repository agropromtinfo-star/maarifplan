import "dotenv/config";
import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { extractText } from "unpdf";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

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
Sana her çağrıda birbirinden farklı işleve sahip 3 ayrı kaynak doküman, açık bağlam etiketleriyle (Context Blocks) sunulacaktır:

1) [BAĞLAM 1 - ÜNİTELENDİRİLMİŞ YILLIK PLAN (yillik_plan)]:
   - Bu metin dersin haftalık zaman çizelgesidir.
   - Kullanıcının seçtiği HAFTA ve TARİH ARALIĞI'nda hangi 'Öğrenme Birimi', hangi 'Öğrenme Çıktıları ve Süreç Bileşenleri (a, b, c...)', hangi 'İçerik Çerçevesi (Konu)', kaç ders saati ('Süre') ve hangi Maarif bileşenlerinin işleneceğini belirleyen birincil zaman tablosudur.

2) [BAĞLAM 2 - DERS BİLGİ FORMU / ÖĞRETİM PROGRAMI (ders_bilgi_formu)]:
   - Bu metin MEB Türkiye Yüzyılı Maarif Modeli resmi öğretim programı / ders bilgi formudur.
   - Seçilen haftanın Öğrenme Birimi ve Öğrenme Çıktısına ait resmi 'Öğrenme Çıktıları ve Süreç Bileşenleri', 'Alan Becerileri', 'Eğilimler (E...)', 'Programlar Arası Bileşenler (SDB..., D..., OB..., Disiplinler Arası İlişki, KB...)', 'Öğrenme Kanıtları (Ölçme-Değerlendirme)', 'Temel Kabuller', 'Ön Değerlendirme Süreci', 'Köprü Kurma', 'Öğretme-Öğrenme Uygulamaları' ve 'Farklılaştırma' metinlerinin birincil resmi kaynağıdır.

3) [BAĞLAM 3 - DERS MATERYALİ / DERS KİTABI / MODÜL (ders_materyali)]:
   - Bu metin o hafta derste işlenecek konu anlatımı, ders kitabı bölümü, modül veya atölye/laboratuvar uygulama föyüdür.
   - Bu doküman; konuya özgü 'Güdüleme' (4 madde), 'Dikkat Çekme' (4 düşündürücü soru), 'Ek Öğretme Uygulamaları' (sonunda parantez içi Maarif kodları olan 5 somut sınıf/atölye/laboratuvar uygulaması) üretmek ve 'Öğretme Uygulamaları' ile 'Öğrenme Kanıtları' bölümlerini konunun teknik detaylarıyla zenginleştirmek için kullanılır.

KESİN VERİ İŞLEME KURALLARI:
- Öğrenme çıktılarını, kazanım kodlarını (örn: BÜY.1.1., TAR.1.1., BİL.9.1.2. vb.) ve a), b), c) süreç bileşenlerini ASLA uydurma; doğrudan BAĞLAM 1 (Yıllık Plan) ve BAĞLAM 2 (Ders Bilgi Formu) metinlerinden seçilen hafta için birebir al.
- Eğilimler (E...), Sosyal-Duygusal Öğrenme Becerileri (SDB...), Değerler (D...), Okuryazarlık Becerileri (OB...) ve Beceriler Arası İlişki (KB...) kodlarını ve isimlerini BAĞLAM 1 ve BAĞLAM 2'den birebir koru.
- 'Ogretme_Uygulamalari' maddelerinin sonunda yer alan parantez içi bileşen kodlarını (örn: "(KB2.11, E2.2, E3.2, D12.3, D16.3, D18.3, SDB2.2, SDB3.3, OB1)") BAĞLAM 2 (Ders Bilgi Formu) ve BAĞLAM 1 (Yıllık Plan) metninden koruyarak aktar ve BAĞLAM 3 (Ders Materyali) ile bütünleştir.`;

const LESSON_PLAN_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    Ders_Bilgisi: {
      type: Type.OBJECT,
      properties: {
        Sinif: {
          type: Type.STRING,
          description:
            "BAĞLAM 1 (Yıllık Plan) ve BAĞLAM 2 (Ders Bilgi Formu) içinden alınan Sınıf düzeyi (Örn: '9. SINIF').",
        },
        Ders: {
          type: Type.STRING,
          description:
            "BAĞLAM 1 (Yıllık Plan) ve BAĞLAM 2 (Ders Bilgi Formu) içinden alınan Dersin tam adı (Örn: 'TARIM (BİTKİ ÜRETİM YÖNTEMLERİ)').",
        },
        Ogrenme_Birimi: {
          type: Type.STRING,
          description:
            "Seçilen hafta için BAĞLAM 1 (Yıllık Plan) ve BAĞLAM 2 (Ders Bilgi Formu) içinden alınan Öğrenme Birimi (Örn: 'Generatif üretim').",
        },
        Sure: {
          type: Type.STRING,
          description:
            "Seçilen hafta için BAĞLAM 1 (Yıllık Plan) içinden alınan ders saati süresi (Örn: '3 Ders Saati').",
        },
        Alan_Becerileri: {
          type: Type.STRING,
          description:
            "BAĞLAM 1 (Yıllık Plan) ve BAĞLAM 2 (Ders Bilgi Formu) içinden alınan Alan Becerileri (Örn: 'Bitkilerde üretim yapma').",
        },
        Egilimler: {
          type: Type.STRING,
          description:
            "BAĞLAM 1 ve BAĞLAM 2 içinden kodları ve adlarıyla alınan Eğilimler (Örn: 'E2.2. Sorumluluk, E3.2. Odaklanma').",
        },
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
        Sosyal_Duygusal_Ogrenme_Becerileri: {
          type: Type.STRING,
          description:
            "BAĞLAM 1 ve BAĞLAM 2 içinden kodları ve adlarıyla alınan Sosyal-Duygusal Öğrenme Becerileri (Örn: 'SDB2.2. İş Birliği Becerisi, SDB3.3. Sorumlu Karar Verme Becerisi').",
        },
        Degerler: {
          type: Type.STRING,
          description:
            "BAĞLAM 1 ve BAĞLAM 2 içinden kodları ve adlarıyla alınan Değerler (Örn: 'D12. Sabır, D16. Sorumluluk, D18. Temizlik').",
        },
        Okuryazarlik_Becerileri: {
          type: Type.STRING,
          description:
            "BAĞLAM 1 ve BAĞLAM 2 içinden kodları ve adlarıyla alınan Okuryazarlık Becerileri (Örn: 'OB1. Bilgi okuryazarlığı').",
        },
        Disiplinler_Arasi_Iliski: {
          type: Type.STRING,
          description:
            "BAĞLAM 1 ve BAĞLAM 2 içinden alınan Disiplinler Arası İlişki (Örn: 'Fen Bilimleri').",
        },
        Beceriler_Arasi_Iliski: {
          type: Type.STRING,
          description:
            "BAĞLAM 1 ve BAĞLAM 2 içinden kodları ve adlarıyla alınan Beceriler Arası İlişki / Kavramsal Beceriler (Örn: 'KB2.11. Gözleme Dayalı Tahmin Etme Becerisi, KB3.2. Problem Çözme Becerisi').",
        },
      },
      required: [
        "Sosyal_Duygusal_Ogrenme_Becerileri",
        "Degerler",
        "Okuryazarlik_Becerileri",
        "Disiplinler_Arasi_Iliski",
        "Beceriler_Arasi_Iliski",
      ],
    },
    Ogrenme_Ciktilari_ve_Surec_Bilesenleri: {
      type: Type.STRING,
      description:
        "Seçilen hafta için doğrudan BAĞLAM 1 (Yıllık Plan) ve BAĞLAM 2 (Ders Bilgi Formu) metinlerinden birebir alınan Öğrenme Çıktısı (kazanım kodu ve cümlesi) ile alt satırlardaki a), b), c) Süreç Bileşenleri. Örn:\nBÜY.1.1. Generatif bitki organlarını sıralar.\na) Generatif üretim açıklanır.\nb) Çiçek tipleri sıralanır.",
    },
    Icerik_Cercevesi: {
      type: Type.STRING,
      description:
        "Seçilen hafta için BAĞLAM 1 (Yıllık Plan) ve BAĞLAM 2 (Ders Bilgi Formu) içinden alınan İçerik Çerçevesi / Konu başlığı (Örn: 'Generatif Bitki Organları').",
    },
    Ogrenme_Kanitlari: {
      type: Type.STRING,
      description:
        "BAĞLAM 2 (Ders Bilgi Formu) ve BAĞLAM 1 (Yıllık Plan) içindeki Öğrenme Kanıtları / Ölçme-Değerlendirme açıklamalarının, BAĞLAM 3 (Ders Materyali) konusuyla bütünleştirilmiş kapsamlı paragrafı.",
    },
    Ogrenme_Ogretme_Yasantilari: {
      type: Type.OBJECT,
      properties: {
        Temel_Kabuller: {
          type: Type.STRING,
          description:
            "BAĞLAM 2 (Ders Bilgi Formu) ve BAĞLAM 1 (Yıllık Plan) içinden alınan Temel Kabuller cümlesi.",
        },
        On_Degerlendirme_Sureci: {
          type: Type.STRING,
          description:
            "BAĞLAM 2 (Ders Bilgi Formu) ve BAĞLAM 1 (Yıllık Plan) içinden alınan Ön Değerlendirme Süreci cümlesi.",
        },
        Kopru_Kurma: {
          type: Type.STRING,
          description:
            "BAĞLAM 2 (Ders Bilgi Formu) ve BAĞLAM 1 (Yıllık Plan) içinden alınan Köprü Kurma cümlesi.",
        },
        Ogretme_Uygulamalari: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "BAĞLAM 2 (Ders Bilgi Formu) ve BAĞLAM 1 (Yıllık Plan) içindeki Öğretme-Öğrenme Uygulamaları maddeleri ile BAĞLAM 3 (Ders Materyali) uygulama adımlarının birleşimi (başında * olmadan düz metin; parantez içi KB, E, D, SDB, OB kodları korunarak).",
        },
        Guduleme: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "BAĞLAM 3 (Ders Materyali) ve seçilen haftanın öğrenme çıktısına dayalı, öğrenciyi derse ve mesleki uygulamaya güdüleyen 4 madde (başında * olmadan düz metin).",
        },
        Dikkat_Cekme: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "BAĞLAM 3 (Ders Materyali) konusuna dayalı, öğrencinin ilgisini derse çeken 4 düşündürücü soru maddesi (başında * olmadan düz metin).",
        },
        Ek_Ogretme_Uygulamalari: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "BAĞLAM 3 (Ders Materyali) içeriğine dayalı 5 somut sınıf/laboratuvar/atölye ek öğretme uygulaması maddesi; her maddenin sonunda parantez içinde ilgili Maarif Modeli kodları (örn: '(E3.2, OB1)', '(KB2.11)', '(D16.3, D18.3)') yer almalıdır.",
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
    Farklilastirma: {
      type: Type.STRING,
      description:
        "BAĞLAM 2 (Ders Bilgi Formu) veya BAĞLAM 1 (Yıllık Plan) içinde yer alan Zenginleştirme ve Destekleme (Farklılaştırma) açıklamaları.",
    },
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
    okulAdi: {
      type: Type.STRING,
      description: "Yıllık plan başlığında geçiyorsa okul adı, yoksa boş string.",
    },
    dersIsmi: {
      type: Type.STRING,
      description: "Yıllık plan başlığında geçiyorsa dersin adı, yoksa boş string.",
    },
    sinifDuzeyi: {
      type: Type.STRING,
      description: "Yıllık plan başlığında geçiyorsa sınıf düzeyi (Örn: '9. SINIF'), yoksa boş string.",
    },
    egitimOgretimYili: {
      type: Type.STRING,
      description: "Yıllık planda geçiyorsa eğitim öğretim yılı (Örn: '2026-2027'), yoksa boş string.",
    },
    weeks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          haftaNo: {
            type: Type.INTEGER,
            description: "Hafta sırası (1, 2, 3... 36).",
          },
          haftaEtiketi: {
            type: Type.STRING,
            description: "Hafta etiketi (Örn: '1. HAFTA').",
          },
          tarihAraligi: {
            type: Type.STRING,
            description: "Yıllık planda o hafta için yazan tarih aralığı (Örn: '14 - 18 Eylül' veya '21 - 25 Eylül').",
          },
          onayTarihi: {
            type: Type.STRING,
            description: "O haftanın ilk gününün GG/AA/YYYY formatında tarihi (Örn: '14/09/2026').",
          },
          ogrenmeBirimi: {
            type: Type.STRING,
            description: "O haftanın Öğrenme Birimi / Ünite adı (Örn: 'Generatif üretim').",
          },
          konuVeCiktiOzeti: {
            type: Type.STRING,
            description: "O haftanın Öğrenme Çıktısı / Kazanımı (a, b, c süreç bileşenleri dahil) ve İçerik Çerçevesi özeti.",
          },
          sure: {
            type: Type.STRING,
            description: "O haftanın ders saati süresi (Örn: '3 Ders Saati').",
          },
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

function truncateSafely(text: string, maxChars = 45000): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return (
    trimmed.slice(0, maxChars) +
    "\n\n[...Belgenin devamı uzunluk sınırından dolayı kısaltıldı...]"
  );
}

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

// Fast regex fallback parser for weeks in Yıllık Plan text
function parseWeeksRegexFallback(text: string) {
  const lines = text
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
 * Pre-extracts the focused window for the selected week & date range from 'yillik_plan'
 */
function extractSelectedWeekWindowFromYillikPlan(
  yillikPlanText: string,
  haftaEtiketi?: string,
  tarihAraligi?: string
): string {
  const lines = yillikPlanText.split(/\r?\n/);
  const weekNumMatch = (haftaEtiketi || "").match(/(\d{1,2})/);
  const targetWeekNo = weekNumMatch ? Number(weekNumMatch[1]) : null;
  const normalizedDate = (tarihAraligi || "").trim().toLowerCase();

  const matchedIndices: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    if (targetWeekNo !== null) {
      const weekRegex = new RegExp(
        `\\b${targetWeekNo}\\s*\\.\\s*hafta\\b`,
        "i"
      );
      if (weekRegex.test(line)) {
        matchedIndices.push(i);
        continue;
      }
    }

    if (normalizedDate.length >= 4 && lower.includes(normalizedDate)) {
      matchedIndices.push(i);
    }
  }

  if (matchedIndices.length === 0) {
    return yillikPlanText.slice(0, 4500).trim();
  }

  const excerpts: string[] = [];
  for (const idx of matchedIndices.slice(0, 3)) {
    const start = Math.max(0, idx - 3);
    let end = Math.min(lines.length, idx + 35);

    if (targetWeekNo !== null) {
      const nextWeekRegex = new RegExp(
        `\\b${targetWeekNo + 1}\\s*\\.\\s*hafta\\b`,
        "i"
      );
      for (let j = idx + 1; j < end; j++) {
        if (nextWeekRegex.test(lines[j])) {
          end = Math.min(lines.length, j + 2);
          break;
        }
      }
    }

    excerpts.push(lines.slice(start, end).join("\n").trim());
  }

  return excerpts.join("\n---\n");
}

/**
 * Extracts explicit Maarif Modeli Learning Outcome blocks (e.g., BÜY.1.1., TAR.1.2., FİZ.9.1.1. and a), b), c) process steps)
 * and Component codes (E..., SDB..., D..., OB..., KB...) from a document text.
 */
function extractDetectedOutcomesAndCodes(text: string): {
  outcomeBlocks: string[];
  maarifCodes: string[];
} {
  if (!text || !text.trim()) {
    return { outcomeBlocks: [], maarifCodes: [] };
  }

  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const outcomeBlocks: string[] = [];

  const outcomeCodeRegex =
    /\b(?:[A-ZÇĞİÖŞÜ]{2,8}\.)?\d{1,2}\.\d{1,2}(?:\.\d{1,2})?\.?\s+[A-ZÇĞİÖŞÜa-zçğıöşü]/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const isHeaderLine =
      /öğrenme\s+çıktı|süreç\s+bileşen|kazanım/i.test(line) &&
      line.length < 120;

    if (outcomeCodeRegex.test(line) || isHeaderLine) {
      const blockLines: string[] = [line];
      for (let j = i + 1; j < Math.min(lines.length, i + 12); j++) {
        const nextLine = lines[j];
        if (!nextLine) continue;
        if (
          /^[a-zçğıöşü]\)\s+/i.test(nextLine) ||
          outcomeCodeRegex.test(nextLine) ||
          nextLine.length < 180
        ) {
          blockLines.push(nextLine);
        } else {
          break;
        }
      }
      const joined = blockLines.join("\n");
      if (!outcomeBlocks.includes(joined)) {
        outcomeBlocks.push(joined);
      }
      if (outcomeBlocks.length >= 12) break;
    }
  }

  const codeMatches =
    text.match(/\b(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*\b/g) || [];
  const uniqueCodes = Array.from(new Set(codeMatches)).slice(0, 40);

  return {
    outcomeBlocks,
    maarifCodes: uniqueCodes,
  };
}

/**
 * Finds the most relevant section in a document matching the selected week's unit or learning outcome.
 */
function extractMatchingSectionFromDocument(
  docText: string,
  searchTerms: string[],
  windowLines = 45
): string {
  if (!docText || !docText.trim()) return "";
  const validTerms = searchTerms
    .map((t) => t.trim())
    .filter((t) => t.length >= 3);

  if (validTerms.length === 0) return "";

  const lines = docText.split(/\r?\n/);
  const matchedSnippets: string[] = [];

  for (const term of validTerms) {
    const lowerTerm = term.toLowerCase();
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(lowerTerm)) {
        const start = Math.max(0, i - 4);
        const end = Math.min(lines.length, i + windowLines);
        const snippet = lines.slice(start, end).join("\n").trim();
        if (snippet && !matchedSnippets.includes(snippet)) {
          matchedSnippets.push(snippet);
        }
        break;
      }
    }
    if (matchedSnippets.length >= 3) break;
  }

  return matchedSnippets.join("\n\n---\n\n");
}

interface ContextualPromptInputs {
  yillik_plan: string;
  ders_materyali: string;
  ders_bilgi_formu?: string;
  hafta_etiketi?: string;
  tarih_araligi?: string;
  onay_tarihi?: string;
  ders_ismi?: string;
  sinif_duzeyi?: string;
  okul_adi?: string;
  egitim_ogretim_yili?: string;
  secilen_hafta_verisi?: {
    haftaNo?: number;
    haftaEtiketi?: string;
    tarihAraligi?: string;
    ogrenmeBirimi?: string;
    konuVeCiktiOzeti?: string;
    sure?: string;
  };
  dosya_adlari?: {
    yillik_plan?: string | null;
    ders_materyali?: string | null;
    ders_bilgi_formu?: string | null;
  };
}

/**
 * Builds an explicitly contextualized multi-part prompt array so the model clearly understands
 * the distinct role, authority, and extracted focus sections of:
 * 1) 'yillik_plan' (Bu metin Ünitelendirilmiş Yıllık Plandır)
 * 2) 'ders_bilgi_formu' (Bu metin MEB Ders Bilgi Formudur / Öğretim Programıdır)
 * 3) 'ders_materyali' (Bu metin Ders Materyalidir / Ders Kitabı / Modül İçeriğidir)
 */
function buildContextualPromptParts(
  inputs: ContextualPromptInputs
): Array<{ text: string }> {
  const secilenHaftaEtiketi = (inputs.hafta_etiketi || "1. HAFTA").trim();
  const secilenTarihAraligi = (inputs.tarih_araligi || "").trim();
  const haftaVeTarihBasligi = secilenTarihAraligi
    ? `${secilenHaftaEtiketi} (${secilenTarihAraligi})`
    : secilenHaftaEtiketi;

  const yillikPlanWeekWindow = extractSelectedWeekWindowFromYillikPlan(
    inputs.yillik_plan,
    secilenHaftaEtiketi,
    secilenTarihAraligi
  );

  const weekWindowIntel = extractDetectedOutcomesAndCodes(yillikPlanWeekWindow);
  const fullYillikIntel = extractDetectedOutcomesAndCodes(inputs.yillik_plan);

  const outcomeSearchTerms: string[] = [];
  if (inputs.secilen_hafta_verisi?.ogrenmeBirimi) {
    outcomeSearchTerms.push(inputs.secilen_hafta_verisi.ogrenmeBirimi);
  }
  if (inputs.secilen_hafta_verisi?.konuVeCiktiOzeti) {
    const codeMatch = inputs.secilen_hafta_verisi.konuVeCiktiOzeti.match(
      /\b(?:[A-ZÇĞİÖŞÜ]{2,8}\.)?\d{1,2}\.\d{1,2}(?:\.\d{1,2})?\b/
    );
    if (codeMatch) outcomeSearchTerms.push(codeMatch[0]);
    outcomeSearchTerms.push(
      inputs.secilen_hafta_verisi.konuVeCiktiOzeti.slice(0, 45)
    );
  }
  for (const block of weekWindowIntel.outcomeBlocks) {
    const firstLine = block.split("\n")[0] || "";
    const codeMatch = firstLine.match(
      /\b(?:[A-ZÇĞİÖŞÜ]{2,8}\.)?\d{1,2}\.\d{1,2}(?:\.\d{1,2})?\b/
    );
    if (codeMatch) outcomeSearchTerms.push(codeMatch[0]);
    if (firstLine.length >= 6) outcomeSearchTerms.push(firstLine.slice(0, 40));
  }

  const hasDersBilgiFormu = Boolean(
    inputs.ders_bilgi_formu && inputs.ders_bilgi_formu.trim().length > 0
  );
  const dbfIntel = hasDersBilgiFormu
    ? extractDetectedOutcomesAndCodes(inputs.ders_bilgi_formu!)
    : { outcomeBlocks: [], maarifCodes: [] };
  const dbfFocusedSection = hasDersBilgiFormu
    ? extractMatchingSectionFromDocument(
        inputs.ders_bilgi_formu!,
        outcomeSearchTerms,
        60
      )
    : "";

  const materyalFocusedSection = extractMatchingSectionFromDocument(
    inputs.ders_materyali,
    outcomeSearchTerms,
    50
  );

  const part1TaskHeader = `====================================================================
GÖREV VE HEDEF HAFTA BAĞLAMI (PLANLANACAK DERSİN KİMLİĞİ)
====================================================================
Aşağıda sana 3 farklı pedagojik doküman her birinin bağlamı (context) açıkça belirtilerek sunulmaktadır:
- 1. Doküman Bağlamı: ÜNİTELENDİRİLMİŞ YILLIK PLAN (yillik_plan)
- 2. Doküman Bağlamı: MEB DERS BİLGİ FORMU / ÖĞRETİM PROGRAMI (ders_bilgi_formu)
- 3. Doküman Bağlamı: DERS MATERYALİ / DERS KİTABI / MODÜL (ders_materyali)

KULLANICININ PLANLAMAK İSTEDİĞİ HEDEF HAFTA VE ÜST BİLGİLER:
- Seçilen Hafta ve Tarih Aralığı: ${haftaVeTarihBasligi}
- Plan Onay Tarihi: ${inputs.onay_tarihi || "Belirtilmedi"}
- Okul Adı: ${inputs.okul_adi || "Yıllık plandan veya varsayılan başlıktan al"}
- Eğitim ve Öğretim Yılı: ${inputs.egitim_ogretim_yili || "2026-2027"}
- Ders İsmi: ${inputs.ders_ismi || "Yıllık Plan ve Ders Bilgi Formundan birebir al"}
- Sınıf Düzeyi: ${inputs.sinif_duzeyi || "Yıllık Plan ve Ders Bilgi Formundan birebir al"}
${
  inputs.secilen_hafta_verisi
    ? `- Seçilen Haftanın Yıllık Plandaki Ön Özeti:
  * Öğrenme Birimi: ${inputs.secilen_hafta_verisi.ogrenmeBirimi || "-"}
  * Konu ve Öğrenme Çıktısı Özeti: ${inputs.secilen_hafta_verisi.konuVeCiktiOzeti || "-"}
  * Ders Saati (Süre): ${inputs.secilen_hafta_verisi.sure || "-"}`
    : ""
}`;

  const part2YillikPlanContext = `====================================================================
BAĞLAM 1: BU METİN KULLANICININ YÜKLEDİĞİ 'ÜNİTELENDİRİLMİŞ YILLIK PLAN' (yillik_plan) DOKÜMANIDIR
${inputs.dosya_adlari?.yillik_plan ? `(Kaynak Dosya: ${inputs.dosya_adlari.yillik_plan})` : ""}
====================================================================
[BU DOKÜMANIN BAĞLAMI VE KULLANIM AMACI]:
Bu metin yıllık plandır. Dersin 36 haftalık zaman çizelgesini içerir.
Model olarak bu dokümandan şu verileri DOĞRUDAN ve BİREBİR çekmelisin:
1) Seçilen hafta (${haftaVeTarihBasligi}) satırında yer alan 'Öğrenme Birimi' ve 'Süre' (ders saati),
2) Seçilen haftaya ait 'Öğrenme Çıktıları ve Süreç Bileşenleri' (kazanım kodu, kazanım cümlesi ve a, b, c... alt süreç bileşenleri),
3) Seçilen haftaya ait 'İçerik Çerçevesi' (konu başlığı),
4) Yıllık plan tablosunda o hafta için belirtilen 'Alan Becerileri', 'Eğilimler (E...)', 'Sosyal-Duygusal Öğrenme Becerileri (SDB...)', 'Değerler (D...)', 'Okuryazarlık Becerileri (OB...)', 'Disiplinler Arası İlişki', 'Beceriler Arası İlişki (KB...)', 'Öğrenme Kanıtları' ve 'Öğretme-Öğrenme Uygulamaları'.

--- [1A] SEÇİLEN HAFTA (${haftaVeTarihBasligi}) İÇİN YILLIK PLANDAN AYRIŞTIRILAN ODAK KESİT ---
${yillikPlanWeekWindow}

${
  weekWindowIntel.outcomeBlocks.length > 0
    ? `--- [1B] SEÇİLEN HAFTA KESİTİNDE TESPİT EDİLEN ÖĞRENME ÇIKTILARI / KAZANIMLAR ---\n${weekWindowIntel.outcomeBlocks.join("\n\n")}\n`
    : ""
}
${
  weekWindowIntel.maarifCodes.length > 0 || fullYillikIntel.maarifCodes.length > 0
    ? `--- [1C] YILLIK PLANDA TESPİT EDİLEN MAARİF MODELİ BİLEŞEN KODLARI ---\n${
        (weekWindowIntel.maarifCodes.length > 0
          ? weekWindowIntel.maarifCodes
          : fullYillikIntel.maarifCodes
        ).join(", ")
      }\n`
    : ""
}
--- [1D] ÜNİTELENDİRİLMİŞ YILLIK PLAN (yillik_plan) METNİ ---
${truncateSafely(inputs.yillik_plan, 35000)}`;

  const part3DersBilgiFormuContext = hasDersBilgiFormu
    ? `====================================================================
BAĞLAM 2: BU METİN KULLANICININ YÜKLEDİĞİ 'MEB DERS BİLGİ FORMU / ÖĞRETİM PROGRAMI' (ders_bilgi_formu) DOKÜMANIDIR
${inputs.dosya_adlari?.ders_bilgi_formu ? `(Kaynak Dosya: ${inputs.dosya_adlari.ders_bilgi_formu})` : ""}
====================================================================
[BU DOKÜMANIN BAĞLAMI VE KULLANIM AMACI]:
Bu metin ders bilgi formudur (MEB Türkiye Yüzyılı Maarif Modeli resmi öğretim programı dokümanıdır).
Model olarak bu dokümandan şu verileri DOĞRUDAN ve BİREBİR çekmelisin:
1) Seçilen haftanın öğrenme birimine ve kazanım koduna ait tam 'Öğrenme Çıktıları ve Süreç Bileşenleri (a, b, c...)',
2) 'Alan Becerileri', 'Eğilimler (E...)', 'Sosyal-Duygusal Öğrenme Becerileri (SDB...)', 'Değerler (D...)', 'Okuryazarlık Becerileri (OB...)', 'Disiplinler Arası İlişki' ve 'Beceriler Arası İlişki (KB...)' tam adları ve kodları,
3) 'Öğrenme Kanıtları (Ölçme ve Değerlendirme)' bölümündeki resmi ölçme araçları paragrafı,
4) 'Öğrenme-Öğretme Yaşantıları' altındaki resmi 'Temel Kabuller', 'Ön Değerlendirme Süreci', 'Köprü Kurma' cümleleri,
5) 'Öğretme-Öğrenme Uygulamaları' altındaki resmi uygulama maddeleri (maddelerin sonundaki parantez içi KB, E, D, SDB, OB kodlarıyla birlikte),
6) 'Farklılaştırma (Zenginleştirme ve Destekleme)' açıklamaları.

${
  dbfFocusedSection
    ? `--- [2A] SEÇİLEN HAFTA/ÜNİTE İÇİN DERS BİLGİ FORMUNDAN EŞLEŞTİRİLEN ODAK BÖLÜM ---\n${dbfFocusedSection}\n`
    : ""
}
${
  dbfIntel.outcomeBlocks.length > 0
    ? `--- [2B] DERS BİLGİ FORMUNDA TESPİT EDİLEN ÖĞRENME ÇIKTILARI VE SÜREÇ BİLEŞENLERİ ---\n${dbfIntel.outcomeBlocks.join("\n\n")}\n`
    : ""
}
--- [2C] DERS BİLGİ FORMU (ders_bilgi_formu) METNİ ---
${truncateSafely(inputs.ders_bilgi_formu!, 35000)}`
    : `====================================================================
BAĞLAM 2: DERS BİLGİ FORMU (ders_bilgi_formu) BİLGİSİ
====================================================================
Kullanıcı ayrı bir 'ders_bilgi_formu' dosyası yüklemedi. Bu nedenle 'Öğrenme Çıktıları ve Süreç Bileşenleri', 'Programlar Arası Bileşenler', 'Öğrenme Kanıtları', 'Temel Kabuller', 'Ön Değerlendirme Süreci', 'Köprü Kurma' ve 'Öğretme Uygulamaları' alanlarını doğrudan BAĞLAM 1 (Ünitelendirilmiş Yıllık Plan) ve BAĞLAM 3 (Ders Materyali) metinlerinden çıkararak oluştur.`;

  const part4DersMateryaliContext = `====================================================================
BAĞLAM 3: BU METİN KULLANICININ YÜKLEDİĞİ 'DERS MATERYALİ / DERS KİTABI / MODÜL' (ders_materyali) DOKÜMANIDIR
${inputs.dosya_adlari?.ders_materyali ? `(Kaynak Dosya: ${inputs.dosya_adlari.ders_materyali})` : ""}
====================================================================
[BU DOKÜMANIN BAĞLAMI VE KULLANIM AMACI]:
Bu metin ders materyalidir (ders kitabı, modül, konu anlatımı veya uygulama föyüdür).
Model olarak bu dokümanı şu alanları üretmek ve zenginleştirmek için kullanmalısın:
1) 'Guduleme': Bu ders materyalindeki konunun gerçek yaşamda ve mesleki uygulamalarda öğrenciye ne kazandıracağını anlatan 4 güçlü güdüleme cümlesi,
2) 'Dikkat_Cekme': Bu ders materyalindeki kavramlar üzerinden öğrencileri düşündüren ve derse merak uyandıran 4 soru cümlesi,
3) 'Ek_Ogretme_Uygulamalari': Bu ders materyalindeki konuyu sınıf, atölye veya laboratuvarda somutlaştıran 5 ek uygulama maddesi (her maddenin sonuna BAĞLAM 1 ve BAĞLAM 2'deki ilgili Maarif bileşen kodlarını parantez içinde ekle; örn: "(E3.2, OB1)", "(KB2.11)", "(SDB2.2, E2.2)", "(D16.3, D18.3)"),
4) 'Ogretme_Uygulamalari' ve 'Ogrenme_Kanitlari': BAĞLAM 1 ve BAĞLAM 2'den alınan resmi çerçeveyi bu ders materyalindeki somut konu detaylarıyla bütünleştir.

${
  materyalFocusedSection
    ? `--- [3A] SEÇİLEN KONU İÇİN DERS MATERYALİNDEN EŞLEŞTİRİLEN ODAK KESİT ---\n${materyalFocusedSection}\n`
    : ""
}
--- [3B] DERS MATERYALİ (ders_materyali) METNİ ---
${truncateSafely(inputs.ders_materyali, 35000)}`;

  const part5SynthesisInstructions = `====================================================================
DOKÜMANLAR ARASI ÇAPRAZ EŞLEŞTİRME VE KONTROL LİSTESİ (ZORUNLU)
====================================================================
ADIM 1 (Hafta Tespiti): BAĞLAM 1 (Yıllık Plan) içinde "${haftaVeTarihBasligi}" haftasını bul. O haftanın Öğrenme Birimini, Süresini, İçerik Çerçevesini ve Öğrenme Çıktısını (kazanım kodunu ve a, b, c süreç bileşenlerini) tespit et.
ADIM 2 (Öğrenme Çıktısı ve Bileşen Doğrulaması): Tespit ettiğin Öğrenme Birimi ve Öğrenme Çıktısını BAĞLAM 2 (Ders Bilgi Formu) ile karşılaştır. Öğrenme Çıktısının tam metnini ve altındaki a), b), c) süreç bileşenlerini eksiksiz olarak 'Ogrenme_Ciktilari_ve_Surec_Bilesenleri' alanına yaz.
ADIM 3 (Yaşantılar ve Kanıtların Aktarımı): BAĞLAM 2 (Ders Bilgi Formu) ve BAĞLAM 1 (Yıllık Plan) içindeki 'Öğrenme Kanıtları', 'Temel Kabuller', 'Ön Değerlendirme Süreci', 'Köprü Kurma' ve 'Öğretme Uygulamaları' metinlerini (parantez içi bileşen kodlarını koruyarak) aktar.
ADIM 4 (Ders Materyali Sentezi): BAĞLAM 3 (Ders Materyali) içindeki konu anlatımını kullanarak 4 maddelik 'Guduleme', 4 soru maddelik 'Dikkat_Cekme' ve sonunda parantez içi Maarif kodları bulunan 5 maddelik 'Ek_Ogretme_Uygulamalari' bölümlerini oluştur.

Şimdi bu 3 bağlamı birleştirerek JSON şemasına birebir uygun Günlük Ders Planını üret.`;

  return [
    { text: part1TaskHeader },
    { text: part2YillikPlanContext },
    { text: part3DersBilgiFormuContext },
    { text: part4DersMateryaliContext },
    { text: part5SynthesisInstructions },
  ];
}

/**
 * Helper to extract a labeled value from contextual documents when synthesizing deterministically.
 */
function extractValueByLabel(
  corpus: string,
  labelRegex: RegExp,
  maxLength = 350
): string {
  const lines = corpus.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
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

/**
 * Deterministic Pedagogical Synthesizer Fallback:
 * If all Gemini API models simultaneously return 503 UNAVAILABLE / 504 DEADLINE_EXCEEDED during a Google Cloud spike,
 * this engine parses 'yillik_plan', 'ders_bilgi_formu', and 'ders_materyali' directly to build the complete MaarifLessonPlan
 * so the teacher NEVER gets a 503 error or proxy timeout.
 */
function synthesizePlanFromContextDocs(inputs: ContextualPromptInputs) {
  const secilenHaftaEtiketi = (inputs.hafta_etiketi || "1. HAFTA").trim();
  const secilenTarihAraligi = (inputs.tarih_araligi || "").trim();

  const weekWindow = extractSelectedWeekWindowFromYillikPlan(
    inputs.yillik_plan,
    secilenHaftaEtiketi,
    secilenTarihAraligi
  );

  const dbfText = (inputs.ders_bilgi_formu || "").trim();
  const materyalText = (inputs.ders_materyali || "").trim();
  const combinedCurriculum = `${weekWindow}\n\n${dbfText}\n\n${inputs.yillik_plan}`;

  const weekIntel = extractDetectedOutcomesAndCodes(weekWindow);
  const dbfIntel = extractDetectedOutcomesAndCodes(dbfText);
  const fullIntel = extractDetectedOutcomesAndCodes(combinedCurriculum);

  // 1. Sınıf & Ders
  const sinif =
    (inputs.sinif_duzeyi || "").trim() ||
    extractValueByLabel(combinedCurriculum, /\bsınıf(?:\s*düzeyi)?\b/i, 40) ||
    "9. SINIF";

  const ders =
    (inputs.ders_ismi || "").trim() ||
    extractValueByLabel(combinedCurriculum, /\bders(?:in)?\s*adı\b|\bders\b/i, 90) ||
    "MESLEK VE ATÖLYE DERSİ";

  // 2. Öğrenme Birimi & Süre
  const ogrenmeBirimi =
    inputs.secilen_hafta_verisi?.ogrenmeBirimi?.trim() ||
    extractValueByLabel(
      combinedCurriculum,
      /\böğrenme\s*birimi\b|\bünite(?:\/tema)?\b|\bmodül\b/i,
      120
    ) ||
    extractValueByLabel(materyalText, /\bünite\b|\bbölüm\b|\bkonu\b/i, 120) ||
    "Mesleki Temel Uygulamalar";

  const sureMatch =
    inputs.secilen_hafta_verisi?.sure?.trim() ||
    weekWindow.match(/\b(\d{1,2}\s*(?:Ders\s*)?Saat[i]?)\b/i)?.[1] ||
    extractValueByLabel(combinedCurriculum, /\bsüre\b|\bders\s*saati\b/i, 40) ||
    "3 Ders Saati";
  const sure = /saat/i.test(sureMatch) ? sureMatch : `${sureMatch} Ders Saati`;

  // 3. Alan Becerileri & Eğilimler
  const abMatches =
    combinedCurriculum.match(
      /\bAB\d+(?:\.\d+)*\.?\s*[A-ZÇĞİÖŞÜa-zçğıöşü\s,()-]{3,80}/g
    ) || [];
  const alanBecerileri =
    extractValueByLabel(combinedCurriculum, /\balan\s*becerileri\b/i, 200) ||
    (abMatches.length > 0 ? abMatches.slice(0, 3).join(", ") : "") ||
    `${ogrenmeBirimi} alanında uygulama yapma`;

  const eMatches =
    combinedCurriculum.match(
      /\bE\d+\.\d+\.?\s*[A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,45}/g
    ) || [];
  const egilimler =
    extractValueByLabel(combinedCurriculum, /\beğilimler\b/i, 200) ||
    (eMatches.length > 0
      ? Array.from(new Set(eMatches.map((s) => s.trim()))).slice(0, 4).join(", ")
      : "E2.2. Sorumluluk, E3.2. Odaklanma");

  // 4. Programlar Arası Bileşenler
  const sdbMatches =
    combinedCurriculum.match(
      /\bSDB\d+\.\d+\.?\s*[A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,55}/g
    ) || [];
  const sdb =
    extractValueByLabel(
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
    extractValueByLabel(combinedCurriculum, /\bdeğerler\b/i, 200) ||
    (dMatches.length > 0
      ? Array.from(new Set(dMatches.map((s) => s.trim()))).slice(0, 5).join(", ")
      : "D12. Sabır, D16. Sorumluluk, D18. Temizlik");

  const obMatches =
    combinedCurriculum.match(
      /\bOB\d+(?:\.\d+)?\.?\s*[A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,45}/g
    ) || [];
  const okuryazarlik =
    extractValueByLabel(combinedCurriculum, /\bokuryazarlık\s*becerileri\b/i, 200) ||
    (obMatches.length > 0
      ? Array.from(new Set(obMatches.map((s) => s.trim()))).slice(0, 3).join(", ")
      : "OB1. Bilgi okuryazarlığı");

  const disiplinlerArasi =
    extractValueByLabel(
      combinedCurriculum,
      /\bdisiplinler\s*arası\s*ilişki(?:ler)?\b/i,
      160
    ) || "Fen Bilimleri, Teknoloji ve Tasarım";

  const kbMatches =
    combinedCurriculum.match(
      /\bKB\d+\.\d+\.?\s*[A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,60}/g
    ) || [];
  const becerilerArasi =
    extractValueByLabel(
      combinedCurriculum,
      /\bbeceriler\s*arası\s*ilişki(?:ler)?\b|\bkavramsal\s*beceriler\b/i,
      220
    ) ||
    (kbMatches.length > 0
      ? Array.from(new Set(kbMatches.map((s) => s.trim()))).slice(0, 4).join(", ")
      : "KB2.11. Gözleme Dayalı Tahmin Etme Becerisi, KB3.2. Problem Çözme Becerisi");

  // 5. Öğrenme Çıktıları ve Süreç Bileşenleri
  const bestOutcomeBlock =
    weekIntel.outcomeBlocks[0] ||
    dbfIntel.outcomeBlocks[0] ||
    fullIntel.outcomeBlocks[0] ||
    inputs.secilen_hafta_verisi?.konuVeCiktiOzeti ||
    extractValueByLabel(
      combinedCurriculum,
      /\böğrenme\s*çıktıları(?:\s*ve\s*süreç\s*bileşenleri)?\b|\bkazanım(?:lar)?\b/i,
      400
    ) ||
    `${ogrenmeBirimi} ile ilgili temel kavram ve uygulama basamaklarını açıklar.\na) ${ogrenmeBirimi} kavramı ve kapsamı açıklanır.\nb) Uygulama basamakları ve süreç bileşenleri sıralanır.`;

  // 6. İçerik Çerçevesi
  const icerikCercevesi =
    extractValueByLabel(
      combinedCurriculum,
      /\biçerik\s*çerçevesi\b|\bkonu(?:\s*başlığı)?\b/i,
      180
    ) ||
    inputs.secilen_hafta_verisi?.konuVeCiktiOzeti?.split("|")[0]?.trim() ||
    ogrenmeBirimi;

  // 7. Öğrenme Kanıtları
  const extractedKanit = extractValueByLabel(
    combinedCurriculum,
    /\böğrenme\s*kanıtları\b|\bölçme\s*ve\s*değerlendirme\b/i,
    1200
  );
  const ogrenmeKanitlari =
    extractedKanit.length > 80
      ? extractedKanit
      : `Öğrenci performansını belirlemeye yönelik çalışmalar değerlendirilirken gözlem formu, akran değerlendirme, öz değerlendirme, derecelendirme ölçeği ve dereceli puanlama anahtarı (rubrik) gibi ölçme araçlarından uygun olanlar seçilerek kullanılabilir. "${icerikCercevesi}" konusu kapsamındaki uygulamalarda işlem basamakları gözlem formları ile takip edilebilir. Öz değerlendirme ve akran değerlendirme formları kullanılarak öğrencilerin öğretim sürecine aktif katılımları ve ekip çalışması becerileri değerlendirilebilir. Atölye, laboratuvar veya sınıf ortamında yapılacak uygulamalarda ölçme süreci, öğrencilerin iş sağlığı ve güvenliği kurallarına uygun davranmaları ve materyal kullanımlarına göre detaylandırılabilir. Bu ölçme yöntemleri, sürecin her aşamasında geri bildirim sağlamak ve öğrencilerin gelişimlerini sistematik bir şekilde izlemek için kullanılabilir.`;

  // 8. Temel Kabuller, Ön Değerlendirme Süreci, Köprü Kurma
  const temelKabuller =
    extractValueByLabel(combinedCurriculum, /\btemel\s*kabuller\b/i, 450) ||
    `Öğrencilerin "${ogrenmeBirimi}" ve "${icerikCercevesi}" konusuyla ilgili günlük yaşamdan temel kavramlara ve ön gözlemlere sahip oldukları kabul edilmektedir.`;

  const onDegerlendirme =
    extractValueByLabel(
      combinedCurriculum,
      /\bön\s*değerlendirme(?:\s*süreci)?\b/i,
      450
    ) ||
    `Öğrencilerin "${icerikCercevesi}" konusuyla ilgili temel kavramları tanımaları, önceki gözlemlerini paylaşmaları ve işlevleri hakkında bilgi vermeleri istenebilir.`;

  const kopruKurma =
    extractValueByLabel(combinedCurriculum, /\bköprü\s*kurma\b/i, 450) ||
    `Günlük yaşamda ve mesleki uygulamalarda karşılaşılan örnekler üzerinden "${ogrenmeBirimi}" ile "${icerikCercevesi}" arasındaki ilişki kurularak yeni öğrenilecek konuya geçiş yapılır.`;

  // 9. Extract sentences from Ders Materyali & Ders Bilgi Formu for Öğretme Uygulamaları
  const materyalSentences = materyalText
    .split(/(?<=[.!?])\s+|\r?\n/)
    .map((s) => s.replace(/^[*•\-–\d.)\s]+/, "").trim())
    .filter((s) => s.length >= 35 && s.length <= 320);

  const dbfUygulamaSection = extractMatchingSectionFromDocument(
    combinedCurriculum,
    ["Öğretme-Öğrenme Uygulamaları", "Öğretme Uygulamaları", icerikCercevesi],
    30
  );
  const dbfUygulamaLines = dbfUygulamaSection
    .split(/\r?\n/)
    .map((l) => l.replace(/^[*•\-–\s]+/, "").trim())
    .filter((l) => l.length >= 35 && l.length <= 340)
    .slice(0, 6);

  const codeSuffix =
    fullIntel.maarifCodes.length > 0
      ? `(${fullIntel.maarifCodes.slice(0, 8).join(", ")})`
      : "(KB2.11, E2.2, E3.2, D12, D16, D18, SDB2.2, SDB3.3, OB1)";

  const ogretmeUygulamalari: string[] = [
    `${ogrenmeBirimi} — ${icerikCercevesi}:`,
    ...dbfUygulamaLines,
    ...materyalSentences.slice(0, 4),
    `Bu öğrenme birimi işlenirken öğrencilere farklı kaynaklardan "${icerikCercevesi}" konusu ve uygulama yöntemleri hakkında araştırma ve inceleme görevi verilir.`,
    `Gruplara ayrılan öğrencilerin uygulama işlemlerini iş birliği içinde yürütmeleri ve yaptıkları tüm gözlem ve işlemleri sistematik şekilde kayıt altına almaları sağlanır ${codeSuffix}.`,
    `Bu süreçte öz değerlendirme, akran değerlendirme formları ve dereceli puanlama anahtarı (rubrik) kullanılarak öğrencilerin araştırma, planlama, uygulama, iş birliği ve kayıt tutma becerileri değerlendirilebilir ${codeSuffix}.`,
  ].slice(0, 12);

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
    extractValueByLabel(
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

/**
 * Fast, proxy-safe multi-model generator:
 * Disables the SDK's slow 5-retry loop (retryOptions: { attempts: 1 }) and cascades quickly
 * across gemini-3.8-flash -> gemini-flash-latest -> gemini-3.1-flash-lite within a 25s total budget.
 */
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
      timeout: 18000,
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  const candidateModels = [
    { name: "gemini-3.8-flash", useThinkingConfig: true },
    { name: "gemini-flash-latest", useThinkingConfig: false },
    { name: "gemini-3.1-flash-lite", useThinkingConfig: false },
  ];

  let lastError: unknown = null;

  for (const candidate of candidateModels) {
    try {
      const response = await ai.models.generateContent({
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
      });

      const rawText = (response.text ?? "").trim();
      if (rawText) {
        return rawText;
      }
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Gemini API] Model ${candidate.name} failed: ${msg}`);

      if (
        msg.includes("API_KEY_INVALID") ||
        msg.includes("PERMISSION_DENIED") ||
        msg.includes("403")
      ) {
        throw err;
      }
    }
  }

  throw lastError ?? new Error("Yapay zeka servisine şu anda ulaşılamıyor.");
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "50mb" }));

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

        // 1. PDF Extraction (.pdf)
        if (ext === ".pdf" || file.mimetype === "application/pdf") {
          const uint8 = new Uint8Array(file.buffer);
          const { text } = await extractText(uint8, { mergePages: true });
          const extractedText = (
            Array.isArray(text) ? text.join("\n\n") : text || ""
          ).trim();

          if (extractedText.length > 20) {
            finalExtractedText = extractedText;
          } else {
            const apiKey = process.env.GEMINI_API_KEY;
            if (apiKey && file.size <= 20 * 1024 * 1024) {
              try {
                const ai = new GoogleGenAI({
                  apiKey,
                  apiVersion: "v1beta",
                  httpOptions: {
                    retryOptions: { attempts: 1 },
                    timeout: 15000,
                    headers: {
                      "User-Agent": "aistudio-build",
                    },
                  },
                });
                const ocrResp = await ai.models.generateContent({
                  model: "gemini-flash-latest",
                  contents: {
                    parts: [
                      {
                        inlineData: {
                          mimeType: "application/pdf",
                          data: file.buffer.toString("base64"),
                        },
                      },
                      {
                        text: "Bu PDF belgesindeki tüm metin, hafta, tarih, kazanım, öğrenme çıktısı, süreç bileşeni ve tablo içeriğini hiçbir bilgiyi atlamadan Türkçe olarak olduğu gibi çıkar.",
                      },
                    ],
                  },
                });
                finalExtractedText = (ocrResp.text ?? "").trim();
              } catch {
                // ignore OCR fallback failure during spike
              }
            }
          }
        }
        // 2. Word Document Extraction (.docx)
        else if (
          ext === ".docx" ||
          file.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          finalExtractedText = (result.value || "").trim();
        }
        // 3. Excel Spreadsheet Extraction (.xlsx, .xls)
        else if (
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
        }
        // 4. Legacy Word (.doc) / RTF / Plain Text / Markdown / CSV fallback
        else if (
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
        const detectedIntel = extractDetectedOutcomesAndCodes(finalExtractedText);

        res.json({
          text:
            finalExtractedText ||
            "Dosyadan metin okunamadı (görsel tabanlı veya şifreli olabilir).",
          fileName: originalName,
          sizeBytes: file.size,
          quickWeeks,
          detectedOutcomeCount: detectedIntel.outcomeBlocks.length,
          detectedCodeCount: detectedIntel.maarifCodes.length,
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
      const { yillik_plan } = req.body ?? {};
      if (
        !yillik_plan ||
        typeof yillik_plan !== "string" ||
        !yillik_plan.trim()
      ) {
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

      const weekPrompt = `=== BAĞLAM: BU METİN MEB ÜNİTELENDİRİLMİŞ YILLIK PLANIDIR (yillik_plan) ===
Aşağıdaki Ünitelendirilmiş Yıllık Plan metnini incele ve planda yer alan tüm haftaları, tarih aralıklarını (örn: "14 - 18 Eylül"), her haftanın ilk gününe karşılık gelen GG/AA/YYYY onay tarihini (örn: "14/09/2026"), öğrenme birimini, o haftanın Öğrenme Çıktısı / Kazanım kodu ve cümlesi ile İçerik Çerçevesi özetini ve ders saati süresini sırasıyla çıkar. Ayrıca yıllık plan başlığında okul adı, ders ismi ve sınıf düzeyi varsa onları da çıkar:\n\n${truncateSafely(
        yillik_plan,
        40000
      )}`;

      const rawJson = await generateWithFallback(
        apiKey,
        weekPrompt,
        "Sen MEB Ünitelendirilmiş Yıllık Plan tablolarından hafta, tarih aralığı, öğrenme birimi ve öğrenme çıktısı (kazanım) listesini birebir çıkaran bir uzmansın.",
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
      const fallback = parseWeeksRegexFallback(
        String(req.body?.yillik_plan || "")
      );
      res.json({ weeks: fallback });
    }
  });

  // Main endpoint to generate MEB Türkiye Yüzyılı Maarif Modeli Daily Lesson Plan
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const {
        yillik_plan,
        ders_materyali,
        ders_bilgi_formu,
        hafta_etiketi,
        tarih_araligi,
        onay_tarihi,
        ders_ismi,
        sinif_duzeyi,
        okul_adi,
        egitim_ogretim_yili,
        secilen_hafta_verisi,
        dosya_adlari,
      } = req.body ?? {};

      if (
        !yillik_plan ||
        typeof yillik_plan !== "string" ||
        yillik_plan.trim().length === 0
      ) {
        res.status(400).json({
          error:
            "Ünitelendirilmiş Yıllık Plan metni zorunludur. Lütfen ilgili alanı doldurun veya dosya yükleyin.",
        });
        return;
      }

      if (
        !ders_materyali ||
        typeof ders_materyali !== "string" ||
        ders_materyali.trim().length === 0
      ) {
        res.status(400).json({
          error:
            "Ders Materyali metni zorunludur. Lütfen konu/modül içeriğini girin veya dosya yükleyin.",
        });
        return;
      }

      const promptInputs: ContextualPromptInputs = {
        yillik_plan,
        ders_materyali,
        ders_bilgi_formu,
        hafta_etiketi,
        tarih_araligi,
        onay_tarihi,
        ders_ismi,
        sinif_duzeyi,
        okul_adi,
        egitim_ogretim_yili,
        secilen_hafta_verisi,
        dosya_adlari,
      };

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback to deterministic synthesis if no API key is present
        const synthesized = synthesizePlanFromContextDocs(promptInputs);
        res.json({ plan: synthesized });
        return;
      }

      try {
        const contextualParts = buildContextualPromptParts(promptInputs);
        const rawText = await generateWithFallback(
          apiKey,
          contextualParts,
          SYSTEM_INSTRUCTION,
          LESSON_PLAN_RESPONSE_SCHEMA
        );
        const parsedPlan = JSON.parse(rawText);
        res.json({ plan: parsedPlan });
        return;
      } catch (aiErr: unknown) {
        const msg = aiErr instanceof Error ? aiErr.message : String(aiErr);
        console.warn(
          "All Gemini models experienced temporary demand spike/timeout; using deterministic contextual document synthesis:",
          msg
        );
        // Synthesize directly from the 3 contextual documents so the user never gets a 503 or proxy timeout error
        const synthesized = synthesizePlanFromContextDocs(promptInputs);
        res.json({ plan: synthesized });
        return;
      }
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

  // Global JSON error handler for /api/* routes (e.g., PayloadTooLargeError)
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
