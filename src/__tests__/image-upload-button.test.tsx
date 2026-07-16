import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ImageUploadButton } from "../components/ImageUploadButton";
import { createFakeImageFile, mockImageApis } from "./image-mocks";
import { renderEditor } from "./render-editor";

afterEach(() => {
  cleanup();
});

describe("ImageUploadButton", () => {
  it("renders a hidden file input", async () => {
    const { editor } = await renderEditor({ content: "<p></p>" });
    render(<ImageUploadButton editor={editor} />);

    expect(screen.getByTestId("rich-text-image-upload")).toBeInTheDocument();
  });

  it("inserts an image (left-aligned, unscaled) when a small file is selected", async () => {
    const { drawImageMock, restore } = mockImageApis({
      width: 300,
      height: 200,
    });
    try {
      const { editor } = await renderEditor({ content: "<p></p>" });
      render(<ImageUploadButton editor={editor} />);

      const input = screen.getByTestId("rich-text-image-upload");
      fireEvent.change(input, { target: { files: [createFakeImageFile()] } });

      await waitFor(() => {
        expect(editor.getHTML()).toContain("<img");
      });

      const doc = editor.getJSON();
      const imageNode = doc.content?.find(
        (node) => node.type === "customImage",
      );
      expect(imageNode?.attrs?.align).toBe("left");
      expect(imageNode?.attrs?.width).toBe("300");
      expect(imageNode?.attrs?.height).toBe("200");
      // Small images (<= max width) should not go through canvas resizing.
      expect(drawImageMock).not.toHaveBeenCalled();
    } finally {
      restore();
    }
  });

  it("resizes and inserts an image when file width exceeds the max width", async () => {
    const { drawImageMock, toDataURLMock, restore } = mockImageApis({
      width: 1400,
      height: 700,
    });
    try {
      const { editor } = await renderEditor({ content: "<p></p>" });
      render(<ImageUploadButton editor={editor} />);

      const input = screen.getByTestId("rich-text-image-upload");
      fireEvent.change(input, { target: { files: [createFakeImageFile()] } });

      await waitFor(() => {
        expect(editor.getHTML()).toContain("<img");
      });

      expect(drawImageMock).toHaveBeenCalled();
      expect(toDataURLMock).toHaveBeenCalled();

      const doc = editor.getJSON();
      const imageNode = doc.content?.find(
        (node) => node.type === "customImage",
      );
      expect(imageNode?.attrs?.width).toBe("700");
      expect(imageNode?.attrs?.height).toBe("350");
    } finally {
      restore();
    }
  });

  it("does nothing when no file is selected", async () => {
    const { editor } = await renderEditor({ content: "<p></p>" });
    render(<ImageUploadButton editor={editor} />);

    const input = screen.getByTestId("rich-text-image-upload");
    fireEvent.change(input, { target: { files: [] } });

    expect(editor.getHTML()).not.toContain("<img");
  });

  it("aborts resizing gracefully when the canvas 2D context is unavailable", async () => {
    const { restore } = mockImageApis({ width: 1400, height: 700 });
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(null);
    try {
      const { editor } = await renderEditor({ content: "<p></p>" });
      render(<ImageUploadButton editor={editor} />);

      const input = screen.getByTestId("rich-text-image-upload");
      fireEvent.change(input, { target: { files: [createFakeImageFile()] } });

      // Give the FileReader/Image microtasks a chance to run.
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(editor.getHTML()).not.toContain("<img");
    } finally {
      getContextSpy.mockRestore();
      restore();
    }
  });
});
