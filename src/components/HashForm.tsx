import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { HashFormData, HashFormProps } from "../types/hash.types";
import HashProgress from "./HashProgress.tsx";
import HashDetails from "./HashDetails.tsx";
import { computeSHA256 } from "../utils/hash.utils";

function HashForm({ onSubmit }: HashFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<HashFormData>({
    file: null,
    description: "",
    hash: undefined,
  });

  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isHashing, setIsHashing] = useState<boolean>(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file, hash: undefined }));
    setSelectedFileName(file ? file.name : "");

    if (file) {
      setIsHashing(true);
      try {
        const hash = await computeSHA256(file);
        console.log("Hash:", hash);
        setFormData((prev) => ({ ...prev, hash }));
      } catch (error) {
        console.error("Error computing hash:", error);
      } finally {
        setIsHashing(false);
      }
    }
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      file: null,
      description: "",
      hash: undefined,
    });
    setSelectedFileName("");
    setIsHashing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="file-upload" className="text-sm font-medium">
            Upload File
          </label>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
              accept="*/*"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-10 h-10 mb-3 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-2 text-sm text-slate-400">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-slate-500">Any file type accepted</p>
              </div>
            </label>
          </div>
        </div>

        {selectedFileName ? <HashProgress isHashing={isHashing} /> : null}

        {selectedFileName && !isHashing ? (
          <HashDetails formData={formData} />
        ) : null}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-200"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Enter a description for this file..."
            rows={4}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}

export default HashForm;
