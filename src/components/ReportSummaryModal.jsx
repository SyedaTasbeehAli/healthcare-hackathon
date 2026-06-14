import { Sparkles, X } from "lucide-react";

export default function ReportSummaryModal({ document, onClose }) {
  if (!document) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 px-4 py-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-brand-teal">
              <Sparkles size={15} />
              AI summary
            </div>
            <h3 className="mt-4 text-2xl font-bold text-slate-950">
              {document.name || document.title}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {document.category} | {document.date}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            aria-label="Close summary"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          {document.aiSummary.split("\n\n").map((paragraph, index) => (
            <p
              key={`${document.id}-summary-${index}`}
              className={`text-sm leading-7 text-slate-700 ${index > 0 ? "mt-4" : ""}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
