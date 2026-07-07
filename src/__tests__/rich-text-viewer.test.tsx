import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { RichTextViewer } from "../components/RichTextViewer";

afterEach(() => {
  cleanup();
});

describe("RichTextViewer", () => {
  it("renders the given HTML value", async () => {
    render(<RichTextViewer value="<p>Hello viewer</p>" />);

    await waitFor(() => {
      expect(screen.getByText("Hello viewer")).toBeInTheDocument();
    });
  });

  it("renders as non-editable", async () => {
    const { container } = render(
      <RichTextViewer value="<p>Hello viewer</p>" />,
    );

    await waitFor(() => {
      const proseMirror = container.querySelector(".ProseMirror");
      expect(proseMirror).not.toBeNull();
      expect(proseMirror).toHaveAttribute("contenteditable", "false");
    });
  });

  it("renders the expected test ids", async () => {
    render(<RichTextViewer value="<p>Hello viewer</p>" />);

    await waitFor(() => {
      expect(screen.getByTestId("rich-text-control")).toBeInTheDocument();
      expect(screen.getByTestId("editor-content")).toBeInTheDocument();
    });
  });

  it("updates the rendered content when the value prop changes", async () => {
    const { rerender } = render(<RichTextViewer value="<p>First</p>" />);

    await waitFor(() => {
      expect(screen.getByText("First")).toBeInTheDocument();
    });

    rerender(<RichTextViewer value="<p>Second</p>" />);

    await waitFor(() => {
      expect(screen.queryByText("First")).not.toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
    });
  });
});
