import { createContext, useContext, useEffect, useState } from "react";
import { loadInitialData, saveMedicalEvents, saveMedicines } from "../utils/storage.js";

const MedicinesContext = createContext(null);

function normalizeMedicine(medicine, index) {
  return {
    id: medicine.id ?? `medicine-${index + 1}`,
    name: medicine.name || "",
    dosage: medicine.dosage || "",
    frequency: medicine.frequency || "",
    mg: medicine.mg || "",
    active: medicine.active ?? true,
    createdAt: medicine.createdAt || medicine.startedOn || new Date().toISOString(),
  };
}

function createMedicineTimelineEvent(action, medicine) {
  const occurredAt = new Date().toISOString();

  if (action === "added") {
    return {
      id: `medicine-added-${Date.now()}`,
      source: "medicine",
      action: "added",
      occurredAt,
      medicineId: medicine.id,
      medicineName: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      mg: medicine.mg,
    };
  }

  return {
    id: `medicine-removed-${Date.now()}`,
    source: "medicine",
    action: "removed",
    occurredAt,
    medicineId: medicine.id,
    medicineName: medicine.name,
    dosage: medicine.dosage,
    frequency: medicine.frequency,
    mg: medicine.mg,
  };
}

export function MedicinesProvider({ children }) {
  const [medicines, setMedicines] = useState(() =>
    loadInitialData().medicines.map(normalizeMedicine),
  );
  const [medicineTimelineEvents, setMedicineTimelineEvents] = useState(() =>
    loadInitialData().medicalEvents.filter((event) => event.source === "medicine"),
  );

  useEffect(() => {
    saveMedicines(medicines);
  }, [medicines]);

  useEffect(() => {
    saveMedicalEvents(medicineTimelineEvents);
  }, [medicineTimelineEvents]);

  function addMedicine({ name, dosage, frequency, mg }) {
    const trimmedMedicine = {
      id: `medicine-${Date.now()}`,
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      mg: mg.trim(),
      active: true,
      createdAt: new Date().toISOString(),
    };

    setMedicines((currentMedicines) => [trimmedMedicine, ...currentMedicines]);
    setMedicineTimelineEvents((currentEvents) => [
      createMedicineTimelineEvent("added", trimmedMedicine),
      ...currentEvents,
    ]);
  }

  function removeMedicine(medicineId) {
    const medicineToRemove = medicines.find((medicine) => medicine.id === medicineId);

    if (!medicineToRemove) {
      return;
    }

    setMedicineTimelineEvents((currentEvents) => [
      createMedicineTimelineEvent("removed", medicineToRemove),
      ...currentEvents,
    ]);
    setMedicines((currentMedicines) =>
      currentMedicines.filter((medicine) => medicine.id !== medicineId),
    );
  }

  return (
    <MedicinesContext.Provider
      value={{
        medicines,
        medicineTimelineEvents,
        addMedicine,
        removeMedicine,
      }}
    >
      {children}
    </MedicinesContext.Provider>
  );
}

export function useMedicines() {
  const context = useContext(MedicinesContext);

  if (!context) {
    throw new Error("useMedicines must be used within a MedicinesProvider.");
  }

  return context;
}
