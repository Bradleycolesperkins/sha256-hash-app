import { describe, it, expect } from "vitest";
import { render, screen } from "../test-utils";
import HashError from "./HashError";

describe("HashError", () => {
  it("should display error message", () => {
    const errorMessage = "Failed to compute hash";
    render(<HashError error={errorMessage} />);
    expect(screen.getByText("SHA256 Hash Error")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
