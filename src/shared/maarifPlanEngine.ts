import { MaarifLessonPlan, YillikPlanWeekItem } from "../types/lessonPlan";

/**
 * Official MEB Türkiye Yüzyılı Maarif Modeli National Component Code Dictionary
 * Guarantees 100% clean, canonical code + label formatting without ever swallowing table headers.
 */
export const MAARIF_E_CODES: Record<string, string> = {
  "E1.1": "E1.1. Merak",
  "E1.2": "E1.2. Bağımsızlık",
  "E1.3": "E1.3. Azim ve Kararlılık",
  "E1.4": "E1.4. Kendine İnanma (Öz Yeterlilik)",
  "E1.5": "E1.5. Kendine Güvenme (Öz Güven)",
  "E2.1": "E2.1. Empati",
  "E2.2": "E2.2. Sorumluluk",
  "E2.3": "E2.3. Girişkenlik",
  "E2.4": "E2.4. Güven",
  "E2.5": "E2.5. Oyunseverlik",
  "E3.1": "E3.1. Uzmanlaşma",
  "E3.2": "E3.2. Odaklanma",
  "E3.3": "E3.3. Yaratıcılık",
  "E3.4": "E3.4. Gerçeği Arama",
  "E3.5": "E3.5. Açık Fikirlilik",
  "E3.6": "E3.6. Analitik Düşünme",
  "E3.7": "E3.7. Sistematik Olma",
  "E3.8": "E3.8. Soru Sorma",
  "E3.9": "E3.9. Şüphe Duyma",
  "E3.10": "E3.10. Eleştirel Bakma",
  "E3.11": "E3.11. Özgün Düşünme",
};

export const MAARIF_SDB_CODES: Record<string, string> = {
  "SDB1.1": "SDB1.1. Kendini Tanıma (Öz Farkındalık)",
  "SDB1.2": "SDB1.2. Kendini Düzenleme (Öz Düzenleme)",
  "SDB1.3": "SDB1.3. Kendini Uyarlama (Öz Yansıtma)",
  "SDB2.1": "SDB2.1. İletişim",
  "SDB2.2": "SDB2.2. İş Birliği",
  "SDB2.3": "SDB2.3. Sosyal Farkındalık",
  "SDB3.1": "SDB3.1. Uyum",
  "SDB3.2": "SDB3.2. Esneklik",
  "SDB3.3": "SDB3.3. Sorumlu Karar Verme",
};

export const MAARIF_D_CODES: Record<string, string> = {
  D1: "D1. Adalet",
  D2: "D2. Aile Bütünlüğü",
  D3: "D3. Çalışkanlık",
  D4: "D4. Dostluk",
  D5: "D5. Duyarlılık",
  D6: "D6. Dürüstlük",
  D7: "D7. Estetik",
  D8: "D8. Mahremiyet",
  D9: "D9. Merhamet",
  D10: "D10. Mütevazılık",
  D11: "D11. Özgürlük",
  D12: "D12. Sabır",
  D13: "D13. Sağlıklı Yaşam",
  D14: "D14. Saygı",
  D15: "D15. Sevgi",
  D16: "D16. Sorumluluk",
  D17: "D17. Tasarruf",
  D18: "D18. Temizlik",
  D19: "D19. Vatanseverlik",
  D20: "D20. Yardımseverlik",
};

export const MAARIF_OB_CODES: Record<string, string> = {
  OB1: "OB1. Bilgi Okuryazarlığı",
  OB2: "OB2. Dijital Okuryazarlık",
  OB3: "OB3. Finansal Okuryazarlık",
  OB4: "OB4. Görsel Okuryazarlık",
  OB5: "OB5. Kültür Okuryazarlığı",
  OB6: "OB6. Vatandaşlık Okuryazarlığı",
  OB7: "OB7. Veri Okuryazarlığı",
  OB8: "OB8. Sürdürülebilirlik Okuryazarlığı",
  OB9: "OB9. Sanat Okuryazarlığı",
};

export const MAARIF_KB_CODES: Record<string, string> = {
  KB1: "KB1. Temel Beceriler",
  "KB2.1": "KB2.1. Çelişki Giderme",
  "KB2.2": "KB2.2. Gözlemleme",
  "KB2.3": "KB2.3. Özetleme",
  "KB2.4": "KB2.4. Çözümleme",
  "KB2.5": "KB2.5. Sınıflandırma",
  "KB2.6": "KB2.6. Bilgi Toplama",
  "KB2.7": "KB2.7. Karşılaştırma",
  "KB2.8": "KB2.8. Sorgulama",
  "KB2.9": "KB2.9. Genelleme",
  "KB2.10": "KB2.10. Çıkarım Yapma",
  "KB2.11": "KB2.11. Gözleme Dayalı Tahmin Etme",
  "KB2.12": "KB2.12. Mevcut Bilgileri/Verileri Kullanma",
  "KB2.13": "KB2.13. Yapılandırma",
  "KB2.14": "KB2.14. Yorumlama",
  "KB2.15": "KB2.15. Yansıtma",
  "KB2.16": "KB2.16. Muhakeme (Akıl Yürütme)",
  "KB2.17": "KB2.17. Değerlendirme",
  "KB2.18": "KB2.18. Tartışma",
  "KB2.19": "KB2.19. Mantıksal Denetleme",
  "KB2.20": "KB2.20. Sentezleme",
  "KB3.1": "KB3.1. Karar Verme",
  "KB3.2": "KB3.2. Problem Çözme",
  "KB3.3": "KB3.3. Eleştirel Düşünme",
};

const KNOWN_DISCIPLINES = [
  "Coğrafya",
  "Biyoloji",
  "Matematik",
  "Fizik",
  "Kimya",
  "Fen Bilimleri",
  "Tarih",
  "Türk Dili ve Edebiyatı",
  "Türkçe",
  "Görsel Sanatlar",
  "Bilişim Teknolojileri",
  "Sağlık Bilgisi",
  "Çevre Eğitimi",
  "Ekonomi",
  "Girişimcilik",
  "Felsefe",
  "Sosyoloji",
  "Psikoloji",
];

/**
 * Strips textbook/PDF front-matter boilerplate (copyright, imprint, ISBN, TOC dotted lines)
 * so that lines like "MİLLÎ EĞİTİM BAKANLIĞI YAYINLARI ... 10956" or "Her hakkı saklıdır"
 * never pollute lesson plan fields.
 */
export function stripFrontMatter(rawText: string): string {
  const lines = (rawText || "").split(/\r?\n/);
  const cleanedLines = lines.filter((line) => {
    const t = line.trim();
    if (!t) return false;
    if (/\.{4,}\s*:?\s*\d+/.test(t)) return false;
    if (
      /MİLL[İI]\s*EĞİTİM\s*BAKANLIĞI\s*YAYINLARI|YARDIMCI\s*VE\s*KAYNAK\s*KİTAPLAR|Her\s*hakkı\s*saklıdır|hiçbir\s*surette\s*alınıp\s*yayımlanamaz|ISBN\s*[:\d-]|Baskı\s*Yılı|Matbaası|İSTİKL[ÂA]L\s*MARŞI|GENÇLİĞE\s*HİTABE|EDİTÖR|GÖRSEL\s*TASARIM\s*UZMANI|PROGRAM\s*GELİŞTİRME\s*UZMANI|ÖLÇME\s*VE\s*DEĞERLENDİRME\s*UZMANI|REHBERLİK\s*UZMANI/i.test(
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
 * Extracts canonical Maarif component codes (E, SDB, D, OB, KB) from text using the official dictionary
 * and preserving document appearance order.
 */
export function extractCanonicalMaarifCodes(
  corpus: string,
  category: "E" | "SDB" | "D" | "OB" | "KB",
  fallback: string
): string {
  const text = corpus || "";
  const results = new Map<string, string>();

  if (category === "E") {
    const matches = text.match(/\bE[123]\.\d{1,2}\b/g) || [];
    for (const code of matches) {
      const canonical = MAARIF_E_CODES[code];
      if (canonical && !results.has(code)) {
        results.set(code, canonical);
      }
    }
  } else if (category === "SDB") {
    const matches = text.match(/\bSDB[123]\.\d\b/g) || [];
    for (const code of matches) {
      const canonical = MAARIF_SDB_CODES[code];
      if (canonical && !results.has(code)) {
        results.set(code, canonical);
      }
    }
  } else if (category === "D") {
    const regex = /\bD(\d{1,2})(?:\.\d{1,2})?\b/g;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
      const num = Number(m[1]);
      if (num >= 1 && num <= 20) {
        const parentKey = `D${num}`;
        const canonical = MAARIF_D_CODES[parentKey];
        if (canonical && !results.has(parentKey)) {
          results.set(parentKey, canonical);
        }
      }
    }
    if (results.size > 0) {
      return Array.from(results.entries())
        .sort((a, b) => Number(a[0].slice(1)) - Number(b[0].slice(1)))
        .map((entry) => entry[1])
        .join(", ");
    }
  } else if (category === "OB") {
    const regex = /\bOB([1-9])(?:\.\d{1,2})?\b/g;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
      const key = `OB${m[1]}`;
      const canonical = MAARIF_OB_CODES[key];
      if (canonical && !results.has(key)) {
        results.set(key, canonical);
      }
    }
    if (results.size > 0) {
      return Array.from(results.entries())
        .sort((a, b) => Number(a[0].slice(2)) - Number(b[0].slice(2)))
        .map((entry) => entry[1])
        .join(", ");
    }
  } else if (category === "KB") {
    const matches = text.match(/\bKB(?:1|[23]\.\d{1,2})\b/g) || [];
    for (const code of matches) {
      const canonical = MAARIF_KB_CODES[code];
      if (canonical && !results.has(code)) {
        results.set(code, canonical);
      }
    }
  }

  if (results.size > 0) {
    return Array.from(results.values()).join(", ");
  }
  return fallback;
}

/**
 * Extracts clean course name, field (alan) name, grade level, and school name from the 3 documents
 */
export function extractCleanDocumentMetadata(corpus: string): {
  okulAdi: string;
  dersIsmi: string;
  sinifDuzeyi: string;
  sure: string;
} {
  const lines = (corpus || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 120);

  let okulAdi = "";
  let alanAdi = "";
  let rawDersAdi = "";
  let sinifDuzeyi = "";
  let sure = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. School Name
    if (
      !okulAdi &&
      /(?:ANADOLU|MESLEKİ|TEKNİK|FEN|İMAM\s*HATİP|ÇOK\s*PROGRAMLI|ORTAOKULU|İLKOKULU)\s+.*LİSESİ|LİSESİ\s*MÜDÜRLÜĞÜ/i.test(
        line
      ) &&
      !/BAKANLIĞI|GENEL\s*MÜDÜRLÜĞÜ/i.test(line)
    ) {
      okulAdi = line.replace(/\|/g, " ").replace(/\s+/g, " ").trim();
    }

    // 2. Field Name (e.g. "TARIM ALANI" or "ALAN: TARIM")
    if (!alanAdi) {
      const explicitAlanLabel = line.match(
        /^ALAN(?:I|\s*ADI)?\s*[:|-]\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s-]{2,35})$/i
      );
      if (explicitAlanLabel) {
        alanAdi = explicitAlanLabel[1].trim().toLocaleUpperCase("tr-TR");
      } else {
        const alanMatch = line.match(
          /(?:^|\s)([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s-]{2,35}?)\s+ALANI(?=$|\s|[:|,-])/i
        );
        if (
          alanMatch &&
          !/ÖĞRENME|BECERİ|UYGULAMA|ÇALIŞMA|TARIM\s+ALANI\s+DIŞI/i.test(
            alanMatch[1]
          )
        ) {
          alanAdi = alanMatch[1].trim().toLocaleUpperCase("tr-TR");
        }
      }
    }

    // 3. Weekly Hours (e.g. "HAFTALIK 2 DERS SAATİ" or "2 Ders Saati")
    if (!sure) {
      const haftalikMatch = line.match(
        /HAFTALIK\s*(\d{1,2})\s*DERS\s*SAATİ/i
      );
      if (haftalikMatch) {
        sure = `${haftalikMatch[1]} Ders Saati`;
      }
    }

    // 4. Grade Level (Strictly "9. SINIF", "10. SINIF", etc.)
    if (!sinifDuzeyi) {
      const explicitGrade = line.match(
        /\b(9|10|11|12|5|6|7|8)\s*\.\s*SINIF(?=$|\s|[:|,-])/i
      );
      if (explicitGrade) {
        sinifDuzeyi = `${explicitGrade[1]}. SINIF`;
      } else if (/^(?:DERSİN\s*)?SINIF(?:I|\s*DÜZEYİ)?(?=$|\s|[:|-])/i.test(line)) {
        const numInLine = line.match(/\b(9|10|11|12|5|6|7|8)\b/);
        const numInNext = lines[i + 1]?.match(/\b(9|10|11|12|5|6|7|8)\b/);
        const g = numInLine?.[1] || numInNext?.[1];
        if (g) sinifDuzeyi = `${g}. SINIF`;
      } else {
        const headerGrade = line.match(
          /\b[A-ZÇĞİÖŞÜ]{3,}\s+(9|10|11|12)\s+DERS\s*(?:BİLGİ\s*FORMU|MATERYALİ)/i
        );
        if (headerGrade) {
          sinifDuzeyi = `${headerGrade[1]}. SINIF`;
        }
      }
    }

    // 5. Course Name
    // Case A: Already formatted like "9. SINIF TARIM (SÜRDÜRÜLEBİLİR TARIM) DERSİ"
    if (!rawDersAdi || !rawDersAdi.includes("(")) {
      const parenCourseMatch = line.match(
        /(?:\b\d{1,2}\.\s*SINIF\s+|\bÖĞRETİM\s+YILI\s+)?([A-ZÇĞİÖŞÜa-zçğıöşü\s]{2,35}\([A-ZÇĞİÖŞÜa-zçğıöşü\s-]{3,45}\))\s+DERSİ/i
      );
      if (parenCourseMatch) {
        rawDersAdi = parenCourseMatch[1]
          .replace(/^.*ÖĞRETİM\s+YILI\s+/i, "")
          .replace(/^\d{1,2}\.\s*SINIF\s+/i, "")
          .trim()
          .toLocaleUpperCase("tr-TR");
      }
    }

    if (!rawDersAdi) {

      // Case B: Header like "TARIM ALANI SÜRDÜRÜLEBİLİR TARIM 9 DERS BİLGİ FORMU"
      if (!rawDersAdi) {
        const dbfHeaderMatch = line.match(
          /(?:[A-ZÇĞİÖŞÜa-zçğıöşü\s]+ALANI\s+)?([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s()-]{3,55}?)\s+(?:\d{1,2}\s+)?(?:DERS\s*BİLGİ\s*FORMU|DERS\s*MATERYALİ|DERSİ\s*ÜNİTELENDİRİLMİŞ|ÜNİTELENDİRİLMİŞ\s*YILLIK)/i
        );
        if (dbfHeaderMatch) {
          const cand = dbfHeaderMatch[1]
            .replace(/^.*ALANI\s+/i, "")
            .replace(/\b\d{1,2}\.\s*SINIF\s*/i, "")
            .replace(/\s+\d{1,2}$/, "")
            .trim();
          if (
            cand.length >= 3 &&
            !/^(?:DERS|BİLGİ\s*FORMU|DERS\s*BİLGİ\s*FORMU|MATERYALİ|DERSİN\s*SÜRESİ|HAFTALIK)$/i.test(
              cand
            )
          ) {
            rawDersAdi = cand.toLocaleUpperCase("tr-TR");
          }
        }
      }

      // Case C: Explicit label "DERSİN ADI: SÜRDÜRÜLEBİLİR TARIM"
      if (!rawDersAdi && /^DERS(?:İN)?\s*ADI(?=$|\s|[:|-])/i.test(line)) {
        const afterLabel = line
          .replace(/^DERS(?:İN)?\s*ADI\s*[:|\-–]?\s*/i, "")
          .replace(/\|/g, " ")
          .replace(/(?:SINIF|DERSİN\s*SÜRESİ|HAFTALIK).*$/i, "")
          .replace(/\s+\d{1,2}$/, "")
          .trim();
        if (
          afterLabel.length >= 3 &&
          !/^(?:BİLGİ\s*FORMU|MATERYALİ|PLANI|SAATİ|SÜRESİ)$/i.test(afterLabel)
        ) {
          rawDersAdi = afterLabel.toLocaleUpperCase("tr-TR");
        } else if (lines[i + 1]) {
          const nextLine = lines[i + 1]
            .replace(/\|/g, " ")
            .replace(/(?:SINIF|DERSİN\s*SÜRESİ|HAFTALIK).*$/i, "")
            .replace(/\s+\d{1,2}$/, "")
            .trim();
          if (
            nextLine.length >= 3 &&
            !/^(?:BİLGİ\s*FORMU|MATERYALİ|PLANI|SAATİ|SÜRESİ|\d+)$/i.test(
              nextLine
            )
          ) {
            rawDersAdi = nextLine.toLocaleUpperCase("tr-TR");
          }
        }
      }
    }
  }

  let dersIsmi = rawDersAdi;
  if (
    alanAdi &&
    rawDersAdi &&
    !rawDersAdi.includes("(") &&
    rawDersAdi !== alanAdi
  ) {
    dersIsmi = `${alanAdi} (${rawDersAdi})`;
  }

  return {
    okulAdi,
    dersIsmi,
    sinifDuzeyi,
    sure: sure || "2 Ders Saati",
  };
}

export interface ParsedOutcomeEntry {
  code: string; // e.g. "ST.1.1"
  unitNumber: number; // e.g. 1
  outcomeNumber: number; // e.g. 1
  headerLine: string; // e.g. "ST.1.1. Onarıcı tarımın ilkelerini açıklar."
  derivedTopicHeading: string; // e.g. "Onarıcı Tarımın İlkeleri"
  subComponents: Record<string, string>; // e.g. { a: "a) Onarıcı tarımın faydaları açıklanır.", ... }
  orderedSubKeys: string[];
}

export interface StructuredDersBilgiFormu {
  sinif: string;
  ders: string;
  sure: string;
  alanBecerileri: string;
  egilimler: string;
  sosyalDuygusalBeceriler: string;
  degerler: string;
  okuryazarlikBecerileri: string;
  disiplinlerArasiIliski: string;
  becerilerArasiIliski: string;
  unitsByNumber: Record<number, string>;
  outcomesMap: Record<string, ParsedOutcomeEntry>;
  ogrenmeKanitlari: string;
  temelKabuller: string;
  onDegerlendirmeSureci: string;
  kopruKurma: string;
  ogretmeUygulamalariByUnit: Record<string, string[]>;
  allOgretmeUygulamalariBullets: string[];
  farklilastirma: string;
  rawActivityCodes: string[];
  rawOutcomesCatalogText?: string;
  rawDbfText?: string;
  rawYillikPlanText?: string;
}

export const TURKISH_MONTH_NAMES_PATTERN =
  "(?:Ocak|OCAK|ocak|Şubat|ŞUBAT|şubat|Subat|SUBAT|subat|Mart|MART|mart|Nisan|NİSAN|NISAN|nisan|Mayıs|MAYIS|mayıs|Mayis|mayis|Haziran|HAZİRAN|HAZIRAN|haziran|Temmuz|TEMMUZ|temmuz|Ağustos|AĞUSTOS|ağustos|Agustos|AGUSTOS|agustos|Eylül|EYLÜL|eylül|Eylul|EYLUL|eylul|Ekim|EKİM|EKIM|ekim|Kasım|KASIM|kasım|Kasim|kasim|Aralık|ARALIK|aralık|Aralik|aralik)";

export function normalizeDateForMatch(dateStr: string): string {
  return (dateStr || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/\b20\d{2}\b/g, "")
    .replace(/^\d{1,2}\s*\.\s*hafta$/i, "")
    .replace(/[-–/.,()]/g, " ")
    .replace(/\b0(\d)\b/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractDateRangeFromText(text: string): string {
  if (!text) return "";
  const regex1 = new RegExp(
    `(\\b\\d{1,2}\\s*(?:${TURKISH_MONTH_NAMES_PATTERN})?\\s*[-–/]\\s*\\d{1,2}\\s*${TURKISH_MONTH_NAMES_PATTERN}(?:\\s*20\\d{2})?)`,
    "i"
  );
  const m1 = text.match(regex1);
  if (m1) return m1[1].replace(/\s+/g, " ").trim();

  const regex2 = new RegExp(
    `(${TURKISH_MONTH_NAMES_PATTERN}\\s*[-–/:]?\\s*\\d{1,2}\\s*[-–/]\\s*\\d{1,2})`,
    "i"
  );
  const m2 = text.match(regex2);
  if (m2) return m2[1].replace(/\s+/g, " ").trim();

  const regex3 =
    /\b(\d{1,2}[./]\d{1,2}(?:[./]20\d{2})?\s*[-–]\s*\d{1,2}[./]\d{1,2}(?:[./]20\d{2})?)\b/;
  const m3 = text.match(regex3);
  if (m3) return m3[1].replace(/\s+/g, " ").trim();

  return "";
}

/**
 * Converts a Turkish outcome sentence like "Onarıcı tarımın ilkelerini açıklar."
 * or "İyi tarımı açıklayabilme" into its clean Content Framework title ("Onarıcı Tarımın İlkeleri", "İyi Tarım")
 */
export function deriveTopicHeadingFromOutcome(outcomeHeader: string): string {
  const withoutCode = outcomeHeader
    .replace(/^[A-ZÇĞİÖŞÜ]{2,8}\.\d+(?:\.\d+)*\.?\s*/, "")
    .replace(/\s+[a-zçğıöşü]\)\s+.*$/i, "")
    .replace(/\.$/, "")
    .trim();

  const cleaned = withoutCode
    .replace(
      /\s+(?:açıklayabilme|açıklar|sıralayabilme|sıralar|uygulayabilme|uygular|sınıflandırabilme|sınıflandırır|karşılaştırabilme|karşılaştırır|analiz\s+edebilme|analiz\s+eder|değerlendirebilme|değerlendirir|kavrayabilme|kavrar)$/i,
      ""
    )
    .replace(/ilkelerini$/i, "İlkeleri")
    .replace(/yönetimini$/i, "Yönetimi")
    .replace(/yöntemlerini$/i, "Yöntemleri")
    .replace(/uygulamalarını$/i, "Uygulamaları")
    .replace(/kurallarını$/i, "Kuralları")
    .replace(/özelliklerini$/i, "Özellikleri")
    .replace(/tarımı$/i, "Tarım")
    .trim();

  return cleaned
    .split(/\s+/)
    .map((w) => {
      if (/^(ve|ile|veya|de|da|için)$/i.test(w))
        return w.toLocaleLowerCase("tr-TR");
      return (
        w.charAt(0).toLocaleUpperCase("tr-TR") +
        w.slice(1).toLocaleLowerCase("tr-TR")
      );
    })
    .join(" ");
}

/**
 * Extracts a multi-line block between a section start heading and a section stop heading.
 * NOTE: Never use \b after Turkish words ending in ı, İ, ü, ö, ç, ş, ğ because JS RegExp \b is ASCII-only!
 * Always use (?=$|\s|[:|;,.()-]) instead.
 */
function extractSectionBetweenHeadings(
  lines: string[],
  startLineRegex: RegExp,
  stopLineRegex: RegExp,
  maxLines = 80,
  maxChars = 3800
): string {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const startMatch = line.match(startLineRegex);
    if (startMatch) {
      const collected: string[] = [];
      const remainder = line
        .slice((startMatch.index || 0) + startMatch[0].length)
        .replace(/^[:|\-–\s]+/, "")
        .trim();

      if (remainder && !stopLineRegex.test(remainder)) {
        collected.push(remainder);
      }

      for (let j = i + 1; j < Math.min(lines.length, i + maxLines); j++) {
        const nextLine = lines[j].trim();
        if (!nextLine) continue;
        if (stopLineRegex.test(nextLine)) {
          break;
        }
        collected.push(nextLine);
        if (collected.join(" ").length >= maxChars) {
          break;
        }
      }

      const paragraph = joinWrappedPdfLinesToParagraphs(collected);
      if (paragraph.length >= 25) {
        return paragraph.slice(0, maxChars);
      }
    }
  }
  return "";
}

function joinWrappedPdfLinesToParagraphs(lines: string[]): string {
  if (lines.length === 0) return "";
  const paragraphs: string[] = [];
  let current = "";

  for (const rawLine of lines) {
    const line = rawLine.replace(/\|/g, " ").replace(/\s+/g, " ").trim();
    if (!line) continue;

    if (!current) {
      current = line;
      continue;
    }

    if (/[.!?]$/.test(current) && /^(?:Ayrıca|Örneğin)(?=$|\s|[,:])/i.test(line)) {
      paragraphs.push(current);
      current = line;
    } else {
      current = `${current} ${line}`;
    }
  }

  if (current) {
    paragraphs.push(current);
  }

  return paragraphs.join("\n");
}

/**
 * Splits a block of "Öğretme-Öğrenme Uygulamaları" from Ders Bilgi Formu into the exact
 * asterisk bullet items shown in the 6 official PDFs.
 */
export function splitOgretmeUygulamalariIntoBullets(
  rawBlock: string,
  unitTitle?: string
): string[] {
  const joined = rawBlock
    .split(/\r?\n/)
    .map((l) => l.replace(/^\*\s*/, "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!joined) return [];

  const bullets: string[] = [];

  const leadingHeaderMatch = joined.match(
    /^([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s-]{2,45}:)\s*(.*)$/
  );
  let bodyText = joined;
  if (leadingHeaderMatch) {
    bullets.push(leadingHeaderMatch[1].trim());
    bodyText = leadingHeaderMatch[2].trim();
  } else if (unitTitle) {
    bullets.push(`${unitTitle}:`);
  }

  const sentenceParts = bodyText
    .split(
      /(?<=\)\.)\s+|(?<=[.!?])\s+(?=(?:Öğretmen\s+tarafından|Öğrencilerden|Öğrencilerin|Tasarladıkları|Gruplara\s+ayrılan|Bu\s+süreçte|Bu\s+öğrenme\s+birimi|Ayrıca|Yapılan\s+çalışmalar|Uygulama\s+sürecinde)(?=\s|[,:]))/g
    )
    .map((s) => s.trim())
    .filter((s) => s.length >= 10);

  for (const part of sentenceParts) {
    bullets.push(part);
  }

  return bullets;
}

/**
 * Full structured parser for MEB Türkiye Yüzyılı Maarif Modeli "Ders Bilgi Formu" & "Yıllık Plan"
 */
export function parseDersBilgiFormuStructured(
  dersBilgiFormuText: string,
  yillikPlanText = ""
): StructuredDersBilgiFormu {
  const cleanDbf = stripFrontMatter(dersBilgiFormuText || "");
  const cleanYillik = stripFrontMatter(yillikPlanText || "");
  const combined = `${cleanDbf}\n\n${cleanYillik}`;
  const dbfLines = cleanDbf
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const combinedLines = combined
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const meta = extractCleanDocumentMetadata(combined);

  // 1. Canonical Maarif Component Codes (E, SDB, D, OB, KB)
  const egilimler = extractCanonicalMaarifCodes(
    combined,
    "E",
    "E1.4. Kendine İnanma (Öz Yeterlilik), E2.2. Sorumluluk, E2.3. Girişkenlik, E3.2. Odaklanma"
  );
  const sosyalDuygusalBeceriler = extractCanonicalMaarifCodes(
    combined,
    "SDB",
    "SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme"
  );
  const degerler = extractCanonicalMaarifCodes(
    combined,
    "D",
    "D3. Çalışkanlık, D6. Dürüstlük, D12. Sabır, D16. Sorumluluk, D18. Temizlik"
  );
  const okuryazarlikBecerileri = extractCanonicalMaarifCodes(
    combined,
    "OB",
    "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB8. Sürdürülebilirlik Okuryazarlığı"
  );
  const becerilerArasiIliski = extractCanonicalMaarifCodes(
    combined,
    "KB",
    "KB2.2. Gözlemleme, KB3.2. Problem Çözme"
  );

  // 2. Alan Becerileri
  let alanBecerileri = "";
  const rawAlanBlock = extractSectionBetweenHeadings(
    combinedLines,
    /^(?:ALAN\s*BECERİLERİ|Alan\s*Becerileri)(?=$|\s|[:|-])/i,
    /^(?:KAVRAMSAL\s*BECERİLER|BECERİLER\s*ARASI|EĞİLİMLER|PROGRAMLAR\s*ARASI|ÖĞRENME\s*BİRİMİ)(?=$|\s|[:|-])/i,
    10,
    300
  );
  if (rawAlanBlock) {
    const cleanedAlan = rawAlanBlock
      .split(/(?<=[.])\s+/)
      .filter(
        (s) =>
          !/ilişkilendirilerek\s+öğrencilere\s+kazandırılmalıdır|bütünleşik\s+bir\s+yapıda/i.test(
            s
          )
      )
      .join(" ")
      .replace(/^[:|\-–\s]+/, "")
      .trim();
    if (cleanedAlan.length >= 4 && cleanedAlan.length <= 180) {
      alanBecerileri = cleanedAlan;
    }
  }
  if (!alanBecerileri) {
    const uygulamaSkillMatch = combined.match(
      /([A-ZÇĞİÖŞÜ][a-zçğıöşü]+\s+[a-zçğıöşü\s]{3,45}?\s+(?:yöntemlerini|tekniklerini|işlemlerini|süreçlerini)\s+uygulama(?:k|bilme)?)/
    );
    if (uygulamaSkillMatch) {
      alanBecerileri = uygulamaSkillMatch[1].trim();
    } else {
      const cleanCourseTitle = (meta.dersIsmi || "Meslek")
        .replace(/^.*\((.*)\)$/, "$1")
        .toLocaleLowerCase("tr-TR");
      alanBecerileri = `${
        cleanCourseTitle.charAt(0).toLocaleUpperCase("tr-TR") +
        cleanCourseTitle.slice(1)
      } yöntemlerini uygulama`;
    }
  }

  // 3. Disiplinler Arası İlişki
  let disiplinlerArasiIliski = "";
  const rawDisiplinBlock = extractSectionBetweenHeadings(
    combinedLines,
    /^(?:DİSİPLİNLER\s*ARASI\s*İLİŞKİ(?:LER)?|Disiplinler\s*Arası\s*İlişki(?:ler)?)(?=$|\s|[:|-])/i,
    /^(?:BECERİLER\s*ARASI|KAVRAMSAL\s*BECERİLER|ÖĞRENME\s*BİRİMİ|ÖĞRENME\s*ÇIKTILARI|İÇERİK\s*ÇERÇEVESİ|ÖĞRENME\s*KANITLARI)(?=$|\s|[:|-])/i,
    8,
    250
  );
  const foundDisciplines: string[] = [];
  const disciplineSearchTarget = rawDisiplinBlock || combined;
  for (const d of KNOWN_DISCIPLINES) {
    if (
      new RegExp(`(?:^|\\s|[,;|])${d}(?=$|\\s|[,;|.])`, "i").test(
        rawDisiplinBlock || ""
      )
    ) {
      foundDisciplines.push(d);
    }
  }
  if (foundDisciplines.length > 0) {
    disiplinlerArasiIliski = foundDisciplines.join(", ");
  } else if (
    rawDisiplinBlock &&
    rawDisiplinBlock.length >= 4 &&
    rawDisiplinBlock.length <= 120 &&
    !/ilişkilendirilerek/i.test(rawDisiplinBlock)
  ) {
    disiplinlerArasiIliski = rawDisiplinBlock;
  } else {
    for (const d of KNOWN_DISCIPLINES) {
      if (
        new RegExp(`(?:^|\\s|[,;|])${d}(?=$|\\s|[,;|.])`, "i").test(
          disciplineSearchTarget
        )
      ) {
        foundDisciplines.push(d);
      }
    }
    disiplinlerArasiIliski =
      foundDisciplines.slice(0, 4).join(", ") ||
      "Coğrafya, Biyoloji, Matematik";
  }

  // 4. Parse All Learning Outcomes (ST.1.1, ST.1.2, ST.2.1, etc.) and Sub-Process Components (a, b, c, ç, d, e, f, g, ğ, h)
  // Supports multi-line wrapped outcome sentences and multi-line wrapped sub-components in PDF/DOCX tables!
  const outcomesMap: Record<string, ParsedOutcomeEntry> = {};
  const unitsByNumber: Record<number, string> = {};

  const outcomeLineRegex =
    /(?:^|\s|\|)\b([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?\.?(?:\s+([A-ZÇĞİÖŞÜa-zçğıöşü].*))?$/;
  const subCompStartRegex =
    /^(?:\*|\-|\•)?\s*([a-zçğıöşü])\s*[)]\s*(.*)$/i;
  const inlineSubRegex =
    /(?:^|\s|\|)([a-zçğıöşü])\)\s*([^|]+?)(?=(?:\s+[a-zçğıöşü]\)\s|\s*\||$))/gi;
  const stopContinuationRegex =
    /^(?:\d{1,2}\s*\.\s*HAFTA|HAFTA\s*\d{1,2}|İÇERİK\s*ÇERÇEVESİ|ÖĞRENME\s*KANITLARI|ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖLÇME\s*VE\s*DEĞERLENDİRME|TEMEL\s*KABULLER|ÖN\s*DEĞERLENDİRME|KÖPRÜ\s*KURMA|FARKLILAŞTIRMA|Öğrenme\s*Birimi|ÜNİTE|TEMA)(?=$|\s|[:|-])/i;

  let currentOutcomeCode: string | null = null;

  for (let i = 0; i < combinedLines.length; i++) {
    const line = combinedLines[i];

    const outcomeMatch = line.match(outcomeLineRegex);
    if (outcomeMatch) {
      const prefix = outcomeMatch[1];
      const n1 = Number(outcomeMatch[2]);
      const n2 = Number(outcomeMatch[3]);
      const n3 = outcomeMatch[4] ? Number(outcomeMatch[4]) : null;

      if (!/^(?:SDB|KB|OB|AB|E|D)$/i.test(prefix)) {
        const code =
          n3 !== null
            ? `${prefix}.${n1}.${n2}.${n3}`
            : `${prefix}.${n1}.${n2}`;
        const unitNumber = n3 !== null ? n2 : n1;
        const outcomeNumber = n3 !== null ? n3 : n2;

        let fullRest = (outcomeMatch[5] || "").split(/\s*\|\s*/)[0].trim();

        // If the outcome code was on its own line or the sentence wrapped onto the next line(s), join continuation lines!
        let lookahead = i + 1;
        while (
          lookahead < combinedLines.length &&
          lookahead <= i + 4 &&
          (!fullRest ||
            (!/[.!?]$/.test(fullRest.replace(/\s+[a-zçğıöşü]\)\s+.*$/i, "").trim()) &&
              !/\s+[a-zçğıöşü]\)\s+/i.test(fullRest)))
        ) {
          const nextLine = combinedLines[lookahead].split(/\s*\|\s*/)[0].trim();
          if (
            !nextLine ||
            subCompStartRegex.test(nextLine) ||
            outcomeLineRegex.test(nextLine) ||
            stopContinuationRegex.test(nextLine) ||
            Boolean(extractDateRangeFromText(nextLine))
          ) {
            break;
          }
          fullRest = fullRest ? `${fullRest} ${nextLine}` : nextLine;
          i = lookahead;
          lookahead++;
        }

        // Strip any inline sub-components ("a) ... b) ... c) ...") from the main outcome header sentence!
        const cleanMainSentence = fullRest
          .replace(/(?:^|\s)[a-zçğıöşü]\)\s+.*$/i, "")
          .replace(/\s+\d{1,2}\s*Ders\s*Saati.*$/i, "")
          .trim();

        const headerLine = cleanMainSentence
          ? `${code}. ${cleanMainSentence}`
          : outcomesMap[code]?.headerLine || `${code}.`;

        if (!outcomesMap[code]) {
          outcomesMap[code] = {
            code,
            unitNumber,
            outcomeNumber,
            headerLine,
            derivedTopicHeading: deriveTopicHeadingFromOutcome(headerLine),
            subComponents: {},
            orderedSubKeys: [],
          };
        } else if (
          cleanMainSentence.length >
          outcomesMap[code].headerLine.length - code.length - 2
        ) {
          outcomesMap[code].headerLine = headerLine;
          outcomesMap[code].derivedTopicHeading =
            deriveTopicHeadingFromOutcome(headerLine);
        }

        // Extract any inline sub-components ("a) ... b) ...") that appeared on the same line
        let inlineMatch: RegExpExecArray | null;
        inlineSubRegex.lastIndex = 0;
        while ((inlineMatch = inlineSubRegex.exec(fullRest)) !== null) {
          const letter = inlineMatch[1].toLocaleLowerCase("tr-TR");
          const subText = inlineMatch[2]
            .replace(/(?:İçerik\s*Çerçevesi|Ölçme\s*ve\s*Değerlendirme).*$/i, "")
            .trim();
          if (subText.length >= 4) {
            const candidateSub = `${letter}) ${subText}`;
            const existing = outcomesMap[code].subComponents[letter];
            if (!existing || candidateSub.length > existing.length) {
              if (!existing) outcomesMap[code].orderedSubKeys.push(letter);
              outcomesMap[code].subComponents[letter] = candidateSub;
            }
          }
        }

        currentOutcomeCode = code;
        continue;
      }
    }

    const subMatch = line.match(subCompStartRegex);
    if (subMatch && currentOutcomeCode && outcomesMap[currentOutcomeCode]) {
      const letter = subMatch[1].toLocaleLowerCase("tr-TR");
      let subText = (subMatch[2] || "").split(/\s*\|\s*/)[0].trim();

      // Join multi-line wrapped sub-components (up to 4 wrapped lines until sentence end or next item)
      let lookahead = i + 1;
      while (
        lookahead < combinedLines.length &&
        lookahead <= i + 4 &&
        (!subText || !/[.!?]$/.test(subText))
      ) {
        const nextLine = combinedLines[lookahead].split(/\s*\|\s*/)[0].trim();
        if (
          !nextLine ||
          subCompStartRegex.test(nextLine) ||
          outcomeLineRegex.test(nextLine) ||
          stopContinuationRegex.test(nextLine) ||
          Boolean(extractDateRangeFromText(nextLine))
        ) {
          break;
        }
        subText = subText ? `${subText} ${nextLine}` : nextLine;
        i = lookahead;
        lookahead++;
      }

      // Check if multiple sub-components were packed on this line (e.g. "a) ... b) ...")
      if (/\s+[a-zçğıöşü]\)\s+/i.test(subText)) {
        const packedLine = `${letter}) ${subText}`;
        let pm: RegExpExecArray | null;
        inlineSubRegex.lastIndex = 0;
        while ((pm = inlineSubRegex.exec(packedLine)) !== null) {
          const pLetter = pm[1].toLocaleLowerCase("tr-TR");
          const pText = pm[2]
            .replace(/(?:İçerik\s*Çerçevesi|Ölçme\s*ve\s*Değerlendirme).*$/i, "")
            .trim();
          if (pText.length >= 4) {
            const formattedPacked = `${pLetter}) ${pText}`;
            const entry = outcomesMap[currentOutcomeCode];
            const existing = entry.subComponents[pLetter];
            if (!existing || formattedPacked.length > existing.length) {
              if (!existing) entry.orderedSubKeys.push(pLetter);
              entry.subComponents[pLetter] = formattedPacked;
            }
          }
        }
      } else if (subText.length >= 4) {
        const formattedSub = `${letter}) ${subText}`;
        const entry = outcomesMap[currentOutcomeCode];
        const existing = entry.subComponents[letter];
        if (!existing || formattedSub.length > existing.length) {
          if (!existing) entry.orderedSubKeys.push(letter);
          entry.subComponents[letter] = formattedSub;
        }
      }
    }
  }

  // Build full formatted outcomes catalog string for XML context & AI verification
  const rawOutcomesCatalogText = Object.values(outcomesMap)
    .map((entry) => {
      const subs = entry.orderedSubKeys
        .map((k) => entry.subComponents[k])
        .filter(Boolean);
      return [entry.headerLine, ...subs].join("\n");
    })
    .join("\n\n");

  // 5. Extract Öğrenme Kanıtları (Full verbatim multi-paragraph block from Ders Bilgi Formu)
  const ogrenmeKanitlari = extractSectionBetweenHeadings(
    dbfLines.length > 0 ? dbfLines : combinedLines,
    /^(?:ÖĞRENME\s*KANITLARI(?:\s*\(ÖLÇME\s*VE\s*DEĞERLENDİRME\))?|Öğrenme\s*Kanıtları(?:\s*\(Ölçme\s*ve\s*Değerlendirme\))?)(?=$|\s|[:|-])/i,
    /^(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME\s*YAŞANTILARI|Öğrenme\s*[-–]?\s*Öğretme\s*Yaşantıları|Temel\s*Kabuller|TEMEL\s*KABULLER)(?=$|\s|[:|-])/i,
    70,
    3600
  );

  // 6. Extract Temel Kabuller, Ön Değerlendirme Süreci, Köprü Kurma (Full verbatim paragraphs)
  const temelKabuller = extractSectionBetweenHeadings(
    dbfLines.length > 0 ? dbfLines : combinedLines,
    /^(?:TEMEL\s*KABULLER|Temel\s*Kabuller)(?=$|\s|[:|-])/i,
    /^(?:ÖN\s*DEĞERLENDİRME(?:\s*SÜRECİ)?|Ön\s*Değerlendirme(?:\s*Süreci)?|KÖPRÜ\s*KURMA|Köprü\s*Kurma|ÖĞRETME\s*[-–]?\s*ÖĞRENME\s*UYGULAMALARI)(?=$|\s|[:|-])/i,
    25,
    1200
  );

  const onDegerlendirmeSureci = extractSectionBetweenHeadings(
    dbfLines.length > 0 ? dbfLines : combinedLines,
    /^(?:ÖN\s*DEĞERLENDİRME(?:\s*SÜRECİ)?|Ön\s*Değerlendirme(?:\s*Süreci)?)(?=$|\s|[:|-])/i,
    /^(?:KÖPRÜ\s*KURMA|Köprü\s*Kurma|ÖĞRETME\s*[-–]?\s*ÖĞRENME\s*UYGULAMALARI|Öğretme\s*[-–]?\s*Öğrenme\s*Uygulamaları|Öğretme\s*Uygulamaları)(?=$|\s|[:|-])/i,
    25,
    1200
  );

  const kopruKurma = extractSectionBetweenHeadings(
    dbfLines.length > 0 ? dbfLines : combinedLines,
    /^(?:KÖPRÜ\s*KURMA|Köprü\s*Kurma)(?=$|\s|[:|-])/i,
    /^(?:ÖĞRETME\s*[-–]?\s*ÖĞRENME\s*UYGULAMALARI|Öğretme\s*[-–]?\s*Öğrenme\s*Uygulamaları|ÖĞRETME\s*UYGULAMALARI|Öğretme\s*Uygulamaları|FARKLILAŞTIRMA|Farklılaştırma)(?=$|\s|[:|-])/i,
    30,
    1400
  );

  // 7. Extract Öğretme-Öğrenme Uygulamaları (Verbatim from Ders Bilgi Formu, organized by Learning Unit)
  const ogretmeUygulamalariByUnit: Record<string, string[]> = {};
  let allOgretmeUygulamalariBullets: string[] = [];

  const targetLines = dbfLines.length > 0 ? dbfLines : combinedLines;
  let uygulamalarStartIdx = -1;
  let uygulamalarEndIdx = targetLines.length;

  for (let i = 0; i < targetLines.length; i++) {
    if (
      /^(?:ÖĞRETME\s*[-–]?\s*ÖĞRENME\s*UYGULAMALARI|Öğretme\s*[-–]?\s*Öğrenme\s*Uygulamaları|ÖĞRETME\s*UYGULAMALARI|Öğretme\s*Uygulamaları)(?=$|\s|[:|-])/i.test(
        targetLines[i]
      )
    ) {
      uygulamalarStartIdx = i;
      for (let j = i + 1; j < targetLines.length; j++) {
        if (
          /^(?:FARKLILAŞTIRMA|Farklılaştırma|Zenginleştirme|ZENGİNLEŞTİRME|ÖĞRETMEN\s*VE\s*ÖĞRENCİ|UYGUNDUR)(?=$|\s|[:|-])/i.test(
            targetLines[j]
          )
        ) {
          uygulamalarEndIdx = j;
          break;
        }
      }
      break;
    }
  }

  if (uygulamalarStartIdx !== -1) {
    const rawUygulamaLines: string[] = [];
    const firstRemainder = targetLines[uygulamalarStartIdx]
      .replace(
        /^(?:ÖĞRETME\s*[-–]?\s*ÖĞRENME\s*UYGULAMALARI|Öğretme\s*[-–]?\s*Öğrenme\s*Uygulamaları|ÖĞRETME\s*UYGULAMALARI|Öğretme\s*Uygulamaları)\s*[:|-]?\s*/i,
        ""
      )
      .trim();
    if (firstRemainder) rawUygulamaLines.push(firstRemainder);

    for (let k = uygulamalarStartIdx + 1; k < uygulamalarEndIdx; k++) {
      rawUygulamaLines.push(targetLines[k]);
    }

    const unitSubheadingRegex =
      /^\*?\s*([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s-]{2,42}):\s*(.*)$/;
    let activeUnitKey = "";
    let activeUnitTitle = "";
    let currentUnitLines: string[] = [];
    let unitCounter = 0;

    const flushUnit = () => {
      if (activeUnitKey && currentUnitLines.length > 0) {
        const bullets = splitOgretmeUygulamalariIntoBullets(
          currentUnitLines.join("\n"),
          activeUnitTitle
        );
        if (bullets.length > 0) {
          ogretmeUygulamalariByUnit[activeUnitKey] = bullets;
        }
      }
    };

    for (const uLine of rawUygulamaLines) {
      const m = uLine.match(unitSubheadingRegex);
      if (
        m &&
        !/^(?:Örneğin|Not|Açıklama|Dikkat|Öğretmen|Öğrenciler|Bu\s+süreçte)/i.test(
          m[1].trim()
        )
      ) {
        flushUnit();
        activeUnitTitle = m[1].trim();
        activeUnitKey = activeUnitTitle.toLocaleLowerCase("tr-TR");
        unitCounter++;
        if (!unitsByNumber[unitCounter]) {
          unitsByNumber[unitCounter] = activeUnitTitle;
        }
        currentUnitLines = [`${activeUnitTitle}:`];
        if (m[2].trim()) {
          currentUnitLines.push(m[2].trim());
        }
      } else {
        currentUnitLines.push(uLine);
      }
    }
    flushUnit();

    allOgretmeUygulamalariBullets = splitOgretmeUygulamalariIntoBullets(
      rawUygulamaLines.join("\n")
    );
  }

  for (const outcome of Object.values(outcomesMap)) {
    if (!unitsByNumber[outcome.unitNumber]) {
      const baseTopic = outcome.derivedTopicHeading
        .replace(
          /\s+(?:İlkeleri|Yönetimi|Uygulamaları|Kuralları|Yöntemleri|Süreçleri)$/i,
          ""
        )
        .trim();
      if (baseTopic.length >= 3) {
        unitsByNumber[outcome.unitNumber] = baseTopic;
      }
    }
  }

  // 8. Extract Farklılaştırma
  const rawFarklilastirma = extractSectionBetweenHeadings(
    dbfLines.length > 0 ? dbfLines : combinedLines,
    /^(?:FARKLILAŞTIRMA|Farklılaştırma)(?=$|\s|[:|-])/i,
    /^(?:UYGUNDUR|ÖĞRETMEN|OKUL\s*MÜDÜRÜ|\d{1,2}\s*\.\s*HAFTA)(?=$|\s|[:|-])/i,
    25,
    1000
  );
  const farklilastirma =
    rawFarklilastirma &&
    !/^(?:UYGUNDUR|Ders\s*Öğretmeni|Okul\s*Müdürü)/i.test(rawFarklilastirma)
      ? rawFarklilastirma
      : "";

  // 9. Collect raw Maarif codes (including sub-codes like D3.2, D12.3, D16.3, D18.3, OB8, E1.4, KB2.2, SDB2.2)
  const rawCodeMatches =
    combined.match(/\b(?:SDB|KB|OB|E|D)\d{1,2}(?:\.\d{1,2})*\b/g) || [];
  const rawActivityCodes = Array.from(new Set(rawCodeMatches));

  return {
    sinif: meta.sinifDuzeyi || "9. SINIF",
    ders: meta.dersIsmi || "MESLEK DERSİ",
    sure: meta.sure || "2 Ders Saati",
    alanBecerileri,
    egilimler,
    sosyalDuygusalBeceriler,
    degerler,
    okuryazarlikBecerileri,
    disiplinlerArasiIliski,
    becerilerArasiIliski,
    unitsByNumber,
    outcomesMap,
    ogrenmeKanitlari,
    temelKabuller,
    onDegerlendirmeSureci,
    kopruKurma,
    ogretmeUygulamalariByUnit,
    allOgretmeUygulamalariBullets,
    farklilastirma,
    rawActivityCodes,
    rawOutcomesCatalogText,
    rawDbfText: cleanDbf,
    rawYillikPlanText: cleanYillik,
  };
}

export interface WeekSpecificExtraction {
  haftaNo: number;
  haftaEtiketi: string;
  tarihAraligi: string;
  sure: string;
  ogrenmeBirimi: string;
  icerikCercevesi: string;
  outcomeCode: string;
  outcomeHeader: string;
  weekSubComponents: string[];
  formattedOutcomeAndProcessBlock: string;
  unitOgretmeUygulamalari: string[];
  rawWeekWindowText: string;
  searchKeywords: string[];
}

export function extractWeekPlanStructured(
  yillikPlanText: string,
  haftaEtiketi: string,
  tarihAraligi: string,
  structuredDbf: StructuredDersBilgiFormu,
  selectedWeekObj?: YillikPlanWeekItem | null
): WeekSpecificExtraction {
  const cleanYillik = stripFrontMatter(yillikPlanText || "");
  const lines = cleanYillik
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const weekNumMatch = (haftaEtiketi || "").match(/(\d{1,2})/);
  const targetWeekNo =
    selectedWeekObj?.haftaNo || (weekNumMatch ? Number(weekNumMatch[1]) : 1);
  const inputDate = (
    tarihAraligi ||
    selectedWeekObj?.tarihAraligi ||
    ""
  ).trim();
  const normInputDate = normalizeDateForMatch(inputDate);

  // 1. Scan all week/date anchors across the Yıllık Plan so we know exact boundaries
  // (including vertically-centered PDF table rows where top lines of a cell appear 1-5 lines ABOVE the week/date anchor!)
  interface WeekRowAnchor {
    weekNo: number;
    lineIdx: number;
    dateRange: string;
  }
  const anchors: WeekRowAnchor[] = [];
  const seenWeekNos = new Set<number>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const wMatch = line.match(
      /(?:\b(\d{1,2})\s*\.\s*HAFTA|\bHAFTA\s*[:|-]?\s*(\d{1,2})\b)/i
    );
    const lineDate = extractDateRangeFromText(line);

    if (wMatch) {
      const wNo = Number(wMatch[1] || wMatch[2]);
      if (wNo >= 1 && wNo <= 42 && !seenWeekNos.has(wNo)) {
        seenWeekNos.add(wNo);
        let foundDate = lineDate;
        if (!foundDate) {
          for (
            let k = Math.max(0, i - 2);
            k <= Math.min(lines.length - 1, i + 3);
            k++
          ) {
            const nearDate = extractDateRangeFromText(lines[k]);
            if (nearDate) {
              foundDate = nearDate;
              break;
            }
          }
        }
        anchors.push({ weekNo: wNo, lineIdx: i, dateRange: foundDate });
      }
    }
  }

  // Find the best anchor matching EITHER the exact date range OR the targetWeekNo
  let matchedAnchorIdx = -1;
  if (normInputDate.length >= 4) {
    matchedAnchorIdx = anchors.findIndex((a) => {
      const normAnchorDate = normalizeDateForMatch(a.dateRange);
      return (
        normAnchorDate.length >= 4 &&
        (normAnchorDate === normInputDate ||
          normAnchorDate.includes(normInputDate) ||
          normInputDate.includes(normAnchorDate))
      );
    });
  }
  if (matchedAnchorIdx === -1) {
    matchedAnchorIdx = anchors.findIndex((a) => a.weekNo === targetWeekNo);
  }

  let anchorLineIdx = -1;
  let prevAnchorLineIdx = -1;
  let nextAnchorLineIdx = lines.length;
  let detectedTarihAraligi = inputDate;

  if (matchedAnchorIdx !== -1) {
    const currentAnchor = anchors[matchedAnchorIdx];
    anchorLineIdx = currentAnchor.lineIdx;
    if (currentAnchor.dateRange) {
      detectedTarihAraligi = currentAnchor.dateRange;
    }
    if (matchedAnchorIdx > 0) {
      prevAnchorLineIdx = anchors[matchedAnchorIdx - 1].lineIdx;
    }
    if (matchedAnchorIdx + 1 < anchors.length) {
      nextAnchorLineIdx = anchors[matchedAnchorIdx + 1].lineIdx;
    }
  } else {
    // Fallback: search directly by date string or week regex in lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const exactWeekRegex = new RegExp(
        `\\b${targetWeekNo}\\s*\\.\\s*HAFTA(?=$|\\s|[|(:])`,
        "i"
      );
      const lineDate = extractDateRangeFromText(line);
      const normLineDate = normalizeDateForMatch(lineDate || line);
      const hasDateMatch =
        normInputDate.length >= 4 &&
        normLineDate.includes(normInputDate);

      if (hasDateMatch || exactWeekRegex.test(line)) {
        anchorLineIdx = i;
        if (lineDate) detectedTarihAraligi = lineDate;
        for (let j = i + 1; j < Math.min(lines.length, i + 45); j++) {
          if (
            /\b\d{1,2}\s*\.\s*HAFTA(?=$|\s|[|(:])/i.test(lines[j])
          ) {
            nextAnchorLineIdx = j;
            break;
          }
        }
        break;
      }
    }
  }

  // Handle vertically-centered PDF table rows:
  // Check up to 5 lines ABOVE anchorLineIdx (but strictly after prevAnchorLineIdx) for outcome codes or sub-components that belong to the top of this same row!
  let effectiveStartIdx = anchorLineIdx;
  let effectiveEndIdx = Math.min(lines.length, nextAnchorLineIdx);

  if (anchorLineIdx !== -1) {
    const minLookbehind =
      prevAnchorLineIdx !== -1
        ? Math.max(prevAnchorLineIdx + 1, anchorLineIdx - 5)
        : Math.max(0, anchorLineIdx - 5);

    // Only pull in lines above anchorLineIdx if anchorLineIdx itself is separated from prevAnchorLineIdx by enough lines
    // and the lines right above anchorLineIdx contain an outcome header or start of this row's cell
    if (prevAnchorLineIdx === -1 || anchorLineIdx - prevAnchorLineIdx >= 4) {
      for (let b = anchorLineIdx - 1; b >= minLookbehind; b--) {
        const bLine = lines[b];
        if (
          /\b([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})\b/.test(bLine) ||
          /^(?:Öğrenme\s*Birimi|Ünite|Tema)\s*[:|-]/i.test(bLine)
        ) {
          effectiveStartIdx = b;
        }
      }
    }

    // Also avoid bleeding into the top of nextAnchorLineIdx if an outcome code appears 1 line right above nextAnchorLineIdx
    // when the current row already has its own outcome and sub-components
    if (nextAnchorLineIdx < lines.length && nextAnchorLineIdx - anchorLineIdx >= 4) {
      const lineBeforeNext = lines[nextAnchorLineIdx - 1];
      if (
        /\b([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})\b/.test(lineBeforeNext) &&
        /\b([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})\b/.test(
          lines.slice(effectiveStartIdx, nextAnchorLineIdx - 1).join("\n")
        )
      ) {
        effectiveEndIdx = nextAnchorLineIdx - 1;
      }
    }
  }

  const weekLines =
    effectiveStartIdx !== -1
      ? lines.slice(effectiveStartIdx, effectiveEndIdx)
      : lines.slice(0, Math.min(lines.length, 35));
  const rawWeekWindowText = weekLines.join("\n");

  // If detectedTarihAraligi was still empty or generic ("6. Hafta"), check inside weekLines
  if (
    !detectedTarihAraligi ||
    /^\d+\s*\.\s*hafta$/i.test(detectedTarihAraligi)
  ) {
    const inWindowDate = extractDateRangeFromText(rawWeekWindowText);
    if (inWindowDate) {
      detectedTarihAraligi = inWindowDate;
    }
  }

  // 2. Identify ALL Outcome Codes & Multi-Line Sub-Process Components in this week's block
  const outcomeCodePattern =
    /\b([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?\b/g;
  const subStartLineRegex =
    /^(?:\*|\-|\•)?\s*([a-zçğıöşü])\s*[)]\s*(.*)$/i;
  const inlineSubRegex =
    /(?:^|\s|\|)([a-zçğıöşü])\)\s*([^|]+?)(?=(?:\s+[a-zçğıöşü]\)\s|\s*\||$))/gi;
  const stopSubContinuationRegex =
    /^(?:\d{1,2}\s*\.\s*HAFTA|HAFTA\s*\d{1,2}|İÇERİK\s*ÇERÇEVESİ|ÖĞRENME\s*KANITLARI|ÖLÇME\s*VE\s*DEĞERLENDİRME|Öğrenme\s*Birimi|ÜNİTE|TEMA)(?=$|\s|[:|-])/i;

  const detectedCodes: string[] = [];
  const inlineHeadersByCode: Record<string, string> = {};
  let detectedUnitNo = 1;

  // First, join wrapped lines in weekLines so multi-line outcome headers and sub-components are never cut in half!
  const unwrappedWeekLines: string[] = [];
  for (let i = 0; i < weekLines.length; i++) {
    let curr = weekLines[i];
    const isSubOrOutcome =
      subStartLineRegex.test(curr) ||
      /\b([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})\b/.test(curr);

    if (isSubOrOutcome) {
      while (
        i + 1 < weekLines.length &&
        !/[.!?]$/.test(curr.split(/\s*\|\s*/)[0].trim()) &&
        !subStartLineRegex.test(weekLines[i + 1]) &&
        !/\b([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})\b/.test(weekLines[i + 1]) &&
        !stopSubContinuationRegex.test(weekLines[i + 1]) &&
        !extractDateRangeFromText(weekLines[i + 1])
      ) {
        curr = `${curr} ${weekLines[i + 1]}`;
        i++;
      }
    }
    unwrappedWeekLines.push(curr);
  }

  for (const wLine of unwrappedWeekLines) {
    let m: RegExpExecArray | null;
    outcomeCodePattern.lastIndex = 0;
    while ((m = outcomeCodePattern.exec(wLine)) !== null) {
      const prefix = m[1];
      if (!/^(?:SDB|KB|OB|AB|E|D)$/i.test(prefix)) {
        const code = m[0];
        if (!detectedCodes.includes(code)) {
          detectedCodes.push(code);
        }
        if (detectedCodes.length === 1) {
          detectedUnitNo = m[4] ? Number(m[3]) : Number(m[2]);
        }
        const afterCode = wLine
          .slice(m.index)
          .split(/\s*\|\s*/)[0]
          .replace(/(?:^|\s)[a-zçğıöşü]\)\s+.*$/i, "")
          .replace(/\s+\d{1,2}\s*Ders\s*Saati.*$/i, "")
          .trim();
        if (
          afterCode.length > code.length + 3 &&
          (!inlineHeadersByCode[code] ||
            afterCode.length > inlineHeadersByCode[code].length)
        ) {
          inlineHeadersByCode[code] = afterCode;
        }
      }
    }
  }

  // Extract sub-process components (a), b), c), ç), d), e), f), g), ğ)) from unwrappedWeekLines
  const weekSubMap = new Map<string, string>();
  for (const wLine of unwrappedWeekLines) {
    let sm: RegExpExecArray | null;
    inlineSubRegex.lastIndex = 0;
    while ((sm = inlineSubRegex.exec(wLine)) !== null) {
      const letter = sm[1].toLocaleLowerCase("tr-TR");
      const textPart = sm[2]
        .replace(
          /(?:İçerik\s*Çerçevesi|Ölçme\s*ve\s*Değerlendirme|Öğrenme\s*Kanıtları|Belirli\s*Gün).*$/i,
          ""
        )
        .trim();
      if (textPart.length >= 4) {
        const formatted = `${letter}) ${textPart}`;
        const existing = weekSubMap.get(letter);
        if (!existing || formatted.length > existing.length) {
          weekSubMap.set(letter, formatted);
        }
      }
    }
  }

  let detectedCode = detectedCodes[0] || "";

  // If no outcome code was explicitly on this week's row, match via sub-component text in outcomesMap or look behind in lines
  if (!detectedCode) {
    if (weekSubMap.size > 0) {
      const firstSubText = Array.from(weekSubMap.values())[0]
        .replace(/^[a-zçğıöşü]\)\s*/i, "")
        .slice(0, 28)
        .toLocaleLowerCase("tr-TR");
      for (const entry of Object.values(structuredDbf.outcomesMap)) {
        for (const subVal of Object.values(entry.subComponents)) {
          if (subVal.toLocaleLowerCase("tr-TR").includes(firstSubText)) {
            detectedCode = entry.code;
            detectedCodes.push(detectedCode);
            detectedUnitNo = entry.unitNumber;
            break;
          }
        }
        if (detectedCode) break;
      }
    }
    if (!detectedCode && effectiveStartIdx > 0) {
      for (let b = effectiveStartIdx - 1; b >= Math.max(0, effectiveStartIdx - 30); b--) {
        outcomeCodePattern.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = outcomeCodePattern.exec(lines[b])) !== null) {
          if (!/^(?:SDB|KB|OB|AB|E|D)$/i.test(m[1])) {
            detectedCode = m[0];
            detectedCodes.push(detectedCode);
            detectedUnitNo = m[4] ? Number(m[3]) : Number(m[2]);
            break;
          }
        }
        if (detectedCode) break;
      }
    }
  }

  const catalogEntry = detectedCode
    ? structuredDbf.outcomesMap[detectedCode]
    : Object.values(structuredDbf.outcomesMap)[0];

  if (catalogEntry && !detectedCode) {
    detectedCode = catalogEntry.code;
    detectedCodes.push(detectedCode);
    detectedUnitNo = catalogEntry.unitNumber;
  }

  // 3. Build clean Outcome Header(s) + Week-Specific Complete Sub-Components
  const outcomeHeader = (
    catalogEntry?.headerLine ||
    inlineHeadersByCode[detectedCode] ||
    (selectedWeekObj?.konuVeCiktiOzeti
      ? selectedWeekObj.konuVeCiktiOzeti
          .split(" · ")[0]
          .replace(
            /^.*?(\b[A-ZÇĞİÖŞÜ]{2,8}\.\d+(?:\.\d+)*\.?\s+)/,
            "$1"
          )
      : `${detectedCode || "ST.1.1"}. Seçilen hafta öğrenme çıktısı.`)
  )
    .replace(/(?:^|\s)[a-zçğıöşü]\)\s+.*$/i, "")
    .trim();

  let finalSubComponents: string[] = [];
  if (weekSubMap.size > 0) {
    for (const [letter, rawLine] of weekSubMap.entries()) {
      // Search across all detected outcome codes in outcomesMap for the longest, complete sub-component sentence
      let catalogSub = catalogEntry?.subComponents[letter] || "";
      for (const code of detectedCodes) {
        const cand = structuredDbf.outcomesMap[code]?.subComponents[letter];
        if (cand && cand.length > catalogSub.length) {
          catalogSub = cand;
        }
      }
      if (catalogSub && catalogSub.length >= rawLine.length) {
        finalSubComponents.push(catalogSub);
      } else {
        finalSubComponents.push(rawLine);
      }
    }
  } else if (catalogEntry && catalogEntry.orderedSubKeys.length > 0) {
    finalSubComponents = catalogEntry.orderedSubKeys.map(
      (k) => catalogEntry.subComponents[k]
    );
  }

  // If the week had additional outcome codes (e.g., 2 outcomes in the same week), include their headers too
  const additionalHeaders: string[] = [];
  for (let cIdx = 1; cIdx < detectedCodes.length; cIdx++) {
    const extraCode = detectedCodes[cIdx];
    const extraHeader =
      structuredDbf.outcomesMap[extraCode]?.headerLine ||
      inlineHeadersByCode[extraCode];
    if (extraHeader && extraHeader !== outcomeHeader) {
      additionalHeaders.push(
        extraHeader.replace(/(?:^|\s)[a-zçğıöşü]\)\s+.*$/i, "").trim()
      );
    }
  }

  const formattedOutcomeAndProcessBlock = [
    outcomeHeader,
    ...additionalHeaders,
    ...finalSubComponents,
  ]
    .filter(Boolean)
    .join("\n");

  // 4. Determine Öğrenme Birimi (Priority: explicit in week -> selectedWeekObj -> structuredDbf.unitsByNumber)
  let ogrenmeBirimi = "";
  const unitInWeek = rawWeekWindowText.match(
    /(?:Öğrenme\s*Birimi|Ünite|Tema)\s*(?!VE\s*SÜRE)[:|-]\s*([^|\n]+)/i
  );
  if (
    unitInWeek &&
    !/^(?:VE\s*SÜRE|SÜRE|SAAT)$/i.test(unitInWeek[1].trim())
  ) {
    ogrenmeBirimi = unitInWeek[1].trim();
  }
  if (
    !ogrenmeBirimi &&
    selectedWeekObj?.ogrenmeBirimi &&
    !/^(?:VE\s*SÜRE|SÜRE|SAAT|\d+\s*\.\s*HAFTA)$/i.test(
      selectedWeekObj.ogrenmeBirimi.trim()
    )
  ) {
    ogrenmeBirimi = selectedWeekObj.ogrenmeBirimi.trim();
  }
  if (!ogrenmeBirimi && structuredDbf.unitsByNumber[detectedUnitNo]) {
    ogrenmeBirimi = structuredDbf.unitsByNumber[detectedUnitNo];
  }
  if (!ogrenmeBirimi) {
    ogrenmeBirimi =
      deriveTopicHeadingFromOutcome(outcomeHeader).replace(
        /\s+(?:İlkeleri|Yönetimi|Uygulamaları|Kuralları)$/i,
        ""
      ) || structuredDbf.ders;
  }

  // 5. Determine İçerik Çerçevesi (Never "16. Hafta")
  let icerikCercevesi = "";
  const icerikInWeek = rawWeekWindowText.match(
    /(?:İçerik\s*Çerçevesi|Konu)\s*[:|-]\s*([^|\n]{4,90})/i
  );
  if (
    icerikInWeek &&
    !/^\d+\s*\.\s*hafta$/i.test(icerikInWeek[1].trim()) &&
    !/^(?:Ölçme|Öğrenme|Süreç)/i.test(icerikInWeek[1].trim())
  ) {
    icerikCercevesi = icerikInWeek[1].trim();
  }
  if (!icerikCercevesi && catalogEntry?.derivedTopicHeading) {
    icerikCercevesi = catalogEntry.derivedTopicHeading;
  }
  if (!icerikCercevesi || /^\d+\s*\.\s*hafta$/i.test(icerikCercevesi)) {
    icerikCercevesi =
      deriveTopicHeadingFromOutcome(outcomeHeader) || ogrenmeBirimi;
  }

  // 6. Determine Süre
  const sureInWeek =
    selectedWeekObj?.sure ||
    rawWeekWindowText.match(/\b(\d{1,2})\s*(?:Ders\s*)?Saat[i]?\b/i)?.[1] ||
    structuredDbf.sure;
  const sure = /saat/i.test(sureInWeek)
    ? sureInWeek
    : `${sureInWeek} Ders Saati`;

  // 7. Match Öğretme Uygulamaları for this Learning Unit from Ders Bilgi Formu
  const lowerUnit = ogrenmeBirimi.toLocaleLowerCase("tr-TR");
  let unitOgretmeUygulamalari: string[] = [];

  for (const [unitKey, bullets] of Object.entries(
    structuredDbf.ogretmeUygulamalariByUnit
  )) {
    if (unitKey.includes(lowerUnit) || lowerUnit.includes(unitKey)) {
      unitOgretmeUygulamalari = bullets;
      break;
    }
  }
  if (
    unitOgretmeUygulamalari.length === 0 &&
    Object.values(structuredDbf.ogretmeUygulamalariByUnit)[detectedUnitNo - 1]
  ) {
    unitOgretmeUygulamalari = Object.values(
      structuredDbf.ogretmeUygulamalariByUnit
    )[detectedUnitNo - 1];
  }
  if (
    unitOgretmeUygulamalari.length === 0 &&
    structuredDbf.allOgretmeUygulamalariBullets.length > 0
  ) {
    unitOgretmeUygulamalari = structuredDbf.allOgretmeUygulamalariBullets;
  }

  // 8. Build rich search keywords for slicing Ders Materyali (textbook) specifically for this week's sub-components
  const searchKeywords = new Set<string>();
  if (detectedCode) searchKeywords.add(detectedCode);
  if (icerikCercevesi) searchKeywords.add(icerikCercevesi);
  if (ogrenmeBirimi) searchKeywords.add(ogrenmeBirimi);

  for (const sub of finalSubComponents) {
    const cleanSub = sub
      .replace(/^[a-zçğıöşü]\)\s*/i, "")
      .replace(
        /\s+(?:açıklanır|sıralanır|uygulanır|incelenir|belirlenir|gösterilir|tartışılır|açıklar|sıralar)\.?$/i,
        ""
      )
      .trim();
    if (cleanSub.length >= 5) {
      searchKeywords.add(cleanSub);
      const words = cleanSub.split(/\s+/).filter((w) => w.length >= 4);
      if (words.length >= 2) {
        searchKeywords.add(words.slice(0, 3).join(" "));
      }
    }
  }

  return {
    haftaNo: targetWeekNo,
    haftaEtiketi: haftaEtiketi || `${targetWeekNo}. HAFTA`,
    tarihAraligi: detectedTarihAraligi || tarihAraligi,
    sure,
    ogrenmeBirimi,
    icerikCercevesi,
    outcomeCode: detectedCode,
    outcomeHeader,
    weekSubComponents: finalSubComponents,
    formattedOutcomeAndProcessBlock,
    unitOgretmeUygulamalari,
    rawWeekWindowText,
    searchKeywords: Array.from(searchKeywords),
  };
}

export function extractWeekMateryalSlice(
  dersMateryaliText: string,
  weekData: WeekSpecificExtraction,
  maxChars = 9500
): string {
  const cleaned = stripFrontMatter(dersMateryaliText || "").trim();
  if (cleaned.length <= maxChars) return cleaned;

  const lines = cleaned.split(/\r?\n/);
  const matchedBlocks: string[] = [];

  for (const keyword of weekData.searchKeywords) {
    const lowerKey = keyword.toLocaleLowerCase("tr-TR");
    if (lowerKey.length < 4) continue;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLocaleLowerCase("tr-TR").includes(lowerKey)) {
        const start = Math.max(0, i - 4);
        const end = Math.min(lines.length, i + 45);
        const snippet = lines.slice(start, end).join("\n").trim();
        if (snippet && !matchedBlocks.includes(snippet)) {
          matchedBlocks.push(snippet);
        }
        i += 30;
        if (matchedBlocks.join("\n\n").length >= maxChars * 0.85) break;
      }
    }
    if (matchedBlocks.join("\n\n").length >= maxChars * 0.85) break;
  }

  if (matchedBlocks.length > 0) {
    return matchedBlocks.join("\n\n---\n\n").slice(0, maxChars);
  }

  const offset = Math.min(Math.floor(cleaned.length * 0.08), 2500);
  return cleaned.slice(offset, offset + maxChars);
}

export function buildWeekSpecificActivitiesFallback(
  weekData: WeekSpecificExtraction,
  structuredDbf: StructuredDersBilgiFormu,
  _materyalSlice: string
): {
  Guduleme: string[];
  Dikkat_Cekme: string[];
  Ek_Ogretme_Uygulamalari: string[];
  Ogretme_Uygulamalari: string[];
} {
  const cleanSubTopics = weekData.weekSubComponents.map((s) =>
    s
      .replace(/^[a-zçğıöşü]\)\s*/i, "")
      .replace(
        /\s+(?:açıklanır|sıralanır|uygulanır|incelenir|belirlenir|açıklar|sıralar)\.?$/i,
        ""
      )
      .trim()
  );

  const primaryFocus =
    cleanSubTopics[0] || weekData.icerikCercevesi || weekData.ogrenmeBirimi;
  const secondaryFocus =
    cleanSubTopics[1] ||
    cleanSubTopics[0] ||
    `${weekData.ogrenmeBirimi} uygulamaları`;

  const Guduleme: string[] = [
    `Bu derste ${primaryFocus.toLocaleLowerCase("tr-TR")} konusunun temel ilkelerini ve ${weekData.ogrenmeBirimi.toLocaleLowerCase("tr-TR")} içerisindeki yerini kapsamlı biçimde öğreneceksiniz.`,
    `${
      secondaryFocus.charAt(0).toLocaleUpperCase("tr-TR") +
      secondaryFocus.slice(1).toLocaleLowerCase("tr-TR")
    } süreçlerinin uygulama basamaklarını ve sağladığı kazanımları detaylıca kavrayacaksınız.`,
    `Doğal kaynakları ve üretim ortamını koruyarak sürdürülebilir uygulama yapmanın mesleki verimliliği nasıl artırdığını keşfedeceksiniz.`,
    `Edineceğiniz bilgi ve becerilerle sahada karşılaşılan problemlere çevre dostu ve bilimsel çözümler geliştirme yetkinliği kazanacaksınız.`,
  ];

  const Dikkat_Cekme: string[] = [
    `Geleneksel yöntemler yerine ${primaryFocus.toLocaleLowerCase("tr-TR")} ilkelerini uygulamak üretim ve çevre sağlığına gerçekten nasıl bir fark kazandırır?`,
    `${
      secondaryFocus.charAt(0).toLocaleUpperCase("tr-TR") +
      secondaryFocus.slice(1).toLocaleLowerCase("tr-TR")
    } aşamalarında yapılacak doğru bir planlama hem zamandan hem de kaynaklardan tasarruf etmeyi nasıl sağlar?`,
    `Çevrenizdeki uygulamalarda ${weekData.icerikCercevesi.toLocaleLowerCase("tr-TR")} açısından karşılaşılan en önemli teknik veya çevresel engel sizce ne olabilir?`,
    `Doğadaki doğal döngüleri koruyarak hem yüksek verim elde etmek hem de gelecek nesillere sağlıklı bir ekosistem bırakmak nasıl mümkün olabilir?`,
  ];

  const obCodes = structuredDbf.rawActivityCodes.filter((c) =>
    c.startsWith("OB")
  );
  const kbCodes = structuredDbf.rawActivityCodes.filter((c) =>
    c.startsWith("KB")
  );
  const eCodes = structuredDbf.rawActivityCodes.filter((c) =>
    c.startsWith("E")
  );
  const dCodes = structuredDbf.rawActivityCodes.filter((c) =>
    c.startsWith("D")
  );
  const sdbCodes = structuredDbf.rawActivityCodes.filter((c) =>
    c.startsWith("SDB")
  );

  const pair1 = `(${obCodes[0] || "OB1"}, ${kbCodes[0] || "KB2.2"})`;
  const pair2 = `(${obCodes[2] || obCodes[1] || "OB8"}, ${eCodes[0] || "E1.4"})`;
  const pair3 = `(${kbCodes[1] || kbCodes[0] || "KB3.2"}, ${dCodes[0] || "D3.2"})`;
  const pair4 = `(${dCodes[2] || dCodes[1] || "D16.3"}, ${sdbCodes[1] || "SDB3.3"})`;
  const pair5 = `(${sdbCodes[0] || "SDB2.2"}, ${eCodes[1] || "E2.2"}, ${eCodes[2] || "E2.3"})`;
  const pair6 = `(${obCodes[1] || "OB2"}, ${dCodes[1] || "D12.3"})`;

  const Ek_Ogretme_Uygulamalari: string[] = [
    `${
      primaryFocus.charAt(0).toLocaleUpperCase("tr-TR") + primaryFocus.slice(1)
    } konusunun temel aşamalarını ve uygulama ilkelerini gösteren şematik kesitler ve görseller sınıfta incelenebilir ${pair1}.`,
    `Öğrenciler ${secondaryFocus.toLocaleLowerCase("tr-TR")} kapsamındaki yöntem ve materyallerin kritik noktalarını karşılaştırmalı olarak analiz edebilir ${pair2}.`,
    `${weekData.icerikCercevesi} uygulamalarının kaynak tasarrufu, verimlilik ve çevre koruma açısından sağladığı yararlar somut saha verileriyle açıklanabilir ${pair3}.`,
    `Konu kapsamındaki sistemlerin bölge koşullarına ve uygulama alanına uygun tasarlanma süreçleri örnek senaryolar üzerinden tartışılabilir ${pair4}.`,
    `Öğrencilerin ${primaryFocus.toLocaleLowerCase("tr-TR")} sürecinde karşılaşılabilecek temel zorluklara yönelik akılcı çözüm önerileri geliştirmeleri sağlanabilir ${pair5}.`,
    `${weekData.ogrenmeBirimi} uygulamalarının sürdürülebilirlik ve ekosistem dengesi üzerindeki rolü kavram haritaları veya infografiklerle gösterilebilir ${pair6}.`,
  ];

  let Ogretme_Uygulamalari = weekData.unitOgretmeUygulamalari;
  if (Ogretme_Uygulamalari.length === 0) {
    const allCodesList =
      structuredDbf.rawActivityCodes.length > 0
        ? structuredDbf.rawActivityCodes.slice(0, 10).join(", ")
        : "E1.4, E2.2, E2.3, SDB2.2, SDB3.3, KB3.2, D3.2, D16.3, OB1";

    Ogretme_Uygulamalari = [
      `${weekData.ogrenmeBirimi}:`,
      `Öğretmen tarafından ${primaryFocus.toLocaleLowerCase("tr-TR")} konusunun önemi, temel ilkeleri ve uygulama basamakları açıklanır.`,
      `Öğrencilerden ${primaryFocus.toLocaleLowerCase("tr-TR")} ve ${secondaryFocus.toLocaleLowerCase("tr-TR")} hakkında araştırma yaparak bu yöntemlerin önemini ve faydalarını yansıtan bir sunum veya afiş tasarlamaları; çalışmaları iş birliği ve sorumluluk bilinciyle sunmaları ve sonuçlarını raporlaştırmaları istenir.`,
      `Bu süreçte öğrencilerin araştırma, planlama, gözlem, veri kaydı, rapor yazma ve sunum becerileri dereceli puanlama anahtarı (rubrik) ile değerlendirilebilir (${allCodesList}).`,
    ];
  }

  return {
    Guduleme,
    Dikkat_Cekme,
    Ek_Ogretme_Uygulamalari,
    Ogretme_Uygulamalari,
  };
}

const TURKISH_STOP_WORDS = new Set([
  "ve",
  "veya",
  "ile",
  "için",
  "bir",
  "bu",
  "şu",
  "o",
  "da",
  "de",
  "ki",
  "mi",
  "mı",
  "mu",
  "mü",
  "gibi",
  "kadar",
  "olarak",
  "üzere",
  "göre",
  "daha",
  "çok",
  "en",
  "her",
  "tüm",
  "bütün",
  "olan",
  "olup",
  "olur",
  "olması",
  "tarafından",
  "kapsamında",
  "üzerinden",
  "ilgili",
  "yönelik",
]);

/**
 * Normalizes Turkish text for token and n-gram similarity comparisons.
 */
export function normalizeForSimilarity(text: string): string {
  return (text || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/^\s*[*•\-–]\s*/gm, "")
    .replace(/[^\p{L}\p{N}\s.]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts significant content tokens (excluding stop words) from Turkish text.
 */
export function extractSignificantTokens(text: string): string[] {
  const norm = normalizeForSimilarity(text);
  if (!norm) return [];
  return norm
    .split(" ")
    .map((t) => t.replace(/^\.+|\.+$/g, "").trim())
    .filter((t) => t.length >= 3 && !TURKISH_STOP_WORDS.has(t));
}

export interface TextSimilarityAnalysis {
  overallScore: number; // 0..1 composite similarity score
  tokenContainmentScore: number; // fraction of candidate tokens present in source
  jaccardScore: number; // token set Jaccard overlap
  bigramOverlapScore: number; // word bigram overlap
  codeAlignmentScore: number; // Maarif component code overlap (E, SDB, D, OB, KB, outcome codes)
  hasConflict: boolean; // true if AI text diverges/conflicts with original document text
}

/**
 * Computes multi-metric text similarity between a candidate text (e.g. AI output)
 * and a reference text from the user's uploaded documents (e.g. Ders Bilgi Formu section).
 */
export function computeTextSimilarity(
  candidateText: string,
  referenceDocumentText: string,
  conflictThreshold = 0.68
): TextSimilarityAnalysis {
  const candNorm = normalizeForSimilarity(candidateText);
  const refNorm = normalizeForSimilarity(referenceDocumentText);

  if (!candNorm || !refNorm) {
    return {
      overallScore: 0,
      tokenContainmentScore: 0,
      jaccardScore: 0,
      bigramOverlapScore: 0,
      codeAlignmentScore: 0,
      hasConflict: Boolean(candNorm && refNorm),
    };
  }

  if (candNorm === refNorm) {
    return {
      overallScore: 1,
      tokenContainmentScore: 1,
      jaccardScore: 1,
      bigramOverlapScore: 1,
      codeAlignmentScore: 1,
      hasConflict: false,
    };
  }

  // Exact substring containment check
  const isSubstringMatch =
    refNorm.includes(candNorm) || candNorm.includes(refNorm);

  const candTokens = extractSignificantTokens(candidateText);
  const refTokens = extractSignificantTokens(referenceDocumentText);

  if (candTokens.length === 0 || refTokens.length === 0) {
    const score = isSubstringMatch ? 0.9 : 0;
    return {
      overallScore: score,
      tokenContainmentScore: score,
      jaccardScore: score,
      bigramOverlapScore: score,
      codeAlignmentScore: score,
      hasConflict: score < conflictThreshold,
    };
  }

  const candSet = new Set(candTokens);
  const refSet = new Set(refTokens);

  // Prefix-stem (first 5 chars) matching to handle Turkish agglutinative suffixes
  const refStems = new Set(
    refTokens.map((t) => (t.length >= 6 ? t.slice(0, 5) : t))
  );

  let matchedCandCount = 0;
  let exactIntersection = 0;

  for (const token of candSet) {
    const stem = token.length >= 6 ? token.slice(0, 5) : token;
    if (refSet.has(token)) {
      matchedCandCount += 1;
      exactIntersection += 1;
    } else if (refStems.has(stem)) {
      matchedCandCount += 0.85;
    }
  }

  const tokenContainmentScore = Math.min(
    1,
    matchedCandCount / Math.max(1, candSet.size)
  );
  const unionSize = candSet.size + refSet.size - exactIntersection;
  const jaccardScore =
    unionSize > 0 ? Math.min(1, matchedCandCount / unionSize) : 0;

  // Bigram overlap for phrase order preservation
  const buildBigrams = (tokens: string[]): Set<string> => {
    const bg = new Set<string>();
    for (let i = 0; i < tokens.length - 1; i++) {
      const a = tokens[i].length >= 6 ? tokens[i].slice(0, 5) : tokens[i];
      const b =
        tokens[i + 1].length >= 6 ? tokens[i + 1].slice(0, 5) : tokens[i + 1];
      bg.add(`${a}_${b}`);
    }
    return bg;
  };

  const candBigrams = buildBigrams(candTokens);
  const refBigrams = buildBigrams(refTokens);
  let bigramMatches = 0;
  for (const bg of candBigrams) {
    if (refBigrams.has(bg)) bigramMatches++;
  }
  const bigramOverlapScore =
    candBigrams.size > 0
      ? bigramMatches / Math.min(candBigrams.size, Math.max(1, refBigrams.size))
      : tokenContainmentScore;

  // Maarif & Outcome Code alignment check (E1.4, SDB2.2, D3, OB1, KB2.2, ST.1.1, etc.)
  const codeRegex = /\b(?:SDB|KB|OB|E|D|[A-ZÇĞİÖŞÜ]{2,6})\.?\d{1,2}(?:\.\d{1,2})*\b/gi;
  const candCodes = new Set(
    (candidateText.match(codeRegex) || []).map((c) => c.toUpperCase())
  );
  const refCodes = new Set(
    (referenceDocumentText.match(codeRegex) || []).map((c) => c.toUpperCase())
  );

  let codeAlignmentScore = 1;
  if (candCodes.size > 0 || refCodes.size > 0) {
    if (candCodes.size > 0 && refCodes.size > 0) {
      let matchedCodes = 0;
      for (const c of candCodes) {
        if (refCodes.has(c)) matchedCodes++;
      }
      codeAlignmentScore = matchedCodes / Math.max(candCodes.size, 1);
    } else {
      codeAlignmentScore = 0.4;
    }
  }

  let overallScore =
    tokenContainmentScore * 0.5 +
    bigramOverlapScore * 0.25 +
    jaccardScore * 0.15 +
    codeAlignmentScore * 0.1;

  if (isSubstringMatch) {
    overallScore = Math.max(overallScore, 0.92);
  }

  return {
    overallScore: Number(overallScore.toFixed(3)),
    tokenContainmentScore: Number(tokenContainmentScore.toFixed(3)),
    jaccardScore: Number(jaccardScore.toFixed(3)),
    bigramOverlapScore: Number(bigramOverlapScore.toFixed(3)),
    codeAlignmentScore: Number(codeAlignmentScore.toFixed(3)),
    hasConflict: overallScore < conflictThreshold,
  };
}

export type DocumentSectionKey =
  | "Ogrenme_Kanitlari"
  | "Temel_Kabuller"
  | "On_Degerlendirme_Sureci"
  | "Kopru_Kurma"
  | "Ogretme_Uygulamalari"
  | "Farklilastirma"
  | "Alan_Becerileri"
  | "Disiplinler_Arasi_Iliski"
  | "Ogrenme_Ciktilari_ve_Surec_Bilesenleri"
  | "Icerik_Cercevesi";

interface SectionSearchProfile {
  headerRegex: RegExp;
  stopRegex: RegExp;
  semanticKeywords: string[];
  characteristicPhrases: RegExp[];
  minChars: number;
  maxChars: number;
}

const SECTION_SEARCH_PROFILES: Record<DocumentSectionKey, SectionSearchProfile> = {
  Ogrenme_Kanitlari: {
    headerRegex:
      /^(?:ÖĞRENME\s*KANITLARI|ÖLÇME\s*VE\s*DEĞERLENDİRME|DEĞERLENDİRME\s*SÜRECİ|Ölçme\s*Araçları)(?=$|\s|[:|(-])/i,
    stopRegex:
      /^(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME\s*YAŞANTILARI|TEMEL\s*KABULLER|Temel\s*Kabuller|ÖN\s*DEĞERLENDİRME|FARKLILAŞTIRMA)(?=$|\s|[:|-])/i,
    semanticKeywords: [
      "gözlem formu",
      "akran değerlendirme",
      "öz değerlendirme",
      "derecelendirme ölçeği",
      "dereceli puanlama anahtarı",
      "rubrik",
      "kontrol listesi",
      "ölçme araçlarından",
      "geri bildirim",
      "öğrenci performansını",
    ],
    characteristicPhrases: [
      /(?:gözlem\s+formu|dereceli\s+puanlama\s+anahtarı|rubrik|kontrol\s+listesi|öz\s+değerlendirme)/i,
      /(?:değerlendirilirken|ölçme\s+araçlarından|geri\s+bildirim)/i,
    ],
    minChars: 60,
    maxChars: 3600,
  },
  Temel_Kabuller: {
    headerRegex:
      /^(?:TEMEL\s*KABULLER|Temel\s*Kabuller|ÖN\s*BİLGİLER|HAZIRBULUNUŞLUK)(?=$|\s|[:|-])/i,
    stopRegex:
      /^(?:ÖN\s*DEĞERLENDİRME(?:\s*SÜRECİ)?|KÖPRÜ\s*KURMA|ÖĞRETME\s*[-–]?\s*ÖĞRENME\s*UYGULAMALARI)(?=$|\s|[:|-])/i,
    semanticKeywords: [
      "kabul edilmektedir",
      "kabul edilir",
      "varsayılmaktadır",
      "ön bilgilere sahip",
      "fark edebildikleri",
      "gözlemleyebildikleri",
      "bilimsel süreç becerilerini",
    ],
    characteristicPhrases: [
      /Öğrencilerin[\s\S]{15,500}?(?:kabul\s+edilmektedir|kabul\s+edilir|varsayılmaktadır)\./i,
    ],
    minChars: 30,
    maxChars: 1300,
  },
  On_Degerlendirme_Sureci: {
    headerRegex:
      /^(?:ÖN\s*DEĞERLENDİRME(?:\s*SÜRECİ)?|Ön\s*Değerlendirme(?:\s*Süreci)?|TANILAYICI\s*DEĞERLENDİRME)(?=$|\s|[:|-])/i,
    stopRegex:
      /^(?:KÖPRÜ\s*KURMA|Köprü\s*Kurma|ÖĞRETME\s*[-–]?\s*ÖĞRENME\s*UYGULAMALARI|Öğretme\s*Uygulamaları)(?=$|\s|[:|-])/i,
    semanticKeywords: [
      "açık uçlu sorular",
      "kavram haritaları",
      "beyin fırtınası",
      "ön bilgilerini",
      "farkındalıklarını",
      "tutumlarını belirlemek",
      "kısa tartışmalar",
      "paylaşmaları istenir",
    ],
    characteristicPhrases: [
      /Öğrencilerin[\s\S]{15,600}?(?:açık\s+uçlu\s+sorular|kavram\s+haritaları|beyin\s+fırtınası|ön\s+bilgilerini[\s\S]{1,120}?belirlemek|paylaşmaları\s+istenir)[\s\S]{0,120}?\./i,
    ],
    minChars: 30,
    maxChars: 1300,
  },
  Kopru_Kurma: {
    headerRegex:
      /^(?:KÖPRÜ\s*KURMA|Köprü\s*Kurma|İLİŞKİLENDİRME)(?=$|\s|[:|-])/i,
    stopRegex:
      /^(?:ÖĞRETME\s*[-–]?\s*ÖĞRENME\s*UYGULAMALARI|Öğretme\s*[-–]?\s*Öğrenme\s*Uygulamaları|ÖĞRETME\s*UYGULAMALARI|FARKLILAŞTIRMA)(?=$|\s|[:|-])/i,
    semanticKeywords: [
      "bağ kurulur",
      "ilişki kurulur",
      "yeni konuya geçiş",
      "günlük yaşamda karşılaştıkları",
      "yakın çevrelerindeki",
      "karşılaştırılarak yeni konuya",
    ],
    characteristicPhrases: [
      /(?:Öğrencilerin\s+günlük|Günlük\s+hayatta|Önceki\s+öğrenmeler)[\s\S]{15,600}?(?:bağ\s+kurulur|ilişki\s+kurulur|geçiş\s+sağlanır|geçiş\s+yapılır)\./i,
    ],
    minChars: 30,
    maxChars: 1400,
  },
  Ogretme_Uygulamalari: {
    headerRegex:
      /^(?:ÖĞRETME\s*[-–]?\s*ÖĞRENME\s*UYGULAMALARI|Öğretme\s*[-–]?\s*Öğrenme\s*Uygulamaları|ÖĞRETME\s*UYGULAMALARI)(?=$|\s|[:|-])/i,
    stopRegex:
      /^(?:FARKLILAŞTIRMA|Farklılaştırma|ZENGİNLEŞTİRME|DESTEKLEME|UYGUNDUR)(?=$|\s|[:|-])/i,
    semanticKeywords: [
      "öğrenme birimi işlenirken",
      "araştırma görevi verilir",
      "sınıfta paylaşmaları sağlanır",
      "grup tartışmaları yapılır",
      "örnek olaylar üzerinden",
      "dereceli puanlama anahtarı",
    ],
    characteristicPhrases: [
      /\((?:[A-Z]{1,3}\d+(?:\.\d+)?(?:,\s*)?){2,}\)\./,
    ],
    minChars: 40,
    maxChars: 4000,
  },
  Farklilastirma: {
    headerRegex:
      /^(?:FARKLILAŞTIRMA|Farklılaştırma|ZENGİNLEŞTİRME\s*VE\s*DESTEKLEME)(?=$|\s|[:|-])/i,
    stopRegex:
      /^(?:UYGUNDUR|ÖĞRETMEN|OKUL\s*MÜDÜRÜ|\d{1,2}\s*\.\s*HAFTA)(?=$|\s|[:|-])/i,
    semanticKeywords: [
      "zenginleştirme",
      "destekleme",
      "bireysel farklılıklar",
      "ek süre",
      "ileri düzey",
    ],
    characteristicPhrases: [
      /(?:Zenginleştirme|Destekleme)\s*[:|-][\s\S]{20,600}/i,
    ],
    minChars: 20,
    maxChars: 1200,
  },
  Alan_Becerileri: {
    headerRegex: /^(?:ALAN\s*BECERİLERİ|Alan\s*Becerileri)(?=$|\s|[:|-])/i,
    stopRegex: /^(?:EĞİLİMLER|PROGRAMLAR\s*ARASI|SOSYAL\s*[-–]?\s*DUYGUSAL)(?=$|\s|[:|-])/i,
    semanticKeywords: ["yöntemlerini uygulama", "becerisi", "uygulama yapma"],
    characteristicPhrases: [
      /ALAN\s*BECERİLERİ\s*[:|-]?\s*([^\n|]{5,120})/i,
    ],
    minChars: 5,
    maxChars: 250,
  },
  Disiplinler_Arasi_Iliski: {
    headerRegex:
      /^(?:DİSİPLİNLER\s*ARASI\s*İLİŞKİ(?:LER)?|Disiplinler\s*Arası\s*İlişki(?:ler)?)(?=$|\s|[:|-])/i,
    stopRegex:
      /^(?:BECERİLER\s*ARASI|ÖĞRENME\s*ÇIKTILARI|İÇERİK\s*ÇERÇEVESİ)(?=$|\s|[:|-])/i,
    semanticKeywords: ["coğrafya", "biyoloji", "matematik", "kimya", "fizik", "ekonomi"],
    characteristicPhrases: [
      /DİSİPLİNLER\s*ARASI\s*İLİŞKİ(?:LER)?\s*[:|-]?\s*([^\n|]{3,140})/i,
    ],
    minChars: 3,
    maxChars: 220,
  },
  Ogrenme_Ciktilari_ve_Surec_Bilesenleri: {
    headerRegex:
      /^(?:ÖĞRENME\s*ÇIKTILARI\s*VE\s*SÜREÇ\s*BİLEŞENLERİ|KAZANIMLAR\s*VE\s*AÇIKLAMALARI)(?=$|\s|[:|-])/i,
    stopRegex:
      /^(?:İÇERİK\s*ÇERÇEVESİ|ÖĞRENME\s*KANITLARI|ÖĞRENME\s*[-–]?\s*ÖĞRETME)(?=$|\s|[:|-])/i,
    semanticKeywords: ["açıklar", "sıralar", "uygular", "açıklanır", "sıralanır"],
    characteristicPhrases: [
      /\b[A-ZÇĞİÖŞÜ]{2,8}\.\d+(?:\.\d+)*\.?\s+[^\n]+/,
    ],
    minChars: 15,
    maxChars: 1200,
  },
  Icerik_Cercevesi: {
    headerRegex: /^(?:İÇERİK\s*ÇERÇEVESİ|KONU(?:\s*BAŞLIĞI)?)(?=$|\s|[:|-])/i,
    stopRegex: /^(?:ÖĞRENME\s*KANITLARI|ANAHTAR\s*KAVRAMLAR|ÖĞRENME\s*ÇIKTILARI)(?=$|\s|[:|-])/i,
    semanticKeywords: ["ilkeleri", "yönetimi", "uygulamaları", "yöntemleri"],
    characteristicPhrases: [
      /(?:İÇERİK\s*ÇERÇEVESİ|Konu)\s*[:|-]\s*([^\n|]{4,100})/i,
    ],
    minChars: 4,
    maxChars: 150,
  },
};

/**
 * Automatically searches the raw uploaded documents (Ders Bilgi Formu, Yıllık Plan, Ders Materyali)
 * for a specific section when AI cannot find it or returns conflicting/hallucinated data.
 * Uses a 3-stage search:
 *   1. Header / Synonym boundary scan
 *   2. Characteristic regex pattern extraction
 *   3. Sliding window semantic keyword density + AI cue matching
 */
export function autoSearchDocumentSectionFallback(
  sectionKey: DocumentSectionKey,
  rawDbfText: string,
  rawYillikPlanText: string,
  materyalSlice: string,
  weekData: WeekSpecificExtraction,
  aiHintText?: string
): string {
  const profile = SECTION_SEARCH_PROFILES[sectionKey];
  const combinedSource = [rawDbfText || "", rawYillikPlanText || ""]
    .filter(Boolean)
    .join("\n");
  if (!combinedSource.trim()) return "";

  const sourceLines = combinedSource
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Stage 1: Direct Header & Synonym Boundary Scan
  const stage1Match = extractSectionBetweenHeadings(
    sourceLines,
    profile.headerRegex,
    profile.stopRegex,
    profile.minChars,
    profile.maxChars
  );
  if (stage1Match && stage1Match.length >= profile.minChars) {
    return stage1Match;
  }

  // Stage 2: Characteristic Regex Pattern Match across the raw text
  for (const regex of profile.characteristicPhrases) {
    const match = combinedSource.match(regex);
    if (match) {
      const captured = (match[1] || match[0]).trim();
      if (captured.length >= profile.minChars) {
        return captured.slice(0, profile.maxChars);
      }
    }
  }

  // Stage 3: Sliding Window Semantic Keyword Density + AI Hint Similarity Scan
  // Splits the raw documents into paragraph blocks and finds the block with highest semantic density
  const paragraphs = combinedSource
    .split(/\n{2,}|(?=\b(?:TEMEL\s*KABULLER|ÖN\s*DEĞERLENDİRME|KÖPRÜ\s*KURMA|ÖĞRENME\s*KANITLARI|ÖĞRETME\s*[-–]?\s*ÖĞRENME)\b)/i)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length >= profile.minChars);

  let bestParagraph = "";
  let bestScore = 0;

  for (const para of paragraphs) {
    // Skip obvious copyright/front-matter noise
    if (
      /MİLL[İI]\s*EĞİTİM\s*BAKANLIĞI\s*YAYINLARI|Her\s*hakkı\s*saklıdır/i.test(
        para
      )
    ) {
      continue;
    }

    const lowerPara = para.toLocaleLowerCase("tr-TR");
    let keywordHits = 0;
    for (const kw of profile.semanticKeywords) {
      if (lowerPara.includes(kw.toLocaleLowerCase("tr-TR"))) {
        keywordHits++;
      }
    }

    let score =
      profile.semanticKeywords.length > 0
        ? keywordHits / profile.semanticKeywords.length
        : 0;

    // If AI provided a partial/paraphrased hint, boost paragraphs that share tokens with it
    if (aiHintText && aiHintText.trim().length >= 20) {
      const sim = computeTextSimilarity(aiHintText, para);
      score = Math.max(score, sim.tokenContainmentScore * 0.85);
    }

    if (score > bestScore && score >= 0.28) {
      bestScore = score;
      bestParagraph = para;
    }
  }

  if (bestParagraph) {
    return bestParagraph.slice(0, profile.maxChars);
  }

  // Special handling if searching for Ogrenme_Ciktilari_ve_Surec_Bilesenleri in Yıllık Plan / Materyal
  if (
    sectionKey === "Ogrenme_Ciktilari_ve_Surec_Bilesenleri" &&
    weekData.formattedOutcomeAndProcessBlock
  ) {
    return weekData.formattedOutcomeAndProcessBlock;
  }

  if (sectionKey === "Icerik_Cercevesi" && weekData.icerikCercevesi) {
    return weekData.icerikCercevesi;
  }

  // Also check materyalSlice if still not found and AI hint exists
  if (aiHintText && materyalSlice) {
    const matLines = materyalSlice
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length >= profile.minChars);
    for (const mLine of matLines) {
      const sim = computeTextSimilarity(aiHintText, mLine);
      if (sim.overallScore >= 0.65) {
        return mLine.slice(0, profile.maxChars);
      }
    }
  }

  return "";
}

/**
 * Automatically searches the raw Ders Bilgi Formu for the active learning unit's
 * Öğretme-Öğrenme Uygulamaları bullet items if AI could not find them or returned conflicting items.
 */
export function autoSearchOgretmeUygulamalariBulletsFallback(
  structuredDbf: StructuredDersBilgiFormu,
  weekData: WeekSpecificExtraction,
  aiCandidateBullets?: string[]
): string[] {
  // 1. Check pre-indexed unit bullets in structuredDbf
  if (weekData.unitOgretmeUygulamalari.length > 0) {
    return weekData.unitOgretmeUygulamalari;
  }

  const rawDbf = structuredDbf.rawDbfText || "";
  const unitName = (weekData.ogrenmeBirimi || "").trim();

  // 2. Search rawDbfText directly around the unit name heading (e.g. "* Onarıcı Tarım:")
  if (rawDbf && unitName && unitName.length >= 3) {
    const escapedUnit = unitName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const unitBlockRegex = new RegExp(
      `(?:^|\\n)\\s*\\*?\\s*${escapedUnit}\\s*:\\s*([\\s\\S]{40,3500}?)(?=\\n\\s*\\*?\\s*[A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\\s-]{2,40}:\\s|\\n\\s*(?:FARKLILAŞTIRMA|Farklılaştırma|UYGUNDUR)|$)`,
      "i"
    );
    const match = rawDbf.match(unitBlockRegex);
    if (match && match[1]) {
      const bullets = splitOgretmeUygulamalariIntoBullets(
        `${unitName}:\n${match[1].trim()}`,
        unitName
      );
      if (bullets.length >= 2) {
        return bullets;
      }
    }
  }

  // 3. Auto-search the entire Öğretme-Öğrenme Uygulamaları section in rawDbfText
  const rawSection = autoSearchDocumentSectionFallback(
    "Ogretme_Uygulamalari",
    rawDbf,
    structuredDbf.rawYillikPlanText || "",
    "",
    weekData,
    aiCandidateBullets?.join(" ")
  );
  if (rawSection) {
    const bullets = splitOgretmeUygulamalariIntoBullets(rawSection, unitName);
    if (bullets.length >= 2) {
      return bullets;
    }
  }

  // 4. If structuredDbf has allOgretmeUygulamalariBullets, filter or return them
  if (structuredDbf.allOgretmeUygulamalariBullets.length > 0) {
    return structuredDbf.allOgretmeUygulamalariBullets;
  }

  // 5. If AI provided candidate bullets, verify each bullet's similarity against the raw documents
  if (aiCandidateBullets && aiCandidateBullets.length > 0 && rawDbf) {
    const verifiedBullets = aiCandidateBullets
      .map((b) => b.replace(/^\*\s*/, "").trim())
      .filter((b) => {
        if (
          b.length < 15 ||
          /MİLL[İI]\s*EĞİTİM\s*BAKANLIĞI\s*YAYINLARI|Her\s*hakkı\s*saklıdır|\.{4,}/i.test(
            b
          )
        ) {
          return false;
        }
        const sim = computeTextSimilarity(b, rawDbf, 0.55);
        return !sim.hasConflict;
      });

    if (verifiedBullets.length >= 2) {
      return verifiedBullets;
    }
  }

  return [];
}

/**
 * Resolves a single Ders Bilgi Formu section by running text similarity analysis
 * between the AI output and the original document section:
 * - Prevents AI outputs from conflicting with or overwriting the user's original Ders Bilgi Formu text.
 * - If the pre-parsed field is empty or AI couldn't find it in the document, triggers `autoSearchDocumentSectionFallback`.
 */
export function resolveDbfSectionWithSimilarityAndFallback(
  sectionKey: DocumentSectionKey,
  preExtractedDbfValue: string,
  aiCandidateValue: string | undefined,
  structuredDbf: StructuredDersBilgiFormu,
  weekData: WeekSpecificExtraction,
  materyalSlice: string,
  synthesizedLastResortFallback: string
): string {
  const cleanPreExtracted = (preExtractedDbfValue || "").trim();
  const cleanAi = (aiCandidateValue || "").trim();
  const rawDbf = structuredDbf.rawDbfText || "";
  const rawYillik = structuredDbf.rawYillikPlanText || "";
  const combinedRawDocs = `${rawDbf}\n${rawYillik}`.trim();

  // Case 1: Pre-extracted verbatim section from Ders Bilgi Formu exists
  if (cleanPreExtracted.length >= 25) {
    if (!cleanAi) {
      return cleanPreExtracted;
    }

    // Run text similarity analysis between AI output and the original Ders Bilgi Formu section
    const similarity = computeTextSimilarity(
      cleanAi,
      cleanPreExtracted,
      0.75
    );

    // If AI output conflicts with the original document (or is shorter/truncated), lock in the original document text
    if (
      similarity.hasConflict ||
      cleanAi.length < cleanPreExtracted.length * 0.9
    ) {
      return cleanPreExtracted;
    }

    // Even when AI is very similar, verify against raw document so zero words are altered
    return cleanPreExtracted;
  }

  // Case 2: Pre-extracted value was empty -> Automatically search the raw uploaded documents!
  const autoSearchedFromDoc = autoSearchDocumentSectionFallback(
    sectionKey,
    rawDbf,
    rawYillik,
    materyalSlice,
    weekData,
    cleanAi
  );

  if (autoSearchedFromDoc && autoSearchedFromDoc.length >= 25) {
    // If AI also returned a value, check if AI conflicts with the newly found document section
    if (cleanAi.length >= 25) {
      const simWithAutoFound = computeTextSimilarity(
        cleanAi,
        autoSearchedFromDoc,
        0.72
      );
      if (simWithAutoFound.hasConflict) {
        // Prevent conflict: always prefer the section found directly in the uploaded document
        return autoSearchedFromDoc;
      }
    }
    return autoSearchedFromDoc;
  }

  // Case 3: Check if AI's candidate actually exists inside the raw uploaded document (via similarity analysis)
  if (cleanAi.length >= 30 && combinedRawDocs.length >= 50) {
    const simWithRawDoc = computeTextSimilarity(
      cleanAi,
      combinedRawDocs,
      0.55
    );
    if (
      !simWithRawDoc.hasConflict &&
      !/MİLL[İI]\s*EĞİTİM\s*BAKANLIĞI\s*YAYINLARI|Her\s*hakkı\s*saklıdır|VE\s*SÜRE/i.test(
        cleanAi
      )
    ) {
      return cleanAi;
    }
  }

  // Case 4: Last resort document-grounded pedagogical fallback
  return synthesizedLastResortFallback;
}

/**
 * Validates AI-generated week-specific activity bullets (Güdüleme, Dikkat Çekme, Ek Öğretme Uygulamaları)
 * against the uploaded documents (Ders Materyali + Yıllık Plan + Ders Bilgi Formu) using text similarity analysis.
 * Filters out any bullet that conflicts with the course/week context or contains front-matter noise,
 * and automatically supplements missing items from the document-grounded fallback.
 */
export function verifyAndMergeDynamicBullets(
  aiBullets: string[] | undefined,
  fallbackBullets: string[],
  referenceCorpus: string,
  weekData: WeekSpecificExtraction,
  options: {
    minCount: number;
    minLength: number;
    requireQuestionMark?: boolean;
    requireMaarifCodeSuffix?: boolean;
    defaultCodes?: string[];
  }
): string[] {
  const validAiBullets: string[] = [];
  const referenceContext = [
    referenceCorpus,
    weekData.ogrenmeBirimi,
    weekData.icerikCercevesi,
    weekData.formattedOutcomeAndProcessBlock,
    weekData.searchKeywords.join(" "),
  ]
    .filter(Boolean)
    .join("\n");

  if (Array.isArray(aiBullets)) {
    for (const rawBullet of aiBullets) {
      if (typeof rawBullet !== "string") continue;
      let cleaned = rawBullet.replace(/^\s*[*•\-–]\s*/, "").trim();
      if (cleaned.length < options.minLength) continue;

      // Reject copyright / front-matter / placeholder noise
      if (
        /MİLL[İI]\s*EĞİTİM\s*BAKANLIĞI\s*YAYINLARI|Her\s*hakkı\s*saklıdır|YARDIMCI\s*VE\s*KAYNAK|\.{4,}|"16\.\s*Hafta"|"VE\s*SÜRE"/i.test(
          cleaned
        )
      ) {
        continue;
      }

      if (options.requireQuestionMark && !cleaned.endsWith("?")) {
        continue;
      }

      // Run similarity / topical overlap analysis against the uploaded document corpus
      if (referenceContext.length >= 40) {
        const sim = computeTextSimilarity(cleaned, referenceContext, 0.14);
        // If the AI bullet has zero topical overlap with the uploaded course documents, skip it
        if (sim.tokenContainmentScore < 0.12 && sim.overallScore < 0.12) {
          continue;
        }
      }

      // Ensure parenthesized Maarif code suffix on Ek Öğretme Uygulamaları if required
      if (
        options.requireMaarifCodeSuffix &&
        !/\([A-ZÇĞİÖŞÜ0-9.,\s]+\)\.?\s*$/.test(cleaned)
      ) {
        const fallbackCodePair =
          options.defaultCodes && options.defaultCodes.length >= 2
            ? `(${options.defaultCodes[0]}, ${options.defaultCodes[1]})`
            : "(OB1, KB2.2)";
        cleaned = `${cleaned.replace(/\.$/, "")} ${fallbackCodePair}.`;
      }

      validAiBullets.push(cleaned);
    }
  }

  if (validAiBullets.length >= options.minCount) {
    return validAiBullets;
  }

  // If AI couldn't find/produce enough document-aligned items, merge with document-searched fallback items
  const merged = [...validAiBullets];
  for (const fb of fallbackBullets) {
    if (merged.length >= Math.max(options.minCount, fallbackBullets.length)) {
      break;
    }
    const isDuplicate = merged.some(
      (existing) => computeTextSimilarity(existing, fb).overallScore >= 0.65
    );
    if (!isDuplicate) {
      merged.push(fb);
    }
  }

  return merged.length > 0 ? merged : fallbackBullets;
}

export function enforceAndMergeLessonPlan(
  aiPlan: Partial<MaarifLessonPlan> | null,
  structuredDbf: StructuredDersBilgiFormu,
  weekData: WeekSpecificExtraction,
  materyalSlice: string,
  overrideMeta?: { dersIsmi?: string; sinifDuzeyi?: string }
): MaarifLessonPlan {
  const fallbackActivities = buildWeekSpecificActivitiesFallback(
    weekData,
    structuredDbf,
    materyalSlice
  );

  const rawDbf = structuredDbf.rawDbfText || "";
  const rawYillik = structuredDbf.rawYillikPlanText || "";
  const fullDocumentCorpus = [rawDbf, rawYillik, materyalSlice]
    .filter(Boolean)
    .join("\n");

  const cleanSinif =
    (overrideMeta?.sinifDuzeyi || "").trim() ||
    structuredDbf.sinif ||
    "9. SINIF";

  const cleanDers =
    (overrideMeta?.dersIsmi || "").trim() ||
    structuredDbf.ders ||
    "MESLEK DERSİ";

  // 1. Verify & merge dynamic week-specific activities (Güdüleme, Dikkat Çekme, Ek Öğretme Uygulamaları)
  // using text similarity analysis against Ders Materyali + Yıllık Plan + Ders Bilgi Formu
  const finalGuduleme = verifyAndMergeDynamicBullets(
    aiPlan?.Ogrenme_Ogretme_Yasantilari?.Guduleme,
    fallbackActivities.Guduleme,
    fullDocumentCorpus,
    weekData,
    {
      minCount: 4,
      minLength: 25,
    }
  );

  const finalDikkat = verifyAndMergeDynamicBullets(
    aiPlan?.Ogrenme_Ogretme_Yasantilari?.Dikkat_Cekme,
    fallbackActivities.Dikkat_Cekme,
    fullDocumentCorpus,
    weekData,
    {
      minCount: 4,
      minLength: 20,
      requireQuestionMark: true,
    }
  );

  const finalEkUygulamalar = verifyAndMergeDynamicBullets(
    aiPlan?.Ogrenme_Ogretme_Yasantilari?.Ek_Ogretme_Uygulamalari,
    fallbackActivities.Ek_Ogretme_Uygulamalari,
    fullDocumentCorpus,
    weekData,
    {
      minCount: 5,
      minLength: 25,
      requireMaarifCodeSuffix: true,
      defaultCodes: structuredDbf.rawActivityCodes,
    }
  );

  // 2. Resolve Öğretme Uygulamaları with similarity conflict protection + automatic document search fallback
  let finalOgretmeUygulamalari = autoSearchOgretmeUygulamalariBulletsFallback(
    structuredDbf,
    weekData,
    aiPlan?.Ogrenme_Ogretme_Yasantilari?.Ogretme_Uygulamalari
  );
  if (finalOgretmeUygulamalari.length === 0) {
    finalOgretmeUygulamalari = fallbackActivities.Ogretme_Uygulamalari;
  } else if (
    aiPlan?.Ogrenme_Ogretme_Yasantilari?.Ogretme_Uygulamalari &&
    aiPlan.Ogrenme_Ogretme_Yasantilari.Ogretme_Uygulamalari.length > 0
  ) {
    // Check if AI's Ogretme_Uygulamalari conflicts with the original Ders Bilgi Formu bullets
    const aiJoined =
      aiPlan.Ogrenme_Ogretme_Yasantilari.Ogretme_Uygulamalari.join(" ");
    const dbfJoined = finalOgretmeUygulamalari.join(" ");
    const sim = computeTextSimilarity(aiJoined, dbfJoined, 0.78);
    if (sim.hasConflict) {
      // Prevent AI from overwriting or conflicting with the user's Ders Bilgi Formu items
      finalOgretmeUygulamalari = finalOgretmeUygulamalari.map((s) =>
        s.replace(/^\*\s*/, "").trim()
      );
    }
  }

  // 3. Resolve static Ders Bilgi Formu sections using similarity analysis & automatic document section search fallback
  const finalOgrenmeKanitlari = resolveDbfSectionWithSimilarityAndFallback(
    "Ogrenme_Kanitlari",
    structuredDbf.ogrenmeKanitlari,
    aiPlan?.Ogrenme_Kanitlari,
    structuredDbf,
    weekData,
    materyalSlice,
    `Öğrenci performansını belirlemeye yönelik çalışmalar değerlendirilirken gözlem formu, akran değerlendirme, öz değerlendirme, derecelendirme ölçeği ve dereceli puanlama anahtarı (rubrik) gibi ölçme araçlarından uygun olanlar seçilerek kullanılabilir.\nAyrıca öz değerlendirme ve akran değerlendirme formları kullanılarak öğrencilerin öğretim sürecine katılımları değerlendirilebilir. Öğrencilerin bilgi düzeyleri, uygulama becerileri, zaman yönetimi ile malzeme kullanımı gibi ölçütler bağlamında değerlendirilerek geri bildirim verilir.`
  );

  const finalTemelKabuller = resolveDbfSectionWithSimilarityAndFallback(
    "Temel_Kabuller",
    structuredDbf.temelKabuller,
    aiPlan?.Ogrenme_Ogretme_Yasantilari?.Temel_Kabuller,
    structuredDbf,
    weekData,
    materyalSlice,
    `Öğrencilerin; ${weekData.ogrenmeBirimi.toLocaleLowerCase("tr-TR")} ve ${weekData.icerikCercevesi.toLocaleLowerCase("tr-TR")} konusuyla ilgili temel kavramlara ve günlük yaşam gözlemlerine sahip oldukları kabul edilmektedir.`
  );

  const finalOnDegerlendirme = resolveDbfSectionWithSimilarityAndFallback(
    "On_Degerlendirme_Sureci",
    structuredDbf.onDegerlendirmeSureci,
    aiPlan?.Ogrenme_Ogretme_Yasantilari?.On_Degerlendirme_Sureci,
    structuredDbf,
    weekData,
    materyalSlice,
    `Öğrencilerden, ${weekData.ogrenmeBirimi.toLocaleLowerCase("tr-TR")} ve ${weekData.icerikCercevesi.toLocaleLowerCase("tr-TR")} konusundaki temel kavramlar ve uygulama örnekleri hakkında ön bilgilerini paylaşmaları istenir.`
  );

  const finalKopruKurma = resolveDbfSectionWithSimilarityAndFallback(
    "Kopru_Kurma",
    structuredDbf.kopruKurma,
    aiPlan?.Ogrenme_Ogretme_Yasantilari?.Kopru_Kurma,
    structuredDbf,
    weekData,
    materyalSlice,
    `Günlük hayatta karşılaşılan örnekler ve önceki konularda edinilen bilgiler üzerinden ${weekData.ogrenmeBirimi.toLocaleLowerCase("tr-TR")} ile ${weekData.icerikCercevesi.toLocaleLowerCase("tr-TR")} konusu arasında ilişki kurularak yeni konuya geçiş yapılır.`
  );

  const finalFarklilastirma = resolveDbfSectionWithSimilarityAndFallback(
    "Farklilastirma",
    structuredDbf.farklilastirma,
    aiPlan?.Farklilastirma,
    structuredDbf,
    weekData,
    materyalSlice,
    ""
  );

  // 4. Cross-Verify & Complete Öğrenme Çıktıları ve Süreç Bileşenleri + İçerik Çerçevesi
  // Combines deterministic week/date extraction with AI's extraction and cross-checks against Ders Bilgi Formu catalog
  let finalOutcomesBlock = weekData.formattedOutcomeAndProcessBlock;
  const aiOutcomesRaw = (
    aiPlan?.Ogrenme_Ciktilari_ve_Surec_Bilesenleri || ""
  ).trim();

  if (aiOutcomesRaw.length >= 15) {
    const codeRegex =
      /\b([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?\b/g;
    const subLineExtractRegex =
      /(?:^|\n|\s)([a-zçğıöşü])\)\s*([^\n]+?)(?=(?:\s+[a-zçğıöşü]\)\s|\n|$))/gi;

    const aiCodes: string[] = [];
    let cm: RegExpExecArray | null;
    while ((cm = codeRegex.exec(aiOutcomesRaw)) !== null) {
      if (!/^(?:SDB|KB|OB|AB|E|D)$/i.test(cm[1])) {
        if (!aiCodes.includes(cm[0])) aiCodes.push(cm[0]);
      }
    }

    const aiSubMap = new Map<string, string>();
    let sm: RegExpExecArray | null;
    while ((sm = subLineExtractRegex.exec(aiOutcomesRaw)) !== null) {
      const letter = sm[1].toLocaleLowerCase("tr-TR");
      const text = sm[2].trim();
      if (text.length >= 5) {
        aiSubMap.set(letter, `${letter}) ${text}`);
      }
    }

    const weekSubMap = new Map<string, string>();
    for (const sub of weekData.weekSubComponents) {
      const m = sub.match(/^([a-zçğıöşü])\)\s*(.+)$/i);
      if (m) {
        weekSubMap.set(m[1].toLocaleLowerCase("tr-TR"), sub.trim());
      }
    }

    const activeCode =
      weekData.outcomeCode ||
      aiCodes[0] ||
      Object.keys(structuredDbf.outcomesMap)[0] ||
      "";
    const catalogEntry = activeCode
      ? structuredDbf.outcomesMap[activeCode]
      : undefined;

    // Verify if AI found sub-components that also exist in the week's raw window or catalog (and weren't hallucinated)
    // Only add AI sub-components if weekSubMap was empty OR if the AI sub-component letter is explicitly present in rawWeekWindowText
    const mergedLetters: string[] = [];
    const mergedSubMap = new Map<string, string>();

    for (const [letter, wSub] of weekSubMap.entries()) {
      mergedLetters.push(letter);
      const catSub = catalogEntry?.subComponents[letter];
      const aiSub = aiSubMap.get(letter);
      // Choose the most complete, untruncated version verified against the document
      let bestSub = wSub;
      if (catSub && catSub.length >= bestSub.length) {
        bestSub = catSub;
      }
      if (
        aiSub &&
        aiSub.length > bestSub.length &&
        !computeTextSimilarity(aiSub, fullDocumentCorpus, 0.55).hasConflict
      ) {
        bestSub = aiSub;
      }
      mergedSubMap.set(letter, bestSub);
    }

    for (const [letter, aiSub] of aiSubMap.entries()) {
      if (!mergedSubMap.has(letter)) {
        const letterInWeekWindow = new RegExp(
          `(?:^|\\s|\\|)${letter}\\)\\s*`,
          "i"
        ).test(weekData.rawWeekWindowText);
        const weekHadNoSubs = weekSubMap.size === 0;
        const verifiedInCorpus = !computeTextSimilarity(
          aiSub,
          fullDocumentCorpus,
          0.55
        ).hasConflict;

        if ((letterInWeekWindow || weekHadNoSubs) && verifiedInCorpus) {
          mergedLetters.push(letter);
          const catSub = catalogEntry?.subComponents[letter];
          mergedSubMap.set(
            letter,
            catSub && catSub.length >= aiSub.length ? catSub : aiSub
          );
        }
      }
    }

    // Reconstruct the clean header + verified complete sub-components
    const bestHeader =
      catalogEntry?.headerLine ||
      (weekData.outcomeHeader &&
      !weekData.outcomeHeader.includes("Seçilen hafta öğrenme çıktısı")
        ? weekData.outcomeHeader
        : aiOutcomesRaw.split(/\r?\n/)[0].replace(/\s+[a-zçğıöşü]\)\s+.*$/i, "").trim());

    if (mergedLetters.length > 0) {
      finalOutcomesBlock = [
        bestHeader,
        ...mergedLetters.map((l) => mergedSubMap.get(l)!),
      ]
        .filter(Boolean)
        .join("\n");
    } else if (
      !finalOutcomesBlock ||
      finalOutcomesBlock.includes("Seçilen hafta öğrenme çıktısı")
    ) {
      const searchedOutcomes = autoSearchDocumentSectionFallback(
        "Ogrenme_Ciktilari_ve_Surec_Bilesenleri",
        rawDbf,
        rawYillik,
        materyalSlice,
        weekData,
        aiOutcomesRaw
      );
      finalOutcomesBlock = searchedOutcomes || aiOutcomesRaw;
    }
  } else if (!finalOutcomesBlock) {
    finalOutcomesBlock = autoSearchDocumentSectionFallback(
      "Ogrenme_Ciktilari_ve_Surec_Bilesenleri",
      rawDbf,
      rawYillik,
      materyalSlice,
      weekData
    );
  }

  let finalIcerikCercevesi = weekData.icerikCercevesi;
  if (
    (!finalIcerikCercevesi ||
      /^\d+\s*\.\s*hafta$/i.test(finalIcerikCercevesi)) &&
    aiPlan?.Icerik_Cercevesi &&
    !/^\d+\s*\.\s*hafta$/i.test(aiPlan.Icerik_Cercevesi.trim())
  ) {
    const searchedIcerik = autoSearchDocumentSectionFallback(
      "Icerik_Cercevesi",
      rawDbf,
      rawYillik,
      materyalSlice,
      weekData,
      aiPlan.Icerik_Cercevesi
    );
    finalIcerikCercevesi = searchedIcerik || aiPlan.Icerik_Cercevesi.trim();
  }

  // 5. Verify Alan_Becerileri & Disiplinler_Arasi_Iliski with similarity analysis + auto-search fallback
  let finalAlanBecerileri = structuredDbf.alanBecerileri;
  if (aiPlan?.Ders_Bilgisi?.Alan_Becerileri) {
    const simAlan = computeTextSimilarity(
      aiPlan.Ders_Bilgisi.Alan_Becerileri,
      finalAlanBecerileri,
      0.75
    );
    if (simAlan.hasConflict && fullDocumentCorpus.length > 0) {
      const searchedAlan = autoSearchDocumentSectionFallback(
        "Alan_Becerileri",
        rawDbf,
        rawYillik,
        materyalSlice,
        weekData,
        aiPlan.Ders_Bilgisi.Alan_Becerileri
      );
      if (
        searchedAlan &&
        !/VE\s*SÜRE|BİLGİ\s*FORMU/i.test(searchedAlan) &&
        computeTextSimilarity(searchedAlan, fullDocumentCorpus, 0.6)
          .overallScore >= 0.6
      ) {
        finalAlanBecerileri = searchedAlan;
      }
    }
  }

  let finalDisiplinlerArasi = structuredDbf.disiplinlerArasiIliski;
  if (aiPlan?.Programlar_Arasi_Bilesenler?.Disiplinler_Arasi_Iliski) {
    const simDisiplin = computeTextSimilarity(
      aiPlan.Programlar_Arasi_Bilesenler.Disiplinler_Arasi_Iliski,
      finalDisiplinlerArasi,
      0.75
    );
    if (simDisiplin.hasConflict && fullDocumentCorpus.length > 0) {
      const searchedDisiplin = autoSearchDocumentSectionFallback(
        "Disiplinler_Arasi_Iliski",
        rawDbf,
        rawYillik,
        materyalSlice,
        weekData,
        aiPlan.Programlar_Arasi_Bilesenler.Disiplinler_Arasi_Iliski
      );
      if (searchedDisiplin && searchedDisiplin.length >= 3) {
        finalDisiplinlerArasi = searchedDisiplin;
      }
    }
  }

  // Verify Maarif code lists (Eğilimler, SDB, Değerler, OB, KB): prevent AI from injecting codes that conflict with the document
  const resolveCodeField = (
    dbfCodeStr: string,
    aiCodeStr: string | undefined,
    prefix: "E" | "SDB" | "D" | "OB" | "KB"
  ): string => {
    if (dbfCodeStr && aiCodeStr) {
      const sim = computeTextSimilarity(aiCodeStr, dbfCodeStr, 0.8);
      if (!sim.hasConflict) return dbfCodeStr;
      // If conflict detected, re-verify directly against full raw document corpus
      if (fullDocumentCorpus.length > 20) {
        return extractCanonicalMaarifCodes(
          fullDocumentCorpus,
          prefix,
          dbfCodeStr
        );
      }
    }
    return dbfCodeStr;
  };

  const finalEgilimler = resolveCodeField(
    structuredDbf.egilimler,
    aiPlan?.Ders_Bilgisi?.Egilimler,
    "E"
  );
  const finalSdb = resolveCodeField(
    structuredDbf.sosyalDuygusalBeceriler,
    aiPlan?.Programlar_Arasi_Bilesenler?.Sosyal_Duygusal_Ogrenme_Becerileri,
    "SDB"
  );
  const finalDegerler = resolveCodeField(
    structuredDbf.degerler,
    aiPlan?.Programlar_Arasi_Bilesenler?.Degerler,
    "D"
  );
  const finalOkuryazarlik = resolveCodeField(
    structuredDbf.okuryazarlikBecerileri,
    aiPlan?.Programlar_Arasi_Bilesenler?.Okuryazarlik_Becerileri,
    "OB"
  );
  const finalBecerilerArasi = resolveCodeField(
    structuredDbf.becerilerArasiIliski,
    aiPlan?.Programlar_Arasi_Bilesenler?.Beceriler_Arasi_Iliski,
    "KB"
  );

  return {
    Ders_Bilgisi: {
      Sinif: cleanSinif,
      Ders: cleanDers,
      Ogrenme_Birimi: weekData.ogrenmeBirimi,
      Sure: weekData.sure,
      Alan_Becerileri: finalAlanBecerileri,
      Egilimler: finalEgilimler,
    },
    Programlar_Arasi_Bilesenler: {
      Sosyal_Duygusal_Ogrenme_Becerileri: finalSdb,
      Degerler: finalDegerler,
      Okuryazarlik_Becerileri: finalOkuryazarlik,
      Disiplinler_Arasi_Iliski: finalDisiplinlerArasi,
      Beceriler_Arasi_Iliski: finalBecerilerArasi,
    },
    Ogrenme_Ciktilari_ve_Surec_Bilesenleri: finalOutcomesBlock,
    Icerik_Cercevesi: finalIcerikCercevesi,
    Ogrenme_Kanitlari: finalOgrenmeKanitlari,
    Ogrenme_Ogretme_Yasantilari: {
      Temel_Kabuller: finalTemelKabuller,
      On_Degerlendirme_Sureci: finalOnDegerlendirme,
      Kopru_Kurma: finalKopruKurma,
      Ogretme_Uygulamalari: finalOgretmeUygulamalari,
      Guduleme: finalGuduleme,
      Dikkat_Cekme: finalDikkat,
      Ek_Ogretme_Uygulamalari: finalEkUygulamalar,
    },
    Farklilastirma: finalFarklilastirma,
  };
}

