import TimelineCard from "../components/TimelineCard.jsx";
import { timelineEvents } from "../data/mockData.js";

export default function Timeline() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">Medical timeline</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Patient health journey</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          A vertical timeline makes reports, prescriptions, and follow-ups easier to follow.
        </p>
      </div>

      <section className="content-card p-5 sm:p-6">
        {timelineEvents.map((event, index) => (
          <TimelineCard
            key={event.id}
            event={event}
            isLast={index === timelineEvents.length - 1}
          />
        ))}
      </section>
    </div>
  );
}
