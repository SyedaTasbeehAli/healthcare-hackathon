import { Clock, Pill } from "lucide-react";

export default function MedicineCard({ medicine }) {
  return (
    <article className="content-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <Pill size={22} />
        </div>
        <div>
          <p className="text-sm text-slate-500">Medicine</p>
          <h3 className="text-xl font-bold text-slate-950">{medicine.name}</h3>
        </div>
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
            <Clock size={15} />
            Duration
          </dt>
          <dd className="font-semibold text-slate-900">{medicine.duration}</dd>
        </div>
      </dl>
    </article>
  );
}
