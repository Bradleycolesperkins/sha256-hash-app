import type { HashErrorProps } from "../types/hash.types";

function HashError({ error }: HashErrorProps) {
  return (
    <div className="bg-red-900/50 border border-red-600 rounded-lg p-4">
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-red-200">SHA256 Hash Error</p>
          <p className="text-xs text-red-300">{error}</p>
        </div>
      </div>
    </div>
  );
}

export default HashError;
