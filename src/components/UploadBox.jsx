import { UploadCloud } from "lucide-react";
import { useState } from "react";

export const medicalReportCategories = [
  "Lab Reports",
  "Prescriptions",
  "X-rays",
  "Ultrasounds",
  "Vaccination Records",
  "Doctor Notes",
];

const acceptedFileTypes = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

export default function UploadBox({
  activeFilter,
  disabled = false,
  onToggleFilter,
  onUpload,
}) {
  const [selectedCategory, setSelectedCategory] = useState(medicalReportCategories[0]);
  const [notes, setNotes] = useState("");
  const [lastUploadCount, setLastUploadCount] = useState(0);

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0 || disabled) {
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
        className={`flex min-h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            : "cursor-pointer border-blue-200 bg-blue-50/60 hover:border-brand-blue hover:bg-blue-50"
        }`}
      >
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-lg shadow-sm ${
            disabled ? "bg-slate-200 text-slate-500" : "bg-white text-brand-blue"
          }`}
        >
          <UploadCloud size={28} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-950">Drop medical documents here</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
          Upload lab reports, prescriptions, scans, vaccination records, and doctor notes for
          OCR, summarization, and later doctor routing.
        </p>
        <span
          className={`mt-5 rounded-lg px-5 py-2.5 text-sm font-semibold ${
            disabled ? "bg-slate-300 text-slate-600" : "bg-brand-blue text-white"
          }`}
        >
          {disabled ? "Add API key first" : "Choose files"}
        </span>
      </label>
      <input
        id="medical-files"
        type="file"
        accept={acceptedFileTypes}
        multiple
        disabled={disabled}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Report category</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            disabled={disabled}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
          >
            {medicalReportCategories.map((category) => (
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
            disabled={disabled}
            placeholder="Uploaded for AI-assisted review"
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      {disabled && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Add an OpenRouter key above before uploading reports. The app uses that key to parse
          PDFs, run OCR on images, and save AI-ready search data.
        </p>
      )}

      {lastUploadCount > 0 && (
        <p className="mt-4 rounded-lg bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
          {lastUploadCount} file{lastUploadCount > 1 ? "s" : ""} uploaded for AI processing.
          OCR, parsing, and summarization have started.
        </p>
      )}

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">Filter uploaded files</p>
          <p className="text-xs text-slate-500">
            Click the same category again to show all reports.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {medicalReportCategories.map((category) => {
            const isActive = activeFilter === category;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => onToggleFilter(category)}
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-brand-blue bg-blue-50 text-brand-blue ring-2 ring-blue-100"
                    : "border-slate-200 bg-white text-slate-800 hover:border-brand-blue hover:text-brand-blue"
                }`}
              >
                <p className="text-sm font-semibold">{category}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
