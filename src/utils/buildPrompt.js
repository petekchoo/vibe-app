import { CATEGORY_OPTIONS } from "../constants/categoryOptions";

export function buildPrompt(vibe, categoryKey) {
  const categoryMeta = CATEGORY_OPTIONS.find((c) => c.key === categoryKey);

  if (!categoryMeta) {
    throw new Error(`Unknown category key: ${categoryKey}`);
  }

  return `
Given the vibe ${vibe}, suggest a ${categoryMeta.label} that matches that vibe in a way that feels unexpected, slightly wild, but always joyful and fun for all involved.

${categoryMeta.promptDetails}

Respond in this strict two-part format:

1. Recommendation: [One sentence max — include any required info above.]
2. Rationale: [One sentence explaining *why* this recommendation fits the vibe. Make it poetic, witty, or emotionally intelligent.]

Do not include any additional commentary or explanation.
`.trim();
}