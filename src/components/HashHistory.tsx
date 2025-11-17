import { formatFileSize } from "../utils/hash.utils";
import type { HashHistoryProps } from "../types/hash.types";

export function HashHistory({ data }: HashHistoryProps) {
  if (data.length === 0) {
    return <></>;
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-2">
      <h2 className="text-sm font-medium">Hash History</h2>
      <table className="w-full text-sm text-left text-slate-300 rounded-lg overflow-hidden">
        <thead className="bg-slate-700 text-slate-300">
          <tr>
            <th scope="col" className="px-4 py-3">
              File
            </th>
            <th scope="col" className="px-4 py-3">
              Size
            </th>
            <th scope="col" className="px-4 py-3">
              Hash
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-slate-700 bg-slate-800 ">
              <td className="px-4 py-3">
                <div className="flex flex-col min-w-[150px]">
                  <span className="font-medium wrap-break-word max-w-[150px]">
                    {item.file?.name}
                  </span>
                  {item.description && (
                    <span 
                      className="text-xs text-slate-400 wrap-break-word max-w-[150px]"
                      aria-label="file description"
                    >
                      {item.description}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-nowrap">
                  {item.file ? formatFileSize(item.file.size) : "N/A"}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="wrap-break-word" title={item.hash}>
                  {item.hash}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
