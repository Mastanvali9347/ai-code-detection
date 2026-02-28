// src/utils/promptBuilder.js
import { RESPONSE_SCHEMA, AI_RULES, SUPPORTED_LANGUAGES } from "./constants";

export function buildDebugPrompt({ language, code }) {
  const lang = SUPPORTED_LANGUAGES.includes(language)
    ? language
    : "javascript";

  return `
You are an expert senior software engineer and debugger.

Analyze the following ${lang} code.

${AI_RULES}

${RESPONSE_SCHEMA}

Code:
\`\`\`${lang}
${code}
\`\`\`
`.trim();
}