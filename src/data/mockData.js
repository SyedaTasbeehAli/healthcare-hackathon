import {
  Activity,
  CalendarCheck,
  FileText,
  HeartPulse,
  Hospital,
  Pill,
  ShieldCheck,
  Stethoscope,
  Syringe,
  UserRound,
  UsersRound,
} from "lucide-react";

// This file stores temporary dummy data.
// Later, when you add a backend, these arrays can be replaced with API responses.

export const overviewStats = [
  { label: "Total Documents", value: "42", icon: FileText, tone: "blue" },
  { label: "Medical Reports", value: "18", icon: Activity, tone: "teal" },
  { label: "Active Medicines", value: "3", icon: Pill, tone: "green" },
  { label: "Upcoming Follow-ups", value: "2", icon: CalendarCheck, tone: "amber" },
];

export const documents = [
  {
    id: 1,
    name: "CBC Blood Test",
    date: "12 June 2026",
    category: "Blood Test",
    type: "Lab Reports",
  },
  {
    id: 2,
    name: "Prescription Added",
    date: "15 June 2026",
    category: "Prescription",
    type: "Prescriptions",
  },
  {
    id: 3,
    name: "Chest X-ray Report",
    date: "18 June 2026",
    category: "Radiology",
    type: "X-rays",
  },
  {
    id: 4,
    name: "Vaccination Record",
    date: "02 May 2026",
    category: "Vaccination",
    type: "Vaccination Records",
  },
];

export const timelineEvents = [
  {
    id: 1,
    date: "June 12, 2026",
    title: "CBC Blood Test Uploaded",
    description: "Lab report added to Self profile.",
    icon: FileText,
  },
  {
    id: 2,
    date: "June 15, 2026",
    title: "Prescription Added",
    description: "Medicine instructions saved for easier tracking.",
    icon: Pill,
  },
  {
    id: 3,
    date: "June 20, 2026",
    title: "Follow-up Appointment",
    description: "Doctor follow-up added to upcoming care schedule.",
    icon: Stethoscope,
  },
];

export const summaries = [
  {
    document: "CBC Blood Report",
    category: "Blood Test",
    summary:
      "This document appears to be a CBC blood test report. It contains information about hemoglobin, WBC count, platelet count and other blood parameters.",
  },
  {
    document: "Chest X-ray Report",
    category: "Radiology",
    summary:
      "This report appears to describe a chest imaging exam and includes clinical observations, image findings, and a radiology impression section.",
  },
];

export const searchPrompts = [
  "Show my blood reports from last 6 months",
  "Find prescriptions from Dr Ahmed",
  "When was my last dengue test?",
];

export const medicines = [
  { name: "Panadol", dosage: "500mg", frequency: "Twice daily", duration: "3 days" },
  { name: "Vitamin D3", dosage: "1000 IU", frequency: "Once daily", duration: "30 days" },
  { name: "Cetirizine", dosage: "10mg", frequency: "At night", duration: "5 days" },
];

export const profiles = [
  { name: "Self", relation: "Primary patient", icon: UserRound, documents: 42 },
  { name: "Father", relation: "Family profile", icon: UsersRound, documents: 16 },
  { name: "Mother", relation: "Family profile", icon: HeartPulse, documents: 21 },
  { name: "Children", relation: "Dependent profiles", icon: ShieldCheck, documents: 9 },
];

export const doctorShareSections = [
  { title: "Recent reports", value: "CBC Blood Test, Chest X-ray", icon: FileText },
  { title: "Current medicines", value: "Panadol, Vitamin D3, Cetirizine", icon: Pill },
  { title: "Allergies", value: "Penicillin allergy noted", icon: Syringe },
  { title: "Timeline", value: "3 key events from June 2026", icon: Hospital },
];
