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
 * Normalizes Turkish Unicode text (handling NFD decomposed characters like I + \u0307 from PDFs)
 */
export function normalizeTurkishUnicode(rawText: string): string {
  if (!rawText) return "";
  return rawText
    .normalize("NFC")
    .replace(/I\u0307/g, "İ")
    .replace(/i\u0307/g, "i");
}

/**
 * Converts text to Turkish uppercase after NFC normalization while preserving character indices
 */
function toTrUpper(text: string): string {
  return normalizeTurkishUnicode(text).toLocaleUpperCase("tr-TR");
}

/**
 * Normalizes Turkish text and common MEB loanword spelling variations (e.g. "vegetatif" <-> "vejetatif",
 * "jeneratif" <-> "generatif") so unit headings, outcomes, and topics match reliably even when the same
 * PDF uses both spellings across different pages.
 */
export function normalizeForUnitMatching(text: string): string {
  return normalizeTurkishUnicode(text || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/vegetat/g, "vejetat")
    .replace(/jenerat/g, "generat")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pre-normalizes raw PDF/DOCX text before line-by-line parsing:
 * 1. Normalizes decomposed Turkish Unicode characters (I\u0307 -> İ).
 * 2. Strips textbook/PDF front-matter boilerplate (copyright, imprint, ISBN, TOC dotted lines).
 * 3. Strips standalone "EK-3" headers, standalone "2 / 7" page numbers, and repeating annual plan page footers.
 * 4. Inserts clean line breaks (\n) before inline PDF section headings and Maarif component columns
 *    that `unpdf` glued onto the end of preceding sentences (even when preceding lines have no trailing punctuation).
 */
export function stripFrontMatter(rawText: string): string {
  if (!rawText) return "";

  const normalized = normalizeTurkishUnicode(rawText)
    // Remove standalone or glued MEB annex markers ("EK-3", "EK-1", "EK - 3") cleanly BEFORE heading splitting
    // Case-sensitive uppercase "EK" preserves spacing when glued inside PDF words ("nasılEK-3gerçekleştirildiğine") or codes ("D12.3,EK-3D16.3")
    .replace(/(?<![A-ZÇĞİÖŞÜ])EK\s*[-–]\s*\d{1,2}(?![0-9])/g, " ")
    // Pre-join 2-line or glued section headings in PDFs so headings never stay glued to previous or next text
    .replace(
      /(?:ÖĞRENME|Öğrenme)\s*[-–]?\s*\r?\n?\s*(?:ÖĞRETME|Öğretme)\s*\r?\n?\s*(?:ORTAM|Ortam)\s+(?:VE|ve)\s+(?:DONANIM[Iİ]?|Donanım[ıi]?)/g,
      "\nÖĞRENME ÖĞRETME ORTAM VE DONANIMI\n"
    )
    .replace(
      /(?:ÖĞRENME|Öğrenme)\s*BİRİMİ\s*\/\s*\r?\n?\s*(?:MODÜL|Modül)\s+(?:VE|ve)\s+SÜRE\s*\r?\n?\s*TABLOSU/gi,
      "\nÖĞRENME BİRİMİ / MODÜL VE SÜRE TABLOSU\n"
    )
    .replace(
      /(?:ÖĞRENME|Öğrenme)\s*BİRİMİ\s*\/\s*\r?\n?\s*(?:MODÜL|Modül)(?=\s*(?:ÖĞRENME\s*ÇIKTISI|ADI))/gi,
      "\nÖĞRENME BİRİMİ / MODÜL "
    )
    .replace(
      /(?:UYGULAMA|Uygulama)\s+(?:FAALİYETLERİ|Faaliyetleri)\s*\/\s*(?:TEMRİNLER|Temrinler)/g,
      "\nUYGULAMA FAALİYETLERİ / TEMRİNLER\n"
    )
    .replace(
      /DERSİN\s+UYGULANMASINA\s+İLİŞKİN\s+AÇIKLAMALAR/g,
      "\nDERSİN UYGULANMASINA İLİŞKİN AÇIKLAMALAR\n"
    )
    .replace(
      /(?:ÖĞRENME|Öğrenme)\s*[-–]?\s*\r?\n?\s*(?:ÖĞRETME|Öğretme)\s+(?:UYGULAMALAR[Iİ]|Uygulamaları)/g,
      "\nÖĞRENME-ÖĞRETME UYGULAMALARI\n"
    )
    .replace(
      /(?:ÖĞRETME|Öğretme)\s*[-–]?\s*\r?\n?\s*(?:ÖĞRENME|Öğrenme)\s+(?:UYGULAMALAR[Iİ]|Uygulamaları)/g,
      "\nÖĞRETME-ÖĞRENME UYGULAMALARI\n"
    )
    .replace(
      /(?:(?:ÖĞRENME|Öğrenme)\s*[-–]?\s*(?:ÖĞRETME|Öğretme|öğretme)|(?:ÖĞRETME|Öğretme)\s*[-–]?\s*(?:ÖĞRENME|Öğrenme|öğrenme))\s*\r?\n\s*(?:UYGULAMALAR[Iİ]|Uygulamaları|uygulamaları)/g,
      "\nÖĞRENME-ÖĞRETME UYGULAMALARI\n"
    )
    .replace(
      /(?:ÖĞRENME|Öğrenme)\s*[-–]?\s*\r?\n?\s*(?:ÖĞRETME|Öğretme)\s+(?:YAŞANT[Iİ]LAR[Iİ]|Yaşantıları)/g,
      "\nÖĞRENME-ÖĞRETME YAŞANTILARI\n"
    )
    .replace(
      /(?:(?:ÖĞRENME|Öğrenme)\s*[-–]?\s*(?:ÖĞRETME|Öğretme|öğretme)|(?:ÖĞRETME|Öğretme)\s*[-–]?\s*(?:ÖĞRENME|Öğrenme|öğrenme))\s*\r?\n\s*(?:YAŞANT[Iİ]LAR[Iİ]|Yaşantıları|yaşantıları)/g,
      "\nÖĞRENME-ÖĞRETME YAŞANTILARI\n"
    )
    .replace(
      /(?:ÖN|Ön)\s*\r?\n?\s*(?:DEĞERLEND[İI]RME|Değerlendirme)(?:\s*\r?\n?\s*(?:SÜREC[İI]|Süreci))?/g,
      "\nÖN DEĞERLENDİRME SÜRECİ\n"
    )
    .replace(
      /(?:TEMEL|Temel)\s*\r?\n?\s*(?:KABULLER|Kabuller)/g,
      "\nTEMEL KABULLER\n"
    )
    .replace(
      /(?:KÖPRÜ|Köprü)\s*\r?\n?\s*(?:KURMA|Kurma)/g,
      "\nKÖPRÜ KURMA\n"
    )
    .replace(
      /(?:ÖĞRENME|Öğrenme)\s*\r?\n?\s*(?:KAN[Iİ]TLAR[Iİ]|Kanıtları)(?:\s*\r?\n?\s*\(\s*(?:ÖLÇME|Ölçme)\s+(?:VE|ve)\s*\r?\n?\s*(?:DEĞERLEND[İI]RME|Değerlendirme)\s*\))?/g,
      "\nÖĞRENME KANITLARI (ÖLÇME VE DEĞERLENDİRME)\n"
    )
    // Separate Ortam: / Donanım: when glued to preceding PDF cells
    .replace(/([^\n])((?:Ortam|Donanım)\s*:)/g, "$1\n$2")
    // Separate parenthesized Maarif code list endings "(E1.4, ..., D18.3)." from glued next unit heading or section heading
    .replace(
      /(\((?:(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*(?:\s*[,;]\s*|\s+)){1,}(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*\)\.?)\s*(?=[A-ZÇĞİÖŞÜ])/g,
      "$1\n"
    )
    // Remove repeating annual plan page footer/header blocks that end with page numbers like "2 / 7"
    .replace(
      /20\d{2}\s*[-–]\s*20\d{2}\s*EĞİTİM\s*[-–]?\s*ÖĞRETİM\s*YILI[^\n]{5,180}?YILLIK\s*PLANI(?:\s*\(TYMM\))?\s*\d{1,2}\s*\/\s*\d{1,2}/gi,
      "\n"
    )
    // Remove inline page numbers like " 2 / 7 " or " 1 / 7 " while preserving module duration ratios like "80/54" or "40/24"
    .replace(
      /(^|\s)(\d{1,2})\s*\/\s*(\d{1,2})(?=\s|$)/gm,
      (fullMatch, lead, p1, p2) => {
        const n1 = Number(p1);
        const n2 = Number(p2);
        if (n1 >= 1 && n2 >= n1 && n2 <= 45) {
          return " ";
        }
        return fullMatch || `${lead}${p1}/${p2}`;
      }
    )
    // Insert newline before major section headings when glued inline after punctuation
    .replace(
      /([.!?:;|])\s*((?:ÖĞRENME\s*KAN[Iİ]TLAR[Iİ]|Öğrenme\s*[Kk]anıtları|ÖĞRENME\s*[-–]?\s*ÖĞRETME\s*YAŞANT[Iİ]LAR[Iİ]|Öğrenme\s*[-–]?\s*[Öö]ğretme\s*[Yy]aşantıları|ÖĞRETME\s*[-–]?\s*ÖĞRENME\s*YAŞANT[Iİ]LAR[Iİ]|Öğretme\s*[-–]?\s*[Öö]ğrenme\s*[Yy]aşantıları|TEMEL\s*KABULLER|Temel\s*[Kk]abuller|ÖN\s*DEĞERLEND[İI]RME(?:\s*SÜREC[İI])?|Ön\s*[Dd]eğerlendirme(?:\s*[Ss]üreci)?|KÖPRÜ\s*KURMA|Köprü\s*[Kk]urma|ÖĞRENME\s*[-–]?\s*ÖĞRETME\s*UYGULAMALAR[Iİ]|Öğrenme\s*[-–]?\s*[Öö]ğretme\s*[Uu]ygulamaları|ÖĞRETME\s*[-–]?\s*ÖĞRENME\s*UYGULAMALAR[Iİ]|Öğretme\s*[-–]?\s*[Öö]ğrenme\s*[Uu]ygulamaları|ÖĞRENME\s*[-–]?\s*ÖĞRETME\s*ORTAM\s+VE\s+DONANIM[Iİ]?|FARKL[Iİ]LAŞT[Iİ]RMA|Farklılaştırma)(?=\s|[:(-]|$))/g,
      "$1\n$2"
    )
    // Also split if major Ders Bilgi Formu headings appear mid-line even WITHOUT preceding punctuation
    .replace(
      /\s+((?:ÖĞRENME\s*KAN[Iİ]TLAR[Iİ](?:\s*\(ÖLÇME\s*VE\s*DEĞERLEND[İI]RME\))?|Öğrenme\s*[Kk]anıtları(?:\s*\(Ölçme\s*ve\s*Değerlendirme\))?|ÖĞRENME\s*[-–]?\s*ÖĞRETME\s*YAŞANT[Iİ]LAR[Iİ]|Öğrenme\s*[-–]?\s*[Öö]ğretme\s*[Yy]aşantıları|ÖĞRETME\s*[-–]?\s*ÖĞRENME\s*YAŞANT[Iİ]LAR[Iİ]|Öğretme\s*[-–]?\s*[Öö]ğrenme\s*[Yy]aşantıları|TEMEL\s*KABULLER|Temel\s*[Kk]abuller|ÖN\s*DEĞERLEND[İI]RME(?:\s*SÜREC[İI])?|Ön\s*[Dd]eğerlendirme(?:\s*[Ss]üreci)?|KÖPRÜ\s*KURMA|Köprü\s*[Kk]urma|ÖĞRENME\s*[-–]?\s*ÖĞRETME\s*UYGULAMALAR[Iİ]|Öğrenme\s*[-–]?\s*[Öö]ğretme\s*[Uu]ygulamaları|ÖĞRETME\s*[-–]?\s*ÖĞRENME\s*UYGULAMALAR[Iİ]|Öğretme\s*[-–]?\s*[Öö]ğrenme\s*[Uu]ygulamaları|ÖĞRENME\s*[-–]?\s*ÖĞRETME\s*ORTAM\s+VE\s+DONANIM[Iİ]?|FARKL[Iİ]LAŞT[Iİ]RMA|Farklılaştırma)(?=\s|[:(-]|$))/g,
      "\n$1"
    )
    // Insert newline before Maarif component code definitions (e.g. "E1.4. Kendine İnanma", "SDB2.2. İş Birliği") when NOT inside parentheses
    .replace(
      /(?<![(,]\s*)\s+((?:E[123]\.\d{1,2}|SDB[123]\.\d|D\d{1,2}|OB[1-9]|KB(?:1|[23]\.\d{1,2}))\.\s+[A-ZÇĞİÖŞÜ])/g,
      "\n$1"
    );

  const lines = normalized.split(/\r?\n/);
  let seenAnnualPlanTitleCount = 0;

  const cleanedLines = lines.filter((line) => {
    const t = line.trim();
    if (!t) return false;
    if (/^\d{1,2}\s*\/\s*\d{1,2}$/.test(t)) return false;
    if (/^EK\s*[-–]?\s*\d{1,2}$/i.test(t)) return false;
    if (/\.{4,}/.test(t) || (/\b\d{4,6}\b/.test(t) && /\.{2,}/.test(t))) return false;
    const upperT = toTrUpper(t);
    if (
      /MİLL[İI]\s*EĞİTİM\s*BAKANLIĞI\s*YAYINLARI|YARDIMCI\s*VE\s*KAYNAK|KİTAPLAR\s*DİZİSİ|DERS\s*MATERYAL[İI]|ALANI\s+BİTKİ\s+ÜRETİM|HER\s*HAKKI\s*SAKLIDIR|HİÇBİR\s*SURETTE\s*ALINIP\s*YAYIMLANAMAZ|ISBN\s*[:\d-]|BASKI\s*YILI|MATBAASI|İSTİKL[ÂA]L\s*MARŞI|GENÇLİĞE\s*HİTABE|EDİTÖR|GÖRSEL\s*TASARIM\s*UZMANI|PROGRAM\s*GELİŞTİRME\s*UZMANI|ÖLÇME\s*VE\s*DEĞERLENDİRME\s*UZMANI|REHBERLİK\s*UZMANI/.test(
        upperT
      )
    ) {
      return false;
    }
    if (
      /20\d{2}\s*[-–]\s*20\d{2}\s*EĞİTİM\s*[-–]?\s*ÖĞRETİM\s*YILI.*YILLIK\s*PLANI/.test(
        upperT
      )
    ) {
      seenAnnualPlanTitleCount++;
      if (seenAnnualPlanTitleCount > 1) {
        return false;
      }
    }
    return true;
  });
  return cleanedLines.join("\n");
}

/**
 * Cleans any outcome header or sub-component sentence so it NEVER includes trailing Maarif component codes,
 * school names, page numbers, or column headers from adjacent PDF table cells.
 */
export function sanitizeOutcomeOrSubSentence(rawText: string): string {
  if (!rawText) return "";
  return rawText
    .replace(/\s*\|\s*.*$/, "")
    .replace(
      /\s+(?:E[123]\.\d{1,2}|SDB[123]\.\d|D\d{1,2}|OB[1-9]|KB(?:1|[23]\.\d{1,2}))\.?\s+[A-ZÇĞİÖŞÜ].*$/i,
      ""
    )
    .replace(
      /\s+20\d{2}\s*[-–]\s*20\d{2}\s*Eğitim.*$/i,
      ""
    )
    .replace(/\s+\d{1,2}\s*\/\s*\d{1,2}\b.*$/, "")
    .replace(
      /\s+(?:Programlar\s*Arası|Ölçme\s*ve\s*Değerlendirme|Belirli\s*Günler|Öğrenme\s*Kanıtları|İçerik\s*Çerçevesi).*$/i,
      ""
    )
    .replace(/\s+\d{1,2}\s*(?:Ders\s*)?Saat[i]?\b.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Cleans a short heading like Öğrenme Birimi or İçerik Çerçevesi so it is strictly a clean title
 * (max 65 chars, no outcome verbs, no Maarif codes, no school names).
 */
export function sanitizeShortTopicTitle(
  rawTitle: string,
  fallback = ""
): string {
  const cleaned = sanitizeOutcomeOrSubSentence(rawTitle || "")
    .replace(/^[A-ZÇĞİÖŞÜ]{2,8}\.\d+(?:\.\d+)*\.?\s*/, "")
    .replace(/(?:^|\s)[a-zçğıöşü]\)\s+.*$/i, "")
    .replace(
      /\s+(?:(?:analiz|kontrol|hasat|muhafaza|tespit|ayırt|elde|kayıt|takip)\s+)?(?:yapabilme|yapar|edebilme|eder|açıklayabilme|açıklar|sıralayabilme|sıralar|uygulayabilme|uygular|sınıflandırabilme|sınıflandırır|karşılaştırabilme|karşılaştırır|değerlendirebilme|değerlendirir|kavrayabilme|kavrar|belirleyebilme|belirler|kullanabilme|kullanır|hazırlayabilme|hazırlar|üretebilme|üretir|yönetebilme|yönetir|tasarlayabilme|tasarlar|seçebilme|seçer|sorgulayabilme|sorgular|çözümleyebilme|çözümler|[a-zçğıöşü]{3,}(?:ebilme|abilme))\.?$/i,
      ""
    )
    .replace(/\.$/, "")
    .trim();

  if (
    !cleaned ||
    cleaned.length < 3 ||
    /^(?:VE\s*SÜRE|SÜRE|SAAT|BİLGİ\s*FORMU|\d+\s*\.\s*HAFTA)$/i.test(cleaned)
  ) {
    return fallback;
  }

  if (cleaned.length > 65) {
    return cleaned.slice(0, 65).replace(/\s+\S*$/, "").trim() || fallback;
  }

  return cleaned;
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
 * Extracts clean course name, field (alan) name, grade level, and school name from the 3 documents.
 * Prioritizes explicit "DERSİN ADI" and parenthesized course names ("TARIM (SÜRDÜRÜLEBİLİR TARIM)")
 * over generic header matches so phrases from "DERSİN AMACI" never pollute the course name.
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
    .slice(0, 150);

  let okulAdi = "";
  let alanAdi = "";
  let explicitDersAdi = "";
  let parenDersAdi = "";
  let headerDersAdi = "";
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
      okulAdi = line
        .replace(/^.*20\d{2}\s*[-–]\s*20\d{2}\s*EĞİTİM\s*[-–]?\s*ÖĞRETİM\s*YILI\s*/i, "")
        .replace(/\b\d{1,2}\s*\.\s*SINIF.*$/i, "")
        .replace(/\|/g, " ")
        .replace(/\s+/g, " ")
        .trim();
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
          /(?:^|\s)([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s-]{2,30}?)\s+ALANI(?=$|\s|[:|,-])/i
        );
        if (
          alanMatch &&
          !/ÖĞRENME|BECERİ|UYGULAMA|ÇALIŞMA|TARIM\s+ALANI\s+DIŞI|BU\s+DERS/i.test(
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
      } else if (/^DERSİN\s*SÜRESİ/i.test(line) && lines[i + 1]) {
        const nextHaftalik = lines[i + 1].match(/(\d{1,2})\s*DERS\s*SAATİ/i);
        if (nextHaftalik) {
          sure = `${nextHaftalik[1]} Ders Saati`;
        }
      }
    }

    // 4. Grade Level (Strictly "9. SINIF", "10. SINIF", etc.)
    if (!sinifDuzeyi) {
      const explicitGrade = line.match(
        /\b(9|10|11|12|5|6|7|8)\s*\.\s*SINIF(?=$|\s|[:|,-])/i
      );
      if (explicitGrade) {
        sinifDuzeyi = `${explicitGrade[1]}. SINIF`;
      } else if (
        /^(?:DERSİN\s*)?SINIF(?:I|\s*DÜZEYİ)?(?=$|\s|[:|-])/i.test(line)
      ) {
        const numInLine = line.match(/\b(9|10|11|12|5|6|7|8)\b/);
        const numInNext = lines[i + 1]?.match(/\b(9|10|11|12|5|6|7|8)\b/);
        const g = numInLine?.[1] || numInNext?.[1];
        if (g) sinifDuzeyi = `${g}. SINIF`;
      }
    }

    // 5A. Explicit label "DERSİN ADI: SÜRDÜRÜLEBİLİR TARIM" (Highest Priority)
    if (!explicitDersAdi && /(?:^|\s)DERS(?:İN)?\s*ADI(?=$|\s|[:|-])/i.test(line)) {
      const afterLabel = line
        .replace(/^.*?DERS(?:İN)?\s*ADI\s*[:|\-–]?\s*/i, "")
        .replace(/\|/g, " ")
        .replace(/(?:DERSİN\s*SINIFI|SINIF|DERSİN\s*SÜRESİ|HAFTALIK|DERSİN\s*AMACI).*$/i, "")
        .replace(/\s+\d{1,2}$/, "")
        .trim();
      if (
        afterLabel.length >= 3 &&
        afterLabel.length <= 55 &&
        !/^(?:BİLGİ\s*FORMU|MATERYALİ|PLANI|SAATİ|SÜRESİ)$/i.test(afterLabel)
      ) {
        explicitDersAdi = afterLabel.toLocaleUpperCase("tr-TR");
      } else if (lines[i + 1]) {
        const nextLine = lines[i + 1]
          .replace(/\|/g, " ")
          .replace(/(?:DERSİN\s*SINIFI|SINIF|DERSİN\s*SÜRESİ|HAFTALIK|DERSİN\s*AMACI).*$/i, "")
          .replace(/\s+\d{1,2}$/, "")
          .trim();
        if (
          nextLine.length >= 3 &&
          nextLine.length <= 55 &&
          !/^(?:BİLGİ\s*FORMU|MATERYALİ|PLANI|SAATİ|SÜRESİ|\d+)$/i.test(
            nextLine
          )
        ) {
          explicitDersAdi = nextLine.toLocaleUpperCase("tr-TR");
        }
      }
    }

    // 5B. Already formatted like "9. SINIF TARIM (SÜRDÜRÜLEBİLİR TARIM) DERSİ"
    if (!parenDersAdi) {
      const parenCourseMatch = line.match(
        /(?:\b\d{1,2}\.\s*SINIF\s+|\bÖĞRETİM\s+YILI\s+)?([A-ZÇĞİÖŞÜa-zçğıöşü\s]{2,35}\([A-ZÇĞİÖŞÜa-zçğıöşü\s-]{3,45}\))\s+DERSİ/i
      );
      if (parenCourseMatch) {
        parenDersAdi = parenCourseMatch[1]
          .replace(/^.*ÖĞRETİM\s+YILI\s+/i, "")
          .replace(/^\d{1,2}\.\s*SINIF\s+/i, "")
          .trim()
          .toLocaleUpperCase("tr-TR");
      }
    }

    // 5C. Annual Plan or Materyal Header like "9. SINIF SÜRDÜRÜLEBİLİR TARIM YILLIK PLANI" or "TARIM ALANI SÜRDÜRÜLEBİLİR TARIM 9 DERS MATERYALİ"
    if (!headerDersAdi && !/bu\s+ders\s+ile|öğrencilerin/i.test(line)) {
      const yillikTitleMatch = line.match(
        /\b\d{1,2}\s*\.\s*SINIF\s+([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s()-]{3,45}?)\s+(?:DERSİ\s+)?(?:ÜNİTELENDİRİLMİŞ\s+)?YILLIK\s+(?:ÇERÇEVE\s+)?PLANI/i
      );
      if (yillikTitleMatch) {
        headerDersAdi = yillikTitleMatch[1].trim().toLocaleUpperCase("tr-TR");
      } else {
        const dbfHeaderMatch = line.match(
          /^(?:[A-ZÇĞİÖŞÜa-zçğıöşü\s]+ALANI\s+)?([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ\s()-]{3,45}?)\s+(?:\d{1,2}\s+)?(?:DERS\s*BİLGİ\s*FORMU|DERS\s*MATERYALİ)$/i
        );
        if (dbfHeaderMatch) {
          const cand = dbfHeaderMatch[1]
            .replace(/^.*ALANI\s+/i, "")
            .replace(/\b\d{1,2}\.\s*SINIF\s*/i, "")
            .replace(/\s+\d{1,2}$/, "")
            .trim();
          if (
            cand.length >= 3 &&
            !/^(?:DERS|BİLGİ\s*FORMU|DERS\s*BİLGİ\s*FORMU|MATERYALİ|DERSİN\s*SÜRESİ|HAFTALIK|TEKNİKLERİ)$/i.test(
              cand
            )
          ) {
            headerDersAdi = cand.toLocaleUpperCase("tr-TR");
          }
        }
      }
    }
  }

  const rawDersAdi = parenDersAdi || explicitDersAdi || headerDersAdi;

  // If Alan wasn't found via "TARIM ALANI", check if rawDersAdi contains "TARIM" (e.g. "SÜRDÜRÜLEBİLİR TARIM")
  if (!alanAdi && /TARIM/i.test(rawDersAdi) && !rawDersAdi.startsWith("TARIM (")) {
    alanAdi = "TARIM";
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

export interface DbfUygulamaSegment {
  index: number;
  unitHint: string;
  unitNumberHint: number;
  rawText: string;
  bullets: string[];
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
  ogretmeUygulamalariSegments?: DbfUygulamaSegment[];
  allOgretmeUygulamalariBullets: string[];
  unitContextKeywords?: Record<string, string>;
  hasExplicitUnitHeadingsInUygulamalar?: boolean;
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

export const DEFAULT_MEB_WEEK_DATES: Record<
  number,
  { tarihAraligi: string; onayTarihi: string }
> = {
  1: { tarihAraligi: "14 - 18 Eylül", onayTarihi: "14/09/2026" },
  2: { tarihAraligi: "21 - 25 Eylül", onayTarihi: "21/09/2026" },
  3: { tarihAraligi: "28 Eylül - 02 Ekim", onayTarihi: "28/09/2026" },
  4: { tarihAraligi: "05 - 09 Ekim", onayTarihi: "05/10/2026" },
  5: { tarihAraligi: "12 - 16 Ekim", onayTarihi: "12/10/2026" },
  6: { tarihAraligi: "19 - 23 Ekim", onayTarihi: "19/10/2026" },
  7: { tarihAraligi: "26 - 30 Ekim", onayTarihi: "26/10/2026" },
  8: { tarihAraligi: "02 - 06 Kasım", onayTarihi: "02/11/2026" },
  9: { tarihAraligi: "16 - 20 Kasım", onayTarihi: "16/11/2026" },
  10: { tarihAraligi: "23 - 27 Kasım", onayTarihi: "23/11/2026" },
  11: { tarihAraligi: "30 Kasım - 04 Aralık", onayTarihi: "30/11/2026" },
  12: { tarihAraligi: "07 - 11 Aralık", onayTarihi: "07/12/2026" },
  13: { tarihAraligi: "14 - 18 Aralık", onayTarihi: "14/12/2026" },
  14: { tarihAraligi: "21 - 25 Aralık", onayTarihi: "21/12/2026" },
  15: { tarihAraligi: "28 Aralık - 01 Ocak", onayTarihi: "28/12/2026" },
  16: { tarihAraligi: "04 - 08 Ocak", onayTarihi: "04/01/2027" },
  17: { tarihAraligi: "11 - 15 Ocak", onayTarihi: "11/01/2027" },
  18: { tarihAraligi: "18 - 22 Ocak", onayTarihi: "18/01/2027" },
  19: { tarihAraligi: "08 - 12 Şubat", onayTarihi: "08/02/2027" },
  20: { tarihAraligi: "15 - 19 Şubat", onayTarihi: "15/02/2027" },
  21: { tarihAraligi: "22 - 26 Şubat", onayTarihi: "22/02/2027" },
  22: { tarihAraligi: "01 - 05 Mart", onayTarihi: "01/03/2027" },
  23: { tarihAraligi: "08 - 12 Mart", onayTarihi: "08/03/2027" },
  24: { tarihAraligi: "15 - 19 Mart", onayTarihi: "15/03/2027" },
  25: { tarihAraligi: "22 - 26 Mart", onayTarihi: "22/03/2027" },
  26: { tarihAraligi: "29 Mart - 02 Nisan", onayTarihi: "29/03/2027" },
  27: { tarihAraligi: "12 - 16 Nisan", onayTarihi: "12/04/2027" },
  28: { tarihAraligi: "19 - 23 Nisan", onayTarihi: "19/04/2027" },
  29: { tarihAraligi: "26 - 30 Nisan", onayTarihi: "26/04/2027" },
  30: { tarihAraligi: "03 - 07 Mayıs", onayTarihi: "03/05/2027" },
  31: { tarihAraligi: "10 - 14 Mayıs", onayTarihi: "10/05/2027" },
  32: { tarihAraligi: "17 - 21 Mayıs", onayTarihi: "17/05/2027" },
  33: { tarihAraligi: "24 - 28 Mayıs", onayTarihi: "24/05/2027" },
  34: { tarihAraligi: "31 Mayıs - 04 Haziran", onayTarihi: "31/05/2027" },
  35: { tarihAraligi: "07 - 11 Haziran", onayTarihi: "07/06/2027" },
  36: { tarihAraligi: "14 - 18 Haziran", onayTarihi: "14/06/2027" },
};

export function resolveValidDateRange(
  rawDateRange?: string,
  weekNo?: number
): string {
  const trimmed = (rawDateRange || "").trim();
  const isRedundantOrEmpty =
    !trimmed ||
    /^\d+\s*\.\s*hafta$/i.test(trimmed) ||
    trimmed.length < 4 ||
    !/\d/.test(trimmed);

  if (!isRedundantOrEmpty) {
    return trimmed;
  }

  if (weekNo && DEFAULT_MEB_WEEK_DATES[weekNo]) {
    return DEFAULT_MEB_WEEK_DATES[weekNo].tarihAraligi;
  }

  return trimmed || "14 - 18 Eylül";
}

export function formatFullWeekAndDateRange(
  rawHaftaEtiketi?: string,
  rawTarihAraligi?: string
): string {
  const haftaEtiketi = (rawHaftaEtiketi || "").trim() || "1. HAFTA";
  const weekMatch = haftaEtiketi.match(/\b(\d{1,2})\b/);
  const weekNo = weekMatch ? Number(weekMatch[1]) : 1;

  const validDateRange = resolveValidDateRange(rawTarihAraligi, weekNo);

  const parenMatch = haftaEtiketi.match(/^(.+?)\s*\(([^)]+)\)$/);
  if (parenMatch) {
    const baseHafta = parenMatch[1].trim();
    const insideParen = parenMatch[2].trim();
    if (!/^\d+\s*\.\s*hafta$/i.test(insideParen) && /\d/.test(insideParen)) {
      return `${baseHafta} (${insideParen})`;
    }
    return `${baseHafta} (${validDateRange})`;
  }

  return `${haftaEtiketi} (${validDateRange})`;
}

/**
 * Converts a Turkish outcome sentence like "BÜY.1.1. Generatif üretim yapabilme",
 * "ST.1.1. Onarıcı tarım yöntemlerini açıklayabilme", or "ST.2.1. İyi tarımı açıklayabilme"
 * into its clean Learning Unit name ("Generatif üretim", "Onarıcı tarım", "İyi tarım").
 */
export function deriveUnitNameFromOutcome(outcomeHeader: string): string {
  const withoutCode = sanitizeOutcomeOrSubSentence(outcomeHeader || "")
    .replace(/^[A-ZÇĞİÖŞÜ]{2,8}\.\d+(?:\.\d+)*\.?\s*/, "")
    .replace(/\s+[a-zçğıöşü]\)\s+.*$/i, "")
    .replace(/\.$/, "")
    .trim();

  if (!withoutCode) return "";

  const stripped = withoutCode
    .replace(
      /\s+(?:(?:analiz|kontrol|hasat|muhafaza|tespit|ayırt|elde|kayıt|takip)\s+)?(?:yapabilme|yapar|edebilme|eder|açıklayabilme|açıklar|sıralayabilme|sıralar|uygulayabilme|uygular|sınıflandırabilme|sınıflandırır|karşılaştırabilme|karşılaştırır|değerlendirebilme|değerlendirir|kavrayabilme|kavrar|belirleyebilme|belirler|kullanabilme|kullanır|hazırlayabilme|hazırlar|üretebilme|üretir|yönetebilme|yönetir|tasarlayabilme|tasarlar|seçebilme|seçer|sorgulayabilme|sorgular|çözümleyebilme|çözümler|[a-zçğıöşü]{3,}(?:ebilme|abilme))$/i,
      ""
    )
    .replace(
      /\s+(?:yöntemlerini|uygulamalarını|ilkelerini|kurallarını|yönetimini|süreçlerini|işlemlerini|tekniklerini|özelliklerini|esaslarını|aşamalarını|unsurlarını|çeşitlerini|tiplerini)$/i,
      ""
    )
    .replace(/tarımın$/i, "tarım")
    .replace(/tarımı$/i, "tarım")
    .replace(/üretimin$/i, "üretim")
    .replace(/üretimi$/i, "üretim")
    .replace(/yönetimin$/i, "yönetim")
    .replace(/yönetimi$/i, "yönetim")
    .replace(/bakımın$/i, "bakım")
    .replace(/bakımı$/i, "bakım")
    .replace(/ekimin$/i, "ekim")
    .replace(/ekimi$/i, "ekim")
    .replace(/dikimin$/i, "dikim")
    .replace(/dikimi$/i, "dikim")
    .replace(/budamayı$/i, "budama")
    .replace(/sulamayı$/i, "sulama")
    .replace(/gübrelemeyi$/i, "gübreleme")
    .trim();

  if (!stripped || stripped.length < 3) return "";

  const formatted =
    stripped.charAt(0).toLocaleUpperCase("tr-TR") +
    stripped.slice(1).toLocaleLowerCase("tr-TR");

  return sanitizeShortTopicTitle(formatted, "");
}

/**
 * Converts a Turkish outcome sentence like "Onarıcı tarımın ilkelerini açıklar."
 * or "BÜY.1.1. Generatif üretim yapabilme" into its clean Content Framework title
 * ("Onarıcı Tarımın İlkeleri", "Generatif Üretim").
 */
export function deriveTopicHeadingFromOutcome(outcomeHeader: string): string {
  const withoutCode = sanitizeOutcomeOrSubSentence(outcomeHeader)
    .replace(/^[A-ZÇĞİÖŞÜ]{2,8}\.\d+(?:\.\d+)*\.?\s*/, "")
    .replace(/\s+[a-zçğıöşü]\)\s+.*$/i, "")
    .replace(/\.$/, "")
    .trim();

  const cleaned = withoutCode
    .replace(
      /\s+(?:(?:analiz|kontrol|hasat|muhafaza|tespit|ayırt|elde|kayıt|takip)\s+)?(?:yapabilme|yapar|edebilme|eder|açıklayabilme|açıklar|sıralayabilme|sıralar|uygulayabilme|uygular|sınıflandırabilme|sınıflandırır|karşılaştırabilme|karşılaştırır|değerlendirebilme|değerlendirir|kavrayabilme|kavrar|belirleyebilme|belirler|kullanabilme|kullanır|hazırlayabilme|hazırlar|üretebilme|üretir|yönetebilme|yönetir|tasarlayabilme|tasarlar|seçebilme|seçer|sorgulayabilme|sorgular|çözümleyebilme|çözümler|[a-zçğıöşü]{3,}(?:ebilme|abilme))$/i,
      ""
    )
    .replace(/ilkelerini$/i, "İlkeleri")
    .replace(/yönetimini$/i, "Yönetimi")
    .replace(/yöntemlerini$/i, "Yöntemleri")
    .replace(/uygulamalarını$/i, "Uygulamaları")
    .replace(/kurallarını$/i, "Kuralları")
    .replace(/özelliklerini$/i, "Özellikleri")
    .replace(/organlarını$/i, "Organları")
    .replace(/tarımı$/i, "Tarım")
    .replace(/üretimi$/i, "Üretim")
    .trim();

  const titleCased = cleaned
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

  return sanitizeShortTopicTitle(titleCased, "");
}

const TURKISH_SUB_LETTERS = [
  "a",
  "b",
  "c",
  "ç",
  "d",
  "e",
  "f",
  "g",
  "ğ",
  "h",
  "ı",
  "i",
  "j",
  "k",
];

function toTurkishTitleCase(str: string): string {
  return (str || "")
    .trim()
    .split(/\s+/)
    .map((w) => {
      if (/^(ve|ile|veya|de|da|için)$/i.test(w)) {
        return w.toLocaleLowerCase("tr-TR");
      }
      return (
        w.charAt(0).toLocaleUpperCase("tr-TR") +
        w.slice(1).toLocaleLowerCase("tr-TR")
      );
    })
    .join(" ");
}

function toOutcomeSentenceFromTopicTitle(
  code: string,
  sectionTitle: string
): string {
  const lower = sectionTitle.trim().toLocaleLowerCase("tr-TR");
  const formatted =
    lower
      .replace(/ilkeleri$/i, "ilkelerini açıklar.")
      .replace(/yönetimi$/i, "yönetimini açıklar.")
      .replace(/uygulamaları$/i, "uygulamalarını açıklar.")
      .replace(/yöntemleri$/i, "yöntemlerini açıklar.")
      .replace(/organları$/i, "organlarını sıralar.")
      .replace(/özellikleri$/i, "özelliklerini açıklar.") || `${lower} açıklar.`;

  const finalSentence = /[.]$/.test(formatted)
    ? formatted
    : `${formatted} açıklar.`;
  return `${code}. ${
    finalSentence.charAt(0).toLocaleUpperCase("tr-TR") + finalSentence.slice(1)
  }`;
}

function toSubProcessSentenceFromHeading(
  letter: string,
  subHeading: string,
  parentHeader = ""
): string {
  const clean = subHeading
    .replace(/\.{2,}.*$/, "")
    .replace(/\s+\d{1,3}$/, "")
    .replace(/\.$/, "")
    .trim();

  if (/(?:açıklanır|sıralanır|uygulanır|incelenir|belirlenir|tartışılır)$/i.test(clean)) {
    const body =
      clean.charAt(0).toLocaleUpperCase("tr-TR") +
      clean.slice(1).toLocaleLowerCase("tr-TR");
    return `${letter}) ${body}.`;
  }

  const lower = clean.toLocaleLowerCase("tr-TR");
  const body =
    lower.charAt(0).toLocaleUpperCase("tr-TR") + lower.slice(1);
  const verb =
    /(?:sistemleri|tipleri|çeşitleri|türleri|basamakları|organları)$/i.test(
      lower
    ) && /sırala|yönetim|organ/i.test(parentHeader || lower)
      ? "sıralanır."
      : "açıklanır.";

  return `${letter}) ${body} ${verb}`;
}

/**
 * Built-in verified MEB textbook chapter trees for courses where EK-3 Ders Bilgi Formu
 * only writes the unit-level outcome (e.g. "ST.1.1. Onarıcı tarım yöntemlerini açıklayabilme")
 * while the textbook ("SÜRDÜRÜLEBİLİR TARIM 9") provides the exact section & sub-section hierarchy.
 */
const CANONICAL_MEB_TEXTBOOK_OUTCOMES: Record<
  string,
  {
    unitTitle: string;
    icerikCercevesi: string;
    headerLine: string;
    subComponents: Record<string, string>;
    orderedSubKeys: string[];
  }
> = {
  "ST.1.1": {
    unitTitle: "Onarıcı tarım",
    icerikCercevesi: "Onarıcı Tarımın İlkeleri",
    headerLine: "ST.1.1. Onarıcı tarımın ilkelerini açıklar.",
    subComponents: {
      a: "a) Onarıcı tarımın faydaları açıklanır.",
      b: "b) Onarıcı tarımın temel unsurları açıklanır.",
      c: "c) Onarıcı tarımın temel ilkeleri açıklanır.",
      ç: "ç) Onarıcı tarımda toprak sağlığı açıklanır.",
      d: "d) Onarıcı tarımın uygulamasını kısıtlayan faktörler açıklanır.",
      e: "e) Tarımda yeşil dönüşüm açıklanır.",
    },
    orderedSubKeys: ["a", "b", "c", "ç", "d", "e"],
  },
  "ST.1.2": {
    unitTitle: "Onarıcı tarım",
    icerikCercevesi: "Onarıcı Tarım Yönetimi",
    headerLine: "ST.1.2. Onarıcı tarım yönetimini açıklar.",
    subComponents: {
      a: "a) Onarıcı tarım yönetiminin aşamaları açıklanır.",
      b: "b) Örtü bitkileri ve yabancı ot yönetimi açıklanır.",
      c: "c) Özel ürün yetiştirme sistemlerinin tasarlanması açıklanır.",
      ç: "ç) İşlemesiz ve azaltılmış toprak işleme sistemleri sıralanır.",
      d: "d) Onarıcı tarımda hayvan entegrasyonu ve otlatma yönetimi açıklanır.",
      e: "e) Onarıcı tarım uygulamalarının izlenmesi ve değerlendirilmesi açıklanır.",
    },
    orderedSubKeys: ["a", "b", "c", "ç", "d", "e"],
  },
};

export interface MateryalChapterTree {
  unitsByNumber: Record<number, string>;
  sectionsByUnitAndOutcome: Record<
    string,
    {
      unitNo: number;
      outcomeNo: number;
      sectionTitle: string;
      subHeadings: string[];
    }
  >;
}

/**
 * Parses the uploaded "Ders Materyali" (Textbook) Table of Contents and numbered headings
 * (e.g. "1.1. ONARICI TARIMIN İLKELERİ", "1.1.1. Onarıcı Tarımın Faydaları", "1.1.2. Onarıcı Tarımın Temel Unsurları")
 * so that when EK-3 Ders Bilgi Formu or Yıllık Plan only provides high-level outcome codes,
 * we automatically resolve the exact İçerik Çerçevesi and sub-process components (a, b, c, ç, d, e).
 */
export function parseMateryalChapterTree(
  rawDersMateryaliText: string
): MateryalChapterTree {
  const unitsByNumber: Record<number, string> = {};
  const sectionsByUnitAndOutcome: Record<
    string,
    {
      unitNo: number;
      outcomeNo: number;
      sectionTitle: string;
      subHeadings: string[];
    }
  > = {};

  if (!rawDersMateryaliText || rawDersMateryaliText.length < 50) {
    return { unitsByNumber, sectionsByUnitAndOutcome };
  }

  // Scan the first 45,000 chars (covers Table of Contents + Unit introductions) plus heading lines across the book
  const lines = rawDersMateryaliText.split(/\r?\n/);

  const unitRegex =
    /(?:^|\s)(\d{1,2})\s*\.\s*ÖĞRENME\s*BİRİMİ\s*[:|-]?\s*([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s-]{2,50}?)(?=\s*\.{2,}|\s+\d{1,3}\s*$|$)/i;
  const twoLevelRegex =
    /^\s*(\d{1,2})\.(\d{1,2})\.?\s+([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s,()-]{4,70}?)(?:\s*\.{2,}\s*\d*|\s+\d{1,3})?\s*$/;
  const threeLevelRegex =
    /^\s*(\d{1,2})\.(\d{1,2})\.(\d{1,2})\.?\s+([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s,()-]{4,80}?)(?:\s*\.{2,}\s*\d*|\s+\d{1,3})?\s*$/;

  const noiseHeadingRegex =
    /^(?:Görsel|Tablo|Şekil|Grafik|Harita|Etkinlik|Uygulama|Örnek|Soru|Kaynakça|Cevap)/i;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\|/g, " ").replace(/\s+/g, " ").trim();
    if (!line || line.length > 140) continue;

    const uMatch = line.match(unitRegex);
    if (uMatch) {
      const uNo = Number(uMatch[1]);
      const uTitle = toTurkishTitleCase(uMatch[2]);
      if (uNo >= 1 && uNo <= 15 && uTitle.length >= 3 && !unitsByNumber[uNo]) {
        unitsByNumber[uNo] =
          uTitle.charAt(0).toLocaleUpperCase("tr-TR") +
          uTitle.slice(1).toLocaleLowerCase("tr-TR");
      }
    }

    const m3 = line.match(threeLevelRegex);
    if (m3) {
      const uNo = Number(m3[1]);
      const oNo = Number(m3[2]);
      const sNo = Number(m3[3]);
      const title = m3[4]
        .replace(/\.{2,}.*$/, "")
        .replace(/\s+\d{1,3}$/, "")
        .trim();

      if (
        uNo >= 1 &&
        uNo <= 12 &&
        oNo >= 1 &&
        oNo <= 12 &&
        sNo >= 1 &&
        sNo <= 14 &&
        !noiseHeadingRegex.test(title) &&
        !/[.!?]$/.test(title)
      ) {
        const key = `${uNo}.${oNo}`;
        if (!sectionsByUnitAndOutcome[key]) {
          sectionsByUnitAndOutcome[key] = {
            unitNo: uNo,
            outcomeNo: oNo,
            sectionTitle: "",
            subHeadings: [],
          };
        }
        const cleanSub = toTurkishTitleCase(title);
        if (
          cleanSub.length >= 4 &&
          !sectionsByUnitAndOutcome[key].subHeadings.some(
            (existing) =>
              existing.toLocaleLowerCase("tr-TR") ===
              cleanSub.toLocaleLowerCase("tr-TR")
          )
        ) {
          sectionsByUnitAndOutcome[key].subHeadings[sNo - 1] = cleanSub;
        }
      }
      continue;
    }

    const m2 = line.match(twoLevelRegex);
    if (m2) {
      const uNo = Number(m2[1]);
      const oNo = Number(m2[2]);
      const title = m2[3]
        .replace(/\.{2,}.*$/, "")
        .replace(/\s+\d{1,3}$/, "")
        .trim();

      if (
        uNo >= 1 &&
        uNo <= 12 &&
        oNo >= 1 &&
        oNo <= 12 &&
        !noiseHeadingRegex.test(title) &&
        !/[.!?]$/.test(title)
      ) {
        const key = `${uNo}.${oNo}`;
        const cleanSec = toTurkishTitleCase(title);
        if (!sectionsByUnitAndOutcome[key]) {
          sectionsByUnitAndOutcome[key] = {
            unitNo: uNo,
            outcomeNo: oNo,
            sectionTitle: cleanSec,
            subHeadings: [],
          };
        } else if (!sectionsByUnitAndOutcome[key].sectionTitle) {
          sectionsByUnitAndOutcome[key].sectionTitle = cleanSec;
        }
      }
    }
  }

  // Compact sparse subHeadings arrays
  for (const key of Object.keys(sectionsByUnitAndOutcome)) {
    sectionsByUnitAndOutcome[key].subHeadings =
      sectionsByUnitAndOutcome[key].subHeadings.filter(Boolean);
  }

  return { unitsByNumber, sectionsByUnitAndOutcome };
}

/**
 * Checks if a line inside a Ders Bilgi Formu section is a PDF page-break artifact
 * (standalone page number, repeated "DERS BİLGİ FORMU" header, or standalone "(ÖLÇME VE DEĞERLENDİRME)" continuation)
 */
function isDbfSectionPageArtifactOrSubHeader(line: string): boolean {
  const trimmed = line.replace(/\|/g, " ").trim();
  if (!trimmed) return true;
  // Standalone page numbers like "1", "2", "- 2 -", "Sayfa 2", "Sayfa 2/5"
  if (/^(?:[-–]\s*)?\d{1,3}(?:\s*[-–])?$/.test(trimmed)) return true;
  const upper = toTrUpper(trimmed);
  if (/^SAYFA\s*\d{1,3}(?:\s*\/\s*\d{1,3})?$/.test(upper)) return true;
  // Continuation header line right below ÖĞRENME KANITLARI
  if (
    /^\(?\s*ÖLÇME\s*VE\s*DEĞERLENDİRME\s*\)?\s*[:|-]?$/.test(upper) ||
    /^\(?\s*ÖĞRENME\s*KANITLARI\s*\)?\s*[:|-]?$/.test(upper)
  ) {
    return true;
  }
  // Repeated PDF page header like "TARIM ALANI BİTKİSEL ÜRETİM YÖNTEMLERİ 9 DERS BİLGİ FORMU" or "DERS BİLGİ FORMU"
  if (
    /^(?:[A-ZÇĞİÖŞÜ\s()-]+)?DERS\s*BİLGİ\s*FORMU$/.test(upper) &&
    upper.length <= 95
  ) {
    return true;
  }
  return false;
}

/**
 * Strips leading "(Ölçme ve Değerlendirme)", "(ÖLÇME VE DEĞERLENDİRME)", "Ölçme ve Değerlendirme:"
 * or similar redundant heading prefixes from Öğrenme Kanıtları content.
 */
export function cleanOgrenmeKanitlariPrefix(text: string): string {
  if (!text) return "";
  let cleaned = text.trim();
  let prev = "";
  while (cleaned && cleaned !== prev) {
    prev = cleaned;
    cleaned = cleaned
      .replace(/^[\s|*•\-–#\d.)IVXLCDM]+(?=\()/u, "")
      .replace(
        /^\s*\(\s*(?:[öÖ][lL][çÇ][mM][eE]\s*(?:[vV][eE]|[-–])\s*[dD][eE][ğĞ][eE][rR][lL][eE][nN][dD][iıİI][rR][mM][eE](?:\s+[sS][üÜ][rR][eE][cçCÇ][iıİI])?|[öÖ][ğĞ][rR][eE][nN][mM][eE]\s*[kK][aA][nN][iıİI][tT][lL][aA][rR][iıİI](?:\s*\(?\s*[öÖ][lL][çÇ][mM][eE]\s*(?:[vV][eE]|[-–])\s*[dD][eE][ğĞ][eE][rR][lL][eE][nN][dD][iıİI][rR][mM][eE]\s*\)?)?|[dD][eE][ğĞ][eE][rR][lL][eE][nN][dD][iıİI][rR][mM][eE](?:\s+[sS][üÜ][rR][eE][cçCÇ][iıİI])?)\s*\)\s*[:|\-–.]?\s*/u,
        ""
      )
      .replace(
        /^\s*(?:[öÖ][ğĞ][rR][eE][nN][mM][eE]\s*[kK][aA][nN][iıİI][tT][lL][aA][rR][iıİI](?:\s*\(?\s*[öÖ][lL][çÇ][mM][eE]\s*(?:[vV][eE]|[-–])\s*[dD][eE][ğĞ][eE][rR][lL][eE][nN][dD][iıİI][rR][mM][eE]\s*\)?)?|[öÖ][lL][çÇ][mM][eE]\s*(?:[vV][eE]|[-–])\s*[dD][eE][ğĞ][eE][rR][lL][eE][nN][dD][iıİI][rR][mM][eE](?:\s+[sS][üÜ][rR][eE][cçCÇ][iıİI])?|[dD][eE][ğĞ][eE][rR][lL][eE][nN][dD][iıİI][rR][mM][eE]\s+[sS][üÜ][rR][eE][cçCÇ][iıİI])\s*[:|\-–.]?\s*/u,
        ""
      )
      .replace(
        /^\s*\(?\s*(?:ÖLÇME\s+VE\s+DEĞERLEND[İIıi]RME|Ölçme\s+ve\s+Değerlendirme)\s*\)?\s*[:|\-–.]?\s*/i,
        ""
      )
      .trim();
  }
  return cleaned;
}

/**
 * Strips leading "(ÖLÇME VE DEĞERLENDİRME)" or "(Ölçme ve Değerlendirme)" prefix from a line.
 */
function stripLeadingOlcmeHeaderPrefix(line: string): string {
  return cleanOgrenmeKanitlariPrefix(line);
}

/**
 * Extracts a multi-line block between a section start heading and a section stop heading.
 * Uses Turkish-aware uppercase matching (`toTrUpper`) so Turkish `İ/i` and `I/ı` case differences
 * and NFD characters never fail regex matching. Evaluates all candidate occurrences and returns
 * the fullest substantive section so brief table-header mentions never shadow the real section.
 */
/**
 * Strips any trailing section start headings (e.g. "ÖĞRENMEÖĞRETME YAŞANTILARI", "TEMEL KABULLER", etc.)
 * that may have leaked into the end of an extracted section due to PDF line merging or boundary proximity.
 */
export function cleanTrailingSectionHeadings(text: string): string {
  if (!text) return "";
  return text
    .replace(
      /\s*(?:(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRENMEÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME|ÖĞRETMEÖĞRENME)\s*(?:YAŞANT[Iİ]LAR[Iİ]|UYGULAMALAR[Iİ]|SÜREC[İI]|ETK[İI]NL[İI]KLER[İI])|ÖĞRETME\s*UYGULAMALAR[Iİ]|ÖĞRENME\s*UYGULAMALAR[Iİ]|TEMEL\s*KABULLER|ÖN\s*DEĞERLEND[İI]RME(?:\s*SÜREC[İI])?|KÖPRÜ\s*KURMA|FARKLILAŞTIRMA|ZENG[İI]NLEŞT[İI]RME|DESTEKLEME)\s*[:|\-–]?\s*$/i,
      ""
    )
    .replace(
      /\s+(?:ÖĞRENME|Öğrenme|ÖĞRETME|Öğretme|TEMEL|Temel|ÖN|Ön|KÖPRÜ|Köprü|FARKLILAŞTIRMA|Farklılaştırma)\s*[-–]?\s*$/i,
      ""
    )
    .trim();
}

/**
 * Extracts a multi-line block between a section start heading and a section stop heading.
 * Uses Turkish-aware uppercase matching (`toTrUpper`) so Turkish `İ/i` and `I/ı` case differences
 * and NFD characters never fail regex matching. Evaluates all candidate occurrences and returns
 * the fullest substantive section so brief table-header mentions never shadow the real section.
 */
function extractSectionBetweenHeadings(
  lines: string[],
  startLineRegex: RegExp,
  stopLineRegex: RegExp,
  maxLines = 140,
  maxChars = 6000
): string {
  // Build an inline version of stopLineRegex (without leading ^) so mid-line stop headings are also caught
  const inlineStopSource = stopLineRegex.source.replace(/^\^/, "(?:^|\\s|\\|)");
  const inlineStopRegex = new RegExp(inlineStopSource, stopLineRegex.flags);

  // Also allow startLineRegex after leading numbers (e.g. "4.", "IV."), bullets, markdown symbols, or table pipes
  const flexibleStartSource = startLineRegex.source.replace(
    /^\^/,
    "^(?:[\\s|*•\\-–#]+|\\d{1,2}(?:\\.\\d{1,2})*[.)\\-–\\s]+|[IVXLCDM]+[.)\\-–\\s]+|(?:BÖLÜM|MADDE)\\s*\\d{1,2}[:.)\\s-]*)*"
  );
  const flexibleStartRegex = new RegExp(
    flexibleStartSource,
    startLineRegex.flags
  );

  let bestCandidate = "";

  for (let i = 0; i < lines.length; i++) {
    const rawLine = normalizeTurkishUnicode(lines[i]);
    const upperLine = toTrUpper(rawLine);
    const startMatch = upperLine.match(flexibleStartRegex);
    if (startMatch) {
      const collected: string[] = [];
      const matchEndIdx = (startMatch.index || 0) + startMatch[0].length;
      let remainder = stripLeadingOlcmeHeaderPrefix(
        rawLine.slice(matchEndIdx)
      )
        .replace(/^[:|\-–\s]+/, "")
        .trim();

      if (remainder && !isDbfSectionPageArtifactOrSubHeader(remainder)) {
        const upperRem = toTrUpper(remainder);
        const inlineStopInRem = upperRem.match(inlineStopRegex);
        if (inlineStopInRem && inlineStopInRem.index !== undefined) {
          const beforeStop = remainder.slice(0, inlineStopInRem.index).trim();
          if (beforeStop && !isDbfSectionPageArtifactOrSubHeader(beforeStop)) {
            collected.push(beforeStop);
          }
          const paragraph = cleanTrailingSectionHeadings(
            joinWrappedPdfLinesToParagraphs(collected)
          );
          if (paragraph.length > bestCandidate.length && paragraph.length >= 20) {
            bestCandidate = paragraph.slice(0, maxChars);
          }
          continue;
        }
        collected.push(remainder);
      }

      for (let j = i + 1; j < Math.min(lines.length, i + maxLines); j++) {
        const nextLine = normalizeTurkishUnicode(lines[j]).trim();
        if (!nextLine) continue;
        if (isDbfSectionPageArtifactOrSubHeader(nextLine)) {
          continue;
        }

        const cleanedNext = stripLeadingOlcmeHeaderPrefix(nextLine);
        if (!cleanedNext) continue;
        const upperNext = toTrUpper(cleanedNext);

        if (stopLineRegex.test(upperNext)) {
          break;
        }
        const inlineStopMatch = upperNext.match(inlineStopRegex);
        if (inlineStopMatch && inlineStopMatch.index !== undefined) {
          const beforeStop = cleanedNext
            .slice(0, inlineStopMatch.index)
            .trim();
          if (beforeStop && !isDbfSectionPageArtifactOrSubHeader(beforeStop)) {
            collected.push(beforeStop);
          }
          break;
        }
        collected.push(cleanedNext);
        if (collected.join(" ").length >= maxChars) {
          break;
        }
      }

      const paragraph = cleanTrailingSectionHeadings(
        joinWrappedPdfLinesToParagraphs(collected)
      );
      if (paragraph.length >= 20 && paragraph.length > bestCandidate.length) {
        bestCandidate = paragraph.slice(0, maxChars);
      }
    }
  }
  return cleanTrailingSectionHeadings(bestCandidate);
}

/**
 * Dedicated, high-precision extractor for "ÖĞRENME KANITLARI (ÖLÇME VE DEĞERLENDİRME)" from Ders Bilgi Formu.
 * Handles all MEB heading formats (single-line, numbered like "4. ÖLÇME VE DEĞERLENDİRME", two-line split heading,
 * inline heading, parenthesized or reversed heading), filters out PDF page numbers / repeated headers across page breaks,
 * stops strictly before "ÖĞRENMEÖĞRETME YAŞANTILARI" or other sections, and preserves full multi-paragraph content.
 */
function extractOgrenmeKanitlariFromDbf(
  dbfLines: string[],
  fallbackCombinedLines: string[]
): string {
  const startRegex =
    /^(?:[\\s|*•\\-–#]+|\\d{1,2}(?:\\.\\d{1,2})*[.)\\-–\\s]+|[IVXLCDM]+[.)\\-–\\s]+|(?:BÖLÜM|MADDE)\\s*\\d{1,2}[:.)\\s-]*)*(?:ÖĞRENME\s*KAN[Iİ]TLAR[Iİ](?:\s*\(?\s*ÖLÇME\s*VE\s*DEĞERLEND[İI]RME(?:\s*SÜREC[İI])?\s*\)?)?|ÖLÇME\s*VE\s*DEĞERLEND[İI]RME(?:\s*\(?\s*ÖĞRENME\s*KAN[Iİ]TLAR[Iİ]\s*\)?)?|ÖLÇME\s*[-–]\s*DEĞERLEND[İI]RME|ÖĞRENME\s*KAN[Iİ]TLAR[Iİ]\s*[/&,]\s*ÖLÇME\s*VE\s*DEĞERLEND[İI]RME|ÖĞRENME\s*KAN[Iİ]TLAR[Iİ]\s*VE\s*ÖLÇME\s*DEĞERLEND[İI]RME|DEĞERLEND[İI]RME\s*SÜREC[İI]|ÖLÇME\s*VE\s*DEĞERLEND[İI]RME\s*UYGULAMALAR[Iİ])(?=$|\s|[:|()\-–])/i;

  const stopRegex =
    /^(?:[\\s|*•\\-–#]+|\\d{1,2}(?:\\.\\d{1,2})*[.)\\-–\\s]+|[IVXLCDM]+[.)\\-–\\s]+)*(?:(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRENMEÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME|ÖĞRETMEÖĞRENME)\s*(?:YAŞANT[Iİ]LAR[Iİ]|UYGULAMALAR[Iİ]|SÜREC[İI]|ETK[İI]NL[İI]KLER[İI])|ÖĞRETME\s*UYGULAMALAR[Iİ]|ÖĞRENME\s*UYGULAMALAR[Iİ]|TEMEL\s*KABULLER|ÖN\s*DEĞERLEND[İI]RME(?:\s*SÜREC[İI])?|KÖPRÜ\s*KURMA|FARKLILAŞTIRMA|ZENG[İI]NLEŞT[İI]RME|DESTEKLEME|UYGUNDUR)(?=$|\s|[:|()\-–])/i;

  // 1. Strictly search Ders Bilgi Formu lines first when available
  if (dbfLines.length > 0) {
    const fromDbf = extractSectionBetweenHeadings(
      dbfLines,
      startRegex,
      stopRegex,
      220,
      8000
    );
    if (fromDbf.length >= 25) {
      return cleanOgrenmeKanitlariPrefix(cleanTrailingSectionHeadings(fromDbf));
    }

    // Secondary scan with broader start heading inside dbfLines
    const fromDbfAltHeading = extractSectionBetweenHeadings(
      dbfLines,
      /^(?:[\\s|*•\\-–#]+|\\d{1,2}(?:\\.\\d{1,2})*[.)\\-–\\s]+|[IVXLCDM]+[.)\\-–\\s]+)*(?:ÖLÇME\s*VE\s*DEĞERLEND[İI]RME|ÖĞRENME\s*KAN[Iİ]TI|DEĞERLEND[İI]RME)(?=$|\s|[:|(-])/i,
      stopRegex,
      220,
      8000
    );
    if (fromDbfAltHeading.length >= 25) {
      return cleanOgrenmeKanitlariPrefix(cleanTrailingSectionHeadings(fromDbfAltHeading));
    }

    // Raw block regex scan on joined dbfLines in case heading was embedded mid-line or across table boundaries
    const rawDbfJoined = normalizeTurkishUnicode(dbfLines.join("\n"));
    const upperJoined = toTrUpper(rawDbfJoined);
    const blockMatch = upperJoined.match(
      /(?:^|\n)\s*(?:[#|*•\-–]+\s*|\d{1,2}(?:\.\d{1,2})*[.)\s-]*|[IVXLCDM]+[.)\s-]*)?(?:ÖĞRENME\s*KAN[Iİ]TLAR[Iİ](?:\s*\(?\s*ÖLÇME\s*VE\s*DEĞERLEND[İI]RME(?:\s*SÜREC[İI])?\s*\)?)?|ÖLÇME\s*VE\s*DEĞERLEND[İI]RME(?:\s*\(?\s*ÖĞRENME\s*KAN[Iİ]TLAR[Iİ]\s*\)?)?|ÖLÇME\s*[-–]\s*DEĞERLEND[İI]RME|DEĞERLEND[İI]RME\s*SÜREC[İI])\s*[:|\-–]?\s*([\s\S]{20,8000}?)(?=(?:\n\s*(?:[#|*•\-–]+\s*|\d{1,2}(?:\.\d{1,2})*[.)\s-]*|[IVXLCDM]+[.)\s-]*)?(?:(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRENMEÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME|ÖĞRETMEÖĞRENME)\s*(?:YAŞANT[Iİ]LAR[Iİ]|UYGULAMALAR[Iİ]|SÜREC[İI])|ÖĞRETME\s*UYGULAMALAR[Iİ]|ÖĞRENME\s*UYGULAMALAR[Iİ]|TEMEL\s*KABULLER|ÖN\s*DEĞERLEND[İI]RME|KÖPRÜ\s*KURMA|FARKLILAŞTIRMA|ZENG[İI]NLEŞT[İI]RME|UYGUNDUR))|$)/i
    );
    if (blockMatch && blockMatch.index !== undefined) {
      const fullMatchStart = blockMatch.index;
      const fullMatchText = rawDbfJoined.slice(
        fullMatchStart,
        fullMatchStart + blockMatch[0].length
      );
      const bodyOnly = fullMatchText
        .replace(
          /^[\s\S]*?(?:ÖLÇME\s*VE\s*DEĞERLEND[İI]RME\s*\)|ÖĞRENME\s*KAN[Iİ]TLAR[Iİ]|ÖLÇME\s*VE\s*DEĞERLEND[İI]RME|DEĞERLEND[İI]RME\s*SÜREC[İI])\s*[:|\-–]?\s*/i,
          ""
        )
        .trim();
      const rawBodyLines = bodyOnly
        .split(/\r?\n/)
        .map((l) => stripLeadingOlcmeHeaderPrefix(l.trim()))
        .filter((l) => l && !isDbfSectionPageArtifactOrSubHeader(l));
      const formatted = cleanOgrenmeKanitlariPrefix(
        cleanTrailingSectionHeadings(
          joinWrappedPdfLinesToParagraphs(rawBodyLines)
        )
      );
      if (formatted.length >= 25) {
        return formatted;
      }
    }
  }

  // 2. Only if dbfLines was empty, check fallbackCombinedLines
  const fallbackResult = extractSectionBetweenHeadings(
    fallbackCombinedLines,
    startRegex,
    stopRegex,
    220,
    8000
  );
  return cleanOgrenmeKanitlariPrefix(cleanTrailingSectionHeadings(fallbackResult));
}

function joinWrappedPdfLinesToParagraphs(lines: string[]): string {
  if (lines.length === 0) return "";
  const paragraphs: string[] = [];
  let current = "";

  for (const rawLine of lines) {
    if (isDbfSectionPageArtifactOrSubHeader(rawLine)) continue;
    const line = stripLeadingOlcmeHeaderPrefix(
      normalizeTurkishUnicode(rawLine).replace(/\|/g, " ")
    )
      .replace(/^Süreci\s*[:|-]?\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!line || isDbfSectionPageArtifactOrSubHeader(line)) continue;

    if (!current) {
      current = line;
      continue;
    }

    const upperLine = toTrUpper(line);
    const isBulletLine = /^(?:[*•\-–▪➢]|\d{1,2}[.)])\s+/.test(line);
    const isParagraphStarterAfterDot =
      /[.!?]$/.test(current) &&
      (/^(?:AYRICA|ÖRNEĞİN|BUNUN\s+YANINDA|BUNUNLA\s+BİRLİKTE|DİĞER\s+TARAFTAN|BU\s+SÜREÇTE|BU\s+KAPSAMDA|BU\s+BAĞLAMDA|ÖĞRETİM\s+SÜRECİNDE|DEĞERLENDİRME\s+SÜRECİNDE|PERFORMANS\s+GÖREV|ÖĞRENCİ\s+PERFORMANSINI|ÖĞRENCİLERİN\s+PERFORMANS)(?=$|\s|[,:])/.test(
        upperLine
      ) ||
        (current.length >= 110 &&
          line.length >= 85 &&
          /[.!?]$/.test(line) &&
          /^[A-ZÇĞİÖŞÜ]/.test(line)));

    if (isBulletLine || isParagraphStarterAfterDot) {
      paragraphs.push(current);
      current = line;
    } else {
      current = `${current} ${line}`;
    }
  }

  if (current) {
    paragraphs.push(current);
  }

  return cleanTrailingSectionHeadings(paragraphs.join("\n"));
}

/**
 * Normalizes Maarif code lists at the end of Öğretme-Öğrenme Uygulamaları blocks:
 * 1. Restores missing opening parenthesis `(` when a PDF has `istenir KB2.11, E2.2, ... OB1).`
 * 2. Ensures parenthesized code lists `(E1.4, E2.2, ..., D18.3)` have a trailing period `).`
 * 3. Attaches standalone `. (E1.4, E2.2, ...).` to the preceding sentence so codes are never separated or lost.
 */
export function normalizeMaarifCodeListsInText(rawText: string): string {
  if (!rawText) return "";
  return normalizeTurkishUnicode(rawText)
    // 1. Restore missing opening parenthesis ONLY after a Turkish lowercase word (e.g. "istenir KB2.11, ... OB1)") — never inside existing parentheses like "(E1.4, E2.2, ...)"
    .replace(
      /([a-zçğıöşü]{2,})\s+((?:(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*\s*[,;]\s*)+(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*\s*\))/g,
      "$1 ($2"
    )
    // 2. Ensure a closing period after a parenthesized Maarif code list at the end of a sentence
    .replace(
      /(\((?:(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*(?:\s*[,;]\s*|\s+)){1,}(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*\))(?!\.)(?=\s+[A-ZÇĞİÖŞÜ*•]|\s*$)/g,
      "$1."
    )
    // 3. If there is a period right before the parenthesized Maarif code list, attach the code list to the sentence before the period
    .replace(
      /\.\s*(\((?:(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*(?:\s*[,;]\s*|\s+)){1,}(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*\)\.)/g,
      " $1"
    );
}

/**
 * Splits a block of "Öğretme-Öğrenme Uygulamaları" from Ders Bilgi Formu into the exact
 * asterisk bullet items shown in the official MEB plans while preserving all trailing
 * parenthesized Maarif component codes (e.g., `(E1.4, E2.2, E2.3, SDB2.2, SDB3.3, KB3.2, D3.2, D12.3, D16.3, D18.3).`).
 */
export function splitOgretmeUygulamalariIntoBullets(
  rawBlock: string,
  unitTitle?: string
): string[] {
  const joined = normalizeMaarifCodeListsInText(
    rawBlock
      .split(/\r?\n/)
      .filter((l) => !isDbfSectionPageArtifactOrSubHeader(l))
      .map((l) => l.replace(/^\*\s*/, "").trim())
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
  );

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
      /(?<=\)\.)\s+|(?<!\b(?:vb|örn|bkz|Dr|Prof|No|[A-ZÇĞİÖŞÜ]{1,4}\.\d+)\.)(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ])/g
    )
    .map((s) => s.trim())
    .filter((s) => s.length >= 8);

  for (const part of sentenceParts) {
    // If a part is ONLY a parenthesized code list, merge it onto the end of the previous bullet so codes are never isolated or dropped
    if (
      /^\((?:(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*(?:\s*[,;]\s*|\s+)){1,}(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*\)\.?$/.test(
        part
      ) &&
      bullets.length > 0
    ) {
      const prev = bullets[bullets.length - 1].replace(/\.$/, "");
      bullets[bullets.length - 1] = `${prev} ${
        part.endsWith(".") ? part : `${part}.`
      }`;
    } else {
      bullets.push(part);
    }
  }

  return bullets;
}

/**
 * Full structured parser for MEB Türkiye Yüzyılı Maarif Modeli "Ders Bilgi Formu", "Yıllık Plan", and "Ders Materyali"
 */
export function parseDersBilgiFormuStructured(
  dersBilgiFormuText: string,
  yillikPlanText = "",
  dersMateryaliText = ""
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

  // Extract metadata prioritizing Yıllık Plan and active Ders Bilgi Formu
  const meta = extractCleanDocumentMetadata(
    `${cleanYillik}\n${cleanDbf}\n${(dersMateryaliText || "").slice(0, 4000)}`
  );

  // Parse textbook chapter/sub-chapter tree from Ders Materyali (if provided)
  const materyalTree = parseMateryalChapterTree(dersMateryaliText || "");

  // 1. Canonical Maarif Component Codes (E, SDB, D, OB, KB) — course-agnostic defaults only
  const egilimler = extractCanonicalMaarifCodes(
    combined,
    "E",
    "E1.4. Kendine İnanma (Öz Yeterlilik), E2.2. Sorumluluk"
  );
  const sosyalDuygusalBeceriler = extractCanonicalMaarifCodes(
    combined,
    "SDB",
    "SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme"
  );
  const degerler = extractCanonicalMaarifCodes(
    combined,
    "D",
    "D3. Çalışkanlık, D16. Sorumluluk"
  );
  const okuryazarlikBecerileri = extractCanonicalMaarifCodes(
    combined,
    "OB",
    "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık"
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
      /([A-ZÇĞİÖŞÜ][a-zçğıöşü]+\s+[a-zçğıöşü\s]{3,45}?\s+(?:yöntemlerini|tekniklerini|işlemlerini|süreçlerini)\s+(?:uygulama|açıklayabilme))/
    );
    if (uygulamaSkillMatch) {
      alanBecerileri = uygulamaSkillMatch[1]
        .replace(/açıklayabilme$/i, "uygulama")
        .trim();
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
      foundDisciplines.slice(0, 4).join(", ") || "Türkçe, Matematik";
  }

  // 4. Parse All Learning Outcomes (ST.1.1, ST.1.2, BÜY.1.1, etc.) and Sub-Process Components (a, b, c, ç, d, e)
  const outcomesMap: Record<string, ParsedOutcomeEntry> = {};
  const unitsByNumber: Record<number, string> = {};

  const outcomeLineRegex =
    /(?:^|\s|\|)([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?\.?(?:\s+([A-ZÇĞİÖŞÜa-zçğıöşü].*))?$/;
  const subCompStartRegex =
    /^(?:\*|\-|\•)?\s*(?:[A-ZÇĞİÖŞÜ]{2,8}\.\d{1,2}\.\d{1,2}\.|\d{1,2}\.\d{1,2}\.)?([a-zçğıöşü])\s*(?:[)]|\.(?=\s+[A-ZÇĞİÖŞÜ]))\s*(.*)$/;
  const inlineSubRegex =
    /(?:^|\s|\|)(?:[A-ZÇĞİÖŞÜ]{2,8}\.\d{1,2}\.\d{1,2}\.|\d{1,2}\.\d{1,2}\.)?([a-zçğıöşü])(?:[)]|\.(?=\s+[A-ZÇĞİÖŞÜ]))\s*([^|]+?)(?=(?:\s+(?:[A-ZÇĞİÖŞÜ]{2,8}\.\d{1,2}\.\d{1,2}\.|\d{1,2}\.\d{1,2}\.)?[a-zçğıöşü](?:[)]|\.(?=\s+[A-ZÇĞİÖŞÜ]))\s|\s*\||$))/g;
  const stopContinuationRegex =
    /^(?:\d{1,2}\s*\.\s*HAFTA|HAFTA\s*\d{1,2}|İÇERİK\s*ÇERÇEVESİ|ÖĞRENME\s*KANITLARI|ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME|ÖLÇME\s*VE\s*DEĞERLENDİRME|TEMEL\s*KABULLER|ÖN\s*DEĞERLENDİRME|KÖPRÜ\s*KURMA|FARKLILAŞTIRMA|Öğrenme\s*Birimi|ÜNİTE|TEMA|(?:E|SDB|D|OB|KB)\d{1,2}\.\d*)(?=$|\s|[:|-])/i;

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

        let fullRest = sanitizeOutcomeOrSubSentence(outcomeMatch[5] || "");

        // Join up to 2 continuation lines if fullRest was cut mid-phrase
        let lookahead = i + 1;
        while (
          lookahead < combinedLines.length &&
          lookahead <= i + 2 &&
          fullRest.length < 85 &&
          (!fullRest ||
            (!/(?:[.!?:]|açıklayabilme|açıklar|sıralayabilme|sıralar|uygulayabilme|uygular|sınıflandırabilme|karşılaştırabilme|değerlendirebilme|yapabilme|yapar)$/i.test(
              fullRest.replace(/\s+[a-zçğıöşü][).]\s+.*$/i, "").trim()
            ) &&
              !/\s+[a-zçğıöşü][).]\s+/i.test(fullRest)))
        ) {
          const nextLine = sanitizeOutcomeOrSubSentence(
            combinedLines[lookahead]
          );
          if (
            !nextLine ||
            nextLine.length > 100 ||
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

        const cleanMainSentence = sanitizeOutcomeOrSubSentence(
          fullRest.replace(
            /(?:^|\s)(?:[A-ZÇĞİÖŞÜ]{2,8}\.\d{1,2}\.\d{1,2}\.|\d{1,2}\.\d{1,2}\.)?[a-zçğıöşü](?:[)]|\.(?=\s+[A-ZÇĞİÖŞÜ]))\s+.*$/,
            ""
          )
        );

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
          cleanMainSentence.length >= 8 &&
          cleanMainSentence.length <= 120 &&
          outcomesMap[code].headerLine.length <= code.length + 5
        ) {
          outcomesMap[code].headerLine = headerLine;
          outcomesMap[code].derivedTopicHeading =
            deriveTopicHeadingFromOutcome(headerLine);
        }

        // Derive the unit name directly from the outcome sentence when unitNumber is first seen
        if (!unitsByNumber[unitNumber] && cleanMainSentence.length >= 4) {
          const derivedUnit = deriveUnitNameFromOutcome(headerLine);
          if (derivedUnit) {
            unitsByNumber[unitNumber] = derivedUnit;
          }
        }

        // Extract any inline sub-components ("a) ... b) ...") from fullRest (including joined continuation lines)
        let inlineMatch: RegExpExecArray | null;
        inlineSubRegex.lastIndex = 0;
        while ((inlineMatch = inlineSubRegex.exec(fullRest)) !== null) {
          const letter = inlineMatch[1].toLocaleLowerCase("tr-TR");
          const subText = sanitizeOutcomeOrSubSentence(inlineMatch[2]);
          if (subText.length >= 4 && subText.length <= 180) {
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
      let subText = sanitizeOutcomeOrSubSentence(subMatch[2] || "");

      let lookahead = i + 1;
      while (
        lookahead < combinedLines.length &&
        lookahead <= i + 2 &&
        subText.length < 110 &&
        (!subText || !/[.!?]$/.test(subText))
      ) {
        const nextLine = sanitizeOutcomeOrSubSentence(combinedLines[lookahead]);
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

      if (/\s+[a-zçğıöşü](?:[)]|\.(?=\s+[A-ZÇĞİÖŞÜ]))\s+/i.test(subText)) {
        const packedLine = `${letter}) ${subText}`;
        let pm: RegExpExecArray | null;
        inlineSubRegex.lastIndex = 0;
        while ((pm = inlineSubRegex.exec(packedLine)) !== null) {
          const pLetter = pm[1].toLocaleLowerCase("tr-TR");
          const pText = sanitizeOutcomeOrSubSentence(pm[2]);
          if (pText.length >= 4 && pText.length <= 180) {
            const formattedPacked = `${pLetter}) ${pText}`;
            const entry = outcomesMap[currentOutcomeCode];
            const existing = entry.subComponents[pLetter];
            if (!existing || formattedPacked.length > existing.length) {
              if (!existing) entry.orderedSubKeys.push(pLetter);
              entry.subComponents[pLetter] = formattedPacked;
            }
          }
        }
      } else if (subText.length >= 4 && subText.length <= 180) {
        const formattedSub = `${letter}) ${subText}`;
        const entry = outcomesMap[currentOutcomeCode];
        const existing = entry.subComponents[letter];
        if (!existing || formattedSub.length > existing.length) {
          if (!existing) entry.orderedSubKeys.push(letter);
          entry.subComponents[letter] = formattedSub;
        }
      }
      continue;
    }

    // Also scan mid-line sub-components (e.g. table rows with pipes "2. HAFTA | c) ... | ç) ...")
    if (currentOutcomeCode && outcomesMap[currentOutcomeCode]) {
      let midMatch: RegExpExecArray | null;
      inlineSubRegex.lastIndex = 0;
      while ((midMatch = inlineSubRegex.exec(line)) !== null) {
        const letter = midMatch[1].toLocaleLowerCase("tr-TR");
        const subText = sanitizeOutcomeOrSubSentence(midMatch[2]);
        if (subText.length >= 5 && subText.length <= 180) {
          const formattedMid = `${letter}) ${subText}`;
          const entry = outcomesMap[currentOutcomeCode];
          const existing = entry.subComponents[letter];
          if (!existing || formattedMid.length > existing.length) {
            if (!existing) entry.orderedSubKeys.push(letter);
            entry.subComponents[letter] = formattedMid;
          }
        }
      }
    }
  }

  // Verify whether materyalTree belongs to the SAME course as the active outcomesMap / Yıllık Plan
  let isMateryalCompatible = true;
  if (
    Object.keys(unitsByNumber).length > 0 &&
    Object.keys(materyalTree.unitsByNumber).length > 0
  ) {
    const activeUnit1 = (unitsByNumber[1] || "").toLocaleLowerCase("tr-TR");
    const matUnit1 = (materyalTree.unitsByNumber[1] || "").toLocaleLowerCase(
      "tr-TR"
    );
    if (activeUnit1 && matUnit1) {
      const activeWords = activeUnit1
        .split(/\s+/)
        .filter((w) => w.length >= 3);
      const hasOverlap = activeWords.some((w) =>
        matUnit1.includes(w.slice(0, 4))
      );
      if (!hasOverlap) {
        isMateryalCompatible = false;
      }
    }
  }

  if (isMateryalCompatible) {
    for (const [uNoStr, uName] of Object.entries(materyalTree.unitsByNumber)) {
      const uNo = Number(uNoStr);
      if (!unitsByNumber[uNo] && uName) {
        unitsByNumber[uNo] = uName;
      }
    }
  }

  // Enrich outcomesMap from Ders Materyali chapter tree (1.1, 1.1.1..1.1.6, 1.2, 1.2.1..1.2.4)
  // Guard canonical Sürdürülebilir Tarım fallback so it NEVER applies to any other course!
  const isSurdurulebilirTarimCourse = /SÜRDÜRÜLEBİLİR\s*TARIM/i.test(
    `${meta.dersIsmi || ""} ${combined.slice(0, 1200)}`
  );
  for (const [code, entry] of Object.entries(outcomesMap)) {
    const uoKey = `${entry.unitNumber}.${entry.outcomeNumber}`;
    const matSec = isMateryalCompatible
      ? materyalTree.sectionsByUnitAndOutcome[uoKey]
      : undefined;
    const canonical = isSurdurulebilirTarimCourse
      ? CANONICAL_MEB_TEXTBOOK_OUTCOMES[code]
      : undefined;

    if (matSec) {
      if (matSec.sectionTitle && matSec.sectionTitle.length >= 4) {
        entry.derivedTopicHeading = matSec.sectionTitle;
        if (/ebilme|abilme/i.test(entry.headerLine)) {
          entry.headerLine = toOutcomeSentenceFromTopicTitle(
            code,
            matSec.sectionTitle
          );
        }
      }
      if (entry.orderedSubKeys.length === 0 && matSec.subHeadings.length > 0) {
        matSec.subHeadings.forEach((subHeading, idx) => {
          const letter = TURKISH_SUB_LETTERS[idx];
          if (letter) {
            entry.orderedSubKeys.push(letter);
            entry.subComponents[letter] = toSubProcessSentenceFromHeading(
              letter,
              subHeading,
              entry.headerLine
            );
          }
        });
      }
    }

    if (canonical) {
      if (!unitsByNumber[entry.unitNumber]) {
        unitsByNumber[entry.unitNumber] = canonical.unitTitle;
      }
      if (
        !matSec?.sectionTitle &&
        (/ebilme|abilme/i.test(entry.headerLine) ||
          entry.derivedTopicHeading.length > 40)
      ) {
        entry.headerLine = canonical.headerLine;
        entry.derivedTopicHeading = canonical.icerikCercevesi;
      }
      if (entry.orderedSubKeys.length === 0) {
        entry.orderedSubKeys = [...canonical.orderedSubKeys];
        entry.subComponents = { ...canonical.subComponents };
      }
    }
  }

  let rawOutcomesCatalogText = Object.values(outcomesMap)
    .map((entry) => {
      const subs = entry.orderedSubKeys
        .map((k) => entry.subComponents[k])
        .filter(Boolean);
      return [entry.headerLine, ...subs].join("\n");
    })
    .join("\n\n");

  // 5. Extract Öğrenme Kanıtları (Full verbatim multi-paragraph block strictly from Ders Bilgi Formu)
  const ogrenmeKanitlari = extractOgrenmeKanitlariFromDbf(
    dbfLines,
    combinedLines
  );

  // 6. Extract Temel Kabuller, Ön Değerlendirme Süreci, Köprü Kurma (Full verbatim paragraphs strictly from Ders Bilgi Formu)
  const sourceLinesForDbfSections =
    dbfLines.length > 0 ? dbfLines : combinedLines;

  let temelKabuller = extractSectionBetweenHeadings(
    sourceLinesForDbfSections,
    /^(?:(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME)\s*YAŞANTILARI\s*[:|\-–]?\s*)?(?:TEMEL\s*KABULLER)(?=$|\s|[:|-])/i,
    /^(?:ÖN\s*DEĞERLENDİRME(?:\s*SÜRECİ)?|KÖPRÜ\s*KURMA|(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME)\s*(?:UYGULAMALARI|YAŞANTILARI)|ÖĞRETME\s*UYGULAMALARI|FARKLILAŞTIRMA)(?=$|\s|[:|-])/i,
    80,
    3000
  );
  if (!temelKabuller && dbfLines.length > 0) {
    const joinedDbf = normalizeTurkishUnicode(dbfLines.join("\n"));
    const upperDbf = toTrUpper(joinedDbf);
    const tkMatch = upperDbf.match(
      /TEMEL\s*KABULLER\s*[:|\-–]?\s*([\s\S]{20,2500}?)(?=ÖN\s*DEĞERLENDİRME|KÖPRÜ\s*KURMA|(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME)\s*UYGULAMALARI|FARKLILAŞTIRMA|$)/
    );
    if (tkMatch && tkMatch.index !== undefined) {
      const slice = joinedDbf
        .slice(tkMatch.index, tkMatch.index + tkMatch[0].length)
        .replace(/^[\s\S]*?TEMEL\s*KABULLER\s*[:|\-–]?\s*/i, "");
      temelKabuller = joinWrappedPdfLinesToParagraphs(slice.split(/\r?\n/));
    }
  }

  let onDegerlendirmeSureci = extractSectionBetweenHeadings(
    sourceLinesForDbfSections,
    /^(?:ÖN\s*DEĞERLENDİRME(?:\s*SÜRECİ)?)(?=$|\s|[:|-])/i,
    /^(?:KÖPRÜ\s*KURMA|(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME)\s*(?:UYGULAMALARI|YAŞANTILARI)|ÖĞRETME\s*UYGULAMALARI|FARKLILAŞTIRMA)(?=$|\s|[:|-])/i,
    80,
    3000
  );
  if (!onDegerlendirmeSureci && dbfLines.length > 0) {
    const joinedDbf = normalizeTurkishUnicode(dbfLines.join("\n"));
    const upperDbf = toTrUpper(joinedDbf);
    const odMatch = upperDbf.match(
      /ÖN\s*DEĞERLENDİRME(?:\s*SÜRECİ)?\s*[:|\-–]?\s*([\s\S]{20,2500}?)(?=KÖPRÜ\s*KURMA|(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME)\s*UYGULAMALARI|FARKLILAŞTIRMA|$)/
    );
    if (odMatch && odMatch.index !== undefined) {
      const slice = joinedDbf
        .slice(odMatch.index, odMatch.index + odMatch[0].length)
        .replace(
          /^[\s\S]*?ÖN\s*DEĞERLENDİRME(?:\s*SÜRECİ)?\s*[:|\-–]?\s*/i,
          ""
        );
      onDegerlendirmeSureci = joinWrappedPdfLinesToParagraphs(
        slice.split(/\r?\n/)
      );
    }
  }

  let kopruKurma = extractSectionBetweenHeadings(
    sourceLinesForDbfSections,
    /^(?:KÖPRÜ\s*KURMA)(?=$|\s|[:|-])/i,
    /^(?:(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME)\s*(?:UYGULAMALARI|YAŞANTILARI)|ÖĞRETME\s*UYGULAMALARI|ÖĞRENME\s*UYGULAMALARI|FARKLILAŞTIRMA)(?=$|\s|[:|-])/i,
    80,
    3000
  );
  if (!kopruKurma && dbfLines.length > 0) {
    const joinedDbf = normalizeTurkishUnicode(dbfLines.join("\n"));
    const upperDbf = toTrUpper(joinedDbf);
    const kkMatch = upperDbf.match(
      /KÖPRÜ\s*KURMA\s*[:|\-–]?\s*([\s\S]{20,2500}?)(?=(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME)\s*UYGULAMALARI|ÖĞRETME\s*UYGULAMALARI|FARKLILAŞTIRMA|$)/
    );
    if (kkMatch && kkMatch.index !== undefined) {
      const slice = joinedDbf
        .slice(kkMatch.index, kkMatch.index + kkMatch[0].length)
        .replace(/^[\s\S]*?KÖPRÜ\s*KURMA\s*[:|\-–]?\s*/i, "");
      kopruKurma = joinWrappedPdfLinesToParagraphs(slice.split(/\r?\n/));
    }
  }

  // 7. Extract Öğrenme-Öğretme Yaşantıları / Uygulamaları (Verbatim from Ders Bilgi Formu, organized by Learning Unit AND Topic/Code-Block)
  const ogretmeUygulamalariByUnit: Record<string, string[]> = {};
  const ogretmeUygulamalariSegments: DbfUygulamaSegment[] = [];
  let allOgretmeUygulamalariBullets: string[] = [];
  let hasExplicitUnitHeadingsInUygulamalar = false;

  const targetLines = dbfLines.length > 0 ? dbfLines : combinedLines;

  // 7.0 Pre-extract official unit names from DBF "ÖĞRENME BİRİMİ / MODÜL VE SÜRE TABLOSU" if present
  for (let i = 0; i < targetLines.length; i++) {
    const upperLine = toTrUpper(targetLines[i]);
    if (/ÖĞRENME\s*BİRİMİ\s*\/?\s*MODÜL\s+VE\s+SÜRE/i.test(upperLine)) {
      let tableUnitIdx = 0;
      for (let j = i + 1; j < Math.min(targetLines.length, i + 25); j++) {
        const tLine = normalizeTurkishUnicode(targetLines[j]).trim();
        const tUpper = toTrUpper(tLine);
        if (/^TOPLAM\b|ÖĞRENME\s*ÇIKTISI\s*GRUBU|UYGULAMA\s*FAALİYETLERİ/i.test(tUpper)) {
          break;
        }
        if (/ÖĞRENME\s*BİRİMİ\s*\/?\s*MODÜL\s*(?:ADI|SÜRESİ)/i.test(tUpper)) {
          continue;
        }
        const durMatch = tLine.match(
          /^([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s,'()-]{2,65}?)\s+\d{1,3}\s*\/\s*\d{1,3}$/
        );
        if (durMatch) {
          tableUnitIdx++;
          const uName = durMatch[1].trim().replace(/^Vegetat/i, "Vejetat");
          const formatted =
            uName.charAt(0).toLocaleUpperCase("tr-TR") +
            uName.slice(1).toLocaleLowerCase("tr-TR");
          unitsByNumber[tableUnitIdx] = formatted;
        }
      }
      break;
    }
  }

  let uygulamalarStartIdx = -1;
  let uygulamalarEndIdx = targetLines.length;

  const uygulamalarHeadingUpperRegex =
    /^(?:[\s|*•\-–#]+|\d{1,2}(?:\.\d{1,2})*[.)\-–\s]+|[IVXLCDM]+[.)\-–\s]+)*(?:(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRENMEÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME|ÖĞRETMEÖĞRENME)\s*(?:UYGULAMALAR[Iİ]|SÜREC[İI]\s*UYGULAMALAR[Iİ]|ETK[İI]NL[İI]KLER[İI])|ÖĞRETME\s*UYGULAMALAR[Iİ]|ÖĞRENME\s*UYGULAMALAR[Iİ])(?=$|\s|[:|-])/i;

  const yasantilarHeadingUpperRegex =
    /^(?:[\s|*•\-–#]+|\d{1,2}(?:\.\d{1,2})*[.)\-–\s]+|[IVXLCDM]+[.)\-–\s]+)*(?:(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRENMEÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME|ÖĞRETMEÖĞRENME)\s*(?:YAŞANT[Iİ]LAR[Iİ]|SÜREC[İI]))(?=$|\s|[:|-])/i;

  const uygulamalarStopUpperRegex =
    /^(?:[\s|*•\-–#]+|\d{1,2}(?:\.\d{1,2})*[.)\-–\s]+|[IVXLCDM]+[.)\-–\s]+)*(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME\s*ORTAM|ÖĞRETME\s*ORTAM|ORTAM\s*VE\s*DONANIM|ORTAM\s*:|DONANIM\s*:|ÖĞRENME\s*BİRİMİ\s*(?:\/|\s)\s*(?:MODÜL|VE\s*SÜRE)|ÖĞRENME\s*ÇIKTISI\s*GRUBU|UYGULAMA\s*FAALİYETLERİ|DERSİN\s*UYGULANMASINA|FARKL[Iİ]LAŞT[Iİ]RMA|ZENG[İI]NLEŞT[İI]RME|DESTEKLEME|ÖĞRETMEN\s*VE\s*ÖĞRENC[İI]|UYGUNDUR|\d{1,2}\s*\.\s*HAFTA)(?=$|\s|[:|-])/i;

  const uygulamalarInlineStopRegex =
    /(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME\s*ORTAM\s*VE\s*DONANIM|ORTAM\s*VE\s*DONANIM|ÖĞRENME\s*BİRİMİ\s*\/?\s*MODÜL\s+VE\s+SÜRE|ÖĞRENME\s*ÇIKTISI\s*GRUBU\s*VE\s*AÇIKLAMALARI|UYGULAMA\s*FAALİYETLERİ\s*\/?\s*TEMRİNLER|DERSİN\s*UYGULANMASINA\s*İLİŞKİN|FARKL[Iİ]LAŞT[Iİ]RMA)/i;

  // 7.1 First look for explicit "ÖĞRENME-ÖĞRETME UYGULAMALARI" / "ÖĞRETME UYGULAMALARI" subheading
  for (let i = 0; i < targetLines.length; i++) {
    const upperLine = toTrUpper(targetLines[i]);
    if (uygulamalarHeadingUpperRegex.test(upperLine)) {
      let endIdx = targetLines.length;
      for (let j = i + 1; j < targetLines.length; j++) {
        if (uygulamalarStopUpperRegex.test(toTrUpper(targetLines[j]))) {
          endIdx = j;
          break;
        }
      }
      if (endIdx - i >= 2) {
        uygulamalarStartIdx = i;
        uygulamalarEndIdx = endIdx;
        break;
      }
    }
  }

  // 7.2 Fallback: If the Ders Bilgi Formu only had "ÖĞRENME-ÖĞRETME YAŞANTILARI" (or placed unit/topic blocks right after KÖPRÜ KURMA)
  if (uygulamalarStartIdx === -1) {
    let yasantilarIdx = -1;
    let kopruIdx = -1;
    for (let i = 0; i < targetLines.length; i++) {
      const upperLine = toTrUpper(targetLines[i]);
      if (yasantilarIdx === -1 && yasantilarHeadingUpperRegex.test(upperLine)) {
        yasantilarIdx = i;
      }
      if (/^(?:[\s|*•\-–#]+)*KÖPRÜ\s*KURMA(?=$|\s|[:|-])/i.test(upperLine)) {
        kopruIdx = i;
      }
    }

    const searchFrom =
      kopruIdx !== -1
        ? kopruIdx + 1
        : yasantilarIdx !== -1
        ? yasantilarIdx + 1
        : -1;
    if (searchFrom !== -1 && searchFrom < targetLines.length) {
      let endIdx = targetLines.length;
      for (let j = searchFrom; j < targetLines.length; j++) {
        if (uygulamalarStopUpperRegex.test(toTrUpper(targetLines[j]))) {
          endIdx = j;
          break;
        }
      }

      let adjustedStart = searchFrom;
      if (kopruIdx !== -1) {
        for (let k = searchFrom; k < endIdx; k++) {
          const lineNorm = normalizeTurkishUnicode(targetLines[k]).trim();
          if (
            /^\*?\s*[A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s-]{2,45}:\s*/.test(lineNorm) ||
            /(?:Bu\s+öğrenme\s+birimi|Bu\s+ünitede|Bu\s+temada|Öğrencilere|Öğrencilerden|Öğretmen\s+tarafından|\((?:(?:SDB|KB|OB|AB|E|D)\d{1,2}))/i.test(
              lineNorm
            )
          ) {
            adjustedStart = k;
            break;
          }
        }
      } else if (yasantilarIdx !== -1) {
        for (let k = searchFrom; k < endIdx; k++) {
          const lineNorm = normalizeTurkishUnicode(targetLines[k]).trim();
          if (
            /^\*?\s*[A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s-]{2,45}:\s*/.test(lineNorm) &&
            !/^(?:TEMEL\s*KABULLER|ÖN\s*DEĞERLENDİRME|KÖPRÜ\s*KURMA)/i.test(
              toTrUpper(lineNorm)
            )
          ) {
            adjustedStart = k;
            break;
          }
          if (
            /(?:Bu\s+öğrenme\s+birimi\s+işlenirken|Bu\s+öğrenme\s+biriminde|Bu\s+ünitede|\((?:(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*\s*[,;]\s*)+)/i.test(
              lineNorm
            )
          ) {
            adjustedStart = k;
            break;
          }
        }
      }

      if (endIdx > adjustedStart) {
        uygulamalarStartIdx = adjustedStart;
        uygulamalarEndIdx = endIdx;
      }
    }
  }

  if (uygulamalarStartIdx !== -1) {
    const rawUygulamaLines: string[] = [];
    const startLineNorm = normalizeTurkishUnicode(
      targetLines[uygulamalarStartIdx]
    );
    const startMatch = toTrUpper(startLineNorm).match(
      uygulamalarHeadingUpperRegex
    );
    const firstRemainder = startMatch
      ? startLineNorm
          .slice((startMatch.index || 0) + startMatch[0].length)
          .replace(/^[:|\-–\s]+/, "")
          .trim()
      : startLineNorm.trim();
    if (
      firstRemainder &&
      !isDbfSectionPageArtifactOrSubHeader(firstRemainder) &&
      !yasantilarHeadingUpperRegex.test(toTrUpper(firstRemainder))
    ) {
      const inlineStop = toTrUpper(firstRemainder).match(
        uygulamalarInlineStopRegex
      );
      if (inlineStop && inlineStop.index !== undefined) {
        const sliceBefore = firstRemainder.slice(0, inlineStop.index).trim();
        if (sliceBefore) rawUygulamaLines.push(sliceBefore);
      } else {
        rawUygulamaLines.push(firstRemainder);
      }
    }

    for (let k = uygulamalarStartIdx + 1; k < uygulamalarEndIdx; k++) {
      const candidateLine = normalizeTurkishUnicode(targetLines[k]).trim();
      if (!candidateLine) continue;
      const candidateUpper = toTrUpper(candidateLine);
      if (uygulamalarStopUpperRegex.test(candidateUpper)) {
        break;
      }
      const inlineStop = candidateUpper.match(uygulamalarInlineStopRegex);
      if (inlineStop && inlineStop.index !== undefined) {
        const beforeStop = candidateLine.slice(0, inlineStop.index).trim();
        if (
          beforeStop &&
          !isDbfSectionPageArtifactOrSubHeader(beforeStop) &&
          !/^(?:TEMEL\s*KABULLER|ÖN\s*DEĞERLENDİRME(?:\s*SÜRECİ)?|KÖPRÜ\s*KURMA)\s*[:|-]?$/i.test(
            toTrUpper(beforeStop)
          )
        ) {
          rawUygulamaLines.push(beforeStop);
        }
        break;
      }
      if (
        !isDbfSectionPageArtifactOrSubHeader(candidateLine) &&
        !/^(?:TEMEL\s*KABULLER|ÖN\s*DEĞERLENDİRME(?:\s*SÜRECİ)?|KÖPRÜ\s*KURMA)\s*[:|-]?$/i.test(
          candidateUpper
        )
      ) {
        rawUygulamaLines.push(candidateLine);
      }
    }

    // Known unit names from outcomesMap & materyalTree & duration table to recognize unit headers even without colons
    const knownUnitNamesLower = new Map<string, { num: number; name: string }>();
    for (const [uNoStr, uName] of Object.entries(unitsByNumber)) {
      if (uName && uName.trim().length >= 3) {
        knownUnitNamesLower.set(normalizeForUnitMatching(uName), {
          num: Number(uNoStr),
          name: uName.trim(),
        });
      }
    }

    // 7A. Check for explicit UnitTitle: subheadings (e.g. "Onarıcı Tarım:", "İyi Tarım Uygulamaları:", "Organik Tarım:", "Generatif üretim:", "Vegetatif üretim:")
    const unitSubheadingRegex =
      /^(?:[*•\-–]\s*)?(?:(\d{1,2})\.\s*(?:Öğrenme\s*Birimi|Ünite|Tema)\s*[:\-–]\s*)?([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\s,'()-]{2,65}):\s*(.*)$/;
    const nonUnitSubheadingRegex =
      /^(?:Örneğin|Not|Açıklama|Dikkat|Öğretmen|Öğrenciler|Bu\s+süreçte|Bu\s+öğrenme|Temel\s+Kabuller|Ön\s+Değerlendirme|Köprü\s+Kurma|Öğrenme\s+Kanıtları|Ortam|Donanım|Amaç|Süre|Dersin\s+Adı|Dersin\s+Sınıfı|Dersin\s+Süresi|Dersin\s+Amacı|Zenginleştirme|Destekleme|Öğrenme\s+Öğretme\s+Ortam)/i;

    let activeUnitKey = "";
    let activeUnitTitle = "";
    let currentUnitLines: string[] = [];
    let unitCounter = 0;

    const splitIntoCodeTerminatedBlocks = (textToSplit: string): string[] => {
      const rawBlocks = textToSplit
        .split(
          /(?<=\((?:(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*(?:\s*[,;]\s*|\s+)){1,}(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*\)\.?)\s+(?=[A-ZÇĞİÖŞÜ*•])/g
        )
        .map((b) => b.trim())
        .filter((b) => b.length >= 25);

      const mergedBlocks: string[] = [];
      for (const block of rawBlocks) {
        const hasCodeList =
          /\((?:(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*(?:\s*[,;]\s*|\s+)){1,}(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*\)\.?\s*$/.test(
            block
          );
        if (
          !hasCodeList &&
          mergedBlocks.length > 0 &&
          /^(?:Ayrıca|Bu\s+süreçte|Öğrencilerin\s+öz\s+değerlendirme)/i.test(
            block
          )
        ) {
          mergedBlocks[mergedBlocks.length - 1] = `${
            mergedBlocks[mergedBlocks.length - 1]
          } ${block}`;
        } else {
          mergedBlocks.push(block);
        }
      }
      return mergedBlocks.length > 0 ? mergedBlocks : [textToSplit];
    };

    const flushUnit = () => {
      if (activeUnitKey && currentUnitLines.length > 0) {
        const bodyWithoutHeader = currentUnitLines
          .filter((l, idx) => !(idx === 0 && l.trim() === `${activeUnitTitle}:`))
          .join(" ")
          .replace(/,\s+Öğrenci/g, ", öğrenci")
          .replace(/\s+/g, " ")
          .trim();
        const normalizedBody = normalizeMaarifCodeListsInText(bodyWithoutHeader);
        const subBlocks = splitIntoCodeTerminatedBlocks(normalizedBody);

        const displayUnitTitle = activeUnitTitle.replace(/^Vegetat/i, "Vejetat");
        const allUnitBullets: string[] = [`${displayUnitTitle}:`];
        subBlocks.forEach((subBlock) => {
          const bullets = splitOgretmeUygulamalariIntoBullets(subBlock);
          if (bullets.length > 0) {
            for (const b of bullets) {
              if (b.endsWith(":")) continue;
              allUnitBullets.push(b);
            }
            ogretmeUygulamalariSegments.push({
              index: ogretmeUygulamalariSegments.length,
              unitHint: displayUnitTitle,
              unitNumberHint: unitCounter,
              rawText: subBlock,
              bullets: [
                `${displayUnitTitle}:`,
                ...bullets.filter((b) => !b.endsWith(":")),
              ],
            });
          }
        });
        if (allUnitBullets.length > 1) {
          ogretmeUygulamalariByUnit[activeUnitKey] = allUnitBullets;
          const normKey = normalizeForUnitMatching(activeUnitKey);
          if (normKey && normKey !== activeUnitKey) {
            ogretmeUygulamalariByUnit[normKey] = allUnitBullets;
          }
          hasExplicitUnitHeadingsInUygulamalar = true;
        }
      }
    };

    for (const uLine of rawUygulamaLines) {
      const m = uLine.match(unitSubheadingRegex);
      const cleanLineNoBullet = uLine
        .replace(/^[*•\-–]\s*/, "")
        .replace(/:$/, "")
        .trim();
      const matchedKnownUnit = knownUnitNamesLower.get(
        normalizeForUnitMatching(cleanLineNoBullet)
      );

      if (m && !nonUnitSubheadingRegex.test(m[2].trim())) {
        flushUnit();
        activeUnitTitle = m[2].trim();
        const cleanTitleForUnitMap = activeUnitTitle.replace(
          /^Vegetat/i,
          "Vejetat"
        );
        const formattedUnitName =
          cleanTitleForUnitMap.charAt(0).toLocaleUpperCase("tr-TR") +
          cleanTitleForUnitMap.slice(1).toLocaleLowerCase("tr-TR");
        activeUnitKey = normalizeForUnitMatching(activeUnitTitle);
        unitCounter = m[1] ? Number(m[1]) : unitCounter + 1;
        unitsByNumber[unitCounter] = formattedUnitName;
        currentUnitLines = [`${activeUnitTitle}:`];
        if (m[3].trim()) {
          currentUnitLines.push(m[3].trim());
        }
      } else if (matchedKnownUnit && uLine.length <= 75) {
        flushUnit();
        activeUnitTitle = matchedKnownUnit.name;
        activeUnitKey = normalizeForUnitMatching(activeUnitTitle);
        unitCounter = matchedKnownUnit.num;
        currentUnitLines = [`${activeUnitTitle}:`];
      } else {
        currentUnitLines.push(uLine);
      }
    }
    flushUnit();

    // 7B. If the Ders Bilgi Formu did NOT use "UnitName:" colons,
    // split the section into individual Unit / Topic blocks terminated by parenthesized Maarif codes `(E1.4, E2.2, ..., D18.3).`!
    const normalizedFullUygulamalar = normalizeMaarifCodeListsInText(
      rawUygulamaLines.join(" ").replace(/\s+/g, " ").trim()
    );

    if (ogretmeUygulamalariSegments.length === 0 && normalizedFullUygulamalar) {
      const mergedCodeBlocks = splitIntoCodeTerminatedBlocks(
        normalizedFullUygulamalar
      );

      let inferredUnitNo = 0;
      mergedCodeBlocks.forEach((blockText, idx) => {
        if (
          /^(?:\*?\s*)?(?:Bu\s+öğrenme\s+birimi\s+işlenirken|Bu\s+öğrenme\s+biriminde|Bu\s+ünitede|Bu\s+temada)/i.test(
            blockText
          ) ||
          idx === 0
        ) {
          inferredUnitNo++;
        }
        const unitNum =
          mergedCodeBlocks.length === Object.keys(unitsByNumber).length
            ? idx + 1
            : Math.max(1, inferredUnitNo);
        const unitTitleHint = unitsByNumber[unitNum] || "";
        const segBullets = splitOgretmeUygulamalariIntoBullets(
          blockText,
          unitTitleHint || undefined
        );
        if (segBullets.length > 0) {
          ogretmeUygulamalariSegments.push({
            index: idx,
            unitHint: unitTitleHint,
            unitNumberHint: unitNum,
            rawText: blockText,
            bullets: segBullets,
          });
          const uKey = normalizeForUnitMatching(
            unitTitleHint || `unit-${unitNum}`
          );
          if (!ogretmeUygulamalariByUnit[uKey]) {
            ogretmeUygulamalariByUnit[uKey] = segBullets;
          } else {
            ogretmeUygulamalariByUnit[uKey] = [
              ...ogretmeUygulamalariByUnit[uKey],
              ...segBullets.filter((b) => !b.endsWith(":")),
            ];
          }
        }
      });
    }

    allOgretmeUygulamalariBullets =
      ogretmeUygulamalariSegments.length > 0
        ? ogretmeUygulamalariSegments.flatMap((s, idx) =>
            idx === 0 ? s.bullets : s.bullets.filter((b) => !b.endsWith(":"))
          )
        : splitOgretmeUygulamalariIntoBullets(normalizedFullUygulamalar);
  }

  // 7C. Generically index DBF Page 4-6 Curriculum & Temrin tables ("ÖĞRENME ÇIKTISI GRUBU VE AÇIKLAMALARI", "UYGULAMA FAALİYETLERİ / TEMRİNLER")
  // so sub-topics (e.g. "İklim Değişikliği", "Bakım İşlemleri", "Çelikle Üretim", "Kök Tipleri") map accurately back to their parent Learning Unit for ANY course!
  const unitContextKeywords: Record<string, string> = {};
  const explicitUygulamaUnitKeys = Array.from(
    new Set(
      Object.keys(ogretmeUygulamalariByUnit)
        .filter((k) => !k.startsWith("unit-"))
        .map((k) => normalizeForUnitMatching(k))
        .filter((k) => k.length >= 3)
    )
  );
  const indexedUnitNames =
    explicitUygulamaUnitKeys.length > 0
      ? explicitUygulamaUnitKeys
      : Array.from(
          new Set(
            Object.values(unitsByNumber)
              .map((u) => normalizeForUnitMatching(u))
              .filter((u) => u.length >= 3)
          )
        );

  if (indexedUnitNames.length > 0 && dbfLines.length > 0) {
    const joinedDbfNorm = normalizeForUnitMatching(dbfLines.join(" "));
    const tableStartIdx = joinedDbfNorm.indexOf("öğrenme çıktısı grubu");
    const altTableStart = joinedDbfNorm.indexOf("uygulama faaliyetleri");
    const scanStart = tableStartIdx !== -1 ? tableStartIdx : altTableStart;
    if (scanStart !== -1) {
      const endMarkerIdx = joinedDbfNorm.indexOf(
        "dersin uygulanmasına",
        scanStart
      );
      const tableSlice = joinedDbfNorm.slice(
        scanStart,
        endMarkerIdx !== -1 ? endMarkerIdx : scanStart + 6500
      );

      // Split both the Outcome Group table and Temrinler section by normalized unit headings
      const occurrences: Array<{ unitKey: string; pos: number }> = [];
      for (const uKey of indexedUnitNames) {
        const escaped = uKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(`(?:^|\\s)${escaped}(?=\\s|:|$)`, "g");
        let om: RegExpExecArray | null;
        while ((om = re.exec(tableSlice)) !== null) {
          occurrences.push({ unitKey: uKey, pos: om.index });
        }
      }
      occurrences.sort((a, b) => a.pos - b.pos);
      for (let oi = 0; oi < occurrences.length; oi++) {
        const curr = occurrences[oi];
        const nextPos =
          oi + 1 < occurrences.length ? occurrences[oi + 1].pos : tableSlice.length;
        const snippet = tableSlice
          .slice(curr.pos, Math.min(nextPos, curr.pos + 1600))
          .replace(/uygulama\s+faaliyetleri\s*\/?\s*temrinler.*$/i, "")
          .trim();
        unitContextKeywords[curr.unitKey] = unitContextKeywords[curr.unitKey]
          ? `${unitContextKeywords[curr.unitKey]} ${snippet}`
          : snippet;
      }
    }
  }

  for (const outcome of Object.values(outcomesMap)) {
    if (!unitsByNumber[outcome.unitNumber]) {
      const baseTopic = sanitizeShortTopicTitle(
        outcome.derivedTopicHeading.replace(
          /\s+(?:İlkeleri|Yönetimi|Uygulamaları|Kuralları|Yöntemleri|Süreçleri)$/i,
          ""
        )
      );
      if (baseTopic.length >= 3) {
        unitsByNumber[outcome.unitNumber] =
          baseTopic.charAt(0).toLocaleUpperCase("tr-TR") +
          baseTopic.slice(1).toLocaleLowerCase("tr-TR");
      }
    }

    // If an outcome still has 0 sub-components (e.g. EK-3 Ders Bilgi Formu only wrote "BÜY.1.1. Generatif üretim yapabilme"),
    // derive sequential sub-process components directly from that unit's Öğretme-Öğrenme Uygulamaları sentences in Ders Bilgi Formu!
    if (outcome.orderedSubKeys.length === 0) {
      const unitTitleForOutcome = (
        unitsByNumber[outcome.unitNumber] || ""
      ).toLocaleLowerCase("tr-TR");
      let unitBullets: string[] = [];
      for (const [uKey, bList] of Object.entries(ogretmeUygulamalariByUnit)) {
        if (
          unitTitleForOutcome &&
          (uKey.includes(unitTitleForOutcome) ||
            unitTitleForOutcome.includes(uKey))
        ) {
          unitBullets = bList;
          break;
        }
      }
      if (
        unitBullets.length === 0 &&
        Object.values(ogretmeUygulamalariByUnit)[outcome.unitNumber - 1]
      ) {
        unitBullets = Object.values(ogretmeUygulamalariByUnit)[
          outcome.unitNumber - 1
        ];
      }

      const contentSentences = unitBullets
        .filter((b) => !b.endsWith(":") && b.length >= 20)
        .map((b) =>
          b
            .replace(/\s*\([A-ZÇĞİÖŞÜ0-9.,\s]+\)\.?\s*$/, "")
            .replace(/^Öğretmen\s+tarafından\s+/i, "")
            .replace(/^Öğrencilerin\s+/i, "")
            .replace(/^Öğrencilerden\s+/i, "")
            .replace(/^Ayrıca\s+/i, "")
            .trim()
        )
        .filter((s) => s.length >= 15 && s.length <= 160);

      contentSentences.slice(0, 10).forEach((sentence, idx) => {
        const letter = TURKISH_SUB_LETTERS[idx];
        if (letter) {
          const cap =
            sentence.charAt(0).toLocaleUpperCase("tr-TR") + sentence.slice(1);
          const withDot = /[.!?]$/.test(cap) ? cap : `${cap}.`;
          outcome.orderedSubKeys.push(letter);
          outcome.subComponents[letter] = `${letter}) ${withDot}`;
        }
      });
    }
  }

  rawOutcomesCatalogText = Object.values(outcomesMap)
    .map((entry) => {
      const subs = entry.orderedSubKeys
        .map((k) => entry.subComponents[k])
        .filter(Boolean);
      return [entry.headerLine, ...subs].join("\n");
    })
    .join("\n\n");

  // 8. Extract Farklılaştırma
  const rawFarklilastirma = extractSectionBetweenHeadings(
    dbfLines.length > 0 ? dbfLines : combinedLines,
    /^(?:FARKLILAŞTIRMA|ZENGİNLEŞTİRME\s*VE\s*DESTEKLEME)(?=$|\s|[:|-])/i,
    /^(?:UYGUNDUR|ÖĞRETMEN|OKUL\s*MÜDÜRÜ|\d{1,2}\s*\.\s*HAFTA)(?=$|\s|[:|-])/i,
    50,
    2000
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
    ogretmeUygulamalariSegments,
    allOgretmeUygulamalariBullets,
    unitContextKeywords,
    hasExplicitUnitHeadingsInUygulamalar,
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
  unitOgrenmeKanitlari: string;
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

  // 1. Scan all week/date anchors across the Yıllık Plan
  // Determine rowStartIdx for each week by checking if its date range appears 1-3 lines above X. Hafta
  interface WeekRowAnchor {
    weekNo: number;
    lineIdx: number;
    rowStartIdx: number;
    dateRange: string;
  }
  const rawWeekHits: { weekNo: number; lineIdx: number }[] = [];
  const seenWeekNos = new Set<number>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const wMatch = line.match(
      /(?:\b(\d{1,2})\s*\.\s*HAFTA|\bHAFTA\s*[:|-]?\s*(\d{1,2})\b)/i
    );
    if (wMatch) {
      const wNo = Number(wMatch[1] || wMatch[2]);
      if (wNo >= 1 && wNo <= 42 && !seenWeekNos.has(wNo)) {
        seenWeekNos.add(wNo);
        rawWeekHits.push({ weekNo: wNo, lineIdx: i });
      }
    }
  }

  const anchors: WeekRowAnchor[] = rawWeekHits.map((hit, idx) => {
    const i = hit.lineIdx;
    const prevIdx = idx > 0 ? rawWeekHits[idx - 1].lineIdx : -1;
    const nextIdx =
      idx + 1 < rawWeekHits.length ? rawWeekHits[idx + 1].lineIdx : lines.length;

    let foundDate = extractDateRangeFromText(lines[i]);
    let rowStartIdx = i;

    if (!foundDate) {
      for (let up = 1; up <= 3; up++) {
        if (i - up > prevIdx) {
          const candidateDate = extractDateRangeFromText(lines[i - up]);
          if (candidateDate) {
            foundDate = candidateDate;
            rowStartIdx = i - up;
            break;
          }
        }
      }
    }
    if (!foundDate && i + 1 < nextIdx - 1) {
      foundDate = extractDateRangeFromText(lines[i + 1]);
    }

    return {
      weekNo: hit.weekNo,
      lineIdx: i,
      rowStartIdx,
      dateRange: resolveValidDateRange(foundDate, hit.weekNo),
    };
  });

  // Match by explicit targetWeekNo FIRST so a shifted date string never jumps to another week's row
  let matchedAnchorIdx = anchors.findIndex((a) => a.weekNo === targetWeekNo);
  if (matchedAnchorIdx === -1 && normInputDate.length >= 4) {
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

  let effectiveStartIdx = -1;
  let effectiveEndIdx = lines.length;
  let detectedTarihAraligi = resolveValidDateRange(inputDate, targetWeekNo);

  if (matchedAnchorIdx !== -1) {
    const currentAnchor = anchors[matchedAnchorIdx];
    effectiveStartIdx = currentAnchor.rowStartIdx;
    if (currentAnchor.dateRange) {
      detectedTarihAraligi = currentAnchor.dateRange;
    }
    if (matchedAnchorIdx + 1 < anchors.length) {
      effectiveEndIdx = anchors[matchedAnchorIdx + 1].rowStartIdx;
    }
  } else if (lines.length > 0 && selectedWeekObj) {
    // Fallback search in lines if Yıllık Plan did not use "X. HAFTA" anchors
    const selSummary = (selectedWeekObj.konuVeCiktiOzeti || "").trim();
    const selCodeMatch = selSummary.match(
      /\b([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?\b/
    );
    const selIcerikNorm = normalizeForUnitMatching(
      selectedWeekObj.icerikCercevesi || ""
    );
    for (let li = 0; li < lines.length; li++) {
      const lineNorm = normalizeForUnitMatching(lines[li]);
      if (
        (selCodeMatch && lines[li].includes(selCodeMatch[0])) ||
        (selIcerikNorm.length >= 5 && lineNorm.includes(selIcerikNorm))
      ) {
        effectiveStartIdx = Math.max(0, li - 1);
        effectiveEndIdx = Math.min(lines.length, li + 10);
        break;
      }
    }
  }

  const syntheticSelectedWeekLines = selectedWeekObj
    ? [
        selectedWeekObj.haftaEtiketi || `${targetWeekNo}. HAFTA`,
        selectedWeekObj.tarihAraligi || detectedTarihAraligi,
        selectedWeekObj.ogrenmeBirimi
          ? `Öğrenme Birimi: ${selectedWeekObj.ogrenmeBirimi}`
          : "",
        selectedWeekObj.konuVeCiktiOzeti || "",
        selectedWeekObj.icerikCercevesi
          ? `İçerik Çerçevesi: ${selectedWeekObj.icerikCercevesi}`
          : "",
      ].filter(Boolean)
    : [];

  const weekLines =
    effectiveStartIdx !== -1
      ? lines.slice(
          effectiveStartIdx,
          Math.max(effectiveStartIdx + 1, effectiveEndIdx)
        )
      : syntheticSelectedWeekLines.length >= 3
      ? syntheticSelectedWeekLines
      : lines.slice(0, Math.min(lines.length, 25));
  const rawWeekWindowText = weekLines.join("\n");

  // 2. Identify Outcome Code(s) & Sub-Process Components for this week
  const outcomeCodePattern =
    /\b([A-ZÇĞİÖŞÜ]{2,8})\.(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?\b/g;
  const inlineSubRegex =
    /(?:^|\s|\|)(?:[A-ZÇĞİÖŞÜ]{2,8}\.\d{1,2}\.\d{1,2}\.|\d{1,2}\.\d{1,2}\.)?([a-zçğıöşü])(?:[)]|\.(?=\s+[A-ZÇĞİÖŞÜ]))\s*([^|]+?)(?=(?:\s+(?:[A-ZÇĞİÖŞÜ]{2,8}\.\d{1,2}\.\d{1,2}\.|\d{1,2}\.\d{1,2}\.)?[a-zçğıöşü](?:[)]|\.(?=\s+[A-ZÇĞİÖŞÜ]))\s|\s*\||$))/g;

  // Join wrapped lines inside weekLines so multi-line sub-components ("a) ...\nyapısal özelliklerini açıklar.") are never cut in half
  const noiseLineForSubJoin =
    /^(?:\d{1,2}\s*\.\s*HAFTA|HAFTA\s*\d{1,2}|\d{1,2}\s*(?:Ders\s*)?Saat[i]?|(?:OCAK|ŞUBAT|MART|NİSAN|MAYIS|HAZİRAN|TEMMUZ|AĞUSTOS|EYLÜL|EKİM|KASIM|ARALIK)(?:\s+AYI)?)$/i;
  const joinedWeekLinesForSubScan = [
    ...weekLines.filter(
      (l) =>
        !noiseLineForSubJoin.test(l.trim()) &&
        !Boolean(extractDateRangeFromText(l) && l.length < 28)
    ),
    ...(selectedWeekObj?.konuVeCiktiOzeti
      ? [selectedWeekObj.konuVeCiktiOzeti]
      : []),
  ].join(" ");

  const extractSubMapFromText = (txt: string): Map<string, string> => {
    const map = new Map<string, string>();
    let sm: RegExpExecArray | null;
    inlineSubRegex.lastIndex = 0;
    while ((sm = inlineSubRegex.exec(txt)) !== null) {
      const letter = sm[1].toLocaleLowerCase("tr-TR");
      const textPart = sanitizeOutcomeOrSubSentence(
        sm[2]
          .replace(/\b\d{1,2}\s*\.\s*HAFTA\b/gi, "")
          .replace(/\b\d{1,2}\s*(?:Ders\s*)?Saat[i]?\b/gi, "")
      );
      if (textPart.length >= 4 && textPart.length <= 180) {
        const formatted = `${letter}) ${textPart}`;
        const existing = map.get(letter);
        if (!existing || formatted.length > existing.length) {
          map.set(letter, formatted);
        }
      }
    }
    return map;
  };

  const detectedCodes: string[] = [];
  const inlineHeadersByCode: Record<string, string> = {};
  let detectedUnitNo = 1;

  for (const wLine of [
    joinedWeekLinesForSubScan,
    ...weekLines,
    ...(selectedWeekObj?.konuVeCiktiOzeti
      ? [selectedWeekObj.konuVeCiktiOzeti]
      : []),
  ]) {
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
        const afterCode = sanitizeOutcomeOrSubSentence(
          wLine
            .slice(m.index)
            .replace(
              /(?:^|\s)(?:[A-ZÇĞİÖŞÜ]{2,8}\.\d{1,2}\.\d{1,2}\.|\d{1,2}\.\d{1,2}\.)?[a-zçğıöşü](?:[)]|\.(?=\s+[A-ZÇĞİÖŞÜ]))\s+.*$/,
              ""
            )
            .replace(/\b\d{1,2}\s*\.\s*HAFTA\b.*$/i, "")
        );
        if (
          afterCode.length > code.length + 3 &&
          afterCode.length <= 130 &&
          !inlineHeadersByCode[code]
        ) {
          inlineHeadersByCode[code] = afterCode;
        }
      }
    }
  }

  const weekSubMap = extractSubMapFromText(joinedWeekLinesForSubScan);

  let detectedCode = detectedCodes[0] || "";

  // If no outcome code was explicitly on this week's row (e.g. merged table cell across weeks),
  // scan all preceding lines up to the start of the document to find the active outcome code
  if (!detectedCode && effectiveStartIdx > 0) {
    for (let b = effectiveStartIdx - 1; b >= 0; b--) {
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

  const allCatalogOutcomes = Object.values(structuredDbf.outcomesMap);
  const proportionalCatalogFallback =
    allCatalogOutcomes.length > 0
      ? allCatalogOutcomes[
          Math.min(
            allCatalogOutcomes.length - 1,
            Math.floor(
              ((Math.max(1, targetWeekNo) - 1) /
                Math.max(36, anchors.length || 36)) *
                allCatalogOutcomes.length
            )
          )
        ]
      : undefined;

  const catalogEntry = detectedCode
    ? structuredDbf.outcomesMap[detectedCode]
    : proportionalCatalogFallback;

  if (catalogEntry && !detectedCode) {
    detectedCode = catalogEntry.code;
    detectedCodes.push(detectedCode);
    detectedUnitNo = catalogEntry.unitNumber;
  }

  // Compute all weeks in the Yıllık Plan that share this same outcome code (e.g. Weeks 1..4 share ST.1.1 or Weeks 1..6 share BÜY.1.1)
  const weeksWithThisOutcome: number[] = [];
  const subKeysByAnchorWeek = new Map<number, string>();
  let lastSeenCode = "";

  for (let aIdx = 0; aIdx < anchors.length; aIdx++) {
    const sIdx = anchors[aIdx].rowStartIdx;
    const eIdx =
      aIdx + 1 < anchors.length ? anchors[aIdx + 1].rowStartIdx : lines.length;
    const sliceStr = lines.slice(sIdx, eIdx).join(" ");
    let foundInSlice = "";
    outcomeCodePattern.lastIndex = 0;
    let cm: RegExpExecArray | null;
    while ((cm = outcomeCodePattern.exec(sliceStr)) !== null) {
      if (!/^(?:SDB|KB|OB|AB|E|D)$/i.test(cm[1])) {
        foundInSlice = cm[0];
        break;
      }
    }
    if (foundInSlice) {
      lastSeenCode = foundInSlice;
    }
    if (lastSeenCode === detectedCode) {
      weeksWithThisOutcome.push(anchors[aIdx].weekNo);
      const anchorSubMap = extractSubMapFromText(sliceStr);
      subKeysByAnchorWeek.set(
        anchors[aIdx].weekNo,
        Array.from(anchorSubMap.keys()).join(",")
      );
    }
  }

  // 3. Build clean Outcome Header + Week-Specific Sub-Components
  const rawHeaderCandidate =
    catalogEntry?.headerLine ||
    inlineHeadersByCode[detectedCode] ||
    (detectedCode ? `${detectedCode}.` : "");

  const outcomeHeader = sanitizeOutcomeOrSubSentence(
    rawHeaderCandidate.replace(
      /(?:^|\s)(?:[A-ZÇĞİÖŞÜ]{2,8}\.\d{1,2}\.\d{1,2}\.|\d{1,2}\.\d{1,2}\.)?[a-zçğıöşü](?:[)]|\.(?=\s+[A-ZÇĞİÖŞÜ]))\s+.*$/,
      ""
    )
  );

  let finalSubComponents: string[] = [];

  if (weekSubMap.size > 0) {
    const fullWeekSubs: string[] = [];
    for (const [letter, rawLine] of weekSubMap.entries()) {
      const catalogSub = catalogEntry?.subComponents[letter] || "";
      if (catalogSub && catalogSub.length >= rawLine.length) {
        fullWeekSubs.push(catalogSub);
      } else {
        fullWeekSubs.push(rawLine);
      }
    }

    // Check if the Yıllık Plan repeated the exact same full sub-component list across multiple weeks of this outcome
    const thisWeekKeySig = Array.from(weekSubMap.keys()).join(",");
    const duplicateKeyWeeksCount = weeksWithThisOutcome.filter(
      (wNo) => subKeysByAnchorWeek.get(wNo) === thisWeekKeySig
    ).length;

    if (
      duplicateKeyWeeksCount > 1 &&
      fullWeekSubs.length >= duplicateKeyWeeksCount
    ) {
      const totalSubs = fullWeekSubs.length;
      const totalW = duplicateKeyWeeksCount;
      const weekPosIdx = Math.max(
        0,
        weeksWithThisOutcome.indexOf(targetWeekNo)
      );
      const baseCount = Math.floor(totalSubs / totalW);
      const remainder = totalSubs % totalW;
      let startSubIdx = 0;
      for (let w = 0; w < weekPosIdx; w++) {
        startSubIdx += baseCount + (w < remainder ? 1 : 0);
      }
      const countForThisWeek = baseCount + (weekPosIdx < remainder ? 1 : 0);
      finalSubComponents = fullWeekSubs.slice(
        startSubIdx,
        startSubIdx + countForThisWeek
      );
    } else {
      finalSubComponents = fullWeekSubs;
    }
  } else if (catalogEntry && catalogEntry.orderedSubKeys.length > 0) {
    // Step 3A: Check if rawWeekWindowText mentions a specific subset of sub-component keywords
    const lowerWindow = normalizeForUnitMatching(rawWeekWindowText);
    const keywordMatchedSubs: string[] = [];

    for (const key of catalogEntry.orderedSubKeys) {
      const subSentence = catalogEntry.subComponents[key];
      if (!subSentence) continue;
      const coreTopic = normalizeForUnitMatching(
        subSentence
          .replace(/^[a-zçğıöşü]\)\s*/i, "")
          .replace(
            /\s+(?:açıklanır|sıralanır|uygulanır|incelenir|belirlenir)\.?$/i,
            ""
          )
      );
      if (coreTopic.length >= 6 && lowerWindow.includes(coreTopic)) {
        keywordMatchedSubs.push(subSentence);
      }
    }

    if (
      keywordMatchedSubs.length > 0 &&
      (weeksWithThisOutcome.length <= 1 ||
        keywordMatchedSubs.length < catalogEntry.orderedSubKeys.length)
    ) {
      finalSubComponents = keywordMatchedSubs;
    } else {
      // Step 3B: Proportional Week-Span Distribution across weeks sharing this outcome!
      const allOrderedSubs = catalogEntry.orderedSubKeys
        .map((k) => catalogEntry.subComponents[k])
        .filter(Boolean);
      const totalSubs = allOrderedSubs.length;
      const totalWeeksForOutcome = Math.max(1, weeksWithThisOutcome.length);
      const weekPosIdx = Math.max(
        0,
        weeksWithThisOutcome.indexOf(targetWeekNo)
      );

      if (totalWeeksForOutcome > 1 && totalSubs >= totalWeeksForOutcome) {
        const baseCount = Math.floor(totalSubs / totalWeeksForOutcome);
        const remainder = totalSubs % totalWeeksForOutcome;

        let startSubIdx = 0;
        for (let w = 0; w < weekPosIdx; w++) {
          startSubIdx += baseCount + (w < remainder ? 1 : 0);
        }
        const countForThisWeek =
          baseCount + (weekPosIdx < remainder ? 1 : 0);
        finalSubComponents = allOrderedSubs.slice(
          startSubIdx,
          startSubIdx + countForThisWeek
        );
      } else if (totalSubs >= 1) {
        const idxForWeek =
          totalWeeksForOutcome > 1
            ? Math.min(
                totalSubs - 1,
                Math.floor((weekPosIdx / totalWeeksForOutcome) * totalSubs)
              )
            : (targetWeekNo - 1) % totalSubs;
        finalSubComponents = [allOrderedSubs[idxForWeek]];
      }
    }
  }

  // Step 3C: If finalSubComponents is still empty, extract any week-specific topic/process lines written inside weekLines
  if (finalSubComponents.length === 0) {
    const derivedUnitLower = normalizeForUnitMatching(
      deriveUnitNameFromOutcome(outcomeHeader)
    );
    const headerLower = normalizeForUnitMatching(outcomeHeader);
    const candidateTopicLines = weekLines
      .flatMap((l) => l.split("|"))
      .map((s) => sanitizeOutcomeOrSubSentence(s))
      .filter((s) => {
        if (s.length < 8 || s.length > 160) return false;
        if (/^\d{1,2}\s*\.\s*HAFTA$/i.test(s)) return false;
        if (/^\d{1,2}\s*(?:Ders\s*)?Saat[i]?$/i.test(s)) return false;
        if (
          /^(?:OCAK|ŞUBAT|MART|NİSAN|MAYIS|HAZİRAN|TEMMUZ|AĞUSTOS|EYLÜL|EKİM|KASIM|ARALIK)(?:\s+AYI)?$/i.test(
            s
          )
        )
          return false;
        if (extractDateRangeFromText(s) && s.length < 30) return false;
        const sLower = normalizeForUnitMatching(s);
        if (sLower === derivedUnitLower || sLower === headerLower) return false;
        if (detectedCode && s.startsWith(detectedCode)) return false;
        return true;
      });

    candidateTopicLines.slice(0, 3).forEach((topicLine, idx) => {
      const letter = TURKISH_SUB_LETTERS[idx] || "a";
      const formatted = /[.!?]$/.test(topicLine)
        ? topicLine
        : `${topicLine} açıklanır.`;
      finalSubComponents.push(
        `${letter}) ${
          formatted.charAt(0).toLocaleUpperCase("tr-TR") + formatted.slice(1)
        }`
      );
    });
  }

  const formattedOutcomeAndProcessBlock = [
    outcomeHeader,
    ...finalSubComponents,
  ]
    .filter(Boolean)
    .join("\n");

  // 4. Determine Öğrenme Birimi dynamically for this course and unit (max 55 chars, never hardcoded to another course)
  let ogrenmeBirimi = "";
  const unitInWeek = rawWeekWindowText.match(
    /(?:Öğrenme\s*Birimi|Ünite|Tema)\s*(?!VE\s*SÜRE)[:|-]\s*([^|\n]{3,55})/i
  );
  if (unitInWeek) {
    ogrenmeBirimi = sanitizeShortTopicTitle(unitInWeek[1], "");
  }
  if (!ogrenmeBirimi) {
    const rawWindowNorm = normalizeForUnitMatching(rawWeekWindowText);
    for (const uName of Object.values(structuredDbf.unitsByNumber)) {
      if (
        uName &&
        uName.length >= 3 &&
        rawWindowNorm.includes(normalizeForUnitMatching(uName))
      ) {
        ogrenmeBirimi = uName;
        break;
      }
    }
  }
  if (!ogrenmeBirimi && selectedWeekObj?.ogrenmeBirimi) {
    ogrenmeBirimi = sanitizeShortTopicTitle(selectedWeekObj.ogrenmeBirimi, "");
  }
  if (!ogrenmeBirimi && structuredDbf.unitsByNumber[detectedUnitNo]) {
    ogrenmeBirimi = structuredDbf.unitsByNumber[detectedUnitNo];
  }
  if (!ogrenmeBirimi) {
    ogrenmeBirimi = deriveUnitNameFromOutcome(outcomeHeader);
  }
  if (!ogrenmeBirimi) {
    const derivedBase = deriveTopicHeadingFromOutcome(outcomeHeader).replace(
      /\s+(?:İlkeleri|Yönetimi|Uygulamaları|Kuralları|Yöntemleri|Organları)$/i,
      ""
    );
    if (derivedBase) {
      ogrenmeBirimi =
        derivedBase.charAt(0).toLocaleUpperCase("tr-TR") +
        derivedBase.slice(1).toLocaleLowerCase("tr-TR");
    }
  }
  ogrenmeBirimi = sanitizeShortTopicTitle(
    ogrenmeBirimi,
    structuredDbf.ders || "Genel Öğrenme Birimi"
  );

  // Sync detectedUnitNo if ogrenmeBirimi explicitly matches a known unit in structuredDbf.unitsByNumber
  if (ogrenmeBirimi) {
    const normUnitTarget = normalizeForUnitMatching(ogrenmeBirimi);
    for (const [uNoStr, uName] of Object.entries(structuredDbf.unitsByNumber)) {
      const normKnown = normalizeForUnitMatching(uName);
      if (
        normKnown &&
        (normKnown === normUnitTarget ||
          normKnown.includes(normUnitTarget) ||
          normUnitTarget.includes(normKnown))
      ) {
        detectedUnitNo = Number(uNoStr);
        break;
      }
    }
  }

  // 5. Determine İçerik Çerçevesi dynamically for this course and week (max 65 chars)
  let icerikCercevesi = "";
  const icerikInWeek = rawWeekWindowText.match(
    /(?:İçerik\s*Çerçevesi|Konu)\s*[:|-]\s*([^|\n]{4,65})/i
  );
  if (icerikInWeek && !/^\d+\s*\.\s*hafta$/i.test(icerikInWeek[1].trim())) {
    icerikCercevesi = sanitizeShortTopicTitle(icerikInWeek[1], "");
  }
  if (
    !icerikCercevesi &&
    selectedWeekObj?.icerikCercevesi &&
    !/^\d+\s*\.\s*hafta$/i.test(selectedWeekObj.icerikCercevesi.trim())
  ) {
    icerikCercevesi = sanitizeShortTopicTitle(
      selectedWeekObj.icerikCercevesi,
      ""
    );
  }
  if (!icerikCercevesi && catalogEntry?.derivedTopicHeading) {
    icerikCercevesi = sanitizeShortTopicTitle(
      catalogEntry.derivedTopicHeading,
      ""
    );
  }
  if (!icerikCercevesi) {
    icerikCercevesi = sanitizeShortTopicTitle(
      deriveTopicHeadingFromOutcome(outcomeHeader),
      ogrenmeBirimi
    );
  }

  // 6. Determine Süre
  const sureInWeek =
    selectedWeekObj?.sure ||
    rawWeekWindowText.match(/\b(\d{1,2})\s*(?:Ders\s*)?Saat[i]?\b/i)?.[1] ||
    structuredDbf.sure;
  const sure = /saat/i.test(sureInWeek)
    ? sureInWeek
    : `${sureInWeek} Ders Saati`;

  // 7. Dynamically filter BOTH 'Öğretme Uygulamaları' and 'Öğrenme Kanıtları' from Ders Bilgi Formu
  // strictly for THIS week's Learning Unit (ogrenmeBirimi) and Topic (icerikCercevesi / sub-components)
  const normLowerUnit = normalizeForUnitMatching(ogrenmeBirimi);
  let unitOgretmeUygulamalari: string[] = [];

  const segments = structuredDbf.ogretmeUygulamalariSegments || [];
  const genericPedagogicalWords = new Set([
    "öğrenci",
    "öğrenciler",
    "öğrencilerin",
    "öğrencilere",
    "öğrencilerden",
    "öğretmen",
    "öğrenme",
    "öğretme",
    "birimi",
    "biriminde",
    "işlenirken",
    "araştırma",
    "görevi",
    "verilir",
    "istenir",
    "sağlanır",
    "değerlendirilebilir",
    "değerlendirme",
    "ölçülebilir",
    "ölçme",
    "formu",
    "formları",
    "kullanılarak",
    "süreçte",
    "süreçlerinde",
    "kapsamında",
    "hakkında",
    "ilgili",
    "uygun",
    "farklı",
    "kaynaklardan",
    "bilgiler",
    "ışığında",
    "yapabilme",
    "açıklayabilme",
    "açıklar",
    "açıklanır",
    "sıralar",
    "sıralanır",
    "uygular",
    "uygulanır",
    "üretim",
    "üretimi",
    "tarım",
    "tarımda",
    "bitki",
    "bitkisel",
    "uygulama",
    "uygulamaları",
    "yöntem",
    "yöntemleri",
  ]);

  const extractDistinctiveStems = (txt: string): string[] => {
    const words = normalizeForUnitMatching(txt || "")
      .replace(/^[a-zçğıöşü]\)\s*/gm, "")
      .replace(/\b[a-zçğıöşü]{2,8}\.\d+(?:\.\d+)*\b/g, " ")
      .replace(/[^\p{L}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !genericPedagogicalWords.has(w));
    return Array.from(new Set(words.map((w) => w.slice(0, 5))));
  };

  const unitStems = new Set(extractDistinctiveStems(ogrenmeBirimi));
  const specificTopicContext = [
    icerikCercevesi,
    ...finalSubComponents,
    selectedWeekObj?.konuVeCiktiOzeti || "",
    outcomeHeader,
  ].join(" ");
  const topicOnlyStems = extractDistinctiveStems(specificTopicContext).filter(
    (s) => !unitStems.has(s)
  );
  const allWeekStems = extractDistinctiveStems(
    `${specificTopicContext} ${ogrenmeBirimi}`
  );

  // Extract concrete multi-word or single-word topic phrases from icerikCercevesi and sub-components for high-precision matching
  const topicPhrases = [
    icerikCercevesi,
    ...finalSubComponents.map((s) =>
      s
        .replace(/^[a-zçğıöşü]\)\s*/i, "")
        .replace(
          /\s+(?:açıklanır|sıralanır|uygulanır|incelenir|belirlenir|gösterilir|tartışılır|açıklar|sıralar|yapar|yapılır)\.?$/i,
          ""
        )
        .trim()
    ),
  ]
    .map((p) => normalizeForUnitMatching(p))
    .filter((p) => p.length >= 4);

  let matchedExplicitUnitBlock = false;
  const dedupedUnitMap = new Map<string, string[]>();
  for (const [uKey, bullets] of Object.entries(
    structuredDbf.ogretmeUygulamalariByUnit
  )) {
    if (uKey.startsWith("unit-")) continue;
    const normKey = normalizeForUnitMatching(uKey);
    if (normKey && !dedupedUnitMap.has(normKey)) {
      dedupedUnitMap.set(normKey, bullets);
    }
  }
  const namedUnitEntries = Array.from(dedupedUnitMap.entries());

  // Priority 1: When DBF explicitly organizes Öğrenme Öğretme Uygulamaları by Learning Unit/Outcome heading
  // (e.g. "Onarıcı Tarım:", "İyi Tarım Uygulamaları:", "Organik Tarım:", "Generatif üretim:", "Vejetatif üretim:"),
  // match the active week's unit/outcome/topic to the exact DBF unit and return its COMPLETE verbatim block!
  if (
    structuredDbf.hasExplicitUnitHeadingsInUygulamalar &&
    namedUnitEntries.length > 0
  ) {
    const unitScores: Array<{
      unitKey: string;
      bullets: string[];
      score: number;
    }> = [];
    const normIcerik = normalizeForUnitMatching(icerikCercevesi);
    const normOutcomeHeader = normalizeForUnitMatching(outcomeHeader);
    const normPrimaryWeekSignals = `${normLowerUnit} ${normIcerik} ${normOutcomeHeader}`;

    // Identify which candidate units have their distinctive title stem (e.g. "vejet", "onarı", "organ") present in this week's unit/outcome/topic
    const unitDistinctiveHitMap = new Map<string, boolean>();
    for (const [uKey] of namedUnitEntries) {
      const uStems = extractDistinctiveStems(uKey);
      const hasHit =
        uStems.length > 0 &&
        uStems.some((st) => normPrimaryWeekSignals.includes(st));
      unitDistinctiveHitMap.set(uKey, hasHit);
    }
    const anyUnitHasDistinctiveHit = Array.from(
      unitDistinctiveHitMap.values()
    ).some(Boolean);

    namedUnitEntries.forEach(([unitKey, bullets], unitIdx) => {
      let score = 0;
      const contextKeywords = normalizeForUnitMatching(
        structuredDbf.unitContextKeywords?.[unitKey] || ""
      );
      const normBulletsText = normalizeForUnitMatching(bullets.join(" "));
      const fullUnitCorpus = [unitKey, normBulletsText, contextKeywords].join(
        " "
      );

      if (normLowerUnit) {
        if (unitKey === normLowerUnit) {
          score += 75;
        } else if (
          unitKey.includes(normLowerUnit) ||
          normLowerUnit.includes(unitKey)
        ) {
          score += 55;
        }
      }

      if (normIcerik && normIcerik.length >= 4) {
        if (unitKey.includes(normIcerik) || normIcerik.includes(unitKey)) {
          score += 45;
        } else if (contextKeywords.includes(normIcerik)) {
          score += 30;
        } else if (fullUnitCorpus.includes(normIcerik)) {
          score += 20;
        }
      }

      if (normOutcomeHeader && normOutcomeHeader.length >= 6) {
        const cleanOutcomeBody = normOutcomeHeader.replace(
          /^[a-zçğıöşü]{2,8}\.\d+(?:\.\d+)*\.?\s*/i,
          ""
        );
        if (
          normOutcomeHeader.includes(unitKey) ||
          (cleanOutcomeBody.length >= 6 &&
            contextKeywords.includes(cleanOutcomeBody))
        ) {
          score += 40;
        }
      }

      for (const phrase of topicPhrases) {
        if (phrase.length >= 5) {
          if (unitKey.includes(phrase) || phrase.includes(unitKey)) {
            score += 22;
          } else if (contextKeywords.includes(phrase)) {
            score += 15;
          } else if (normBulletsText.includes(phrase)) {
            score += 12;
          }
        }
      }

      const unitKeyStems = extractDistinctiveStems(unitKey);
      for (const stem of allWeekStems) {
        if (unitKeyStems.includes(stem)) {
          score += 15;
        } else if (contextKeywords.includes(stem)) {
          score += 5;
        } else if (fullUnitCorpus.includes(stem)) {
          score += 2;
        }
      }

      if (unitIdx + 1 === detectedUnitNo) {
        score += 15;
      } else if (detectedCode && namedUnitEntries.length >= detectedUnitNo) {
        score -= 10;
      }

      // Contrast guard: if another DBF unit's distinctive title stem explicitly matches this week's unit/outcome/topic,
      // heavily penalize units whose distinctive title stem does NOT appear in this week's unit/outcome/topic!
      if (anyUnitHasDistinctiveHit && !unitDistinctiveHitMap.get(unitKey)) {
        score -= 80;
      }

      unitScores.push({ unitKey, bullets, score });
    });

    const bestUnitMatch = unitScores.reduce((prev, curr) =>
      curr.score > prev.score ? curr : prev
    );

    if (bestUnitMatch && bestUnitMatch.score >= 5) {
      unitOgretmeUygulamalari = bestUnitMatch.bullets;
      matchedExplicitUnitBlock = true;
    }
  }

  // Priority 2: Segment-level matching for DBFs without explicit unit headings (or if Priority 1 found no match)
  if (!matchedExplicitUnitBlock && segments.length > 0) {
    // 7A. Identify segments belonging to this week's unit
    const unitMatchedSegments = segments.filter((seg) => {
      if (seg.unitHint && normLowerUnit) {
        const segUnitNorm = normalizeForUnitMatching(seg.unitHint);
        if (
          segUnitNorm.includes(normLowerUnit) ||
          normLowerUnit.includes(segUnitNorm)
        ) {
          return true;
        }
      }
      return seg.unitNumberHint === detectedUnitNo;
    });

    const candidatePool =
      unitMatchedSegments.length > 0 ? unitMatchedSegments : segments;

    if (candidatePool.length === 1) {
      unitOgretmeUygulamalari = candidatePool[0].bullets;
    } else {
      const scoredSegments: Array<{ seg: DbfUygulamaSegment; score: number }> = [];
      let bestTopicScore = -1;
      let tiedTopCount = 0;

      for (const seg of candidatePool) {
        const segNorm = normalizeForUnitMatching(seg.rawText);
        let score = 0;

        // Exact phrase bonus for icerikCercevesi or sub-component phrases appearing inside the DBF segment
        for (const phrase of topicPhrases) {
          if (phrase.length >= 5 && segNorm.includes(phrase)) {
            score += 10;
          } else {
            const phraseWords = phrase
              .split(/\s+/)
              .filter((w) => w.length >= 4 && !genericPedagogicalWords.has(w));
            for (const pw of phraseWords) {
              if (segNorm.includes(pw.slice(0, 6))) {
                score += 3;
              }
            }
          }
        }

        // Score distinctive topic/sub-component stems higher than shared unit stems
        for (const stem of topicOnlyStems) {
          if (segNorm.includes(stem)) {
            score += 4;
          }
        }
        for (const stem of allWeekStems) {
          if (segNorm.includes(stem)) {
            score += 1;
          }
        }

        scoredSegments.push({ seg, score });
        if (score > bestTopicScore) {
          bestTopicScore = score;
          tiedTopCount = 1;
        } else if (score === bestTopicScore) {
          tiedTopCount++;
        }
      }

      // If multiple segments in the same unit strongly match this week's topic/sub-components (e.g., 2 paragraphs in DBF cover this week's sub-topics), combine them!
      const strongMatchedSegments = scoredSegments.filter(
        (item) =>
          item.score >= 8 &&
          item.score >= bestTopicScore * 0.65 &&
          unitMatchedSegments.includes(item.seg)
      );

      if (strongMatchedSegments.length > 1 && strongMatchedSegments.length <= 3) {
        const combinedBullets: string[] = [];
        strongMatchedSegments.forEach((item, idx) => {
          for (const b of item.seg.bullets) {
            if (idx > 0 && b.endsWith(":")) continue;
            if (!combinedBullets.includes(b)) {
              combinedBullets.push(b);
            }
          }
        });
        unitOgretmeUygulamalari = combinedBullets;
      } else if (
        unitMatchedSegments.length > 1 &&
        (tiedTopCount > 1 || bestTopicScore <= 2) &&
        weeksWithThisOutcome.length > 1
      ) {
        // If multiple segments in the same unit tied (because the Yıllık Plan row only had the unit-level outcome),
        // pick the segment corresponding to this week's position within the outcome/unit span
        const weekPosIdx = Math.max(
          0,
          weeksWithThisOutcome.indexOf(targetWeekNo)
        );
        const segIdx = Math.min(
          unitMatchedSegments.length - 1,
          Math.floor(
            (weekPosIdx / Math.max(1, weeksWithThisOutcome.length)) *
              unitMatchedSegments.length
          )
        );
        unitOgretmeUygulamalari = unitMatchedSegments[segIdx].bullets;
      } else {
        const bestItem = scoredSegments.reduce((prev, curr) =>
          curr.score > prev.score ? curr : prev
        );
        unitOgretmeUygulamalari = bestItem.seg.bullets;
      }
    }
  }

  // 7B. Fallback to ogretmeUygulamalariByUnit or allOgretmeUygulamalariBullets if segments was empty
  if (unitOgretmeUygulamalari.length === 0) {
    for (const [unitKey, bullets] of namedUnitEntries) {
      if (
        normLowerUnit &&
        (unitKey.includes(normLowerUnit) || normLowerUnit.includes(unitKey))
      ) {
        unitOgretmeUygulamalari = bullets;
        break;
      }
    }
  }

  if (
    unitOgretmeUygulamalari.length === 0 &&
    namedUnitEntries[detectedUnitNo - 1]
  ) {
    unitOgretmeUygulamalari = namedUnitEntries[detectedUnitNo - 1][1];
  }

  if (
    unitOgretmeUygulamalari.length === 0 &&
    structuredDbf.allOgretmeUygulamalariBullets.length > 0
  ) {
    // Filter allOgretmeUygulamalariBullets by topic stems if possible before returning all
    const topicFilteredBullets =
      structuredDbf.allOgretmeUygulamalariBullets.filter((b) => {
        if (b.endsWith(":")) return false;
        const bNorm = normalizeForUnitMatching(b);
        return (
          topicOnlyStems.some((st) => bNorm.includes(st)) ||
          allWeekStems.some((st) => bNorm.includes(st))
        );
      });
    unitOgretmeUygulamalari =
      topicFilteredBullets.length >= 2
        ? [
            ...(ogrenmeBirimi ? [`${ogrenmeBirimi}:`] : []),
            ...topicFilteredBullets,
          ]
        : structuredDbf.allOgretmeUygulamalariBullets;
  }

  // Preserve the DBF's exact unit heading when matched explicitly; only inject ogrenmeBirimi if no unit heading exists at index 0
  if (
    !matchedExplicitUnitBlock &&
    unitOgretmeUygulamalari.length > 0 &&
    ogrenmeBirimi &&
    unitOgretmeUygulamalari[0].endsWith(":")
  ) {
    unitOgretmeUygulamalari = [
      `${ogrenmeBirimi}:`,
      ...unitOgretmeUygulamalari.slice(1),
    ];
  }

  // 7C. Dynamically filter 'Öğrenme Kanıtları' from Ders Bilgi Formu for THIS week's unit & topic
  let unitOgrenmeKanitlari = cleanOgrenmeKanitlariPrefix(
    (structuredDbf.ogrenmeKanitlari || "").trim()
  );
  const otherUnitStems = new Set<string>();
  for (const [uNoStr, uName] of Object.entries(structuredDbf.unitsByNumber)) {
    if (Number(uNoStr) !== detectedUnitNo && uName) {
      for (const s of extractDistinctiveStems(uName)) {
        if (!unitStems.has(s)) {
          otherUnitStems.add(s);
        }
      }
    }
  }

  if (unitOgrenmeKanitlari) {
    const kanitParagraphs = unitOgrenmeKanitlari
      .split(/\r?\n+/)
      .map((p) => cleanOgrenmeKanitlariPrefix(p.trim()))
      .filter(Boolean);

    if (kanitParagraphs.length > 1 && otherUnitStems.size > 0) {
      const filteredParagraphs = kanitParagraphs.filter((para) => {
        const lowerPara = para.toLocaleLowerCase("tr-TR");
        const matchesCurrentUnitOrTopic = allWeekStems.some((stem) =>
          lowerPara.includes(stem)
        );
        if (matchesCurrentUnitOrTopic) return true;

        const matchesOtherUnit = Array.from(otherUnitStems).some((otherStem) =>
          lowerPara.includes(otherStem)
        );
        // Keep general course-wide assessment paragraphs; exclude paragraphs that belong exclusively to a different unit
        return !matchesOtherUnit;
      });

      if (filteredParagraphs.length > 0) {
        unitOgrenmeKanitlari = cleanOgrenmeKanitlariPrefix(
          filteredParagraphs.join("\n")
        );
      }
    }
  } else if (unitOgretmeUygulamalari.length > 0) {
    // If the Ders Bilgi Formu had no separate ÖĞRENME KANITLARI heading, extract the assessment/evidence sentences from this week's unit/topic block
    const evidenceBullets = unitOgretmeUygulamalari
      .filter(
        (b) =>
          !b.endsWith(":") &&
          /(?:ölçülebilir|değerlendirilebilir|ölçme\s+yöntemi|ölçme\s+araç|değerlendirme\s+formu|kontrol\s+listesi|gözlem\s+formu|çalışma\s+rapor|T\s+şeması|yapılandırılmış\s+grid|tanılayıcı\s+dallanmış|dereceli\s+puanlama|rubrik)/i.test(
            b
          )
      )
      .map((b) =>
        b
          .replace(
            /\s*\((?:(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*(?:\s*[,;]\s*|\s+)){1,}(?:SDB|KB|OB|AB|E|D)\d{1,2}(?:\.\d{1,2})*\)\.?\s*$/,
            "."
          )
          .trim()
      );
    if (evidenceBullets.length > 0) {
      unitOgrenmeKanitlari = cleanOgrenmeKanitlariPrefix(
        evidenceBullets.join("\n")
      );
    }
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
    unitOgrenmeKanitlari,
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
    `Mesleki uygulama standartlarını ve iş sağlığı-güvenliği kurallarını gözeterek doğru yöntemleri seçmenin verimliliği nasıl artırdığını keşfedeceksiniz.`,
    `Edineceğiniz bilgi ve becerilerle sahada karşılaşılan problemlere bilimsel, planlı ve kaliteli çözümler geliştirme yetkinliği kazanacaksınız.`,
  ];

  const Dikkat_Cekme: string[] = [
    `${
      primaryFocus.charAt(0).toLocaleUpperCase("tr-TR") + primaryFocus.slice(1)
    } ilkelerini doğru bir şekilde uygulamak mesleki kaliteye ve iş verimliliğine nasıl bir fark kazandırır?`,
    `${
      secondaryFocus.charAt(0).toLocaleUpperCase("tr-TR") +
      secondaryFocus.slice(1).toLocaleLowerCase("tr-TR")
    } aşamalarında yapılacak doğru bir planlama hem zamandan hem de kaynaklardan tasarruf etmeyi nasıl sağlar?`,
    `Mesleki uygulamalarda ${weekData.icerikCercevesi.toLocaleLowerCase("tr-TR")} açısından karşılaşılan en önemli teknik sorun sizce ne olabilir?`,
    `${weekData.ogrenmeBirimi} süreçlerinde hem yüksek uygulama kalitesi elde etmek hem de kaynakları verimli kullanmak nasıl mümkün olabilir?`,
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
  const pair2 = `(${obCodes[2] || obCodes[1] || obCodes[0] || "OB2"}, ${eCodes[0] || "E1.4"})`;
  const pair3 = `(${kbCodes[1] || kbCodes[0] || "KB3.2"}, ${dCodes[0] || "D3.2"})`;
  const pair4 = `(${dCodes[2] || dCodes[1] || "D16.3"}, ${sdbCodes[1] || "SDB3.3"})`;
  const pair5 = `(${sdbCodes[0] || "SDB2.2"}, ${eCodes[1] || "E2.2"}, ${eCodes[2] || "E2.3"})`;
  const pair6 = `(${obCodes[1] || "OB2"}, ${dCodes[1] || "D12.3"})`;

  const Ek_Ogretme_Uygulamalari: string[] = [
    `${
      primaryFocus.charAt(0).toLocaleUpperCase("tr-TR") + primaryFocus.slice(1)
    } konusunun temel aşamalarını ve uygulama ilkelerini gösteren şematik şablonlar ve görseller sınıfta incelenebilir ${pair1}.`,
    `Öğrenciler ${secondaryFocus.toLocaleLowerCase("tr-TR")} kapsamındaki yöntem ve materyallerin kritik noktalarını karşılaştırmalı olarak analiz edebilir ${pair2}.`,
    `${weekData.icerikCercevesi} uygulamalarının kalite, verimlilik ve standartlara uygunluk açısından sağladığı yararlar somut örneklerle açıklanabilir ${pair3}.`,
    `Konu kapsamındaki işlemlerin çalışma ortamı koşullarına uygun planlanma süreçleri örnek senaryolar üzerinden tartışılabilir ${pair4}.`,
    `Öğrencilerin ${primaryFocus.toLocaleLowerCase("tr-TR")} sürecinde karşılaşılabilecek temel zorluklara yönelik akılcı çözüm önerileri geliştirmeleri sağlanabilir ${pair5}.`,
    `${weekData.ogrenmeBirimi} uygulamalarının mesleki süreçler ve kalite yönetimi üzerindeki rolü kavram haritaları veya infografiklerle gösterilebilir ${pair6}.`,
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
      /^(?:[\s|*•\-–#]+|\d{1,2}(?:\.\d{1,2})*[.)\-–\s]+|[IVXLCDM]+[.)\-–\s]+|(?:BÖLÜM|MADDE)\s*\d{1,2}[:.)\s-]*)*(?:ÖĞRENME\s*KAN[Iİ]TLAR[Iİ](?:\s*\(?\s*ÖLÇME\s*VE\s*DEĞERLEND[İI]RME(?:\s*SÜREC[İI])?\s*\)?)?|ÖLÇME\s*VE\s*DEĞERLEND[İI]RME(?:\s*\(?\s*ÖĞRENME\s*KAN[Iİ]TLAR[Iİ]\s*\)?)?|ÖLÇME\s*[-–]\s*DEĞERLEND[İI]RME|ÖĞRENME\s*KAN[Iİ]TLAR[Iİ]\s*[/&,]\s*ÖLÇME\s*VE\s*DEĞERLEND[İI]RME|ÖĞRENME\s*KAN[Iİ]TLAR[Iİ]\s*VE\s*ÖLÇME\s*DEĞERLEND[İI]RME|DEĞERLEND[İI]RME\s*SÜREC[İI]|ÖLÇME\s*VE\s*DEĞERLEND[İI]RME\s*UYGULAMALAR[Iİ])(?=$|\s|[:|()\-–])/i,
    stopRegex:
      /^(?:[\s|*•\-–#]+|\d{1,2}(?:\.\d{1,2})*[.)\-–\s]+|[IVXLCDM]+[.)\-–\s]+)*(?:(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRENMEÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME|ÖĞRETMEÖĞRENME)\s*(?:YAŞANT[Iİ]LAR[Iİ]|UYGULAMALAR[Iİ]|SÜREC[İI]|ETK[İI]NL[İI]KLER[İI])|ÖĞRETME\s*UYGULAMALAR[Iİ]|ÖĞRENME\s*UYGULAMALAR[Iİ]|TEMEL\s*KABULLER|ÖN\s*DEĞERLEND[İI]RME(?:\s*SÜREC[İI])?|KÖPRÜ\s*KURMA|FARKLILAŞTIRMA|ZENG[İI]NLEŞT[İI]RME|DESTEKLEME|UYGUNDUR)(?=$|\s|[:|()\-–])/i,
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
    characteristicPhrases: [],
    minChars: 25,
    maxChars: 8000,
  },
  Temel_Kabuller: {
    headerRegex:
      /^(?:TEMEL\s*KABULLER|Temel\s*Kabuller|ÖN\s*BİLGİLER|HAZIRBULUNUŞLUK)(?=$|\s|[:|-])/i,
    stopRegex:
      /^(?:ÖN\s*DEĞERLENDİRME(?:\s*SÜRECİ)?|KÖPRÜ\s*KURMA|(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME)\s*UYGULAMALARI)(?=$|\s|[:|-])/i,
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
      /^(?:KÖPRÜ\s*KURMA|Köprü\s*Kurma|(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME)\s*UYGULAMALARI|Öğretme\s*Uygulamaları)(?=$|\s|[:|-])/i,
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
      /^(?:(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME|Öğrenme\s*[-–]?\s*Öğretme|Öğretme\s*[-–]?\s*Öğrenme)\s*(?:UYGULAMALARI|Uygulamaları)|ÖĞRETME\s*UYGULAMALARI|FARKLILAŞTIRMA)(?=$|\s|[:|-])/i,
    semanticKeywords: [
      "bağ kurulur",
      "ilişki kurulur",
      "yeni konuya geçiş",
      "günlük yaşamda karşılaştıkları",
      "yakın çevrelerindeki",
      "karşılaştırılarak yeni konuya",
      "ilişkilendirilmesi mümkündür",
    ],
    characteristicPhrases: [
      /(?:Öğrencilerin\s+günlük|Günlük\s+hayatta|Önceki\s+öğrenmeler)[\s\S]{15,650}?(?:bağ\s+kurulur|ilişki\s+kurulur|geçiş\s+sağlanır|geçiş\s+yapılır|ilişkilendirilmesi\s+mümkündür|kullanabilir)\./i,
    ],
    minChars: 30,
    maxChars: 1400,
  },
  Ogretme_Uygulamalari: {
    headerRegex:
      /^(?:(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRENMEÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME|ÖĞRETMEÖĞRENME|Öğrenme\s*[-–]?\s*Öğretme|Öğretme\s*[-–]?\s*Öğrenme)\s*(?:UYGULAMALAR[Iİ]|YAŞANT[Iİ]LAR[Iİ]|Uygulamaları|Yaşantıları)|ÖĞRETME\s*UYGULAMALAR[Iİ]|ÖĞRENME\s*UYGULAMALAR[Iİ])(?=$|\s|[:|-])/i,
    stopRegex:
      /^(?:FARKL[Iİ]LAŞT[Iİ]RMA|Farklılaştırma|ZENG[İI]NLEŞT[İI]RME|DESTEKLEME|UYGUNDUR)(?=$|\s|[:|-])/i,
    semanticKeywords: [
      "öğrenme birimi işlenirken",
      "araştırma görevi verilir",
      "sınıfta paylaşmaları sağlanır",
      "grup tartışmaları yapılır",
      "örnek olaylar üzerinden",
      "dereceli puanlama anahtarı",
      "öğretmen tarafından",
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
  const dbfLines = (rawDbfText || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // If searching for Ogrenme_Kanitlari, strictly run our dedicated Ders Bilgi Formu extractor first
  if (sectionKey === "Ogrenme_Kanitlari" && dbfLines.length > 0) {
    const dedicatedKanitlar = extractOgrenmeKanitlariFromDbf(dbfLines, []);
    if (dedicatedKanitlar && dedicatedKanitlar.length >= profile.minChars) {
      return dedicatedKanitlar;
    }
  }

  // Stage 1A: Direct Header & Synonym Boundary Scan strictly in Ders Bilgi Formu lines first
  if (dbfLines.length > 0) {
    const dbfStage1 = extractSectionBetweenHeadings(
      dbfLines,
      profile.headerRegex,
      profile.stopRegex,
      200,
      profile.maxChars
    );
    if (dbfStage1 && dbfStage1.length >= profile.minChars) {
      return dbfStage1;
    }
  }

  const combinedSource = [rawDbfText || "", rawYillikPlanText || ""]
    .filter(Boolean)
    .join("\n");
  if (!combinedSource.trim()) return "";

  const sourceLines = combinedSource
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Stage 1B: Direct Header & Synonym Boundary Scan across combined source (only if not Ogrenme_Kanitlari when dbf exists)
  if (sectionKey !== "Ogrenme_Kanitlari" || dbfLines.length === 0) {
    const stage1Match = extractSectionBetweenHeadings(
      sourceLines,
      profile.headerRegex,
      profile.stopRegex,
      200,
      profile.maxChars
    );
    if (stage1Match && stage1Match.length >= profile.minChars) {
      return stage1Match;
    }
  }

  // Stage 2: Characteristic Regex Pattern Match across the raw text
  const stage2Source =
    dbfLines.length > 0 && sectionKey === "Ogrenme_Kanitlari"
      ? rawDbfText
      : combinedSource;
  for (const regex of profile.characteristicPhrases) {
    const match = stage2Source.match(regex);
    if (match) {
      const captured = (match[1] || match[0]).trim();
      if (captured.length >= profile.minChars) {
        return captured.slice(0, profile.maxChars);
      }
    }
  }

  // Stage 3: Sliding Window Semantic Keyword Density (skip for Ogrenme_Kanitlari so Öğretme Uygulamaları or Yıllık Plan never masquerade as Öğrenme Kanıtları)
  if (sectionKey !== "Ogrenme_Kanitlari") {
    const paragraphs = combinedSource
      .split(
        /\n{2,}|(?=\b(?:TEMEL\s*KABULLER|ÖN\s*DEĞERLENDİRME|KÖPRÜ\s*KURMA|ÖĞRENME\s*KANITLARI|(?:ÖĞRETME\s*[-–]?\s*ÖĞRENME|ÖĞRENME\s*[-–]?\s*ÖĞRETME))\b)/i
      )
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter((p) => p.length >= profile.minChars);

    let bestParagraph = "";
    let bestScore = 0;

    for (const para of paragraphs) {
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
  // 1. Check pre-indexed unit/topic bullets in weekData (derived from structuredDbf)
  if (weekData.unitOgretmeUygulamalari.length > 0) {
    return weekData.unitOgretmeUygulamalari;
  }

  const rawDbf = structuredDbf.rawDbfText || "";
  const unitName = (weekData.ogrenmeBirimi || "").trim();
  const topicName = (weekData.icerikCercevesi || "").trim();

  // 2. Search rawDbfText directly around the unit name or topic name heading (e.g. "* Generatif Üretim:", "* Generatif Bitki Organları:")
  for (const candidateHeader of [topicName, unitName]) {
    if (rawDbf && candidateHeader && candidateHeader.length >= 3) {
      const escapedHeader = candidateHeader.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const blockRegex = new RegExp(
        `(?:^|\\n)\\s*[*•\\-–]?\\s*${escapedHeader}\\s*:\\s*([\\s\\S]{40,3500}?)(?=\\n\\s*[*•\\-–]?\\s*[A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜa-zçğıöşü\\s,'()-]{2,55}:\\s|\\n\\s*(?:ÖĞRENME\\s*[-–]?\\s*ÖĞRETME\\s*ORTAM|ORTAM\\s*VE\\s*DONANIM|Ortam\\s*:|ÖĞRENME\\s*BİRİMİ|UYGULAMA\\s*FAALİYETLERİ|FARKL[Iİ]LAŞT[Iİ]RMA|Farklılaştırma|UYGUNDUR)|$)`,
        "i"
      );
      const match = rawDbf.match(blockRegex);
      if (match && match[1]) {
        const bullets = splitOgretmeUygulamalariIntoBullets(
          `${unitName || candidateHeader}:\n${match[1].trim()}`,
          unitName || candidateHeader
        );
        if (bullets.length >= 2) {
          return bullets;
        }
      }
    }
  }

  // 3. Auto-search the entire Öğrenme-Öğretme Yaşantıları / Uygulamaları section in rawDbfText and filter by this week's topic keywords
  const rawSection = autoSearchDocumentSectionFallback(
    "Ogretme_Uygulamalari",
    rawDbf,
    structuredDbf.rawYillikPlanText || "",
    "",
    weekData,
    aiCandidateBullets?.join(" ")
  );
  if (rawSection) {
    const cleanRawSection = rawSection
      .replace(/^[\s\S]*?KÖPRÜ\s*KURMA\s*[:|-]?\s*[^\n]+\n?/i, "")
      .replace(
        /^(?:(?:ÖĞRENME\s*[-–]?\s*ÖĞRETME|ÖĞRETME\s*[-–]?\s*ÖĞRENME)\s*(?:YAŞANTILARI|UYGULAMALARI)|ÖĞRETME\s*UYGULAMALARI)\s*[:|-]?\s*/i,
        ""
      )
      .trim();
    const allBullets = splitOgretmeUygulamalariIntoBullets(
      cleanRawSection,
      unitName
    );
    if (allBullets.length >= 2) {
      const topicWords = `${topicName} ${weekData.weekSubComponents.join(" ")}`
        .toLocaleLowerCase("tr-TR")
        .replace(/[^\p{L}\s]/gu, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 4);
      if (topicWords.length > 0 && allBullets.length > 5) {
        const matchedBullets = allBullets.filter((b) => {
          if (b.endsWith(":")) return false;
          const bLower = b.toLocaleLowerCase("tr-TR");
          return topicWords.some((tw) => bLower.includes(tw.slice(0, 5)));
        });
        if (matchedBullets.length >= 2) {
          return [
            ...(unitName ? [`${unitName}:`] : []),
            ...matchedBullets,
          ];
        }
      }
      return allBullets;
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

  // Case 1: Pre-extracted verbatim section from Ders Bilgi Formu exists -> Always lock 1:1 verbatim
  if (cleanPreExtracted.length >= 15) {
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

  // 2. Resolve Öğretme Uygulamaları strictly from the Ders Bilgi Formu unit/topic block (preserving trailing Maarif codes)
  let finalOgretmeUygulamalari = autoSearchOgretmeUygulamalariBulletsFallback(
    structuredDbf,
    weekData,
    aiPlan?.Ogrenme_Ogretme_Yasantilari?.Ogretme_Uygulamalari
  );
  if (finalOgretmeUygulamalari.length === 0) {
    finalOgretmeUygulamalari = fallbackActivities.Ogretme_Uygulamalari;
  } else {
    finalOgretmeUygulamalari = finalOgretmeUygulamalari.map((s) =>
      s.replace(/^\*\s*/, "").trim()
    );
  }

  // 3. Resolve Ders Bilgi Formu sections (using week/unit/topic-filtered unitOgrenmeKanitlari for Öğrenme Kanıtları)
  const finalOgrenmeKanitlari = resolveDbfSectionWithSimilarityAndFallback(
    "Ogrenme_Kanitlari",
    weekData.unitOgrenmeKanitlari || structuredDbf.ogrenmeKanitlari,
    aiPlan?.Ogrenme_Kanitlari,
    structuredDbf,
    weekData,
    materyalSlice,
    `${cleanDers} dersinde öğrenci performansını belirlemeye yönelik çalışmalar değerlendirilirken gözlem formu, akran değerlendirme, öz değerlendirme, derecelendirme ölçeği ve dereceli puanlama anahtarı (rubrik) gibi ölçme araçlarından uygun olanlar seçilerek kullanılabilir.\n${weekData.ogrenmeBirimi || cleanDers} ünitesi ve ${weekData.icerikCercevesi || "ilgili konu"} uygulamalarında öğrencilerin süreç odaklı performansları ve uygulama adımları gözlem formları ile izlenerek geri bildirim sağlanır.`
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
    // IMPORTANT: When weekSubMap already has the specific sub-components for this week, only use AI to complete/untruncate those specific letters—never dump other weeks' sub-components into this week!
    const mergedLetters: string[] = [];
    const mergedSubMap = new Map<string, string>();

    for (const [letter, wSub] of weekSubMap.entries()) {
      mergedLetters.push(letter);
      const catSub = catalogEntry?.subComponents[letter];
      const aiSub = aiSubMap.get(letter);
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

    if (weekSubMap.size === 0 && aiSubMap.size > 0) {
      const validAiSubs: Array<[string, string]> = [];
      for (const [letter, aiSub] of aiSubMap.entries()) {
        const verifiedInCorpus = !computeTextSimilarity(
          aiSub,
          fullDocumentCorpus,
          0.55
        ).hasConflict;
        if (verifiedInCorpus) {
          const catSub = catalogEntry?.subComponents[letter];
          validAiSubs.push([
            letter,
            catSub && catSub.length >= aiSub.length ? catSub : aiSub,
          ]);
        }
      }

      if (validAiSubs.length > 2) {
        const offset = ((Math.max(1, weekData.haftaNo) - 1) * 2) % validAiSubs.length;
        const sliced = validAiSubs.slice(offset, offset + 2);
        for (const [l, s] of sliced) {
          mergedLetters.push(l);
          mergedSubMap.set(l, s);
        }
      } else {
        for (const [l, s] of validAiSubs) {
          mergedLetters.push(l);
          mergedSubMap.set(l, s);
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

  // 4B. Re-verify Ogrenme_Birimi and Ogretme_Uygulamalari against finalOutcomesBlock & finalIcerikCercevesi
  let finalOgrenmeBirimi = weekData.ogrenmeBirimi;
  if (
    aiPlan?.Ders_Bilgisi?.Ogrenme_Birimi &&
    aiPlan.Ders_Bilgisi.Ogrenme_Birimi.trim().length >= 3
  ) {
    const aiUnitNorm = normalizeForUnitMatching(
      aiPlan.Ders_Bilgisi.Ogrenme_Birimi
    );
    for (const uName of Object.values(structuredDbf.unitsByNumber)) {
      const knownNorm = normalizeForUnitMatching(uName);
      if (
        knownNorm &&
        (knownNorm === aiUnitNorm ||
          knownNorm.includes(aiUnitNorm) ||
          aiUnitNorm.includes(knownNorm))
      ) {
        finalOgrenmeBirimi = uName;
        break;
      }
    }
  }

  const combinedFinalSignalsNorm = normalizeForUnitMatching(
    `${finalOgrenmeBirimi} ${finalIcerikCercevesi} ${finalOutcomesBlock}`
  );
  for (const [uKey, uBullets] of Object.entries(
    structuredDbf.ogretmeUygulamalariByUnit
  )) {
    if (uKey.startsWith("unit-")) continue;
    const normUKey = normalizeForUnitMatching(uKey);
    const normUnitField = normalizeForUnitMatching(finalOgrenmeBirimi);
    const normIcerikField = normalizeForUnitMatching(finalIcerikCercevesi);
    if (
      normUKey &&
      (normUKey === normUnitField ||
        (normUnitField.length >= 4 &&
          (normUKey.includes(normUnitField) ||
            normUnitField.includes(normUKey))) ||
        (normIcerikField.length >= 4 &&
          (normUKey.includes(normIcerikField) ||
            normIcerikField.includes(normUKey))))
    ) {
      finalOgretmeUygulamalari = uBullets.map((s) =>
        s.replace(/^\*\s*/, "").trim()
      );
      break;
    }
    const distinctiveWords = normUKey
      .split(/\s+/)
      .filter(
        (w) =>
          w.length >= 5 &&
          !/^(?:üretim|üretimi|tarım|tarımda|uygulama|uygulamaları|bitki|bitkisel|yöntem|yöntemleri)$/.test(
            w
          )
      );
    if (
      distinctiveWords.length > 0 &&
      distinctiveWords.every((dw) =>
        combinedFinalSignalsNorm.includes(dw.slice(0, 5))
      )
    ) {
      finalOgretmeUygulamalari = uBullets.map((s) =>
        s.replace(/^\*\s*/, "").trim()
      );
      break;
    }
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
      Ogrenme_Birimi: finalOgrenmeBirimi,
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
    Ogrenme_Kanitlari: cleanOgrenmeKanitlariPrefix(finalOgrenmeKanitlari),
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

