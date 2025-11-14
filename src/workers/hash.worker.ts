import { bufferToHex } from "../utils/hash.utils";

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
  try {
    const { buffer, id } = event.data;

    // Calculate hash
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

    // Convert to hex and send back to the main thread
    const hashHex = bufferToHex(hashBuffer);
    self.postMessage({ id, hash: hashHex });
  } catch (error) {
    // Send error back to the main thread
    self.postMessage({
      id: event.data.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export {};
