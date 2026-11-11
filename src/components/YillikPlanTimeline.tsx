import React, { useState, useMemo, useRef } from "react";
import { YillikPlanWeekItem } from "../types/lessonPlan";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  LayoutGrid,
  GitCommitHorizontal,
} from "lucide-react";

interface YillikPlanTimelineProps {
  weeks: YillikPlanWeekItem[];
  selectedWeekId: string;
  onSelectWeek: (weekId: string) => void;
  onSelectAndGenerate?: (weekId: string) => void;
  isFromUploadedPlan: boolean;
  isGenerating?: boolean;
}

export const YillikPlanTimeline: React.FC<YillikPlanTimelineProps> = ({
  weeks,
  selectedWeekId,
  onSelectWeek,
  onSelectAndGenerate,
  isFromUploadedPlan,
  isGenerating = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Extract distinct learning units from the weeks list
  const learningUnits = useMemo(() => {
    const unitSet = new Set<string>();
    for (const w of weeks) {
      const unit = (w.ogrenmeBirimi || "").trim();
      if (unit && unit.length >= 2) {
        unitSet.add(unit);
      }
    }
    return Array.from(unitSet);
  }, [weeks]);

  const filteredWeeks = useMemo(() => {
    return weeks.filter((w) => {
      if (selectedUnit !== "ALL" && (w.ogrenmeBirimi || "").trim() !== selectedUnit) {
        return false;
      }
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLocaleLowerCase("tr-TR").trim();
      return (
        w.haftaEtiketi.toLocaleLowerCase("tr-TR").includes(q) ||
        w.tarihAraligi.toLocaleLowerCase("tr-TR").includes(q) ||
        (w.ogrenmeBirimi || "").toLocaleLowerCase("tr-TR").includes(q) ||
        (w.konuVeCiktiOzeti || "").toLocaleLowerCase("tr-TR").includes(q)
      );
    });
  }, [weeks, selectedUnit, searchTerm]);

  const scrollTimeline = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const offset = direction === "left" ? -520 : 520;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="no-print mt-4 rounded-xl border border-indigo-200/80 bg-gradient-to-b from-indigo-50/40 via-white to-sky-50/30 p-4 shadow-2xs">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-900 text-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                Yıllık Plan Görsel Zaman Çizelgesi
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                  isFromUploadedPlan
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {isFromUploadedPlan
                  ? `Yüklü Yıllık Plan (${weeks.length} Hafta)`
                  : `MEB Standart Takvim (${weeks.length} Hafta)`}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Hafta kartlarına tıklayarak hedef haftayı, tarih aralığını ve kazanımlarını anında seçebilirsiniz.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Hafta, tarih veya kazanım ara..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                viewMode === "timeline"
                  ? "bg-indigo-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Yatay Zaman Çizelgesi Görünümü"
            >
              <GitCommitHorizontal className="w-3.5 h-3.5" />
              Çizelge
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                viewMode === "grid"
                  ? "bg-indigo-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Tüm Haftalar Tablo/Kart Görünümü"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Tüm Haftalar
            </button>
          </div>

          {/* Scroll Arrows (only in horizontal timeline mode) */}
          {viewMode === "timeline" && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollTimeline("left")}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
                title="Sola Kaydır"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollTimeline("right")}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
                title="Sağa Kaydır"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Learning Unit Filter Bar (if units exist in uploaded Yıllık Plan) */}
      {learningUnits.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 border-b border-slate-200/60">
          <span className="text-[11px] font-semibold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            Öğrenme Birimi:
          </span>
          <button
            type="button"
            onClick={() => setSelectedUnit("ALL")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
              selectedUnit === "ALL"
                ? "bg-indigo-900 text-white"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Tümü ({weeks.length})
          </button>
          {learningUnits.map((unit) => {
            const count = weeks.filter(
              (w) => (w.ogrenmeBirimi || "").trim() === unit
            ).length;
            return (
              <button
                key={unit}
                type="button"
                onClick={() => setSelectedUnit(unit)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedUnit === unit
                    ? "bg-sky-800 text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {unit} ({count} Hafta)
              </button>
            );
          })}
        </div>
      )}

      {/* Timeline Track or Grid View */}
      {filteredWeeks.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-500">
          Arama kriterine uygun hafta bulunamadı.
        </div>
      ) : viewMode === "timeline" ? (
        <div
          ref={scrollContainerRef}
          className="relative flex items-stretch gap-3 overflow-x-auto pt-4 pb-2 scroll-smooth"
        >
          {filteredWeeks.map((week) => {
            const isSelected = week.id === selectedWeekId;
            return (
              <div
                key={week.id}
                onClick={() => onSelectWeek(week.id)}
                className={`group relative shrink-0 w-64 rounded-xl border p-3.5 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-indigo-950 text-white border-indigo-900 shadow-md ring-2 ring-amber-400"
                    : "bg-white hover:bg-indigo-50/40 text-slate-900 border-slate-200/90 hover:border-indigo-300"
                }`}
              >
                {/* Top Timeline Node Indicator */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold tracking-tight ${
                        isSelected
                          ? "bg-amber-400 text-slate-950"
                          : "bg-indigo-100 text-indigo-950"
                      }`}
                    >
                      {week.haftaEtiketi}
                    </span>
                    {week.sure && (
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-medium tabular-nums ${
                          isSelected ? "text-sky-200" : "text-slate-500"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {week.sure}
                      </span>
                    )}
                  </div>

                  {/* Date Range */}
                  <div
                    className={`text-xs font-bold mb-1.5 ${
                      isSelected ? "text-amber-300" : "text-sky-800"
                    }`}
                  >
                    {week.tarihAraligi}
                  </div>

                  {/* Learning Unit Badge */}
                  {week.ogrenmeBirimi && (
                    <div
                      className={`text-[11px] font-semibold mb-1.5 line-clamp-1 ${
                        isSelected ? "text-emerald-300" : "text-teal-800"
                      }`}
                    >
                      Birim: {week.ogrenmeBirimi}
                    </div>
                  )}

                  {/* Outcome / Topic Summary */}
                  {week.konuVeCiktiOzeti ? (
                    <p
                      className={`text-[11px] leading-snug line-clamp-3 ${
                        isSelected ? "text-slate-200" : "text-slate-600"
                      }`}
                    >
                      {week.konuVeCiktiOzeti}
                    </p>
                  ) : (
                    <p
                      className={`text-[11px] italic ${
                        isSelected ? "text-slate-300" : "text-slate-400"
                      }`}
                    >
                      Yıllık plan yüklendiğinde bu haftanın kazanım ve süreç bileşenleri burada listelenir.
                    </p>
                  )}
                </div>

                {/* Footer Action */}
                <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      isSelected ? "text-amber-300" : "text-indigo-700"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Seçili Hafta
                      </>
                    ) : (
                      "Bu Haftayı Seç"
                    )}
                  </span>

                  {onSelectAndGenerate && (
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectWeek(week.id);
                        onSelectAndGenerate(week.id);
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                        isSelected
                          ? "bg-amber-400 text-slate-950 hover:bg-amber-300"
                          : "bg-indigo-50 text-indigo-900 hover:bg-indigo-100"
                      }`}
                      title="Bu haftayı seç ve günlük planı hemen oluştur"
                    >
                      <Sparkles className="w-3 h-3" />
                      Planla
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-3 max-h-80 overflow-y-auto pr-1">
          {filteredWeeks.map((week) => {
            const isSelected = week.id === selectedWeekId;
            return (
              <div
                key={week.id}
                onClick={() => onSelectWeek(week.id)}
                className={`rounded-lg border p-3 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-indigo-950 text-white border-indigo-900 ring-2 ring-amber-400"
                    : "bg-white hover:bg-indigo-50/40 text-slate-900 border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isSelected
                          ? "bg-amber-400 text-slate-950"
                          : "bg-indigo-100 text-indigo-950"
                      }`}
                    >
                      {week.haftaEtiketi}
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        isSelected ? "text-amber-300" : "text-sky-800"
                      }`}
                    >
                      {week.tarihAraligi}
                    </span>
                  </div>
                  {week.ogrenmeBirimi && (
                    <div
                      className={`text-[11px] font-semibold truncate ${
                        isSelected ? "text-emerald-300" : "text-teal-800"
                      }`}
                    >
                      {week.ogrenmeBirimi}
                    </div>
                  )}
                  {week.konuVeCiktiOzeti && (
                    <p
                      className={`text-[10px] mt-1 line-clamp-2 ${
                        isSelected ? "text-slate-200" : "text-slate-600"
                      }`}
                    >
                      {week.konuVeCiktiOzeti}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
