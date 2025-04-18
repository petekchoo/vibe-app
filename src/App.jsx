import { useState } from "react";
import { deriveVibe } from "./utils/deriveVibe";
import Results from "./components/Results";
import { CATEGORY_OPTIONS } from "./constants/categoryOptions"; // adjust path as needed

function App() {
  const [input, setInput] = useState("");
  const [vibe, setVibe] = useState("");
  const ENABLED_CATEGORIES = CATEGORY_OPTIONS.filter(c => c.isEnabled);

  const [selectedTypes, setSelectedTypes] = useState([]);

  const canSubmit = input.trim().length > 0 && selectedTypes.length > 0;

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const derived = await deriveVibe(input);
    setVibe(derived);

    if (selectedTypes.length === 0) return;
  };

  const handleReset = () => {
    setInput("");
    setVibe("");
  };

  function toggleType(type) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-indigo-100 text-gray-900 p-6">
      <h1 className="text-4xl font-bold mb-6">What's the vibe today?</h1>

      {!vibe && (
        <form
          onSubmit={(e) => {
            e.preventDefault(); // prevent page refresh
            handleSubmit();
          }}
          className="flex flex-col items-center"
        >
          <input
            type="text"
            placeholder="Type your mood here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 shadow w-80"
          />
          
          <div className="flex flex-wrap gap-2 mt-4">
            {ENABLED_CATEGORIES.map(({ key, label, emoji }) => {
              const isSelected = selectedTypes.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleType(key)}
                  className={`px-4 py-2 rounded-full border transition duration-200 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-700 shadow"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {emoji} {label}
                </button>
              );
            })}
          </div>


          <button
            type="submit"
            disabled={!canSubmit}
            className={`mt-6 px-6 py-3 rounded-lg text-white font-semibold transition ${
              !canSubmit
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Generate vibe-based recommendations
          </button>

        </form>
      )}

      {vibe && <Results vibe={vibe} userInput={input} selectedTypes ={selectedTypes} onReset={handleReset} />}

    </div>
  );
}

export default App;