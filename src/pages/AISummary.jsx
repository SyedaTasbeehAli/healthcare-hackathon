import SummaryCard from "../components/SummaryCard.jsx";
import { useMedicalReports } from "../context/MedicalReportsContext.jsx";

export default function AISummary() {
  const { summaryItems, pendingReportCount } = useMedicalReports();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">AI summary</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Understand document context</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Summaries explain what a document appears to contain. They do not diagnose, treat, or
          replace medical advice.
        </p>
      </div>

      {summaryItems.length === 0 ? (
        <div className="content-card rounded-2xl border-dashed p-10 text-center">
          <h2 className="text-xl font-bold text-slate-950">No summaries are ready yet</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Upload a medical document to start the AI review flow. Completed summaries will appear
            here automatically.
            {pendingReportCount > 0
              ? ` ${pendingReportCount} report${pendingReportCount > 1 ? "s are" : " is"} still processing.`
              : ""}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {summaryItems.map((summary) => (
            <SummaryCard key={summary.id} summary={summary} />
          ))}
        </div>
      )}
    </div>
  );
}
