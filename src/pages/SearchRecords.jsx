import { Search, Sparkles } from "lucide-react";
import DocumentCard from "../components/DocumentCard.jsx";
import { documents, searchPrompts } from "../data/mockData.js";

// This page shows what an AI-powered search experience could look like.
// The results are dummy cards for now, but the UI is ready for real search data later.
export default function SearchRecords() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">AI record search</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Search medical records</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Ask natural questions and display matching records. The search is mocked for now.
        </p>
      </div>

      <section className="content-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-lg bg-white px-3 py-3">
            <Sparkles size={19} className="text-brand-blue" />
            <input
              type="text"
              placeholder="Show my blood reports from last 6 months"
              className="w-full border-0 bg-transparent text-sm outline-none"
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-lg bg-brand-blue px-5 py-3 text-sm font-semibold text-white">
            <Search size={18} />
            Search
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {searchPrompts.map((prompt) => (
            <button
              key={prompt}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:border-brand-blue hover:text-brand-blue"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-950">Search results</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {documents.slice(0, 3).map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      </section>
    </div>
  );
}
