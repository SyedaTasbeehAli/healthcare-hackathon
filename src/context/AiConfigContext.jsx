import { createContext, useContext, useMemo, useState } from "react";
import {
  getConfiguredOpenRouterApiKey,
  OPENROUTER_MODEL,
} from "../config/ai.js";

const AiConfigContext = createContext(null);
const BROWSER_API_KEY_STORAGE_KEY = "medivault.openRouterApiKey";

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function loadBrowserApiKey() {
  if (!canUseLocalStorage()) {
    return "";
  }

  return window.localStorage.getItem(BROWSER_API_KEY_STORAGE_KEY)?.trim() || "";
}

function saveBrowserApiKey(apiKey) {
  if (!canUseLocalStorage()) {
    return;
  }

  const normalizedApiKey = apiKey.trim();

  if (normalizedApiKey) {
    window.localStorage.setItem(BROWSER_API_KEY_STORAGE_KEY, normalizedApiKey);
  } else {
    window.localStorage.removeItem(BROWSER_API_KEY_STORAGE_KEY);
  }
}

export function AiConfigProvider({ children }) {
  const configuredApiKey = getConfiguredOpenRouterApiKey();
  const [browserApiKey, setBrowserApiKey] = useState(loadBrowserApiKey);
  const openRouterApiKey = configuredApiKey || browserApiKey;
  const value = useMemo(
    () => ({
      modelName: OPENROUTER_MODEL,
      openRouterApiKey,
      hasApiKey: Boolean(openRouterApiKey),
      apiKeySource: configuredApiKey ? "environment" : browserApiKey ? "browser" : "missing",
      saveApiKey(apiKey) {
        saveBrowserApiKey(apiKey);
        setBrowserApiKey(apiKey.trim());
      },
      clearApiKey() {
        saveBrowserApiKey("");
        setBrowserApiKey("");
      },
    }),
    [browserApiKey, configuredApiKey, openRouterApiKey],
  );

  return <AiConfigContext.Provider value={value}>{children}</AiConfigContext.Provider>;
}

export function useAiConfig() {
  const context = useContext(AiConfigContext);

  if (!context) {
    throw new Error("useAiConfig must be used within an AiConfigProvider.");
  }

  return context;
}
