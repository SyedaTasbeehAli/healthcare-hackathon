import { createWorker } from "tesseract.js";
import { createOpenRouterCompletion } from "./openrouter.js";

let ocrWorkerPromise = null;

const MEDICAL_AI_SYSTEM_PROMPT =
  "You organize patient medical records for a demo healthcare app. You do not diagnose, prescribe, or claim certainty. Extract only document facts, summarize clearly, and return strict JSON with double-quoted keys.";

function normalizeStringArray(value, limit = 8) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, limit);
}

function normalizeText(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function stripCodeFence(text) {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

function extractJsonObject(text) {
  const normalizedText = stripCodeFence(text);

  try {
    return JSON.parse(normalizedText);
  } catch {
    const firstBraceIndex = normalizedText.indexOf("{");
    const lastBraceIndex = normalizedText.lastIndexOf("}");

    if (firstBraceIndex === -1 || lastBraceIndex === -1) {
      throw new Error("The AI response did not include a valid JSON object.");
    }

    return JSON.parse(normalizedText.slice(firstBraceIndex, lastBraceIndex + 1));
  }
}

function isPdfFile(file) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function isImageFile(file) {
  return (
    file.type.startsWith("image/") ||
    [".jpg", ".jpeg", ".png"].some((extension) =>
      file.name.toLowerCase().endsWith(extension),
    )
  );
}

function buildStructuredAnalysis(rawAnalysis) {
  const summaryParagraphs = normalizeStringArray(rawAnalysis.summaryParagraphs, 4);
  const keyFindings = normalizeStringArray(rawAnalysis.keyFindings, 6);
  const processingNotes = normalizeStringArray(rawAnalysis.processingNotes, 6);
  const aiSummary = summaryParagraphs.join("\n\n");

  return {
    aiSummary,
    bulletSummary: keyFindings,
    importantDates: normalizeStringArray(rawAnalysis.importantDates, 6),
    keywords: normalizeStringArray(rawAnalysis.keywords, 12),
    mentionedMedicines: normalizeStringArray(rawAnalysis.mentionedMedicines, 8),
    possibleSpecialties: normalizeStringArray(rawAnalysis.possibleSpecialties, 4),
    processingNotes,
    processingWarning: normalizeText(rawAnalysis.processingWarning),
    safetyNote:
      normalizeText(rawAnalysis.safetyNote) ||
      "This summary is for organization only and is not medical advice.",
    searchableText: normalizeText(rawAnalysis.searchableText).slice(0, 5000),
  };
}

async function getOcrWorker() {
  if (!ocrWorkerPromise) {
    ocrWorkerPromise = createWorker("eng");
  }

  return ocrWorkerPromise;
}

async function extractTextFromImage(file) {
  const worker = await getOcrWorker();
  const result = await worker.recognize(file);
  return result?.data?.text?.trim() || "";
}

function normalizeExtractedPdfText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function buildAiReadyMedicalText(documentText, maxChars = 12000, maxSectionChars = 750) {
  const pageSections = documentText
    .split(/\n\s*\n+/)
    .map((section) => section.trim())
    .filter(Boolean);
  const selectedSections = [];
  let totalChars = 0;

  for (const section of pageSections) {
    const trimmedSection =
      section.length > maxSectionChars ? `${section.slice(0, maxSectionChars)}...` : section;

    if (!trimmedSection) {
      continue;
    }

    if (totalChars + trimmedSection.length > maxChars) {
      break;
    }

    selectedSections.push(trimmedSection);
    totalChars += trimmedSection.length + 2;
  }

  if (selectedSections.length === 0) {
    return documentText.slice(0, maxChars);
  }

  return selectedSections.join("\n\n");
}

async function extractTextFromPdf(file) {
  const { getDocument } = await import("pdfjs-dist/webpack.mjs");
  const fileBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({
    data: fileBuffer,
    useWorkerFetch: false,
    isEvalSupported: false,
  });

  try {
    const pdfDocument = await loadingTask.promise;
    const pagesText = [];

    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      const page = await pdfDocument.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .filter(Boolean)
        .join(" ");

      if (pageText.trim()) {
        pagesText.push(`Page ${pageNumber}: ${normalizeExtractedPdfText(pageText)}`);
      }
    }

    await pdfDocument.cleanup();
    return pagesText.join("\n\n").trim();
  } finally {
    await loadingTask.destroy();
  }
}

async function requestStructuredMedicalJson({
  apiKey,
  maxTokens,
  messages,
  onStageChange,
  plugins,
}) {
  onStageChange?.(
    "Contacting AI",
    "Sending extracted medical text to OpenRouter for report understanding.",
  );
  const response = await createOpenRouterCompletion({
    apiKey,
    maxTokens,
    messages,
    plugins,
    temperature: 0.1,
  });

  onStageChange?.(
    "Reading AI response",
    "Parsing the structured summary returned by the AI model.",
  );
  return extractJsonObject(response.content);
}

async function analyzeTextMedicalDocument({
  apiKey,
  category,
  documentText,
  fileName,
  notes,
  onStageChange,
}) {
  const aiReadyText = buildAiReadyMedicalText(documentText);

  onStageChange?.(
    "Preparing summary request",
    "Compressing extracted report text before sending it to the AI model.",
  );

  return requestStructuredMedicalJson({
    apiKey,
    maxTokens: 1600,
    onStageChange,
    messages: [
      {
        role: "system",
        content: MEDICAL_AI_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content:
          `Analyze this OCR-extracted medical text for patient record organization.\n` +
          `File name: ${fileName}\n` +
          `Category: ${category}\n` +
          `User note: ${notes || "None"}\n\n` +
          `OCR text:\n${aiReadyText}\n\n` +
          `Return JSON with exactly these keys:\n` +
          `summaryParagraphs: string[]\n` +
          `keyFindings: string[]\n` +
          `keywords: string[]\n` +
          `possibleSpecialties: string[]\n` +
          `mentionedMedicines: string[]\n` +
          `importantDates: string[]\n` +
          `searchableText: string\n` +
          `safetyNote: string\n` +
          `processingNotes: string[]\n` +
          `processingWarning: string\n\n` +
          `Rules:\n` +
          `- Do not diagnose.\n` +
          `- Mention when OCR text appears incomplete.\n` +
          `- searchableText must stay plain text and useful for later search.\n` +
          `- The OCR text may be truncated from a larger document, so summarize only what is clearly present.\n` +
          `- Use empty arrays when data is missing.`,
      },
    ],
  });
}

function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

function buildReportSearchBody(report) {
  const sections = [
    report.name || report.title,
    report.category,
    report.aiSummary,
    report.searchableText,
    (report.keywords || []).join(" "),
    (report.mentionedMedicines || []).join(" "),
  ];

  return sections.filter(Boolean).join(" ").toLowerCase();
}

function scoreReportAgainstQuery(report, queryTokens) {
  const body = buildReportSearchBody(report);

  return queryTokens.reduce((score, token) => {
    if (!body.includes(token)) {
      return score;
    }

    return score + Math.min(3, body.split(token).length - 1);
  }, 0);
}

function getCandidateReports(reports, query, limit = 6) {
  const queryTokens = tokenize(query);

  return [...reports]
    .map((report) => ({
      report,
      score: scoreReportAgainstQuery(report, queryTokens),
    }))
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      return new Date(second.report.uploadedAt).getTime() - new Date(first.report.uploadedAt).getTime();
    })
    .slice(0, limit)
    .map(({ report }) => report);
}

function createLocalSearchFallback(query, reports) {
  const matches = getCandidateReports(reports, query)
    .filter((report) => scoreReportAgainstQuery(report, tokenize(query)) > 0)
    .map((report) => ({
      reportId: report.id,
      reason: `Matched against the report title, summary, or extracted report text for "${query}".`,
      excerpt: (report.searchableText || report.aiSummary || "").slice(0, 220),
      relevance: "medium",
    }));

  return {
    answer: matches.length
      ? `Found ${matches.length} report${matches.length > 1 ? "s" : ""} that may relate to "${query}".`
      : `No strong local match was found for "${query}".`,
    matches,
    followUp: matches.length
      ? "Review the matched reports below or try a more specific search phrase."
      : "Try adding a report with OCR-ready text or rephrase the search using a test name, medicine, or symptom.",
    mode: "fallback",
  };
}

export async function analyzeMedicalDocument({
  apiKey,
  category,
  file,
  notes,
  onStageChange,
}) {
  if (!apiKey) {
    throw new Error("Add an OpenRouter API key before uploading reports.");
  }

  if (isPdfFile(file)) {
    onStageChange?.(
      "Parsing PDF",
      "Extracting text locally from the uploaded PDF before summarization.",
    );
    const extractedText = await extractTextFromPdf(file);

    if (!extractedText) {
      throw new Error(
        "No readable text was found in this PDF. It may be a scanned document image and would need page OCR support.",
      );
    }

    onStageChange?.(
      "Generating summary",
      "Structuring extracted PDF text into a searchable report summary.",
    );
    const pdfAnalysis = await analyzeTextMedicalDocument({
      apiKey,
      category,
      documentText: extractedText,
      fileName: file.name,
      notes,
      onStageChange,
    });

    return {
      extractedText,
      source: "pdf-text",
      ...buildStructuredAnalysis(pdfAnalysis),
    };
  }

  if (isImageFile(file)) {
    onStageChange?.("Running OCR", "Reading text from the uploaded image report.");
    const extractedText = await extractTextFromImage(file);

    if (!extractedText) {
      throw new Error("No readable text was detected in the uploaded image.");
    }

    onStageChange?.(
      "Generating summary",
      "Structuring OCR text into a searchable report summary.",
    );
    const textAnalysis = await analyzeTextMedicalDocument({
      apiKey,
      category,
      documentText: extractedText,
      fileName: file.name,
      notes,
      onStageChange,
    });

    return {
      extractedText,
      source: "ocr",
      ...buildStructuredAnalysis(textAnalysis),
    };
  }

  throw new Error("This file type is not supported yet. Please upload PDF, JPG, or PNG reports.");
}

export async function searchMedicalReports({ apiKey, query, reports }) {
  const completedReports = reports.filter(
    (report) =>
      report.processingState === "complete" &&
      (report.searchableText || report.aiSummary),
  );

  if (completedReports.length === 0) {
    return {
      answer: "No processed reports are ready for search yet.",
      matches: [],
      followUp: "Upload a report and wait for AI processing to finish first.",
      mode: "empty",
    };
  }

  const candidateReports = getCandidateReports(completedReports, query);

  if (!apiKey) {
    return createLocalSearchFallback(query, candidateReports);
  }

  try {
    const aiResult = await requestStructuredMedicalJson({
      apiKey,
      maxTokens: 1400,
      messages: [
        {
          role: "system",
          content:
            "You answer questions over processed medical records. Use only the supplied report data, cite matching reports by reportId, and do not invent facts. Return strict JSON only.",
        },
        {
          role: "user",
          content: JSON.stringify(
            {
              query,
              reports: candidateReports.map((report) => ({
                reportId: report.id,
                title: report.name || report.title,
                category: report.category,
                uploadedAt: report.uploadedAt,
                summary: report.aiSummary,
                searchableText: (report.searchableText || report.extractedText || "").slice(
                  0,
                  2400,
                ),
                keywords: report.keywords || [],
              })),
              returnShape: {
                answer: "string",
                matches: [
                  {
                    reportId: "string",
                    reason: "string",
                    excerpt: "string",
                    relevance: "high | medium | low",
                  },
                ],
                followUp: "string",
              },
            },
            null,
            2,
          ),
        },
      ],
    });

    return {
      answer: normalizeText(aiResult.answer),
      matches: Array.isArray(aiResult.matches)
        ? aiResult.matches
            .map((match) => ({
              reportId: String(match.reportId || ""),
              reason: normalizeText(match.reason),
              excerpt: normalizeText(match.excerpt),
              relevance: ["high", "medium", "low"].includes(match.relevance)
                ? match.relevance
                : "medium",
            }))
            .filter((match) => match.reportId)
        : [],
      followUp: normalizeText(aiResult.followUp),
      mode: "ai",
    };
  } catch {
    return createLocalSearchFallback(query, candidateReports);
  }
}

export async function recommendDoctorWithAi({
  apiKey,
  availableSlots,
  chronicDiseases,
  doctors,
  issue,
  allergies,
  bloodGroup,
  medicines,
  reports,
}) {
  const completedReports = reports
    .filter((report) => report.processingState === "complete")
    .slice(0, 6);

  const aiResult = await requestStructuredMedicalJson({
    apiKey,
    maxTokens: 1600,
    messages: [
      {
        role: "system",
        content:
          "You route a patient to the best doctor from a fixed provided list. Use only the provided data. You are not diagnosing. Return strict JSON only.",
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            patientIssue: issue,
            reports: completedReports.map((report) => ({
              reportId: report.id,
              title: report.name || report.title,
              category: report.category,
              summary: report.aiSummary,
              keywords: report.keywords || [],
              possibleSpecialties: report.possibleSpecialties || [],
              mentionedMedicines: report.mentionedMedicines || [],
            })),
            medicines: medicines.map((medicine) => ({
              name: medicine.name,
              dosage: medicine.dosage,
              frequency: medicine.frequency,
              mg: medicine.mg,
            })),
            medicalProfile: {
              allergies: allergies.map((item) => item.name),
              chronicDiseases: chronicDiseases.map((item) => item.name),
              bloodGroup,
            },
            doctors: doctors.map((doctor) => ({
              id: doctor.id,
              name: doctor.name,
              specialty: doctor.specialty,
              clinic: doctor.clinic,
              location: doctor.location,
              focusAreas: doctor.focusAreas || [],
            })),
            availableSlots: availableSlots.map((slot) => ({
              id: slot.id,
              doctorId: slot.doctorId,
              date: slot.date,
              time: slot.time,
              type: slot.type,
            })),
            returnShape: {
              doctorId: "number",
              reasoning: ["string"],
              summary: "string",
              reviewedContext: ["string"],
              priority: "routine | soon | urgent-review",
              reportIds: ["string"],
              slotIds: ["number"],
            },
          },
          null,
          2,
        ),
      },
    ],
  });

  return {
    doctorId: Number(aiResult.doctorId),
    priority: normalizeText(aiResult.priority, "routine"),
    reasoning: normalizeStringArray(aiResult.reasoning, 4),
    reportIds: normalizeStringArray(aiResult.reportIds, 4),
    reviewedContext: normalizeStringArray(aiResult.reviewedContext, 6),
    slotIds: Array.isArray(aiResult.slotIds)
      ? aiResult.slotIds
          .map((slotId) => Number(slotId))
          .filter((slotId) => Number.isFinite(slotId))
          .slice(0, 2)
      : [],
    summary: normalizeText(aiResult.summary),
  };
}

export async function generateDoctorShareSummary({
  apiKey,
  allergies,
  bloodGroup,
  chronicDiseases,
  medicines,
  reports,
}) {
  const completedReports = reports
    .filter((report) => report.processingState === "complete")
    .slice(0, 8);
  const otherReports = reports
    .filter((report) => report.processingState !== "complete")
    .slice(0, 6);

  const aiResult = await requestStructuredMedicalJson({
    apiKey,
    maxTokens: 1800,
    messages: [
      {
        role: "system",
        content:
          "You create concise doctor-share visit summaries from patient-held medical records. You do not diagnose, prescribe, or claim certainty. Use only the supplied app data and return strict JSON only.",
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            medicalProfile: {
              bloodGroup,
              allergies: allergies.map((item) => item.name),
              chronicConditions: chronicDiseases.map((item) => item.name),
            },
            medicines: medicines.map((medicine) => ({
              name: medicine.name,
              dosage: medicine.dosage,
              frequency: medicine.frequency,
              mg: medicine.mg,
            })),
            processedReports: completedReports.map((report) => ({
              title: report.name || report.title,
              category: report.category,
              uploadedAt: report.uploadedAt,
              summary: report.aiSummary,
              keyFindings: report.bulletSummary || [],
              keywords: report.keywords || [],
              mentionedMedicines: report.mentionedMedicines || [],
              possibleSpecialties: report.possibleSpecialties || [],
              safetyNote: report.safetyNote,
            })),
            pendingOrFailedReports: otherReports.map((report) => ({
              title: report.name || report.title,
              category: report.category,
              uploadedAt: report.uploadedAt,
              status: report.status,
              notes: report.notes,
            })),
            returnShape: {
              overview: "string",
              reportsReviewed: ["string"],
              currentMedicines: ["string"],
              allergiesAndConditions: ["string"],
              possibleConcerns: ["string"],
              suggestedDoctorDiscussionPoints: ["string"],
              safetyNote: "string",
            },
            rules: [
              "Do not diagnose.",
              "Use phrases like possible concerns, AI-assisted summary, and not a medical diagnosis.",
              "Mention missing or pending data when relevant.",
              "Keep it concise enough to share before a doctor visit.",
            ],
          },
          null,
          2,
        ),
      },
    ],
  });

  return {
    overview: normalizeText(aiResult.overview),
    reportsReviewed: normalizeStringArray(aiResult.reportsReviewed, 10),
    currentMedicines: normalizeStringArray(aiResult.currentMedicines, 10),
    allergiesAndConditions: normalizeStringArray(aiResult.allergiesAndConditions, 10),
    possibleConcerns: normalizeStringArray(aiResult.possibleConcerns, 8),
    suggestedDoctorDiscussionPoints: normalizeStringArray(
      aiResult.suggestedDoctorDiscussionPoints,
      8,
    ),
    safetyNote:
      normalizeText(aiResult.safetyNote) ||
      "AI-assisted summary for doctor discussion only. Not a medical diagnosis.",
  };
}
