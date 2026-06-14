import { createContext, useContext } from "react";
import {
  getConfiguredOpenRouterApiKey,
  OPENROUTER_MODEL,
} from "../config/ai.js";

const AiConfigContext = createContext(null);

export function AiConfigProvider({ children }) {
  const openRouterApiKey = getConfiguredOpenRouterApiKey();
  const value = {
    modelName: OPENROUTER_MODEL,
    openRouterApiKey,
    hasApiKey: Boolean(openRouterApiKey),
  };

  return <AiConfigContext.Provider value={value}>{children}</AiConfigContext.Provider>;
}

export function useAiConfig() {
  const context = useContext(AiConfigContext);

  if (!context) {
    throw new Error("useAiConfig must be used within an AiConfigProvider.");
  }

  return context;
}
