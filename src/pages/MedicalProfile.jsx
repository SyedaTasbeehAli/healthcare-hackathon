import { AlertTriangle, Droplets, HeartPulse, Plus, X } from "lucide-react";
import { useState } from "react";
import {
  bloodGroupOptions,
  popularAllergyOptions,
  popularChronicDiseaseOptions,
  useMedicalProfile,
} from "../context/MedicalProfileContext.jsx";

function ProfileTagList({ emptyText, items, onRemove, tone }) {
  const toneClasses = {
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    rose: "bg-rose-50 text-rose-800 border-rose-200",
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${toneClasses[tone]}`}
        >
          <span>{item.name}</span>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/70 text-current transition hover:bg-white"
            aria-label={`Remove ${item.name}`}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function MedicalProfile() {
  const {
    allergies,
    bloodGroup,
    chronicDiseases,
    addAllergy,
    addChronicDisease,
    removeAllergy,
    removeChronicDisease,
    setBloodGroup,
  } = useMedicalProfile();
  const [selectedAllergy, setSelectedAllergy] = useState(popularAllergyOptions[0]);
  const [customAllergy, setCustomAllergy] = useState("");
  const [selectedDisease, setSelectedDisease] = useState(popularChronicDiseaseOptions[0]);
  const [customDisease, setCustomDisease] = useState("");

  function handleAddSelectedAllergy() {
    addAllergy(selectedAllergy);
  }

  function handleAddCustomAllergy() {
    const wasAdded = addAllergy(customAllergy);

    if (wasAdded) {
      setCustomAllergy("");
    }
  }

  function handleAddSelectedDisease() {
    addChronicDisease(selectedDisease);
  }

  function handleAddCustomDisease() {
    const wasAdded = addChronicDisease(customDisease);

    if (wasAdded) {
      setCustomDisease("");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">Medical profile</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Active health profile</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Maintain the core profile details that help organize care: blood group, allergies, and
          chronic diseases. Allergy changes also feed the health timeline automatically.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="content-card p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-brand-blue">
            <Droplets size={22} />
          </div>
          <p className="mt-4 text-sm text-slate-500">Blood group</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{bloodGroup || "Not set yet"}</p>
        </article>
        <article className="content-card p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
            <AlertTriangle size={22} />
          </div>
          <p className="mt-4 text-sm text-slate-500">Active allergies</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{allergies.length}</p>
        </article>
        <article className="content-card p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <HeartPulse size={22} />
          </div>
          <p className="mt-4 text-sm text-slate-500">Chronic diseases</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{chronicDiseases.length}</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="content-card p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950">Blood group</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Select one blood group value for the active medical profile.
          </p>
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">Select blood group</span>
            <select
              value={bloodGroup}
              onChange={(event) => setBloodGroup(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Choose blood group</option>
              {bloodGroupOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </article>

        <article className="content-card p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <HeartPulse size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Profile summary</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This panel reflects the currently active medical profile information stored in the
                app for doctor matching and visit preparation.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Current blood group</p>
              <p className="mt-2 text-lg font-bold text-slate-950">{bloodGroup || "Not set"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Profile readiness</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {allergies.length + chronicDiseases.length > 0
                  ? "Your core medical profile contains active items that can help contextualize care."
                  : "Add allergies or chronic diseases to build a richer medical profile."}
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="content-card p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Allergies</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose a common allergy or add your own custom allergy to the active profile.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-700">Popular allergy option</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <select
                  value={selectedAllergy}
                  onChange={(event) => setSelectedAllergy(event.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
                >
                  {popularAllergyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddSelectedAllergy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-700">Other allergy</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={customAllergy}
                  onChange={(event) => setCustomAllergy(event.target.value)}
                  placeholder="Enter custom allergy"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={handleAddCustomAllergy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-blue hover:text-brand-blue"
                >
                  <Plus size={16} />
                  Add other
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-slate-700">Active allergies</p>
            <ProfileTagList
              emptyText="No allergies added yet."
              items={allergies}
              onRemove={removeAllergy}
              tone="rose"
            />
          </div>
        </article>

        <article className="content-card p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <HeartPulse size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Chronic diseases</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose a common chronic disease or add a custom condition to the active profile.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-700">Popular chronic disease</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <select
                  value={selectedDisease}
                  onChange={(event) => setSelectedDisease(event.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
                >
                  {popularChronicDiseaseOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddSelectedDisease}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-700">Other chronic disease</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={customDisease}
                  onChange={(event) => setCustomDisease(event.target.value)}
                  placeholder="Enter custom condition"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={handleAddCustomDisease}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-blue hover:text-brand-blue"
                >
                  <Plus size={16} />
                  Add other
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-slate-700">Active chronic diseases</p>
            <ProfileTagList
              emptyText="No chronic diseases added yet."
              items={chronicDiseases}
              onRemove={removeChronicDisease}
              tone="amber"
            />
          </div>
        </article>
      </section>
    </div>
  );
}
