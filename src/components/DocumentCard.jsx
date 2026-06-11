import { CalendarDays, FileText } from "lucide-react";

// Each category has its own color style.
// This makes document badges easy to scan visually.
const categoryStyles = {
  Prescription: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Blood Test": "bg-blue-50 text-blue-700 ring-blue-200",
  Radiology: "bg-violet-50 text-violet-700 ring-violet-200",
  "Discharge Summary": "bg-orange-50 text-orange-700 ring-orange-200",
  Vaccination: "bg-teal-50 text-teal-700 ring-teal-200",
  Invoice: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function CategoryBadge({ category }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        categoryStyles[category] || categoryStyles.Invoice
      }`}
    >
      {category}
    </span>
  );
}

// Reusable card for showing one medical document.
// The same component is used on Dashboard, Upload page, and Search page.
export default function DocumentCard({ document }) {
  return (
    <article className="content-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-brand-blue">
          <FileText size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-950">{document.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{document.type}</p>
            </div>
            <CategoryBadge category={document.category} />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays size={16} />
            {document.date}
          </div>
        </div>
      </div>
    </article>
  );
}
