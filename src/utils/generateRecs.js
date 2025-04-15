import { supabase } from "../lib/supabase.js";

// Accept both the derived vibe and original user input
export async function generateRecommendations(vibe, originalUserInput) {
  
  // Step 1: Try to fetch from Supabase, checking if regenerate has been selected or not

  if (!regenerate) {
      const { data: recs, error: fetchError } = await supabase
      .from("vibe_recs")
      .select("raw_output")
      .eq("derived_vibe", vibe)
      .order('random()', { ascending: true })
      .limit(1);
    
    if (fetchError) {
      console.error("Supabase fetch error:", fetchError.message);
    }
    
    if (recs && recs.length > 0) {
      return { raw: recs[0].raw_output };
    }
  }

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
Activity:  
Board Game:  

The vibe is: ${vibe}
`;

  try {
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

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || "";

    // Log to Supabase
    await supabase.from("vibe_recs").insert([
      {
        mood_text: originalUserInput,
        derived_vibe: vibe,
        raw_output: output.trim(),
      },
    ]);

    // Return full raw output (for display/email)
    return { raw: output.trim() };

  } catch (err) {
    console.error("Error generating vibe recs:", err);
    return { raw: "(something went wrong — no vibe recs available)" };
  }
}
