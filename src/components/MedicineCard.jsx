import { Pill, Syringe, X } from "lucide-react";

export default function MedicineCard({ medicine, onDelete }) {
  return (
    <article className="content-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <Pill size={22} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-500">Medicine</p>
          <h3 className="text-xl font-bold text-slate-950">{medicine.name}</h3>
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(medicine.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label={`Remove ${medicine.name}`}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <dl className="mt-5 grid gap-3 text-sm">
        <div className="flex justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
          <dt className="font-medium text-slate-500">Dosage</dt>
          <dd className="font-semibold text-slate-900">{medicine.dosage}</dd>
        </div>
        <div className="flex justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
          <dt className="font-medium text-slate-500">Frequency</dt>
          <dd className="font-semibold text-slate-900">{medicine.frequency}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
          <dt className="flex items-center gap-2 font-medium text-slate-500">
            <Syringe size={15} />
            MG
          </dt>
          <dd className="font-semibold text-slate-900">{medicine.mg}</dd>
        </div>
      </dl>
    </article>
  );
}
