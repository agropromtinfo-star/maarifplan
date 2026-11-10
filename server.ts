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
Sana her çağrıda birbirinden farklı işleve sahip 3 ayrı kaynak doküman, açık XML-benzeri bağlam etiketleriyle (XML-like Context Tags) sunulacaktır:

1) <yillik_plan>...</yillik_plan>:
   - Bu etiket içindeki metin kullanıcının yüklediği Ünitelendirilmiş Yıllık Plandır (dersin 36 haftalık zaman çizelgesidir).
   - Kullanıcının seçtiği HAFTA ve TARİH ARALIĞI'nda hangi 'Öğrenme Birimi', hangi 'Öğrenme Çıktıları ve Süreç Bileşenleri (a, b, c...)', hangi 'İçerik Çerçevesi (Konu)', kaç ders saati ('Süre') ve hangi Maarif bileşenlerinin işleneceğini belirleyen birincil zaman tablosudur.

2) <ders_bilgi_formu>...</ders_bilgi_formu>:
   - Bu etiket içindeki metin MEB Türkiye Yüzyılı Maarif Modeli resmi öğretim programı / ders bilgi formudur.
   - Seçilen haftanın Öğrenme Birimi ve Öğrenme Çıktısına ait resmi 'Öğrenme Çıktıları ve Süreç Bileşenleri', 'Alan Becerileri', 'Eğilimler (E...)', 'Programlar Arası Bileşenler (SDB..., D..., OB..., Disiplinler Arası İlişki, KB...)', 'Öğrenme Kanıtları (Ölçme-Değerlendirme)', 'Temel Kabuller', 'Ön Değerlendirme Süreci', 'Köprü Kurma', 'Öğretme-Öğrenme Uygulamaları' ve 'Farklılaştırma' metinlerinin birincil resmi kaynağıdır.

3) <ders_materyali>...</ders_materyali>:
   - Bu etiket içindeki metin o hafta derste işlenecek konu anlatımı, ders kitabı bölümü, modül veya atölye/laboratuvar uygulama föyüdür.
   - Bu doküman; konuya özgü 'Güdüleme' (4 madde), 'Dikkat Çekme' (4 düşündürücü soru), 'Ek Öğretme Uygulamaları' (sonunda parantez içi Maarif kodları olan 5 somut sınıf/atölye/laboratuvar uygulaması) üretmek ve 'Öğretme Uygulamaları' ile 'Öğrenme Kanıtları' bölümlerini konunun teknik detaylarıyla zenginleştirmek için kullanılır.

KESİN VERİ İŞLEME VE KAYMA ÖNLEME KURALLARI:
- Sadece kullanıcının yüklediği <yillik_plan>, <ders_bilgi_formu> ve <ders_materyali> etiketleri içindeki gerçek verileri kullan. Dokümanlarda olmayan başka bir örnek dersin (örn. eski şablonların) verilerini ASLA kullanma.
- 'Sinif' alanına sadece sınıf düzeyini yaz (Örn: "9. SINIF", "10. SINIF"). ASLA "DERSİN SÜRESİ HAFTALIK 2 DERS SAATİ" gibi süre bilgilerini Sınıf alanına yazma.
- 'Ders' alanına sadece dersin gerçek adını yaz (Örn: "SÜRDÜRÜLEBİLİR TARIM", "BİYOLOJİ"). ASLA doküman başlığındaki "DERS BİLGİ FORMU" veya "DERS MATERYALİ" ibaresini ders adı olarak yazma.
- 'Ogrenme_Birimi' alanına seçilen haftanın gerçek Öğrenme Birimi / Ünite / Tema adını yaz. ASLA tablo sütun başlığı olan "VE SÜRE" veya "ÖĞRENME BİRİMİ VE SÜRE" ifadesini yazma.
- 'Icerik_Cercevesi' alanına seçilen haftanın gerçek konu başlığını yaz. ASLA "16. Hafta" gibi hafta numarasını İçerik Çerçevesi olarak yazma.
- 'Ogrenme_Ciktilari_ve_Surec_Bilesenleri' alanına seçilen haftanın kazanım kodunu ve tam cümlesini, alt satırlarda ise a), b), c) süreç bileşenlerini <yillik_plan> ve <ders_bilgi_formu> etiketlerinden eksiksiz ve kesmeden yaz. Kazanım kodunun önünde önceki satırdan kalan kopuk kelimeler bırakma.
- 'Egilimler', 'Sosyal_Duygusal_Ogrenme_Becerileri', 'Degerler', 'Okuryazarlik_Becerileri' ve 'Beceriler_Arasi_Iliski' alanlarına sadece ilgili kodları ve beceri/değer isimlerini (örn: "E1.4. Kendine İnanma, E2.2. Sorumluluk, E3.2. Odaklanma") temiz virgüllü liste olarak yaz; tablo başlıklarını veya genel açıklama cümlelerini bu hücrelere karıştırma.
- 'Temel_Kabuller', 'On_Degerlendirme_Sureci' ve 'Kopru_Kurma' alanlarını tek kelimede ("Öğrencilerin;" veya "Günlük hayatta" şeklinde) yarım bırakma; <ders_bilgi_formu> ve <yillik_plan> içindeki tam paragrafı eksiksiz aktar.
- 'Ogretme_Uygulamalari' maddelerine ders kitabının künye/telif sayfasındaki ("MİLLÎ EĞİTİM BAKANLIĞI YAYINLARI", "Her hakkı saklıdır" vb.) ifadeleri ASLA ekleme.`;

const LESSON_PLAN_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    Ders_Bilgisi: {
      type: Type.OBJECT,
      properties: {
        Sinif: {
          type: Type.STRING,
          description:
            "<hedef_hafta_ve_ust_bilgiler>, <yillik_plan> ve <ders_bilgi_formu> içinden alınan Sınıf düzeyi (Sadece sınıf düzeyi, örn: '9. SINIF').",
        },
        Ders: {
          type: Type.STRING,
          description:
            "<hedef_hafta_ve_ust_bilgiler>, <yillik_plan> ve <ders_bilgi_formu> içinden alınan Dersin gerçek tam adı ('DERS BİLGİ FORMU' yazma).",
        },
        Ogrenme_Birimi: {
          type: Type.STRING,
          description:
            "Seçilen hafta için <yillik_plan> ve <ders_bilgi_formu> içinden alınan Öğrenme Birimi / Ünite adı ('VE SÜRE' yazma).",
        },
        Sure: {
          type: Type.STRING,
          description:
            "Seçilen hafta için <yillik_plan> ve <ders_bilgi_formu> içinden alınan haftalık ders saati süresi (Örn: '2 Ders Saati' veya '3 Ders Saati').",
        },
        Alan_Becerileri: {
          type: Type.STRING,
          description:
            "<yillik_plan> ve <ders_bilgi_formu> içinden alınan Alan Becerileri (varsa AB kodlarıyla birlikte).",
        },
        Egilimler: {
          type: Type.STRING,
          description:
            "<yillik_plan> ve <ders_bilgi_formu> içinden kodları ve adlarıyla alınan Eğilimler (E... kodları ve adları, virgülle ayrılmış temiz liste).",
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
            "<yillik_plan> ve <ders_bilgi_formu> içinden kodları ve adlarıyla alınan Sosyal-Duygusal Öğrenme Becerileri (SDB... kodları ve adları).",
        },
        Degerler: {
          type: Type.STRING,
          description:
            "<yillik_plan> ve <ders_bilgi_formu> içinden kodları ve adlarıyla alınan Değerler (D... kodları ve adları).",
        },
        Okuryazarlik_Becerileri: {
          type: Type.STRING,
          description:
            "<yillik_plan> ve <ders_bilgi_formu> içinden kodları ve adlarıyla alınan Okuryazarlık Becerileri (OB... kodları ve adları).",
        },
        Disiplinler_Arasi_Iliski: {
          type: Type.STRING,
          description:
            "<yillik_plan> ve <ders_bilgi_formu> içinden alınan Disiplinler Arası İlişki ders/alan adları.",
        },
        Beceriler_Arasi_Iliski: {
          type: Type.STRING,
          description:
            "<yillik_plan> ve <ders_bilgi_formu> içinden kodları ve adlarıyla alınan Beceriler Arası İlişki / Kavramsal Beceriler (KB... kodları ve adları).",
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
        "Seçilen hafta için doğrudan <yillik_plan> ve <ders_bilgi_formu> etiketlerinden birebir alınan Öğrenme Çıktısı (kazanım kodu ve tam cümlesi) ile alt satırlardaki a), b), c) Süreç Bileşenleri.",
    },
    Icerik_Cercevesi: {
      type: Type.STRING,
      description:
        "Seçilen hafta için <yillik_plan> ve <ders_bilgi_formu> içinden alınan İçerik Çerçevesi / Konu başlığı (Hafta numarasını yazma, gerçek konu başlığını yaz).",
    },
    Ogrenme_Kanitlari: {
      type: Type.STRING,
      description:
        "<ders_bilgi_formu> ve <yillik_plan> içindeki Öğrenme Kanıtları / Ölçme-Değerlendirme açıklamalarının, <ders_materyali> konusuyla bütünleştirilmiş kapsamlı paragrafı.",
    },
    Ogrenme_Ogretme_Yasantilari: {
      type: Type.OBJECT,
      properties: {
        Temel_Kabuller: {
          type: Type.STRING,
          description:
            "<ders_bilgi_formu> ve <yillik_plan> içinden alınan eksiksiz Temel Kabuller paragrafı.",
        },
        On_Degerlendirme_Sureci: {
          type: Type.STRING,
          description:
            "<ders_bilgi_formu> ve <yillik_plan> içinden alınan eksiksiz Ön Değerlendirme Süreci paragrafı.",
        },
        Kopru_Kurma: {
          type: Type.STRING,
          description:
            "<ders_bilgi_formu> ve <yillik_plan> içinden alınan eksiksiz Köprü Kurma paragrafı.",
        },
        Ogretme_Uygulamalari: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "<ders_bilgi_formu> ve <yillik_plan> içindeki Öğretme-Öğrenme Uygulamaları maddeleri ile <ders_materyali> uygulama adımlarının birleşimi (başında * olmadan düz metin; parantez içi KB, E, D, SDB, OB kodları korunarak).",
        },
        Guduleme: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "<ders_materyali> ve seçilen haftanın öğrenme çıktısına dayalı, öğrenciyi derse ve mesleki uygulamaya güdüleyen 4 özgün madde (başında * olmadan düz metin).",
        },
        Dikkat_Cekme: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "<ders_materyali> konusuna dayalı, öğrencinin ilgisini derse çeken 4 düşündürücü soru maddesi (başında * olmadan düz metin).",
        },
        Ek_Ogretme_Uygulamalari: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "<ders_materyali> içeriğine dayalı 5 somut sınıf/laboratuvar/atölye ek öğretme uygulaması maddesi; her maddenin sonunda parantez içinde ilgili Maarif Modeli kodları yer almalıdır.",
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
        "<ders_bilgi_formu> veya <yillik_plan> içinde yer alan Zenginleştirme ve Destekleme (Farklılaştırma) açıklamaları.",
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

  const part1TaskHeader = `<hedef_hafta_ve_ust_bilgiler>
  <aciklama>Aşağıdaki girdi dökümanları JSON formatında değil, her birinin bağlamını kesin olarak ayıran XML-benzeri etiketler (<yillik_plan>, <ders_bilgi_formu>, <ders_materyali>) içerisinde sunulmuştur.</aciklama>
  <secilen_hafta_ve_tarih>${haftaVeTarihBasligi}</secilen_hafta_ve_tarih>
  <plan_onay_tarihi>${inputs.onay_tarihi || "Belirtilmedi"}</plan_onay_tarihi>
  <okul_adi>${inputs.okul_adi || "Yıllık plandan veya varsayılan başlıktan al"}</okul_adi>
  <egitim_ogretim_yili>${inputs.egitim_ogretim_yili || "2026-2027"}</egitim_ogretim_yili>
  <ders_ismi>${inputs.ders_ismi || "Yıllık Plan ve Ders Bilgi Formundan birebir al"}</ders_ismi>
  <sinif_duzeyi>${inputs.sinif_duzeyi || "Yıllık Plan ve Ders Bilgi Formundan birebir al"}</sinif_duzeyi>
${
  inputs.secilen_hafta_verisi
    ? `  <secilen_hafta_on_ozeti>
    <ogrenme_birimi>${inputs.secilen_hafta_verisi.ogrenmeBirimi || "-"}</ogrenme_birimi>
    <konu_ve_cikti_ozeti>${inputs.secilen_hafta_verisi.konuVeCiktiOzeti || "-"}</konu_ve_cikti_ozeti>
    <sure>${inputs.secilen_hafta_verisi.sure || "-"}</sure>
  </secilen_hafta_on_ozeti>`
    : ""
}
</hedef_hafta_ve_ust_bilgiler>`;

  const part2YillikPlanContext = `<yillik_plan kaynak_dosya="${inputs.dosya_adlari?.yillik_plan || "Ünitelendirilmiş Yıllık Plan"}" baglam="Bu metin yıllık plandır. Seçilen hafta (${haftaVeTarihBasligi}) için Öğrenme Birimi, Süre, İçerik Çerçevesi ve Öğrenme Çıktıları ve Süreç Bileşenleri (a, b, c...) doğrudan bu etiket içinden alınmalıdır.">
  <secilen_hafta_odak_kesiti hafta="${haftaVeTarihBasligi}">
${yillikPlanWeekWindow}
  </secilen_hafta_odak_kesiti>
${
  weekWindowIntel.outcomeBlocks.length > 0
    ? `  <tespit_edilen_ogrenme_ciktilari>\n${weekWindowIntel.outcomeBlocks.join("\n\n")}\n  </tespit_edilen_ogrenme_ciktilari>\n`
    : ""
}${
  weekWindowIntel.maarifCodes.length > 0 || fullYillikIntel.maarifCodes.length > 0
    ? `  <tespit_edilen_maarif_kodlari>${(weekWindowIntel.maarifCodes.length > 0 ? weekWindowIntel.maarifCodes : fullYillikIntel.maarifCodes).join(", ")}</tespit_edilen_maarif_kodlari>\n`
    : ""
}  <yillik_plan_metni>
${truncateSafely(inputs.yillik_plan, 8000)}
  </yillik_plan_metni>
</yillik_plan>`;

  const part3DersBilgiFormuContext = hasDersBilgiFormu
    ? `<ders_bilgi_formu kaynak_dosya="${inputs.dosya_adlari?.ders_bilgi_formu || "MEB Ders Bilgi Formu"}" baglam="Bu metin MEB Türkiye Yüzyılı Maarif Modeli resmi Ders Bilgi Formudur. Öğrenme Çıktıları ve Süreç Bileşenleri (a, b, c...), Alan Becerileri, Eğilimler (E...), Programlar Arası Bileşenler (SDB..., D..., OB..., KB...), Öğrenme Kanıtları ve Öğrenme-Öğretme Yaşantıları doğrudan bu etiket içinden alınmalıdır.">
${
  dbfFocusedSection
    ? `  <unite_odak_kesiti>\n${dbfFocusedSection}\n  </unite_odak_kesiti>\n`
    : ""
}${
  dbfIntel.outcomeBlocks.length > 0
    ? `  <tespit_edilen_ogrenme_ciktilari_ve_surec_bilesenleri>\n${dbfIntel.outcomeBlocks.join("\n\n")}\n  </tespit_edilen_ogrenme_ciktilari_ve_surec_bilesenleri>\n`
    : ""
}  <ders_bilgi_formu_metni>
${truncateSafely(inputs.ders_bilgi_formu!, 8000)}
  </ders_bilgi_formu_metni>
</ders_bilgi_formu>`
    : `<ders_bilgi_formu baglam="Ayrı bir ders_bilgi_formu yüklenmedi; ilgili alanları <yillik_plan> ve <ders_materyali> etiketlerinden çıkararak oluştur."></ders_bilgi_formu>`;

  const part4DersMateryaliContext = `<ders_materyali kaynak_dosya="${inputs.dosya_adlari?.ders_materyali || "Ders Materyali"}" baglam="Bu metin Ders Materyalidir (ders kitabı / modül / konu anlatımı). Güdüleme (4 madde), Dikkat Çekme (4 soru cümlesi), Ek Öğretme Uygulamaları (5 madde) ve konu içi somut uygulama örnekleri bu etiket içinden sentezlenmelidir.">
${
  materyalFocusedSection
    ? `  <konu_odak_kesiti>\n${materyalFocusedSection}\n  </konu_odak_kesiti>\n`
    : ""
}  <ders_materyali_metni>
${truncateSafely(inputs.ders_materyali, 8000)}
  </ders_materyali_metni>
</ders_materyali>`;

  const part5SynthesisInstructions = `<capraz_eslestirme_talimatlari>
  <adim no="1">Hafta Tespiti: <yillik_plan> etiketi içinde "${haftaVeTarihBasligi}" haftasını bul. O haftanın Öğrenme Birimini, Süresini, İçerik Çerçevesini ve Öğrenme Çıktısını (kazanım kodunu ve a, b, c süreç bileşenlerini) tespit et.</adim>
  <adim no="2">Öğrenme Çıktısı Doğrulaması: Tespit ettiğin Öğrenme Birimi ve Öğrenme Çıktısını <ders_bilgi_formu> etiketi ile karşılaştır. Öğrenme Çıktısının tam metnini ve altındaki a), b), c) süreç bileşenlerini eksiksiz olarak 'Ogrenme_Ciktilari_ve_Surec_Bilesenleri' alanına yaz.</adim>
  <adim no="3">Yaşantılar ve Kanıtların Aktarımı: <ders_bilgi_formu> ve <yillik_plan> etiketleri içindeki 'Öğrenme Kanıtları', 'Temel Kabuller', 'Ön Değerlendirme Süreci', 'Köprü Kurma' ve 'Öğretme Uygulamaları' metinlerini (parantez içi bileşen kodlarını koruyarak) aktar.</adim>
  <adim no="4">Ders Materyali Sentezi: <ders_materyali> etiketi içindeki konu anlatımını kullanarak 4 maddelik 'Guduleme', 4 soru maddelik 'Dikkat_Cekme' ve sonunda parantez içi Maarif kodları bulunan 5 maddelik 'Ek_Ogretme_Uygulamalari' bölümlerini oluştur.</adim>
</capraz_eslestirme_talimatlari>`;

  return [
    { text: part1TaskHeader },
    { text: part2YillikPlanContext },
    { text: part3DersBilgiFormuContext },
    { text: part4DersMateryaliContext },
    { text: part5SynthesisInstructions },
  ];
}

function stripFrontMatterServer(rawText: string): string {
  const lines = (rawText || "").split(/\r?\n/);
  return lines
    .filter((line) => {
      const t = line.trim();
      if (!t) return false;
      if (/\.{4,}\s*:?\s*\d+/.test(t)) return false;
      if (
        /MİLL[İI]\s*EĞİTİM\s*BAKANLIĞI\s*YAYINLARI|YARDIMCI\s*VE\s*KAYNAK\s*KİTAPLAR|Her\s*hakkı\s*saklıdır|hiçbir\s*surette\s*alınıp\s*yayımlanamaz|ISBN\s*[:\d-]|Baskı\s*Yılı|Matbaası|İSTİKL[ÂA]L\s*MARŞI|GENÇLİĞE\s*HİTABE/i.test(
          t
        )
      ) {
        return false;
      }
      return true;
    })
    .join("\n");
}

function extractCleanCodesServer(
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

function extractSectionBlockServer(
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

function detectCourseAndGradeServer(corpus: string): {
  dersIsmi: string;
  sinifDuzeyi: string;
} {
  const lines = (corpus || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 90);

  let dersIsmi = "";
  let sinifDuzeyi = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!sinifDuzeyi) {
      const gMatch = line.match(/\b(9|10|11|12|5|6|7|8)\s*\.\s*SINIF\b/i);
      if (gMatch) {
        sinifDuzeyi = `${gMatch[1]}. SINIF`;
      } else if (/SINIF\s*DÜZEYİ/i.test(line)) {
        const n =
          line.match(/\b(9|10|11|12|5|6|7|8)\b/)?.[1] ||
          lines[i + 1]?.match(/\b(9|10|11|12|5|6|7|8)\b/)?.[1];
        if (n) sinifDuzeyi = `${n}. SINIF`;
      }
    }
    if (!dersIsmi) {
      const headerMatch = line.match(
        /(?:\b\d{1,2}\.\s*SINIF\s+)?([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s()-]{3,60}?)\s+(?:\d{1,2}\s+)?(?:DERSİ|DERS\s*BİLGİ\s*FORMU|DERS\s*MATERYALİ|ÜNİTELENDİRİLMİŞ\s*YILLIK)/i
      );
      if (headerMatch) {
        const cand = headerMatch[1]
          .replace(/^TARIM\s*ALANI\s*/i, "")
          .replace(/\b\d{1,2}\.\s*SINIF\b/i, "")
          .trim();
        if (
          cand.length >= 3 &&
          !/^(BİLGİ\s*FORMU|MATERYALİ|YILLIK\s*PLAN|HAFTALIK)$/i.test(cand)
        ) {
          dersIsmi = cand;
        }
      }
    }
  }
  return { dersIsmi, sinifDuzeyi };
}

function synthesizePlanFromContextDocs(inputs: ContextualPromptInputs) {
  const secilenHaftaEtiketi = (inputs.hafta_etiketi || "1. HAFTA").trim();
  const secilenTarihAraligi = (inputs.tarih_araligi || "").trim();

  const cleanYillik = stripFrontMatterServer(inputs.yillik_plan);
  const cleanDbf = stripFrontMatterServer(inputs.ders_bilgi_formu || "");
  const cleanMateryal = stripFrontMatterServer(inputs.ders_materyali);

  const weekWindow = extractSelectedWeekWindowFromYillikPlan(
    cleanYillik,
    secilenHaftaEtiketi,
    secilenTarihAraligi
  );

  const combinedCurriculum = `${weekWindow}\n\n${cleanDbf}\n\n${cleanYillik}`;
  const detectedMeta = detectCourseAndGradeServer(
    `${cleanYillik}\n${cleanDbf}\n${cleanMateryal}`
  );

  const weekIntel = extractDetectedOutcomesAndCodes(weekWindow);
  const dbfIntel = extractDetectedOutcomesAndCodes(cleanDbf);
  const fullIntel = extractDetectedOutcomesAndCodes(combinedCurriculum);

  const sinif =
    (inputs.sinif_duzeyi || "").trim() ||
    detectedMeta.sinifDuzeyi ||
    "9. SINIF";

  const ders =
    (inputs.ders_ismi || "").trim() ||
    detectedMeta.dersIsmi ||
    "MESLEK DERSİ";

  const rawOutcome =
    weekIntel.outcomeBlocks[0] ||
    dbfIntel.outcomeBlocks[0] ||
    fullIntel.outcomeBlocks[0] ||
    inputs.secilen_hafta_verisi?.konuVeCiktiOzeti ||
    `${ders} dersi ${secilenHaftaEtiketi} öğrenme çıktısı ve süreç bileşenleri.`;

  const codeStartMatch = rawOutcome.match(
    /(\b(?:[A-ZÇĞİÖŞÜ]{2,8}\.)+\d+(?:\.\d+)*\.?\s+[\s\S]*)/
  );
  const bestOutcomeBlock = codeStartMatch
    ? codeStartMatch[1].trim()
    : rawOutcome.trim();

  const firstOutcomeTitle = bestOutcomeBlock
    .split("\n")[0]
    .replace(/^[A-ZÇĞİÖŞÜ]{2,8}\.\d+(?:\.\d+)*\.?\s*/, "")
    .trim();

  let rawUnit = inputs.secilen_hafta_verisi?.ogrenmeBirimi?.trim() || "";
  if (!rawUnit || /^VE\s*SÜRE$/i.test(rawUnit)) {
    const unitMatch = combinedCurriculum.match(
      /(?:Öğrenme\s*Birimi|Ünite\s*Adı)\s*[:|-]\s*([A-ZÇĞİÖŞÜa-zçğıöşü0-9\s,()-]{4,80})/i
    );
    if (unitMatch && !/VE\s*SÜRE|SÜRE|SAAT/i.test(unitMatch[1])) {
      rawUnit = unitMatch[1].trim();
    }
  }
  const ogrenmeBirimi = rawUnit || firstOutcomeTitle || ders;

  let icerikCercevesi = "";
  const icerikMatch = weekWindow.match(
    /İçerik\s*Çerçevesi\s*[:|-]?\s*([A-ZÇĞİÖŞÜa-zçğıöşü0-9\s,()-]{5,120})/i
  );
  if (icerikMatch && !/^\d+\s*\.\s*hafta$/i.test(icerikMatch[1].trim())) {
    icerikCercevesi = icerikMatch[1].trim();
  } else {
    icerikCercevesi = firstOutcomeTitle || ogrenmeBirimi;
  }

  const sureMatch =
    inputs.secilen_hafta_verisi?.sure?.trim() ||
    weekWindow.match(/\b(\d{1,2})\s*(?:Ders\s*)?Saat[i]?\b/i)?.[1] ||
    combinedCurriculum.match(/HAFTALIK\s*(\d{1,2})\s*DERS\s*SAATİ/i)?.[1] ||
    "2 Ders Saati";
  const sure = /saat/i.test(sureMatch) ? sureMatch : `${sureMatch} Ders Saati`;

  const alanBecerileri = extractCleanCodesServer(
    combinedCurriculum,
    "AB",
    `${ders} alanı temel uygulama becerileri`
  );
  const egilimler = extractCleanCodesServer(
    combinedCurriculum,
    "E",
    "E2.2. Sorumluluk, E3.2. Odaklanma"
  );
  const sdb = extractCleanCodesServer(
    combinedCurriculum,
    "SDB",
    "SDB2.2. İş Birliği Becerisi, SDB3.3. Sorumlu Karar Verme Becerisi"
  );
  const degerler = extractCleanCodesServer(
    combinedCurriculum,
    "D",
    "D3. Çalışkanlık, D16. Sorumluluk"
  );
  const okuryazarlik = extractCleanCodesServer(
    combinedCurriculum,
    "OB",
    "OB1. Bilgi Okuryazarlığı"
  );
  const becerilerArasi = extractCleanCodesServer(
    combinedCurriculum,
    "KB",
    "KB2.2. Gözlemleme, KB3.2. Problem Çözme"
  );

  const disiplinlerArasi =
    extractSectionBlockServer(
      combinedCurriculum,
      /\bDisiplinler\s*Arası\s*İlişki(?:ler)?\b/i,
      /\b(?:Beceriler\s*Arası|Öğrenme\s*Çıktıları|İçerik\s*Çerçevesi|Öğrenme\s*Kanıtları)\b/i,
      150
    ) || "Fen Bilimleri, Biyoloji";

  const ogrenmeKanitlari =
    extractSectionBlockServer(
      combinedCurriculum,
      /\bÖğrenme\s*Kanıtları(?:\s*\(Ölçme\s*ve\s*Değerlendirme\))?\b/i,
      /\b(?:ÖĞRENME-ÖĞRETME\s*YAŞANTILARI|Temel\s*Kabuller|Farklılaştırma)\b/i,
      1100
    ) ||
    `Öğrenci performansını belirlemeye yönelik çalışmalar değerlendirilirken gözlem formu, kontrol listesi, akran değerlendirme, öz değerlendirme ve dereceli puanlama anahtarı (rubrik) gibi ölçme araçlarından uygun olanlar seçilerek kullanılabilir. "${icerikCercevesi}" konusu kapsamındaki uygulamalarda süreç adımları gözlem formları ile takip edilebilir ve öğrencilerin öğrenme sürecine aktif katılımları değerlendirilebilir.`;

  const temelKabuller =
    extractSectionBlockServer(
      combinedCurriculum,
      /\bTemel\s*Kabuller\b/i,
      /\b(?:Ön\s*Değerlendirme|Köprü\s*Kurma|Öğretme-Öğrenme\s*Uygulamaları|Öğretme\s*Uygulamaları)\b/i,
      600
    ) ||
    `Öğrencilerin "${ogrenmeBirimi}" ve "${icerikCercevesi}" konusuyla ilgili günlük yaşamdan temel ön bilgilere ve gözlemlere sahip oldukları kabul edilmektedir.`;

  const onDegerlendirme =
    extractSectionBlockServer(
      combinedCurriculum,
      /\bÖn\s*Değerlendirme(?:\s*Süreci)?\b/i,
      /\b(?:Köprü\s*Kurma|Öğretme-Öğrenme\s*Uygulamaları|Öğretme\s*Uygulamaları|Farklılaştırma)\b/i,
      600
    ) ||
    `Öğrencilere "${icerikCercevesi}" konusuna ilişkin açık uçlu sorular yöneltilerek ön bilgileri, kavram yanılgıları ve hazırbulunuşluk düzeyleri belirlenir.`;

  const kopruKurma =
    extractSectionBlockServer(
      combinedCurriculum,
      /\bKöprü\s*Kurma\b/i,
      /\b(?:Öğretme-Öğrenme\s*Uygulamaları|Öğretme\s*Uygulamaları|Farklılaştırma|Zenginleştirme)\b/i,
      600
    ) ||
    `Günlük hayatta karşılaşılan örnekler ve önceki derslerde edinilen deneyimler üzerinden "${ogrenmeBirimi}" ile "${icerikCercevesi}" konusu arasında ilişki kurularak yeni konuya geçiş yapılır.`;

  const materyalSentences = cleanMateryal
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
    extractSectionBlockServer(
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

/**
 * Multi-model Gemini generator prioritizing gemini-3-flash-preview and gemini-flash-lite-latest
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

  function extractXmlTag(xmlString: string, tagName: string): string {
    const regex = new RegExp(
      `<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`,
      "i"
    );
    const match = xmlString.match(regex);
    return match ? match[1].trim() : "";
  }

  function parseRequestBodyToContextualInputs(
    body: unknown
  ): ContextualPromptInputs {
    if (typeof body === "string" && body.includes("<")) {
      const yillik_plan = extractXmlTag(body, "yillik_plan");
      const ders_materyali = extractXmlTag(body, "ders_materyali");
      const ders_bilgi_formu = extractXmlTag(body, "ders_bilgi_formu");
      const hafta_etiketi = extractXmlTag(body, "hafta_etiketi");
      const tarih_araligi = extractXmlTag(body, "tarih_araligi");
      const onay_tarihi = extractXmlTag(body, "onay_tarihi");
      const ders_ismi = extractXmlTag(body, "ders_ismi");
      const sinif_duzeyi = extractXmlTag(body, "sinif_duzeyi");
      const okul_adi = extractXmlTag(body, "okul_adi");
      const egitim_ogretim_yili = extractXmlTag(body, "egitim_ogretim_yili");

      const secilenHaftaBlock = extractXmlTag(body, "secilen_hafta_verisi");
      const secilen_hafta_verisi = secilenHaftaBlock
        ? {
            haftaNo: Number(extractXmlTag(secilenHaftaBlock, "hafta_no")) || 1,
            haftaEtiketi: extractXmlTag(secilenHaftaBlock, "hafta_etiketi"),
            tarihAraligi: extractXmlTag(secilenHaftaBlock, "tarih_araligi"),
            ogrenmeBirimi: extractXmlTag(secilenHaftaBlock, "ogrenme_birimi"),
            konuVeCiktiOzeti: extractXmlTag(
              secilenHaftaBlock,
              "konu_ve_cikti_ozeti"
            ),
            sure: extractXmlTag(secilenHaftaBlock, "sure"),
          }
        : undefined;

      const dosyaAdlariBlock = extractXmlTag(body, "dosya_adlari");
      const dosya_adlari = dosyaAdlariBlock
        ? {
            yillik_plan:
              extractXmlTag(dosyaAdlariBlock, "yillik_plan_dosya_adi") || null,
            ders_bilgi_formu:
              extractXmlTag(dosyaAdlariBlock, "ders_bilgi_formu_dosya_adi") ||
              null,
            ders_materyali:
              extractXmlTag(dosyaAdlariBlock, "ders_materyali_dosya_adi") ||
              null,
          }
        : undefined;

      return {
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
    }

    const obj = (body && typeof body === "object" ? body : {}) as Record<
      string,
      unknown
    >;
    return {
      yillik_plan: String(obj.yillik_plan || ""),
      ders_materyali: String(obj.ders_materyali || ""),
      ders_bilgi_formu: obj.ders_bilgi_formu
        ? String(obj.ders_bilgi_formu)
        : undefined,
      hafta_etiketi: obj.hafta_etiketi ? String(obj.hafta_etiketi) : undefined,
      tarih_araligi: obj.tarih_araligi ? String(obj.tarih_araligi) : undefined,
      onay_tarihi: obj.onay_tarihi ? String(obj.onay_tarihi) : undefined,
      ders_ismi: obj.ders_ismi ? String(obj.ders_ismi) : undefined,
      sinif_duzeyi: obj.sinif_duzeyi ? String(obj.sinif_duzeyi) : undefined,
      okul_adi: obj.okul_adi ? String(obj.okul_adi) : undefined,
      egitim_ogretim_yili: obj.egitim_ogretim_yili
        ? String(obj.egitim_ogretim_yili)
        : undefined,
      secilen_hafta_verisi:
        obj.secilen_hafta_verisi as ContextualPromptInputs["secilen_hafta_verisi"],
      dosya_adlari: obj.dosya_adlari as ContextualPromptInputs["dosya_adlari"],
    };
  }

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
      const parsedInputs = parseRequestBodyToContextualInputs(req.body);
      const yillik_plan = parsedInputs.yillik_plan;
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

      const weekPrompt = `<gorev>Aşağıdaki <yillik_plan> etiketi içindeki MEB Ünitelendirilmiş Yıllık Plan metnini incele ve planda yer alan tüm haftaları, tarih aralıklarını (örn: "14 - 18 Eylül"), her haftanın ilk gününe karşılık gelen GG/AA/YYYY onay tarihini (örn: "14/09/2026"), öğrenme birimini, o haftanın Öğrenme Çıktısı / Kazanım kodu ve cümlesi ile İçerik Çerçevesi özetini ve ders saati süresini sırasıyla çıkar. Ayrıca yıllık plan başlığında okul adı, ders ismi ve sınıf düzeyi varsa onları da çıkar.</gorev>\n\n<yillik_plan>\n${truncateSafely(
        yillik_plan,
        15000
      )}\n</yillik_plan>`;

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
      const parsedInputs = parseRequestBodyToContextualInputs(req.body);
      const fallback = parseWeeksRegexFallback(
        String(parsedInputs.yillik_plan || "")
      );
      res.json({ weeks: fallback });
    }
  });

  // Main endpoint to generate MEB Türkiye Yüzyılı Maarif Modeli Daily Lesson Plan
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const promptInputs = parseRequestBodyToContextualInputs(req.body);
      const { yillik_plan, ders_materyali } = promptInputs;

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
