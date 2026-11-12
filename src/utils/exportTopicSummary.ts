/**
 * Exports Student Topic Summary & Study Note to Word (.doc/.docx compatible) and PDF
 */

import { GeneratedTopicSummary, TopicSummaryParams } from "./topicSummaryGenerator";

function escapeHtml(text: string): string {
  return (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function markdownToWordHtml(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const htmlParts: string[] = [];

  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      continue;
    }

    if (line === "---") {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push('<hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 16px 0;" />');
      continue;
    }

    // Headers
    if (line.startsWith("# ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push(
        `<h1 style="color: #0f172a; font-size: 18pt; margin: 12px 0 6px 0; border-bottom: 2px solid #0d9488; padding-bottom: 4px;">${formatInline(
          line.slice(2)
        )}</h1>`
      );
      continue;
    }
    if (line.startsWith("## ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push(
        `<h2 style="color: #0f766e; font-size: 13pt; margin: 14px 0 4px 0; background-color: #f0fdfa; padding: 6px 10px; border-left: 4px solid #0d9488;">${formatInline(
          line.slice(3)
        )}</h2>`
      );
      continue;
    }
    if (line.startsWith("### ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push(
        `<h3 style="color: #1e293b; font-size: 11pt; margin: 10px 0 3px 0;">${formatInline(
          line.slice(4)
        )}</h3>`
      );
      continue;
    }

    // Callout quote
    if (line.startsWith("> ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push(
        `<div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 8px 12px; margin: 8px 0; color: #78350f; font-size: 10pt;">${formatInline(
          line.slice(2)
        )}</div>`
      );
      continue;
    }

    // Bullet items
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList) {
        htmlParts.push('<ul style="margin: 6px 0 6px 20px; padding: 0;">');
        inList = true;
      }
      htmlParts.push(
        `<li style="margin-bottom: 4px; font-size: 10pt; line-height: 1.45;">${formatInline(
          line.slice(2)
        )}</li>`
      );
      continue;
    }

    // Numbered items
    const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push(
        `<div style="margin: 4px 0 4px 10px; font-size: 10pt; line-height: 1.45;"><strong style="color: #0d9488;">${numMatch[1]}.</strong> ${formatInline(
          numMatch[2]
        )}</div>`
      );
      continue;
    }

    if (inList) {
      htmlParts.push("</ul>");
      inList = false;
    }

    // Paragraph
    htmlParts.push(
      `<p style="margin: 5px 0; font-size: 10pt; line-height: 1.5; color: #1e293b;">${formatInline(
        line
      )}</p>`
    );
  }

  if (inList) {
    htmlParts.push("</ul>");
  }

  return htmlParts.join("\n");
}

function formatInline(text: string): string {
  let res = escapeHtml(text);
  // Bold
  res = res.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic
  res = res.replace(/\*(.*?)\*/g, "<em>$1</em>");
  return res;
}

export function buildTopicSummaryFileName(
  dersIsmi: string,
  haftaEtiketi: string
): string {
  const cleanDers = (dersIsmi || "MeslekDersi")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "_")
    .trim();
  const cleanHafta = (haftaEtiketi || "Hafta")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "_")
    .trim();
  return `${cleanDers}_${cleanHafta}_Konu_Ozeti_Ders_Notu`;
}

/**
 * Downloads Word (.docx / .doc compatible) student summary note.
 */
export function downloadTopicSummaryWordDoc(
  summary: GeneratedTopicSummary,
  meta?: Partial<TopicSummaryParams>
) {
  const fileName = buildTopicSummaryFileName(
    summary.dersIsmi,
    summary.haftaEtiketi
  );
  const bodyHtml = markdownToWordHtml(summary.markdownContent);

  const okulAdi = meta?.okulAdi || "MİLLÎ EĞİTİM BAKANLIĞI MESLEKİ VE TEKNİK ANADOLU LİSESİ";
  const egitimYili = meta?.egitimYili || "2026-2027 Eğitim ve Öğretim Yılı";

  const fullHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40" lang="tr">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(fileName)}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 21.0cm 29.7cm;
      margin: 1.5cm 1.5cm 1.5cm 1.5cm;
      mso-header-margin: 1.0cm;
      mso-footer-margin: 1.0cm;
      mso-paper-source: 0;
    }
    div.Section1 { page: Section1; }
    body {
      font-family: 'Times New Roman', Times, serif, Arial;
      color: #1e293b;
      line-height: 1.45;
    }
    table.meta-box {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 9.5pt;
    }
    table.meta-box td {
      border: 1px solid #cbd5e1;
      padding: 5px 8px;
    }
    .header-title {
      text-align: center;
      font-weight: bold;
      color: #0f172a;
      font-size: 11pt;
      margin-bottom: 4px;
    }
    .sub-header-title {
      text-align: center;
      font-weight: bold;
      color: #0d9488;
      font-size: 12pt;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
<div class="Section1">
  <div class="header-title">${escapeHtml(okulAdi)}</div>
  <div class="header-title">${escapeHtml(egitimYili)}</div>
  <div class="sub-header-title">TÜRKİYE YÜZYILI MAARİF MODELİ · ÖĞRENCİ DERS NOTU &amp; KONU ÖZETİ</div>

  <table class="meta-box">
    <tr>
      <td style="width: 20%; background-color: #f1f5f9; font-weight: bold;">Ders Adı:</td>
      <td style="width: 30%; font-weight: bold; color: #0f766e;">${escapeHtml(summary.dersIsmi)}</td>
      <td style="width: 20%; background-color: #f1f5f9; font-weight: bold;">Hafta / Tarih:</td>
      <td style="width: 30%;">${escapeHtml(summary.haftaEtiketi)} (${escapeHtml(summary.tarihAraligi)})</td>
    </tr>
    <tr>
      <td style="background-color: #f1f5f9; font-weight: bold;">Öğrenme Birimi:</td>
      <td colspan="3">${escapeHtml(summary.ogrenmeBirimi)}</td>
    </tr>
    <tr>
      <td style="background-color: #f1f5f9; font-weight: bold;">İçerik Çerçevesi:</td>
      <td colspan="3" style="font-weight: bold;">${escapeHtml(summary.icerikCercevesi)}</td>
    </tr>
  </table>

  ${bodyHtml}

  <div style="margin-top: 24px; padding-top: 8px; border-top: 1px dashed #cbd5e1; font-size: 8.5pt; color: #64748b; text-align: center;">
    Bu konu özeti ders öğretmeni tarafından MEB Türkiye Yüzyılı Maarif Modeli öğretim programı ve ders materyali esas alınarak öğrenciler için hazırlanmıştır.
  </div>
</div>
</body>
</html>`;

  const blob = new Blob(["\ufeff", fullHtml], {
    type: "application/msword;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Triggers PDF export / print dialog with the formatted student summary note.
 */
export function printTopicSummaryPdf(
  summary: GeneratedTopicSummary,
  meta?: Partial<TopicSummaryParams>
) {
  const fileName = buildTopicSummaryFileName(
    summary.dersIsmi,
    summary.haftaEtiketi
  );
  const oldTitle = document.title;
  document.title = fileName;
  try {
    if (window.parent && window.parent.document) {
      window.parent.document.title = fileName;
    }
  } catch {
    // ignore
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    // Fallback if popup blocked
    window.print();
    setTimeout(() => {
      document.title = oldTitle;
    }, 1000);
    return;
  }

  const bodyHtml = markdownToWordHtml(summary.markdownContent);
  const okulAdi = meta?.okulAdi || "MİLLÎ EĞİTİM BAKANLIĞI MESLEKİ VE TEKNİK ANADOLU LİSESİ";
  const egitimYili = meta?.egitimYili || "2026-2027 Eğitim ve Öğretim Yılı";

  printWindow.document.write(`<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(fileName)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 1.2cm;
    }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.45;
      padding: 0;
      margin: 0;
      font-size: 10pt;
    }
    .header {
      text-align: center;
      margin-bottom: 12px;
      border-bottom: 2px solid #0d9488;
      padding-bottom: 8px;
    }
    .header h2 {
      margin: 0 0 2px 0;
      font-size: 11pt;
      color: #334155;
    }
    .header h1 {
      margin: 0;
      font-size: 13pt;
      color: #0f766e;
      font-weight: 700;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 9pt;
    }
    .meta-table td {
      border: 1px solid #cbd5e1;
      padding: 4px 8px;
    }
    .meta-label {
      background-color: #f1f5f9;
      font-weight: 600;
      width: 22%;
    }
    h2 {
      color: #0f766e;
      font-size: 11.5pt;
      border-left: 3px solid #0d9488;
      padding-left: 6px;
      margin: 14px 0 6px 0;
    }
    h3 {
      font-size: 10pt;
      color: #334155;
      margin: 8px 0 4px 0;
    }
    p, li {
      color: #1e293b;
      font-size: 9.5pt;
    }
    ul {
      margin: 4px 0 6px 20px;
      padding: 0;
    }
    li {
      margin-bottom: 3px;
    }
    .footer {
      margin-top: 18px;
      padding-top: 8px;
      border-top: 1px dashed #cbd5e1;
      font-size: 8pt;
      color: #64748b;
      text-align: center;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>${escapeHtml(okulAdi)} · ${escapeHtml(egitimYili)}</h2>
    <h1>TÜRKİYE YÜZYILI MAARİF MODELİ · ÖĞRENCİ DERS NOTU &amp; KONU ÖZETİ</h1>
  </div>

  <table class="meta-table">
    <tr>
      <td class="meta-label">Ders / Sınıf:</td>
      <td style="font-weight: 600; color: #0f766e;">${escapeHtml(summary.dersIsmi)}</td>
      <td class="meta-label">Hafta / Tarih:</td>
      <td>${escapeHtml(summary.haftaEtiketi)} (${escapeHtml(summary.tarihAraligi)})</td>
    </tr>
    <tr>
      <td class="meta-label">Öğrenme Birimi:</td>
      <td colspan="3">${escapeHtml(summary.ogrenmeBirimi)}</td>
    </tr>
    <tr>
      <td class="meta-label">İçerik Çerçevesi:</td>
      <td colspan="3" style="font-weight: 600;">${escapeHtml(summary.icerikCercevesi)}</td>
    </tr>
  </table>

  <div class="content">
    ${bodyHtml}
  </div>

  <div class="footer">
    Türkiye Yüzyılı Maarif Modeli · Öğrenci Çalışma Notu ve Konu Özeti
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`);
  printWindow.document.close();

  setTimeout(() => {
    document.title = oldTitle;
  }, 1000);
}
