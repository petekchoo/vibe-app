import { supabase } from "../lib/supabase.js";
import { callOpenAI } from "./callOpenAI"; // your GPT call helper
import { buildPrompt } from "./buildPrompt"; // your prompt generator

export async function getRecsForTypes(vibe, selectedTypes, userInput, regenerate = false) {
  const results = {};
  const normalizedVibe = vibe.toLowerCase().trim();

  for (const category of selectedTypes) {
    // Step 1: Try to fetch a pregenerated rec from Supabase via RPC
    
    // console.log('Checking vibe library for:', normalizedVibe)
    if (!regenerate) {
    
      const { data, error: fetchError } = await supabase.rpc("get_random_vibe", {
        vibe_input: normalizedVibe,
        category_input: category,
      });

      if (fetchError) {
        console.error(`❌ Supabase RPC error for ${category}:`, fetchError.message);
      }
      
      // console.log('Returning value from Library:', data)
      if (data && data.length > 0) {
        results[category] = {
          recommendation: data[0].recommendation,
          rationale: data[0].rationale,
          source: "library",
          id: data[0].id,
          likes: data[0].likes,
          dislikes: data[0].dislikes,
          created_at: data[0].created_at,
        };
        continue; // Skip to next category
      }
    }
    
    // Step 2: No match found — call GPT to generate a new rec
    const prompt = buildPrompt(normalizedVibe, category);
    const gptResponse = await callOpenAI(prompt);

    // Step 3: Parse GPT response into recommendation + rationale
    const [recLine, rationaleLine] = gptResponse.split("\n").map((line) => line.trim());
    const recommendation = recLine?.replace(/^1\.?\s*Recommendation:\s*/i, "").trim();
    const rationale = rationaleLine?.replace(/^2\.?\s*Rationale:\s*/i, "").trim();

    // Step 4: Save the new recommendation to Supabase
    const { data, error: insertError } = await supabase
      .from("vibe_recs")
      .insert([
        {
          vibe: normalizedVibe,
          category,
          recommendation,
          rationale,
          user_input: userInput,
          likes: 0,
          dislikes: 0,
          source: "gpt",
        },
      ])
      .select("id");

    const insertedId = data?.[0]?.id || null;
    const insertedLikes = data?.[0]?.likes || null;
    const insertedDislikes = data?.[0]?.dislikes || null;

    if (insertError) {
      console.error(`❌ Supabase insert error for ${category}:`, insertError.message);
    }

    // Step 5: Add result to the results object
    results[category] = {
      id: insertedId,
      recommendation,
      rationale,
      likes: insertedLikes,
      dislikes: insertedDislikes,
      source: "gpt",
    };
  }

  return results;
}