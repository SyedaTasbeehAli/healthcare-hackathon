import { createContext, useContext, useEffect, useState } from "react";
import { loadMedicalProfile, saveMedicalProfile } from "../utils/storage.js";

const MedicalProfileContext = createContext(null);

export const bloodGroupOptions = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export const popularAllergyOptions = [
  "Penicillin",
  "Dust",
  "Pollen",
  "Peanuts",
  "Seafood",
  "Latex",
];

export const popularChronicDiseaseOptions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Thyroid Disorder",
  "Arthritis",
  "Heart Disease",
];

function normalizeProfileItem(item, fallbackKey) {
  return {
    id: item.id ?? `${fallbackKey}-${Date.now()}`,
    name: item.name || "",
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

function createAllergyTimelineEvent(action, allergyName) {
  return {
    id: `allergy-${action}-${Date.now()}`,
    source: "medicalProfile",
    eventType: "allergy",
    action,
    occurredAt: new Date().toISOString(),
    allergyName,
  };
}

function createChronicDiseaseTimelineEvent(action, diseaseName) {
  return {
    id: `chronic-disease-${action}-${Date.now()}`,
    source: "medicalProfile",
    eventType: "chronicDisease",
    action,
    occurredAt: new Date().toISOString(),
    diseaseName,
  };
}

export function MedicalProfileProvider({ children }) {
  const [medicalProfile, setMedicalProfile] = useState(() => {
    const storedProfile = loadMedicalProfile();

    return {
      bloodGroup: storedProfile.bloodGroup || "",
      allergies: storedProfile.allergies.map((item, index) =>
        normalizeProfileItem(item, `allergy-${index + 1}`),
      ),
      chronicDiseases: storedProfile.chronicDiseases.map((item, index) =>
        normalizeProfileItem(item, `disease-${index + 1}`),
      ),
      allergyTimelineEvents: Array.isArray(storedProfile.allergyTimelineEvents)
        ? storedProfile.allergyTimelineEvents
        : [],
      chronicDiseaseTimelineEvents: Array.isArray(
        storedProfile.chronicDiseaseTimelineEvents,
      )
        ? storedProfile.chronicDiseaseTimelineEvents
        : [],
    };
  });

  useEffect(() => {
    saveMedicalProfile(medicalProfile);
  }, [medicalProfile]);

  function setBloodGroup(bloodGroup) {
    setMedicalProfile((currentProfile) => ({
      ...currentProfile,
      bloodGroup,
    }));
  }

  function addAllergy(allergyName) {
    const normalizedName = allergyName.trim();

    if (!normalizedName) {
      return false;
    }

    const alreadyExists = medicalProfile.allergies.some(
      (item) => item.name.toLowerCase() === normalizedName.toLowerCase(),
    );

    if (alreadyExists) {
      return false;
    }

    setMedicalProfile((currentProfile) => ({
      ...currentProfile,
      allergies: [
        {
          id: `allergy-${Date.now()}`,
          name: normalizedName,
          createdAt: new Date().toISOString(),
        },
        ...currentProfile.allergies,
      ],
      allergyTimelineEvents: [
        createAllergyTimelineEvent("added", normalizedName),
        ...currentProfile.allergyTimelineEvents,
      ],
    }));

    return true;
  }

  function removeAllergy(allergyId) {
    setMedicalProfile((currentProfile) => {
      const allergyToRemove = currentProfile.allergies.find((item) => item.id === allergyId);

      if (!allergyToRemove) {
        return currentProfile;
      }

      return {
        ...currentProfile,
        allergies: currentProfile.allergies.filter((item) => item.id !== allergyId),
        allergyTimelineEvents: [
          createAllergyTimelineEvent("removed", allergyToRemove.name),
          ...currentProfile.allergyTimelineEvents,
        ],
      };
    });
  }

  function addChronicDisease(diseaseName) {
    const normalizedName = diseaseName.trim();

    if (!normalizedName) {
      return false;
    }

    const alreadyExists = medicalProfile.chronicDiseases.some(
      (item) => item.name.toLowerCase() === normalizedName.toLowerCase(),
    );

    if (alreadyExists) {
      return false;
    }

    setMedicalProfile((currentProfile) => ({
      ...currentProfile,
      chronicDiseases: [
        {
          id: `disease-${Date.now()}`,
          name: normalizedName,
          createdAt: new Date().toISOString(),
        },
        ...currentProfile.chronicDiseases,
      ],
      chronicDiseaseTimelineEvents: [
        createChronicDiseaseTimelineEvent("added", normalizedName),
        ...currentProfile.chronicDiseaseTimelineEvents,
      ],
    }));

    return true;
  }

  function removeChronicDisease(diseaseId) {
    setMedicalProfile((currentProfile) => {
      const diseaseToRemove = currentProfile.chronicDiseases.find(
        (item) => item.id === diseaseId,
      );

      if (!diseaseToRemove) {
        return currentProfile;
      }

      return {
        ...currentProfile,
        chronicDiseases: currentProfile.chronicDiseases.filter(
          (item) => item.id !== diseaseId,
        ),
        chronicDiseaseTimelineEvents: [
          createChronicDiseaseTimelineEvent("removed", diseaseToRemove.name),
          ...currentProfile.chronicDiseaseTimelineEvents,
        ],
      };
    });
  }

  return (
    <MedicalProfileContext.Provider
      value={{
        bloodGroup: medicalProfile.bloodGroup,
        allergies: medicalProfile.allergies,
        chronicDiseases: medicalProfile.chronicDiseases,
        allergyTimelineEvents: medicalProfile.allergyTimelineEvents,
        chronicDiseaseTimelineEvents: medicalProfile.chronicDiseaseTimelineEvents,
        setBloodGroup,
        addAllergy,
        removeAllergy,
        addChronicDisease,
        removeChronicDisease,
      }}
    >
      {children}
    </MedicalProfileContext.Provider>
  );
}

export function useMedicalProfile() {
  const context = useContext(MedicalProfileContext);

  if (!context) {
    throw new Error("useMedicalProfile must be used within a MedicalProfileProvider.");
  }

  return context;
}
