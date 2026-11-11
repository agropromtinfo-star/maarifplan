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

  // 4. Parse All Learning Outcomes (ST.1.1, ST.1.2, ST.2.1, etc.) and Sub-Process Components (a, b, c, ç, d, e)
  const outcomesMap: Record<string, ParsedOutcomeEntry> = {};
  const unitsByNumber: Record<number, string> = {};

  const outcomeLineRegex =
    /\b([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?\.?\s+([A-ZÇĞİÖŞÜa-zçğıöşü].*)$/;
  const subCompLineRegex = /^([a-zçğıöşü])\)\s+(.+)$/i;
  const inlineSubRegex =
    /(?:^|\s)([a-zçğıöşü])\)\s*([^|]+?)(?=(?:\s+[a-zçğıöşü]\)\s|\s*\||$))/gi;

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

        const fullRest = outcomeMatch[5].split(/\s*\|\s*/)[0].trim();
        // Strip any inline sub-components ("a) ... b) ... c) ...") from the main outcome header sentence!
        const cleanMainSentence = fullRest
          .replace(/\s+[a-zçğıöşü]\)\s+.*$/i, "")
          .replace(/\s+\d{1,2}\s*Ders\s*Saati.*$/i, "")
          .trim();

        const headerLine = `${code}. ${cleanMainSentence}`;
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
        }

        // Also extract any inline sub-components ("a) ... b) ...") that appeared on the same line
        let inlineMatch: RegExpExecArray | null;
        inlineSubRegex.lastIndex = 0;
        while ((inlineMatch = inlineSubRegex.exec(fullRest)) !== null) {
          const letter = inlineMatch[1].toLocaleLowerCase("tr-TR");
          const subText = inlineMatch[2].trim();
          if (subText.length >= 5 && !outcomesMap[code].subComponents[letter]) {
            outcomesMap[code].subComponents[letter] = `${letter}) ${subText}`;
            outcomesMap[code].orderedSubKeys.push(letter);
          }
        }

        currentOutcomeCode = code;
        continue;
      }
    }

    const subMatch = line.match(subCompLineRegex);
    if (subMatch && currentOutcomeCode && outcomesMap[currentOutcomeCode]) {
      const letter = subMatch[1].toLocaleLowerCase("tr-TR");
      let subText = subMatch[2].split(/\s*\|\s*/)[0].trim();
      if (
        i + 1 < combinedLines.length &&
        !/[.!?]$/.test(subText) &&
        !subCompLineRegex.test(combinedLines[i + 1]) &&
        !outcomeLineRegex.test(combinedLines[i + 1]) &&
        !/^(?:\d{1,2}\s*\.\s*HAFTA|İÇERİK\s*ÇERÇEVESİ|ÖĞRENME\s*KANITLARI|ÖĞRENME-ÖĞRETME)/i.test(
          combinedLines[i + 1]
        )
      ) {
        subText = `${subText} ${combinedLines[i + 1].split(/\s*\|\s*/)[0].trim()}`;
        i++;
      }

      const formattedSub = `${letter}) ${subText}`;
      const entry = outcomesMap[currentOutcomeCode];
      if (!entry.subComponents[letter]) {
        entry.subComponents[letter] = formattedSub;
        entry.orderedSubKeys.push(letter);
      }
    }
  }

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
  const cleanDate = (tarihAraligi || "").trim();

  // 1. Find the exact line range for targetWeekNo in Yıllık Plan
  let startIdx = -1;
  let endIdx = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const exactWeekRegex = new RegExp(
      `\\b${targetWeekNo}\\s*\\.\\s*HAFTA(?=$|\\s|[|(])`,
      "i"
    );
    const hasDate =
      cleanDate.length >= 5 &&
      !/^\d+\s*\.\s*hafta$/i.test(cleanDate) &&
      line
        .toLocaleLowerCase("tr-TR")
        .includes(cleanDate.toLocaleLowerCase("tr-TR"));

    if (exactWeekRegex.test(line) || (startIdx === -1 && hasDate)) {
      startIdx = i;
      for (let j = i + 1; j < Math.min(lines.length, i + 45); j++) {
        if (
          new RegExp(
            `\\b${targetWeekNo + 1}\\s*\\.\\s*HAFTA(?=$|\\s|[|(])`,
            "i"
          ).test(lines[j]) ||
          (j > i + 2 && /\b\d{1,2}\s*\.\s*HAFTA(?=$|\s|[|(])/i.test(lines[j]))
        ) {
          endIdx = j;
          break;
        }
      }
      break;
    }
  }

  const weekLines =
    startIdx !== -1
      ? lines.slice(startIdx, endIdx)
      : lines.slice(0, Math.min(lines.length, 35));
  const rawWeekWindowText = weekLines.join("\n");

  // 2. Identify Outcome Code in this week's block
  const outcomeCodePattern =
    /\b([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?\b/g;

  let detectedCode = "";
  let detectedUnitNo = 1;
  let inlineOutcomeHeader = "";

  for (const wLine of weekLines) {
    let m: RegExpExecArray | null;
    outcomeCodePattern.lastIndex = 0;
    while ((m = outcomeCodePattern.exec(wLine)) !== null) {
      const prefix = m[1];
      if (!/^(?:SDB|KB|OB|AB|E|D)$/i.test(prefix)) {
        detectedCode = m[0];
        detectedUnitNo = m[4] ? Number(m[3]) : Number(m[2]);
        const afterCode = wLine
          .slice(m.index)
          .split(/\s*\|\s*/)[0]
          .replace(/\s+[a-zçğıöşü]\)\s+.*$/i, "")
          .trim();
        if (afterCode.length > detectedCode.length + 3) {
          inlineOutcomeHeader = afterCode;
        }
        break;
      }
    }
    if (detectedCode) break;
  }

  // Extract sub-process components (a), b), c), ç), d), e)) explicitly present in this week's lines
  const weekSubMap = new Map<string, string>();
  const subRegex =
    /(?:^|\s|\|)([a-zçğıöşü])\)\s*([^|]+?)(?=(?:\s+[a-zçğıöşü]\)\s|\s*\||$))/gi;

  for (const wLine of weekLines) {
    let sm: RegExpExecArray | null;
    subRegex.lastIndex = 0;
    while ((sm = subRegex.exec(wLine)) !== null) {
      const letter = sm[1].toLocaleLowerCase("tr-TR");
      const textPart = sm[2]
        .replace(
          /(?:İçerik\s*Çerçevesi|Ölçme\s*ve\s*Değerlendirme).*$/i,
          ""
        )
        .trim();
      if (textPart.length >= 6 && !weekSubMap.has(letter)) {
        weekSubMap.set(letter, `${letter}) ${textPart}`);
      }
    }
  }

  if (!detectedCode) {
    if (weekSubMap.size > 0) {
      const firstSubText = Array.from(weekSubMap.values())[0]
        .replace(/^[a-zçğıöşü]\)\s*/i, "")
        .slice(0, 25)
        .toLocaleLowerCase("tr-TR");
      for (const entry of Object.values(structuredDbf.outcomesMap)) {
        for (const subVal of Object.values(entry.subComponents)) {
          if (subVal.toLocaleLowerCase("tr-TR").includes(firstSubText)) {
            detectedCode = entry.code;
            detectedUnitNo = entry.unitNumber;
            break;
          }
        }
        if (detectedCode) break;
      }
    }
    if (!detectedCode && startIdx > 0) {
      for (let b = startIdx - 1; b >= Math.max(0, startIdx - 25); b--) {
        outcomeCodePattern.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = outcomeCodePattern.exec(lines[b])) !== null) {
          if (!/^(?:SDB|KB|OB|AB|E|D)$/i.test(m[1])) {
            detectedCode = m[0];
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
    detectedUnitNo = catalogEntry.unitNumber;
  }

  // 3. Build clean Outcome Header (without inline a), b)!) + Week-Specific Sub-Components
  const outcomeHeader = (
    catalogEntry?.headerLine ||
    inlineOutcomeHeader ||
    (selectedWeekObj?.konuVeCiktiOzeti
      ? selectedWeekObj.konuVeCiktiOzeti.replace(
          /^.*?(\b[A-ZÇĞİÖŞÜ]{2,8}\.\d+(?:\.\d+)*\.?\s+)/,
          "$1"
        )
      : `${detectedCode || "ST.1.1"}. Seçilen hafta öğrenme çıktısı.`)
  )
    .replace(/\s+[a-zçğıöşü]\)\s+.*$/i, "")
    .trim();

  let finalSubComponents: string[] = [];
  if (weekSubMap.size > 0) {
    for (const [letter, rawLine] of weekSubMap.entries()) {
      if (catalogEntry?.subComponents[letter]) {
        finalSubComponents.push(catalogEntry.subComponents[letter]);
      } else {
        finalSubComponents.push(rawLine);
      }
    }
  } else if (catalogEntry && catalogEntry.orderedSubKeys.length > 0) {
    finalSubComponents = catalogEntry.orderedSubKeys.map(
      (k) => catalogEntry.subComponents[k]
    );
  }

  const formattedOutcomeAndProcessBlock = [
    outcomeHeader,
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
    /İçerik\s*Çerçevesi\s*[:|-]?\s*([^|\n]{4,90})/i
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
    tarihAraligi,
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

  const cleanSinif =
    (overrideMeta?.sinifDuzeyi || "").trim() ||
    structuredDbf.sinif ||
    "9. SINIF";

  const cleanDers =
    (overrideMeta?.dersIsmi || "").trim() ||
    structuredDbf.ders ||
    "MESLEK DERSİ";

  const aiGuduleme = aiPlan?.Ogrenme_Ogretme_Yasantilari?.Guduleme?.filter(
    (s) => typeof s === "string" && s.trim().length >= 25
  );
  const finalGuduleme =
    aiGuduleme && aiGuduleme.length >= 3
      ? aiGuduleme.map((s) => s.replace(/^\*\s*/, "").trim())
      : fallbackActivities.Guduleme;

  const aiDikkat = aiPlan?.Ogrenme_Ogretme_Yasantilari?.Dikkat_Cekme?.filter(
    (s) => typeof s === "string" && s.trim().length >= 20
  );
  const finalDikkat =
    aiDikkat && aiDikkat.length >= 3
      ? aiDikkat.map((s) => s.replace(/^\*\s*/, "").trim())
      : fallbackActivities.Dikkat_Cekme;

  const aiEkUygulamalar =
    aiPlan?.Ogrenme_Ogretme_Yasantilari?.Ek_Ogretme_Uygulamalari?.filter(
      (s) =>
        typeof s === "string" &&
        s.trim().length >= 25 &&
        !/MİLL[İI]\s*EĞİTİM\s*BAKANLIĞI\s*YAYINLARI|Her\s*hakkı\s*saklıdır/i.test(
          s
        )
    );
  const finalEkUygulamalar =
    aiEkUygulamalar && aiEkUygulamalar.length >= 4
      ? aiEkUygulamalar.map((s) => s.replace(/^\*\s*/, "").trim())
      : fallbackActivities.Ek_Ogretme_Uygulamalari;

  let finalOgretmeUygulamalari = weekData.unitOgretmeUygulamalari;
  if (finalOgretmeUygulamalari.length === 0) {
    const aiOgretme =
      aiPlan?.Ogrenme_Ogretme_Yasantilari?.Ogretme_Uygulamalari?.filter(
        (s) =>
          typeof s === "string" &&
          s.trim().length >= 10 &&
          !/MİLL[İI]\s*EĞİTİM\s*BAKANLIĞI\s*YAYINLARI|Her\s*hakkı\s*saklıdır|\.{4,}/i.test(
            s
          )
      );
    finalOgretmeUygulamalari =
      aiOgretme && aiOgretme.length >= 3
        ? aiOgretme.map((s) => s.replace(/^\*\s*/, "").trim())
        : fallbackActivities.Ogretme_Uygulamalari;
  }

  const finalOgrenmeKanitlari =
    structuredDbf.ogrenmeKanitlari ||
    (aiPlan?.Ogrenme_Kanitlari && aiPlan.Ogrenme_Kanitlari.trim().length >= 60
      ? aiPlan.Ogrenme_Kanitlari.trim()
      : `Öğrenci çalışmaları değerlendirilirken kontrol listesi, derecelendirme ölçeği ve dereceli puanlama anahtarı gibi ölçme araçlarından uygun olanlar seçilerek kullanılabilir. Ayrıca öğrencilerin sürece yönelik kendi katkılarını ve grup içi etkileşimlerini değerlendirmeleri amacıyla öz ve akran değerlendirme formlarından yararlanılabilir. Yapılan çalışmalar gözlem formu, kontrol listesi veya dereceli puanlama anahtarı ile değerlendirilebilir. Bu ölçme yöntemleri, sürecin her aşamasında geri bildirim sağlamak ve öğrencilerin gelişimlerini sistematik bir şekilde izlemek için kullanılabilir.`);

  const finalTemelKabuller =
    structuredDbf.temelKabuller ||
    (aiPlan?.Ogrenme_Ogretme_Yasantilari?.Temel_Kabuller &&
    aiPlan.Ogrenme_Ogretme_Yasantilari.Temel_Kabuller.trim().length >= 35
      ? aiPlan.Ogrenme_Ogretme_Yasantilari.Temel_Kabuller.trim()
      : `Öğrencilerin; ${weekData.ogrenmeBirimi.toLocaleLowerCase("tr-TR")} ve ${weekData.icerikCercevesi.toLocaleLowerCase("tr-TR")} konusuyla ilgili temel kavramlara ve günlük yaşam gözlemlerine sahip oldukları kabul edilmektedir.`);

  const finalOnDegerlendirme =
    structuredDbf.onDegerlendirmeSureci ||
    (aiPlan?.Ogrenme_Ogretme_Yasantilari?.On_Degerlendirme_Sureci &&
    aiPlan.Ogrenme_Ogretme_Yasantilari.On_Degerlendirme_Sureci.trim().length >=
      35
      ? aiPlan.Ogrenme_Ogretme_Yasantilari.On_Degerlendirme_Sureci.trim()
      : `Öğrencilerden, ${weekData.ogrenmeBirimi.toLocaleLowerCase("tr-TR")} ve ${weekData.icerikCercevesi.toLocaleLowerCase("tr-TR")} konusundaki temel kavramlar ve uygulama örnekleri hakkında ön bilgilerini paylaşmaları istenir.`);

  const finalKopruKurma =
    structuredDbf.kopruKurma ||
    (aiPlan?.Ogrenme_Ogretme_Yasantilari?.Kopru_Kurma &&
    aiPlan.Ogrenme_Ogretme_Yasantilari.Kopru_Kurma.trim().length >= 35
      ? aiPlan.Ogrenme_Ogretme_Yasantilari.Kopru_Kurma.trim()
      : `Günlük hayatta karşılaşılan örnekler ve önceki konularda edinilen bilgiler üzerinden ${weekData.ogrenmeBirimi.toLocaleLowerCase("tr-TR")} ile ${weekData.icerikCercevesi.toLocaleLowerCase("tr-TR")} konusu arasında ilişki kurularak yeni konuya geçiş yapılır.`);

  return {
    Ders_Bilgisi: {
      Sinif: cleanSinif,
      Ders: cleanDers,
      Ogrenme_Birimi: weekData.ogrenmeBirimi,
      Sure: weekData.sure,
      Alan_Becerileri: structuredDbf.alanBecerileri,
      Egilimler: structuredDbf.egilimler,
    },
    Programlar_Arasi_Bilesenler: {
      Sosyal_Duygusal_Ogrenme_Becerileri: structuredDbf.sosyalDuygusalBeceriler,
      Degerler: structuredDbf.degerler,
      Okuryazarlik_Becerileri: structuredDbf.okuryazarlikBecerileri,
      Disiplinler_Arasi_Iliski: structuredDbf.disiplinlerArasiIliski,
      Beceriler_Arasi_Iliski: structuredDbf.becerilerArasiIliski,
    },
    Ogrenme_Ciktilari_ve_Surec_Bilesenleri:
      weekData.formattedOutcomeAndProcessBlock,
    Icerik_Cercevesi: weekData.icerikCercevesi,
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
    Farklilastirma: structuredDbf.farklilastirma,
  };
}
