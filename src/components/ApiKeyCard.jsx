import { KeyRound, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAiConfig } from "../context/AiConfigContext.jsx";

export default function ApiKeyCard() {
  const { apiKeySource, clearApiKey, hasApiKey, saveApiKey } = useAiConfig();
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  function handleSaveApiKey(event) {
    event.preventDefault();
    const trimmedApiKey = apiKeyInput.trim();

    if (!trimmedApiKey) {
      setStatusMessage("Paste an OpenRouter API key first.");
      return;
    }

    saveApiKey(trimmedApiKey);
    setApiKeyInput("");
    setStatusMessage("API key saved in this browser.");
  }

  function handleClearApiKey() {
    clearApiKey();
    setStatusMessage("Browser API key removed.");
  }

  return (
    <section className="content-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-teal">
            <KeyRound size={17} />
            AI access
          </div>
          <h2 className="mt-2 text-xl font-bold text-slate-950">
            {hasApiKey ? "AI features are ready" : "Add API key for this browser"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Reviewers can paste an OpenRouter key here to use OCR summaries, AI search, doctor
            routing, and downloadable summaries. The key is stored only in this browser and is not
            committed to the public repo.
          </p>
        </div>

        <form onSubmit={handleSaveApiKey} className="w-full max-w-xl">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">OpenRouter API key</span>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(event) => setApiKeyInput(event.target.value)}
                placeholder={hasApiKey ? "Key already configured" : "Paste key for local demo"}
                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <KeyRound size={17} />
                Save key
              </button>
            </div>
          </label>
        </form>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Status:{" "}
          <span className="font-semibold text-slate-700">
            {apiKeySource === "environment"
              ? "Configured by deployment environment"
              : apiKeySource === "browser"
                ? "Saved in this browser"
                : "No API key saved"}
          </span>
        </p>
        {apiKeySource === "browser" && (
          <button
            type="button"
            onClick={handleClearApiKey}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Trash2 size={17} />
            Remove browser key
          </button>
        )}
      </div>

      {statusMessage && (
        <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          {statusMessage}
        </p>
      )}
    </section>
  );
}
