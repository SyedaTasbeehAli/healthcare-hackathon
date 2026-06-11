import SummaryCard from "../components/SummaryCard.jsx";
import { summaries } from "../data/mockData.js";

export default function AISummary() {
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

      <div className="grid gap-4 lg:grid-cols-2">
        {summaries.map((summary) => (
          <SummaryCard key={summary.document} summary={summary} />
        ))}
      </div>
    </div>
  );
}
