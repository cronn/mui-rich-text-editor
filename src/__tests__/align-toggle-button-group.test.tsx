import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { AlignToggleButtonGroup } from "../components/AlignToggleButtonGroup";
import { useEditorActiveState } from "../lib/useEditorActiveState";
import { renderEditor } from "./render-editor";
import type { CustomEditor } from "../lib/useCustomEditor";
import type { ActiveMarks } from "../lib/useEditorActiveState";

afterEach(() => {
  cleanup();
});

function Harness({ editor }: { editor: CustomEditor }) {
  const active = useEditorActiveState(editor);
  return <AlignToggleButtonGroup editor={editor} active={active} />;
}

describe("AlignToggleButtonGroup", () => {
  it("renders left/center/right buttons with default translations", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    render(<Harness editor={editor} />);

    expect(screen.getByRole("button", { name: "Links" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Zentriert" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rechts" })).toBeInTheDocument();
  });

  it("sets text alignment to center when the center button is clicked", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    render(<Harness editor={editor} />);

    await user.click(screen.getByRole("button", { name: "Zentriert" }));

    await waitFor(() => {
      expect(
        (editor.getAttributes("paragraph") as { textAlign?: string }).textAlign,
      ).toBe("center");
    });
  });

  it("sets text alignment to left when the left button is clicked", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    editor.commands.setTextAlign("right");
    render(<Harness editor={editor} />);

    await user.click(screen.getByRole("button", { name: "Links" }));

    await waitFor(() => {
      expect(
        (editor.getAttributes("paragraph") as { textAlign?: string }).textAlign,
      ).toBe("left");
    });
  });

  it("sets text alignment to right when the right button is clicked", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    render(<Harness editor={editor} />);

    await user.click(screen.getByRole("button", { name: "Rechts" }));

    await waitFor(() => {
      expect(
        (editor.getAttributes("paragraph") as { textAlign?: string }).textAlign,
      ).toBe("right");
    });
  });

  it("marks the current text alignment button as selected", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    render(<Harness editor={editor} />);

    editor.chain().focus().setTextAlign("right").run();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Rechts" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });
  });

  it("uses custom translations for button aria-labels", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    const staticActive: ActiveMarks = {
      bold: false,
      italic: false,
      underline: false,
      bulletList: false,
      orderedList: false,
      link: false,
      fontColor: undefined,
      fontSize: undefined,
      textAlign: undefined,
      imageAlign: undefined,
    };
    render(
      <AlignToggleButtonGroup
        editor={editor}
        active={staticActive}
        translations={{
          left: "Align left",
          center: "Align center",
          right: "Align right",
        }}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Align left" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Align center" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Align right" }),
    ).toBeInTheDocument();
  });
});
