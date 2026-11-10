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

const SYSTEM_INSTRUCTION = `Sen uzman bir meslek ve atölye dersleri öğretmenisin ve MEB Türkiye Yüzyılı Maarif Modeli öğretim programları konusunda uzmansın.
Temel görevin, kullanıcının sağladığı 3 temel dokümanı:
1) 'Ünitelendirilmiş Yıllık Plan' (yillik_plan),
2) 'Ders Bilgi Formu' (ders_bilgi_formu),
3) 'Ders Materyali / Kitabı / Modülü' (ders_materyali)
birlikte inceleyerek, kullanıcının seçtiği HAFTA ve TARİH ARALIĞI için resmî MEB Türkiye Yüzyılı Maarif Modeli formatında eksiksiz bir Günlük Ders Planı oluşturmaktır.

KRİTİK VERİ ÇEKME VE BİRLEŞTİRME KURALLARI:
1. SEÇİLEN HAFTA VE TARİH ODAĞI: Kullanıcının seçtiği Hafta (örn. "1. HAFTA") ve Tarih Aralığı (örn. "14 - 18 Eylül") için Yıllık Plan içindeki ilgili satırı/bölümü bul.
2. DERS BİLGİSİ VE PROGRAMLAR ARASI BİLEŞENLER:
   - 'Sinif', 'Ders', 'Ogrenme_Birimi', 'Sure', 'Alan_Becerileri', 'Egilimler' (örn: "E2.2. Sorumluluk, E3.2. Odaklanma") alanlarını doğrudan Yıllık Plan ve Ders Bilgi Formundan birebir al.
   - 'Programlar_Arasi_Bilesenler' altındaki 'Sosyal_Duygusal_Ogrenme_Becerileri' (örn: "SDB2.2. İş Birliği Becerisi, SDB3.3. Sorumlu Karar Verme Becerisi"), 'Degerler' (örn: "D12. Sabır, D16. Sorumluluk, D18. Temizlik"), 'Okuryazarlik_Becerileri' (örn: "OB1. Bilgi okuryazarlığı"), 'Disiplinler_Arasi_Iliski' (örn: "Fen Bilimleri") ve 'Beceriler_Arasi_Iliski' (örn: "KB2.11. Gözleme Dayalı Tahmin Etme Becerisi, KB3.2. Problem Çözme Becerisi") alanlarını kodları ve tam isimleriyle Yıllık Plan ve Ders Bilgi Formundan birebir al.
3. ÖĞRENME ÇIKTILARI VE İÇERİK ÇERÇEVESİ:
   - 'Ogrenme_Ciktilari_ve_Surec_Bilesenleri' alanına seçilen haftanın öğrenme çıktısını (kazanım kodu ve tam cümlesi, örn: "BÜY.1.1. Generatif bitki organlarını sıralar.") ve altındaki süreç bileşenlerini ("a) ...", "b) ...") alt alta satırlar halinde birebir Yıllık Plan ve Ders Bilgi Formundan aktar.
   - 'Icerik_Cercevesi' alanına seçilen haftanın konu/içerik çerçevesi başlığını (örn: "Generatif Bitki Organları") birebir aktar.
4. ÖĞRENME KANITLARI:
   - 'Ogrenme_Kanitlari' alanına Ders Bilgi Formunda ve Yıllık Planda yer alan ölçme-değerlendirme paragrafını (gözlem formu, akran değerlendirme, öz değerlendirme, derecelendirme ölçeği, dereceli puanlama anahtarı/rubrik, uygulama/proje değerlendirme süreçlerini içeren kapsamlı metni) aktar ve seçilen haftanın konusuyla bütünleştir.
5. ÖĞRENME-ÖĞRETME YAŞANTILARI:
   - 'Temel_Kabuller', 'On_Degerlendirme_Sureci' ve 'Kopru_Kurma' alanlarını doğrudan Ders Bilgi Formundaki ilgili öğrenme birimi açıklamalarından al (yoksa ders materyaline uygun oluştur).
   - 'Ogretme_Uygulamalari' dizisine Ders Bilgi Formunda ve Yıllık Planda yer alan öğretme-öğrenme uygulamaları maddelerini (maddelerin sonundaki "(KB2.11, E2.2, E3.2, D12.3, D16.3, D18.3, SDB2.2, SDB3.3, OB1)" gibi parantez içi bileşen kodlarını da koruyarak) ve Ders Materyalindeki uygulama adımlarını detaylı maddeler halinde yaz.
   - 'Guduleme' dizisine seçilen haftanın konusu ve Ders Materyaliyle uyumlu, öğrenciyi derse ve mesleki uygulamaya hazırlayan 4 güçlü güdüleme cümlesi ("Bu derste...", "Edineceğiniz bilgiler sayesinde..." vb.) yaz.
   - 'Dikkat_Cekme' dizisine seçilen haftanın konusu ve Ders Materyaliyle ilgili, öğrencide merak uyandıran 4 düşündürücü soru cümlesi yaz.
   - 'Ek_Ogretme_Uygulamalari' dizisine Ders Materyalindeki konuyu atölye/laboratuvar/sınıf ortamında pekiştiren 5 somut uygulama maddesi yaz ve her maddenin sonuna ilgili Maarif Modeli bileşen kodlarını parantez içinde ekle (örn: "(E3.2, OB1)", "(KB2.11)", "(SDB2.2, E2.2)", "(D16.3, D18.3)").`;

const OUTPUT_FORMATTING_RULES = [
  "Çıktıyı kesinlikle aşağıdaki JSON şemasına uygun olarak üret.",
  "Seçilen hafta ve tarihe ait Öğrenme Çıktıları ve Süreç Bileşenlerini, Öğrenme Birimini, Süreyi, İçerik Çerçevesini, Alan Becerilerini, Eğilimleri ve Programlar Arası Bileşenleri doğrudan 'yillik_plan' ve 'ders_bilgi_formu' dokümanlarından birebir al.",
  "Temel Kabuller, Ön Değerlendirme Süreci, Köprü Kurma, Öğrenme Kanıtları ve Öğretme Uygulamaları bölümlerinde 'ders_bilgi_formu' ve 'ders_materyali' verilerini esas al; parantez içi beceri/değer/eğilim kodlarını (KB..., E..., D..., SDB..., OB...) koru.",
  "Güdüleme (4 madde), Dikkat Çekme (4 soru maddesi) ve Ek Öğretme Uygulamaları (sonunda parantez içi bileşen kodları bulunan 5 uygulama maddesi) bölümlerini 'ders_materyali' içeriğine göre zenginleştir.",
];

const LESSON_PLAN_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    Ders_Bilgisi: {
      type: Type.OBJECT,
      properties: {
        Sinif: {
          type: Type.STRING,
          description: "Sınıf düzeyi (Örn: '9. SINIF').",
        },
        Ders: {
          type: Type.STRING,
          description: "Dersin tam adı (Örn: 'TARIM (BİTKİ ÜRETİM YÖNTEMLERİ)').",
        },
        Ogrenme_Birimi: {
          type: Type.STRING,
          description: "Seçilen haftanın Öğrenme Birimi (Örn: 'Generatif üretim').",
        },
        Sure: {
          type: Type.STRING,
          description: "Seçilen haftanın ders saati süresi (Örn: '3 Ders Saati').",
        },
        Alan_Becerileri: {
          type: Type.STRING,
          description: "Yıllık plan ve ders bilgi formundaki Alan Becerileri (Örn: 'Bitkilerde üretim yapma').",
        },
        Egilimler: {
          type: Type.STRING,
          description: "Kodları ve adlarıyla Eğilimler (Örn: 'E2.2. Sorumluluk, E3.2. Odaklanma').",
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
          description: "Kodları ve adlarıyla Sosyal-Duygusal Öğrenme Becerileri (Örn: 'SDB2.2. İş Birliği Becerisi, SDB3.3. Sorumlu Karar Verme Becerisi').",
        },
        Degerler: {
          type: Type.STRING,
          description: "Kodları ve adlarıyla Değerler (Örn: 'D12. Sabır, D16. Sorumluluk, D18. Temizlik').",
        },
        Okuryazarlik_Becerileri: {
          type: Type.STRING,
          description: "Kodları ve adlarıyla Okuryazarlık Becerileri (Örn: 'OB1. Bilgi okuryazarlığı').",
        },
        Disiplinler_Arasi_Iliski: {
          type: Type.STRING,
          description: "Disiplinler Arası İlişki (Örn: 'Fen Bilimleri').",
        },
        Beceriler_Arasi_Iliski: {
          type: Type.STRING,
          description: "Kodları ve adlarıyla Beceriler Arası İlişki / Kavramsal Beceriler (Örn: 'KB2.11. Gözleme Dayalı Tahmin Etme Becerisi, KB3.2. Problem Çözme Becerisi').",
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
        "Seçilen haftanın Öğrenme Çıktısı (kazanım kodu ve metni) ve alt satırlarda a), b), c) Süreç Bileşenleri. Örn:\nBÜY.1.1. Generatif bitki organlarını sıralar.\na) Generatif üretim açıklanır.\nb) Çiçek tipleri sıralanır.",
    },
    Icerik_Cercevesi: {
      type: Type.STRING,
      description:
        "Seçilen haftanın İçerik Çerçevesi / Konu başlığı (Örn: 'Generatif Bitki Organları').",
    },
    Ogrenme_Kanitlari: {
      type: Type.STRING,
      description:
        "Ders Bilgi Formu ve Yıllık Plandaki Öğrenme Kanıtları (gözlem formu, akran değerlendirme, öz değerlendirme, derecelendirme ölçeği, dereceli puanlama anahtarı ve uygulama değerlendirme süreçlerini anlatan kapsamlı paragraf).",
    },
    Ogrenme_Ogretme_Yasantilari: {
      type: Type.OBJECT,
      properties: {
        Temel_Kabuller: {
          type: Type.STRING,
          description: "Ders Bilgi Formundan alınan Temel Kabuller cümlesi.",
        },
        On_Degerlendirme_Sureci: {
          type: Type.STRING,
          description: "Ders Bilgi Formundan alınan Ön Değerlendirme Süreci cümlesi.",
        },
        Kopru_Kurma: {
          type: Type.STRING,
          description: "Ders Bilgi Formundan alınan Köprü Kurma cümlesi.",
        },
        Ogretme_Uygulamalari: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "Ders Bilgi Formu, Yıllık Plan ve Ders Materyalinden alınan Öğretme Uygulamaları maddeleri (başında * olmadan düz metin olarak; parantez içi KB, E, D, SDB, OB kodları korunarak).",
        },
        Guduleme: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "Öğrenciyi derse ve mesleki uygulamaya güdüleyen 4 madde (başında * olmadan düz metin).",
        },
        Dikkat_Cekme: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "Öğrencinin ilgisini konuya çeken 4 soru maddesi (başında * olmadan düz metin).",
        },
        Ek_Ogretme_Uygulamalari: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            "Ders Materyaline dayalı 5 somut sınıf/laboratuvar/atölye ek öğretme uygulaması maddesi; her maddenin sonunda parantez içinde ilgili Maarif Modeli kodları (örn: '(E3.2, OB1)', '(KB2.11)', '(D16.3, D18.3)') yer almalıdır.",
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
        "Ders Bilgi Formunda yer alan Zenginleştirme ve Destekleme (Farklılaştırma) açıklamaları.",
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
            description: "O haftanın Öğrenme Çıktısı / Kazanımı ve İçerik Çerçevesi özeti (Örn: 'BÜY.1.1. Generatif bitki organlarını sıralar. - Generatif Bitki Organları').",
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

function truncateSafely(text: string, maxChars = 120000): string {
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
      const year =
        Number(mNum) >= 9 ? defaultYear : defaultYear + 1;
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
    // Match patterns like "1. HAFTA (14 - 18 Eylül)", "1. Hafta | 14-18 Eylül", "1.HAFTA"
    const m = line.match(/(\d{1,2})\s*\.\s*HAFTA(?:\s*\(?([^)|]+)\)?)?/i);
    if (m) {
      const wNo = Number(m[1]);
      if (wNo >= 1 && wNo <= 42 && !seenWeeks.has(wNo)) {
        seenWeeks.add(wNo);
        let datePart = (m[2] || "").trim();
        if (!datePart && lines[i + 1] && /\d{1,2}\s*[-–]\s*\d{1,2}/.test(lines[i + 1])) {
          datePart = lines[i + 1].trim();
        }
        const contextSlice = lines.slice(i, i + 4).join(" | ");
        weeks.push({
          id: `week-${wNo}`,
          haftaNo: wNo,
          haftaEtiketi: `${wNo}. HAFTA`,
          tarihAraligi: datePart || `${wNo}. Hafta`,
          onayTarihi: inferApprovalDate(datePart),
          ogrenmeBirimi: "",
          konuVeCiktiOzeti: contextSlice.slice(0, 140),
          sure: "",
        });
      }
    }
  }

  return weeks.sort((a, b) => a.haftaNo - b.haftaNo);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Resilient multi-model generator with exponential backoff to prevent 503 UNAVAILABLE errors
async function generateWithFallback(
  ai: GoogleGenAI,
  promptText: string,
  systemInstruction: string,
  responseSchema: unknown
): Promise<string> {
  const candidateModels = [
    { name: "gemini-3.8-flash", useThinkingConfig: true },
    { name: "gemini-flash-latest", useThinkingConfig: false },
    { name: "gemini-3.1-flash-lite", useThinkingConfig: false },
  ];

  let lastError: unknown = null;

  for (const candidate of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: candidate.name,
          contents: promptText,
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
        const isTransient =
          msg.includes("503") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("high demand") ||
          msg.includes("overloaded") ||
          msg.includes("500") ||
          msg.includes("502") ||
          msg.includes("504") ||
          msg.includes("429") ||
          msg.includes("RESOURCE_EXHAUSTED") ||
          msg.includes("fetch failed");

        console.warn(
          `[Gemini API] Model ${candidate.name} (attempt ${attempt}) failed: ${msg}`
        );

        if (!isTransient) {
          throw err;
        }

        await sleep(attempt * 1200);
      }
    }
  }

  throw lastError ?? new Error("Yapay zeka servisine şu anda ulaşılamıyor.");
}

function buildStructuredPrompt(inputs: {
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
}): string {
  const secilenHaftaVeTarih = [
    inputs.hafta_etiketi ? inputs.hafta_etiketi.trim() : "",
    inputs.tarih_araligi ? `(${inputs.tarih_araligi.trim()})` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const ustBilgi = [
    inputs.okul_adi ? `Okul Adı: ${inputs.okul_adi}` : "",
    inputs.egitim_ogretim_yili
      ? `Eğitim ve Öğretim Yılı: ${inputs.egitim_ogretim_yili}`
      : "",
    inputs.ders_ismi ? `Ders İsmi: ${inputs.ders_ismi}` : "",
    inputs.sinif_duzeyi ? `Sınıf Düzeyi: ${inputs.sinif_duzeyi}` : "",
    secilenHaftaVeTarih
      ? `SEÇİLEN HAFTA VE TARİH: ${secilenHaftaVeTarih}`
      : "",
    inputs.onay_tarihi ? `Plan Onay Tarihi: ${inputs.onay_tarihi}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  const payload = {
    task_description:
      "Aşağıda sağlanan 1) Ünitelendirilmiş Yıllık Plan, 2) Ders Bilgi Formu ve 3) Ders Materyali dokümanlarını birlikte analiz et. Kullanıcının seçtiği HAFTA ve TARİH ARALIĞI için MEB Türkiye Yüzyılı Maarif Modeli resmi tablo formatına birebir uygun Günlük Ders Planı oluştur.",
    secilen_hafta_ve_ust_bilgi:
      ustBilgi ||
      "1. HAFTA — Yıllık plan, ders bilgi formu ve ders materyalini eşleştirerek ilgili haftayı planlayınız.",
    inputs: {
      yillik_plan: truncateSafely(inputs.yillik_plan, 110000),
      ders_bilgi_formu:
        inputs.ders_bilgi_formu && inputs.ders_bilgi_formu.trim().length > 0
          ? truncateSafely(inputs.ders_bilgi_formu, 110000)
          : "Ayrı bir ders bilgi formu yüklenmedi; öğrenme çıktıları, süreç bileşenleri, programlar arası bileşenler, öğrenme kanıtları ve öğretme uygulamalarını doğrudan 'yillik_plan' ve 'ders_materyali' metinlerinden çıkarınız.",
      ders_materyali: truncateSafely(inputs.ders_materyali, 110000),
    },
    output_formatting_rules: OUTPUT_FORMATTING_RULES,
  };

  return JSON.stringify(payload, null, 2);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "50mb" }));

  // File extraction endpoint supporting PDF, DOCX, XLSX (up to 40 MB)
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
              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: {
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
        // 4. Plain Text / Markdown / CSV fallback
        else if (
          [".txt", ".md", ".csv"].includes(ext) ||
          file.mimetype.startsWith("text/")
        ) {
          finalExtractedText = file.buffer.toString("utf-8").trim();
        } else {
          res.status(400).json({
            error:
              "Desteklenmeyen dosya formatı. Lütfen .pdf, .docx veya .xlsx formatında bir dosya yükleyin.",
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
      const { yillik_plan } = req.body ?? {};
      if (!yillik_plan || typeof yillik_plan !== "string" || !yillik_plan.trim()) {
        res.status(400).json({
          error: "Hafta ve tarihlerin çıkarılması için önce Yıllık Plan yükleyin.",
        });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        const fallback = parseWeeksRegexFallback(yillik_plan);
        res.json({ weeks: fallback });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const weekPrompt = `Aşağıdaki Ünitelendirilmiş Yıllık Plan metnini incele ve planda yer alan tüm haftaları, tarih aralıklarını (örn: "14 - 18 Eylül"), her haftanın ilk gününe karşılık gelen GG/AA/YYYY onay tarihini (örn: "14/09/2026"), öğrenme birimini, konu/öğrenme çıktısı özetini ve ders saati süresini sırasıyla çıkar. Ayrıca yıllık plan başlığında okul adı, ders ismi ve sınıf düzeyi varsa onları da çıkar:\n\n${truncateSafely(
        yillik_plan,
        90000
      )}`;

      const rawJson = await generateWithFallback(
        ai,
        weekPrompt,
        "Sen MEB Ünitelendirilmiş Yıllık Plan tablolarından hafta, tarih aralığı, öğrenme birimi ve kazanım listesini birebir çıkaran bir uzmansın.",
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
      const fallback = parseWeeksRegexFallback(String(req.body?.yillik_plan || ""));
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

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({
          error:
            "Sunucu yapılandırmasında GEMINI_API_KEY bulunamadı. Lütfen Settings > Secrets panelinden API anahtarınızı kontrol edin.",
        });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const promptText = buildStructuredPrompt({
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
      });

      const rawText = await generateWithFallback(
        ai,
        promptText,
        SYSTEM_INSTRUCTION,
        LESSON_PLAN_RESPONSE_SCHEMA
      );
      const parsedPlan = JSON.parse(rawText);

      res.json({
        plan: parsedPlan,
      });
    } catch (err: unknown) {
      console.error("Error generating lesson plan:", err);
      const message =
        err instanceof Error ? err.message : "Bilinmeyen bir sunucu hatası oluştu.";
      if (
        message.includes("API_KEY_INVALID") ||
        message.includes("PERMISSION_DENIED") ||
        message.includes("403")
      ) {
        res.status(403).json({
          error:
            "API anahtarı geçersiz veya yetkisiz. Lütfen Settings > Secrets panelinden API anahtarınızı kontrol edin.",
        });
        return;
      }
      if (message.includes("RESOURCE_EXHAUSTED") || message.includes("429")) {
        res.status(429).json({
          error:
            "İstek kotası aşıldı (429). Lütfen birkaç saniye bekleyip tekrar deneyin.",
        });
        return;
      }
      res.status(500).json({
        error: `Ders planı oluşturulurken hata oluştu: ${message}`,
      });
    }
  });

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
