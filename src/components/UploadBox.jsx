import { UploadCloud } from "lucide-react";

const categories = [
  "Lab Reports",
  "Prescriptions",
  "X-rays",
  "Ultrasounds",
  "Vaccination Records",
  "Doctor Notes",
];

// This is a visual upload area for now.
// Later you can add state and send selected files to a backend API.
export default function UploadBox() {
  return (
    <section className="content-card p-5 sm:p-6">
      <label
        htmlFor="medical-files"
        className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/60 px-6 py-10 text-center transition hover:border-brand-blue hover:bg-blue-50"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white text-brand-blue shadow-sm">
          <UploadCloud size={28} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-950">Drop medical documents here</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
          Upload lab reports, prescriptions, scans, vaccination records, and doctor notes.
        </p>
        <span className="mt-5 rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white">
          Choose files
        </span>
      </label>
      <input id="medical-files" type="file" multiple className="hidden" />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">{category}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
