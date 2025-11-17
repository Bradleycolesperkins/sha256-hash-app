import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../test-utils";
import userEvent from "@testing-library/user-event";
import HashError from "./HashError";

describe("HashError", () => {
  it("should display error message", () => {
    const errorMessage = "Failed to compute hash";
    render(<HashError error={errorMessage} />);
    expect(screen.getByText("SHA256 Hash Error")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should display error icon", () => {
    const { container } = render(<HashError error="Test error" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should render retry button when hasRetry is true and onRetry is provided", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<HashError error="Test error" onRetry={onRetry} hasRetry={true} />);

    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    await user.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("should not render retry button when hasRetry is false", () => {
    const onRetry = vi.fn();
    render(<HashError error="Test error" onRetry={onRetry} hasRetry={false} />);

    expect(
      screen.queryByRole("button", { name: /retry/i }),
    ).not.toBeInTheDocument();
  });

  it("should not render retry button when onRetry is not provided", () => {
    render(<HashError error="Test error" hasRetry={true} />);

    expect(
      screen.queryByRole("button", { name: /retry/i }),
    ).not.toBeInTheDocument();
  });

  it("should default hasRetry to true", () => {
    const onRetry = vi.fn();
    render(<HashError error="Test error" onRetry={onRetry} />);

    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("should handle multiple retry clicks", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<HashError error="Test error" onRetry={onRetry} />);

    const retryButton = screen.getByRole("button", { name: /retry/i });
    await user.click(retryButton);
    await user.click(retryButton);
    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(3);
  });
});
