import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { FontColorDropdown } from "../components/FontColorDropdown";
import { renderEditor } from "./render-editor";

afterEach(() => {
  cleanup();
});

describe("FontColorDropdown", () => {
  it("opens the color menu when clicked", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    render(<FontColorDropdown editor={editor} />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByText("Automatisch")).toBeInTheDocument();
    expect(screen.getByText("Schwarz")).toBeInTheDocument();
    expect(screen.getByText("Rot")).toBeInTheDocument();
  });

  it("sets the color when a color menu item is clicked", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    editor.commands.selectAll();
    render(<FontColorDropdown editor={editor} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Rot"));

    await waitFor(() => {
      expect(
        (editor.getAttributes("textStyle") as { color?: string }).color,
      ).toBe("#d32f2f");
    });
  });

  it("unsets the color when 'Automatic' is clicked", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    editor.chain().selectAll().setColor("#d32f2f").run();
    render(<FontColorDropdown editor={editor} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Automatisch"));

    await waitFor(() => {
      expect(
        (editor.getAttributes("textStyle") as { color?: string }).color,
      ).toBeUndefined();
    });
  });

  it("uses custom translations for color labels", async () => {
    const user = userEvent.setup();
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });
    render(
      <FontColorDropdown
        editor={editor}
        translations={{
          tooltip: "Text color",
          automatic: "Auto",
          colors: {
            black: "Black",
            gray: "Gray",
            red: "Red",
            blue: "Blue",
            turquoise: "Turquoise",
            green: "Green",
            orange: "Orange",
            purple: "Purple",
            pink: "Pink",
          },
        }}
      />,
    );

    await user.click(screen.getByRole("button"));

    expect(screen.getByText("Auto")).toBeInTheDocument();
    expect(screen.getByText("Red")).toBeInTheDocument();
  });
});
