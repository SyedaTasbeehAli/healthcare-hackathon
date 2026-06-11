import { CalendarCheck, FileText, Pill } from "lucide-react";
import DocumentCard from "../components/DocumentCard.jsx";
import MedicineCard from "../components/MedicineCard.jsx";
import { documents, medicines, overviewStats } from "../data/mockData.js";

const toneClasses = {
  blue: "bg-blue-50 text-blue-700",
  teal: "bg-teal-50 text-teal-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
};

// Dashboard is the home page after login.
// It combines summary stats, recent documents, follow-ups, and medicines.
export default function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-brand-teal">Patient dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Welcome back, Patient</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Your records are grouped by document type, medicine status, and timeline activity.
          </p>
        </div>
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
          Next follow-up: 20 June 2026
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
            <h2 className="text-xl font-bold text-slate-950">Recent activity</h2>
            <FileText className="text-slate-400" size={20} />
          </div>
          <div className="grid gap-4">
            {documents.slice(0, 3).map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="content-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-950">Care snapshot</h2>
              <CalendarCheck className="text-brand-teal" size={22} />
            </div>
            <div className="mt-5 space-y-3">
              <div className="rounded-lg bg-teal-50 p-4">
                <p className="text-sm font-semibold text-teal-800">Upcoming Follow-ups</p>
                <p className="mt-1 text-2xl font-bold text-teal-900">2</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-800">Reports needing review</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">4</p>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-950">Medicine tracker</h2>
              <Pill className="text-slate-400" size={20} />
            </div>
            <MedicineCard medicine={medicines[0]} />
          </section>
        </div>
      </section>
    </div>
  );
}
