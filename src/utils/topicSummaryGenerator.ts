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
    .map((l) => l.trim())
    .filter((l) => l.length > 3 && !/^(?:ÖĞRENME|SÜREÇ|KOD)/i.test(l))
    .slice(0, 6);

  // Extract substantive paragraphs from materyalText
  const rawParagraphs = (materyalText || "")
    .split(/\r?\n+/)
    .map((p) => p.trim())
    .filter(
      (p) =>
        p.length >= 40 &&
        !/MİLL[İI]\s*EĞİTİM|KİTABI|İÇİNDEKİLER|ÜNİTE\s*\d+|SAYFA\s*\d+/i.test(p)
    );

  const mainExcerpt = rawParagraphs.slice(0, 3).join(" ") ||
    `${cleanDers} dersinde bu hafta ${cleanBirim} ünitesi kapsamında "${cleanKonu}" konusu ele alınmaktadır. Bu konu, mesleki uygulamaların temeli olup günlük hayatta ve sektörde doğrudan karşımıza çıkan kritik prensipleri kapsar.`;

  const secondExcerpt = rawParagraphs.slice(3, 6).join(" ") ||
    `Uygulama sürecinde iş sağlığı ve güvenliği kurallarına dikkat edilmeli, araç-gereçler usulüne uygun şekilde kullanılmalıdır. Öğrenilen teorik bilgiler atölye veya uygulama alanında gözlem ve pratikle pekiştirilir.`;

  // Key concepts extraction
  const keyTerms: Array<{ term: string; desc: string }> = [];
  const words = `${cleanBirim} ${cleanKonu}`.split(/\s+/).filter((w) => w.length >= 4);

  keyTerms.push({
    term: cleanKonu,
    desc: `Bu haftanın ana öğrenme konusu olup ${cleanBirim} çerçevesinde öğrencilerin kazanması gereken temel beceri alanıdır.`,
  });

  if (outcomeBullets.length > 0) {
    const firstOutcome = outcomeBullets[0].replace(/^[A-ZÇĞİÖŞÜ0-9.]+\s*/, "");
    keyTerms.push({
      term: "Temel Öğrenme Çıktısı",
      desc: firstOutcome,
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
3. **Uygulama Aşaması:** ${secondExcerpt.slice(0, 220)}...
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
