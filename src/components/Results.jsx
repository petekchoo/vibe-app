import { useEffect, useState } from "react";
import { generateRecommendations } from "../utils/generateRecs";

function Results({ vibe, userInput, onReset }) {
  const [recs, setRecs] = useState(null);
  const [regenCount, setRegenCount] = useState(0); // 🔁 for forcing refresh

  useEffect(() => {
    let cancelled = false;
  
    async function getData() {
      setRecs(null); // Optional: show loading indicator
      const results = await generateRecommendations(vibe);
      if (!cancelled) {
        setRecs(results);
      }
    }
  
    getData();
  
    return () => {
      cancelled = true;
    };
  }, [vibe, regenCount]); // 🔁 add regenCount to trigger effect

  if (!recs) return <p className="mt-4 text-gray-600">Generating recommendations...</p>;

  const { wine, album, act, boardGame } = recs;
  const body = `I'm feeling ${vibe}!\n\n${recs.raw}`;

  return (
    <div className="mt-8 text-left max-w-lg">
      <h2 className="text-lg text-gray-700 mb-4">
        Your mood: <span className="font-medium italic">{userInput}</span> &nbsp;
        <span className="text-sm text-gray-500">→</span> &nbsp;
        your vibe: <span className="italic font-semibold">{vibe}</span>
      </h2>

      {recs.raw ? (
        <pre className="bg-white p-4 rounded shadow whitespace-pre-wrap">{recs.raw}</pre>
      ) : (
        <p className="text-gray-500 italic">No vibe content returned.</p>
      )}

      <button
        onClick={() => setRegenCount(c => c + 1)}
        className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Regenerate recommendations for this vibe!
      </button>

      <a
        href={`mailto:?subject=Check out my vibe-based recs&body=${encodeURIComponent(body)}`}
        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Share my vibe recommendations!
      </a>

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
