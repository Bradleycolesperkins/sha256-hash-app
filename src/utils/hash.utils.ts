export async function computeSHA256(file: File): Promise<string> {
  const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB chunks
  const total = file.size;
  let offset = 0;
  const chunks: Uint8Array[] = [];

  try {
    // Read file in chunks
    while (offset < total) {
      const chunk = file.slice(offset, Math.min(offset + CHUNK_SIZE, total));
      const arrayBuffer = await readChunk(chunk);
      chunks.push(new Uint8Array(arrayBuffer));
      offset += CHUNK_SIZE;

      // Send to event loop to keep UI responsive
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }

    // Combine all chunks
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const combined = new Uint8Array(totalLength);
    let position = 0;

    for (const chunk of chunks) {
      combined.set(chunk, position);
      position += chunk.length;
    }

    // Calculate hash using Web Worker to prevent UI freezing
    const hash = await calculateHashInWorker(combined.buffer);

    return hash;
  } catch (error) {
    throw new Error(
      `Failed to calculate hash: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

function readChunk(chunk: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read chunk"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file chunk"));
    reader.readAsArrayBuffer(chunk);
  });
}

export function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function calculateHashInWorker(buffer: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create a unique ID for this calculation
    const id = Date.now().toString();

    // Create a new worker
    const worker = new Worker(
      new URL("../workers/hash.worker.ts", import.meta.url),
      { type: "module" },
    );

    // Listen for messages from the worker
    worker.onmessage = (event) => {
      const { id: responseId, hash, error } = event.data;

      // Check if this is the response we're waiting for
      if (responseId === id) {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(hash);
        }

        // Clean up
        worker.terminate();
      }
    };

    // Handle worker errors
    worker.onerror = (error) => {
      reject(new Error(`Worker error: ${error.message}`));
      worker.terminate();
    };

    // Send the buffer to the worker
    worker.postMessage({ buffer, id }, [buffer]);
  });
}

export function formatFileSize(
  bytes: number | undefined,
  decimals: number = 2,
): string {
  if (bytes === undefined || bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
}
