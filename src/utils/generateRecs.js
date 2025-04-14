export async function generateRecommendations(vibe) {
  // Check static vibe data first
  const data = await fetch('/vibe_data.json').then(res => res.json());
  if (data[vibe]) return data[vibe];

  // Fallback prompt
  const prompt = `
You are a chaotic good cultural concierge.

Given a single expressive vibe word, suggest exactly four things that match that vibe in a way that feels unexpected, slightly wild, but always joyful and fun for all involved.

Return the following four items — and all four must be included:

1. A wine (include varietal, winery, and year)
2. A music album (artist and album title)
3. A paired or group activity (playful, suggestive, not explicit)
4. A board game (real or made-up — but must sound fun and fit the vibe)

Respond in this exact format:

Wine:  
Album:  
Act:  
Board Game:  

The vibe is: ${vibe}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 1.0,
    }),
  });

  const dataAI = await response.json();
  const output = dataAI.choices?.[0]?.message?.content || "";

  console.log("LLM raw output:", output); // helpful for debugging

  // skip parsing entirely — return the full GPT message
  return { raw: output.trim() };
}