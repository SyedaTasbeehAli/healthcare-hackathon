import MedicineCard from "../components/MedicineCard.jsx";
import { medicines } from "../data/mockData.js";

export default function MedicineTracker() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">Medicine tracker</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Active medicines</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Track dosage, frequency, and duration in cards that can later connect to a medicine API.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {medicines.map((medicine) => (
          <MedicineCard key={medicine.name} medicine={medicine} />
        ))}
      </div>
    </div>
  );
}
