import { describe, it, expect } from "vitest";
import { render, screen } from "../test-utils";
import HashDetails from "./HashDetails";
import type { HashFormData } from "../types/hash.types";
import { createMockFile } from "../test/setup";

describe("HashDetails", () => {
  it("should display hash value", () => {
    const formData: HashFormData = {
      file: createMockFile("test.txt", "content"),
      description: "",
      hash: "abc123def456",
    };

    render(<HashDetails formData={formData} />);
    expect(screen.getByText("SHA256 Hash:")).toBeInTheDocument();
    expect(screen.getByText("abc123def456")).toBeInTheDocument();
  });

  it("should display filename", () => {
    const formData: HashFormData = {
      file: createMockFile("my-document.pdf", "content"),
      description: "",
      hash: "hash123",
    };

    render(<HashDetails formData={formData} />);
    expect(screen.getByText("Filename:")).toBeInTheDocument();
    expect(screen.getByText("my-document.pdf")).toBeInTheDocument();
  });

  it("should display formatted file size", () => {
    const largeFile = createMockFile("large.txt", "x".repeat(2048));
    const formData: HashFormData = {
      file: largeFile,
      description: "",
      hash: "hash123",
    };

    render(<HashDetails formData={formData} />);
    expect(screen.getByText("Filesize:")).toBeInTheDocument();
    // File size should be formatted (2KB for 2048 bytes)
    expect(screen.getByText(/2 KB/)).toBeInTheDocument();
  });

  it("should handle missing file data gracefully", () => {
    const formData: HashFormData = {
      file: null,
      description: "",
      hash: "hash123",
    };

    render(<HashDetails formData={formData} />);
    expect(screen.getByText("hash123")).toBeInTheDocument();
    // Filename and size should show empty or default values
    expect(screen.getByText("Filename:")).toBeInTheDocument();
  });

  it("should handle missing hash gracefully", () => {
    const formData: HashFormData = {
      file: createMockFile("test.txt", "content"),
      description: "",
      hash: undefined,
    };

    render(<HashDetails formData={formData} />);
    expect(screen.getByText("SHA256 Hash:")).toBeInTheDocument();
    // Hash should be empty or undefined
    const hashElement = screen.getByText("SHA256 Hash:").parentElement;
    expect(hashElement?.textContent).toContain("SHA256 Hash:");
  });

  it("should display all information together", () => {
    const formData: HashFormData = {
      file: createMockFile("document.pdf", "content", "application/pdf"),
      description: "Test document",
      hash: "a1b2c3d4e5f6",
    };

    render(<HashDetails formData={formData} />);

    expect(screen.getByText("SHA256 Hash:")).toBeInTheDocument();
    expect(screen.getByText("a1b2c3d4e5f6")).toBeInTheDocument();
    expect(screen.getByText("Filename:")).toBeInTheDocument();
    expect(screen.getByText("document.pdf")).toBeInTheDocument();
    expect(screen.getByText("Filesize:")).toBeInTheDocument();
  });

  it("should format different file sizes correctly", () => {
    const testCases = [
      { size: 500, expected: "500 Bytes" },
      { size: 1024, expected: "1 KB" },
      { size: 5 * 1024 * 1024, expected: "5 MB" },
    ];

    testCases.forEach(({ size, expected }) => {
      const file = new File(["x".repeat(size)], "test.txt");
      const formData: HashFormData = {
        file,
        description: "",
        hash: "hash",
      };

      const { unmount } = render(<HashDetails formData={formData} />);
      expect(screen.getByText(new RegExp(expected))).toBeInTheDocument();
      unmount();
    });
  });
});
