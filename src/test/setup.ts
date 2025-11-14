import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Helper to create mock File objects
export function createMockFile(
  name: string,
  content: string | Blob,
  type = "text/plain",
): File {
  if (typeof content === "string") {
    const blob = new Blob([content], { type });
    return new File([blob], name, { type });
  }
  return new File([content], name, { type });
}
