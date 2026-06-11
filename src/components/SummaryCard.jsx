import { AlertTriangle, Brain } from "lucide-react";
import { CategoryBadge } from "./DocumentCard.jsx";

export default function SummaryCard({ summary }) {
  return (
    <article className="content-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-brand-teal">
            <Brain size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Document</p>
            <h3 className="text-lg font-bold text-slate-950">{summary.document}</h3>
          </div>
        </div>
        <CategoryBadge category={summary.category} />
      </div>

      <div className="mt-5 rounded-lg bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-800">AI Summary</p>
        <p className="mt-2 leading-7 text-slate-700">{summary.summary}</p>
      </div>

      <div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <AlertTriangle className="mt-0.5 shrink-0" size={17} />
        <p>This AI summary is for organization purposes only and is not medical advice.</p>
      </div>
    </article>
  );
}
