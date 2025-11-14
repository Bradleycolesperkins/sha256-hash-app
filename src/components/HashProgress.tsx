import type { HashProgressProps } from "../types/hash.types";

function HashProgress({ isHashing }: HashProgressProps) {
  if (isHashing) {
    return (
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <p className="text-sm text-slate-300">Computing SHA256 hash...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default HashProgress;
