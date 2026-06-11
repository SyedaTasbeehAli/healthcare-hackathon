import { profiles } from "../data/mockData.js";

export default function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">Family health profile</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Manage profiles</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Keep medical records grouped for self, parents, and children.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {profiles.map(({ name, relation, icon: Icon, documents }) => (
          <article key={name} className="content-card p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-brand-teal">
              <Icon size={24} />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-950">{name}</h2>
            <p className="mt-1 text-sm text-slate-500">{relation}</p>
            <div className="mt-5 rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <span className="font-bold text-slate-950">{documents}</span>{" "}
              <span className="text-slate-500">documents stored</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
