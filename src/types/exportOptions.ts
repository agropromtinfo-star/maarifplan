export interface PlanExportOptions {
  includeSignatureBlock: boolean; // 'İmza bloğu ekle'
  expandTable: boolean; // 'Tabloyu genişlet' (tam genişlik)
  preserveEmptyRows: boolean; // 'Boş satırları koru'
  compactPaperSaver: boolean; // 'Tek sayfaya sığdır / Kağıt tasarrufu'
  printerFriendlyBorders: boolean; // 'Yazıcı dostu sıkıştırılmış çerçeveler'
  fontSizePt: number; // 8.5, 9.0, 9.5, 10
  marginCm: number; // 0.8, 1.0, 1.2, 1.5
}

export const DEFAULT_EXPORT_OPTIONS: PlanExportOptions = {
  includeSignatureBlock: true,
  expandTable: true,
  preserveEmptyRows: true,
  compactPaperSaver: true, // Açık: Kağıttan maksimum tasarruf için sıkıştırılmış
  printerFriendlyBorders: false, // Örnek PDF tasarımı (#4bacc6 tablo kenarlığı ve #c2d69b yeşil başlıklar)
  fontSizePt: 9.0, // Örnek PDF ile birebir uyumlu 9pt yazı boyutu
  marginCm: 0.8, // Sıkıştırılmış 0.8cm kenar boşluğu
};
