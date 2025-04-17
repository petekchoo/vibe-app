export async function callOpenAI(prompt) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OpenAI API key is missing from environment variables");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // or "gpt-4o" if enabled
        messages: [
          { role: "system", content: "You are a creative, chaotic good cultural concierge." },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
        max_tokens: 250,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      throw new Error(data.error?.message || "OpenAI request failed");
    }

    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error("❌ GPT call failed:", err.message);
    return "1. Recommendation: (no recommendation 🤷‍♀️)\n2. Rationale: (something went wrong)";
  }
}