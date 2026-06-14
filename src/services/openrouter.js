import {
  OPENROUTER_APP_TITLE,
  OPENROUTER_ENDPOINT,
  OPENROUTER_MODEL,
} from "../config/ai.js";

function getMessageTextContent(content) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (typeof item?.text === "string") {
          return item.text || "";
        }

        return "";
      })
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

function extractApiErrorMessage(errorPayload) {
  if (typeof errorPayload === "string") {
    return errorPayload;
  }

  if (errorPayload?.error?.message) {
    return errorPayload.error.message;
  }

  if (errorPayload?.message) {
    return errorPayload.message;
  }

  return "OpenRouter request failed.";
}

export function extractCompletionText(payload) {
  const choice = payload?.choices?.[0];
  const content = getMessageTextContent(choice?.message?.content);

  if (content) {
    return content;
  }

  if (choice?.message?.refusal) {
    throw new Error(`The AI request was refused: ${choice.message.refusal}`);
  }

  throw new Error(
    `The AI response did not include any text content. Finish reason: ${choice?.finish_reason || "unknown"}.`,
  );
}

export async function createOpenRouterCompletion({
  apiKey,
  maxTokens = 1400,
  messages,
  plugins,
  temperature = 0.1,
}) {
  if (!apiKey) {
    throw new Error("OpenRouter API key is missing.");
  }

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        typeof window !== "undefined" ? window.location.origin : "http://localhost:5173",
      "X-OpenRouter-Title": OPENROUTER_APP_TITLE,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      plugins,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(extractApiErrorMessage(payload));
  }

  return {
    content: extractCompletionText(payload),
    raw: payload,
  };
}
