import { LoaderCircle, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import DocumentCard from "../components/DocumentCard.jsx";
import ReportSummaryModal from "../components/ReportSummaryModal.jsx";
import { useAiConfig } from "../context/AiConfigContext.jsx";
import { useMedicalReports } from "../context/MedicalReportsContext.jsx";
import { searchPrompts } from "../data/mockData.js";
import { searchMedicalReports } from "../services/medicalAi.js";

function SearchAnswerCard({ result }) {
  const isFallback = result.mode === "fallback";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-brand-blue">
          <Sparkles size={15} />
          Search answer
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isFallback
              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          }`}
        >
          {isFallback ? "Fallback match" : "AI result"}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">{result.answer}</p>

      {result.followUp && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          {result.followUp}
        </div>
      )}
    </div>
  );
}

export default function SearchRecords() {
  const { hasApiKey, openRouterApiKey } = useAiConfig();
  const { completedReports, currentTime, pendingReportCount } = useMedicalReports();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const reportLookup = useMemo(
    () => new Map(completedReports.map((report) => [String(report.id), report])),
    [completedReports],
  );

  const matchedReports = useMemo(() => {
    if (!result?.matches) {
      return [];
    }

    return result.matches
      .map((match) => ({
        ...match,
        report: reportLookup.get(String(match.reportId)) || null,
      }))
      .filter((match) => match.report);
  }, [reportLookup, result]);

  async function runSearch(nextQuery = query) {
    const trimmedQuery = nextQuery.trim();

    if (!trimmedQuery || isSearching || completedReports.length === 0) {
      return;
    }

    setQuery(trimmedQuery);
    setIsSearching(true);

    try {
      const nextResult = await searchMedicalReports({
        apiKey: openRouterApiKey,
        query: trimmedQuery,
        reports: completedReports,
      });

      setResult(nextResult);
    } finally {
      setIsSearching(false);
    }
  }

  function handlePromptClick(prompt) {
    setQuery(prompt);
    void runSearch(prompt);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">AI record search</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Search medical records</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Ask natural questions and search across AI-processed reports using stored OCR and parsed
          report text.
        </p>
      </div>

      <section className="content-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-lg bg-white px-3 py-3">
            <Sparkles size={19} className="text-brand-blue" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Show my blood reports from last 6 months"
              className="w-full border-0 bg-transparent text-sm outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => void runSearch()}
            disabled={!hasApiKey || isSearching || completedReports.length === 0}
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSearching ? <LoaderCircle size={18} className="animate-spin" /> : <Search size={18} />}
            Search
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {searchPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handlePromptClick(prompt)}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-brand-blue hover:text-brand-blue"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {completedReports.length} processed report{completedReports.length === 1 ? "" : "s"}{" "}
            ready for search
          </p>
          <p>
            {pendingReportCount > 0
              ? `${pendingReportCount} report${pendingReportCount === 1 ? "" : "s"} still processing`
              : "All uploaded reports are either processed or failed"}
          </p>
        </div>
      </section>

      {completedReports.length === 0 ? (
        <section className="content-card rounded-2xl border-dashed p-10 text-center">
          <h2 className="text-xl font-bold text-slate-950">No processed reports yet</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Upload at least one report and wait for processing to complete before searching your
            record library.
          </p>
        </section>
      ) : (
        <>
          {result && <SearchAnswerCard result={result} />}

          <section>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-slate-950">Search results</h2>
              {result && (
                <p className="text-sm text-slate-500">
                  {matchedReports.length} matching report{matchedReports.length === 1 ? "" : "s"}
                </p>
              )}
            </div>

            {!result ? (
              <div className="content-card rounded-2xl border-dashed p-10 text-center">
                <h3 className="text-xl font-bold text-slate-950">Run a search to see matches</h3>
                <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  The AI search will answer your question and highlight the reports it used.
                </p>
              </div>
            ) : matchedReports.length === 0 ? (
              <div className="content-card rounded-2xl border-dashed p-10 text-center">
                <h3 className="text-xl font-bold text-slate-950">No matching reports found</h3>
                <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Try a more specific phrase such as a test name, medicine name, doctor name, or
                  a recent symptom.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {matchedReports.map((match) => (
                  <div key={`${match.reportId}-${match.reason}`} className="space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-800">{match.reason}</p>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-slate-600 ring-1 ring-slate-200">
                          {match.relevance} relevance
                        </span>
                      </div>
                      {match.excerpt && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">{match.excerpt}</p>
                      )}
                    </div>

                    <DocumentCard
                      document={match.report}
                      currentTime={currentTime}
                      onViewSummary={setSelectedDocument}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <ReportSummaryModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </div>
  );
}
