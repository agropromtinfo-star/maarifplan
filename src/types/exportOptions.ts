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
  printerFriendlyBorders: true, // Yazıcı dostu net, sıkı çerçeveler
  fontSizePt: 8.5, // Tek sayfaya maksimum yazı alabilmek için 8.5pt
  marginCm: 0.8, // Sıkıştırılmış 0.8cm kenar boşluğu
};
