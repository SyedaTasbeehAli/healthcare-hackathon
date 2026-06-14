import { FileText } from "lucide-react";
import { useState } from "react";
import DocumentCard from "../components/DocumentCard.jsx";
import UploadBox, { medicalReportCategories } from "../components/UploadBox.jsx";
import { useAiConfig } from "../context/AiConfigContext.jsx";
import { useMedicalReports } from "../context/MedicalReportsContext.jsx";

export default function UploadDocuments() {
  const { hasApiKey } = useAiConfig();
  const { reports, currentTime, addUploadedDocuments, removeReport } = useMedicalReports();
  const [activeFilter, setActiveFilter] = useState("");

  const filteredReports = activeFilter
    ? reports.filter((report) => report.category === activeFilter)
    : reports;

  function handleToggleFilter(category) {
    if (!medicalReportCategories.includes(category)) {
      return;
    }

    setActiveFilter((currentFilter) => (currentFilter === category ? "" : category));
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">Document upload</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Upload medical documents</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Upload reports here and track them as they move from OCR and AI review into completed,
          searchable records.
        </p>
      </div>

      <UploadBox
        activeFilter={activeFilter}
        disabled={!hasApiKey}
        onToggleFilter={handleToggleFilter}
        onUpload={addUploadedDocuments}
      />

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-950">Uploaded files</h2>
          <p className="text-sm text-slate-500">
            {activeFilter
              ? `Showing ${activeFilter}`
              : "Showing all uploaded report categories"}
          </p>
        </div>
        {reports.length === 0 ? (
          <div className="content-card rounded-2xl border-dashed p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-brand-blue">
              <FileText size={28} />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-950">No uploaded reports yet</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Upload a medical document to create the first report card and start OCR and AI
              processing.
            </p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="content-card rounded-2xl border-dashed p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-brand-blue">
              <FileText size={28} />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-950">No reports in this category</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
              No uploaded reports match the current filter. Click the selected category again to
              clear the filter and show all reports.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredReports.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                currentTime={currentTime}
                onDelete={removeReport}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
