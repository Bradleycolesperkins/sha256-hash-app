import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent, act } from "../test-utils";
import userEvent from "@testing-library/user-event";
import HashForm from "./HashForm";
import { createMockFile } from "../test/setup";
import { computeSHA256 } from "../utils/hash.utils";
import {
  MAX_FILE_SIZE,
  MAX_DESCRIPTION_LENGTH,
} from "../constants/app.constants";

// Mock console.error to prevent error messages in test output
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

// Mock the computeSHA256 function
vi.mock("../utils/hash.utils", () => ({
  computeSHA256: vi.fn(),
  formatFileSize: vi.fn((bytes) => {
    if (bytes === undefined || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }),
  bufferToHex: vi.fn((buffer) => {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }),
}));

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

  it("should handle file selection and trigger hash computation", async () => {
    const file = createMockFile("test.txt", "Hello, World!");
    const mockHash = "abc123def456";

    vi.mocked(computeSHA256).mockResolvedValue(mockHash);

    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    // Manually set the file and trigger the change event
    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    });

    // Trigger the change event
    fireEvent.change(fileInput);

    await waitFor(
      () => {
        expect(computeSHA256).toHaveBeenCalledWith(file, expect.any(Function));
      },
      { timeout: 3000 },
    );
  });

  it("should display hash details after successful computation", async () => {
    const file = createMockFile("test.txt", "content");
    const mockHash = "abc123def456";

    vi.mocked(computeSHA256).mockResolvedValue(mockHash);

    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    // Manually set the file and trigger the change event
    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    });

    // Trigger the change event
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByText("SHA256 Hash:")).toBeInTheDocument();
      expect(screen.getByText(mockHash)).toBeInTheDocument();
    });
  });

  it("should display error when hash computation fails", async () => {
    const file = createMockFile("test.txt", "content");
    const errorMessage = "Failed to compute hash";

    vi.mocked(computeSHA256).mockRejectedValue(new Error(errorMessage));

    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    // Manually set the file and trigger the change event
    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    });

    // Trigger the change event
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByText("SHA256 Hash Error")).toBeInTheDocument();
      expect(screen.getByText(new RegExp(errorMessage))).toBeInTheDocument();
    });
  });

  it("should validate file size and show error for files exceeding limit", async () => {
    // Create a small file but mock its size property to be larger than MAX_FILE_SIZE
    const largeFile = new File(["test content"], "large.txt", {
      type: "text/plain",
    });
    // Mock the size property to be larger than MAX_FILE_SIZE
    Object.defineProperty(largeFile, "size", { value: MAX_FILE_SIZE + 1 });

    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await act(async () => {
      // Manually set the file and trigger the change event
      Object.defineProperty(fileInput, "files", {
        value: [largeFile],
        writable: false,
      });

      // Trigger the change event
      fireEvent.change(fileInput);
    });

    await waitFor(() => {
      expect(screen.getByText("SHA256 Hash Error")).toBeInTheDocument();
      expect(
        screen.getByText(/file size exceeds the maximum allowed size/i),
      ).toBeInTheDocument();
    });

    expect(computeSHA256).not.toHaveBeenCalled();
  });

  it("should handle description input", async () => {
    const user = userEvent.setup();
    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);

    const descriptionInput = screen.getByPlaceholderText(
      /enter a description/i,
    ) as HTMLTextAreaElement;

    await user.type(descriptionInput, "Test description");

    expect(descriptionInput.value).toBe("Test description");
  });

  it("should limit description to MAX_DESCRIPTION_LENGTH", async () => {
    const user = userEvent.setup();
    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);

    const descriptionInput = screen.getByPlaceholderText(
      /enter a description/i,
    ) as HTMLTextAreaElement;

    const longText = "x".repeat(MAX_DESCRIPTION_LENGTH + 100);
    await user.type(descriptionInput, longText);

    expect(descriptionInput.value.length).toBe(MAX_DESCRIPTION_LENGTH);
    expect(
      screen.getByText(
        `${MAX_DESCRIPTION_LENGTH}/${MAX_DESCRIPTION_LENGTH} characters`,
      ),
    ).toBeInTheDocument();
  });

  it("should display character count for description", async () => {
    const user = userEvent.setup();
    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);

    const descriptionInput = screen.getByPlaceholderText(
      /enter a description/i,
    ) as HTMLTextAreaElement;

    await user.type(descriptionInput, "Hello");

    expect(
      screen.getByText(`5/${MAX_DESCRIPTION_LENGTH} characters`),
    ).toBeInTheDocument();
  });

  it("should handle form submission", async () => {
    const user = userEvent.setup();
    const file = createMockFile("test.txt", "content");
    const mockHash = "hash123";

    vi.mocked(computeSHA256).mockResolvedValue(mockHash);

    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);

    // Upload file
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    // Manually set the file and trigger the change event
    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    });

    // Trigger the change event
    fireEvent.change(fileInput);

    // Enter description
    const descriptionInput =
      screen.getByPlaceholderText(/enter a description/i);
    await user.type(descriptionInput, "Test description");

    // Wait for hash to complete
    await waitFor(() => {
      expect(screen.getByText("SHA256 Hash:")).toBeInTheDocument();
    });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddHash).toHaveBeenCalledWith(
        expect.objectContaining({
          file,
          description: "Test description",
          hash: mockHash,
        }),
      );
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          file,
          description: "Test description",
          hash: mockHash,
        }),
      );
    });
  });

  it("should clear form after submission", async () => {
    const user = userEvent.setup();
    const file = createMockFile("test.txt", "content");
    const mockHash = "hash123";

    vi.mocked(computeSHA256).mockResolvedValue(mockHash);

    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);

    // Upload file and enter description
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    // Manually set the file and trigger the change event
    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    });

    // Trigger the change event
    fireEvent.change(fileInput);

    const descriptionInput =
      screen.getByPlaceholderText(/enter a description/i);
    await user.type(descriptionInput, "Test description");

    await waitFor(() => {
      expect(screen.getByText("SHA256 Hash:")).toBeInTheDocument();
    });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    // Form should be cleared
    await waitFor(() => {
      const descriptionAfter = screen.getByPlaceholderText(
        /enter a description/i,
      ) as HTMLTextAreaElement;
      expect(descriptionAfter.value).toBe("");
    });
  });

  it("should handle reset button", async () => {
    const user = userEvent.setup();
    const file = createMockFile("test.txt", "content");
    const mockHash = "hash123";

    vi.mocked(computeSHA256).mockResolvedValue(mockHash);

    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);

    // Upload file and enter description
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    // Manually set the file and trigger the change event
    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    });

    // Trigger the change event
    fireEvent.change(fileInput);

    const descriptionInput = screen.getByPlaceholderText(
      /enter a description/i,
    ) as HTMLTextAreaElement;
    await user.type(descriptionInput, "Test description");

    await waitFor(() => {
      expect(screen.getByText("SHA256 Hash:")).toBeInTheDocument();
    });

    // Click reset
    const resetButton = screen.getByRole("button", { name: /reset/i });
    await user.click(resetButton);

    // Form should be cleared
    expect(descriptionInput.value).toBe("");
    expect(fileInput.value).toBe("");
    expect(screen.queryByText("SHA256 Hash:")).not.toBeInTheDocument();
  });

  it("should handle retry on error", async () => {
    const user = userEvent.setup();
    const file = createMockFile("test.txt", "content");
    const mockHash = "hash123";

    // Mock computeSHA256 to fail on first call and succeed on second call
    vi.mocked(computeSHA256)
      .mockRejectedValueOnce(new Error("First attempt failed"))
      .mockResolvedValueOnce(mockHash);

    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);

    // Get the file input
    const fileInput = screen.getByLabelText(/upload file/i, {
      selector: "input",
    });

    // Upload file (will fail on first attempt)
    const changeEvent = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    fireEvent.change(fileInput, changeEvent);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText("SHA256 Hash Error")).toBeInTheDocument();
    });

    // Verify computeSHA256 was called once
    expect(computeSHA256).toHaveBeenCalledTimes(1);
    expect(computeSHA256).toHaveBeenCalledWith(file, expect.any(Function));

    // Find and click the retry button
    const retryButton = screen.getByRole("button", { name: /retry/i });
    await user.click(retryButton);

    // Verify computeSHA256 was called again with the same file
    expect(computeSHA256).toHaveBeenCalledTimes(2);
    expect(computeSHA256).toHaveBeenNthCalledWith(2, file, expect.any(Function));
  });

  it("should not show retry button for file size errors", async () => {
    // Create a small file but mock its size property to be larger than MAX_FILE_SIZE
    const largeFile = new File(["test content"], "large.txt", {
      type: "text/plain",
    });
    // Mock the size property to be larger than MAX_FILE_SIZE
    Object.defineProperty(largeFile, "size", { value: MAX_FILE_SIZE + 1 });

    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await act(async () => {
      // Manually set the file and trigger the change event
      Object.defineProperty(fileInput, "files", {
        value: [largeFile],
        writable: false,
      });

      // Trigger the change event
      fireEvent.change(fileInput);
    });

    await waitFor(() => {
      expect(screen.getByText("SHA256 Hash Error")).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: /retry/i }),
    ).not.toBeInTheDocument();
  });

  it("should work without onSubmit prop", async () => {
    const user = userEvent.setup();
    const file = createMockFile("test.txt", "content");
    const mockHash = "hash123";

    vi.mocked(computeSHA256).mockResolvedValue(mockHash);

    render(<HashForm addHash={mockAddHash} />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    // Manually set the file and trigger the change event
    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    });

    // Trigger the change event
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByText("SHA256 Hash:")).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddHash).toHaveBeenCalled();
    });
  });

  it("should clear error when new file is selected", async () => {
    const file1 = createMockFile("test1.txt", "content");
    const file2 = createMockFile("test2.txt", "content");
    const mockHash = "hash123";

    // First file fails, second succeeds
    vi.mocked(computeSHA256)
      .mockRejectedValueOnce(new Error("First file failed"))
      .mockResolvedValueOnce(mockHash);

    render(<HashForm onSubmit={mockOnSubmit} addHash={mockAddHash} />);

    // Instead of trying to set the files property directly, we'll mock the handleFileChange function
    // First, let's get a reference to the component instance
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    // For the first file (that fails)
    // Create a mock change event
    const changeEvent1 = {
      target: {
        files: [file1],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    // Call the onChange handler directly
    fireEvent.change(fileInput, changeEvent1);

    // Wait for the error to appear
    await waitFor(() => {
      expect(screen.getByText("SHA256 Hash Error")).toBeInTheDocument();
    });

    // For the second file (that succeeds)
    // Create a new mock change event
    const changeEvent2 = {
      target: {
        files: [file2],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    // Call the onChange handler directly with the new event
    fireEvent.change(fileInput, changeEvent2);

    // Wait for the hash to be computed
    await waitFor(() => {
      expect(screen.queryByText("SHA256 Hash Error")).not.toBeInTheDocument();
      expect(screen.getByText("SHA256 Hash:")).toBeInTheDocument();
    });
  });
});
