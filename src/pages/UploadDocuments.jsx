import DocumentCard from "../components/DocumentCard.jsx";
import UploadBox from "../components/UploadBox.jsx";
import { documents } from "../data/mockData.js";

export default function UploadDocuments() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-teal">Document upload</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Upload medical documents</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          This page is ready for a backend later. For now, it shows dummy uploaded records.
        </p>
      </div>

      <UploadBox />

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-950">Uploaded files</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      </section>
    </div>
  );
}
