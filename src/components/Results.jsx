import { useEffect, useState } from "react";
import { getRecsForTypes } from "../utils/generateRecs";
import { CATEGORY_OPTIONS } from "../constants/categoryOptions";
import { getUserVotes, setUserVote } from "../utils/voteStorage";
import { updateVoteCount } from "../utils/voteActions";

function Results({ vibe, userInput, selectedTypes, onReset }) {
  const [recs, setRecs] = useState(null);
  const [regenCount, setRegenCount] = useState(0); // 🔁 for forcing refresh
  const ENABLED_CATEGORIES = CATEGORY_OPTIONS.filter(c => c.isEnabled);
  const [votePing, setVotePing] = useState(0); // top of Results
  
  const getCategoryMeta = (key) =>
    ENABLED_CATEGORIES.find((c) => c.key === key) || { label: key, emoji: "✨" };

  function handleVote(recId, direction) {
    const currentVotes = getUserVotes();
    const current = currentVotes[recId];

    let newDirection = null;

    if (current === direction) {
      // Toggle off
      newDirection = null;
      updateVoteCount(recId, direction, -1);
    } else {
      if (current) {
        updateVoteCount(recId, current, -1);
      }
      updateVoteCount(recId, direction, 1);
      newDirection = direction;
    }

    setUserVote(recId, newDirection);
    setVotePing((prev) => prev + 1); // force re-evaluation
  }

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
  
  if (!recs) {
    return (
      <div className="mt-20 text-center">
        <div className="text-2xl text-indigo-600 animate-pulse">
          ✨ Tuning into your vibe...
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Summoning chaotic good recommendations...
        </p>
      </div>
    );
  }  
  
  const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const body = `I'm feeling ${vibe}!\n\n${recs.raw}`;

  return (
    <div className="mt-8 text-left max-w-lg">
      <h2 className="text-xl font-semibold text-center mb-6">
        <span className="text-gray-500">You said:</span>{" "}
        <span className="italic text-gray-700">"{userInput}"</span>{" "}
        <span className="text-gray-500">→ vibe detected:</span>{" "}
        <span className="text-indigo-600 italic">{vibe}</span>
      </h2>

      {recs && (
        <div className="grid gap-6 grid-cols-1">
          {Object.entries(recs).map(([categoryKey, recData]) => {
            const { label, emoji, purchaseUrlBase } = getCategoryMeta(categoryKey);
            const userVote = getUserVotes()[recData.id]; // "up", "down", or undefined

            return (
              <div
                key={categoryKey}
                className="bg-white rounded-2xl shadow p-5 border border-gray-200"
              >
                <h3 className="text-lg font-bold flex items-center mb-2">
                  <span className="mr-2">{emoji}</span>
                  {label}
                </h3>

                <p className="mb-2 text-gray-800 leading-snug">
                  {recData.recommendation}
                </p>

                <p className="text-sm italic text-gray-600">{recData.rationale}</p>

                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVote(recData.id, "up")}
                      className={`text-2xl transition transform ${
                        userVote === "up" ? "grayscale-0 scale-110" : "grayscale"
                      }`}
                    >
                      👍
                    </button>

                    <button
                      onClick={() => handleVote(recData.id, "down")}
                      className={`text-2xl transition transform ${
                        userVote === "down" ? "grayscale-0 scale-110" : "grayscale"
                      }`}
                    >
                      👎
                    </button>
                  </div>
                
                <div>Source: {recData.source === "gpt" ? "Generated" : "From Library"}</div>
                
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <button
          onClick={() => setRegenCount((prev) => prev + 1)}
          className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition"
        >
          🔁 Regenerate Recommendations
        </button>

        <button
          onClick={onReset}
          className="bg-gray-300 text-gray-800 px-5 py-2 rounded-full hover:bg-gray-300 transition"
        >
          🔙 Start Over
        </button>

      </div>

    </div>
  );
}

export default Results;
