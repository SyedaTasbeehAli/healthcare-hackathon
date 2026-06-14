import {
  allergies,
  appointments,
  availableSlots,
  diagnoses,
  doctors,
  medicalEvents,
  medicalReports,
  medicines,
} from "../data/mockData.js";

export const STORAGE_KEYS = {
  medicalReports: "medivault.medicalReports",
  medicines: "medivault.medicines",
  allergies: "medivault.allergies",
  diagnoses: "medivault.diagnoses",
  medicalEvents: "medivault.medicalEvents",
  doctors: "medivault.doctors",
  availableSlots: "medivault.availableSlots",
  appointments: "medivault.appointments",
};

const initialData = {
  medicalReports,
  medicines,
  allergies,
  diagnoses,
  medicalEvents,
  doctors,
  availableSlots,
  appointments,
};

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

export function loadInitialData() {
  return {
    medicalReports: readArray(STORAGE_KEYS.medicalReports, initialData.medicalReports),
    medicines: readArray(STORAGE_KEYS.medicines, initialData.medicines),
    allergies: readArray(STORAGE_KEYS.allergies, initialData.allergies),
    diagnoses: readArray(STORAGE_KEYS.diagnoses, initialData.diagnoses),
    medicalEvents: readArray(STORAGE_KEYS.medicalEvents, initialData.medicalEvents),
    doctors: readArray(STORAGE_KEYS.doctors, initialData.doctors),
    availableSlots: readArray(STORAGE_KEYS.availableSlots, initialData.availableSlots),
    appointments: readArray(STORAGE_KEYS.appointments, initialData.appointments),
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

export function saveMedicalReports(updatedReports) {
  return writeArray(STORAGE_KEYS.medicalReports, updatedReports);
}

export function saveUploadedDocumentMetadata(documentMetadata) {
  const currentReports = readArray(STORAGE_KEYS.medicalReports, initialData.medicalReports);
  const nextReport = {
    id: Date.now(),
    uploadedAt: new Date().toISOString(),
    status: "Saved",
    ...documentMetadata,
  };
  const updatedReports = [nextReport, ...currentReports];

  return writeArray(STORAGE_KEYS.medicalReports, updatedReports);
}

export function saveAppointments(updatedAppointments) {
  return writeArray(STORAGE_KEYS.appointments, updatedAppointments);
}

