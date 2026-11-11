import { MaarifLessonPlan, DocumentHeaderFooterMeta } from "../types/lessonPlan";
import { formatFullWeekAndDateRange } from "../shared/maarifPlanEngine";
import { PlanExportOptions, DEFAULT_EXPORT_OPTIONS } from "../types/exportOptions";

function escapeHtml(text: string): string {
  return (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Highlights Maarif Modeli codes like "E2.2. ", "SDB2.2. ", "D12. ", "OB1. ", "KB2.2. ", "a) " in bold
function formatWithBoldCodesHtml(text: string): string {
  const escaped = escapeHtml(text || "");
  return escaped
    .replace(
      /\b([A-ZÇĞİÖŞÜ]{1,5}\d+(?:\.\d+)*\.)(?=\s|$)/g,
      "<strong>$1</strong>"
    )
    .replace(/(^|\n)\s*([a-zçğıöşü]\))/gi, "$1<strong>$2</strong>")
    .replace(/\n/g, "<br/>");
}

function formatOgrenmeCiktilariHtml(text: string): string {
  const lines = (text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return "";
  return lines
    .map((line, idx) => {
      const cleaned = line.replace(/^[•*-]\s*/, "");
      if (idx === 0 || /^[A-ZÇĞİÖŞÜ]{2,6}\.\d+/.test(cleaned)) {
        return `<div><strong>${escapeHtml(cleaned)}</strong></div>`;
      }
      const subMatch = cleaned.match(/^([a-zçğıöşü]\))\s*(.*)$/i);
      if (subMatch) {
        return `<div><strong>${escapeHtml(subMatch[1])}</strong> ${escapeHtml(
          subMatch[2]
        )}</div>`;
      }
      return `<div>${escapeHtml(cleaned)}</div>`;
    })
    .join("");
}

function formatAsteriskLinesHtml(items: string[]): string {
  return (items || [])
    .map((item) => {
      const cleaned = (item || "").trim().replace(/^\*\s*/, "");
      return `<div style="margin-bottom:2px;">* ${escapeHtml(cleaned)}</div>`;
    })
    .join("");
}

export function downloadWordDoc(
  plan: MaarifLessonPlan,
  meta?: DocumentHeaderFooterMeta,
  exportOptions?: Partial<PlanExportOptions>
) {
  const options: PlanExportOptions = {
    ...DEFAULT_EXPORT_OPTIONS,
    ...(exportOptions || {}),
  };

  const {
    Ders_Bilgisi: db,
    Programlar_Arasi_Bilesenler: pab,
    Ogrenme_Ciktilari_ve_Surec_Bilesenleri: ocsb,
    Icerik_Cercevesi: ic,
    Ogrenme_Kanitlari: ok,
    Ogrenme_Ogretme_Yasantilari: ooy,
    Farklilastirma: fark,
  } = plan;

  const okulAdi = meta?.okulAdi?.trim()
    ? meta.okulAdi.trim().toLocaleUpperCase("tr-TR")
    : "";
  const dersIsmi = (meta?.dersIsmi?.trim() || db.Ders || "DERS").toLocaleUpperCase(
    "tr-TR"
  );
  const sinifDuzeyi = (
    meta?.sinifDuzeyi?.trim() ||
    db.Sinif ||
    "9. SINIF"
  ).toLocaleUpperCase("tr-TR");

  // Output ALWAYS displays the week label and the date range together
  const haftaSatiri = formatFullWeekAndDateRange(
    meta?.haftaEtiketi,
    meta?.tarihAraligi
  );

  const onayTarihi = meta?.onayTarihi?.trim() || "..../..../202...";
  const ogretmenAdSoyad =
    meta?.ogretmenAdSoyad?.trim() || "........................";
  const ogretmenBransi = meta?.ogretmenBransi?.trim() || "Ders Öğretmeni";
  const okulMuduruAdSoyad =
    meta?.okulMuduruAdSoyad?.trim() || "........................";

  const secondTitleLine = `${sinifDuzeyi} ${dersIsmi}${
    dersIsmi.endsWith("DERSİ") ? "" : " DERSİ"
  } GÜNLÜK DERS PLANI`;

  // Paper-saving & printer-friendly calculations
  const marginVal = `${options.marginCm}cm`;
  const fontSizeVal = `${options.fontSizePt}pt`;
  const lineHeightVal = options.compactPaperSaver ? "1.16" : "1.34";
  const cellPaddingVal = options.compactPaperSaver ? "2.5px 5px" : "5px 7px";
  const headerFontSizeVal = options.compactPaperSaver ? "10pt" : "11pt";
  const headerMarginVal = options.compactPaperSaver ? "6px" : "12px";
  const borderColorVal = options.printerFriendlyBorders ? "#3b8296" : "#4bacc6";
  const bannerBgVal = options.printerFriendlyBorders ? "#d8e6c3" : "#c2d69b";

  // Filter helper for 'Boş satırları koru' setting
  const shouldRenderRow = (textValue?: string, arrayValue?: string[]) => {
    if (options.preserveEmptyRows) return true;
    if (textValue && textValue.trim().length > 0) return true;
    if (arrayValue && arrayValue.some((item) => item && item.trim().length > 0)) {
      return true;
    }
    return false;
  };

  const htmlContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40" lang="tr">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(secondTitleLine)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: ${marginVal} ${marginVal} ${marginVal} ${marginVal};
      mso-header-margin: 0.5cm;
      mso-footer-margin: 0.5cm;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: ${fontSizeVal};
      color: #000000;
      line-height: ${lineHeightVal};
      margin: 0;
      padding: 0;
    }
    .doc-header {
      text-align: center;
      font-weight: bold;
      font-size: ${headerFontSizeVal};
      margin-bottom: ${headerMarginVal};
      line-height: 1.3;
    }
    table.plan-table {
      width: ${options.expandTable ? "100%" : "98%"};
      margin: 0 auto;
      border-collapse: collapse;
      border: 1px solid ${borderColorVal};
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    table.plan-table td {
      border: 1px solid ${borderColorVal};
      padding: ${cellPaddingVal};
      vertical-align: middle;
      text-align: left;
    }
    .section-banner {
      background-color: ${bannerBgVal};
      font-weight: bold;
      font-size: ${options.compactPaperSaver ? "8.5pt" : "9.5pt"};
      color: #000000;
      text-transform: uppercase;
      padding: ${options.compactPaperSaver ? "3px 5px" : "5px 7px"};
      mso-background-source: auto;
    }
    .label-cell {
      font-weight: bold;
      width: 22%;
    }
    .value-cell-half {
      width: 28%;
    }
    .label-cell-mid {
      font-weight: bold;
      width: 16%;
    }
    .value-cell-right {
      width: 34%;
    }
    .sig-table {
      width: 100%;
      border: none;
      margin-top: ${options.compactPaperSaver ? "8px" : "16px"};
      page-break-inside: avoid;
    }
    .sig-table td {
      border: none;
      text-align: center;
      vertical-align: bottom;
      font-size: ${options.compactPaperSaver ? "8.5pt" : "9.5pt"};
      line-height: 1.35;
    }
  </style>
</head>
<body>
  <div class="doc-header">
    <div>${escapeHtml(okulAdi)}</div>
    <div>${escapeHtml(secondTitleLine)}</div>
    <div>${escapeHtml(haftaSatiri)}</div>
  </div>

  <table class="plan-table">
    <tr>
      <td colspan="4" class="section-banner">DERS BİLGİSİ</td>
    </tr>
    <tr>
      <td class="label-cell">Sınıf</td>
      <td class="value-cell-half">${escapeHtml(sinifDuzeyi)}</td>
      <td class="label-cell-mid">Ders</td>
      <td class="value-cell-right">${escapeHtml(dersIsmi)}</td>
    </tr>
    <tr>
      <td class="label-cell">Öğrenme Birimi</td>
      <td class="value-cell-half"><strong>${escapeHtml(db.Ogrenme_Birimi)}</strong></td>
      <td class="label-cell-mid">Süre</td>
      <td class="value-cell-right"><strong>${escapeHtml(db.Sure)}</strong></td>
    </tr>
    ${
      shouldRenderRow(db.Alan_Becerileri)
        ? `<tr>
      <td class="label-cell">Alan Becerileri</td>
      <td colspan="3">${formatWithBoldCodesHtml(db.Alan_Becerileri)}</td>
    </tr>`
        : ""
    }
    ${
      shouldRenderRow(db.Egilimler)
        ? `<tr>
      <td class="label-cell">Eğilimler</td>
      <td colspan="3">${formatWithBoldCodesHtml(db.Egilimler)}</td>
    </tr>`
        : ""
    }

    <tr>
      <td colspan="4" class="section-banner">PROGRAMLAR ARASI BİLEŞENLER</td>
    </tr>
    ${
      shouldRenderRow(pab.Sosyal_Duygusal_Ogrenme_Becerileri)
        ? `<tr>
      <td class="label-cell">Sosyal-Duygusal Öğr. Bec.</td>
      <td colspan="3">${formatWithBoldCodesHtml(
        pab.Sosyal_Duygusal_Ogrenme_Becerileri
      )}</td>
    </tr>`
        : ""
    }
    ${
      shouldRenderRow(pab.Degerler)
        ? `<tr>
      <td class="label-cell">Değerler</td>
      <td colspan="3">${formatWithBoldCodesHtml(pab.Degerler)}</td>
    </tr>`
        : ""
    }
    ${
      shouldRenderRow(pab.Okuryazarlik_Becerileri)
        ? `<tr>
      <td class="label-cell">Okuryazarlık Becerileri</td>
      <td colspan="3">${formatWithBoldCodesHtml(pab.Okuryazarlik_Becerileri)}</td>
    </tr>`
        : ""
    }
    ${
      shouldRenderRow(pab.Disiplinler_Arasi_Iliski)
        ? `<tr>
      <td class="label-cell">Disiplinler Arası İlişki</td>
      <td colspan="3">${formatWithBoldCodesHtml(pab.Disiplinler_Arasi_Iliski)}</td>
    </tr>`
        : ""
    }
    ${
      shouldRenderRow(pab.Beceriler_Arasi_Iliski)
        ? `<tr>
      <td class="label-cell">Beceriler Arası İlişki</td>
      <td colspan="3">${formatWithBoldCodesHtml(pab.Beceriler_Arasi_Iliski)}</td>
    </tr>`
        : ""
    }

    <tr>
      <td class="label-cell">Öğrenme Çıktıları ve Süreç Bileşenleri</td>
      <td colspan="3">${formatOgrenmeCiktilariHtml(ocsb)}</td>
    </tr>
    <tr>
      <td class="label-cell">İçerik Çerçevesi</td>
      <td colspan="3"><strong>${escapeHtml(ic)}</strong></td>
    </tr>
    ${
      shouldRenderRow(ok)
        ? `<tr>
      <td class="label-cell">Öğrenme Kanıtları</td>
      <td colspan="3">${formatWithBoldCodesHtml(ok)}</td>
    </tr>`
        : ""
    }

    <tr>
      <td colspan="4" class="section-banner">ÖĞRENME-ÖĞRETME YAŞANTILARI</td>
    </tr>
    ${
      shouldRenderRow(ooy.Temel_Kabuller)
        ? `<tr>
      <td class="label-cell">Temel Kabuller</td>
      <td colspan="3">${formatWithBoldCodesHtml(ooy.Temel_Kabuller)}</td>
    </tr>`
        : ""
    }
    ${
      shouldRenderRow(ooy.On_Degerlendirme_Sureci)
        ? `<tr>
      <td class="label-cell">Ön Değerlendirme Süreci</td>
      <td colspan="3">${formatWithBoldCodesHtml(ooy.On_Degerlendirme_Sureci)}</td>
    </tr>`
        : ""
    }
    ${
      shouldRenderRow(ooy.Kopru_Kurma)
        ? `<tr>
      <td class="label-cell">Köprü Kurma</td>
      <td colspan="3">${formatWithBoldCodesHtml(ooy.Kopru_Kurma)}</td>
    </tr>`
        : ""
    }
    ${
      shouldRenderRow(undefined, ooy.Ogretme_Uygulamalari)
        ? `<tr>
      <td class="label-cell">Öğretme Uygulamaları</td>
      <td colspan="3">${formatAsteriskLinesHtml(ooy.Ogretme_Uygulamalari)}</td>
    </tr>`
        : ""
    }
    ${
      shouldRenderRow(undefined, ooy.Guduleme)
        ? `<tr>
      <td class="label-cell">Güdüleme</td>
      <td colspan="3">${formatAsteriskLinesHtml(ooy.Guduleme)}</td>
    </tr>`
        : ""
    }
    ${
      shouldRenderRow(undefined, ooy.Dikkat_Cekme)
        ? `<tr>
      <td class="label-cell">Dikkat Çekme</td>
      <td colspan="3">${formatAsteriskLinesHtml(ooy.Dikkat_Cekme)}</td>
    </tr>`
        : ""
    }
    ${
      shouldRenderRow(undefined, ooy.Ek_Ogretme_Uygulamalari)
        ? `<tr>
      <td class="label-cell">Ek Öğretme Uygulamaları</td>
      <td colspan="3">${formatAsteriskLinesHtml(ooy.Ek_Ogretme_Uygulamalari)}</td>
    </tr>`
        : ""
    }

    <tr>
      <td colspan="4" class="section-banner">FARKLILAŞTIRMA</td>
    </tr>
    ${
      shouldRenderRow(fark)
        ? `<tr>
      <td class="label-cell">Farklılaştırma Uygulamaları</td>
      <td colspan="3">${formatWithBoldCodesHtml(fark)}</td>
    </tr>`
        : ""
    }
  </table>

  ${
    options.includeSignatureBlock
      ? `<table class="sig-table">
    <tr>
      <td style="width:50%;">
        <br/>
        <div>${escapeHtml(ogretmenAdSoyad)}</div>
        <div><strong>${escapeHtml(ogretmenBransi)}</strong></div>
      </td>
      <td style="width:50%;">
        <div>UYGUNDUR</div>
        <div>${escapeHtml(onayTarihi)}</div>
        <div>${escapeHtml(okulMuduruAdSoyad)}</div>
        <div><strong>Okul Müdürü</strong></div>
      </td>
    </tr>
  </table>`
      : ""
  }
</body>
</html>`;

  const blob = new Blob(["\ufeff", htmlContent], {
    type: "application/msword;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeCourse = `${haftaSatiri}-${dersIsmi}`
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöç]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  a.href = url;
  a.download = `${safeCourse || "gunluk-ders-plani"}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
