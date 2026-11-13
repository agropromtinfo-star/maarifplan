import {
  stripFrontMatter,
  extractWeekMateryalSlice,
  WeekSpecificExtraction,
} from "../shared/maarifPlanEngine";

/**
 * High School Student-Friendly Topic Summary & Study Note Generator
 * Formats textbook/course material into a clear, engaging, structured study note.
 */

export interface TopicSummaryParams {
  dersIsmi: string;
  sinifDuzeyi: string;
  okulAdi?: string;
  haftaEtiketi: string;
  tarihAraligi: string;
  ogrenmeBirimi: string;
  icerikCercevesi: string;
  ogrenmeCiktilari: string;
  materyalText?: string;
  egitimYili?: string;
}

export interface GeneratedTopicSummary {
  title: string;
  dersIsmi: string;
  haftaEtiketi: string;
  tarihAraligi: string;
  ogrenmeBirimi: string;
  icerikCercevesi: string;
  markdownContent: string;
  htmlContent: string;
}

/**
 * Strips any textbook front-matter, Ministry approval ("oluru ile"), İstiklal Marşı verses,
 * Gençliğe Hitabe, publication catalog codes, or broken PDF font encodings from a text block.
 */
export function sanitizeStudentSummaryText(rawText: string): string {
  if (!rawText) return "";
  return stripFrontMatter(rawText)
    .replace(
      /Mill[îiİI]\s*Eğitim\s*Bakanlığının\s*\d{1,2}[./]\d{1,2}[./]\d{4}\s*(?:gün|tarih)\s*ve\s*\d+\s*sayılı\s*(?:oluru|kararı)\s*ile[^\n.]*\.?/gi,
      ""
    )
    .replace(
      /Korkma,\s*sönmez\s*bu\s*[şsú]afaklarda\s*yüzen\s*al\s*sancak[;,]?\s*Sönmeden\s*yurdumun\s*üstünde\s*tüten\s*en\s*son\s*ocak\.?/gi,
      ""
    )
    .replace(
      /O\s*benim\s*milletimin\s*yıldızıdır[^\n.]*\.?/gi,
      ""
    )
    .replace(
      /O\s*benimdir,\s*o\s*benim\s*milletimindir\s*ancak\.?/gi,
      ""
    )
    .replace(
      /Çatma,\s*kurban\s*olayım\s*çehrene[^\n.]*\.?/gi,
      ""
    )
    .replace(
      /Kahraman\s*ırkıma\s*bir\s*gül[^\n.]*\.?/gi,
      ""
    )
    .replace(
      /Hakkıdır,\s*Hakk['’]?a\s*tapan\s*milletimin\s*istikl[âa]l\.?/gi,
      ""
    )
    .replace(
      /Ey\s*Türk\s*gençliği\s*!?\s*Birinci\s*vazifen[^\n.]*\.?/gi,
      ""
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isBoilerplateOrFrontMatterParagraph(p: string): boolean {
  const norm = p
    .replace(/ú/g, "ş")
    .replace(/þ/g, "ş")
    .replace(/ý/g, "ı")
    .replace(/ð/g, "ğ")
    .toLocaleLowerCase("tr-TR");

  if (
    /mill[îi]\s*eğitim\s*bakanlığı|talim\s*ve\s*terbiye|sayılı\s*oluru|sayılı\s*kararı|ders\s*materyali\s*olarak|yardımcı\s*ve\s*kaynak\s*kitaplar|ders\s*kitapları\s*dizisi|her\s*hakkı\s*saklıdır|isbn|matbaası|baskı\s*yılı|görsel\s*tasarım|program\s*geliştirme\s*uzmanı|ölçme\s*ve\s*değerlendirme\s*uzmanı|rehberlik\s*uzmanı|editör|yazarlar/.test(
      norm
    )
  ) {
    return true;
  }

  if (
    /korkma,\s*sönmez|yüzen\s*al\s*sancak|sönmeden\s*yurdumun|tüten\s*en\s*son\s*ocak|milletimin\s*yıldızıdır|çatma,\s*kurban\s*olayım|kahraman\s*ırkıma|hakk['’]?a\s*tapan\s*milletimin|istikl[âa]l\s*marşı|mehmet\s*[âa]kif\s*ersoy|ey\s*türk\s*gençliği|birinci\s*vazifen|muhtaç\s*olduğun\s*kudret|damarlarındaki\s*asil\s*kanda|mustafa\s*kemal\s*atatürk/.test(
      norm
    )
  ) {
    return true;
  }

  if (
    /^(?:içindekiler|kitabın\s*tanıtımı|organizasyon\s*şeması|ünite\s*\d+|öğrenme\s*birimi\s*\d+|kaynakça|cevap\s*anahtarı|sözlük)\b/.test(
      norm
    )
  ) {
    return true;
  }

  // Reject lines with table-of-contents dots or excessive numbering
  if (/\.{4,}|\b\d{4,8}\b.*sayılı/.test(norm)) {
    return true;
  }

  return false;
}

/**
 * Deterministic, pedagogically structured student note generator.
 * Works completely offline or as immediate fallback when API key is absent.
 */
export function generateTopicSummaryClientSide(
  params: TopicSummaryParams
): GeneratedTopicSummary {
  const {
    dersIsmi,
    sinifDuzeyi,
    haftaEtiketi,
    tarihAraligi,
    ogrenmeBirimi,
    icerikCercevesi,
    ogrenmeCiktilari,
    materyalText = "",
  } = params;

  const cleanDers = dersIsmi.trim() || "Meslek Dersi";
  const cleanSinif = sinifDuzeyi.trim() || "Lise Düzeyi";
  const cleanBirim = ogrenmeBirimi.trim() || "Öğrenme Birimi";
  const cleanKonu = icerikCercevesi.trim() || "Haftalık Ders Konusu";

  // Clean raw outcome lines into bullet points
  const outcomeBullets = (ogrenmeCiktilari || "")
    .split(/\r?\n/)
    .map((l) => sanitizeStudentSummaryText(l))
    .filter((l) => l.length > 3 && !/^(?:ÖĞRENME|SÜREÇ|KOD)/i.test(l))
    .slice(0, 6);

  // Extract sub-component explanations (a, b, c...) to build accurate topic-specific content
  const subComponentDescriptions = outcomeBullets
    .filter((b) => /^[a-zçğıöşü]\)\s+/i.test(b))
    .map((b) => b.replace(/^[a-zçğıöşü]\)\s+/i, "").trim());

  // Slice textbook material specifically around the active week's unit & topic
  const cleanMateryalText = sanitizeStudentSummaryText(materyalText || "");
  const weekNoMatch = haftaEtiketi.match(/\d+/);
  const weekSearchSpec: WeekSpecificExtraction = {
    haftaNo: weekNoMatch ? Number(weekNoMatch[0]) : 1,
    haftaEtiketi,
    tarihAraligi,
    sure: "",
    ogrenmeBirimi: cleanBirim,
    icerikCercevesi: cleanKonu,
    outcomeCode: "",
    outcomeHeader: outcomeBullets[0] || "",
    weekSubComponents: subComponentDescriptions,
    formattedOutcomeAndProcessBlock: ogrenmeCiktilari || "",
    unitOgrenmeKanitlari: "",
    rawWeekWindowText: "",
    unitOgretmeUygulamalari: [],
    searchKeywords: [
      cleanKonu,
      cleanBirim,
      ...cleanKonu.split(/\s+/).filter((w) => w.length >= 3),
      ...cleanBirim.split(/\s+/).filter((w) => w.length >= 3),
    ],
  };

  const topicMateryalSlice = cleanMateryalText
    ? extractWeekMateryalSlice(cleanMateryalText, weekSearchSpec, 8000)
    : "";

  // Build topic keywords for relevance scoring so unrelated textbook front-matter is NEVER selected
  const topicKeywords = Array.from(
    new Set(
      `${cleanKonu} ${cleanBirim} ${subComponentDescriptions.join(" ")}`
        .toLocaleLowerCase("tr-TR")
        .replace(/[^a-zçğıöşü0-9\s]/g, " ")
        .split(/\s+/)
        .filter(
          (w) =>
            w.length >= 4 &&
            !/^(?:öğrenme|birimi|haftalık|ders|konusu|meslek|dersi|açıklanır|sıralanır|belirtilir|kavranır|uygulanır|yapılır)$/.test(
              w
            )
        )
    )
  );

  const candidateParagraphs = (topicMateryalSlice || cleanMateryalText)
    .split(/\r?\n+/)
    .map((p) => sanitizeStudentSummaryText(p))
    .filter(
      (p) =>
        p.length >= 55 &&
        p.length <= 700 &&
        !isBoilerplateOrFrontMatterParagraph(p)
    );

  // Score each paragraph by how many topic/unit keywords it contains
  const scoredParagraphs = candidateParagraphs
    .map((p) => {
      const lowerP = p.toLocaleLowerCase("tr-TR");
      let score = 0;
      if (
        cleanKonu.length >= 4 &&
        lowerP.includes(cleanKonu.toLocaleLowerCase("tr-TR"))
      ) {
        score += 5;
      }
      if (
        cleanBirim.length >= 4 &&
        lowerP.includes(cleanBirim.toLocaleLowerCase("tr-TR"))
      ) {
        score += 3;
      }
      for (const kw of topicKeywords) {
        const stem = kw.slice(0, Math.min(kw.length, 6));
        if (lowerP.includes(stem)) {
          score += 2;
        }
      }
      return { text: p, score };
    })
    .filter((item) => item.score >= 2)
    .sort((a, b) => b.score - a.score);

  const subComponentSummarySentence =
    subComponentDescriptions.length > 0
      ? `Bu ders kapsamında özellikle; ${subComponentDescriptions
          .map((s) => s.replace(/\.$/, "").toLocaleLowerCase("tr-TR"))
          .join(", ")} konuları üzerinde durulmaktadır.`
      : "";

  const mainExcerpt =
    scoredParagraphs.length > 0
      ? scoredParagraphs
          .slice(0, 2)
          .map((item) => item.text)
          .join(" ")
      : `${cleanDers} dersinde bu hafta "${cleanBirim}" öğrenme birimi kapsamında "${cleanKonu}" konusu ele alınmaktadır. ${subComponentSummarySentence} Bu konu, mesleki uygulamaların temelini oluşturmakta olup sahada ve sektörde doğru üretim ve uygulama yapabilmeniz için kritik ilkeleri kapsar.`;

  const secondExcerpt =
    scoredParagraphs.length > 2
      ? scoredParagraphs
          .slice(2, 4)
          .map((item) => item.text)
          .join(" ")
      : `Uygulama sürecinde "${cleanKonu}" ilkelerine ve iş sağlığı ve güvenliği kurallarına dikkat edilmeli, araç-gereçler ve materyaller tekniğine uygun şekilde seçilerek kullanılmalıdır. Öğrenilen teorik bilgiler atölye, laboratuvar veya uygulama alanında gözlem ve pratikle pekiştirilir.`;

  // Key concepts extraction
  const keyTerms: Array<{ term: string; desc: string }> = [];

  keyTerms.push({
    term: cleanKonu,
    desc: `Bu haftanın ana öğrenme konusu olup "${cleanBirim}" öğrenme birimi çerçevesinde öğrencilerin kazanması gereken temel bilgi ve beceri alanıdır.`,
  });

  if (outcomeBullets.length > 0) {
    const firstOutcome = outcomeBullets[0].replace(/^[A-ZÇĞİÖŞÜ0-9.]+\s*/, "");
    keyTerms.push({
      term: "Hedef Öğrenme Çıktısı",
      desc: firstOutcome,
    });
  }

  for (let i = 0; i < Math.min(2, subComponentDescriptions.length); i++) {
    keyTerms.push({
      term: `${i + 1}. Süreç Bileşeni Odak Noktası`,
      desc: subComponentDescriptions[i],
    });
  }

  keyTerms.push(
    {
      term: "Uygulama Güvenliği (İSG)",
      desc: "Atölye ve saha çalışmalarında kişisel koruyucu donanım kullanımı ve malzeme güvenliği kurallarına harfiyen uyulması.",
    },
    {
      term: "Süreç Değerlendirme",
      desc: "Öğrencinin teorik bilgiyi pratiğe dönüştürme basamaklarının gözlem formu ve kontrol listeleri ile takibi.",
    }
  );

  const title = `${cleanDers} — ${haftaEtiketi} Öğrenci Konu Özeti & Ders Notu`;

  const markdownContent = `# 📖 ${title}
**Sınıf:** ${cleanSinif} | **Hafta & Tarih:** ${haftaEtiketi} (${tarihAraligi})
**Öğrenme Birimi (Ünite):** ${cleanBirim}
**İçerik Çerçevesi (Konu):** ${cleanKonu}

---

## 📌 1. Bu Konuda Neyi, Neden Öğreniyoruz?
Sevgili öğrenci arkadaşım, bu hafta **${cleanDers}** dersinde **"${cleanKonu}"** konusunu ele alıyoruz.

${mainExcerpt}

Bu konu sadece sınavlarda karşına çıkacak bir bilgi değil; atölyede, meslek hayatında ve günlük yaşamda bilinçli, donanımlı ve aranan bir meslek elemanı olmanın en önemli anahtarlarından biridir!

---

## 💡 2. Temel Kavramlar & Bilmen Gerekenler
Bu konuyu tam kavrayabilmek için şu temel terimleri mutlaka bilmelisin:

${keyTerms.map((k) => `- **${k.term}:** ${k.desc}`).join("\n")}

${
  outcomeBullets.length > 0
    ? `### 🎯 Bu Haftanın Hedef Kazanımları:\n${outcomeBullets
        .map((b) => `- ${b}`)
        .join("\n")}`
    : ""
}

---

## ⚙️ 3. Adım Adım Nasıl Uygulanır? (Atölye & Pratik Rehberi)
Atölye veya uygulama sahasında başarıya ulaşmak için şu adımları sırasıyla takip et:

1. **Hazırlık ve Malzeme Kontrolü:** Uygulamaya başlamadan önce gerekli tüm alet, araç ve malzemeleri eksiksiz hazırla ve çalışır durumda olduğunu doğrula.
2. **Güvenlik Tedbirleri:** Kişisel koruyucu donanımlarını (eldiven, önlük, gözlük vb.) eksiksiz tak; çalışma alanını temiz ve düzenli tut.
3. **Uygulama Aşaması:** ${secondExcerpt.slice(0, 260)}
4. **Kayıt ve Raporlama:** Yapılan işlemi adım adım gözlemle; sonuçları uygulama formuna veya not defterine not et.
5. **Temizlik ve Düzen:** Çalışma bittiğinde araç-gereçleri temizleyerek yerine yerleştir, atıkları geri dönüşüm kurallarına göre tasfiye et.

---

## ⚠️ 4. Önemli İpuçları (Sınavda & Atölyede Çıkar!)
> 💡 **Altın Kural:** Uygulamalarda acele etmek yerine aşamaları doğru ve planlı yapmak her zaman en kaliteli sonucu verir!
- **Sık Yapılan Hata:** Teorik bilgiyi atölye pratiğiyle bağdaştırmadan ezbere işlem yapmak. Her adımda "Bunu neden yapıyorum?" sorusunu sor.
- **Sınav İpucu:** Konunun temel kavramlarını ve işlem sırası basamaklarını mutlaka madde madde kendi cümlelerinle yazarak tekrar et.
- **İş Sağlığı Notu:** Yetkili öğretmenin onayı olmadan elektrikli, kesici veya kimyasal araçlarla tek başına çalışmaya başlama.

---

## 🎯 5. Kendini Dene! (Hızlı Pekiştirme Soruları)
Aşağıdaki soruları yanıtlayarak konuyu ne kadar anladığını test et:

**Soru 1:** *${cleanKonu}* konusunun mesleğimiz ve günlük hayatımız açısından en önemli faydası nedir?  
*İpucu:* ${cleanBirim} ünitesinde ele alınan temel prensipleri hatırla.

**Soru 2:** Bu hafta öğrendiğimiz uygulama adımlarından en kritik olanı hangisidir ve neden?  
*İpucu:* İş güvenliği ve malzeme kontrolü adımlarını göz önünde bulundur.

**Soru 3:** Bu konuyu bir arkadaşına 2 cümleyle anlatman gerekse nasıl özetlerdin?  
*İpucu:* Kendi kelimelerinle özet çıkarmak öğrenmeyi kalıcı kılar!

---
*MEB Türkiye Yüzyılı Maarif Modeli Öğrenci Çalışma Notu*`;

  return {
    title,
    dersIsmi: cleanDers,
    haftaEtiketi,
    tarihAraligi,
    ogrenmeBirimi: cleanBirim,
    icerikCercevesi: cleanKonu,
    markdownContent,
    htmlContent: markdownContent,
  };
}

