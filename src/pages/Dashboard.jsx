import { Activity, Brain, FileText, LayoutGrid, Pill } from "lucide-react";
import { useState } from "react";
import DocumentCard from "../components/DocumentCard.jsx";
import MedicineCard from "../components/MedicineCard.jsx";
import ReportSummaryModal from "../components/ReportSummaryModal.jsx";
import { useMedicines } from "../context/MedicinesContext.jsx";
import { useMedicalReports } from "../context/MedicalReportsContext.jsx";

const toneClasses = {
  blue: "bg-blue-50 text-blue-700",
  teal: "bg-teal-50 text-teal-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
};

// Dashboard is the home page after login.
// It combines summary stats, recent documents, follow-ups, and medicines.
export default function Dashboard() {
  const {
    reports,
    currentTime,
    totalReportCount,
    processedReportCount,
    pendingReportCount,
    categoryCount,
    latestReport,
    removeReport,
  } = useMedicalReports();
  const { medicines } = useMedicines();
  const [selectedDocument, setSelectedDocument] = useState(null);

  const overviewStats = [
    { label: "Total Reports", value: String(totalReportCount), icon: FileText, tone: "blue" },
    { label: "Summaries Ready", value: String(processedReportCount), icon: Brain, tone: "teal" },
    { label: "In Review", value: String(pendingReportCount), icon: Activity, tone: "amber" },
    { label: "Categories Used", value: String(categoryCount), icon: LayoutGrid, tone: "green" },
  ];

  function renderDashboardStatus() {
    if (pendingReportCount > 0) {
      return `${pendingReportCount} report${pendingReportCount > 1 ? "s are" : " is"} in AI review`;
    }

    if (latestReport) {
      return `Latest report uploaded on ${latestReport.date}`;
    }

    return "Upload your first report to start the review pipeline";
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-brand-teal">Patient dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Welcome back, Patient</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Your uploaded reports, AI summaries, and routing-ready documents all now come from the
            same shared report source.
          </p>
        </div>
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
          {renderDashboardStatus()}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map(({ label, value, icon: Icon, tone }) => (
          <article key={label} className="content-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
                <Icon size={23} />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">Recent uploads</h2>
            <FileText className="text-slate-400" size={20} />
          </div>
          {reports.length === 0 ? (
            <div className="content-card rounded-2xl border-dashed p-8 text-center">
              <h3 className="text-lg font-bold text-slate-950">No reports on the dashboard yet</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upload a document from the upload page and it will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reports.slice(0, 3).map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  currentTime={currentTime}
                  onDelete={removeReport}
                  onViewSummary={setSelectedDocument}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="content-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-950">Report pipeline</h2>
              <Brain className="text-brand-teal" size={22} />
            </div>
            <div className="mt-5 space-y-3">
              <div className="rounded-lg bg-teal-50 p-4">
                <p className="text-sm font-semibold text-teal-800">Summaries ready</p>
                <p className="mt-1 text-2xl font-bold text-teal-900">{processedReportCount}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-800">Reports awaiting review</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">{pendingReportCount}</p>
              </div>
              <div className="rounded-lg bg-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-700">Latest upload</p>
                <p className="mt-1 text-sm font-semibold text-slate-950">
                  {latestReport ? latestReport.name || latestReport.title : "No reports uploaded yet"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {latestReport ? latestReport.date : "Your newest uploaded report will appear here."}
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-950">Medicine tracker</h2>
              <Pill className="text-slate-400" size={20} />
            </div>
            {medicines[0] ? (
              <MedicineCard medicine={medicines[0]} />
            ) : (
              <div className="content-card rounded-2xl border-dashed p-6 text-center">
                <p className="text-sm font-semibold text-slate-950">No medicines saved yet</p>
                <p className="mt-2 text-sm text-slate-600">
                  Add a medicine from the medicines page and it will appear here.
                </p>
              </div>
            )}
          </section>
        </div>
      </section>

      <ReportSummaryModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </div>
  );
}
