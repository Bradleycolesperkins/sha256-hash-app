import { useState } from "react";
import HashForm from "./components/HashForm.tsx";
import { HashHistory } from "./components/HashHistory.tsx";
import type { HashFormData } from "./types/hash.types";

function App() {
  const [hashHistoryData, setHashHistoryData] = useState<HashFormData[]>([]);

  const addHash = (data: HashFormData) => {
    if (data.hash && data.file) {
      // Create a new entry with timestamp
      const newEntry: HashFormData = {
        ...data,
        file: new File([data.file], data.file.name, { type: data.file.type }),
      };

      setHashHistoryData((prev) => [...prev, newEntry]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-slate-900 text-white">
      <h1 className="text-3xl font-bold">SHA256 Hash App</h1>

      <div className="flex flex-row gap-8 w-full max-w-6xl items-start justify-center">
        <HashForm addHash={addHash} />
        <HashHistory data={hashHistoryData} />
      </div>
    </div>
  );
}

export default App;
