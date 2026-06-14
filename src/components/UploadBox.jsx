import { UploadCloud } from "lucide-react";
import { useState } from "react";

const categories = [
  "Lab Reports",
  "Prescriptions",
  "X-rays",
  "Ultrasounds",
  "Vaccination Records",
  "Doctor Notes",
];

const acceptedFileTypes = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

// This upload area creates frontend-only metadata for selected files.
// The app does not parse medical documents or produce medical conclusions.
export default function UploadBox({ onUpload }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [notes, setNotes] = useState("");
  const [lastUploadCount, setLastUploadCount] = useState(0);

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    onUpload(selectedFiles, {
      category: selectedCategory,
      notes: notes.trim() || "Uploaded for AI-assisted review. Not a medical diagnosis.",
    });
    setLastUploadCount(selectedFiles.length);
    event.target.value = "";
  }

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
      <input
        id="medical-files"
        type="file"
        accept={acceptedFileTypes}
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Report category</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Notes</span>
          <input
            type="text"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Uploaded for AI-assisted review"
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      {lastUploadCount > 0 && (
        <p className="mt-4 rounded-lg bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
          {lastUploadCount} file{lastUploadCount > 1 ? "s" : ""} uploaded for AI-assisted review.
          Pending review. Not a medical diagnosis.
        </p>
      )}

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
