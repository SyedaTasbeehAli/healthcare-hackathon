import {
  allergies,
  appointments,
  availableSlots,
  diagnoses,
  doctors,
  medicines,
} from "../data/mockData.js";

export const STORAGE_KEYS = {
  medicalReports: "medivault.medicalReports",
  medicines: "medivault.medicines",
  medicalProfile: "medivault.medicalProfile",
  allergies: "medivault.allergies",
  diagnoses: "medivault.diagnoses",
  medicalEvents: "medivault.medicalEvents",
  doctors: "medivault.doctors",
  availableSlots: "medivault.availableSlots",
  appointments: "medivault.appointments",
};

const initialData = {
  medicalReports: [],
  medicines,
  allergies,
  diagnoses,
  medicalEvents: [],
  doctors,
  availableSlots,
  appointments,
};
const initialMedicalProfile = {
  bloodGroup: "",
  allergies: [],
  chronicDiseases: [],
  allergyTimelineEvents: [],
  chronicDiseaseTimelineEvents: [],
};

const LEGACY_DEMO_REPORT_FILE_NAMES = new Set([
  "cbc-blood-test.pdf",
  "prescription-june.pdf",
  "chest-xray-report.pdf",
  "vaccination-record.pdf",
]);
const LEGACY_DEMO_MEDICAL_EVENT_TITLES = new Set([
  "CBC Blood Test Uploaded",
  "Prescription Added",
  "Follow-up Appointment",
]);

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readArray(key, fallback) {
  if (!canUseLocalStorage()) {
    return fallback;
  }

  const storedValue = window.localStorage.getItem(key);

  if (!storedValue) {
    return fallback;
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue : fallback;
  } catch {
    return fallback;
  }
}

function writeArray(key, value) {
  if (!Array.isArray(value)) {
    throw new TypeError("Stored prototype data must be an array.");
  }

  if (canUseLocalStorage()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  return value;
}

function readObject(key, fallback) {
  if (!canUseLocalStorage()) {
    return fallback;
  }

  const storedValue = window.localStorage.getItem(key);

  if (!storedValue) {
    return fallback;
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    return parsedValue && typeof parsedValue === "object" && !Array.isArray(parsedValue)
      ? parsedValue
      : fallback;
  } catch {
    return fallback;
  }
}

function writeObject(key, value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError("Stored prototype data must be an object.");
  }

  if (canUseLocalStorage()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  return value;
}

function isLegacyDemoMedicalReport(report) {
  return (
    typeof report?.id === "number" &&
    LEGACY_DEMO_REPORT_FILE_NAMES.has(report?.fileName)
  );
}

function sanitizeMedicalReports(reports) {
  return reports.filter((report) => !isLegacyDemoMedicalReport(report));
}

function isLegacyDemoMedicalEvent(event) {
  return (
    typeof event?.id === "number" &&
    LEGACY_DEMO_MEDICAL_EVENT_TITLES.has(event?.title)
  );
}

function sanitizeMedicalEvents(events) {
  return events.filter((event) => !isLegacyDemoMedicalEvent(event));
}

function mergeSeedArray(defaultItems, storedItems) {
  const safeDefaults = Array.isArray(defaultItems) ? defaultItems : [];
  const safeStored = Array.isArray(storedItems) ? storedItems : [];
  const defaultIds = new Set(safeDefaults.map((item) => String(item.id)));

  return [
    ...safeDefaults.map((defaultItem) => {
      const storedItem = safeStored.find(
        (candidateItem) => String(candidateItem?.id) === String(defaultItem.id),
      );

      return storedItem ? { ...defaultItem, ...storedItem } : defaultItem;
    }),
    ...safeStored.filter((storedItem) => !defaultIds.has(String(storedItem?.id))),
  ];
}

export function loadInitialData() {
  return {
    medicalReports: sanitizeMedicalReports(
      readArray(STORAGE_KEYS.medicalReports, initialData.medicalReports),
    ),
    medicines: readArray(STORAGE_KEYS.medicines, initialData.medicines),
    allergies: readArray(STORAGE_KEYS.allergies, initialData.allergies),
    diagnoses: readArray(STORAGE_KEYS.diagnoses, initialData.diagnoses),
    medicalEvents: sanitizeMedicalEvents(
      readArray(STORAGE_KEYS.medicalEvents, initialData.medicalEvents),
    ),
    doctors: mergeSeedArray(
      initialData.doctors,
      readArray(STORAGE_KEYS.doctors, initialData.doctors),
    ),
    availableSlots: mergeSeedArray(
      initialData.availableSlots,
      readArray(STORAGE_KEYS.availableSlots, initialData.availableSlots),
    ),
    appointments: readArray(STORAGE_KEYS.appointments, initialData.appointments),
  };
}

export function loadMedicalProfile() {
  const storedProfile = readObject(STORAGE_KEYS.medicalProfile, initialMedicalProfile);

  return {
    bloodGroup:
      typeof storedProfile.bloodGroup === "string" ? storedProfile.bloodGroup : "",
    allergies: Array.isArray(storedProfile.allergies) ? storedProfile.allergies : [],
    chronicDiseases: Array.isArray(storedProfile.chronicDiseases)
      ? storedProfile.chronicDiseases
      : [],
    allergyTimelineEvents: Array.isArray(storedProfile.allergyTimelineEvents)
      ? storedProfile.allergyTimelineEvents
      : [],
    chronicDiseaseTimelineEvents: Array.isArray(storedProfile.chronicDiseaseTimelineEvents)
      ? storedProfile.chronicDiseaseTimelineEvents
      : [],
  };
}

export function saveMedicines(updatedMedicines) {
  return writeArray(STORAGE_KEYS.medicines, updatedMedicines);
}

export function saveAllergies(updatedAllergies) {
  return writeArray(STORAGE_KEYS.allergies, updatedAllergies);
}

export function saveDiagnoses(updatedDiagnoses) {
  return writeArray(STORAGE_KEYS.diagnoses, updatedDiagnoses);
}

export function saveMedicalEvents(updatedMedicalEvents) {
  return writeArray(
    STORAGE_KEYS.medicalEvents,
    sanitizeMedicalEvents(updatedMedicalEvents),
  );
}

export function saveMedicalProfile(updatedMedicalProfile) {
  return writeObject(STORAGE_KEYS.medicalProfile, updatedMedicalProfile);
}

export function saveMedicalReports(updatedReports) {
  return writeArray(
    STORAGE_KEYS.medicalReports,
    sanitizeMedicalReports(updatedReports),
  );
}

export function saveUploadedDocumentMetadata(documentMetadata) {
  const currentReports = sanitizeMedicalReports(
    readArray(STORAGE_KEYS.medicalReports, initialData.medicalReports),
  );
  const nextReport = {
    id: Date.now(),
    uploadedAt: new Date().toISOString(),
    notes: "Uploaded for AI-assisted review. Not a medical diagnosis.",
    status: "Pending review",
    ...documentMetadata,
  };
  const updatedReports = [nextReport, ...currentReports];

  return writeArray(STORAGE_KEYS.medicalReports, updatedReports);
}

export function saveAppointments(updatedAppointments) {
  return writeArray(STORAGE_KEYS.appointments, updatedAppointments);
}
