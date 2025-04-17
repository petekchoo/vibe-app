import { useEffect, useState } from "react";
import { getRecsForTypes } from "../utils/generateRecs";
import { CATEGORY_OPTIONS } from "../constants/categoryOptions";

function Results({ vibe, userInput, selectedTypes, onReset }) {
  const [recs, setRecs] = useState(null);
  const [regenCount, setRegenCount] = useState(0); // 🔁 for forcing refresh
  const normalizedVibe = vibe.toLowerCase().trim();
  const getCategoryMeta = (key) =>
    CATEGORY_OPTIONS.find((c) => c.key === key) || { label: key, emoji: "✨" };


  useEffect(() => {
    let cancelled = false;
  
    async function getData() {
      setRecs(null); // Clear out stale results if needed
      const results = await getRecsForTypes(vibe, selectedTypes, userInput, regenCount > 0);
      if (!cancelled) {
        setRecs(results);
      }
    }
  
    getData();
  
    return () => {
      cancelled = true;
    };
  }, [vibe, selectedTypes, regenCount]);
  
  if (!recs) return <p className="mt-4 text-gray-600">Generating recommendations...</p>;

  const { wine, album, activity, boardGame } = recs;
  const emojiForType = {
    wine: "🍷",
    album: "🎶",
    activity: "🔥",
    boardgame: "🎲",
  };
  
  const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);  

  const body = `I'm feeling ${vibe}!\n\n${recs.raw}`;

  return (
    <div className="mt-8 text-left max-w-lg">
      <h2 className="text-lg text-gray-700 mb-4">
        Your mood: <span className="font-medium italic">{userInput}</span> &nbsp;
        <span className="text-sm text-gray-500">→</span> &nbsp;
        your vibe: <span className="italic font-semibold">{vibe}</span>
      </h2>

      {recs &&
        Object.entries(recs).map(([categoryKey, recData]) => {
          const { label, emoji } = getCategoryMeta(categoryKey);

          return (
            <div
              key={categoryKey}
              className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-2">
                {emoji} {label}
              </h2>

              <p className="mb-1">
                <strong>Recommendation:</strong> {recData.recommendation}
              </p>

              <p className="italic text-sm text-gray-600">{recData.rationale}</p>

              <p className="text-xs mt-2 text-right text-gray-400">
                Source: {recData.source === "gpt" ? "Generated" : "From Library"}
              </p>
            </div>
          );
        })}

      <button
        onClick={() => setRegenCount(c => c + 1)}
        className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Regenerate recommendations for this vibe!
      </button>

      <button
        onClick={onReset}
        className="mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 block"
      >
        Generate new vibe recommendations!
      </button>
    </div>
  );
}

export default Results;
