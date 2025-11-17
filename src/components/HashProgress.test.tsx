import { describe, it, expect } from "vitest";
import { render, screen } from "../test-utils";
import HashProgress from "./HashProgress";

describe("HashProgress", () => {
  it("should return null when hashing is false", () => {
    const { container } = render(<HashProgress isHashing={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render progress component when hashing is true", () => {
    render(<HashProgress isHashing={true} />);
    expect(screen.getByText("Computing SHA256 hash...")).toBeInTheDocument();
  });

  it("should display progress percentage", () => {
    render(<HashProgress isHashing={true} progress={50} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("should display 0% when progress is not provided", () => {
    render(<HashProgress isHashing={true} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("should display progress bar with correct width", () => {
    const { container } = render(
      <HashProgress isHashing={true} progress={75} />,
    );
    const progressBar = container.querySelector(".bg-blue-500") as HTMLElement;
    expect(progressBar).toBeInTheDocument();
    expect(progressBar.style.width).toBe("75%");
  });

  it("should display spinner when hashing", () => {
    const { container } = render(<HashProgress isHashing={true} />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should update progress bar width when progress changes", () => {
    const { container, rerender } = render(
      <HashProgress isHashing={true} progress={25} />,
    );
    let progressBar = container.querySelector(".bg-blue-500") as HTMLElement;
    expect(progressBar.style.width).toBe("25%");

    rerender(<HashProgress isHashing={true} progress={75} />);
    progressBar = container.querySelector(".bg-blue-500") as HTMLElement;
    expect(progressBar.style.width).toBe("75%");
  });
});
