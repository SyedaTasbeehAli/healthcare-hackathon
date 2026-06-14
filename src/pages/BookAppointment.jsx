import {
  AlertTriangle,
  CalendarRange,
  Droplets,
  FileText,
  HeartPulse,
  LoaderCircle,
  Pill,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";
import { useAiConfig } from "../context/AiConfigContext.jsx";
import { useMedicines } from "../context/MedicinesContext.jsx";
import { useMedicalProfile } from "../context/MedicalProfileContext.jsx";
import { useMedicalReports } from "../context/MedicalReportsContext.jsx";
import { recommendDoctorWithAi } from "../services/medicalAi.js";
import { loadInitialData } from "../utils/storage.js";

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function buildDoctorRecommendation({
  availableSlots,
  chronicDiseases,
  doctors,
  issue,
  medicines,
  reports,
  allergies,
  bloodGroup,
}) {
  const normalizedIssue = issue.toLowerCase();
  const doctorScores = new Map(doctors.map((doctor) => [doctor.id, 0]));
  const reasonsByDoctor = new Map(doctors.map((doctor) => [doctor.id, []]));
  const doctorBySpecialty = new Map(
    doctors.map((doctor) => [doctor.specialty.toLowerCase(), doctor]),
  );

  function addScore(doctorId, points, reason) {
    doctorScores.set(doctorId, (doctorScores.get(doctorId) || 0) + points);
    reasonsByDoctor.set(doctorId, [...(reasonsByDoctor.get(doctorId) || []), reason]);
  }

  function addSpecialtyScore(specialty, points, reason) {
    const doctor = doctorBySpecialty.get(specialty.toLowerCase());

    if (doctor) {
      addScore(doctor.id, points, reason);
    }
  }

  const hasImagingReports = reports.some((report) =>
    ["X-rays", "Ultrasounds"].includes(report.category),
  );
  const hasLabReports = reports.some((report) => report.category === "Lab Reports");
  const hasPrescriptionReports = reports.some((report) =>
    ["Prescriptions", "Doctor Notes"].includes(report.category),
  );
  const chronicDiseaseNames = chronicDiseases.map((item) => item.name.toLowerCase());

  if (
    includesAny(normalizedIssue, [
      "x-ray",
      "ultrasound",
      "scan",
      "imaging",
      "radiology",
      "chest",
    ]) ||
    hasImagingReports
  ) {
    addSpecialtyScore(
      "Radiology",
      4,
      "Imaging-related symptoms or uploaded scan reports point toward radiology review.",
    );
  }

  if (
    includesAny(normalizedIssue, [
      "stomach",
      "abdomen",
      "abdominal",
      "digestion",
      "digestive",
      "gas",
      "bloating",
      "acidity",
      "reflux",
      "constipation",
      "diarrhea",
      "ulcer",
    ])
  ) {
    addSpecialtyScore(
      "Gastroenterology",
      5,
      "Digestive or stomach-related symptoms fit best with gastroenterology review.",
    );
  }

  if (
    includesAny(normalizedIssue, [
      "bone",
      "joint",
      "knee",
      "shoulder",
      "fracture",
      "sprain",
      "back pain",
      "neck pain",
      "orthopedic",
    ])
  ) {
    addSpecialtyScore(
      "Orthopedics",
      5,
      "Bone, joint, or injury-related concerns fit orthopedic review.",
    );
  }

  if (
    includesAny(normalizedIssue, [
      "chest pain",
      "palpitation",
      "heart",
      "cardiac",
      "blood pressure",
      "bp",
    ])
  ) {
    addSpecialtyScore(
      "Cardiology",
      5,
      "Heart-related symptoms or blood pressure concerns fit cardiology review.",
    );
  }

  if (
    includesAny(normalizedIssue, [
      "breathing",
      "lungs",
      "asthma",
      "wheezing",
      "shortness of breath",
      "persistent cough",
    ])
  ) {
    addSpecialtyScore(
      "Pulmonology",
      5,
      "Breathing or lung-related symptoms fit pulmonology review.",
    );
  }

  if (
    includesAny(normalizedIssue, [
      "headache",
      "migraine",
      "dizziness",
      "seizure",
      "numbness",
      "tingling",
      "neurology",
    ])
  ) {
    addSpecialtyScore(
      "Neurology",
      5,
      "Headache, nerve, or neurological symptoms fit neurology review.",
    );
  }

  if (
    includesAny(normalizedIssue, [
      "rash",
      "skin",
      "eczema",
      "itching",
      "acne",
      "fungal",
    ])
  ) {
    addSpecialtyScore(
      "Dermatology",
      5,
      "Skin-related symptoms fit dermatology review.",
    );
  }

  if (
    includesAny(normalizedIssue, [
      "thyroid",
      "hormone",
      "hormonal",
      "sugar",
      "blood sugar",
      "endocrine",
    ])
  ) {
    addSpecialtyScore(
      "Endocrinology",
      5,
      "Hormonal, thyroid, or blood-sugar concerns fit endocrinology review.",
    );
  }

  if (
    includesAny(normalizedIssue, [
      "sinus",
      "ear",
      "throat",
      "tonsil",
      "voice",
      "hearing",
    ])
  ) {
    addSpecialtyScore("ENT", 5, "Ear, nose, or throat symptoms fit ENT review.");
  }

  if (
    includesAny(normalizedIssue, [
      "kidney",
      "creatinine",
      "urine protein",
      "swelling",
      "renal",
    ])
  ) {
    addSpecialtyScore(
      "Nephrology",
      5,
      "Kidney-related symptoms or renal lab concerns fit nephrology review.",
    );
  }

  if (
    includesAny(normalizedIssue, [
      "urine",
      "urinary",
      "bladder",
      "kidney stone",
      "prostate",
      "burning urination",
    ])
  ) {
    addSpecialtyScore("Urology", 5, "Urinary or prostate-related symptoms fit urology review.");
  }

  if (
    includesAny(normalizedIssue, [
      "period",
      "menstrual",
      "pelvic",
      "pregnancy",
      "gyne",
      "gynae",
    ])
  ) {
    addSpecialtyScore(
      "Gynecology",
      5,
      "Female reproductive or menstrual symptoms fit gynecology review.",
    );
  }

  if (
    includesAny(normalizedIssue, [
      "sugar",
      "diabetes",
      "bp",
      "blood pressure",
      "thyroid",
      "fatigue",
      "blood",
      "cholesterol",
    ]) ||
    hasLabReports ||
    chronicDiseaseNames.some((name) =>
      ["diabetes", "hypertension", "thyroid disorder", "heart disease"].includes(name),
    )
  ) {
    addSpecialtyScore(
      "Internal Medicine",
      4,
      "Lab-style concerns or chronic medical conditions fit best with internal medicine follow-up.",
    );
  }

  if (
    includesAny(normalizedIssue, [
      "allergy",
      "rash",
      "itch",
      "sneeze",
      "fever",
      "cold",
      "cough",
      "family",
      "general",
    ]) ||
    allergies.length > 0 ||
    hasPrescriptionReports
  ) {
    addSpecialtyScore(
      "Family Medicine",
      4,
      "General symptoms, allergy context, or prescription history fit well with family medicine.",
    );
  }

  if (medicines.length > 0) {
    addSpecialtyScore(
      "Internal Medicine",
      1,
      `There ${medicines.length > 1 ? "are" : "is"} ${medicines.length} active medicine${medicines.length > 1 ? "s" : ""} to review.`,
    );
    addSpecialtyScore(
      "Family Medicine",
      1,
      "The current medicine list adds useful context for a family medicine review.",
    );
  }

  if (allergies.length > 0) {
    addSpecialtyScore(
      "Family Medicine",
      2,
      `The active profile includes ${allergies.length} recorded allerg${allergies.length > 1 ? "ies" : "y"}.`,
    );
  }

  if (bloodGroup) {
    addSpecialtyScore(
      "Internal Medicine",
      1,
      `Blood group ${bloodGroup} is already captured in the profile for visit preparation.`,
    );
  }

  const prioritizedDoctors = doctors
    .map((doctor) => ({
      doctor,
      score: doctorScores.get(doctor.id) || 0,
      reasons: reasonsByDoctor.get(doctor.id) || [],
    }))
    .sort((first, second) => second.score - first.score);

  const selectedRecommendation = prioritizedDoctors[0];
  const suggestedSlots = availableSlots
    .filter((slot) => slot.doctorId === selectedRecommendation.doctor.id)
    .slice(0, 2);

  return {
    doctor: selectedRecommendation.doctor,
    reasons: selectedRecommendation.reasons.slice(0, 3),
    score: selectedRecommendation.score,
    suggestedSlots,
    priority: "routine",
    reviewedContext: [
      `${reports.length} report${reports.length === 1 ? "" : "s"}`,
      `${medicines.length} medicine${medicines.length === 1 ? "" : "s"}`,
      `${allergies.length} allerg${allergies.length === 1 ? "y" : "ies"}`,
      `${chronicDiseases.length} chronic condition${chronicDiseases.length === 1 ? "" : "s"}`,
      bloodGroup ? `blood group ${bloodGroup}` : "blood group not set",
    ],
    relatedReports: reports.slice(0, 2).map((report) => report.name || report.title),
    mode: "fallback",
    summary:
      "Live AI routing was unavailable, so this recommendation was generated from the app's local fallback matcher.",
  };
}

function getPriorityLabel(priority) {
  switch (priority) {
    case "urgent-review":
      return "Urgent review";
    case "soon":
      return "Soon";
    default:
      return "Routine";
  }
}

function RecommendationBubble({ message }) {
  return (
    <div className="max-w-3xl rounded-3xl rounded-tl-md bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-teal">
          <Sparkles size={16} />
          {message.mode === "fallback" ? "Care navigator fallback" : "Care navigator recommendation"}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            message.mode === "fallback"
              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          }`}
        >
          {message.mode === "fallback" ? "Fallback routing" : "AI recommendation"}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">{message.summary || message.text}</p>

      <div className="mt-5 rounded-2xl border border-slate-200 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-brand-blue">
            <Stethoscope size={22} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-950">{message.doctor.name}</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {getPriorityLabel(message.priority)}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              {message.doctor.specialty} | {message.doctor.clinic}
            </p>
            <p className="mt-1 text-sm text-slate-600">{message.doctor.location}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-800">Why this doctor</p>
        <div className="mt-3 space-y-2">
          {message.reasons.map((reason) => (
            <p key={reason} className="text-sm leading-6 text-slate-600">
              {reason}
            </p>
          ))}
        </div>
      </div>

      {message.relatedReports.length > 0 && (
        <div className="mt-5 rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <CalendarRange size={16} />
            Reports used
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {message.relatedReports.map((reportName) => (
              <span
                key={reportName}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                {reportName}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <p className="text-sm font-semibold text-slate-800">Context reviewed</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {message.reviewedContext.map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-slate-800">Suggested slots</p>
        {message.suggestedSlots.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            No preset slots are available right now, but this is still the strongest doctor match.
          </p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {message.suggestedSlots.map((slot) => (
              <div key={slot.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-950">{slot.doctorName}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {slot.date} | {slot.time}
                </p>
                <p className="mt-1 text-sm text-slate-500">{slot.type}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookAppointment() {
  const { hasApiKey, openRouterApiKey } = useAiConfig();
  const { reports } = useMedicalReports();
  const { medicines } = useMedicines();
  const { allergies, bloodGroup, chronicDiseases } = useMedicalProfile();
  const [referenceData] = useState(() => loadInitialData());
  const { doctors, availableSlots } = referenceData;
  const [messages, setMessages] = useState([
    {
      id: "assistant-welcome",
      role: "assistant",
      type: "text",
      text:
        "Describe the issue you want help with, then click Find me a doctor. The recommendation will use your reports, medicines, and active medical profile.",
    },
  ]);
  const [issue, setIssue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleFindDoctor() {
    const trimmedIssue = issue.trim();

    if (!trimmedIssue || isProcessing || !hasApiKey) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `user-${Date.now()}`,
        role: "user",
        type: "text",
        text: trimmedIssue,
      },
    ]);
    setIssue("");
    setIsProcessing(true);

    try {
      let recommendationMessage;

      try {
        const aiRecommendation = await recommendDoctorWithAi({
          apiKey: openRouterApiKey,
          availableSlots,
          allergies,
          bloodGroup,
          chronicDiseases,
          doctors,
          issue: trimmedIssue,
          medicines,
          reports,
        });
        const doctor = doctors.find((item) => item.id === aiRecommendation.doctorId);

        if (!doctor) {
          throw new Error("The AI response did not map to a known doctor.");
        }

        const relatedReports = reports.filter((report) =>
          aiRecommendation.reportIds.includes(String(report.id)),
        );
        const suggestedSlots = aiRecommendation.slotIds.length
          ? availableSlots.filter((slot) => aiRecommendation.slotIds.includes(slot.id))
          : availableSlots.filter((slot) => slot.doctorId === doctor.id).slice(0, 2);

        recommendationMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          type: "recommendation",
          mode: "ai",
          text: `Based on the issue you described, the strongest current match is ${doctor.name}.`,
          summary:
            aiRecommendation.summary ||
            `Based on the issue you described, the strongest current match is ${doctor.name}.`,
          doctor,
          reasons:
            aiRecommendation.reasoning.length > 0
              ? aiRecommendation.reasoning
              : [
                  "The uploaded report context, medical profile, and described issue point to this specialty.",
                ],
          priority: aiRecommendation.priority,
          relatedReports: relatedReports.map((report) => report.name || report.title),
          suggestedSlots,
          reviewedContext:
            aiRecommendation.reviewedContext.length > 0
              ? aiRecommendation.reviewedContext
              : [
                  `${reports.length} report${reports.length === 1 ? "" : "s"}`,
                  `${medicines.length} medicine${medicines.length === 1 ? "" : "s"}`,
                  `${allergies.length} allerg${allergies.length === 1 ? "y" : "ies"}`,
                  `${chronicDiseases.length} chronic condition${chronicDiseases.length === 1 ? "" : "s"}`,
                  bloodGroup ? `blood group ${bloodGroup}` : "blood group not set",
                ],
        };
      } catch {
        const fallbackRecommendation = buildDoctorRecommendation({
          availableSlots,
          allergies,
          bloodGroup,
          chronicDiseases,
          doctors,
          issue: trimmedIssue,
          medicines,
          reports,
        });

        recommendationMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          type: "recommendation",
          text: `Based on the issue you described, the strongest current match is ${fallbackRecommendation.doctor.name}.`,
          ...fallbackRecommendation,
        };
      }

      setMessages((currentMessages) => [...currentMessages, recommendationMessage]);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">Book an appointment</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Find the right doctor</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Describe your issue in natural language. The app reviews processed reports, active
          medicines, allergies, chronic diseases, and blood group before recommending the most
          relevant doctor.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="content-card p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950">Data considered</h2>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <FileText className="text-brand-blue" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-950">Reports</p>
                  <p className="text-sm text-slate-600">{reports.length} uploaded report(s)</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Pill className="text-emerald-700" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-950">Medicines</p>
                  <p className="text-sm text-slate-600">{medicines.length} active medicine(s)</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-rose-700" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-950">Allergies</p>
                  <p className="text-sm text-slate-600">{allergies.length} allergy item(s)</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <HeartPulse className="text-amber-700" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-950">Chronic diseases</p>
                  <p className="text-sm text-slate-600">
                    {chronicDiseases.length} chronic condition(s)
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Droplets className="text-blue-700" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-950">Blood group</p>
                  <p className="text-sm text-slate-600">{bloodGroup || "Not set"}</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="content-card flex min-h-[32rem] flex-col overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-brand-blue shadow-sm">
                <Stethoscope size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-950">Care navigator chat</h2>
                <p className="text-sm text-slate-500">
                  One prompt in, one doctor recommendation out.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-2xl rounded-3xl rounded-tr-md bg-brand-blue px-5 py-4 text-sm leading-6 text-white">
                    {message.text}
                  </div>
                </div>
              ) : message.type === "recommendation" ? (
                <div key={message.id} className="flex justify-start">
                  <RecommendationBubble message={message} />
                </div>
              ) : (
                <div key={message.id} className="flex justify-start">
                  <div className="max-w-2xl rounded-3xl rounded-tl-md bg-slate-100 px-5 py-4 text-sm leading-6 text-slate-700">
                    {message.text}
                  </div>
                </div>
              ),
            )}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-3 rounded-3xl rounded-tl-md bg-slate-100 px-5 py-4 text-sm font-medium text-slate-700">
                  <LoaderCircle size={18} className="animate-spin" />
                  Reviewing reports, medicines, and medical profile...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Describe your issue</span>
              <textarea
                value={issue}
                onChange={(event) => setIssue(event.target.value)}
                placeholder="Example: I have recurring chest discomfort and uploaded an X-ray report last week."
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                This routing result helps choose a doctor. It is not a diagnosis or emergency triage.
              </p>
              <button
                type="button"
                onClick={() => void handleFindDoctor()}
                disabled={isProcessing || !hasApiKey}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles size={18} />
                Find me a doctor
              </button>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
