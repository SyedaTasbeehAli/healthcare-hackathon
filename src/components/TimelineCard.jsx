export default function TimelineCard({ event, isLast }) {
  const Icon = event.icon;
  const iconWrapperClass =
    event.iconWrapperClass ||
    "bg-brand-blue text-white shadow-lg shadow-blue-200";

  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`z-10 flex h-11 w-11 items-center justify-center rounded-lg ${iconWrapperClass}`}
        >
          <Icon size={21} />
        </div>
        {!isLast && <div className="h-full w-px bg-slate-200" />}
      </div>

      <article className="content-card mb-6 flex-1 p-5">
        <p className="text-sm font-semibold text-brand-teal">{event.date}</p>
        <h3 className="mt-1 text-lg font-bold text-slate-950">{event.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{event.description}</p>
      </article>
    </div>
  );
}
