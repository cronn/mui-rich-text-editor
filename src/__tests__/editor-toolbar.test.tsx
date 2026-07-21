import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { EditorToolbar } from "../components/EditorToolbar";
import { renderEditor } from "./render-editor";

afterEach(() => {
  cleanup();
});

function renderToolbar(
  overrides: Partial<Parameters<typeof EditorToolbar>[0]> = {},
  editor: Parameters<typeof EditorToolbar>[0]["editor"],
) {
  return render(<EditorToolbar editor={editor} {...overrides} />);
}

describe("EditorToolbar", () => {
  it("renders all toolbar buttons by default", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    renderToolbar({}, editor);

    expect(screen.getByRole("button", { name: "Fett" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Kursiv" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Unterstrichen" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Aufzählung" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Nummerierte Liste" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Link hinzufügen" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("rich-text-image-upload")).toBeInTheDocument();
  });

  it("toggles bold when the bold button is clicked", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    editor.commands.selectAll();
    renderToolbar({}, editor);

    await user.click(screen.getByRole("button", { name: "Fett" }));

    await waitFor(() => {
      expect(editor.isActive("bold")).toBe(true);
    });
  });

  it("toggles italic when the italic button is clicked", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    editor.commands.selectAll();
    renderToolbar({}, editor);

    await user.click(screen.getByRole("button", { name: "Kursiv" }));

    await waitFor(() => {
      expect(editor.isActive("italic")).toBe(true);
    });
  });

  it("toggles underline when the underline button is clicked", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    editor.commands.selectAll();
    renderToolbar({}, editor);

    await user.click(screen.getByRole("button", { name: "Unterstrichen" }));

    await waitFor(() => {
      expect(editor.isActive("underline")).toBe(true);
    });
  });

  it("toggles bulletList when the bulletList button is clicked", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    renderToolbar({}, editor);

    await user.click(screen.getByRole("button", { name: "Aufzählung" }));

    await waitFor(() => {
      expect(editor.isActive("bulletList")).toBe(true);
    });
  });

  it("toggles orderedList when the orderedList button is clicked", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    renderToolbar({}, editor);

    await user.click(screen.getByRole("button", { name: "Nummerierte Liste" }));

    await waitFor(() => {
      expect(editor.isActive("orderedList")).toBe(true);
    });
  });

  it("hides the link button when disableLink is true", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    renderToolbar({ disableLink: true }, editor);

    expect(
      screen.queryByRole("button", { name: "Link hinzufügen" }),
    ).not.toBeInTheDocument();
  });

  it("hides the image upload button when disableImageUpload is true", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    renderToolbar({ disableImageUpload: true }, editor);

    expect(
      screen.queryByTestId("rich-text-image-upload"),
    ).not.toBeInTheDocument();
  });

  it("uses custom translations for toolbar button labels", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    renderToolbar(
      {
        translations: {
          bold: "Bold",
          italic: "Italic",
          underline: "Underline",
          bulletList: "Bullet List",
          orderedList: "Ordered List",
          alignToggleButtonGroup: {
            left: "Left",
            center: "Center",
            right: "Right",
          },
          linkButtonTranslations: {
            tooltip: "Add link",
            linkDialog: {
              title: "Insert Link",
              urlLabel: "URL",
              urlRequiredMessage: "Required",
              ctaLabel: "Insert",
            },
          },
        },
      },
      editor,
    );

    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Underline" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Bullet List" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ordered List" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add link" }),
    ).toBeInTheDocument();
  });
});
