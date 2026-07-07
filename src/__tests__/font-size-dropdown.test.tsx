import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { FontSizeDropdown } from "../components/FontSizeDropdown";
import { renderEditor } from "./render-editor";

afterEach(() => {
  cleanup();
});

describe("FontSizeDropdown", () => {
  it("opens a menu with all available font sizes", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    render(<FontSizeDropdown editor={editor} />);

    await user.click(screen.getByRole("button"));

    for (const size of [12, 14, 16, 18, 20, 24, 28]) {
      expect(screen.getByText(size.toString())).toBeInTheDocument();
    }
  });

  it("sets the font size when a size is selected", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    editor.commands.selectAll();
    render(<FontSizeDropdown editor={editor} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("20"));

    await waitFor(() => {
      expect(
        (editor.getAttributes("textStyle") as { fontSize?: string }).fontSize,
      ).toBe("20px");
    });
  });

  it("shows the toolbar button as active/primary when activeFontSize matches the current size", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    editor.commands.selectAll();
    editor.chain().focus().setFontSize("18px").run();
    render(<FontSizeDropdown editor={editor} activeFontSize="18px" />);

    expect(screen.getByRole("button")).toHaveClass(
      "MuiIconButton-colorPrimary",
    );
  });
});
