import { AlertTriangle, Brain, FileText, HeartPulse, Pill, Trash2 } from "lucide-react";
import TimelineCard from "../components/TimelineCard.jsx";
import { useMedicines } from "../context/MedicinesContext.jsx";
import { useMedicalProfile } from "../context/MedicalProfileContext.jsx";
import { useMedicalReports } from "../context/MedicalReportsContext.jsx";

function formatTimelineDate(timestamp) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function getTimelineEvents(reports) {
  return reports
    .flatMap((report) => {
      const uploadEvent = {
        id: `${report.id}-uploaded`,
        occurredAt: report.uploadedAt,
        date: formatTimelineDate(report.uploadedAt),
        title: `Report uploaded: ${report.name || report.title}`,
        description:
          report.processingState === "complete"
            ? `Uploaded under ${report.category}. The AI summary is now ready to review and can later help with doctor suggestion.`
            : `Uploaded under ${report.category}. AI review is underway and the summary will appear once processing finishes.`,
        icon: FileText,
        iconWrapperClass: "bg-brand-blue text-white shadow-lg shadow-blue-200",
      };

      if (report.processingState !== "complete") {
        return [uploadEvent];
      }

      const summaryEvent = {
        id: `${report.id}-summary-ready`,
        occurredAt: report.completedAt || report.reviewReadyAt || report.uploadedAt,
        date: formatTimelineDate(
          report.completedAt || report.reviewReadyAt || report.uploadedAt,
        ),
        title: `AI summary ready: ${report.name || report.title}`,
        description:
          "A first-pass report summary has been generated. Open the summary page or the report card to review the extracted context.",
        icon: Brain,
        iconWrapperClass: "bg-teal-600 text-white shadow-lg shadow-teal-200",
      };

      return [summaryEvent, uploadEvent];
    })
}

function getMedicineTimelineEvents(events) {
  return events.map((event) => {
    if (event.action === "added") {
      return {
        id: event.id,
        occurredAt: event.occurredAt,
        date: formatTimelineDate(event.occurredAt),
        title: `Medicine added: ${event.medicineName}`,
        description: `${event.medicineName} was added with dosage ${event.dosage}, frequency ${event.frequency}, and mg ${event.mg}.`,
        icon: Pill,
        iconWrapperClass: "bg-emerald-600 text-white shadow-lg shadow-emerald-200",
      };
    }

    return {
      id: event.id,
      occurredAt: event.occurredAt,
      date: formatTimelineDate(event.occurredAt),
      title: `Medicine removed: ${event.medicineName}`,
      description: `${event.medicineName} was removed from the active medicines list.`,
      icon: Trash2,
      iconWrapperClass: "bg-rose-600 text-white shadow-lg shadow-rose-200",
    };
  });
}

function getAllergyTimelineEvents(events) {
  return events.map((event) => {
    if (event.action === "added") {
      return {
        id: event.id,
        occurredAt: event.occurredAt,
        date: formatTimelineDate(event.occurredAt),
        title: `Allergy added: ${event.allergyName}`,
        description: `${event.allergyName} was added to the active medical profile.`,
        icon: AlertTriangle,
        iconWrapperClass: "bg-amber-600 text-white shadow-lg shadow-amber-200",
      };
    }

    return {
      id: event.id,
      occurredAt: event.occurredAt,
      date: formatTimelineDate(event.occurredAt),
      title: `Allergy removed: ${event.allergyName}`,
      description: `${event.allergyName} was removed from the active medical profile.`,
      icon: Trash2,
      iconWrapperClass: "bg-orange-600 text-white shadow-lg shadow-orange-200",
    };
  });
}

function getChronicDiseaseTimelineEvents(events) {
  return events.map((event) => {
    if (event.action === "added") {
      return {
        id: event.id,
        occurredAt: event.occurredAt,
        date: formatTimelineDate(event.occurredAt),
        title: `Chronic disease added: ${event.diseaseName}`,
        description: `${event.diseaseName} was added to the active medical profile.`,
        icon: HeartPulse,
        iconWrapperClass: "bg-amber-600 text-white shadow-lg shadow-amber-200",
      };
    }

    return {
      id: event.id,
      occurredAt: event.occurredAt,
      date: formatTimelineDate(event.occurredAt),
      title: `Chronic disease removed: ${event.diseaseName}`,
      description: `${event.diseaseName} was removed from the active medical profile.`,
      icon: Trash2,
      iconWrapperClass: "bg-yellow-700 text-white shadow-lg shadow-yellow-200",
    };
  });
}

function sortTimelineEvents(events) {
  return events.sort(
    (firstEvent, secondEvent) =>
      new Date(secondEvent.occurredAt).getTime() -
      new Date(firstEvent.occurredAt).getTime(),
  );
}

export default function Timeline() {
  const { reports } = useMedicalReports();
  const { medicineTimelineEvents } = useMedicines();
  const { allergyTimelineEvents, chronicDiseaseTimelineEvents } = useMedicalProfile();
  const timelineEvents = sortTimelineEvents([
    ...getTimelineEvents(reports),
    ...getMedicineTimelineEvents(medicineTimelineEvents),
    ...getAllergyTimelineEvents(allergyTimelineEvents),
    ...getChronicDiseaseTimelineEvents(chronicDiseaseTimelineEvents),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">Medical timeline</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Patient health journey</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          This timeline now reflects uploaded reports, AI summary milestones, medicine changes,
          allergy updates, and chronic disease updates from shared app state.
        </p>
      </div>

      {timelineEvents.length === 0 ? (
        <section className="content-card rounded-2xl border-dashed p-10 text-center">
          <h2 className="text-xl font-bold text-slate-950">No health activity yet</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Upload a medical document, add a medicine, or update the medical profile to start the
            timeline. Health events will appear here automatically.
          </p>
        </section>
      ) : (
        <section className="content-card p-5 sm:p-6">
          {timelineEvents.map((event, index) => (
            <TimelineCard
              key={event.id}
              event={event}
              isLast={index === timelineEvents.length - 1}
            />
          ))}
        </section>
      )}
    </div>
  );
}
