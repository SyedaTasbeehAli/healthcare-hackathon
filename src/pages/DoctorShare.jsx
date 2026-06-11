import { Download, Share2, Sparkles } from "lucide-react";
import { doctorShareSections } from "../data/mockData.js";

// This page prepares a doctor-friendly summary.
// Buttons are visual only for now and can later connect to PDF/share APIs.
export default function DoctorShare() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">Doctor sharing</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Prepare doctor summary</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Generate a clean visit summary with recent reports, medicines, allergies, and timeline.
        </p>
      </div>

      <section className="content-card overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Health summary packet</h2>
              <p className="mt-1 text-sm text-slate-600">Ready to share before an appointment.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <Sparkles size={18} />
                Generate summary
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <Download size={18} />
                Download PDF
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                <Share2 size={18} />
                Share with doctor
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-2">
          {doctorShareSections.map(({ title, value, icon: Icon }) => (
            <article key={title} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-brand-blue">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{value}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
