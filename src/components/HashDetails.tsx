import type { HashDetailsProps } from "../types/hash.types";
import { formatFileSize } from "../utils/hash.utils";

function HashDetails({ formData }: HashDetailsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-green-900/50 border border-green-600 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-green-200">SHA256 Hash:</p>
            <p className="text-xs text-green-300 break-all">{formData?.hash}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 bg-slate-800 rounded-lg p-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-200">Filename:</p>
            <p className="text-xs break-all">{formData?.file?.name}</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-200">Filesize:</p>
            <p className="text-xs break-all">
              {formatFileSize(formData?.file?.size)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HashDetails;
