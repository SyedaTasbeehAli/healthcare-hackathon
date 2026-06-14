import { useState } from "react";
import DocumentCard from "../components/DocumentCard.jsx";
import UploadBox from "../components/UploadBox.jsx";
import { loadInitialData, saveMedicalReports } from "../utils/storage.js";

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

export default function UploadDocuments() {
  const [uploadedDocuments, setUploadedDocuments] = useState(
    () => loadInitialData().medicalReports,
  );

  function handleUpload(files, { category, notes }) {
    const uploadedAt = new Date();
    const newDocuments = files.map((file, index) => {
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
        aiSummary: "Uploaded for AI-assisted review. Not a medical diagnosis.",
      };
    });

    const updatedDocuments = [...newDocuments, ...uploadedDocuments];
    setUploadedDocuments(updatedDocuments);
    saveMedicalReports(updatedDocuments);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">Document upload</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Upload medical documents</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          This page is ready for a backend later. For now, it shows dummy uploaded records.
        </p>
      </div>

      <UploadBox onUpload={handleUpload} />

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-950">Uploaded files</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {uploadedDocuments.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      </section>
    </div>
  );
}
