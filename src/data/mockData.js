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
  { label: "Total Documents", value: "4", icon: FileText, tone: "blue" },
  { label: "Medical Reports", value: "3", icon: Activity, tone: "teal" },
  { label: "Active Medicines", value: "3", icon: Pill, tone: "green" },
  { label: "Upcoming Follow-ups", value: "2", icon: CalendarCheck, tone: "amber" },
];

export const medicalReports = [
  {
    id: 1,
    name: "CBC Blood Test",
    date: "12 June 2026",
    uploadedAt: "2026-06-12T09:30:00",
    category: "Blood Test",
    type: "Lab Reports",
    profile: "Self",
    doctor: "Dr Ahmed Khan",
    fileName: "cbc-blood-test.pdf",
    status: "Reviewed",
    aiSummary:
      "AI-assisted summary: CBC values are recorded for doctor review. This is not a medical diagnosis.",
  },
  {
    id: 2,
    name: "Prescription Added",
    date: "15 June 2026",
    uploadedAt: "2026-06-15T11:10:00",
    category: "Prescription",
    type: "Prescriptions",
    profile: "Self",
    doctor: "Dr Sara Malik",
    fileName: "prescription-june.pdf",
    status: "Saved",
    aiSummary:
      "AI-assisted summary: Medicine instructions were detected and saved for tracking.",
  },
  {
    id: 3,
    name: "Chest X-ray Report",
    date: "18 June 2026",
    uploadedAt: "2026-06-18T16:05:00",
    category: "Radiology",
    type: "X-rays",
    profile: "Self",
    doctor: "Dr Omar Siddiqui",
    fileName: "chest-xray-report.pdf",
    status: "Needs review",
    aiSummary:
      "AI-assisted summary: Imaging notes include observations and possible concerns for clinician review.",
  },
  {
    id: 4,
    name: "Vaccination Record",
    date: "02 May 2026",
    uploadedAt: "2026-05-02T14:20:00",
    category: "Vaccination",
    type: "Vaccination Records",
    profile: "Self",
    doctor: "City Clinic",
    fileName: "vaccination-record.pdf",
    status: "Saved",
    aiSummary:
      "AI-assisted summary: Vaccination details were identified and stored in the health record.",
  },
];

export const documents = medicalReports;

export const medicines = [
  {
    id: 1,
    name: "Panadol",
    dosage: "1 tablet",
    mg: "500mg",
    frequency: "Twice daily",
    duration: "3 days",
    startedOn: "15 June 2026",
    prescribedBy: "Dr Sara Malik",
    notes: "Take after meals if needed.",
    active: true,
  },
  {
    id: 2,
    name: "Vitamin D3",
    dosage: "1 capsule",
    mg: "1000 IU",
    frequency: "Once daily",
    duration: "30 days",
    startedOn: "01 June 2026",
    prescribedBy: "Dr Ahmed Khan",
    notes: "Morning dose preferred.",
    active: true,
  },
  {
    id: 3,
    name: "Cetirizine",
    dosage: "1 tablet",
    mg: "10mg",
    frequency: "At night",
    duration: "5 days",
    startedOn: "16 June 2026",
    prescribedBy: "Dr Sara Malik",
    notes: "May cause drowsiness.",
    active: true,
  },
];

export const allergies = [
  {
    id: 1,
    name: "Penicillin",
    reaction: "Rash and swelling",
    severity: "High",
    notedOn: "10 January 2024",
    notes: "Confirm with clinician before any antibiotic prescription.",
  },
  {
    id: 2,
    name: "Dust",
    reaction: "Sneezing and watery eyes",
    severity: "Moderate",
    notedOn: "22 March 2025",
    notes: "Seasonal flare-ups reported.",
  },
];

export const diagnoses = [
  {
    id: 1,
    condition: "Vitamin D deficiency",
    recordedOn: "01 June 2026",
    clinician: "Dr Ahmed Khan",
    status: "Monitoring",
    notes: "Past clinician-recorded condition, included for history only.",
  },
  {
    id: 2,
    condition: "Allergic rhinitis",
    recordedOn: "22 March 2025",
    clinician: "Dr Sara Malik",
    status: "Recurring",
    notes: "Use as background history when discussing possible concerns with a clinician.",
  },
];

export const medicalEvents = [
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

export const timelineEvents = medicalEvents;

export const summaries = [
  {
    document: "CBC Blood Report",
    category: "Blood Test",
    summary:
      "AI-assisted summary: This document appears to be a CBC blood test report. It contains hemoglobin, WBC count, platelet count, and other blood parameters. This is not a medical diagnosis.",
  },
  {
    document: "Chest X-ray Report",
    category: "Radiology",
    summary:
      "AI-assisted summary: This report appears to describe a chest imaging exam and includes clinical observations, image findings, and possible concerns for clinician review.",
  },
];

export const searchPrompts = [
  "Show my blood reports from last 6 months",
  "Find prescriptions from Dr Ahmed",
  "When was my last dengue test?",
];

export const profiles = [
  { name: "Self", relation: "Primary patient", icon: UserRound, documents: 4 },
  { name: "Father", relation: "Family profile", icon: UsersRound, documents: 16 },
  { name: "Mother", relation: "Family profile", icon: HeartPulse, documents: 21 },
  { name: "Children", relation: "Dependent profiles", icon: ShieldCheck, documents: 9 },
];

export const doctors = [
  {
    id: 1,
    name: "Dr Ahmed Khan",
    specialty: "Internal Medicine",
    clinic: "City Care Clinic",
    location: "Lahore",
    focusAreas: [
      "fever",
      "fatigue",
      "blood pressure",
      "general medical review",
      "cholesterol",
      "diabetes screening",
    ],
  },
  {
    id: 2,
    name: "Dr Sara Malik",
    specialty: "Family Medicine",
    clinic: "MediCare Center",
    location: "Lahore",
    focusAreas: [
      "cough",
      "cold",
      "allergy symptoms",
      "general follow-up",
      "prescription review",
      "primary care",
    ],
  },
  {
    id: 3,
    name: "Dr Omar Siddiqui",
    specialty: "Radiology",
    clinic: "HealthScan Diagnostics",
    location: "Lahore",
    focusAreas: [
      "x-ray review",
      "ultrasound review",
      "scan findings",
      "imaging interpretation",
    ],
  },
  {
    id: 4,
    name: "Dr Hina Farooq",
    specialty: "Gastroenterology",
    clinic: "Digestive Health Associates",
    location: "Lahore",
    focusAreas: [
      "stomach pain",
      "digestion issues",
      "acid reflux",
      "constipation",
      "ulcer symptoms",
      "abdominal bloating",
    ],
  },
  {
    id: 5,
    name: "Dr Bilal Raza",
    specialty: "Orthopedics",
    clinic: "Bone and Joint Center",
    location: "Lahore",
    focusAreas: [
      "bone pain",
      "joint pain",
      "fracture",
      "back pain",
      "knee injury",
      "sports injury",
    ],
  },
  {
    id: 6,
    name: "Dr Ayesha Qureshi",
    specialty: "Cardiology",
    clinic: "HeartCare Institute",
    location: "Lahore",
    focusAreas: [
      "chest pain",
      "palpitations",
      "shortness of breath",
      "heart disease",
      "hypertension",
    ],
  },
  {
    id: 7,
    name: "Dr Usman Latif",
    specialty: "Pulmonology",
    clinic: "Lung and Sleep Clinic",
    location: "Lahore",
    focusAreas: [
      "breathing issue",
      "persistent cough",
      "asthma",
      "chest congestion",
      "lung infection",
    ],
  },
  {
    id: 8,
    name: "Dr Muneeb Tariq",
    specialty: "Neurology",
    clinic: "NeuroCare Specialists",
    location: "Lahore",
    focusAreas: [
      "headache",
      "migraine",
      "dizziness",
      "numbness",
      "seizure",
      "nerve pain",
    ],
  },
  {
    id: 9,
    name: "Dr Maham Siddique",
    specialty: "Dermatology",
    clinic: "SkinSense Clinic",
    location: "Lahore",
    focusAreas: [
      "skin rash",
      "acne",
      "itching",
      "eczema",
      "fungal infection",
    ],
  },
  {
    id: 10,
    name: "Dr Aliya Nadeem",
    specialty: "Endocrinology",
    clinic: "Hormone and Metabolism Center",
    location: "Lahore",
    focusAreas: [
      "thyroid disorder",
      "hormonal imbalance",
      "diabetes management",
      "weight changes",
      "blood sugar",
    ],
  },
  {
    id: 11,
    name: "Dr Farhan Baig",
    specialty: "ENT",
    clinic: "Ear Nose Throat Clinic",
    location: "Lahore",
    focusAreas: [
      "throat pain",
      "sinus issue",
      "ear pain",
      "voice problem",
      "tonsil infection",
    ],
  },
  {
    id: 12,
    name: "Dr Zoya Hassan",
    specialty: "Nephrology",
    clinic: "Kidney Care Unit",
    location: "Lahore",
    focusAreas: [
      "kidney function",
      "creatinine",
      "protein in urine",
      "swelling",
      "renal disease",
    ],
  },
  {
    id: 13,
    name: "Dr Amna Asif",
    specialty: "Gynecology",
    clinic: "Women's Wellness Center",
    location: "Lahore",
    focusAreas: [
      "menstrual issue",
      "pelvic pain",
      "pregnancy care",
      "hormonal cycle",
      "female reproductive health",
    ],
  },
  {
    id: 14,
    name: "Dr Sameer Iqbal",
    specialty: "Urology",
    clinic: "Urinary Health Clinic",
    location: "Lahore",
    focusAreas: [
      "urinary pain",
      "kidney stone",
      "prostate issue",
      "frequent urination",
      "bladder symptoms",
    ],
  },
];

export const availableSlots = [
  {
    id: 1,
    doctorId: 1,
    doctorName: "Dr Ahmed Khan",
    date: "2026-06-21",
    time: "10:00 AM",
    type: "Clinic visit",
  },
  {
    id: 2,
    doctorId: 1,
    doctorName: "Dr Ahmed Khan",
    date: "2026-06-21",
    time: "12:30 PM",
    type: "Video consult",
  },
  {
    id: 3,
    doctorId: 2,
    doctorName: "Dr Sara Malik",
    date: "2026-06-22",
    time: "04:00 PM",
    type: "Clinic visit",
  },
  {
    id: 4,
    doctorId: 3,
    doctorName: "Dr Omar Siddiqui",
    date: "2026-06-23",
    time: "11:00 AM",
    type: "Report review",
  },
  {
    id: 5,
    doctorId: 4,
    doctorName: "Dr Hina Farooq",
    date: "2026-06-24",
    time: "09:30 AM",
    type: "Clinic visit",
  },
  {
    id: 6,
    doctorId: 5,
    doctorName: "Dr Bilal Raza",
    date: "2026-06-24",
    time: "02:00 PM",
    type: "Clinic visit",
  },
  {
    id: 7,
    doctorId: 6,
    doctorName: "Dr Ayesha Qureshi",
    date: "2026-06-25",
    time: "10:30 AM",
    type: "Clinic visit",
  },
  {
    id: 8,
    doctorId: 7,
    doctorName: "Dr Usman Latif",
    date: "2026-06-25",
    time: "05:00 PM",
    type: "Video consult",
  },
  {
    id: 9,
    doctorId: 8,
    doctorName: "Dr Muneeb Tariq",
    date: "2026-06-26",
    time: "01:00 PM",
    type: "Clinic visit",
  },
  {
    id: 10,
    doctorId: 9,
    doctorName: "Dr Maham Siddique",
    date: "2026-06-26",
    time: "04:30 PM",
    type: "Clinic visit",
  },
  {
    id: 11,
    doctorId: 10,
    doctorName: "Dr Aliya Nadeem",
    date: "2026-06-27",
    time: "11:30 AM",
    type: "Clinic visit",
  },
  {
    id: 12,
    doctorId: 11,
    doctorName: "Dr Farhan Baig",
    date: "2026-06-27",
    time: "03:00 PM",
    type: "Clinic visit",
  },
  {
    id: 13,
    doctorId: 12,
    doctorName: "Dr Zoya Hassan",
    date: "2026-06-28",
    time: "09:00 AM",
    type: "Clinic visit",
  },
  {
    id: 14,
    doctorId: 13,
    doctorName: "Dr Amna Asif",
    date: "2026-06-28",
    time: "12:00 PM",
    type: "Clinic visit",
  },
  {
    id: 15,
    doctorId: 14,
    doctorName: "Dr Sameer Iqbal",
    date: "2026-06-29",
    time: "02:30 PM",
    type: "Clinic visit",
  },
];

export const appointments = [
  {
    id: 1,
    doctorId: 1,
    doctorName: "Dr Ahmed Khan",
    date: "2026-06-20",
    time: "03:30 PM",
    type: "Follow-up",
    status: "Booked",
    reason: "Review CBC report and current medicines",
  },
];

export const doctorShareSections = [
  { title: "Recent reports", value: "CBC Blood Test, Chest X-ray", icon: FileText },
  { title: "Current medicines", value: "Panadol, Vitamin D3, Cetirizine", icon: Pill },
  { title: "Allergies", value: "Penicillin allergy noted", icon: Syringe },
  { title: "Possible concerns", value: "Review past conditions with a clinician", icon: Hospital },
];
