export async function deriveVibe(userInput) {
  const prompt = `
You are a mood-to-vibe translator.

Given a user's emotional or situational input, respond with ONE strong, expressive word that best captures the underlying emotional vibe.

Examples:
"My dog died today" → heartbroken
"I just quit my job and booked a one-way flight to Tokyo" → untethered

Input: "${userInput}"
Output:
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
      temperature: 0.9,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim().toLowerCase();
}