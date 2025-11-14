import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "../test-utils";
import HashForm from "./HashForm";

describe("HashForm", () => {
  const mockOnSubmit = vi.fn();
  const mockAddHash = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render initial form", () => {
    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);
    expect(screen.getByText("Upload File")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  });
});
