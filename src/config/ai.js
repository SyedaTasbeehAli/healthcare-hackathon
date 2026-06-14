export const OPENROUTER_MODEL = "openai/gpt-oss-120b:free";
export const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
export const OPENROUTER_APP_TITLE = "MediVault AI";

export function getConfiguredOpenRouterApiKey() {
  return import.meta.env.VITE_OPENROUTER_API_KEY?.trim() || "";
}
