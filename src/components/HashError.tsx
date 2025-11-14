import type { HashErrorProps } from "../types/hash.types";

function HashError({ error, onRetry }: HashErrorProps) {
  return (
    <div className="bg-blue-900/50 border border-blue-600 rounded-lg p-4">
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
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
        <div className="flex flex-col gap-1 flex-grow">
          <p className="text-sm font-medium text-blue-200">SHA256 Hash Error</p>
          <p className="text-xs text-blue-300">{error}</p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-xs font-medium rounded self-start focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HashError;
