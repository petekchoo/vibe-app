import { useState } from "react";
import { deriveVibe } from "./utils/deriveVibe";
import Results from "./components/Results";

function App() {
  const [input, setInput] = useState("");
  const [vibe, setVibe] = useState("");

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const derived = await deriveVibe(input);
    setVibe(derived);
  };

  const handleReset = () => {
    setInput("");
    setVibe("");
  };

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
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Generate vibe-based activities
          </button>
        </form>
      )}

      {vibe && <Results vibe={vibe} onReset={handleReset} />}

    </div>
  );
}

export default App;