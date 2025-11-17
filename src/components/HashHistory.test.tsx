import { describe, it, expect } from "vitest";
import { render, screen } from "../test-utils";
import { HashHistory } from "./HashHistory";
import type { HashFormData } from "../types/hash.types";
import { createMockFile } from "../test/setup";

describe("HashHistory", () => {
  it("should return empty fragment when data array is empty", () => {
    const { container } = render(<HashHistory data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render table header", () => {
    const data: HashFormData[] = [
      {
        file: createMockFile("test.txt", "content"),
        description: "",
        hash: "hash1",
      },
    ];

    render(<HashHistory data={data} />);
    expect(screen.getByText("Hash History")).toBeInTheDocument();
    expect(screen.getByText("File")).toBeInTheDocument();
    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByText("Hash")).toBeInTheDocument();
  });

  it("should render single item", () => {
    const data: HashFormData[] = [
      {
        file: createMockFile("document.pdf", "content"),
        description: "Test document",
        hash: "abc123",
      },
    ];

    render(<HashHistory data={data} />);
    expect(screen.getByText("document.pdf")).toBeInTheDocument();
    expect(screen.getByText("Test document")).toBeInTheDocument();
    expect(screen.getByText("abc123")).toBeInTheDocument();
  });

  it("should render multiple items", () => {
    const data: HashFormData[] = [
      {
        file: createMockFile("file1.txt", "content1"),
        description: "First file",
        hash: "hash1",
      },
      {
        file: createMockFile("file2.txt", "content2"),
        description: "Second file",
        hash: "hash2",
      },
      {
        file: createMockFile("file3.txt", "content3"),
        description: "",
        hash: "hash3",
      },
    ];

    render(<HashHistory data={data} />);

    expect(screen.getByText("file1.txt")).toBeInTheDocument();
    expect(screen.getByText("First file")).toBeInTheDocument();
    expect(screen.getByText("hash1")).toBeInTheDocument();

    expect(screen.getByText("file2.txt")).toBeInTheDocument();
    expect(screen.getByText("Second file")).toBeInTheDocument();
    expect(screen.getByText("hash2")).toBeInTheDocument();

    expect(screen.getByText("file3.txt")).toBeInTheDocument();
    expect(screen.getByText("hash3")).toBeInTheDocument();
  });

  it("should display formatted file sizes", () => {
    const data: HashFormData[] = [
      {
        file: createMockFile("small.txt", "x".repeat(500)),
        description: "",
        hash: "hash1",
      },
      {
        file: createMockFile("large.txt", "x".repeat(5 * 1024 * 1024)),
        description: "",
        hash: "hash2",
      },
    ];

    render(<HashHistory data={data} />);
    expect(screen.getByText(/500 Bytes/)).toBeInTheDocument();
    expect(screen.getByText(/5 MB/)).toBeInTheDocument();
  });

  it("should handle items without description", () => {
    const data: HashFormData[] = [
      {
        file: createMockFile("test.txt", "content"),
        description: "",
        hash: "hash1",
      },
    ];

    render(<HashHistory data={data} />);
    expect(screen.getByText("test.txt")).toBeInTheDocument();

    // Description should not render when empty - check that description element is not in the DOM
    const descriptionElement = screen.queryByLabelText("file description");
    expect(descriptionElement).not.toBeInTheDocument();

    // Also verify the table structure
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("should handle items without file", () => {
    const data: HashFormData[] = [
      {
        file: null,
        description: "",
        hash: "hash1",
      },
    ];

    render(<HashHistory data={data} />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
    expect(screen.getByText("hash1")).toBeInTheDocument();
  });

  it("should display long hashes correctly", () => {
    const longHash = "a".repeat(64);
    const data: HashFormData[] = [
      {
        file: createMockFile("test.txt", "content"),
        description: "",
        hash: longHash,
      },
    ];

    render(<HashHistory data={data} />);
    expect(screen.getByText(longHash)).toBeInTheDocument();
  });
});
