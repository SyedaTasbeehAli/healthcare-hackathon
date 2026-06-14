import { useState } from "react";
import MedicineCard from "../components/MedicineCard.jsx";
import { useMedicines } from "../context/MedicinesContext.jsx";

const initialFormState = {
  name: "",
  dosage: "",
  frequency: "",
  mg: "",
};

export default function MedicineTracker() {
  const { medicines, addMedicine, removeMedicine } = useMedicines();
  const [formValues, setFormValues] = useState(initialFormState);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formValues.name.trim() ||
      !formValues.dosage.trim() ||
      !formValues.frequency.trim() ||
      !formValues.mg.trim()
    ) {
      return;
    }

    addMedicine(formValues);
    setFormValues(initialFormState);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">Medicine tracker</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Active medicines</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Add medicines with the key dosing fields and remove them when they are no longer needed.
        </p>
      </div>

      <section className="content-card p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Add medicine</h2>
            <p className="mt-1 text-sm text-slate-600">
              Store the medicine name, dosage, frequency, and mg value.
            </p>
          </div>
        </div>

        <form className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Name</span>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Panadol"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Dosage</span>
            <input
              type="text"
              name="dosage"
              value={formValues.dosage}
              onChange={handleInputChange}
              placeholder="1 tablet"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Frequency</span>
            <input
              type="text"
              name="frequency"
              value={formValues.frequency}
              onChange={handleInputChange}
              placeholder="Twice daily"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">MG</span>
            <input
              type="text"
              name="mg"
              value={formValues.mg}
              onChange={handleInputChange}
              placeholder="500mg"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <div className="md:col-span-2 xl:col-span-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Add medicine
            </button>
          </div>
        </form>
      </section>

      {medicines.length === 0 ? (
        <div className="content-card rounded-2xl border-dashed p-10 text-center">
          <h2 className="text-xl font-bold text-slate-950">No medicines added yet</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Add the first medicine above and it will be stored locally for this app.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {medicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onDelete={removeMedicine}
            />
          ))}
        </div>
      )}
    </div>
  );
}
