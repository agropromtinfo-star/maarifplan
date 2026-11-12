import React, { useState, useEffect } from "react";
import {
  GeneratedTopicSummary,
  generateTopicSummaryClientSide,
  TopicSummaryParams,
} from "../utils/topicSummaryGenerator";
import {
  downloadTopicSummaryWordDoc,
  printTopicSummaryPdf,
} from "../utils/exportTopicSummary";
import {
  BookOpen,
  Download,
  Printer,
  Sparkles,
  X,
  RefreshCw,
  Edit3,
  Eye,
  Check,
  AlertCircle,
  FileText,
  Info,
} from "lucide-react";

interface TopicSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: TopicSummaryParams;
}

export const TopicSummaryModal: React.FC<TopicSummaryModalProps> = ({
  isOpen,
  onClose,
  params,
}) => {
  const [summary, setSummary] = useState<GeneratedTopicSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedMarkdown, setEditedMarkdown] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<string>("İçerik Analiz Motoru");

  const generateSummary = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Try server endpoint with Gemini
      const response = await fetch("/api/generate-topic-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ders_ismi: params.dersIsmi,
          sinif_duzeyi: params.sinifDuzeyi,
          okul_adi: params.okulAdi,
          hafta_etiketi: params.haftaEtiketi,
          tarih_araligi: params.tarihAraligi,
          ogrenme_birimi: params.ogrenmeBirimi,
          icerik_cercevesi: params.icerikCercevesi,
          ogrenme_ciktilari: params.ogrenmeCiktilari,
          ders_materyali: params.materyalText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.summaryMarkdown && data.summaryMarkdown.trim().length >= 50) {
          const generated: GeneratedTopicSummary = {
            title: data.title || `${params.dersIsmi} — ${params.haftaEtiketi} Konu Özeti`,
            dersIsmi: params.dersIsmi,
            haftaEtiketi: params.haftaEtiketi,
            tarihAraligi: params.tarihAraligi,
            ogrenmeBirimi: params.ogrenmeBirimi,
            icerikCercevesi: params.icerikCercevesi,
            markdownContent: data.summaryMarkdown,
            htmlContent: data.summaryMarkdown,
          };
          setSummary(generated);
          setEditedMarkdown(generated.markdownContent);
          setSourceType(data.source === "gemini-3.8-flash" ? "Yapay Zeka (Maarif Modeli)" : "Ders Materyali Motoru");
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Server topic summary request error, using client fallback:", err);
    }

    // 2. Client-side deterministic synthesis fallback
    const local = generateTopicSummaryClientSide(params);
    setSummary(local);
    setEditedMarkdown(local.markdownContent);
    setSourceType("Ders Materyali & Müfredat Motoru");
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      generateSummary();
      setIsEditing(false);
    }
  }, [isOpen, params.haftaEtiketi, params.icerikCercevesi, params.dersIsmi]);

  if (!isOpen) return null;

  const currentSummary: GeneratedTopicSummary = summary
    ? {
        ...summary,
        markdownContent: editedMarkdown,
      }
    : generateTopicSummaryClientSide(params);

  const handleDownloadWord = () => {
    downloadTopicSummaryWordDoc(currentSummary, {
      okulAdi: params.okulAdi,
      egitimYili: params.egitimYili,
    });
  };

  const handleDownloadPdf = () => {
    printTopicSummaryPdf(currentSummary, {
      okulAdi: params.okulAdi,
      egitimYili: params.egitimYili,
    });
  };

  const hasMateryal = Boolean(params.materyalText && params.materyalText.trim().length >= 40);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Ders Konu Özeti &amp; Öğrenci Notu
                </h2>
                <span className="text-[10px] font-semibold bg-emerald-500/25 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Lise Düzeyi
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                {params.dersIsmi || "Meslek Dersi"} · {params.haftaEtiketi} ({params.tarihAraligi})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200/80 hover:text-white hover:bg-white/10 transition-colors"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Ribbon & Meta Tags */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700">Ünite:</span>
            <span className="bg-teal-50 text-teal-900 border border-teal-200 px-2 py-0.5 rounded text-xs font-medium">
              {params.ogrenmeBirimi || "Genel"}
            </span>
            <span className="font-semibold text-slate-700 ml-1">Konu:</span>
            <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-xs font-medium truncate max-w-[280px]">
              {params.icerikCercevesi || "Haftalık Konu"}
            </span>
            <span className="text-[11px] text-slate-700 hidden sm:inline">
              · Kaynak: {sourceType}
            </span>
          </div>

          {/* Action buttons toolbar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                isEditing
                  ? "bg-amber-50 text-amber-900 border-amber-300"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
            >
              {isEditing ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  Önizleme
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  Düzenle
                </>
              )}
            </button>

            <button
              type="button"
              onClick={generateSummary}
              disabled={isLoading}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors disabled:opacity-50"
              title="Yeniden Oluştur"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
              Yenile
            </button>

            <button
              type="button"
              onClick={handleDownloadWord}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Word (.docx) İndir
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              PDF İndir
            </button>
          </div>
        </div>

        {/* Missing textbook warning (helpful advice) */}
        {!hasMateryal && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-2 text-xs text-amber-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>İpucu:</strong> Ders Kitabı / Konu Anlatımı (Ders Materyali) dosyası yüklendiğinde, özet doğrudan o kitaptaki paragraflardan ve atölye adımlarından birebir çıkarılır.
            </span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mb-4" />
              <p className="text-sm font-semibold text-slate-800">
                Lise Düzeyinde Öğrenci Notu ve Konu Özeti Hazırlanıyor...
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Ders materyali ve {params.haftaEtiketi} kazanımları taranarak öğrencinin kolayca anlayacağı sade ve maddeli bir çalışma notu çıkarılıyor.
              </p>
            </div>
          ) : isEditing ? (
            <div className="space-y-2 h-full">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Notu istediğiniz gibi düzenleyip Word veya PDF olarak indirebilirsiniz (Markdown formatı):</span>
                <span>{editedMarkdown.length} karakter</span>
              </div>
              <textarea
                value={editedMarkdown}
                onChange={(e) => setEditedMarkdown(e.target.value)}
                className="w-full h-[450px] p-4 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-slate-800">
              <RenderMarkdownContent markdown={editedMarkdown} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Öğrencilere fotokopi veya dijital ders notu olarak dağıtılmaya hazırdır.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadWord}
              className="font-semibold text-blue-700 hover:text-blue-900"
            >
              Word (.docx) İndir
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="font-semibold text-emerald-700 hover:text-emerald-900"
            >
              PDF İndir
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={onClose}
              className="font-medium text-slate-600 hover:text-slate-800"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function RenderMarkdownContent({ markdown }: { markdown: string }) {
  const lines = markdown.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="my-2 space-y-1 pl-5 list-disc text-slate-700">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              <FormatInlineText text={item} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(`list-${index}`);
      return;
    }

    if (trimmed === "---") {
      flushList(`list-${index}`);
      elements.push(<hr key={`hr-${index}`} className="my-4 border-slate-200" />);
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList(`list-${index}`);
      elements.push(
        <h1
          key={`h1-${index}`}
          className="text-lg font-bold text-slate-900 pb-2 border-b-2 border-emerald-600 mt-2 mb-3"
        >
          <FormatInlineText text={trimmed.slice(2)} />
        </h1>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList(`list-${index}`);
      elements.push(
        <h2
          key={`h2-${index}`}
          className="text-sm font-bold text-teal-950 bg-teal-50/80 border-l-4 border-teal-600 px-3 py-1.5 rounded-r-lg mt-5 mb-2"
        >
          <FormatInlineText text={trimmed.slice(3)} />
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList(`list-${index}`);
      elements.push(
        <h3 key={`h3-${index}`} className="text-xs font-bold text-slate-800 mt-3 mb-1">
          <FormatInlineText text={trimmed.slice(4)} />
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("> ")) {
      flushList(`list-${index}`);
      elements.push(
        <div
          key={`quote-${index}`}
          className="my-3 bg-amber-50/80 border-l-4 border-amber-500 p-3 rounded-r-lg text-xs text-amber-950 font-medium"
        >
          <FormatInlineText text={trimmed.slice(2)} />
        </div>
      );
      return;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listItems.push(trimmed.slice(2));
      return;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      flushList(`list-${index}`);
      elements.push(
        <div key={`num-${index}`} className="flex items-start gap-2 text-xs text-slate-800 my-1.5">
          <span className="font-bold text-teal-700 shrink-0 bg-teal-100 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
            {numMatch[1]}
          </span>
          <span className="leading-relaxed">
            <FormatInlineText text={numMatch[2]} />
          </span>
        </div>
      );
      return;
    }

    flushList(`list-${index}`);
    elements.push(
      <p key={`p-${index}`} className="text-xs text-slate-700 leading-relaxed my-2">
        <FormatInlineText text={trimmed} />
      </p>
    );
  });

  flushList("list-final");

  return <div className="space-y-1">{elements}</div>;
}

function FormatInlineText({ text }: { text: string }) {
  // Simple bold and italic formatting parser
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-semibold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic text-slate-800">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts.length > 0 ? parts : text}</>;
}
