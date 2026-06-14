import { createContext, useContext, useEffect, useState } from "react";
import { useAiConfig } from "./AiConfigContext.jsx";
import { analyzeMedicalDocument } from "../services/medicalAi.js";
import { loadInitialData, saveMedicalReports } from "../utils/storage.js";

const MedicalReportsContext = createContext(null);

const INTERRUPTED_PROCESSING_MESSAGE =
  "Processing was interrupted before the report finished. Upload the file again to resume OCR and AI review.";

function formatFileSize(sizeInBytes) {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDisplayDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getTitleFromFileName(fileName) {
  return fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
}

function normalizeStringArray(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim())
    : [];
}

function normalizeReport(document) {
  const normalizedReport = {
    ...document,
    id: String(document.id),
    aiSummary: typeof document.aiSummary === "string" ? document.aiSummary : "",
    bulletSummary: normalizeStringArray(document.bulletSummary),
    extractedText: typeof document.extractedText === "string" ? document.extractedText : "",
    importantDates: normalizeStringArray(document.importantDates),
    keywords: normalizeStringArray(document.keywords),
    mentionedMedicines: normalizeStringArray(document.mentionedMedicines),
    possibleSpecialties: normalizeStringArray(document.possibleSpecialties),
    processingNotes: normalizeStringArray(document.processingNotes),
    processingWarning:
      typeof document.processingWarning === "string" ? document.processingWarning : "",
    processingMessage:
      typeof document.processingMessage === "string"
        ? document.processingMessage
        : document.processingState === "processing"
          ? "AI review in progress"
          : "",
    processingDetail:
      typeof document.processingDetail === "string" ? document.processingDetail : "",
    safetyNote:
      typeof document.safetyNote === "string"
        ? document.safetyNote
        : "This summary is for organization only and is not medical advice.",
    searchableText:
      typeof document.searchableText === "string"
        ? document.searchableText
        : typeof document.extractedText === "string"
          ? document.extractedText
          : "",
  };

  if (normalizedReport.processingState === "processing") {
    return {
      ...normalizedReport,
      processingState: "failed",
      status: "Processing interrupted",
      processingMessage: "Processing interrupted",
      processingDetail: INTERRUPTED_PROCESSING_MESSAGE,
      processingError: INTERRUPTED_PROCESSING_MESSAGE,
    };
  }

  if (
    normalizedReport.processingState === "complete" ||
    normalizedReport.status === "Processed"
  ) {
    return {
      ...normalizedReport,
      processingState: "complete",
      status: "Processed",
    };
  }

  if (normalizedReport.processingState === "failed") {
    return {
      ...normalizedReport,
      status:
        typeof normalizedReport.status === "string" && normalizedReport.status
          ? normalizedReport.status
          : "Processing failed",
    };
  }

  return {
    ...normalizedReport,
    processingState: normalizedReport.aiSummary ? "complete" : "failed",
    status: normalizedReport.aiSummary ? "Processed" : "Processing failed",
  };
}

function hydrateMedicalReports(reports) {
  return reports.map(normalizeReport);
}

function sortReportsByNewest(firstReport, secondReport) {
  return new Date(secondReport.uploadedAt).getTime() - new Date(firstReport.uploadedAt).getTime();
}

function createUploadedDocuments(files, { category, notes }) {
  const uploadedAt = new Date();

  return files.map((file, index) => {
    const title = getTitleFromFileName(file.name);

    return {
      id: `${uploadedAt.getTime()}-${index}`,
      fileName: file.name,
      title,
      name: title,
      type: category,
      category,
      fileType: file.type || file.name.split(".").pop()?.toUpperCase() || "Unknown",
      fileSize: formatFileSize(file.size),
      uploadedAt: uploadedAt.toISOString(),
      date: formatDisplayDate(uploadedAt),
      notes,
      status: "Pending review",
      processingState: "processing",
      processingStartedAt: new Date(uploadedAt.getTime() + index * 250).toISOString(),
      processingMessage: "Queued for review",
      processingDetail: "Preparing OCR and AI report analysis.",
      aiSummary: "",
      bulletSummary: [],
      extractedText: "",
      searchableText: "",
      keywords: [],
      importantDates: [],
      mentionedMedicines: [],
      possibleSpecialties: [],
      processingNotes: [],
      processingWarning: "",
      safetyNote: "This summary is for organization only and is not medical advice.",
    };
  });
}

function toSummaryItem(report) {
  return {
    id: report.id,
    document: report.name || report.title,
    category: report.category,
    summary: report.aiSummary,
  };
}

export function MedicalReportsProvider({ children }) {
  const { openRouterApiKey } = useAiConfig();
  const [reports, setReports] = useState(() =>
    hydrateMedicalReports(loadInitialData().medicalReports).sort(sortReportsByNewest),
  );
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    saveMedicalReports(reports);
  }, [reports]);

  function updateReport(reportId, updater) {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId ? { ...report, ...updater(report) } : report,
      ),
    );
  }

  async function processUploadedReport(report, file, metadata) {
    try {
      const analysis = await analyzeMedicalDocument({
        apiKey: openRouterApiKey,
        category: metadata.category,
        file,
        notes: metadata.notes,
        onStageChange: (processingMessage, processingDetail) => {
          updateReport(report.id, () => ({
            status: "Pending review",
            processingState: "processing",
            processingMessage,
            processingDetail,
          }));
        },
      });

      updateReport(report.id, () => ({
        status: "Processed",
        processingState: "complete",
        completedAt: new Date().toISOString(),
        processingMessage: "",
        processingDetail: "",
        aiSummary: analysis.aiSummary,
        bulletSummary: analysis.bulletSummary,
        extractedText: analysis.extractedText,
        searchableText: analysis.searchableText || analysis.extractedText,
        importantDates: analysis.importantDates,
        keywords: analysis.keywords,
        mentionedMedicines: analysis.mentionedMedicines,
        possibleSpecialties: analysis.possibleSpecialties,
        processingNotes: analysis.processingNotes,
        processingWarning: analysis.processingWarning,
        safetyNote: analysis.safetyNote,
        aiSource: analysis.source,
      }));
    } catch (error) {
      updateReport(report.id, () => ({
        status: "Processing failed",
        processingState: "failed",
        processingMessage: "Processing failed",
        processingDetail:
          error instanceof Error
            ? error.message
            : "The report could not be processed. Please try again.",
        processingError:
          error instanceof Error
            ? error.message
            : "The report could not be processed. Please try again.",
      }));
    }
  }

  function addUploadedDocuments(files, metadata) {
    if (!openRouterApiKey) {
      return false;
    }

    const newReports = createUploadedDocuments(files, metadata);
    setReports((currentReports) => [...newReports, ...currentReports]);

    newReports.forEach((report, index) => {
      void processUploadedReport(report, files[index], metadata);
    });

    return true;
  }

  function removeReport(reportId) {
    setReports((currentReports) =>
      currentReports.filter((report) => report.id !== reportId),
    );
  }

  const processingReports = reports.filter((report) => report.processingState === "processing");
  const completedReports = reports.filter((report) => report.processingState === "complete");
  const distinctCategories = new Set(reports.map((report) => report.category));

  return (
    <MedicalReportsContext.Provider
      value={{
        reports,
        currentTime,
        addUploadedDocuments,
        removeReport,
        processingReports,
        completedReports,
        failedReports: reports.filter((report) => report.processingState === "failed"),
        summaryItems: completedReports.map(toSummaryItem),
        totalReportCount: reports.length,
        processedReportCount: completedReports.length,
        pendingReportCount: processingReports.length,
        categoryCount: distinctCategories.size,
        latestReport: reports[0] || null,
      }}
    >
      {children}
    </MedicalReportsContext.Provider>
  );
}

export function useMedicalReports() {
  const context = useContext(MedicalReportsContext);

  if (!context) {
    throw new Error("useMedicalReports must be used within a MedicalReportsProvider.");
  }

  return context;
}
