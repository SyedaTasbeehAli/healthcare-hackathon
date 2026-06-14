import { CalendarDays, CheckCircle2, Eye, FileText, LoaderCircle, X } from "lucide-react";

// Each category has its own color style.
// This makes document badges easy to scan visually.
const categoryStyles = {
  Prescription: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Prescriptions: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Blood Test": "bg-blue-50 text-blue-700 ring-blue-200",
  "Lab Reports": "bg-blue-50 text-blue-700 ring-blue-200",
  Radiology: "bg-violet-50 text-violet-700 ring-violet-200",
  "X-rays": "bg-violet-50 text-violet-700 ring-violet-200",
  Ultrasounds: "bg-violet-50 text-violet-700 ring-violet-200",
  "Discharge Summary": "bg-orange-50 text-orange-700 ring-orange-200",
  Vaccination: "bg-teal-50 text-teal-700 ring-teal-200",
  "Vaccination Records": "bg-teal-50 text-teal-700 ring-teal-200",
  "Doctor Notes": "bg-amber-50 text-amber-700 ring-amber-200",
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

function getRemainingSeconds(reviewReadyAt, currentTime) {
  if (!reviewReadyAt) {
    return 0;
  }

  const reviewReadyAtMs = new Date(reviewReadyAt).getTime();
  return Math.max(0, Math.ceil((reviewReadyAtMs - currentTime) / 1000));
}

function getElapsedSeconds(processingStartedAt, currentTime) {
  if (!processingStartedAt) {
    return 0;
  }

  const startedAtMs = new Date(processingStartedAt).getTime();
  return Math.max(0, Math.floor((currentTime - startedAtMs) / 1000));
}

// Reusable card for showing one medical document.
// The same component is used on Dashboard, Upload page, and Search page.
export default function DocumentCard({
  document,
  currentTime = Date.now(),
  onDelete,
  onViewSummary,
}) {
  const isProcessing = document.processingState === "processing";
  const isFailed = document.processingState === "failed";
  const isComplete =
    document.processingState === "complete" || document.status === "Processed";
  const hasSummary = Boolean(document.aiSummary);
  const remainingSeconds = getRemainingSeconds(document.reviewReadyAt, currentTime);
  const elapsedSeconds = getElapsedSeconds(document.processingStartedAt, currentTime);

  return (
    <article className="content-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-brand-blue">
          <FileText size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-950">{document.name || document.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{document.type}</p>
            </div>
            <div className="flex items-start gap-2">
              <CategoryBadge category={document.category} />
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(document.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label={`Remove ${document.name || document.title}`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          {(document.status || document.fileName || document.fileSize) && (
            <div className="mt-4 grid gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:grid-cols-2">
              {document.status && (
                <p>
                  <span className="font-semibold text-slate-800">Status:</span>{" "}
                  {document.status}
                </p>
              )}
              {document.fileSize && (
                <p>
                  <span className="font-semibold text-slate-800">Size:</span>{" "}
                  {document.fileSize}
                </p>
              )}
              {document.fileType && (
                <p>
                  <span className="font-semibold text-slate-800">Type:</span>{" "}
                  {document.fileType}
                </p>
              )}
              {document.fileName && (
                <p className="truncate sm:col-span-2">
                  <span className="font-semibold text-slate-800">File:</span>{" "}
                  {document.fileName}
                </p>
              )}
            </div>
          )}
          {document.notes && <p className="mt-3 text-sm leading-6 text-slate-600">{document.notes}</p>}
          {isProcessing && (
            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                <LoaderCircle size={16} className="animate-spin" />
                {document.processingMessage || "AI review in progress"}
              </div>
              <p className="mt-1 text-sm text-blue-700">
                {document.processingDetail ||
                  (remainingSeconds > 0
                    ? `Generating report summary now. Estimated time remaining: ${remainingSeconds}s.`
                    : `Processing has been running for ${elapsedSeconds}s.`)}
              </p>
            </div>
          )}
          {isFailed && (
            <div className="mt-4 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-800">
                <X size={16} />
                {document.processingMessage || "Processing failed"}
              </div>
              <p className="mt-1 text-sm text-rose-700">
                {document.processingDetail ||
                  document.processingError ||
                  "The report could not be processed. Try uploading it again."}
              </p>
            </div>
          )}
          {isComplete && !isProcessing && (
            <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    <CheckCircle2 size={16} />
                    Report processed
                  </div>
                  <p className="mt-1 text-sm text-emerald-700">
                    {onViewSummary && hasSummary
                      ? "AI review is complete. Click view to read the generated summary."
                      : "AI review is complete and this report is ready for the next step."}
                  </p>
                </div>
                {onViewSummary && hasSummary && (
                  <button
                    type="button"
                    onClick={() => onViewSummary(document)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <Eye size={16} />
                    View summary
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays size={16} />
            {document.date}
          </div>
        </div>
      </div>
    </article>
  );
}
