import { supabase } from "../lib/supabase"; // adjust path if needed

export async function updateVoteCount(recId, type, delta) {
    const field = type === "up" ? "likes" : "dislikes";
    
    const { error } = await supabase.rpc("increment_vote_count", {
      rec_id: recId,
      field_name: field,
      delta,
    });
  
    if (error) {
      console.error("Vote update failed:", error.message);
    }
  }  