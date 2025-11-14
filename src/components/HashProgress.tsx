import type { HashProgressProps } from "../types/hash.types";

function HashProgress({ isHashing, progress = 0 }: HashProgressProps) {
  if (isHashing) {
    return (
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <p className="text-sm text-slate-300">Computing SHA256 hash...</p>
          <span className="text-sm text-blue-400 ml-auto">{progress}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return null;
}

export default HashProgress;
