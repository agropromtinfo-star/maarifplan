import React, { useState } from "react";
import { PlanExportOptions, DEFAULT_EXPORT_OPTIONS } from "../types/exportOptions";
import { MaarifLessonPlan, DocumentHeaderFooterMeta } from "../types/lessonPlan";
import { downloadWordDoc } from "../utils/exportPlan";
import { formatFullWeekAndDateRange } from "../shared/maarifPlanEngine";
import {
  FileDown,
  Printer,
  Sparkles,
  Settings2,
  Check,
  X,
  Maximize2,
  Minimize2,
  PenTool,
  Sliders,
  FileSpreadsheet,
  FileCheck2,
} from "lucide-react";

interface ExportConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MaarifLessonPlan;
  meta: DocumentHeaderFooterMeta;
  onExecutePrint?: (options: PlanExportOptions) => void;
}

export const ExportConfigModal: React.FC<ExportConfigModalProps> = ({
  isOpen,
  onClose,
  plan,
  meta,
  onExecutePrint,
}) => {
  const [options, setOptions] = useState<PlanExportOptions>({
    ...DEFAULT_EXPORT_OPTIONS,
  });

  if (!isOpen) return null;

  const displayHafta = formatFullWeekAndDateRange(
    meta.haftaEtiketi,
    meta.tarihAraligi
  );

  const applyPreset = (preset: "paper_saver" | "standard") => {
    if (preset === "paper_saver") {
      setOptions({
        includeSignatureBlock: true,
        expandTable: true,
        preserveEmptyRows: false, // Boş alanları gizleyerek tek sayfaya sığdır
        compactPaperSaver: true,
        printerFriendlyBorders: true,
        fontSizePt: 8.5,
        marginCm: 0.8,
      });
    } else {
      setOptions({
        includeSignatureBlock: true,
        expandTable: true,
        preserveEmptyRows: true,
        compactPaperSaver: false,
        printerFriendlyBorders: true,
        fontSizePt: 9.5,
        marginCm: 1.2,
      });
    }
  };

  const handleDownloadWord = () => {
    downloadWordDoc(plan, meta, options);
    onClose();
  };

  const handlePrint = () => {
    if (onExecutePrint) {
      onExecutePrint(options);
    } else {
      window.print();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Dışa Aktarma &amp; Yazdırma Yapılandırıcısı
              </h3>
              <p className="text-xs text-slate-500">
                Kağıt tasarrufu, sıkıştırılmış kenarlıklar ve tek sayfaya sığdırma ayarları
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Plan Summary Pill */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-slate-700">Hedef Evrak:</span>
          <span className="font-bold text-indigo-950 truncate">{displayHafta}</span>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Hızlı Hazır Ayarlar (Presets)
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => applyPreset("paper_saver")}
              className={`p-3 rounded-xl border text-left transition-all ${
                options.compactPaperSaver && options.marginCm <= 0.8
                  ? "bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20 text-emerald-950"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tek Sayfa / Kağıt Tasarrufu</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                0.8 cm sıkıştırılmış kenar, 8.5 pt yazı boyutu, maksimum metin yoğunluğu.
              </p>
            </button>

            <button
              type="button"
              onClick={() => applyPreset("standard")}
              className={`p-3 rounded-xl border text-left transition-all ${
                !options.compactPaperSaver && options.marginCm >= 1.2
                  ? "bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20 text-indigo-950"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <FileCheck2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Resmî Standart Format</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                1.2 cm kenar boşluğu, 9.5 pt standart metin ve tam satır düzeni.
              </p>
            </button>
          </div>
        </div>

        {/* Granular Toggles */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Detaylı Dışa Aktarma Seçenekleri
          </label>

          {/* 1. İmza Bloğu Ekle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="space-y-0.5 pr-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-indigo-600" />
                <span>İmza Bloğu Ekle</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Sayfa altına Ders Öğretmeni ve Okul Müdürü (UYGUNDUR) imza alanını ekler.
              </p>
            </div>
            <input
              type="checkbox"
              checked={options.includeSignatureBlock}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  includeSignatureBlock: e.target.checked,
                }))
              }
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 shrink-0"
            />
          </div>

          {/* 2. Tabloyu Genişlet */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="space-y-0.5 pr-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Tabloyu Genişlet (Tam Genişlik)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Tabloyu sayfanın %100 genişliğine yayarak yatay alandan maksimum verim alır.
              </p>
            </div>
            <input
              type="checkbox"
              checked={options.expandTable}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  expandTable: e.target.checked,
                }))
              }
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 shrink-0"
            />
          </div>

          {/* 3. Boş Satırları Koru */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="space-y-0.5 pr-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
                <span>Boş Satırları Koru</span>
              </div>
              <p className="text-[11px] text-slate-500">
                İşaretlendiğinde boş alanlar satır olarak kalır; kapatıldığında boş alanlar gizlenerek kağıttan tasarruf edilir.
              </p>
            </div>
            <input
              type="checkbox"
              checked={options.preserveEmptyRows}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  preserveEmptyRows: e.target.checked,
                }))
              }
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 shrink-0"
            />
          </div>

          {/* 4. Yazıcı Dostu Sıkıştırılmış Çerçeveler */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="space-y-0.5 pr-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Minimize2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Yazıcı Dostu Sıkıştırılmış Çerçeveler</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Kenar çerçeveleri sıkıştırır, mürekkep ve kağıt tasarrufu için net ve ince kenarlıklar kullanır.
              </p>
            </div>
            <input
              type="checkbox"
              checked={options.printerFriendlyBorders}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  printerFriendlyBorders: e.target.checked,
                }))
              }
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 shrink-0"
            />
          </div>
        </div>

        {/* Sliders / Selectors: Margins & Font Size */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Sayfa Kenar Boşluğu
            </label>
            <select
              value={options.marginCm}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  marginCm: Number(e.target.value),
                }))
              }
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value={0.6}>0.6 cm (Aşırı Sıkı / Maksimum Metin)</option>
              <option value={0.8}>0.8 cm (Önerilen / Kağıt Tasarrufu)</option>
              <option value={1.0}>1.0 cm (Kompakt)</option>
              <option value={1.2}>1.2 cm (Resmî Standart)</option>
              <option value={1.5}>1.5 cm (Geniş)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Metin Yazı Boyutu
            </label>
            <select
              value={options.fontSizePt}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  fontSizePt: Number(e.target.value),
                }))
              }
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value={8.0}>8.0 pt (Maksimum Tek Sayfa Sığdırma)</option>
              <option value={8.5}>8.5 pt (Önerilen Kompakt)</option>
              <option value={9.0}>9.0 pt (Dengeli)</option>
              <option value={9.5}>9.5 pt (Standart)</option>
              <option value={10.0}>10.0 pt (Büyük)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Vazgeç
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Yazdır / PDF Kaydet
            </button>

            <button
              type="button"
              onClick={handleDownloadWord}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              Word (.doc) İndir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
